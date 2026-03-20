# Component Spec — Reference Entry (Spicy Specs Reference Collection)

> No nav-shell.md found — all components are local to this screen.
> 45 components. Single root: `DocumentScreen`.

---

## DocumentScreen

- **Type:** container
- **Parent:** none (root)
- **Children:** HeaderBanner, BreadcrumbNav, TitleSection, SeparatorLine2, ArchitectureSection, FileMapSection, ComponentBreakdownSection, InvariantsSection, DocumentFooter
- **Tokens:** color-background-screen
- **Content:** none
- **Scope:** local

---

## HeaderBanner

- **Type:** container
- **Parent:** DocumentScreen
- **Children:** SpicySpecsLogo, ChiliPepperIllustration, Est2023Badge
- **Tokens:** color-banner-header, spacing-banner-padding, border-radius-banner
- **Content:** none
- **Asset:** header-banner-bg

---

## SpicySpecsLogo

- **Type:** container
- **Parent:** HeaderBanner
- **Children:** SpicySpecsTitleText
- **Tokens:** color-banner-header, font-family-title-spicy, font-size-title-spicy, font-weight-bold, color-text-header
- **Content:** "SPICY SPECS"

---

## SpicySpecsTitleText

- **Type:** text
- **Parent:** SpicySpecsLogo
- **Children:** none
- **Tokens:** font-family-title-spicy, font-size-title-spicy, font-weight-bold, color-text-header
- **Content:** "SPICY SPECS"

---

## ChiliPepperIllustration

- **Type:** image
- **Parent:** HeaderBanner
- **Children:** none
- **Tokens:** none
- **Content:** none
- **Asset:** chili-pepper-illustration

---

## Est2023Badge

- **Type:** container
- **Parent:** HeaderBanner
- **Children:** Est2023Text
- **Tokens:** color-banner-header, border-radius-badge, spacing-xs
- **Content:** none

---

## Est2023Text

- **Type:** text
- **Parent:** Est2023Badge
- **Children:** none
- **Tokens:** font-family-banner, font-size-banner, font-weight-bold, color-text-header, letter-spacing-banner
- **Content:** "EST. 2023"

---

## BreadcrumbNav

- **Type:** container
- **Parent:** DocumentScreen
- **Children:** BreadcrumbText, SeparatorLine1
- **Tokens:** color-background-screen, spacing-document-padding-x, spacing-section-padding-y
- **Content:** none

---

## BreadcrumbText

- **Type:** text
- **Parent:** BreadcrumbNav
- **Children:** none
- **Tokens:** font-family-breadcrumb, font-size-breadcrumb, font-weight-medium, color-text-breadcrumb, letter-spacing-banner
- **Content:** "HOME > REFERENCE APP > SAAS APP SHELL"

---

## SeparatorLine1

- **Type:** container
- **Parent:** BreadcrumbNav
- **Children:** none
- **Tokens:** color-border
- **Content:** none

---

## TitleSection

- **Type:** container
- **Parent:** DocumentScreen
- **Children:** ReserveVarietyBadge, AppTitleText, SpicinessRating, ProductCodeBanner
- **Tokens:** color-background-screen, spacing-document-padding-x, spacing-section-padding-y
- **Content:** none

---

## ReserveVarietyBadge

- **Type:** container
- **Parent:** TitleSection
- **Children:** ReserveVarietyText
- **Tokens:** color-accent-primary, border-radius-banner, spacing-banner-padding
- **Content:** none

---

## ReserveVarietyText

- **Type:** text
- **Parent:** ReserveVarietyBadge
- **Children:** none
- **Tokens:** font-family-banner, font-size-banner, font-weight-bold, color-text-header, letter-spacing-banner
- **Content:** "RESERVE VARIETY"

---

## AppTitleText

- **Type:** text
- **Parent:** TitleSection
- **Children:** none
- **Tokens:** font-family-title-saas, font-size-title-saas, font-weight-bold, color-text-primary
- **Content:** "SAAS APP SHELL"

---

## SpicinessRating

