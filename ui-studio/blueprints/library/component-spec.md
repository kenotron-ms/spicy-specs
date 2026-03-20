# Component Spec — Library Screen

> Containment overlay confirmed 45+ components at 100% coverage. No nav-shell.md found — all components are local to this screen.

---

## LibraryScreen

- **Type:** container
- **Parent:** none (root)
- **Children:** HeaderSection, FilterBar, CardGrid
- **Tokens:** color-background-screen
- **Content:** none
- **Scope:** local

---

## HeaderSection

- **Type:** container
- **Parent:** LibraryScreen
- **Children:** HeaderScrollwork, HeaderEmblem
- **Tokens:** color-background-header, header-padding-vertical, header-padding-horizontal
- **Content:** none

---

## HeaderScrollwork

- **Type:** image
- **Parent:** HeaderSection
- **Children:** none
- **Tokens:** color-accent-gold
- **Content:** none
- **Asset:** header-main-emblem-frame, header-top-ornate-border, header-bottom-ornate-border

---

## HeaderEmblem

- **Type:** container
- **Parent:** HeaderSection
- **Children:** HeaderTitle, HeaderChiliIllustration, HeaderSubtitle
- **Tokens:** shadow-header-emblem, spacing-sm
- **Content:** none

---

## HeaderTitle

- **Type:** text
- **Parent:** HeaderEmblem
- **Children:** none
- **Tokens:** color-text-header, font-family-display, font-size-header-title, font-weight-bold, line-height-tight
- **Content:** "SPICY SPECS"

---

## HeaderChiliIllustration

- **Type:** image
- **Parent:** HeaderEmblem
- **Children:** none
- **Tokens:** none
- **Content:** none
- **Asset:** header-chili-illustration

---

## HeaderSubtitle

- **Type:** text
- **Parent:** HeaderEmblem
- **Children:** none
- **Tokens:** color-text-header, font-family-body, font-size-header-subtitle, font-weight-regular, line-height-normal
- **Content:** "PATTERN LIBRARY • EST. 2028"

---

## FilterBar

- **Type:** container
- **Parent:** LibraryScreen
- **Children:** SearchInput, EntryCountLabel, FilterButtonGroup
- **Tokens:** color-background-filter-bar, filter-bar-padding-vertical, filter-bar-padding-horizontal, spacing-lg
- **Content:** none

---

## SearchInput

- **Type:** input
- **Parent:** FilterBar
- **Children:** SearchIcon, SearchPlaceholderText
- **Tokens:** color-background-search-input, radius-input, spacing-sm, spacing-md
- **Content:** none

---

## SearchIcon

- **Type:** icon
- **Parent:** SearchInput
- **Children:** none
- **Tokens:** color-text-secondary
- **Content:** none
- **Asset:** icon-search

---

## SearchPlaceholderText

- **Type:** text
- **Parent:** SearchInput
- **Children:** none
- **Tokens:** color-text-secondary, font-family-body, font-size-filter-label, font-weight-regular
- **Content:** "SEARCH ENTRIES..."

---

## EntryCountLabel

- **Type:** text
- **Parent:** FilterBar
- **Children:** none
- **Tokens:** color-text-secondary, font-family-body, font-size-filter-label, font-weight-regular, line-height-normal
- **Content:** "SHOWING 24 ENTRIES"

---

## FilterButtonGroup

- **Type:** container
- **Parent:** FilterBar
- **Children:** FilterAll, FilterSpec, FilterAntiPattern, FilterReferenceApp, FilterPattern, FilterPhilosophy
- **Tokens:** spacing-sm
- **Content:** none

---

## FilterAll

- **Type:** button
- **Parent:** FilterButtonGroup
- **Children:** none
- **Tokens:** color-background-filter-active, color-text-filter-active, font-family-body, font-size-filter-button, radius-button-filter, spacing-xs, spacing-sm
- **Content:** "[ALL]"

---

## FilterSpec

- **Type:** button
- **Parent:** FilterButtonGroup
- **Children:** none
- **Tokens:** color-background-filter-idle, color-text-filter-idle-spec, color-border-card, font-family-body, font-size-filter-button, radius-button-filter, spacing-xs, spacing-sm
- **Content:** "[SPEC]"

---

## FilterAntiPattern

- **Type:** button
- **Parent:** FilterButtonGroup
- **Children:** none
- **Tokens:** color-background-filter-idle, color-text-filter-idle-antipattern, color-border-card, font-family-body, font-size-filter-button, radius-button-filter, spacing-xs, spacing-sm
- **Content:** "[ANTI-PATTERN]"

---

## FilterReferenceApp

- **Type:** button
- **Parent:** FilterButtonGroup
- **Children:** none
- **Tokens:** color-background-filter-idle, color-text-filter-idle-other, color-border-card, font-family-body, font-size-filter-button, radius-button-filter, spacing-xs, spacing-sm
- **Content:** "[REFERENCE APP]"

---

## FilterPattern

- **Type:** button
- **Parent:** FilterButtonGroup
- **Children:** none
- **Tokens:** color-background-filter-idle, color-text-filter-idle-other, color-border-card, font-family-body, font-size-filter-button, radius-button-filter, spacing-xs, spacing-sm
- **Content:** "[PATTERN]"

