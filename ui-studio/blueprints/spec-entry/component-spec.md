# Component Spec — spec-entry

Screen: **SPICY SPECS — Chat Streaming with SSE**
Containment overlay: 45 components, 100% pixel coverage confirmed.
No nav-shell.md found — all components are local to this screen.

---

## SpecEntryScreen

- **Type:** container
- **Parent:** none (root)
- **Children:** BrandingHeader, NavTitleSection, ArchitectureSection, DesignDecisionsSection, InvariantsSection, AntiPatternSection
- **Tokens:** color-background-screen, sepia-paper-texture (see assets)
- **Content:** [dynamic — spec document content]
- **Asset:** sepia-paper-texture
- **Scope:** local

---

## BrandingHeader

- **Type:** container
- **Parent:** SpecEntryScreen
- **Children:** BrandingFiligree, DiamondLogo, BrandingTitle
- **Tokens:** color-background-banner, padding-banner-inner, radius-banner
- **Content:** none (decorative container)

---

## BrandingFiligree

- **Type:** image
- **Parent:** BrandingHeader
- **Children:** none
- **Tokens:** color-decorative-filigree
- **Content:** none
- **Asset:** ornate-filigree-header

---

## DiamondLogo

- **Type:** container
- **Parent:** BrandingHeader
- **Children:** ChiliLogoIcon
- **Tokens:** shadow-emblem, color-background-banner
- **Content:** none

---

## ChiliLogoIcon

- **Type:** icon
- **Parent:** DiamondLogo
- **Children:** none
- **Tokens:** color-text-on-dark
- **Content:** none
- **Asset:** chili-pepper-logo

---

## BrandingTitle

- **Type:** text
- **Parent:** BrandingHeader
- **Children:** none
- **Tokens:** font-family-brand, font-size-brand, font-weight-bold, color-text-branding, text-transform-heading
- **Content:** "SPICY SPECS"

---

## NavTitleSection

- **Type:** container
- **Parent:** SpecEntryScreen
- **Children:** BreadcrumbRow, SpecMainTitle, SpecSubtitleRow, SpecNumberRow, FrontCodeBanner
- **Tokens:** color-background-screen, spacing-xl, margin-screen-outer, gap-breadcrumb-title
- **Content:** none

---

## BreadcrumbRow

- **Type:** text
- **Parent:** NavTitleSection
- **Children:** none
- **Tokens:** font-family-body, font-size-breadcrumb, font-weight-medium, color-text-breadcrumb, text-transform-breadcrumb, letter-spacing-heading
- **Content:** "Project / spec / chat-streaming-css"

---

## SpecMainTitle

- **Type:** text
- **Parent:** NavTitleSection
- **Children:** none
- **Tokens:** font-family-display, font-size-title, font-weight-black, color-text-primary, text-transform-heading
- **Content:** "CHAT STREAMING WITH SSE"

---

## SpecSubtitleRow

- **Type:** container
- **Parent:** NavTitleSection
- **Children:** SpecSubtitleText, ChiliRatingIcon
- **Tokens:** color-background-screen, spacing-xs
- **Content:** none

---

## SpecSubtitleText

- **Type:** text
- **Parent:** SpecSubtitleRow
- **Children:** none
- **Tokens:** font-family-heading, font-size-label, font-weight-bold, color-text-primary, text-transform-heading
- **Content:** "REST SERVER"

---

## ChiliRatingIcon

- **Type:** icon
- **Parent:** SpecSubtitleRow
- **Children:** none
- **Tokens:** color-accent-chili
- **Content:** [dynamic — repeated 5 times for heat score]
- **Asset:** chili-pepper-rating

---

## SpecNumberRow

- **Type:** text
- **Parent:** NavTitleSection
- **Children:** none
- **Tokens:** font-family-heading, font-size-label, font-weight-semibold, color-text-secondary, text-transform-heading
- **Content:** "SPEC: 18.402.9"

---

## FrontCodeBanner

- **Type:** container
- **Parent:** NavTitleSection
- **Children:** FrontCodeText
- **Tokens:** color-background-panel, radius-panel, padding-table-cell, spacing-xs
- **Content:** none

---

## FrontCodeText

