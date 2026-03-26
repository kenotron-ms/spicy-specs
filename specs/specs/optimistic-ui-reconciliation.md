---
title: "Optimistic UI with Server Reconciliation"
category: "spec"
spiceLevel: 4
tags: ["optimistic-ui", "react", "state-management", "chat", "zustand", "reconciliation"]
summary: "How to show instant user feedback before server confirmation without creating ghost messages, duplicate entries, or scroll jumps — 12 anti-patterns, 11 invariants, and a reconciliation algorithm that preserves React refs."
created: "2026-03-25"
updated: "2026-03-25"
author: "ken"
antipatterns: 12
invariants: 11
---

## What This Is

Optimistic UI means showing a user's action immediately in the UI — before the server confirms it. For chat, that means the message appears in the conversation the moment you press Send, with a spinner or pending indicator, then silently upgrades to the real message when the server responds.

Done wrong, you get: duplicate messages, ghost messages that never resolve, scroll jumps mid-conversation, and race conditions between the SSE stream and the HTTP response. This spec catalogs every known failure mode and the invariants that prevent them.

---

## Canonical Architecture

```
User sends message
  → (1) Generate temp ID (client-scoped)
  → (2) Append optimistic message to store (status: "pending")
  → (3) POST /messages (fire async)

Server responds
  → (4) Server assigns canonical ID, persists
  → (5) SSE emits message_complete event (canonical ID)
  → (6) HTTP response returns canonical message

Client reconciles
  → (7) mergeHistory() replaces temp entry by tempId
  → (8) Status: "pending" → "sent"
  → (9) Scroll anchor preserved across replace
```

**Two confirmation paths run in parallel — SSE and HTTP response.** The first to arrive wins via `reconcileOptimistic(tempId, canonicalMessage)`. The second is a no-op because the temp ID is already gone.

---

## 12 Anti-Patterns

### Category A: Temp ID Generation (3 bugs)

**A1: Using `Date.now()` as temp ID**

```ts
// ❌ Collision under burst: two messages sent within same ms
const tempId = `optimistic-${Date.now()}`;

// ✅ Scoped prefix + crypto random
const tempId = `opt_${crypto.randomUUID()}`;
```

**A2: Reusing temp ID across retries**

When a POST fails and retries, a new request is issued — but if the temp ID is reused, reconciliation matches on the wrong entry if the first request eventually succeeds.

```ts
// ❌ Reusing the same tempId on retry
await retry(() => postMessage(tempId, content));

// ✅ New tempId per attempt; old optimistic entry replaced by retry entry
const retryTempId = `opt_${crypto.randomUUID()}`;
replaceOptimistic(originalTempId, { ...original, id: retryTempId });
await postMessage(retryTempId, content);
```

**A3: Leaking temp IDs to the server**

If the POST body includes `tempId`, a buggy server might persist it as the canonical ID. Then SSE emits an event with the temp ID, dedup logic incorrectly treats it as already-seen, and the message never upgrades.

The server must assign IDs. The client sends content only.

---

### Category B: Reconciliation Logic (5 bugs)

**B1: Appending server message without removing optimistic**

```ts
// ❌ Creates duplicate: optimistic entry + real entry both visible
onMessageComplete((msg) => {
  appendToHistory(msg);
});

// ✅ Replace temp entry, or no-op if already replaced by HTTP response
onMessageComplete((msg) => {
  reconcileOptimistic(msg.tempId, msg);
});
```

**B2: Reconciling by position instead of by ID**

If any other message arrives via SSE between the optimistic entry and reconciliation, position-based replacement targets the wrong item.

```ts
// ❌ Brittle: assumes optimistic is always last
history[history.length - 1] = canonicalMessage;

// ✅ ID-keyed replace
history.map((m) => (m.id === tempId ? canonicalMessage : m));
```

**B3: Not preserving React object refs during reconcile**

React uses referential equality to decide whether to re-render a list item. If `reconcileOptimistic` creates a new object, every downstream component re-renders and the scroll position may jump.

```ts
// ❌ Creates new object reference → forces full subtree re-render
const updated = history.map((m) =>
  m.id === tempId ? canonicalMessage : m
);

// ✅ Mutate in place via Immer or direct property update
produce(history, (draft) => {
  const idx = draft.findIndex((m) => m.id === tempId);
  if (idx !== -1) Object.assign(draft[idx], canonicalMessage);
});
```

**B4: Race between SSE reconciliation and HTTP reconciliation**

Both paths call `reconcileOptimistic(tempId, msg)`. The second call sees no entry (already reconciled) and no-ops. This is correct — but only if both callers use the same key (`tempId`) and the reconcile function is idempotent.

If one path uses `tempId` and the other uses `canonicalId`, neither matches and you get the optimistic entry stuck as pending forever.

**B5: Clearing pending state before scroll anchor**

```ts
// ❌ Status update triggers re-render before scroll is anchored
setStatus(tempId, "sent");
scrollToBottom();

// ✅ Anchor first
const anchor = captureScrollAnchor();
setStatus(tempId, "sent");
restoreScrollAnchor(anchor);
```

---

### Category C: Failure Handling (4 bugs)

**C1: Showing failure state before retry window**

```ts
// ❌ User sees red "failed" on transient network hiccup
catch (err) {
  setStatus(tempId, "failed");
}

// ✅ Retry up to N times silently, then escalate
catch (err) {
  if (attempt < MAX_RETRIES) scheduleRetry(tempId);
  else setStatus(tempId, "failed");
}
```

**C2: Not cleaning up optimistic entry on permanent failure**

