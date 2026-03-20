# Asset Inventory — spec-entry

Screen: SPICY SPECS — Chat Streaming with SSE

---

## Icons

| Name | Description | Library | Component | Size |
|------|-------------|---------|-----------|------|
| flowchart-arrow | Solid rightward arrowhead — simple right-pointing arrow shape | lucide: `arrow-right` | ArchArrow1–ArchArrow4 | 12×8px |
| diamond-divider | Small solid diamond/rhombus shape — endpoints on section divider lines | lucide: `diamond` | ArchSectionDividerLine, DesignSectionDivider, InvariantsSectionDivider, AntiPatternSectionDivider | 8×8px |

**Note:** Both icons use Lucide SVG components with `stroke="currentColor"` for CSS color control. Use `color-text-secondary` (#5A4236) token for default state.

---

## Images

| Name | Type | Dimensions | Aspect Ratio | Content Description | File |
|------|------|------------|--------------|---------------------|------|
| chili-pepper-icon | icon-image | 48×24px | 2:1 | Stylized chili pepper silhouette — curved elongated body, pointed tip right, small stem left; white (#FFFFFF) fill, transparent background | assets/chili-pepper-icon.png |
| ornate-filigree-header | illustration | 600×80px | 15:2 | Symmetrical Victorian/steampunk gold scroll-work — bilateral swirling vine-and-leaf filigree flanking central diamond logo; gold (#EAD69A) strokes, transparent background | assets/ornate-filigree-header.png |

---

## Backgrounds

| Name | Type | Value | File |
|------|------|-------|------|
| sepia-paper-texture | image | Aged warm-cream parchment texture, base color #F3E9D9, paper fiber detail | assets/sepia-paper-texture.png |
| color-background-banner | solid | #963434 — dark crimson red | — |
| color-background-panel | solid | #3E2B22 — dark espresso brown | — |
| color-background-table-cell | solid | #F3E9D9 — sepia cream (matches screen bg) | — |
| color-background-section-header | solid | #3E2B22 — dark espresso brown | — |
| color-badge-high | solid | #E8AFAF — muted rose red | — |
| color-badge-medium | solid | #EAD69A — muted amber gold | — |
| color-badge-low | solid | #B7D1B5 — muted sage green | — |

---

## Usage Notes

- **chili-pepper-icon** is used in two contexts: inside `DiamondLogo` at ~24×12px display size, and repeated ×5 in `ChiliRatingIcon` row at ~16×8px display size. Generate from the same asset scaled appropriately.
- **ornate-filigree-header** is positioned symmetrically in `BrandingHeader`, centered on both sides of the `DiamondLogo`.
- **sepia-paper-texture** tiles or covers `SpecEntryScreen` as the root background. The CSS fallback is `background-color: #F3E9D9`.
- **flowchart-arrow** and **diamond-divider** are Lucide SVG icons — fetch from:
  - Arrow: `https://raw.githubusercontent.com/lucide-icons/lucide/main/icons/arrow-right.svg`
  - Diamond: `https://raw.githubusercontent.com/lucide-icons/lucide/main/icons/diamond.svg`
