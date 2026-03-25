---
title: "Chat Streaming with SSE"
category: "spec"
spiceLevel: 5
tags: ["sse", "streaming", "chat", "server-sent-events", "real-time", "pub-sub", "react", "zustand"]
summary: "Canonical SSE chat streaming architecture — 19 catalogued anti-patterns, 13 invariants, and a phased implementation fast path. Written for agents implementing or modifying chat streaming systems."
created: "2026-03-19"
updated: "2026-03-25"
author: "ken"
---

## Canonical Architecture

Three layers working in concert:

```
Backend                        Browser                        Frontend
───────────────────────────    ───────────────────────────    ───────────────────
ProjectEventBus (pub/sub)  →   EventSource (native)       →   Zustand store
  circular buffer (100)        Module-level registry           dedup by messageId
  Last-Event-ID replay         survives unmounts               mergeHistory()
                                                               deferred SSE clear
```

**SSE endpoint:** `GET /projects/:id/stream` — opens on mount, not on execution start. Supports `Last-Event-ID` replay from the circular buffer.

**Agent integration:** Backend runs `agent.run()` which emits events into the `ProjectEventBus`. The bus fans out to all open SSE channels for the project.

**Key invariant:** `ensureChannel()` must be called BEFORE `agent.run()`. The first event is lost otherwise.

---

## 19 Anti-Patterns

### Category A: SSE Connection Lifecycle (7 bugs)

**A1: Execution-gated SSE** — Opening the EventSource only when execution starts creates a window where early events are lost.

```ts
// ❌ Race condition: first events fire before client connects
onSendMessage(() => openSSE());

// ✅ Always-on: open on mount, never close mid-stream
useEffect(() => { openSSE(); return () => closeSSE(); }, [projectId]);
```

**A2: Events before reconnection** — After a reconnect, the SSE handler fires before the `Last-Event-ID` replay has been requested, so replayed events hit stale state.

Fix: Reset `eventsReceived` to `0` inside the `onopen` handler, not outside it.

**A3: `reconnect()` closing mid-stream** — Calling `reconnect()` after a POST starts tears down the active channel, dropping in-flight events.

Fix: Never call `reconnect()` after initiating execution. The native EventSource reconnects automatically on connection drop.

**A4: Wrong SSE gate logic** — Gating execution on `isConnected` instead of `readyState === EventSource.OPEN` causes false positives in reconnecting state.

**A5: No buffer on reconnect** — Without the circular buffer + `Last-Event-ID`, events during the reconnect window are permanently lost.

Fix: 100-event circular buffer on the backend; always send `id:` on every SSE event; read `Last-Event-ID` header (handle array form — see I13).

**A6: Channel destroyed immediately** — Destroying the pub/sub channel immediately after `agent.run()` completes drops events that are still in-flight through the event loop.

Fix: 10-second grace period before channel teardown.

**A7: Manual reconnect loop** — Writing a custom reconnect loop (`setInterval`, `setTimeout`) conflicts with the browser's native exponential backoff and causes double-connection races.

Fix: Let native EventSource handle reconnects. Only override if you need custom backoff.

---

### Category B: Message Sync & Dedup (5 bugs)

**B1: Scroll jump on completion** — Calling `clearSSEEvents()` before `setConversationHistory()` causes a blank-frame flash and scroll reset.

```ts
// ❌ Blank frame between clear and history load
clearSSEEvents();
await loadHistory();

// ✅ Deferred clear: load first, then clear
await loadHistory();
clearSSEEvents();
```

**B2: Client-side message ID invention** — Generating `messageId` on the client (`Date.now()`, `Math.random()`) creates IDs that can't be matched against server SSE events.

Fix: Server pre-generates a UUID and sends it in the initial `message_start` event and again in `message_complete`. The client uses this ID for all dedup.

**B3: `eventsLength` hardcoded** — Passing `eventsLength` as a prop that's captured at render time means history-load gates never fire correctly as the conversation grows.

Fix: Read `eventsLength` from the Zustand store inside the hook, not from props.

**B4: Terminal events excluded from scan** — Scanning only `text_delta` events to find in-progress messages misses `tool_use` and `thinking` blocks.

Fix: Scan all event types in `getCurrentMessageEvents()`.

**B5: Optimistic message re-append** — On history load after SSE stream, naively replacing history appends the optimistic entry again if `messageId` matching isn't exact.

Fix: `mergeHistory()` matches by `messageId` and preserves existing refs for already-seen messages.

---

### Category C: Event Quality (2 bugs)

**C1: Tool call mismatch** — Some agent implementations emit `tool_use_start` without a corresponding `tool_use_end` (e.g., when using streaming tool call patterns).

Fix: Double-start pattern — if a second `tool_use_start` for the same `toolId` arrives, the first is implicitly complete. Track `emittedToolIds` Set to detect this.

**C2: Reasoning block duplication** — Appending each `thinking_delta` to a new block instead of finding and extending the in-progress block creates N reasoning blocks instead of one.

Fix: Search backwards from the tail of `currentEvents` for the most recent incomplete `thinking` block. Extend it in place.

---

### Category D: State Management (5 bugs)

**D1: Status dots never stop pulsing** — Rendering the "thinking" indicator based on `isExecuting` without checking `isComplete` causes it to stay visible after stream end.

Fix: Gate on `isExecuting && !isComplete`.

**D2: Auto-naming infinite retries** — Using truthiness check (`if (!title)`) to gate auto-name triggers on empty string, causing repeated rename calls.

Fix: Use `if (title !== undefined)` — only skip if the field hasn't been set yet.