- **Type:** text
- **Parent:** FrontCodeBanner
- **Children:** none
- **Tokens:** font-family-mono, font-size-code, font-weight-regular, color-text-code
- **Content:** [dynamic — spec federation URL/hash, e.g. "FEDERATED: http-spec-chat-streaming-on-se"]

---

## ArchitectureSection

- **Type:** container
- **Parent:** SpecEntryScreen
- **Children:** ArchSectionHeader, ArchFlowchart
- **Tokens:** color-background-screen, spacing-xl, margin-screen-outer
- **Content:** none

---

## ArchSectionHeader

- **Type:** container
- **Parent:** ArchitectureSection
- **Children:** ArchSectionDividerLine, ArchSectionLabel
- **Tokens:** color-border-divider, spacing-sm
- **Content:** none

---

## ArchSectionDividerLine

- **Type:** container
- **Parent:** ArchSectionHeader
- **Children:** DiamondDividerLeft, DiamondDividerRight
- **Tokens:** color-border-divider
- **Content:** none
- **Asset:** diamond-divider

---

## DiamondDividerLeft

- **Type:** icon
- **Parent:** ArchSectionDividerLine
- **Children:** none
- **Tokens:** color-text-secondary
- **Asset:** diamond-divider

---

## DiamondDividerRight

- **Type:** icon
- **Parent:** ArchSectionDividerLine
- **Children:** none
- **Tokens:** color-text-secondary
- **Asset:** diamond-divider

---

## ArchSectionLabel

- **Type:** text
- **Parent:** ArchSectionHeader
- **Children:** none
- **Tokens:** font-family-heading, font-size-section-heading, font-weight-bold, color-text-primary, letter-spacing-heading, text-transform-heading
- **Content:** "ARCHITECTURE"

---

## ArchFlowchart

- **Type:** container
- **Parent:** ArchitectureSection
- **Children:** ArchBox1, ArchArrow1, ArchBox2, ArchArrow2, ArchBox3, ArchArrow3, ArchBox4, ArchArrow4, ArchBox5
- **Tokens:** color-background-screen, spacing-xs
- **Content:** none

---

## ArchBox1

- **Type:** container
- **Parent:** ArchFlowchart
- **Children:** ArchBoxLabel1
- **Tokens:** color-background-panel, radius-flowbox, padding-table-cell
- **Content:** none

---

## ArchBoxLabel1

- **Type:** text
- **Parent:** ArchBox1
- **Children:** none
- **Tokens:** font-family-heading, font-size-flow-label, font-weight-medium, color-text-on-dark, text-transform-heading
- **Content:** "Client"

---

## ArchBox2

- **Type:** container
- **Parent:** ArchFlowchart
- **Children:** ArchBoxLabel2
- **Tokens:** color-background-panel, radius-flowbox, padding-table-cell
- **Content:** none

---

## ArchBoxLabel2

- **Type:** text
- **Parent:** ArchBox2
- **Children:** none
- **Tokens:** font-family-heading, font-size-flow-label, font-weight-medium, color-text-on-dark, text-transform-heading
- **Content:** "Load Balancer"

---

## ArchBox3

- **Type:** container
- **Parent:** ArchFlowchart
- **Children:** ArchBoxLabel3
- **Tokens:** color-background-panel, radius-flowbox, padding-table-cell
- **Content:** none

---

## ArchBoxLabel3

- **Type:** text
- **Parent:** ArchBox3
- **Children:** none
- **Tokens:** font-family-heading, font-size-flow-label, font-weight-medium, color-text-on-dark, text-transform-heading
- **Content:** "Server"

---

## ArchBox4

- **Type:** container
- **Parent:** ArchFlowchart
- **Children:** ArchBoxLabel4
- **Tokens:** color-background-panel, radius-flowbox, padding-table-cell
- **Content:** none

---

## ArchBoxLabel4

- **Type:** text
- **Parent:** ArchBox4
- **Children:** none
- **Tokens:** font-family-heading, font-size-flow-label, font-weight-medium, color-text-on-dark, text-transform-heading
- **Content:** "SSE Stream"

---

## ArchBox5

- **Type:** container
- **Parent:** ArchFlowchart
- **Children:** ArchBoxLabel5
- **Tokens:** color-background-panel, radius-flowbox, padding-table-cell
- **Content:** none

