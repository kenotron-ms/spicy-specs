# Component Spec — search-results

Extracted from: `ui-studio/frames/search-results/v9-frame.png`
Coverage: 100% (36 components, 4 iterations to convergence)
Nav shell: none (no nav-shell.md found)

---

## SearchResultsScreen

- **Type:** container
- **Parent:** none (root)
- **Children:** AppHeader, SearchFilterBar, ResultsList
- **Tokens:** color-background-screen
- **Content:** none
- **Scope:** local

---

## AppHeader

- **Type:** container
- **Parent:** SearchResultsScreen
- **Children:** HeaderScrollworkTop, HeaderLogo, HeaderScrollworkBottom
- **Tokens:** color-background-header, shadow-header
- **Content:** none

---

## HeaderScrollworkTop

- **Type:** image
- **Parent:** AppHeader
- **Children:** none
- **Tokens:** color-header-ornament
- **Content:** none
- **Asset:** header-scrollwork-top

---

## HeaderLogo

- **Type:** container
- **Parent:** AppHeader
- **Children:** HeaderChiliIcon, HeaderTitle, HeaderSubtitle
- **Tokens:** spacing-md
- **Content:** none

---

## HeaderChiliIcon

- **Type:** image
- **Parent:** HeaderLogo
- **Children:** none
- **Tokens:** color-header-ornament
- **Content:** none
- **Asset:** header-chili-diamond

---

## HeaderTitle

- **Type:** text
- **Parent:** HeaderLogo
- **Children:** none
- **Tokens:** font-family-display, font-size-display, font-weight-bold, color-header-ornament
- **Content:** "SPICY SPECS"

---

## HeaderSubtitle

- **Type:** text
- **Parent:** HeaderLogo
- **Children:** none
- **Tokens:** font-family-body, font-size-caption, font-weight-medium, color-header-ornament, letter-spacing-wide
- **Content:** "PATTERN LIBRARY - EST. 2025"

---

## HeaderScrollworkBottom

- **Type:** image
- **Parent:** AppHeader
- **Children:** none
- **Tokens:** color-header-ornament
- **Content:** none
- **Asset:** header-scrollwork-bottom

---

## SearchFilterBar

- **Type:** container
- **Parent:** SearchResultsScreen
- **Children:** SearchInputField, ResultsCountLabel, FilterChipGroup
- **Tokens:** color-background-filter-bar, spacing-filter-bar-vertical, spacing-filter-bar-horizontal
- **Content:** none

---

## SearchInputField

- **Type:** input
- **Parent:** SearchFilterBar
- **Children:** SearchIcon, SearchQueryText
- **Tokens:** color-background-input, color-border-input, radius-input, spacing-sm
- **Content:** none

---

## SearchIcon

- **Type:** icon
- **Parent:** SearchInputField
- **Children:** none
- **Tokens:** color-text-muted, font-size-icon-sm
- **Content:** none
- **Asset:** icon-search

---

## SearchQueryText

- **Type:** text
- **Parent:** SearchInputField
- **Children:** none
- **Tokens:** font-family-body, font-size-body-sm, font-weight-regular, color-text-primary
- **Content:** "SSE streaming" [dynamic — active search query]

---

## ResultsCountLabel

- **Type:** text
- **Parent:** SearchFilterBar
- **Children:** none
- **Tokens:** font-family-mono, font-size-label, font-weight-medium, color-text-muted, letter-spacing-wide
- **Content:** "SHOWING 24 ENTRIES" [dynamic — reflects filtered count]

---

## FilterChipGroup

- **Type:** container
- **Parent:** SearchFilterBar
- **Children:** FilterChipAll, FilterChipSpec, FilterChipAntiPattern, FilterChipReferenceApp, FilterChipPattern, FilterChipPhilosophy
- **Tokens:** spacing-chip-gap
- **Content:** none

---

## FilterChipAll

