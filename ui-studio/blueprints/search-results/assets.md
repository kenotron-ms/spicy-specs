# Asset Inventory — search-results

Extracted from: `ui-studio/frames/search-results/v9-frame.png`

---

## Icons

| Name | Description | Library | Icon Name | Component | Size |
|------|-------------|---------|-----------|-----------|------|
| icon-search | Circle with a diagonal line handle pointing bottom-right — magnifying glass | Lucide | `Search` | SearchIcon | 16px |
| icon-row-meta-date | Small square with grid lines and a numeric indicator — calendar shape | Lucide | `Calendar` | ResultRowMeta | 12px |
| icon-row-meta-user | Circular head with shoulder arc — person silhouette | Lucide | `User` | ResultRowMeta | 12px |

> **Note:** NEVER use emoji for these icons. Use SVG from Lucide. Import via `lucide-react` or fetch from `https://raw.githubusercontent.com/lucide-icons/lucide/main/icons/{name}.svg`

---

## Illustrations & Decorative Graphics

| Name | Type | Dimensions | Description | Component | File |
|------|------|------------|-------------|-----------|------|
| header-logo-illustration | illustration | 600x240px (2x) | Diamond frame containing stylized chili pepper line art; "SPICY SPECS" in decorative display serif; "PATTERN LIBRARY - EST. 2025" in smaller sans-serif. All cream (#FFF4CB) on transparent. | HeaderLogo | `assets/header-logo-illustration.png` |
| header-scrollwork-decoration | decorative | 2000x60px (2x) | Horizontal ornamental strip: symmetrical scrollwork, filigree vines and flourishes. Cream (#FFF4CB) on transparent. Used at both top and bottom of header. | HeaderScrollworkTop, HeaderScrollworkBottom | `assets/header-scrollwork-decoration.png` |
| row-category-icon | decorative | 40x40px (2x) | Diamond/rhombus outline containing a small internal geometric cross/star/knot pattern. Dark neutral (#201500) on transparent; colorized via CSS fill to match category. | ResultRowIcon | `assets/row-category-icon.png` |

---

## Backgrounds

| Name | Type | Value | Component | File |
|------|------|-------|-----------|------|
| color-background-header | solid + texture | `#A31818` base with subtle aged grunge texture | AppHeader | `assets/header-background-texture.png` (optional — can fallback to solid CSS) |
| color-background-screen | solid | `#F7F0D9` — warm beige, parchment tone | SearchResultsScreen, ResultsList | — (CSS only) |
| color-background-filter-bar | solid | `#EAE0C0` — slightly deeper beige | SearchFilterBar | — (CSS only) |
| color-background-row-odd | solid | `#E9E0C9` — alternating row shade | ResultRow (odd) | — (CSS only) |
| color-background-row-even | solid | `#F7F0D9` — base parchment | ResultRow (even) | — (CSS only) |
| color-background-input | solid | `#FFFFFF` | SearchInputField | — (CSS only) |

---

## Token Color Map (Tag Badges + Filter Chips)

| Tag Type | Background | Text | Used In |
|----------|-----------|------|---------|
| SPEC | `#A31818` | `#FFFFFF` | FilterChipSpec, ResultRowTag (SPEC) |
| ANTI-PATTERN | `#006E3B` | `#FFFFFF` | FilterChipAntiPattern, ResultRowTag (ANTI-PATTERN) |
| REFERENCE APP | `#BC8F47` | `#FFFFFF` | FilterChipReferenceApp, ResultRowTag (REFERENCE APP) |
| PATTERN | `#D29255` | `#FFFFFF` | FilterChipPattern, ResultRowTag (PATTERN) |
| PHILOSOPHY | `#0A4F4F` | `#FFFFFF` | FilterChipPhilosophy, ResultRowTag (PHILOSOPHY) |
| ALL (unselected) | `#EAE0C0` | `#5F4B32` | FilterChipAll |