---

## ArchBoxLabel5

- **Type:** text
- **Parent:** ArchBox5
- **Children:** none
- **Tokens:** font-family-heading, font-size-flow-label, font-weight-medium, color-text-on-dark, text-transform-heading
- **Content:** "Client"

---

## ArchArrow1

- **Type:** icon
- **Parent:** ArchFlowchart
- **Children:** none
- **Tokens:** color-text-secondary
- **Asset:** flowchart-arrow

---

## ArchArrow2

- **Type:** icon
- **Parent:** ArchFlowchart
- **Children:** none
- **Tokens:** color-text-secondary
- **Asset:** flowchart-arrow

---

## ArchArrow3

- **Type:** icon
- **Parent:** ArchFlowchart
- **Children:** none
- **Tokens:** color-text-secondary
- **Asset:** flowchart-arrow

---

## ArchArrow4

- **Type:** icon
- **Parent:** ArchFlowchart
- **Children:** none
- **Tokens:** color-text-secondary
- **Asset:** flowchart-arrow

---

## DesignDecisionsSection

- **Type:** container
- **Parent:** SpecEntryScreen
- **Children:** DesignSectionHeader, DesignLeftPanel, DesignRightPanel
- **Tokens:** color-background-screen, spacing-xl, margin-screen-outer, spacing-sm
- **Content:** none

---

## DesignSectionHeader

- **Type:** container
- **Parent:** DesignDecisionsSection
- **Children:** DesignSectionDivider, DesignSectionLabel
- **Tokens:** color-border-divider, spacing-sm
- **Content:** none

---

## DesignSectionDivider

- **Type:** container
- **Parent:** DesignSectionHeader
- **Children:** none
- **Tokens:** color-border-divider
- **Asset:** diamond-divider

---

## DesignSectionLabel

- **Type:** text
- **Parent:** DesignSectionHeader
- **Children:** none
- **Tokens:** font-family-heading, font-size-section-heading, font-weight-bold, color-text-primary, letter-spacing-heading, text-transform-heading
- **Content:** "DESIGN DECISIONS"

---

## DesignLeftPanel

- **Type:** container
- **Parent:** DesignDecisionsSection
- **Children:** DesignLeftPanelBadge, DesignLeftPanelCode
- **Tokens:** color-background-panel, radius-panel, padding-code-panel
- **Content:** none

---

## DesignLeftPanelBadge

- **Type:** text
- **Parent:** DesignLeftPanel
- **Children:** none
- **Tokens:** font-family-mono, font-size-breadcrumb, font-weight-semibold, color-text-on-dark, radius-badge
- **Content:** "v1 API"

---

## DesignLeftPanelCode

- **Type:** text
- **Parent:** DesignLeftPanel
- **Children:** none
- **Tokens:** font-family-mono, font-size-code, font-weight-regular, color-text-code, spacing-xs
- **Content:** [dynamic — pseudo-code for SSE v1 implementation, e.g. "const stream = new EventSource('...');"]

---

## DesignRightPanel

- **Type:** container
- **Parent:** DesignDecisionsSection
- **Children:** DesignRightPanelBadge, DesignRightPanelCode
- **Tokens:** color-background-panel, radius-panel, padding-code-panel
- **Content:** none

---

## DesignRightPanelBadge

- **Type:** text
- **Parent:** DesignRightPanel
- **Children:** none
- **Tokens:** font-family-mono, font-size-breadcrumb, font-weight-semibold, color-accent-chili, radius-badge
- **Content:** "v2 API"

---

## DesignRightPanelCode

- **Type:** text
- **Parent:** DesignRightPanel
- **Children:** none
- **Tokens:** font-family-mono, font-size-code, font-weight-regular, color-text-code, spacing-xs
- **Content:** [dynamic — pseudo-code for SSE v2 fetch-based implementation]

---

## InvariantsSection

- **Type:** container
- **Parent:** SpecEntryScreen
- **Children:** InvariantsSectionHeader, InvariantsTable
- **Tokens:** color-background-screen, spacing-xl, margin-screen-outer
- **Content:** none

---

## InvariantsSectionHeader

- **Type:** container
- **Parent:** InvariantsSection
- **Children:** InvariantsSectionDivider, InvariantsSectionLabel
- **Tokens:** color-border-divider, spacing-sm
- **Content:** none