- **Type:** container
- **Parent:** TitleSection
- **Children:** ChiliRatingIcon1, ChiliRatingIcon2, ChiliRatingIcon3, ChiliRatingIcon4, ChiliRatingIcon5
- **Tokens:** spacing-xs
- **Content:** none

---

## ChiliRatingIcon1

- **Type:** icon
- **Parent:** SpicinessRating
- **Children:** none
- **Tokens:** color-accent-primary
- **Content:** none
- **Asset:** chili-icon-filled

---

## ChiliRatingIcon2

- **Type:** icon
- **Parent:** SpicinessRating
- **Children:** none
- **Tokens:** color-accent-primary
- **Content:** none
- **Asset:** chili-icon-filled

---

## ChiliRatingIcon3

- **Type:** icon
- **Parent:** SpicinessRating
- **Children:** none
- **Tokens:** color-accent-primary
- **Content:** none
- **Asset:** chili-icon-filled

---

## ChiliRatingIcon4

- **Type:** icon
- **Parent:** SpicinessRating
- **Children:** none
- **Tokens:** color-accent-primary
- **Content:** none
- **Asset:** chili-icon-filled

---

## ChiliRatingIcon5

- **Type:** icon
- **Parent:** SpicinessRating
- **Children:** none
- **Tokens:** color-border
- **Content:** none
- **Asset:** chili-icon-outline

---

## ProductCodeBanner

- **Type:** container
- **Parent:** TitleSection
- **Children:** ProductCodeText
- **Tokens:** color-banner-product-code, border-radius-banner, spacing-banner-padding
- **Content:** none

---

## ProductCodeText

- **Type:** text
- **Parent:** ProductCodeBanner
- **Children:** none
- **Tokens:** font-family-banner, font-size-banner, font-weight-bold, color-text-header, letter-spacing-banner
- **Content:** "PRODUCT CODE: SPICY SPECS REF-SAAS // V 1.5 // EST. 2023"

---

## SeparatorLine2

- **Type:** container
- **Parent:** DocumentScreen
- **Children:** none
- **Tokens:** color-border
- **Content:** none

---

## ArchitectureSection

- **Type:** container
- **Parent:** DocumentScreen
- **Children:** ArchitectureHeading, ArchitectureDiagram, SeparatorLine3
- **Tokens:** color-background-screen, spacing-document-padding-x, spacing-section-padding-y
- **Content:** none

---

## ArchitectureHeading

- **Type:** container
- **Parent:** ArchitectureSection
- **Children:** ArchitectureHeadingText
- **Tokens:** font-family-heading, font-size-heading, font-weight-bold, color-text-primary
- **Content:** none
- **Asset:** ornamental-flourish

---

## ArchitectureHeadingText

- **Type:** text
- **Parent:** ArchitectureHeading
- **Children:** none
- **Tokens:** font-family-heading, font-size-heading, font-weight-bold, color-text-primary, letter-spacing-banner
- **Content:** "ARCHITECTURE"

---

## ArchitectureDiagram

- **Type:** container
- **Parent:** ArchitectureSection
- **Children:** FrontendClientNode, DNSNode, LoadBalancerNode, AuthServiceNode, CoreAPINode, DatabaseNode
- **Tokens:** color-background-screen, spacing-section-padding-y
- **Content:** none

---

## FrontendClientNode

- **Type:** container
- **Parent:** ArchitectureDiagram
- **Children:** FrontendClientLabel
- **Tokens:** color-node-background, color-node-border, border-radius-node, spacing-table-cell-padding
- **Content:** none

---

## FrontendClientLabel

- **Type:** text
- **Parent:** FrontendClientNode
- **Children:** none
- **Tokens:** font-family-body, font-size-body, font-weight-regular, color-text-primary
- **Content:** "Frontend Client"

---

## DNSNode

- **Type:** container
- **Parent:** ArchitectureDiagram
- **Children:** DNSLabel
- **Tokens:** color-node-background, color-node-border, border-radius-node, spacing-table-cell-padding
- **Content:** none

