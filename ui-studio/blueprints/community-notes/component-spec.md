# Component Spec — community-notes

> No nav-shell.md found — all components scoped as `local`.

---

## CommunityNotesScreen

- **Type:** container
- **Parent:** none (root)
- **Children:** TopDecorativeBorder, HeaderBanner, MainScrollContent, BottomDecorativeBorder
- **Tokens:** color-background-screen
- **Content:** none
- **Scope:** local

---

## TopDecorativeBorder

- **Type:** image
- **Parent:** CommunityNotesScreen
- **Children:** none
- **Tokens:** color-background-header
- **Content:** none
- **Asset:** top-decorative-border

---

## HeaderBanner

- **Type:** container
- **Parent:** CommunityNotesScreen
- **Children:** BannerScrollworkLeft, BannerDiamondEmblem, BannerScrollworkRight
- **Tokens:** color-background-header, spacing-md
- **Content:** none

---

## BannerScrollworkLeft

- **Type:** image
- **Parent:** HeaderBanner
- **Children:** none
- **Tokens:** color-text-on-dark
- **Content:** none
- **Asset:** banner-scrollwork

---

## BannerDiamondEmblem

- **Type:** container
- **Parent:** HeaderBanner
- **Children:** EmblemTextSpicy, EmblemChiliIllustration, EmblemTextSpecs
- **Tokens:** color-background-header, color-border, spacing-sm
- **Content:** none
- **Asset:** emblem-diamond-frame

---

## EmblemTextSpicy

- **Type:** text
- **Parent:** BannerDiamondEmblem
- **Children:** none
- **Tokens:** font-style-emblem, color-text-on-dark
- **Content:** "SPICY"

---

## EmblemChiliIllustration

- **Type:** image
- **Parent:** BannerDiamondEmblem
- **Children:** none
- **Tokens:** spacing-xs
- **Content:** none
- **Asset:** chili-illustration-header

---

## EmblemTextSpecs

- **Type:** text
- **Parent:** BannerDiamondEmblem
- **Children:** none
- **Tokens:** font-style-emblem, color-text-on-dark
- **Content:** "SPECS"

---

## BannerScrollworkRight

- **Type:** image
- **Parent:** HeaderBanner
- **Children:** none
- **Tokens:** color-text-on-dark
- **Content:** none
- **Asset:** banner-scrollwork

---

## MainScrollContent

- **Type:** container
- **Parent:** CommunityNotesScreen
- **Children:** InvariantsSection, SectionDivider1, CommunityNotesSection, SectionDivider2, AddNoteSection
- **Tokens:** color-background-screen, spacing-xl
- **Content:** none

---

## InvariantsSection

- **Type:** container
- **Parent:** MainScrollContent
- **Children:** InvariantsSectionTitle, InvariantsTable
- **Tokens:** color-background-screen, spacing-md, spacing-lg
- **Content:** none

---

## InvariantsSectionTitle

- **Type:** container
- **Parent:** InvariantsSection
- **Children:** none
- **Tokens:** font-style-section-title, color-text-primary, spacing-sm
- **Content:** "→ INVARIANTS ←"

---

## InvariantsTable

- **Type:** container
- **Parent:** InvariantsSection
- **Children:** TableHeaderRow, TableRow1, TableRow2, TableRow3, TableRow4
- **Tokens:** color-border, border-width-default, color-background-screen
- **Content:** none

---

## TableHeaderRow

- **Type:** container
- **Parent:** InvariantsTable
- **Children:** none
- **Tokens:** font-style-table-header, color-table-header-background, color-text-primary, spacing-table-cell
- **Content:** "ID | DESCRIPTION | SEVERITY"

---

## TableRow1

- **Type:** container
- **Parent:** InvariantsTable
- **Children:** SeverityBadgeHigh1
- **Tokens:** font-style-table-body, color-text-primary, spacing-table-cell, color-border
- **Content:** "INV-511 | Chat streaming must use SSE"

---

## SeverityBadgeHigh1

- **Type:** container
- **Parent:** TableRow1
- **Children:** none
- **Tokens:** color-severity-high, color-text-on-dark, font-style-table-header, radius-pill, spacing-sm
- **Content:** "HIGH"

---

## TableRow2