---

## InvariantsSectionDivider

- **Type:** container
- **Parent:** InvariantsSectionHeader
- **Children:** none
- **Tokens:** color-border-divider
- **Asset:** diamond-divider

---

## InvariantsSectionLabel

- **Type:** text
- **Parent:** InvariantsSectionHeader
- **Children:** none
- **Tokens:** font-family-heading, font-size-section-heading, font-weight-bold, color-text-primary, letter-spacing-heading, text-transform-heading
- **Content:** "INVARIANTS"

---

## InvariantsTable

- **Type:** list
- **Parent:** InvariantsSection
- **Children:** InvariantsHeaderRow, InvariantsRow1, InvariantsRow2, InvariantsRow3, InvariantsRow4
- **Tokens:** color-background-screen, color-border-divider
- **Content:** none

---

## InvariantsHeaderRow

- **Type:** container
- **Parent:** InvariantsTable
- **Children:** InvariantsHeaderLeft, InvariantsHeaderRight
- **Tokens:** color-background-section-header, radius-table-header, padding-table-cell
- **Content:** none

---

## InvariantsHeaderLeft

- **Type:** text
- **Parent:** InvariantsHeaderRow
- **Children:** none
- **Tokens:** font-family-heading, font-size-label, font-weight-bold, color-text-on-dark, text-transform-heading
- **Content:** "INVARIANT"

---

## InvariantsHeaderRight

- **Type:** text
- **Parent:** InvariantsHeaderRow
- **Children:** none
- **Tokens:** font-family-heading, font-size-label, font-weight-bold, color-text-on-dark, text-transform-heading
- **Content:** "STATUS"

---

## InvariantsRow1

- **Type:** container
- **Parent:** InvariantsTable
- **Children:** InvariantsRow1Left, InvariantsRow1Right
- **Tokens:** color-background-table-cell, padding-table-cell, color-border-divider
- **Content:** none

---

## InvariantsRow1Left

- **Type:** text
- **Parent:** InvariantsRow1
- **Children:** none
- **Tokens:** font-family-body, font-size-body, font-weight-medium, color-text-primary
- **Content:** "Connection Recovery"

---

## InvariantsRow1Right

- **Type:** text
- **Parent:** InvariantsRow1
- **Children:** none
- **Tokens:** font-family-body, font-size-body, font-weight-regular, color-text-secondary
- **Content:** "Experimental feature"

---

## InvariantsRow2

- **Type:** container
- **Parent:** InvariantsTable
- **Children:** InvariantsRow2Left, InvariantsRow2Right
- **Tokens:** color-background-table-cell, padding-table-cell, color-border-divider
- **Content:** none

---

## InvariantsRow2Left

- **Type:** text
- **Parent:** InvariantsRow2
- **Children:** none
- **Tokens:** font-family-body, font-size-body, font-weight-medium, color-text-primary
- **Content:** "Data Integrity"

---

## InvariantsRow2Right

- **Type:** text
- **Parent:** InvariantsRow2
- **Children:** none
- **Tokens:** font-family-body, font-size-body, font-weight-regular, color-text-secondary
- **Content:** "Done, no data loss"

---

## InvariantsRow3

- **Type:** container
- **Parent:** InvariantsTable
- **Children:** InvariantsRow3Left, InvariantsRow3Right
- **Tokens:** color-background-table-cell, padding-table-cell, color-border-divider
- **Content:** none

---

## InvariantsRow3Left

- **Type:** text
- **Parent:** InvariantsRow3
- **Children:** none
- **Tokens:** font-family-body, font-size-body, font-weight-medium, color-text-primary
- **Content:** "Error Propagation"

---

## InvariantsRow3Right

- **Type:** text
- **Parent:** InvariantsRow3
- **Children:** none
- **Tokens:** font-family-body, font-size-body, font-weight-regular, color-text-secondary
- **Content:** "Settled & clear"

---

## InvariantsRow4

- **Type:** container
- **Parent:** InvariantsTable
- **Children:** InvariantsRow4Left, InvariantsRow4Right
- **Tokens:** color-background-table-cell, padding-table-cell, color-border-divider
- **Content:** none

---

