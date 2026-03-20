# Asset Inventory — community-notes

## Icons

All icons sourced from Lucide icon library (https://lucide.dev/).

| Name | Description | Library | Component | Size |
|------|-------------|---------|-----------|------|
| icon-arrow-right | Simple right-pointing arrow (→) | Lucide | `ArrowRight` | 20px |
| icon-arrow-left | Simple left-pointing arrow (←) | Lucide | `ArrowLeft` | 20px |
| icon-chevron-down | Downward-pointing chevron (v) | Lucide | `ChevronDown` | 16px |

> **Note:** Section title arrows (→ INVARIANTS ←) may be rendered as Unicode text characters (→ / ←) rather than SVG icons — check with forge for the implementation approach that best matches the design.

---

## Decorative & Illustration Assets

| Name | Type | Dimensions | Description | Role | File |
|------|------|------------|-------------|------|------|
| header-ornate-banner | decorative | 800×200px | Deep red (#7B2B22) horizontal banner with ornate Victorian filigree scrollwork on left and right sides; centered diamond-shaped emblem with textured border containing arched "SPICY" text, a stylized chili pepper illustration, and arched "SPECS" text below | App header / branding element | assets/header-ornate-banner.png |
| bottom-decorative-border | decorative | 800×60px | Narrow horizontal strip matching the header's dark red color with ornate scrollwork/flourish pattern running full width | Bottom border / footer decoration | assets/bottom-decorative-border.png |
| button-corner-decoration | decorative | 120×60px | Small ornate scrollwork curls for the lower-left and lower-right corners of the Submit Note button; warm cream/gold color suitable for placement on dark red background | Submit button decorative embellishment | assets/button-corner-decoration.png |
| chili-icon-full | icon | 64×64px | Solid red (#B03025) chili pepper icon — elongated slightly curved body tapering to a point at base, short curved stem at top | Rating indicator (filled / active state) | assets/chili-icon-full.png |
| chili-icon-empty | icon | 64×64px | Outlined chili pepper icon (dark brown stroke, ~#3E2A2A, transparent fill) — same shape as chili-icon-full | Rating indicator (empty / inactive state) | assets/chili-icon-empty.png |

---

## Backgrounds

| Name | Type | Value | File |
|------|------|-------|------|
| screen-background | image-texture | Aged parchment — warm beige (#F0E6C8) with subtle paper grain texture and tonal variations | assets/main-background-texture.png |
| header-background | solid | #7B2B22 | — |
| card-background | solid | #F8F0E0 | — |
| input-background | solid | #E8D8B8 | — |
| table-header-background | solid | #E0D0B0 | — |

---

## Component Spec Asset Aliases

These are the asset references used in `component-spec.md`. Each maps to a generated file or runtime-composed state.

| Spec Reference | Resolves To | Notes |
|---------------|-------------|-------|
| `top-decorative-border` | assets/header-ornate-banner.png | Topmost decorative strip; visually part of the full banner asset |
| `banner-scrollwork` | assets/header-ornate-banner.png | Left/right scrollwork flourishes within the banner |
| `emblem-diamond-frame` | assets/header-ornate-banner.png | Diamond emblem shape; contained within header-ornate-banner |
| `chili-illustration-header` | assets/header-ornate-banner.png | Chili pepper inside diamond emblem; contained within header-ornate-banner |
| `note-card-bubble-tail` | CSS only | Speech bubble tail on NoteCard — render as CSS `::after` pseudo-element border triangle |
| `button-decorative-corners` | assets/button-corner-decoration.png | Ornate corner curls for Submit button |
| `chili-rating-5-filled` | Composite: 5× chili-icon-full | See Rating Composite States below |
| `chili-rating-4-filled-1-empty` | Composite: 4× chili-icon-full + 1× chili-icon-empty | See Rating Composite States below |
| `chili-rating-3-filled-2-empty` | Composite: 3× chili-icon-full + 2× chili-icon-empty | See Rating Composite States below |

---

## Rating Composite States

These are runtime-composed states built from `chili-icon-full` and `chili-icon-empty` repeated in sequence.

| Name | Filled | Empty | Used In |
|------|--------|-------|---------|
| chili-rating-5-filled | 5 | 0 | NoteCard1Rating |
| chili-rating-4-filled-1-empty | 4 | 1 | NoteCard2Rating |
| chili-rating-3-filled-2-empty | 3 | 2 | NoteCard3Rating, HeatRatingDropdown (default) |