---

## FilterPhilosophy

- **Type:** button
- **Parent:** FilterButtonGroup
- **Children:** none
- **Tokens:** color-background-filter-idle, color-text-filter-idle-other, color-border-card, font-family-body, font-size-filter-button, radius-button-filter, spacing-xs, spacing-sm
- **Content:** "[PHILOSOPHY]"

---

## CardGrid

- **Type:** container
- **Parent:** LibraryScreen
- **Children:** CardRow1, CardRow2
- **Tokens:** color-background-screen, header-padding-horizontal, card-grid-gap, spacing-xl
- **Content:** none

---

## CardRow1

- **Type:** container
- **Parent:** CardGrid
- **Children:** Card1, Card2, Card3, Card4, Card5
- **Tokens:** card-grid-gap
- **Content:** none

---

## CardRow2

- **Type:** container
- **Parent:** CardGrid
- **Children:** Card6, Card7, Card8, Card9, Card10
- **Tokens:** card-grid-gap
- **Content:** none

---

<!-- ═══════════════════════════════════════ -->
<!-- CARD TEMPLATE — repeated 10× with dynamic content -->
<!-- ═══════════════════════════════════════ -->

## Card1

- **Type:** container
- **Parent:** CardRow1
- **Children:** Card1Banner, Card1Title, Card1DividerFlourish, Card1HeatRating, Card1Metadata, Card1UrlButton, Card1CornerOrnaments
- **Tokens:** color-background-card, color-border-card, radius-card, shadow-card, card-padding-horizontal, card-padding-vertical, spacing-sm
- **Content:** none

---

## Card1Banner

- **Type:** container
- **Parent:** Card1
- **Children:** Card1BannerText
- **Tokens:** color-banner-spec, radius-banner-top, card-banner-height
- **Content:** none

---

## Card1BannerText

- **Type:** text
- **Parent:** Card1Banner
- **Children:** none
- **Tokens:** color-text-header, font-family-body, font-size-card-banner, font-weight-bold, line-height-tight
- **Content:** "SPEC"

---

## Card1Title

- **Type:** text
- **Parent:** Card1
- **Children:** none
- **Tokens:** color-text-primary, font-family-body, font-size-card-title, font-weight-bold, line-height-tight
- **Content:** "CHAT STREAMING WITH SSE"

---

## Card1DividerFlourish

- **Type:** image
- **Parent:** Card1
- **Children:** none
- **Tokens:** color-accent-gold
- **Content:** none
- **Asset:** card-divider-flourish

---

## Card1HeatRating

- **Type:** container
- **Parent:** Card1
- **Children:** Card1HeatIcon1, Card1HeatIcon2, Card1HeatIcon3, Card1HeatIcon4, Card1HeatIcon5
- **Tokens:** spacing-xs
- **Content:** none

---

## Card1HeatIcon1

- **Type:** icon
- **Parent:** Card1HeatRating
- **Children:** none
- **Tokens:** color-chili-filled
- **Content:** none
- **Asset:** chili-rating-icon-filled

---

## Card1HeatIcon2

- **Type:** icon
- **Parent:** Card1HeatRating
- **Children:** none
- **Tokens:** color-chili-filled
- **Content:** none
- **Asset:** chili-rating-icon-filled

---

## Card1HeatIcon3

- **Type:** icon
- **Parent:** Card1HeatRating
- **Children:** none
- **Tokens:** color-chili-empty
- **Content:** none
- **Asset:** chili-rating-icon-outline

---

## Card1HeatIcon4

- **Type:** icon
- **Parent:** Card1HeatRating
- **Children:** none
- **Tokens:** color-chili-empty
- **Content:** none
- **Asset:** chili-rating-icon-outline

---

## Card1HeatIcon5

- **Type:** icon
- **Parent:** Card1HeatRating
- **Children:** none
- **Tokens:** color-chili-empty
- **Content:** none
- **Asset:** chili-rating-icon-outline

---

## Card1Metadata

- **Type:** text
- **Parent:** Card1
- **Children:** none
- **Tokens:** color-text-secondary, font-family-body, font-size-card-metadata, font-weight-regular, line-height-normal
- **Content:** "19 ANTI-PATTERNS • 13 INVARIANTS"

---

## Card1UrlButton

- **Type:** button
- **Parent:** Card1
- **Children:** none
- **Tokens:** color-background-card-url-button, color-text-url-button, font-family-mono, font-size-card-url, radius-button-url, spacing-xs, spacing-sm
- **Content:** "spicy-specs.com/e/chat-streaming"

---

## Card1CornerOrnaments

- **Type:** image
- **Parent:** Card1
- **Children:** none
- **Tokens:** color-accent-gold
- **Content:** none
- **Asset:** card-corner-ornament

---

## Card2

- **Type:** container
- **Parent:** CardRow1
- **Children:** Card2Banner, Card2Title, Card2DividerFlourish, Card2HeatRating, Card2Metadata, Card2UrlButton, Card2CornerOrnaments
- **Tokens:** color-background-card, color-border-card, radius-card, shadow-card, card-padding-horizontal, card-padding-vertical, spacing-sm
- **Content:** none