---

## DNSLabel

- **Type:** text
- **Parent:** DNSNode
- **Children:** none
- **Tokens:** font-family-body, font-size-body, font-weight-regular, color-text-primary
- **Content:** "DNS"

---

## LoadBalancerNode

- **Type:** container
- **Parent:** ArchitectureDiagram
- **Children:** LoadBalancerLabel
- **Tokens:** color-node-background, color-node-border, border-radius-node, spacing-table-cell-padding
- **Content:** none

---

## LoadBalancerLabel

- **Type:** text
- **Parent:** LoadBalancerNode
- **Children:** none
- **Tokens:** font-family-body, font-size-body, font-weight-regular, color-text-primary
- **Content:** "Load Balancer (ALB/NLB)"

---

## AuthServiceNode

- **Type:** container
- **Parent:** ArchitectureDiagram
- **Children:** AuthServiceLabel
- **Tokens:** color-node-background, color-node-border, border-radius-node, spacing-table-cell-padding
- **Content:** none

---

## AuthServiceLabel

- **Type:** text
- **Parent:** AuthServiceNode
- **Children:** none
- **Tokens:** font-family-body, font-size-body, font-weight-regular, color-text-primary
- **Content:** "Auth Service"

---

## CoreAPINode

- **Type:** container
- **Parent:** ArchitectureDiagram
- **Children:** CoreAPILabel
- **Tokens:** color-node-background, color-node-border, border-radius-node, spacing-table-cell-padding
- **Content:** none

---

## CoreAPILabel

- **Type:** text
- **Parent:** CoreAPINode
- **Children:** none
- **Tokens:** font-family-body, font-size-body, font-weight-regular, color-text-primary
- **Content:** "Core API"

---

## DatabaseNode

- **Type:** container
- **Parent:** ArchitectureDiagram
- **Children:** DatabaseLabel
- **Tokens:** color-node-background, color-node-border, border-radius-node, spacing-table-cell-padding
- **Content:** none

---

## DatabaseLabel

- **Type:** text
- **Parent:** DatabaseNode
- **Children:** none
- **Tokens:** font-family-body, font-size-body, font-weight-regular, color-text-primary
- **Content:** "Database"

---

## SeparatorLine3

- **Type:** container
- **Parent:** ArchitectureSection
- **Children:** none
- **Tokens:** color-border
- **Content:** none

---

## FileMapSection

- **Type:** container
- **Parent:** DocumentScreen
- **Children:** FileMapHeading, FileTree, SeparatorLine4
- **Tokens:** color-background-screen, spacing-document-padding-x, spacing-section-padding-y
- **Content:** none

---

## FileMapHeading

- **Type:** container
- **Parent:** FileMapSection
- **Children:** FileMapHeadingText
- **Tokens:** font-family-heading, font-size-heading, font-weight-bold, color-text-primary
- **Content:** none
- **Asset:** ornamental-flourish

---

## FileMapHeadingText

- **Type:** text
- **Parent:** FileMapHeading
- **Children:** none
- **Tokens:** font-family-heading, font-size-heading, font-weight-bold, color-text-primary, letter-spacing-banner
- **Content:** "FILE MAP"

---

## FileTree

- **Type:** container
- **Parent:** FileMapSection
- **Children:** FileTreeContent
- **Tokens:** color-background-screen, spacing-section-padding-y, font-family-body, font-size-body
- **Content:** none

---

## FileTreeContent

- **Type:** text
- **Parent:** FileTree
- **Children:** none
- **Tokens:** font-family-body, font-size-body, font-weight-regular, color-text-primary
- **Content:** "src/ → components/ → header/, footer/ | pages/ | apt/ | utils/ | app.js | index.js | package.json"
- **Asset:** folder-icon, file-icon

---

## SeparatorLine4

- **Type:** container
- **Parent:** FileMapSection
- **Children:** none
- **Tokens:** color-border
- **Content:** none

---

## ComponentBreakdownSection

