# Spicy Specs — Product Vision

> *"A technical pattern library that looks like it was bottled in 1887."*

---

## The Problem

Every developer team has a body of hard-won knowledge that exists nowhere but inside
a few people's heads.

Not in the docs. Not in the codebase. Not on Stack Overflow. In *someone's memory*,
waiting to be forgotten when they leave, rediscovered the expensive way by the next
person who hits the same wall.

### A Story You've Lived

A team builds a chat UI. Someone wires up the SSE streaming request inside a React
render cycle — exactly the way every tutorial shows it. The app ships. It works, mostly.

Then comes the bug: when a user switches between chat sessions, the stream dies. The
connection was tied to a component's lifecycle, and when that component unmounts, the
handle is gone. The AI keeps generating; the client stops listening.

This bug is *everywhere*. It exists in a thousand codebases. It appears in training
data for every major LLM. Every blog post, every YouTube tutorial, every Stack Overflow
answer that shows SSE streaming in React does it wrong in exactly this way.

So the next team hits it. And the team after that. Months of collective engineering time
burned on a bug that already has a known fix: **hold the connection handle outside the
component lifecycle, in a global store or service layer, so it survives route changes.**

That fix exists nowhere searchable. The person who figured it out wrote it in a Slack
message in 2023 and moved on.

---

## What Spicy Specs Is

Spicy Specs is a **curated, versioned library of engineering specifications, patterns,
and anti-patterns** — purpose-built to be consumed by both humans and AI agents.

Each entry is a *spec*: a dense, opinionated, battle-tested document that tells you
not just what to do, but **why the common approaches are wrong**, what invariants you
must never violate, and what a correct implementation actually looks like.

The first flagship spec, `chat-streaming-sse`, catalogs **19 anti-patterns** and
**13 invariants** for SSE-based chat streaming — the kind of document that would have
saved every team that ever lost a connection handle. It's the kind of document that
*should* exist for every hard-won engineering lesson, but almost never does.

---

## Why Now

The AI coding era has changed the calculus.

A skilled developer with AI assistance can now build in a day what used to take a week.
But that velocity multiplier applies equally to building things **correctly** and
building things **incorrectly at scale**. Vibe-coding produces vibe-bugs.

Worse: **the anti-patterns have been baked into model weights**. The same wrong SSE
tutorial that poisoned a thousand human developers is now part of GPT-4's training data.
Models confidently reproduce the mistakes because the mistakes are the majority of the
corpus.

The antidote isn't a better prompt. It's a better source of truth — one that's
authoritative, structured, and accessible to AI agents directly, not just humans reading
a web page.

---

## The Core Insight: Dual Consumption

Every Spicy Spec entry lives at two URLs:

```
https://spicy-specs.com/e/chat-streaming-sse         ← rendered for humans
https://spicy-specs.com/e/chat-streaming-sse.md       ← raw markdown for agents
```

The `.md` URL is a static file served from CDN edge with no latency overhead. An AI
agent can fetch it, drop it in a system prompt, and immediately get 19 anti-patterns
worth of context that no amount of retrieval-augmented generation over StackOverflow
could reconstruct.

This is the design bet: **the format of the spec *is* the product**. Not a wiki. Not a
blog. A structured, machine-readable document with a defined schema:

- **Architecture** — the conceptual model
- **Design Decisions** — the choices made and why
- **Anti-Pattern Registry** — cataloged, numbered, cross-referenced
- **Invariants** — the things that must always be true
- **Implementation Fast Path** — the minimal correct starting point
- **Fragility Areas** — where future changes are likely to break things

This structure is consistent across every spec. An agent learns the schema once; then
every spec in the library is navigable.

---

## Access Modes

**For humans:** A static site (spicy-specs.com) with a browsable library, semantic
search, and a visual design that actually makes you want to read dense technical
documentation. The 1880s hot sauce label aesthetic isn't a joke — it's a mnemonic device.
*You remember the hot sauce bottle.* You don't remember the gray Bootstrap docs site.

**For AI agents:** Three access modes with increasing structure:

1. **Direct fetch by slug** — `curl https://spicy-specs.com/e/chat-streaming-sse.md`  
   Zero roundtrips. Drop it in a system prompt. It works.

2. **Semantic search API** — `GET /api/search?q=SSE+connection+lost`  
   Returns compact JSON: slug, title, summary, relevance score.  
   The agent finds the right spec; then fetches it directly.