---

## Card2Banner

- **Type:** container
- **Parent:** Card2
- **Children:** Card2BannerText
- **Tokens:** color-banner-antipattern, radius-banner-top, card-banner-height
- **Content:** none

---

## Card2BannerText

- **Type:** text
- **Parent:** Card2Banner
- **Children:** none
- **Tokens:** color-text-header, font-family-body, font-size-card-banner, font-weight-bold, line-height-tight
- **Content:** "ANTI-PATTERN"

---

## Card2Title

- **Type:** text
- **Parent:** Card2
- **Children:** none
- **Tokens:** color-text-primary, font-family-body, font-size-card-title, font-weight-bold, line-height-tight
- **Content:** "INFINITE SCROLL IMPLEMENTATION"

---

## Card2DividerFlourish

- **Type:** image
- **Parent:** Card2
- **Children:** none
- **Tokens:** color-accent-gold
- **Content:** none
- **Asset:** card-divider-flourish

---

## Card2HeatRating

- **Type:** container
- **Parent:** Card2
- **Children:** Card2HeatIcon1, Card2HeatIcon2, Card2HeatIcon3, Card2HeatIcon4, Card2HeatIcon5
- **Tokens:** spacing-xs
- **Content:** none

---

## Card2HeatIcon1

- **Type:** icon
- **Parent:** Card2HeatRating
- **Children:** none
- **Tokens:** color-chili-filled
- **Content:** none
- **Asset:** chili-rating-icon-filled

---

## Card2HeatIcon2

- **Type:** icon
- **Parent:** Card2HeatRating
- **Children:** none
- **Tokens:** color-chili-filled
- **Content:** none
- **Asset:** chili-rating-icon-filled

---

## Card2HeatIcon3

- **Type:** icon
- **Parent:** Card2HeatRating
- **Children:** none
- **Tokens:** color-chili-filled
- **Content:** none
- **Asset:** chili-rating-icon-filled

---

## Card2HeatIcon4

- **Type:** icon
- **Parent:** Card2HeatRating
- **Children:** none
- **Tokens:** color-chili-empty
- **Content:** none
- **Asset:** chili-rating-icon-outline

---

## Card2HeatIcon5

- **Type:** icon
- **Parent:** Card2HeatRating
- **Children:** none
- **Tokens:** color-chili-empty
- **Content:** none
- **Asset:** chili-rating-icon-outline

---

## Card2Metadata

- **Type:** text
- **Parent:** Card2
- **Children:** none
- **Tokens:** color-text-secondary, font-family-body, font-size-card-metadata, font-weight-regular, line-height-normal
- **Content:** [dynamic]

---

## Card2UrlButton

- **Type:** button
- **Parent:** Card2
- **Children:** none
- **Tokens:** color-background-card-url-button, color-text-url-button, font-family-mono, font-size-card-url, radius-button-url, spacing-xs, spacing-sm
- **Content:** [dynamic]

---

## Card2CornerOrnaments

- **Type:** image
- **Parent:** Card2
- **Children:** none
- **Tokens:** color-accent-gold
- **Content:** none
- **Asset:** card-corner-ornament

---

## Card3

- **Type:** container
- **Parent:** CardRow1
- **Children:** Card3Banner, Card3Title, Card3DividerFlourish, Card3HeatRating, Card3Metadata, Card3UrlButton, Card3CornerOrnaments
- **Tokens:** color-background-card, color-border-card, radius-card, shadow-card, card-padding-horizontal, card-padding-vertical, spacing-sm
- **Content:** none

---

## Card3Banner

- **Type:** container
- **Parent:** Card3
- **Children:** Card3BannerText
- **Tokens:** color-banner-reference, radius-banner-top, card-banner-height
- **Content:** none

---

## Card3BannerText

- **Type:** text
- **Parent:** Card3Banner
- **Children:** none
- **Tokens:** color-text-header, font-family-body, font-size-card-banner, font-weight-bold, line-height-tight
- **Content:** "REFERENCE APP"

---

## Card3Title

- **Type:** text
- **Parent:** Card3
- **Children:** none
- **Tokens:** color-text-primary, font-family-body, font-size-card-title, font-weight-bold, line-height-tight
- **Content:** "AUTH FLOW REFERENCE APP"

---

## Card3DividerFlourish

- **Type:** image
- **Parent:** Card3
- **Children:** none
- **Tokens:** color-accent-gold
- **Content:** none
- **Asset:** card-divider-flourish

---

## Card3HeatRating

- **Type:** container
- **Parent:** Card3
- **Children:** Card3HeatIcon1, Card3HeatIcon2, Card3HeatIcon3, Card3HeatIcon4, Card3HeatIcon5
- **Tokens:** spacing-xs
- **Content:** none

---

## Card3HeatIcon1

- **Type:** icon
- **Parent:** Card3HeatRating
- **Children:** none
- **Tokens:** color-chili-filled
- **Content:** none
- **Asset:** chili-rating-icon-filled

---

## Card3HeatIcon2