## InvariantsRow4Left

- **Type:** text
- **Parent:** InvariantsRow4
- **Children:** none
- **Tokens:** font-family-body, font-size-body, font-weight-medium, color-text-primary
- **Content:** "State Management"

---

## InvariantsRow4Right

- **Type:** text
- **Parent:** InvariantsRow4
- **Children:** none
- **Tokens:** font-family-body, font-size-body, font-weight-regular, color-text-secondary
- **Content:** "Clear on client"

---

## AntiPatternSection

- **Type:** container
- **Parent:** SpecEntryScreen
- **Children:** AntiPatternSectionHeader, AntiPatternTable, BottomPadding
- **Tokens:** color-background-screen, spacing-xl, margin-screen-outer
- **Content:** none

---

## AntiPatternSectionHeader

- **Type:** container
- **Parent:** AntiPatternSection
- **Children:** AntiPatternSectionDivider, AntiPatternSectionLabel
- **Tokens:** color-border-divider, spacing-sm
- **Content:** none

---

## AntiPatternSectionDivider

- **Type:** container
- **Parent:** AntiPatternSectionHeader
- **Children:** none
- **Tokens:** color-border-divider
- **Asset:** diamond-divider

---

## AntiPatternSectionLabel

- **Type:** text
- **Parent:** AntiPatternSectionHeader
- **Children:** none
- **Tokens:** font-family-heading, font-size-section-heading, font-weight-bold, color-text-primary, letter-spacing-heading, text-transform-heading
- **Content:** "ANTI-PATTERN REGISTRY"

---

## AntiPatternTable

- **Type:** list
- **Parent:** AntiPatternSection
- **Children:** AntiPatternTableHeader, AntiPatternRow1, AntiPatternRow2, AntiPatternRow3, AntiPatternRow4
- **Tokens:** color-background-screen, color-border-divider
- **Content:** none

---

## AntiPatternTableHeader

- **Type:** container
- **Parent:** AntiPatternTable
- **Children:** AntiPatternHeaderName, AntiPatternHeaderDesc, AntiPatternHeaderSeverity
- **Tokens:** color-background-section-header, radius-table-header, padding-table-cell
- **Content:** none

---

## AntiPatternHeaderName

- **Type:** text
- **Parent:** AntiPatternTableHeader
- **Children:** none
- **Tokens:** font-family-heading, font-size-label, font-weight-bold, color-text-on-dark, text-transform-heading
- **Content:** "NAME"

---

## AntiPatternHeaderDesc

- **Type:** text
- **Parent:** AntiPatternTableHeader
- **Children:** none
- **Tokens:** font-family-heading, font-size-label, font-weight-bold, color-text-on-dark, text-transform-heading
- **Content:** "DESCRIPTION"

---

## AntiPatternHeaderSeverity

- **Type:** text
- **Parent:** AntiPatternTableHeader
- **Children:** none
- **Tokens:** font-family-heading, font-size-label, font-weight-bold, color-text-on-dark, text-transform-heading
- **Content:** "SEVERITY"

---

## AntiPatternRow1

- **Type:** container
- **Parent:** AntiPatternTable
- **Children:** AntiPatternRow1Name, AntiPatternRow1Desc, BadgeHigh1
- **Tokens:** color-background-table-cell, padding-table-cell, color-border-divider
- **Content:** none

---

## AntiPatternRow1Name

- **Type:** text
- **Parent:** AntiPatternRow1
- **Children:** none
- **Tokens:** font-family-body, font-size-body, font-weight-medium, color-text-primary
- **Content:** "Polling Fallback"

---

## AntiPatternRow1Desc

- **Type:** text
- **Parent:** AntiPatternRow1
- **Children:** none
- **Tokens:** font-family-body, font-size-body, font-weight-regular, color-text-secondary
- **Content:** [dynamic — description of polling fallback anti-pattern]

---

## BadgeHigh1

- **Type:** container
- **Parent:** AntiPatternRow1
- **Children:** BadgeHigh1Text
- **Tokens:** color-badge-high, radius-badge, padding-table-cell, spacing-xs
- **Content:** none

---

## BadgeHigh1Text

- **Type:** text
- **Parent:** BadgeHigh1
- **Children:** none
- **Tokens:** font-family-heading, font-size-badge, font-weight-black, color-text-primary, text-transform-badge
- **Content:** "HIGH"

