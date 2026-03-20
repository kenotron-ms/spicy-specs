# Asset Inventory — Reference Entry (Spicy Specs Reference Collection)

## Icons

| Name | Description | Library | Component | Size | File |
|------|-------------|---------|-----------|------|------|
| folder-icon | Simple outline closed folder shape — tab at top-left, rectangular body | Heroicons | `folder` | 20px | assets/folder-icon.svg |
| file-icon | Document with folded top-right corner, outline style | Heroicons | `document` | 20px | assets/file-icon.svg |
| complexity-dot-filled | Solid filled circle, used as active rating point in complexity column | CSS-only | `border-radius: 50%; background: currentColor` | 12px | — |
| complexity-dot-outline | Circle outline, used as inactive rating point in complexity column | CSS-only | `border-radius: 50%; border: 1.5px solid currentColor` | 12px | — |

> Note: Chili pepper rating icons (chili-rating-icon-filled, chili-rating-icon-outline) are custom illustrated assets — no standard library equivalent. Generated as standalone assets (see Images section).

## Images

| Name | Type | Dimensions | Aspect Ratio | Content Description | File |
|------|------|------------|--------------|---------------------|------|
| header-ornamental-frame | illustration | 1200×200px | 6:1 | Elaborate red scrollwork ornamental banner frame with botanical and leaf motifs, flanking the central title. Vintage label/certificate style, dark crimson (#6B241F) on parchment (#F5EAD0) | assets/header-ornamental-frame.png |
| chili-pepper-illustration | illustration | 140×220px | ~2:3 | Detailed botanical hand-drawn chili pepper illustration, shaded with texture, deep red coloring, placed centrally in the header banner | assets/chili-pepper-illustration.png |
| spicy-specs-scroll | illustration | 220×60px | ~4:1 | Decorative scroll/ribbon banner element containing the SPICY SPECS title and EST. 2023 sub-banner, in vintage red-on-cream style | assets/spicy-specs-scroll.png |
| ornamental-flourish | illustration | 200×24px | ~8:1 | Horizontal decorative line with central leaf/botanical flourish ornament used as section heading decoration (❧ style). Reused for all 4 sections: ARCHITECTURE, FILE MAP, COMPONENT BREAKDOWN, INVARIANTS | assets/ornamental-flourish.png |
| separator-flourish | illustration | 800×20px | 40:1 | Full-width decorative horizontal rule with central scrollwork motif, used as section dividers between major content blocks | assets/separator-flourish.png |
| chili-rating-filled | icon | 30×30px | 1:1 | Stylized chili pepper icon, solid filled in crimson red (#B82E2E), used as filled rating point (4 of 5 active) | assets/chili-rating-filled.png |
| chili-rating-outline | icon | 30×30px | 1:1 | Stylized chili pepper icon, outline only in crimson red (#B82E2E), used as empty/inactive rating point | assets/chili-rating-outline.png |

## Backgrounds

| Name | Type | Value | File |
|------|------|-------|------|
| color-background-screen | solid | #F5EAD0 | — |
| color-banner-header | solid | #6B241F | — |
| color-banner-product-code | solid | #2A2420 | — |
| color-accent-primary | solid | #B82E2E | — |
| color-badge-high | solid | #B82E2E | — |
| color-badge-med | solid | #D4A02E | — |

> The aged paper texture visible in the document background may be a subtle CSS texture or a photographic background image. For implementation, `color-background-screen: #F5EAD0` is the base — the subtle paper grain effect should be implemented as a CSS `background-image` with a lightweight noise/grain SVG filter or a small repeating texture tile.