- **Type:** icon
- **Parent:** Card3HeatRating
- **Children:** none
- **Tokens:** color-chili-empty
- **Content:** none
- **Asset:** chili-rating-icon-outline

---

## Card3HeatIcon3

- **Type:** icon
- **Parent:** Card3HeatRating
- **Children:** none
- **Tokens:** color-chili-empty
- **Content:** none
- **Asset:** chili-rating-icon-outline

---

## Card3HeatIcon4

- **Type:** icon
- **Parent:** Card3HeatRating
- **Children:** none
- **Tokens:** color-chili-empty
- **Content:** none
- **Asset:** chili-rating-icon-outline

---

## Card3HeatIcon5

- **Type:** icon
- **Parent:** Card3HeatRating
- **Children:** none
- **Tokens:** color-chili-empty
- **Content:** none
- **Asset:** chili-rating-icon-outline

---

## Card3Metadata

- **Type:** text
- **Parent:** Card3
- **Children:** none
- **Tokens:** color-text-secondary, font-family-body, font-size-card-metadata, font-weight-regular, line-height-normal
- **Content:** [dynamic]

---

## Card3UrlButton

- **Type:** button
- **Parent:** Card3
- **Children:** none
- **Tokens:** color-background-card-url-button, color-text-url-button, font-family-mono, font-size-card-url, radius-button-url, spacing-xs, spacing-sm
- **Content:** [dynamic]

---

## Card3CornerOrnaments

- **Type:** image
- **Parent:** Card3
- **Children:** none
- **Tokens:** color-accent-gold
- **Content:** none
- **Asset:** card-corner-ornament

---

## Card4

- **Type:** container
- **Parent:** CardRow1
- **Children:** Card4Banner, Card4Title, Card4DividerFlourish, Card4HeatRating, Card4Metadata, Card4UrlButton, Card4CornerOrnaments
- **Tokens:** color-background-card, color-border-card, radius-card, shadow-card, card-padding-horizontal, card-padding-vertical, spacing-sm
- **Content:** none

---

## Card4Banner

- **Type:** container
- **Parent:** Card4
- **Children:** Card4BannerText
- **Tokens:** color-banner-pattern, radius-banner-top, card-banner-height
- **Content:** none

---

## Card4BannerText

- **Type:** text
- **Parent:** Card4Banner
- **Children:** none
- **Tokens:** color-text-header, font-family-body, font-size-card-banner, font-weight-bold, line-height-tight
- **Content:** "PATTERN"

---

## Card4Title

- **Type:** text
- **Parent:** Card4
- **Children:** none
- **Tokens:** color-text-primary, font-family-body, font-size-card-title, font-weight-bold, line-height-tight
- **Content:** [dynamic]

---

## Card4DividerFlourish

- **Type:** image
- **Parent:** Card4
- **Children:** none
- **Tokens:** color-accent-gold
- **Content:** none
- **Asset:** card-divider-flourish

---

## Card4HeatRating

- **Type:** container
- **Parent:** Card4
- **Children:** Card4HeatIcon1, Card4HeatIcon2, Card4HeatIcon3, Card4HeatIcon4, Card4HeatIcon5
- **Tokens:** spacing-xs
- **Content:** none

---

## Card4HeatIcon1

- **Type:** icon
- **Parent:** Card4HeatRating
- **Children:** none
- **Tokens:** color-chili-filled
- **Content:** none
- **Asset:** chili-rating-icon-filled

---

## Card4HeatIcon2

- **Type:** icon
- **Parent:** Card4HeatRating
- **Children:** none
- **Tokens:** color-chili-filled
- **Content:** none
- **Asset:** chili-rating-icon-filled

---

## Card4HeatIcon3

- **Type:** icon
- **Parent:** Card4HeatRating
- **Children:** none
- **Tokens:** color-chili-filled
- **Content:** none
- **Asset:** chili-rating-icon-filled

---

## Card4HeatIcon4

- **Type:** icon
- **Parent:** Card4HeatRating
- **Children:** none
- **Tokens:** color-chili-filled
- **Content:** none
- **Asset:** chili-rating-icon-filled

---

## Card4HeatIcon5

- **Type:** icon
- **Parent:** Card4HeatRating
- **Children:** none
- **Tokens:** color-chili-filled
- **Content:** none
- **Asset:** chili-rating-icon-filled

---

## Card4Metadata

- **Type:** text
- **Parent:** Card4
- **Children:** none
- **Tokens:** color-text-secondary, font-family-body, font-size-card-metadata, font-weight-regular, line-height-normal
- **Content:** [dynamic]

---

## Card4UrlButton

- **Type:** button
- **Parent:** Card4
- **Children:** none
- **Tokens:** color-background-card-url-button, color-text-url-button, font-family-mono, font-size-card-url, radius-button-url, spacing-xs, spacing-sm
- **Content:** [dynamic]

---

## Card4CornerOrnaments

- **Type:** image
- **Parent:** Card4
- **Children:** none
- **Tokens:** color-accent-gold
- **Content:** none
- **Asset:** card-corner-ornament

---

## Card5