**D3: EventEmitter listener warnings** — Creating a new listener per execution without removing old ones triggers Node's "possible EventEmitter memory leak" warning at 10+ concurrent executions.

Fix: `eventBus.setMaxListeners(0)` or always remove listeners in cleanup.

**D4: Dead code from destructive refactor** — After refactoring message assembly from client to server, old client-side assembly code remains and runs in parallel, corrupting state.

Fix: Delete the old code paths completely. If it can't be deleted safely, it wasn't isolated.

**D5: Missing `projectId` guard** — SSE hooks firing before `projectId` is available attempt to open connections to `undefined` endpoints, producing cryptic 404s.

Fix: `if (!projectId) return;` at the top of the hook's effect.

---

## 13 Invariants

| # | Invariant | Why |
|---|-----------|-----|
| I1 | `ensureChannel()` BEFORE `agent.run()` | First event lost if missing |
| I2 | `serverMessageId` pre-generated, in `start` AND `complete` | Client dedup depends on canonical IDs |
| I3 | SSE opens on mount, not execution start | No window for event loss |
| I4 | `clearSSEEvents()` AFTER `setConversationHistory()` | Prevents blank frame |
| I5 | `mergeHistory()` preserves refs by messageId | Prevents scroll jumps |
| I6 | `removeAllListeners()` NEVER on running agent | Kills in-flight events |
| I7 | `text_delta_accumulated` updated in-place | Prevents O(n²) string growth |
| I8 | Tool completion: `status === 'end'` AND `success !== undefined` | Handles both agent patterns |
| I9 | `eventsLength` from store, never prop | Prop is pinned to initial render |
| I10 | History load on `eventsLength === 0` gated on `!isExecuting` | Prevents race with active stream |
| I11 | Reasoning search backwards from tail | Text deltas interleave with thinking blocks |
| I12 | Empty string check: `!== undefined` not truthiness | Tool-only responses have empty text |
| I13 | `Last-Event-ID` header: handle array form | Proxies (nginx, Cloudflare) duplicate the header |

---

## Key Design Decisions

**D1: Always-on SSE** — The connection opens when the component mounts, not when execution starts. This eliminates the race between "start execution" and "events arrive." Cost: one persistent connection per open project tab.

**D2: Server-authoritative IDs** — The server pre-generates a UUID before calling `agent.run()`, injects it into the first SSE event, and echoes it in the terminal event. The client never invents IDs.

**D3: Deferred SSE clear** — `clearSSEEvents()` is called after `setConversationHistory()` completes, not before. This prevents the blank-frame flash between SSE clear and history load.

**D4: Reference-preserving merge** — `mergeHistory()` uses `Object.assign(existing, incoming)` (or Immer `Object.assign(draft[idx], ...)`) to preserve object references for messages already in the list, preventing React from remounting list items and resetting scroll.

**D5: Circular buffer + grace period** — 100-event buffer enables reconnect replay. 10-second grace period before channel teardown ensures in-flight events reach the client.

**D6: Module-level EventSource registry** — `Map<projectId, EventSource>` at module scope (not component state) survives component unmount/remount cycles. Prevents double-open on StrictMode double-effects.

**D7: Ensure channel first** — The backend pub/sub channel for a project must exist before the agent emits its first event. `ensureChannel(projectId)` is synchronous and idempotent.

**D8: Unified tool completion** — Two patterns exist (streaming tool calls emit `end` event; non-streaming emit `success`). The double-start pattern handles both: when a second `tool_use_start` for the same `toolId` arrives, the first is considered complete.

---

## Implementation Fast Path

1. **Backend event bus** — `ProjectEventBus` with `emit(projectId, event)`, `subscribe(projectId, handler)`, circular buffer, `Last-Event-ID` replay
2. **SSE endpoint** — `GET /projects/:id/stream`, sets SSE headers, reads `Last-Event-ID`, calls `subscribe`, writes events with `id:` field
3. **Agent integration** — `ensureChannel(projectId)` → `agent.run(...)` → events flow through bus to SSE
4. **Frontend SSE client** — `useGlobalSSE(projectId)` hook, module-level registry, reconnect handled natively
5. **History fetch + deferred clear** — `useEffect` on `eventsLength === 0 && !isExecuting`, calls `setConversationHistory` then `clearSSEEvents`
6. **Terminal render + dedup** — `mergeHistory()`, backwards search for reasoning blocks, double-start tool detection
7. **Execution indicators** — Gate on `isExecuting && !isComplete`, `title !== undefined` auto-name guard

---

## Fragility Areas

- 🔴 **HIGH:** Dual tool completion signals — fallback logic for `status === 'end'` vs `success !== undefined` is brittle if either agent SDK changes its event shape
- 🔴 **HIGH:** JWT in SSE URL — EventSource doesn't support custom headers, so auth tokens must be in the query string or cookie. Query string tokens are visible in server logs
- 🟡 **MEDIUM:** Terminal events have no replay — if the client misses the `message_complete` event and reconnects, it can't recover terminal state from the buffer alone
- 🟡 **MEDIUM:** `addRawListener` lifetime leak — listeners added directly to the event emitter (vs `subscribe`) bypass cleanup
- 🟡 **MEDIUM:** History load gate dependency — the `!isExecuting` gate prevents stale loads but also delays history restore if execution state is wrong

---

## Relation to Optimistic UI

See [Optimistic UI with Server Reconciliation](/e/optimistic-ui-reconciliation). The `mergeHistory()` function (I5 here) is the reconciliation engine that prevents duplicate entries when SSE events and HTTP history responses arrive in undefined order. The `serverMessageId` pre-generation (I2 here) is the `tempId` echo mechanism required for two-path reconciliation.