- **Type:** container
- **Parent:** DocumentScreen
- **Children:** ComponentHeading, ComponentTable, SeparatorLine5
- **Tokens:** color-background-screen, spacing-document-padding-x, spacing-section-padding-y
- **Content:** none

---

## ComponentHeading

- **Type:** container
- **Parent:** ComponentBreakdownSection
- **Children:** ComponentHeadingText
- **Tokens:** font-family-heading, font-size-heading, font-weight-bold, color-text-primary
- **Content:** none
- **Asset:** ornamental-flourish

---

## ComponentHeadingText

- **Type:** text
- **Parent:** ComponentHeading
- **Children:** none
- **Tokens:** font-family-heading, font-size-heading, font-weight-bold, color-text-primary, letter-spacing-banner
- **Content:** "COMPONENT BREAKDOWN"

---

## ComponentTable

- **Type:** container
- **Parent:** ComponentBreakdownSection
- **Children:** ComponentTableHeader, ComponentTableSeparator, ComponentTableRow1, ComponentTableRow2, ComponentTableRow3, ComponentTableRow4, ComponentTableRow5
- **Tokens:** color-node-border, color-background-screen
- **Content:** none

---

## ComponentTableHeader

- **Type:** container
- **Parent:** ComponentTable
- **Children:** none
- **Tokens:** font-family-body, font-size-body, font-weight-bold, color-text-primary, spacing-table-cell-padding, letter-spacing-banner
- **Content:** "COMPONENT | DESCRIPTION | COMPLEXITY"

---

## ComponentTableSeparator

- **Type:** container
- **Parent:** ComponentTable
- **Children:** none
- **Tokens:** color-border
- **Content:** none

---

## ComponentTableRow1

- **Type:** container
- **Parent:** ComponentTable
- **Children:** none
- **Tokens:** font-family-body, font-size-body, font-weight-regular, color-text-primary, spacing-table-cell-padding
- **Content:** "Frontend | Main user interface and client-side logic | ●●●●● 5/5"

---

## ComponentTableRow2

- **Type:** container
- **Parent:** ComponentTable
- **Children:** none
- **Tokens:** font-family-body, font-size-body, font-weight-regular, color-text-primary, spacing-table-cell-padding
- **Content:** "BFF Node.js | Backend-for-frontend service layer | ●●●●○ 4/5"

---

## ComponentTableRow3

- **Type:** container
- **Parent:** ComponentTable
- **Children:** none
- **Tokens:** font-family-body, font-size-body, font-weight-regular, color-text-primary, spacing-table-cell-padding
- **Content:** "Auth Service | Handles user authentication and authorization | ●●●●● 5/5"

---

## ComponentTableRow4

- **Type:** container
- **Parent:** ComponentTable
- **Children:** none
- **Tokens:** font-family-body, font-size-body, font-weight-regular, color-text-primary, spacing-table-cell-padding
- **Content:** "Core API | Business logic and data access layer | ●●●●○ 4/5"

---

## ComponentTableRow5

- **Type:** container
- **Parent:** ComponentTable
- **Children:** none
- **Tokens:** font-family-body, font-size-body, font-weight-regular, color-text-primary, spacing-table-cell-padding
- **Content:** "Database | Persistent data storage (PostgreSQL) | ●●●○○ 3/5"

---

## SeparatorLine5

- **Type:** container
- **Parent:** ComponentBreakdownSection
- **Children:** none
- **Tokens:** color-border
- **Content:** none

---

## InvariantsSection

- **Type:** container
- **Parent:** DocumentScreen
- **Children:** InvariantsHeading, InvariantsTable, SeparatorLine6
- **Tokens:** color-background-screen, spacing-document-padding-x, spacing-section-padding-y
- **Content:** none

---

## InvariantsHeading

- **Type:** container
- **Parent:** InvariantsSection
- **Children:** InvariantsHeadingText
- **Tokens:** font-family-heading, font-size-heading, font-weight-bold, color-text-primary
- **Content:** none
- **Asset:** ornamental-flourish

---

## InvariantsHeadingText