- **Type:** container
- **Parent:** CardRow1
- **Children:** Card5Banner, Card5Title, Card5DividerFlourish, Card5HeatRating, Card5Metadata, Card5UrlButton, Card5CornerOrnaments
- **Tokens:** color-background-card, color-border-card, radius-card, shadow-card, card-padding-horizontal, card-padding-vertical, spacing-sm
- **Content:** none

---

## Card5Banner

- **Type:** container
- **Parent:** Card5
- **Children:** Card5BannerText
- **Tokens:** color-banner-philosophy, radius-banner-top, card-banner-height
- **Content:** none

---

## Card5BannerText

- **Type:** text
- **Parent:** Card5Banner
- **Children:** none
- **Tokens:** color-text-header, font-family-body, font-size-card-banner, font-weight-bold, line-height-tight
- **Content:** "PHILOSOPHY"

---

## Card5Title

- **Type:** text
- **Parent:** Card5
- **Children:** none
- **Tokens:** color-text-primary, font-family-body, font-size-card-title, font-weight-bold, line-height-tight
- **Content:** [dynamic]

---

## Card5DividerFlourish

- **Type:** image
- **Parent:** Card5
- **Children:** none
- **Tokens:** color-accent-gold
- **Content:** none
- **Asset:** card-divider-flourish

---

## Card5HeatRating

- **Type:** container
- **Parent:** Card5
- **Children:** Card5HeatIcon1, Card5HeatIcon2, Card5HeatIcon3, Card5HeatIcon4, Card5HeatIcon5
- **Tokens:** spacing-xs
- **Content:** none

---

## Card5HeatIcon1

- **Type:** icon
- **Parent:** Card5HeatRating
- **Children:** none
- **Tokens:** color-chili-filled
- **Content:** none
- **Asset:** chili-rating-icon-filled

---

## Card5HeatIcon2

- **Type:** icon
- **Parent:** Card5HeatRating
- **Children:** none
- **Tokens:** color-chili-empty
- **Content:** none
- **Asset:** chili-rating-icon-outline

---

## Card5HeatIcon3

- **Type:** icon
- **Parent:** Card5HeatRating
- **Children:** none
- **Tokens:** color-chili-empty
- **Content:** none
- **Asset:** chili-rating-icon-outline

---

## Card5HeatIcon4

- **Type:** icon
- **Parent:** Card5HeatRating
- **Children:** none
- **Tokens:** color-chili-empty
- **Content:** none
- **Asset:** chili-rating-icon-outline

---

## Card5HeatIcon5

- **Type:** icon
- **Parent:** Card5HeatRating
- **Children:** none
- **Tokens:** color-chili-empty
- **Content:** none
- **Asset:** chili-rating-icon-outline

---

## Card5Metadata

- **Type:** text
- **Parent:** Card5
- **Children:** none
- **Tokens:** color-text-secondary, font-family-body, font-size-card-metadata, font-weight-regular, line-height-normal
- **Content:** [dynamic]

---

## Card5UrlButton

- **Type:** button
- **Parent:** Card5
- **Children:** none
- **Tokens:** color-background-card-url-button, color-text-url-button, font-family-mono, font-size-card-url, radius-button-url, spacing-xs, spacing-sm
- **Content:** [dynamic]

---

## Card5CornerOrnaments

- **Type:** image
- **Parent:** Card5
- **Children:** none
- **Tokens:** color-accent-gold
- **Content:** none
- **Asset:** card-corner-ornament

---

<!-- Row 2 cards — same structure, partially visible at bottom of screen -->

## Card6

- **Type:** container
- **Parent:** CardRow2
- **Children:** Card6Banner, Card6Title, Card6DividerFlourish, Card6HeatRating, Card6Metadata, Card6UrlButton, Card6CornerOrnaments
- **Tokens:** color-background-card, color-border-card, radius-card, shadow-card, card-padding-horizontal, card-padding-vertical, spacing-sm
- **Content:** none

---

## Card6Banner

- **Type:** container
- **Parent:** Card6
- **Children:** Card6BannerText
- **Tokens:** color-banner-spec, radius-banner-top, card-banner-height
- **Content:** none

---

## Card6BannerText

- **Type:** text
- **Parent:** Card6Banner
- **Children:** none
- **Tokens:** color-text-header, font-family-body, font-size-card-banner, font-weight-bold, line-height-tight
- **Content:** [dynamic]

---

## Card6Title

- **Type:** text
- **Parent:** Card6
- **Children:** none
- **Tokens:** color-text-primary, font-family-body, font-size-card-title, font-weight-bold, line-height-tight
- **Content:** [dynamic]

---

## Card6DividerFlourish

- **Type:** image
- **Parent:** Card6
- **Children:** none
- **Tokens:** color-accent-gold
- **Content:** none
- **Asset:** card-divider-flourish

---

## Card6HeatRating

- **Type:** container
- **Parent:** Card6
- **Children:** Card6HeatIcon1, Card6HeatIcon2, Card6HeatIcon3, Card6HeatIcon4, Card6HeatIcon5
- **Tokens:** spacing-xs
- **Content:** none

---

## Card6HeatIcon1

- **Type:** icon
- **Parent:** Card6HeatRating
- **Children:** none
- **Tokens:** color-chili-filled
- **Content:** none
- **Asset:** chili-rating-icon-filled

