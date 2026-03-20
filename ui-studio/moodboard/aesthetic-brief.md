# spicy-specs.com Aesthetic Brief
> Updated: 2026-03-19 — v2 Hot Sauce Label Direction

## Positioning
"A technical pattern library that looks like it was bottled in 1887." Vintage hot sauce label design language applied to developer documentation. The tension between ancient Tabasco-style label design and modern dev terminology (SSE, anti-patterns, invariants) is **intentional** — it's the joke that makes the brand memorable. Confident, opinionated, premium. Like finding a really well-designed hot sauce at a specialty grocery store next to the craft beers.

---

## Color System

The palette is grounded, earthy, and intentionally aged. No neon. No synthetic colors. Two dominant "variety" colors — red and green — on a cream paper canvas, exactly like a hot sauce brand with multiple flavors.

### Primary Palette
| Token | Value | Name | Role |
|-------|-------|------|------|
| `color-canvas` | `#F5EDD5` | Aged Paper | The foundation — warm cream parchment, not white |
| `color-red` | `#8B1A1A` | Original Red | Primary brand color — bold, brick, intense |
| `color-green` | `#1E4D20` | Green Sauce | Second variety — herbal, organic, grounding |
| `color-ink` | `#1A1208` | Ink | Near-black — warm charcoal, like letterpress ink |

### Accent Palette
| Token | Value | Name | Role |
|-------|-------|------|------|
| `color-gold` | `#C8962E` | Gold Reserve | Premium, aged — for reference-app entries |
| `color-chipotle` | `#D4842A` | Chipotle | Smoky amber — for pattern entries |
| `color-sage` | `#7A9E7E` | Mild Green | Muted green — for philosophy entries |
| `color-habanero` | `#C43B0A` | Habanero | Hotter orange-red — for critical severity |

### Entry Type → Variety Color Mapping
| Type | Color | "Variety" Label |
|------|-------|----------------|
| spec | Original Red `#8B1A1A` | ORIGINAL RED VARIETY |
| anti-pattern | Green Sauce `#1E4D20` | GREEN SAUCE VARIETY |
| reference-app | Gold Reserve `#C8962E` | RESERVE VARIETY |
| pattern | Chipotle `#D4842A` | CHIPOTLE VARIETY |
| philosophy | Ink `#1A1208` | BLACK LABEL VARIETY |

---

## Typography

The intentional contrast: ancient label typography for display + modern monospace for technical content.

| Use | Font | Weight | Notes |
|-----|------|--------|-------|
| Headlines / Wordmark | Playfair Display (or similar old-style serif) | Black (900) | Slightly condensed, all caps — feels letterpress-stamped |
| Variety labels / Section markers | Vintage serif | Regular, small tracked all-caps | Like "PRODUCT OF AVERY ISLAND" on real Tabasco |
| Body / UI text | Inter | Regular (400), Medium (500) | Clean fallback for readability |
| Code / URLs / Technical content | JetBrains Mono | Regular | THE ONLY MODERN ELEMENT — the contrast is the point |

**Key rule:** Technical content (URLs, slugs, stat numbers, file paths) is ALWAYS JetBrains Mono. It creates the central design tension — ancient label + modern code.

**URL treatment:** `spicy-specs.com/e/chat-streaming-sse.md` rendered in JetBrains Mono, tiny, stamped like a product code: `PRODUCT CODE: spicy-specs.com/e/...`

---

## Brand Mark

**Form 1 — Full lockup (primary):**
`SPICY` [🌶] `-SPECS`
- "SPICY" in display serif, Original Red `#8B1A1A`
- 🌶 chili pepper icon at cap height
- "-SPECS" in display serif, Bottle Green `#1E4D20`
- All caps, tightly tracked

**Form 2 — Label header (nav bar):**
"SPICY-SPECS" in display serif inside or above a thin diamond border frame — the Tabasco diamond shape.

**Form 3 — Compact (favicon):**
Just 🌶 in a small diamond badge — the brand hallmark.

---

## Visual Design Language

### Diamond Badge System
Entry types are **diamond/shield badge shapes** — exactly like hot sauce variety labels.

```
◇ SPEC          — red diamond, cream text
◇ ANTI-PATTERN  — green diamond, cream text
◇ REFERENCE APP — gold diamond, cream text
◇ PATTERN       — amber diamond, cream text
◇ PHILOSOPHY    — charcoal diamond, cream text
```

### Label Anatomy (Entry Cards)
Each card follows vintage label structure:

1. **Variety header bar** — thin colored stripe across top: "ORIGINAL RED VARIETY" or "GREEN SAUCE VARIETY" in tiny tracked cream type
2. **Ornamental border** — thin diamond/rectangular ornament frame around the card
3. **Entry title** — display serif, all caps, in the variety color
4. **Ornamental rule** — thin decorative divider (◆ or —)
5. **Spec details** — small text: "19 ANTI-PATTERNS DOCUMENTED · 13 INVARIANTS"
6. **Product code** — JetBrains Mono, tiny: `PRODUCT CODE: spicy-specs.com/e/...`
7. **Heat rating** — 🌶🌶🌶🌶🌶 icons showing severity count

### Agent Fetch URL Box
Dark panel (`#1A1208` ink background) with cream monospace text.
Styled like a stamped product code panel on the bottom of a label.
Left border: 4px in the entry's variety color (red for spec, green for anti-pattern).
Text: `PRODUCT CODE:` in tiny tracked serif, then the URL in JetBrains Mono cream.

### Section Markers
Thin ornamental rule + section label in small tracked all-caps serif + thin ornamental rule.
Example: `— ◆ — ARCHITECTURE — ◆ —`

### Texture & Print Feel
- Subtle paper grain texture throughout (risograph/letterpress aesthetic)
- Very slight imperfection in text edges — ink absorbed into paper, not flat digital
- Green and red may have 1-2px misregistration for authenticity
- Colors feel printed, not rendered

---

## Layout Principles

1. **Nav bar is the label header.** Wordmark inside a thin diamond frame on aged cream. Never on white or dark backgrounds.
2. **Cards are product labels.** Each card is a self-contained label panel with variety color, ornamental border, and product code footer.
3. **Agent URL = product code.** A stamp at the bottom of the label — technical, precise, monospace.
4. **Severity = heat rating.** 🌶 icons for count, HIGH/MEDIUM/LOW as text in heat colors (habanero red, chipotle amber, sage green).
5. **Two-color per card.** Each card leans on ONE variety color + ink + cream. Don't mix varieties within one card.

---

## The Intentional Tension

The design works *because* of the clash between:
- **Ancient** — 1880s apothecary/hot sauce label aesthetic, letterpress typography, filigree ornaments, aged cream paper
- **Modern** — `chat-streaming-sse.md`, `19 anti-patterns`, `npx spicy-specs get`, JetBrains Mono

This is not a mistake to be resolved. It is the brand. A spec library that looks like it was bottled in a Louisiana factory and exported to the internet.

---

## What This Is NOT
- Not a generic developer docs site
- Not dark mode by default
- Not the previous "Context7 clean + orange accent" direction — fully replaced
- Not rounded-corner card shadows — vintage labels have ornamental borders, not drop shadows
- Not pill-shaped badges — diamond shapes only
