# Summary of inputs

These are summaries of the documents BCJS shared in October 2026. The originals are not stored in this repository.

## BCJS process roadmap (Lucy Milne)

**Overall flow:** Lead enquiry → Qualification review → Tender production → Tender follow-up → Project award → Project commencement meeting → Variations → Project delivery → Project review & lessons learned.

1. **Prospecting & qualification:** enquiry received → logged → weekly review → more info needed? → customer contact → qualified? → tender production, or archive.
2. **Tender production:** gather project information → build scope, materials, labour & plant costs → internal review → approval → create tender pack ("one truth") → sign-off → submit.
3. **Tender follow-up & award:** confirm receipt → follow up → won? If no, archive & review. If yes, negotiate, agree payment schedule, contract & start date.
4. **Project delivery:** pre-commencement meeting → appoint site manager → site H&S plan → book labour, plant, tools & facilities → open site → weekly project reviews → manage risks & resources.
5. **Variations:** discuss works with client & architect → RFI to architect → architect confirms → variation register → valuation raised → payment.
6. **Close-out & continuous improvement:** completion → review financials → capture lessons learned → issue O&M manual.

**Current systems:** Xero, Microsoft 365 Business, Adobe, Microsoft Teams Essentials, Kabyn, Briefcase.

**Process mapping to the plan:** stages 1–3 map to R2 (Win work), stage 4's pre-start to R3, delivery and variations to R4, and close-out to R5–R6. Weekly project reviews are served by the dashboard and CVR period lock.

## Sean: Build Programme & Technical Implementation Order

There are 20 sections (§0–§19), 6 releases and 28 build steps in dependency order. Each section is "finished when a real job can pass through it end to end, in front of a witness, without anyone opening a spreadsheet or the database."

- **§0** Per-page snag log and context document.
- **R1** §1 infrastructure (VPS, Node 24, nginx, PostgreSQL, RLS, backups, staging, Sentry, CI/CD, versioned document register) · §2 roles, permission keys, append-only audit · §3 stage gate engine with overrides.
- **R2** §4 enquiries & site survey · §5 QS estimating (rate card, calculation engine, versions, offline pricing decision, legacy import) · §6 quotes & client responses · §7 award gate and estimate-to-budget carry.
- **R3** §8 H&S & compliance registers · §9 cost codes, budget baseline, readiness checklist, start-on-site gate, procurement plan.
- **R4** §10 POs, approval bands, goods receipt, invoice scanner, variations, applications/CVR, site diary · §11 Xero · §12 time on site (NFC nice-to-have) · §13 cash flow (stages, committed outflows, RAG, scenarios).
- **R5** §14 snagging · §15 handover packs · §16 final account & retention.
- **R6** §17 lost work & win/loss · §18 reporting, notifications, MFA, E2E tests · §19 GDPR tooling.
- **Security checklist** covering auth, tenant isolation, access control, input validation, secrets, documents, money (whole pence), integrations & AI, infrastructure and monitoring.
- **Decisions owed:** backups, offline pricing, cost codes, approval limits, invoice scanner, handover pack contents, retention terms, record-keeping periods.

**What we keep:** the release structure, gates, audit, money rules, security checklist and the "witness" definition of done. **What we change:** hosting on Azure UK South instead of a self-managed VPS; Entra ID SSO instead of custom passwords and MFA; SharePoint-backed document storage; Teams and Outlook native workflows; an AI layer across the lifecycle.

## Marco: Concept Showcase

The showcase sets out 16 modules over 6 months for **£20,000** (hosting extra), in four delivery stages. Concept screens:

- Director dashboard ("£11,400 caught in week 3", committed spend, forecast margin, variations pending, 30-day cash, certificates expiring, needs-attention list)
- Cost report by project, phase and category
- Commercial & QS: CVR locked per period, variation register (approved, pending, disputed)
- Procurement & Xero feed: POs against cost codes, Xero invoices matched, price variance flagged
- 13-week cash flow with saved scenarios
- Site PWA: today's work, time against cost code, evidence gate (photos + RAMS sign-on), offline sync

Brand cues: lime `#9BBA3C` on near-black `#1F1F1F`, slate greens, uppercase headings.

**What we keep:** the UX direction and screens, which the prototype builds on. **Our view on the commercials:** £20k for this scope is not credible; see delivery plan §7.

## Construction AI (benchmark)

Construction AI is a construction platform that combines CRM, ERP, project management and AI.

- **CRM:** enquiries & tenders, subcontractor management, bid comparison, correspondence, AI-drafted communications.
- **ERP:** financials, main contracts & subcontracts, payment applications, variations, CVR, commercial controls.
- **Project management:** drawings (title-block reading, superseded revisions), RFIs, RAMS, programmes (Gantt, critical path), specifications, submittals, site diaries (dictated), inspections, snagging.
- **AI:** an assistant with 120+ tools and 14 modes, semantic search, dictation and document export; it works alongside Claude and Microsoft 365 Copilot; open API.

No accounting integrations are named publicly, and pricing is by quote.