---

## Card6HeatIcon2

- **Type:** icon
- **Parent:** Card6HeatRating
- **Children:** none
- **Tokens:** color-chili-empty
- **Content:** none
- **Asset:** chili-rating-icon-outline

---

## Card6HeatIcon3

- **Type:** icon
- **Parent:** Card6HeatRating
- **Children:** none
- **Tokens:** color-chili-empty
- **Content:** none
- **Asset:** chili-rating-icon-outline

---

## Card6HeatIcon4

- **Type:** icon
- **Parent:** Card6HeatRating
- **Children:** none
- **Tokens:** color-chili-empty
- **Content:** none
- **Asset:** chili-rating-icon-outline

---

## Card6HeatIcon5

- **Type:** icon
- **Parent:** Card6HeatRating
- **Children:** none
- **Tokens:** color-chili-empty
- **Content:** none
- **Asset:** chili-rating-icon-outline

---

## Card6Metadata

- **Type:** text
- **Parent:** Card6
- **Children:** none
- **Tokens:** color-text-secondary, font-family-body, font-size-card-metadata, font-weight-regular, line-height-normal
- **Content:** [dynamic]

---

## Card6UrlButton

- **Type:** button
- **Parent:** Card6
- **Children:** none
- **Tokens:** color-background-card-url-button, color-text-url-button, font-family-mono, font-size-card-url, radius-button-url, spacing-xs, spacing-sm
- **Content:** [dynamic]

---

## Card6CornerOrnaments

- **Type:** image
- **Parent:** Card6
- **Children:** none
- **Tokens:** color-accent-gold
- **Content:** none
- **Asset:** card-corner-ornament

---

## Card7

- **Type:** container
- **Parent:** CardRow2
- **Children:** Card7Banner, Card7Title, Card7DividerFlourish, Card7HeatRating, Card7Metadata, Card7UrlButton, Card7CornerOrnaments
- **Tokens:** color-background-card, color-border-card, radius-card, shadow-card, card-padding-horizontal, card-padding-vertical, spacing-sm
- **Content:** none

---

## Card7Banner

- **Type:** container
- **Parent:** Card7
- **Children:** Card7BannerText
- **Tokens:** color-banner-antipattern, radius-banner-top, card-banner-height
- **Content:** none

---

## Card7BannerText

- **Type:** text
- **Parent:** Card7Banner
- **Children:** none
- **Tokens:** color-text-header, font-family-body, font-size-card-banner, font-weight-bold, line-height-tight
- **Content:** [dynamic]

---

## Card7Title

- **Type:** text
- **Parent:** Card7
- **Children:** none
- **Tokens:** color-text-primary, font-family-body, font-size-card-title, font-weight-bold, line-height-tight
- **Content:** [dynamic]

---

## Card7DividerFlourish

- **Type:** image
- **Parent:** Card7
- **Children:** none
- **Tokens:** color-accent-gold
- **Content:** none
- **Asset:** card-divider-flourish

---

## Card7HeatRating

- **Type:** container
- **Parent:** Card7
- **Children:** Card7HeatIcon1, Card7HeatIcon2, Card7HeatIcon3, Card7HeatIcon4, Card7HeatIcon5
- **Tokens:** spacing-xs
- **Content:** none

---

## Card7HeatIcon1

- **Type:** icon
- **Parent:** Card7HeatRating
- **Children:** none
- **Tokens:** color-chili-filled
- **Content:** none
- **Asset:** chili-rating-icon-filled

---

## Card7HeatIcon2

- **Type:** icon
- **Parent:** Card7HeatRating
- **Children:** none
- **Tokens:** color-chili-filled
- **Content:** none
- **Asset:** chili-rating-icon-filled

---

## Card7HeatIcon3

- **Type:** icon
- **Parent:** Card7HeatRating
- **Children:** none
- **Tokens:** color-chili-filled
- **Content:** none
- **Asset:** chili-rating-icon-filled

---

## Card7HeatIcon4

- **Type:** icon
- **Parent:** Card7HeatRating
- **Children:** none
- **Tokens:** color-chili-filled
- **Content:** none
- **Asset:** chili-rating-icon-filled

---

## Card7HeatIcon5

- **Type:** icon
- **Parent:** Card7HeatRating
- **Children:** none
- **Tokens:** color-chili-empty
- **Content:** none
- **Asset:** chili-rating-icon-outline

---

## Card7Metadata

- **Type:** text
- **Parent:** Card7
- **Children:** none
- **Tokens:** color-text-secondary, font-family-body, font-size-card-metadata, font-weight-regular, line-height-normal
- **Content:** [dynamic]

---

## Card7UrlButton

- **Type:** button
- **Parent:** Card7
- **Children:** none
- **Tokens:** color-background-card-url-button, color-text-url-button, font-family-mono, font-size-card-url, radius-button-url, spacing-xs, spacing-sm
- **Content:** [dynamic]

---

## Card7CornerOrnaments

- **Type:** image
- **Parent:** Card7
- **Children:** none
- **Tokens:** color-accent-gold
- **Content:** none
- **Asset:** card-corner-ornament

---

## Card8