- **Type:** button
- **Parent:** FilterChipGroup
- **Children:** none
- **Tokens:** color-chip-all-bg, color-chip-all-text, color-border-chip, font-family-body, font-size-label, font-weight-bold, radius-chip, spacing-chip-padding
- **Content:** "[ALL]"

---

## FilterChipSpec

- **Type:** button
- **Parent:** FilterChipGroup
- **Children:** none
- **Tokens:** color-tag-spec-bg, color-tag-spec-text, font-family-body, font-size-label, font-weight-bold, radius-chip, spacing-chip-padding
- **Content:** "[SPEC]"

---

## FilterChipAntiPattern

- **Type:** button
- **Parent:** FilterChipGroup
- **Children:** none
- **Tokens:** color-tag-anti-pattern-bg, color-tag-anti-pattern-text, font-family-body, font-size-label, font-weight-bold, radius-chip, spacing-chip-padding
- **Content:** "[ANTI-PATTERN]"

---

## FilterChipReferenceApp

- **Type:** button
- **Parent:** FilterChipGroup
- **Children:** none
- **Tokens:** color-tag-reference-app-bg, color-tag-reference-app-text, font-family-body, font-size-label, font-weight-bold, radius-chip, spacing-chip-padding
- **Content:** "[REFERENCE APP]"

---

## FilterChipPattern

- **Type:** button
- **Parent:** FilterChipGroup
- **Children:** none
- **Tokens:** color-tag-pattern-bg, color-tag-pattern-text, font-family-body, font-size-label, font-weight-bold, radius-chip, spacing-chip-padding
- **Content:** "[PATTERN]"

---

## FilterChipPhilosophy

- **Type:** button
- **Parent:** FilterChipGroup
- **Children:** none
- **Tokens:** color-tag-philosophy-bg, color-tag-philosophy-text, font-family-body, font-size-label, font-weight-bold, radius-chip, spacing-chip-padding
- **Content:** "[PHILOSOPHY]"

---

## ResultsList

- **Type:** list
- **Parent:** SearchResultsScreen
- **Children:** ResultRow_1, ResultRow_2, ResultRow_3, ResultRow_4, ResultRow_5, ResultRow_6, ResultRow_7, ResultRow_8, ResultRow_9, ResultRow_10
- **Tokens:** color-background-screen, spacing-row-horizontal
- **Content:** none

---

## ResultRow_1

- **Type:** container
- **Parent:** ResultsList
- **Children:** ResultRowIcon, ResultRowTag, ResultRowTitle, ResultRowDescription, ResultRowMeta, ResultRowLink, ResultRowDivider
- **Tokens:** color-background-row-odd, spacing-row-vertical, spacing-row-horizontal
- **Content:** none

---

## ResultRow_2

- **Type:** container
- **Parent:** ResultsList
- **Children:** ResultRowIcon, ResultRowTag, ResultRowTitle, ResultRowDescription, ResultRowMeta, ResultRowLink, ResultRowDivider
- **Tokens:** color-background-row-even, spacing-row-vertical, spacing-row-horizontal
- **Content:** none

---

## ResultRow_3

- **Type:** container
- **Parent:** ResultsList
- **Children:** ResultRowIcon, ResultRowTag, ResultRowTitle, ResultRowDescription, ResultRowMeta, ResultRowLink, ResultRowDivider
- **Tokens:** color-background-row-odd, spacing-row-vertical, spacing-row-horizontal
- **Content:** none

---

## ResultRow_4

- **Type:** container
- **Parent:** ResultsList
- **Children:** ResultRowIcon, ResultRowTag, ResultRowTitle, ResultRowDescription, ResultRowMeta, ResultRowLink, ResultRowDivider
- **Tokens:** color-background-row-even, spacing-row-vertical, spacing-row-horizontal
- **Content:** none

---

## ResultRow_5

- **Type:** container
- **Parent:** ResultsList
- **Children:** ResultRowIcon, ResultRowTag, ResultRowTitle, ResultRowDescription, ResultRowMeta, ResultRowLink, ResultRowDivider
- **Tokens:** color-background-row-odd, spacing-row-vertical, spacing-row-horizontal
- **Content:** none

