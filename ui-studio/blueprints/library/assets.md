# Asset Inventory — Library Screen

## Icons

| Name | Description | Library | Component | Size |
|------|-------------|---------|-----------|------|
| icon-search | Magnifying glass — circle with diagonal handle extending bottom-right | Lucide `search` | SearchIcon | 16×16px |
| chili-rating-icon-filled | Solid filled chili pepper silhouette — curved body, pointed tip, small stem/leaf at top | Generate (custom) | Card*HeatIcon (filled state) | 20×20px |
| chili-rating-icon-outline | Outline-only chili pepper silhouette — same shape as filled, stroke only, no fill | Generate (custom) | Card*HeatIcon (empty state) | 20×20px |

## Images

| Name | Type | Dimensions | Aspect Ratio | Content Description | File |
|------|------|------------|--------------|---------------------|------|
| header-chili-illustration | illustration | 150×60px | 5:2 | Hand-drawn etched-style chili pepper, horizontal orientation, rendered in cream/white on the dark red header background, inside the diamond emblem | ui-studio/blueprints/library/assets/header-chili-illustration.png |
| header-main-emblem-frame | illustration | 1000×220px | ~4.5:1 | Large ornate gold decorative frame — central diamond shape flanked by elaborate symmetrical scrollwork with leaf motifs and curling vine flourishes, rendered in gold (#C9975B) on deep red (#A83232) | ui-studio/blueprints/library/assets/header-main-emblem-frame.png |
| header-ornate-border | illustration | 1800×40px | 45:1 | Thin horizontal decorative gold border strip — repeating swirling scrollwork and leaf motifs. Used for both top and bottom header borders. | ui-studio/blueprints/library/assets/header-ornate-border.png |
| card-corner-ornament | illustration | 30×30px | 1:1 | Small decorative flourish for card corners — angular scrollwork element in gold (#C9975B) matching card border aesthetic | ui-studio/blueprints/library/assets/card-corner-ornament.png |
| card-divider-flourish | illustration | 200×20px | 10:1 | Horizontal ornamental divider — thin line with central decorative flourish/diamond motif in gold (#C9975B), used between card title and heat rating | ui-studio/blueprints/library/assets/card-divider-flourish.png |

## Backgrounds

| Name | Type | Value | File |
|------|------|-------|------|
| parchment-background-texture | texture/image | Aged paper texture — sepia tones, subtle creases and staining, warm cream-to-tan gradient | ui-studio/blueprints/library/assets/parchment-background-texture.png |
| color-background-screen | solid | #EFE7CD | — |
| color-background-header | solid | #A83232 | — |
| color-background-card | solid | #F7F2E1 | — |
| color-background-filter-bar | solid | #EFE7CD | — |

## Notes

- **Chili pepper icons** (filled + outline): Custom assets not available in standard icon libraries. Must be generated as SVG-compatible vector shapes. Both states use the same silhouette — filled (#A83232 red) vs outline (#C9975B gold).
- **Header ornamental elements**: All gold-on-red decorative illustrations. Generate using approved screen as reference. These are purely decorative and do not carry interactive meaning.
- **Card corner ornaments**: Same asset reused at all four corners of every card. Single asset file, CSS transform for rotation.
- **Card divider flourish**: Same asset reused across all 10 cards. Single asset file.
- **Parchment background**: The screen background has an aged paper texture overlaid on the solid #EFE7CD base. Both solid color and texture file should be implemented (solid as fallback).