- **Type:** container
- **Parent:** CardRow2
- **Children:** Card8Banner, Card8Title, Card8DividerFlourish, Card8HeatRating, Card8Metadata, Card8UrlButton, Card8CornerOrnaments
- **Tokens:** color-background-card, color-border-card, radius-card, shadow-card, card-padding-horizontal, card-padding-vertical, spacing-sm
- **Content:** none

---

## Card8Banner

- **Type:** container
- **Parent:** Card8
- **Children:** Card8BannerText
- **Tokens:** color-banner-spec, radius-banner-top, card-banner-height
- **Content:** none

---

## Card8BannerText

- **Type:** text
- **Parent:** Card8Banner
- **Children:** none
- **Tokens:** color-text-header, font-family-body, font-size-card-banner, font-weight-bold, line-height-tight
- **Content:** [dynamic]

---

## Card8Title

- **Type:** text
- **Parent:** Card8
- **Children:** none
- **Tokens:** color-text-primary, font-family-body, font-size-card-title, font-weight-bold, line-height-tight
- **Content:** [dynamic]

---

## Card8DividerFlourish

- **Type:** image
- **Parent:** Card8
- **Children:** none
- **Tokens:** color-accent-gold
- **Content:** none
- **Asset:** card-divider-flourish

---

## Card8HeatRating

- **Type:** container
- **Parent:** Card8
- **Children:** Card8HeatIcon1, Card8HeatIcon2, Card8HeatIcon3, Card8HeatIcon4, Card8HeatIcon5
- **Tokens:** spacing-xs
- **Content:** none

---

## Card8HeatIcon1

- **Type:** icon
- **Parent:** Card8HeatRating
- **Children:** none
- **Tokens:** color-chili-filled
- **Content:** none
- **Asset:** chili-rating-icon-filled

---

## Card8HeatIcon2

- **Type:** icon
- **Parent:** Card8HeatRating
- **Children:** none
- **Tokens:** color-chili-filled
- **Content:** none
- **Asset:** chili-rating-icon-filled

---

## Card8HeatIcon3

- **Type:** icon
- **Parent:** Card8HeatRating
- **Children:** none
- **Tokens:** color-chili-empty
- **Content:** none
- **Asset:** chili-rating-icon-outline

---

## Card8HeatIcon4

- **Type:** icon
- **Parent:** Card8HeatRating
- **Children:** none
- **Tokens:** color-chili-empty
- **Content:** none
- **Asset:** chili-rating-icon-outline

---

## Card8HeatIcon5

- **Type:** icon
- **Parent:** Card8HeatRating
- **Children:** none
- **Tokens:** color-chili-empty
- **Content:** none
- **Asset:** chili-rating-icon-outline

---

## Card8Metadata

- **Type:** text
- **Parent:** Card8
- **Children:** none
- **Tokens:** color-text-secondary, font-family-body, font-size-card-metadata, font-weight-regular, line-height-normal
- **Content:** [dynamic]

---

## Card8UrlButton

- **Type:** button
- **Parent:** Card8
- **Children:** none
- **Tokens:** color-background-card-url-button, color-text-url-button, font-family-mono, font-size-card-url, radius-button-url, spacing-xs, spacing-sm
- **Content:** [dynamic]

---

## Card8CornerOrnaments

- **Type:** image
- **Parent:** Card8
- **Children:** none
- **Tokens:** color-accent-gold
- **Content:** none
- **Asset:** card-corner-ornament

---

## Card9

- **Type:** container
- **Parent:** CardRow2
- **Children:** Card9Banner, Card9Title, Card9DividerFlourish, Card9HeatRating, Card9Metadata, Card9UrlButton, Card9CornerOrnaments
- **Tokens:** color-background-card, color-border-card, radius-card, shadow-card, card-padding-horizontal, card-padding-vertical, spacing-sm
- **Content:** none

---

## Card9Banner

- **Type:** container
- **Parent:** Card9
- **Children:** Card9BannerText
- **Tokens:** color-banner-pattern, radius-banner-top, card-banner-height
- **Content:** none

---

## Card9BannerText

- **Type:** text
- **Parent:** Card9Banner
- **Children:** none
- **Tokens:** color-text-header, font-family-body, font-size-card-banner, font-weight-bold, line-height-tight
- **Content:** [dynamic]

---

## Card9Title

- **Type:** text
- **Parent:** Card9
- **Children:** none
- **Tokens:** color-text-primary, font-family-body, font-size-card-title, font-weight-bold, line-height-tight
- **Content:** [dynamic]

---

## Card9DividerFlourish

- **Type:** image
- **Parent:** Card9
- **Children:** none
- **Tokens:** color-accent-gold
- **Content:** none
- **Asset:** card-divider-flourish

---

## Card9HeatRating

- **Type:** container
- **Parent:** Card9
- **Children:** Card9HeatIcon1, Card9HeatIcon2, Card9HeatIcon3, Card9HeatIcon4, Card9HeatIcon5
- **Tokens:** spacing-xs
- **Content:** none

---

## Card9HeatIcon1

- **Type:** icon
- **Parent:** Card9HeatRating
- **Children:** none
- **Tokens:** color-chili-filled
- **Content:** none
- **Asset:** chili-rating-icon-filled