A failed message stuck in "pending" or "failed" state that the user dismisses must be removed from the store. If the SSE stream later emits an event with a matching canonical ID (possible with at-least-once delivery), a zombie reconciliation target exists.

**C3: 4xx treated as retry-able**

4xx means the server rejected the request — retrying will not help. Only retry on network errors and 5xx.

```ts
if (err.status >= 400 && err.status < 500) {
  setStatus(tempId, "failed"); // permanent
} else {
  scheduleRetry(tempId); // may succeed
}
```

**C4: Optimistic message missing required fields**

If the optimistic entry shape diverges from the real message shape (missing `role`, `model`, `timestamp`), components that render the list will throw or render incorrectly for the optimistic duration.

The optimistic entry must be a valid message object with all required fields populated client-side. Fields the server will fill (canonical ID, server timestamp) get placeholder values that reconciliation overwrites.

---

## 11 Invariants

| # | Invariant | Why |
|---|-----------|-----|
| I1 | Temp IDs use `opt_${crypto.randomUUID()}` — never timestamps or indexes | Collision-free across bursts and retries |
| I2 | Temp IDs never sent to the server | Prevents server from persisting a client-generated ID |
| I3 | Reconciliation keyed by `tempId`, not position | Position-based replace breaks when concurrent messages arrive |
| I4 | `reconcileOptimistic` is idempotent | Both SSE and HTTP paths call it; second call must be safe no-op |
| I5 | Optimistic entry shape is a valid message | Downstream renderers must not need to special-case pending messages |
| I6 | Scroll anchor captured before reconcile, restored after | Ref-preserving mutation alone is not enough for all scroll scenarios |
| I7 | SSE dedup checks both temp IDs and canonical IDs | SSE may arrive before HTTP response; must not create duplicate |
| I8 | Failed messages are dismissable and remove their store entry | Prevents ghost entries that can be spuriously reconciled later |
| I9 | Retry only on network errors and 5xx, not 4xx | Server-rejected messages will never succeed on retry |
| I10 | New temp ID generated per retry attempt | Old temp ID may still reconcile from the first attempt's response |
| I11 | Optimistic entry removed on component unmount if still pending | Navigation away must not leave dangling pending entries in global store |

---

## Key Design Decisions

**D1: Single source of truth — the canonical store**

Optimistic entries live in the same array as real messages. There is no separate "pending" list. This simplifies rendering (one loop) and makes reconciliation a simple `map` or `findIndex` + mutate.

**D2: Server assigns canonical IDs, always**

The client generates temp IDs for its own dedup purposes. Canonical IDs come from the server. This means the client must store `tempId` on the optimistic entry and the server must echo it back in the response (or the SSE event must include `tempId` to enable reconciliation).

If SSE events do not include `tempId`, reconciliation must rely on the HTTP response only — SSE events can only be used to update status after the HTTP response has provided the canonical ID.

**D3: Two confirmation paths, first wins**

HTTP response and SSE event both call `reconcileOptimistic`. The implementation must handle the case where either arrives first. The simplest implementation: `reconcileOptimistic` checks if `tempId` exists; if not, it's a no-op.

**D4: Failure state is terminal, not recoverable without user action**

After `MAX_RETRIES`, the message moves to `failed`. The user can tap "Retry" (which creates a new optimistic entry with a new temp ID) or dismiss. The original failed entry is never automatically retried again.

---

## Implementation Fast Path

1. **Store shape** — Add `tempId?: string`, `status: 'pending' | 'sent' | 'failed'` to message type
2. **`addOptimistic(content)`** — Generates temp ID, appends pending entry, returns `tempId`
3. **`reconcileOptimistic(tempId, canonical)`** — Finds by `tempId`, mutates in place, returns `false` if not found
4. **`failOptimistic(tempId)`** — Sets status to `failed`, increments retry count
5. **`removeOptimistic(tempId)`** — Removes entry (dismiss or unmount cleanup)
6. **POST handler** — Calls `addOptimistic`, fires request, calls `reconcileOptimistic` on success or `failOptimistic` on error
7. **SSE handler** — In `message_complete` handler, call `reconcileOptimistic(event.tempId, event.message)` if `event.tempId` present
8. **Scroll anchor** — Wrap reconcile calls with `captureScrollAnchor` / `restoreScrollAnchor`
9. **Cleanup** — In `useEffect` return, call `removeOptimistic` for any still-pending entries

---

## Fragility Areas

- 🔴 **HIGH:** Server must echo `tempId` in SSE event for two-path reconciliation to work. If server does not support this, SSE-based reconciliation is impossible and the HTTP path must be the sole reconciliation source.
- 🔴 **HIGH:** At-least-once SSE delivery can cause reconciliation to run twice. Must be idempotent.
- 🟡 **MEDIUM:** `crypto.randomUUID()` not available in all environments (older Safari, non-secure contexts). Polyfill or fallback needed.
- 🟡 **MEDIUM:** Ref-preserving mutation requires Immer or careful structuredClone avoidance. Easy to introduce object churn if unfamiliar with Zustand mutation patterns.
- 🟢 **LOW:** Optimistic messages need placeholder values for server-only fields (e.g., token counts, model name). These render as empty/zero until reconciled — usually acceptable.

---

## Relation to Chat SSE Streaming

This spec pairs with [Chat Streaming with SSE](/e/specs/chat-streaming-sse). The SSE spec's `mergeHistory()` function is the reconciliation engine described in I3–I6 here. Invariant I4 (idempotent `clearSSEEvents` after `setConversationHistory`) maps to D3 here. The `serverMessageId` pre-generation in the SSE spec (invariant I2 there) is the `tempId` echo mechanism described in D2 here.