- **Type:** container
- **Parent:** InvariantsTable
- **Children:** SeverityBadgeMedium
- **Tokens:** font-style-table-body, color-text-primary, spacing-table-cell, color-border
- **Content:** "INV-509 | Auth tokens expire after 24h"

---

## SeverityBadgeMedium

- **Type:** container
- **Parent:** TableRow2
- **Children:** none
- **Tokens:** color-severity-medium, color-text-on-dark, font-style-table-header, radius-pill, spacing-sm
- **Content:** "MEDIUM"

---

## TableRow3

- **Type:** container
- **Parent:** InvariantsTable
- **Children:** SeverityBadgeLow
- **Tokens:** font-style-table-body, color-text-primary, spacing-table-cell, color-border
- **Content:** "INV-508 | API rate limit: 100 req/min"

---

## SeverityBadgeLow

- **Type:** container
- **Parent:** TableRow3
- **Children:** none
- **Tokens:** color-severity-low, color-text-on-dark, font-style-table-header, radius-pill, spacing-sm
- **Content:** "LOW"

---

## TableRow4

- **Type:** container
- **Parent:** InvariantsTable
- **Children:** SeverityBadgeHigh2
- **Tokens:** font-style-table-body, color-text-primary, spacing-table-cell, color-border
- **Content:** "INV-505 | All endpoints require HTTPS"

---

## SeverityBadgeHigh2

- **Type:** container
- **Parent:** TableRow4
- **Children:** none
- **Tokens:** color-severity-high, color-text-on-dark, font-style-table-header, radius-pill, spacing-sm
- **Content:** "HIGH"

---

## SectionDivider1

- **Type:** container
- **Parent:** MainScrollContent
- **Children:** none
- **Tokens:** color-border, border-width-default, spacing-lg
- **Content:** none

---

## CommunityNotesSection

- **Type:** container
- **Parent:** MainScrollContent
- **Children:** CommunityNotesSectionTitle, NoteCard1, NoteCard2, NoteCard3
- **Tokens:** color-background-screen, spacing-md, spacing-lg
- **Content:** none

---

## CommunityNotesSectionTitle

- **Type:** container
- **Parent:** CommunityNotesSection
- **Children:** none
- **Tokens:** font-style-section-title, color-text-primary, spacing-sm
- **Content:** "→ COMMUNITY NOTES ←"

---

## NoteCard1

- **Type:** container
- **Parent:** CommunityNotesSection
- **Children:** NoteCard1Header, NoteCard1Body
- **Tokens:** color-background-card, color-border, border-width-default, radius-md, spacing-note-card
- **Content:** none
- **Asset:** note-card-bubble-tail

---

## NoteCard1Header

- **Type:** container
- **Parent:** NoteCard1
- **Children:** NoteCard1Rating
- **Tokens:** font-style-handle, color-text-primary, spacing-xs
- **Content:** "dev_guru  2023-10-27 14:30"

---

## NoteCard1Rating

- **Type:** container
- **Parent:** NoteCard1Header
- **Children:** none
- **Tokens:** spacing-xs
- **Content:** none
- **Asset:** chili-rating-5-filled

---

## NoteCard1Body

- **Type:** text
- **Parent:** NoteCard1
- **Children:** none
- **Tokens:** font-style-note-body, color-text-primary, spacing-sm
- **Content:** "Edge case discovered — the streaming breaks when the client disconnects mid-chunk. Server doesn't clean up the SSE connection properly."

---

## NoteCard2

- **Type:** container
- **Parent:** CommunityNotesSection
- **Children:** NoteCard2Header, NoteCard2Body
- **Tokens:** color-background-card, color-border, border-width-default, radius-md, spacing-note-card
- **Content:** none

---

## NoteCard2Header

- **Type:** container
- **Parent:** NoteCard2
- **Children:** NoteCard2Rating
- **Tokens:** font-style-handle, color-text-primary, spacing-xs
- **Content:** "api_watcher  2023-10-26 09:15"

---

## NoteCard2Rating

- **Type:** container
- **Parent:** NoteCard2Header
- **Children:** none
- **Tokens:** spacing-xs
- **Content:** none
- **Asset:** chili-rating-4-filled-1-empty

---

## NoteCard2Body