- **Type:** text
- **Parent:** InvariantsHeading
- **Children:** none
- **Tokens:** font-family-heading, font-size-heading, font-weight-bold, color-text-primary, letter-spacing-banner
- **Content:** "INVARIANTS"

---

## InvariantsTable

- **Type:** container
- **Parent:** InvariantsSection
- **Children:** InvariantsTableHeader, InvariantsTableSeparator, InvariantsTableRow1, InvariantsTableRow2, InvariantsTableRow3, InvariantsTableRow4
- **Tokens:** color-node-border, color-background-screen
- **Content:** none

---

## InvariantsTableHeader

- **Type:** container
- **Parent:** InvariantsTable
- **Children:** none
- **Tokens:** font-family-body, font-size-body, font-weight-bold, color-text-primary, spacing-table-cell-padding, letter-spacing-banner
- **Content:** "ID | DESCRIPTION | SEVERITY"

---

## InvariantsTableSeparator

- **Type:** container
- **Parent:** InvariantsTable
- **Children:** none
- **Tokens:** color-border
- **Content:** none

---

## InvariantsTableRow1

- **Type:** container
- **Parent:** InvariantsTable
- **Children:** SeverityBadgeHigh
- **Tokens:** font-family-body, font-size-body, font-weight-regular, color-text-primary, spacing-table-cell-padding
- **Content:** "I01 | API response time must be under 200ms"

---

## InvariantsTableRow2

- **Type:** container
- **Parent:** InvariantsTable
- **Children:** SeverityBadgeHigh
- **Tokens:** font-family-body, font-size-body, font-weight-regular, color-text-primary, spacing-table-cell-padding
- **Content:** "I02 | Database transactions must be ACID compliant"

---

## InvariantsTableRow3

- **Type:** container
- **Parent:** InvariantsTable
- **Children:** SeverityBadgeHigh
- **Tokens:** font-family-body, font-size-body, font-weight-regular, color-text-primary, spacing-table-cell-padding
- **Content:** "I03 | All sensitive data must be encrypted at rest"

---

## InvariantsTableRow4

- **Type:** container
- **Parent:** InvariantsTable
- **Children:** SeverityBadgeMed
- **Tokens:** font-family-body, font-size-body, font-weight-regular, color-text-primary, spacing-table-cell-padding
- **Content:** "I04 | Authentication tokens must expire after 24h"

---

## SeverityBadgeHigh

- **Type:** container
- **Parent:** InvariantsTableRow1
- **Children:** SeverityBadgeHighText
- **Tokens:** color-badge-high, border-radius-severity-badge, spacing-xs
- **Content:** none

---

## SeverityBadgeHighText

- **Type:** text
- **Parent:** SeverityBadgeHigh
- **Children:** none
- **Tokens:** font-family-banner, font-size-banner, font-weight-bold, color-text-header
- **Content:** "HIGH"

---

## SeverityBadgeMed

- **Type:** container
- **Parent:** InvariantsTableRow4
- **Children:** SeverityBadgeMedText
- **Tokens:** color-badge-med, border-radius-severity-badge, spacing-xs
- **Content:** none

---

## SeverityBadgeMedText

- **Type:** text
- **Parent:** SeverityBadgeMed
- **Children:** none
- **Tokens:** font-family-banner, font-size-banner, font-weight-bold, color-text-primary
- **Content:** "MED"

---

## SeparatorLine6

- **Type:** container
- **Parent:** InvariantsSection
- **Children:** none
- **Tokens:** color-border
- **Content:** none

---

## DocumentFooter

- **Type:** container
- **Parent:** DocumentScreen
- **Children:** FooterText
- **Tokens:** color-background-screen, spacing-document-padding-x, spacing-section-padding-y
- **Content:** none

---

## FooterText

- **Type:** text
- **Parent:** DocumentFooter
- **Children:** none
- **Tokens:** font-family-footer, font-size-footer, font-weight-regular, color-text-footer
- **Content:** "SPICY SPECS REFERENCE COLLECTION // 2023"
