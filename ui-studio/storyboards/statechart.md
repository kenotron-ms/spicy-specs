# State Chart — Spicy Specs

> Auto-generated via backward-compatibility rule: no statechart.md existed; 5 blueprints present with flat routing, no overlays.

## Screen Classification

| Screen | Type | Route | Description |
|--------|------|-------|-------------|
| library | route | `/` | Main screen — hot sauce spec card grid |
| reference-entry | route | `/reference-entry` | Single reference app detail view |
| spec-entry | route | `/spec-entry` | Single spec detail view |
| search-results | route | `/search-results` | Search results list |
| community-notes | route | `/community-notes` | Community notes and form |

## Transitions

| From | To | Trigger | Type |
|------|----|---------|------|
| library | spec-entry | tap card (SPEC type) | push |
| library | reference-entry | tap card (REFERENCE APP type) | push |
| library | search-results | tap search input / enter query | push |
| spec-entry | community-notes | tap "community notes" link | push |
| search-results | spec-entry | tap result row | push |
| search-results | reference-entry | tap result row | push |
| * | library | tap back / home | pop |

## Routing Strategy

- **Type:** flat / stack-only
- **No tab navigation** — no persistent nav bar
- **No overlays** — all transitions are full-screen pushes
- **Initial route:** `/` (library)