3. **CLI + MCP server** — `npx spicy-specs get chat-streaming-sse`  
   Or via the MCP protocol for AI editors: three tools (`search_specs`, `get_spec`,
   `list_specs`), with a `--section` flag so agents can pull just the invariants
   table from a large spec without consuming the full token budget.

---

## The Heat System

Every spec has a **spice level** — a number from 0 to 5 that represents how battle-tested
and community-validated it is. Specs start at their author's stated level. Community
voting ("add sauce") changes it over time.

This isn't just a rating. It's a signal: a spiceLevel 5 spec like `chat-streaming-sse`
has been through the fire. Teams have tried to violate its invariants and failed. The
anti-patterns aren't theoretical — they're the corpses of real bugs. A spiceLevel 1
spec is a thoughtful starting point that hasn't been stress-tested yet.

The heat system is also the feedback loop. When an agent cites a spec and the
resulting code works, that's signal. When a team follows an invariant and avoids the
anti-pattern, that's signal too. The library gets hotter where it's right.

---

## The Roadmap: From Library to Network

### Phase 1 — The Library (current)
A curated library of high-quality specs, accessible to humans and AI agents.  
Core format established. Semantic search. CLI. MCP server. Anonymous voting.

*Goal: Prove the format works. The SSE spec is the north star.*

### Phase 2 — Identity
GitHub OAuth for contributors. Specs become attributable.  
*"This anti-pattern list was written by someone who has shipped 12 production chat UIs."*

### Phase 3 — Community Annotations
PHP.net-style community notes on every spec. Every invariant. Every anti-pattern.  
*"I hit A3 (the disconnection anti-pattern) in production. Here's what the failure looked like in our monitoring. Here's the commit that fixed it."*  
Comments are the field reports. The spec is the doctrine.

### Phase 4 — LLM Moderation
Community comments pass through an LLM quality filter before being surfaced.  
Not gatekeeping — *ranking*. Comments that add information, confirm an invariant, or
document a novel failure mode float up. Comments that repeat the spec or add noise sink.  
Two heat scores emerge: **Human Sauce** (community voting) and **LLM Sauce** (comment
quality signal from the model).

### Phase 5 — Reputation
Reputation flows from the accuracy of your contributions. Annotators who correctly
identify violations, authors whose invariants hold up under scrutiny, commenters whose
field reports get confirmed by others — all build reputation.  
Reputation-weighted voting means a contribution from someone who has documented 50
accurate failure modes carries more signal than an anonymous thumbs up.

### Phase 6 — The Exchange
The reputation system enables trading. Teams can publish specs from their internal
libraries and exchange with other teams. The mechanism for discovering high-quality
private specs becomes the mechanism for discovering public ones.  
The library becomes a *network*.

---

## Why This Is the Right Replacement for Stack Overflow

Stack Overflow worked for an era when the bottleneck was *finding the answer*.  
Search + community voting + accepted answers was the right architecture for that era.

The LLM era has a different bottleneck: **the quality and structure of what gets into
the model context**. A wall of StackOverflow answers, each representing a slightly
different problem from a slightly different year, is noisy training data and noisy
retrieval. The model averages across them and produces the average of the mistakes.

What the LLM era needs is **opinionated, structured, adversarially-hardened knowledge**
— docs that don't just answer "how do I do X" but answer "what are the 19 ways people
do X wrong, and what are the 13 things that must always be true." Knowledge that doesn't
just teach the happy path but *burns the wrong paths out of the model's context*.

Spicy Specs is the editorial layer on top of engineering knowledge that the LLM era
needs. Not a wiki. Not a discussion forum. A library of *canonical specifications*,
maintained with the rigor of a standards body and the heat of a community that has
actually shipped the thing.

---

## The Brand Promise

The hot sauce label is a commitment:  
**We will never publish something mild.**

Every entry in the Spicy Specs library is hot because someone got burned. The anti-patterns
are real bugs from real production systems. The invariants are the things that, if you
violate them, you will be paged at 2am. The heat score is earned, not assigned.

The goal is not to be comprehensive. The goal is to be *indispensable* — the first place
a developer or an AI agent looks when they're about to build something where the known
failure modes are already cataloged and the correct path is documented.

A library worth carrying, whether you're a human opening a browser or an agent building
a context window.

---

*→ Browse the library: [spicy-specs.com](https://spicy-specs.com)*  
*→ Get a spec in your agent: `npx spicy-specs get chat-streaming-sse`*  
*→ Fetch raw markdown: `curl https://spicy-specs.com/e/chat-streaming-sse.md`*
