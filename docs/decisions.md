# Decisions register

These are the decisions BCJS owes the build. Each one names what it blocks and when it is needed. D1–D8 come from Sean's Build Programme; D9–D17 are new and arise from the Microsoft 365, Xero and AI scope in the [delivery plan](delivery-plan.md).

> **Release to phase mapping (fast-track plan):** R0–R1 plus the cost-control parts of R4 make up the **Phase 1 MVP (weeks 1–4)**. R2 becomes **Phase 2 (weeks 5–8)**. R3 and the cash, Xero-write and invoice-scanning parts of R4 become **Phase 3 (weeks 9–12)**. R5–R6 become **Phase 4 (weeks 13–18)**. Decisions marked "R1 start" or "During R2" (D1, D3, D4, D9, D12) are now needed in **MVP week 1**.

Status key: **Open** = not yet discussed · **Proposed** = recommendation made, awaiting BCJS · **Agreed** = signed off (record who and when).

| # | Decision | Recommendation | Owner (BCJS) | Needed by | Blocks | Status |
|---|---|---|---|---|---|---|
| D1 | Backup & recovery approach (Sean 1g) | Azure Database for PostgreSQL point-in-time restore (35 days) plus geo-redundant backup to a second UK region, with a quarterly restore rehearsal onto scratch. This covers Sean's options 1–3 without running a VPS | Emma | R1 start | §1 | Proposed |
| D2 | Offline pricing approach (Sean 5d) | Start with option 2: Excel export and re-import, with the server recalculating every figure on the way back. Add a full offline estimating PWA (option 1) after R4 if estimators still need it | James (QS) | R2 mid | §5 | Proposed |
| D3 | Cost code structure (Sean 9a) | A two-level code (package + element, e.g. `JOI-04`) aligned to Xero account codes and the estimate packages. Draft it in R0 workshops | James, Rhian | During R2 | §9, §10, §11 | Open |
| D4 | Approval limits by value (Sean 10a) | Site Manager ≤ £2.5k · PM ≤ £10k · QS + PM ≤ £50k · Director above that. Mirror the limits as Teams approval routing | Emma | During R2 | §10 | Proposed |
| D5 | Invoice scanner (Sean 10f) | Option 2, an AI service (Claude vision) with a learning loop. Corrections are stored per supplier as examples, a person confirms every figure, and extracted text is purged on a retention clock | Rhian | R4 start | §10 | Proposed |
| D6 | Handover pack contents per job type (Sean 15a) | BCJS writes one list each for extension, conversion, heritage, kitchen & bath and new build. The system assembles the pack from SharePoint | Lucy | R5 start | §15 | Open |
| D7 | Standard retention terms (Sean 16a) | Typically 5% retention, half released at practical completion and the rest at the end of a 12-month defects period. Confirm against the JCT forms BCJS uses | Emma | R5 start | §16 | Open |
| D8 | How long closed records are kept (Sean 16/19) | Financial records 6 years plus the current year (HMRC). Contract records 6 years (simple contract) or 12 years (deed). H&S records per HSE guidance. Personal data minimised after that | Emma | R5 start | §16, §19 | Open |
| D9 | File store: SharePoint or Azure Blob | **SharePoint** per-project libraries, so files are visible in Teams and Explorer; the OCS holds the register, versions and permissions. Blob only for system artefacts such as exports and snapshots | Lucy | R1 start | §1 document register | Proposed |
| D10 | Where supplier bills are entered | Keep Xero as the place of entry if Finance prefers (the OCS reads bills back and matches them to POs), or move entry into the OCS with AI scanning and push to Xero. Both are supported; pick one as the default | Rhian | R4 start | §10, §11 | Open |
| D11 | Xero API tier and app terms | Check Xero's current developer pricing tiers and certification requirements for a single-org custom connection before R4 | Stuart | R3 end | §11 | Open |
| D12 | Microsoft 365 licence level | Teams Essentials has no Teams-connected SharePoint sites per team. Confirm whether BCJS moves to Microsoft 365 Business Standard or Premium; Premium adds Intune and conditional access | Emma | R1 start | Teams channels, approvals | Open |
| D13 | Kabyn and Briefcase | **Kabyn: replace** it with the OCS Tools & Equipment module in Phase 2, migrating its 589 records with bulk items grouped. Briefcase is still to be audited in MVP week 1 | Lucy | Kabyn: agreed scope; Briefcase: MVP week 1 | Scope | Kabyn: Proposed (23 Oct); Briefcase: Open |
| D14 | Claude hosting route and data residency | Use the Anthropic API with zero data retention, or Claude via Microsoft Foundry so it is billed through Azure. Record the choice in the DPIA | Stuart, Emma | R2 start | AI features | Open |
| D15 | Subcontractor and client identity | Entra External ID (B2B guest) for regular subcontractors; magic-link sign-in for occasional clients | Lucy | R4 start | §12 | Proposed |
| D16 | NFC site sign-on | Keep it out of the first R4 cut. Manual and PWA time entry with GPS stamp is enough to start; add NFC tags if adoption needs it | Dave (Site) | R4 mid | §12 | Proposed |
| D17 | Production web hosting | Azure UK South for everything (recommended), or the web tier on Vercel with Postgres and workers on Azure UK. The prototype uses Vercel for speed | Stuart | R0 end | §1 | Open |

**Cost codes (D3) and approval limits (D4) are needed during R2 because R3 and R4 build on them.** Raise them in the R0 workshops.