---

## Card9HeatIcon2

- **Type:** icon
- **Parent:** Card9HeatRating
- **Children:** none
- **Tokens:** color-chili-filled
- **Content:** none
- **Asset:** chili-rating-icon-filled

---

## Card9HeatIcon3

- **Type:** icon
- **Parent:** Card9HeatRating
- **Children:** none
- **Tokens:** color-chili-filled
- **Content:** none
- **Asset:** chili-rating-icon-filled

---

## Card9HeatIcon4

- **Type:** icon
- **Parent:** Card9HeatRating
- **Children:** none
- **Tokens:** color-chili-empty
- **Content:** none
- **Asset:** chili-rating-icon-outline

---

## Card9HeatIcon5

- **Type:** icon
- **Parent:** Card9HeatRating
- **Children:** none
- **Tokens:** color-chili-empty
- **Content:** none
- **Asset:** chili-rating-icon-outline

---

## Card9Metadata

- **Type:** text
- **Parent:** Card9
- **Children:** none
- **Tokens:** color-text-secondary, font-family-body, font-size-card-metadata, font-weight-regular, line-height-normal
- **Content:** [dynamic]

---

## Card9UrlButton

- **Type:** button
- **Parent:** Card9
- **Children:** none
- **Tokens:** color-background-card-url-button, color-text-url-button, font-family-mono, font-size-card-url, radius-button-url, spacing-xs, spacing-sm
- **Content:** [dynamic]

---

## Card9CornerOrnaments

- **Type:** image
- **Parent:** Card9
- **Children:** none
- **Tokens:** color-accent-gold
- **Content:** none
- **Asset:** card-corner-ornament

---

## Card10

- **Type:** container
- **Parent:** CardRow2
- **Children:** Card10Banner, Card10Title, Card10DividerFlourish, Card10HeatRating, Card10Metadata, Card10UrlButton, Card10CornerOrnaments
- **Tokens:** color-background-card, color-border-card, radius-card, shadow-card, card-padding-horizontal, card-padding-vertical, spacing-sm
- **Content:** none

---

## Card10Banner

- **Type:** container
- **Parent:** Card10
- **Children:** Card10BannerText
- **Tokens:** color-banner-philosophy, radius-banner-top, card-banner-height
- **Content:** none

---

## Card10BannerText

- **Type:** text
- **Parent:** Card10Banner
- **Children:** none
- **Tokens:** color-text-header, font-family-body, font-size-card-banner, font-weight-bold, line-height-tight
- **Content:** [dynamic]

---

## Card10Title

- **Type:** text
- **Parent:** Card10
- **Children:** none
- **Tokens:** color-text-primary, font-family-body, font-size-card-title, font-weight-bold, line-height-tight
- **Content:** [dynamic]

---

## Card10DividerFlourish

- **Type:** image
- **Parent:** Card10
- **Children:** none
- **Tokens:** color-accent-gold
- **Content:** none
- **Asset:** card-divider-flourish

---

## Card10HeatRating

- **Type:** container
- **Parent:** Card10
- **Children:** Card10HeatIcon1, Card10HeatIcon2, Card10HeatIcon3, Card10HeatIcon4, Card10HeatIcon5
- **Tokens:** spacing-xs
- **Content:** none

---

## Card10HeatIcon1

- **Type:** icon
- **Parent:** Card10HeatRating
- **Children:** none
- **Tokens:** color-chili-filled
- **Content:** none
- **Asset:** chili-rating-icon-filled

---

## Card10HeatIcon2

- **Type:** icon
- **Parent:** Card10HeatRating
- **Children:** none
- **Tokens:** color-chili-filled
- **Content:** none
- **Asset:** chili-rating-icon-filled

---

## Card10HeatIcon3

- **Type:** icon
- **Parent:** Card10HeatRating
- **Children:** none
- **Tokens:** color-chili-filled
- **Content:** none
- **Asset:** chili-rating-icon-filled

---

## Card10HeatIcon4

- **Type:** icon
- **Parent:** Card10HeatRating
- **Children:** none
- **Tokens:** color-chili-filled
- **Content:** none
- **Asset:** chili-rating-icon-filled

---

## Card10HeatIcon5

- **Type:** icon
- **Parent:** Card10HeatRating
- **Children:** none
- **Tokens:** color-chili-empty
- **Content:** none
- **Asset:** chili-rating-icon-outline

---

## Card10Metadata

- **Type:** text
- **Parent:** Card10
- **Children:** none
- **Tokens:** color-text-secondary, font-family-body, font-size-card-metadata, font-weight-regular, line-height-normal
- **Content:** [dynamic]

---

## Card10UrlButton

- **Type:** button
- **Parent:** Card10
- **Children:** none
- **Tokens:** color-background-card-url-button, color-text-url-button, font-family-mono, font-size-card-url, radius-button-url, spacing-xs, spacing-sm
- **Content:** [dynamic]

---

## Card10CornerOrnaments

- **Type:** image
- **Parent:** Card10
- **Children:** none
- **Tokens:** color-accent-gold
- **Content:** none
- **Asset:** card-corner-ornament