---

## AntiPatternRow2

- **Type:** container
- **Parent:** AntiPatternTable
- **Children:** AntiPatternRow2Name, AntiPatternRow2Desc, BadgeMedium
- **Tokens:** color-background-table-cell, padding-table-cell, color-border-divider
- **Content:** none

---

## AntiPatternRow2Name

- **Type:** text
- **Parent:** AntiPatternRow2
- **Children:** none
- **Tokens:** font-family-body, font-size-body, font-weight-medium, color-text-primary
- **Content:** "Chat Pollution"

---

## AntiPatternRow2Desc

- **Type:** text
- **Parent:** AntiPatternRow2
- **Children:** none
- **Tokens:** font-family-body, font-size-body, font-weight-regular, color-text-secondary
- **Content:** [dynamic — description of chat pollution anti-pattern]

---

## BadgeMedium

- **Type:** container
- **Parent:** AntiPatternRow2
- **Children:** BadgeMediumText
- **Tokens:** color-badge-medium, radius-badge, padding-table-cell, spacing-xs
- **Content:** none

---

## BadgeMediumText

- **Type:** text
- **Parent:** BadgeMedium
- **Children:** none
- **Tokens:** font-family-heading, font-size-badge, font-weight-black, color-text-primary, text-transform-badge
- **Content:** "MEDIUM"

---

## AntiPatternRow3

- **Type:** container
- **Parent:** AntiPatternTable
- **Children:** AntiPatternRow3Name, AntiPatternRow3Desc, BadgeLow
- **Tokens:** color-background-table-cell, padding-table-cell, color-border-divider
- **Content:** none

---

## AntiPatternRow3Name

- **Type:** text
- **Parent:** AntiPatternRow3
- **Children:** none
- **Tokens:** font-family-body, font-size-body, font-weight-medium, color-text-primary
- **Content:** "Over-fetching"

---

## AntiPatternRow3Desc

- **Type:** text
- **Parent:** AntiPatternRow3
- **Children:** none
- **Tokens:** font-family-body, font-size-body, font-weight-regular, color-text-secondary
- **Content:** [dynamic — description of over-fetching anti-pattern]

---

## BadgeLow

- **Type:** container
- **Parent:** AntiPatternRow3
- **Children:** BadgeLowText
- **Tokens:** color-badge-low, radius-badge, padding-table-cell, spacing-xs
- **Content:** none

---

## BadgeLowText

- **Type:** text
- **Parent:** BadgeLow
- **Children:** none
- **Tokens:** font-family-heading, font-size-badge, font-weight-black, color-text-primary, text-transform-badge
- **Content:** "LOW"

---

## AntiPatternRow4

- **Type:** container
- **Parent:** AntiPatternTable
- **Children:** AntiPatternRow4Name, AntiPatternRow4Desc, BadgeHigh2
- **Tokens:** color-background-table-cell, padding-table-cell, color-border-divider
- **Content:** none

---

## AntiPatternRow4Name

- **Type:** text
- **Parent:** AntiPatternRow4
- **Children:** none
- **Tokens:** font-family-body, font-size-body, font-weight-medium, color-text-primary
- **Content:** "Connection Leaks"

---

## AntiPatternRow4Desc

- **Type:** text
- **Parent:** AntiPatternRow4
- **Children:** none
- **Tokens:** font-family-body, font-size-body, font-weight-regular, color-text-secondary
- **Content:** [dynamic — description of connection leaks anti-pattern]

---

## BadgeHigh2

- **Type:** container
- **Parent:** AntiPatternRow4
- **Children:** BadgeHigh2Text
- **Tokens:** color-badge-high, radius-badge, padding-table-cell, spacing-xs
- **Content:** none

---

## BadgeHigh2Text

- **Type:** text
- **Parent:** BadgeHigh2
- **Children:** none
- **Tokens:** font-family-heading, font-size-badge, font-weight-black, color-text-primary, text-transform-badge
- **Content:** "HIGH"

---

## BottomPadding

- **Type:** container
- **Parent:** AntiPatternSection
- **Children:** none
- **Tokens:** color-background-screen, spacing-xl
- **Content:** none