- **Type:** text
- **Parent:** NoteCard2
- **Children:** none
- **Tokens:** font-style-note-body, color-text-primary, spacing-sm
- **Content:** "Confirmed on v2.3 — token refresh race condition occurs if two requests fire within 50ms of each other. Reproducible with parallel fetch."

---

## NoteCard3

- **Type:** container
- **Parent:** CommunityNotesSection
- **Children:** NoteCard3Header, NoteCard3Body
- **Tokens:** color-background-card, color-border, border-width-default, radius-md, spacing-note-card
- **Content:** none

---

## NoteCard3Header

- **Type:** container
- **Parent:** NoteCard3
- **Children:** NoteCard3Rating
- **Tokens:** font-style-handle, color-text-primary, spacing-xs
- **Content:** "spice_tester  2023-10-25 17:42"

---

## NoteCard3Rating

- **Type:** container
- **Parent:** NoteCard3Header
- **Children:** none
- **Tokens:** spacing-xs
- **Content:** none
- **Asset:** chili-rating-3-filled-2-empty

---

## NoteCard3Body

- **Type:** text
- **Parent:** NoteCard3
- **Children:** none
- **Tokens:** font-style-note-body, color-text-primary, spacing-sm
- **Content:** "Rate limiting seems inconsistent across regions. EU endpoints allow ~115 req/min while US caps at exactly 100. Worth documenting."

---

## SectionDivider2

- **Type:** container
- **Parent:** MainScrollContent
- **Children:** none
- **Tokens:** color-border, border-width-default, spacing-lg
- **Content:** none

---

## AddNoteSection

- **Type:** container
- **Parent:** MainScrollContent
- **Children:** AddNoteSectionTitle, AddNoteForm
- **Tokens:** color-background-screen, spacing-md, spacing-lg
- **Content:** none

---

## AddNoteSectionTitle

- **Type:** container
- **Parent:** AddNoteSection
- **Children:** none
- **Tokens:** font-style-section-title, color-text-primary, spacing-sm
- **Content:** "→ ADD YOUR NOTE ←"

---

## AddNoteForm

- **Type:** container
- **Parent:** AddNoteSection
- **Children:** HandleLabel, HandleInput, NoteLabel, NoteTextarea, HeatRatingLabel, HeatRatingDropdown, SubmitButton
- **Tokens:** color-background-screen, spacing-md
- **Content:** none

---

## HandleLabel

- **Type:** text
- **Parent:** AddNoteForm
- **Children:** none
- **Tokens:** font-style-form-label, color-text-primary
- **Content:** "YOUR HANDLE"

---

## HandleInput

- **Type:** input
- **Parent:** AddNoteForm
- **Children:** none
- **Tokens:** font-style-input, color-input-background, color-text-primary, color-border, border-width-default, radius-sm, spacing-form-field
- **Content:** "your handle..."

---

## NoteLabel

- **Type:** text
- **Parent:** AddNoteForm
- **Children:** none
- **Tokens:** font-style-form-label, color-text-primary
- **Content:** "YOUR NOTE"

---

## NoteTextarea

- **Type:** input
- **Parent:** AddNoteForm
- **Children:** none
- **Tokens:** font-style-input, color-input-background, color-text-primary, color-border, border-width-default, radius-sm, spacing-form-field
- **Content:** "share your findings..."

---

## HeatRatingLabel

- **Type:** text
- **Parent:** AddNoteForm
- **Children:** none
- **Tokens:** font-style-form-label, color-text-primary
- **Content:** "HEAT RATING"

---

## HeatRatingDropdown

- **Type:** input
- **Parent:** AddNoteForm
- **Children:** none
- **Tokens:** font-style-input, color-input-background, color-text-primary, color-border, border-width-default, radius-sm, spacing-form-field
- **Content:** none
- **Asset:** chili-rating-3-filled-2-empty, icon-chevron-down

---

## SubmitButton

- **Type:** button
- **Parent:** AddNoteForm
- **Children:** none
- **Tokens:** font-style-button, color-button-primary, color-text-on-dark, radius-sm, spacing-lg
- **Content:** "SUBMIT NOTE"
- **Asset:** button-decorative-corners

---

## BottomDecorativeBorder

- **Type:** image
- **Parent:** CommunityNotesScreen
- **Children:** none
- **Tokens:** color-background-header
- **Content:** none
- **Asset:** bottom-decorative-border