---

## ResultRow_6

- **Type:** container
- **Parent:** ResultsList
- **Children:** ResultRowIcon, ResultRowTag, ResultRowTitle, ResultRowDescription, ResultRowMeta, ResultRowLink, ResultRowDivider
- **Tokens:** color-background-row-even, spacing-row-vertical, spacing-row-horizontal
- **Content:** none

---

## ResultRow_7

- **Type:** container
- **Parent:** ResultsList
- **Children:** ResultRowIcon, ResultRowTag, ResultRowTitle, ResultRowDescription, ResultRowMeta, ResultRowLink, ResultRowDivider
- **Tokens:** color-background-row-odd, spacing-row-vertical, spacing-row-horizontal
- **Content:** none

---

## ResultRow_8

- **Type:** container
- **Parent:** ResultsList
- **Children:** ResultRowIcon, ResultRowTag, ResultRowTitle, ResultRowDescription, ResultRowMeta, ResultRowLink, ResultRowDivider
- **Tokens:** color-background-row-even, spacing-row-vertical, spacing-row-horizontal
- **Content:** none

---

## ResultRow_9

- **Type:** container
- **Parent:** ResultsList
- **Children:** ResultRowIcon, ResultRowTag, ResultRowTitle, ResultRowDescription, ResultRowMeta, ResultRowLink, ResultRowDivider
- **Tokens:** color-background-row-odd, spacing-row-vertical, spacing-row-horizontal
- **Content:** none

---

## ResultRow_10

- **Type:** container
- **Parent:** ResultsList
- **Children:** ResultRowIcon, ResultRowTag, ResultRowTitle, ResultRowDescription, ResultRowMeta, ResultRowLink, ResultRowDivider
- **Tokens:** color-background-row-even, spacing-row-vertical, spacing-row-horizontal
- **Content:** none

---

## ResultRowIcon

- **Type:** image
- **Parent:** ResultRow_* (repeating child, one per row)
- **Children:** none
- **Tokens:** spacing-xs
- **Content:** none
- **Asset:** result-row-icon

---

## ResultRowTag

- **Type:** container
- **Parent:** ResultRow_* (repeating child, one per row)
- **Children:** none
- **Tokens:** color-tag-*-bg, color-tag-*-text, font-family-body, font-size-tag, font-weight-bold, radius-tag, spacing-tag-padding
- **Content:** [dynamic — one of: "SPEC" | "ANTI-PATTERN" | "REFERENCE APP" | "PATTERN" | "PHILOSOPHY"]

---

## ResultRowTitle

- **Type:** text
- **Parent:** ResultRow_* (repeating child, one per row)
- **Children:** none
- **Tokens:** font-family-body, font-size-body, font-weight-bold, color-text-primary
- **Content:** [dynamic — entry title]

---

## ResultRowDescription

- **Type:** text
- **Parent:** ResultRow_* (repeating child, one per row)
- **Children:** none
- **Tokens:** font-family-body, font-size-body-sm, font-weight-regular, color-text-primary
- **Content:** [dynamic — entry description]

---

## ResultRowMeta

- **Type:** text
- **Parent:** ResultRow_* (repeating child, one per row)
- **Children:** none
- **Tokens:** font-family-mono, font-size-caption, font-weight-regular, color-text-muted
- **Content:** [dynamic — numeric metadata / codes]

---

## ResultRowLink

- **Type:** text
- **Parent:** ResultRow_* (repeating child, one per row)
- **Children:** none
- **Tokens:** font-family-mono, font-size-caption, font-weight-regular, color-text-link
- **Content:** [dynamic — URL string]

---

## ResultRowDivider

- **Type:** container
- **Parent:** ResultRow_* (repeating child, one per row)
- **Children:** none
- **Tokens:** color-border-divider, border-width-divider
- **Content:** none
