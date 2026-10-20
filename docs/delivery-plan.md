# BCJS Operations Control System — Delivery Plan

_Prepared by Stuart Arthur for Bespoke Construction & Joinery Solutions Ltd (Lucy Milne, Emma Milne). Draft for discussion, 20 October 2026._

Companion documents: [decisions register](decisions.md) · [integrations](integrations.md) · [AI capabilities](ai-capabilities.md) · [summary of inputs](inputs/summary.md) · [prototype](../prototype/README.md)

## Context

Bespoke Construction & Joinery Solutions (BCJS) is an FMB-member SME contractor in Pontypool, South Wales. Its work is mainly residential: heritage and listed buildings, barn conversions, extensions, oak-frame joinery, and kitchens and bathrooms. Today the business runs on Xero, Microsoft 365 Business, Teams Essentials, Adobe, Kabyn and Briefcase, plus spreadsheets. Lucy Milne (Operations) has asked Stuart for an **Operations Control System**, with Construction AI as the benchmark. The goal is something world class that connects natively to BCJS's Microsoft 365 and Xero.

Inputs reviewed:
- **Process roadmap (BCJS):** Enquiry → Qualification → Tender → Follow-up/Award → Commencement → Delivery → Variations (RFI to architect → register → valuation → payment) → Close-out and lessons learned.
- **Sean: Build Programme and Implementation Order:** 20 sections, 6 releases, 28 steps. A strong, rigorous spec covering stage gates, an append-only audit log, money in whole pence, RLS, versioned documents, a Xero bill push, cash flow, and GDPR. It assumes a self-managed Ubuntu VPS with custom login, and has almost no AI and no Microsoft 365 integration.
- **Marco: Concept Showcase:** 16 modules in 6 months for **£20k**. Strong UX ideas: director dashboard, CVR, PO and Xero feed, 13-week cash scenarios, an offline site PWA, and an evidence gate. The brand is lime #9BBA3C on near-black #1F1F1F.
- **Construction AI (reference):** tenders with return comparison, a drawing register that reads title blocks, semantic search, a dictated site diary, RAMS from plain language, CVR, and an AI assistant with 120+ tools that works alongside Claude and Copilot.

**Recommended position:** use Sean's spec as the functional and governance backbone, Marco's screens as the UX direction, and Construction AI's AI layer as the differentiator. Rebase all of it onto BCJS's Microsoft 365 tenant (identity, documents, email, Teams) and Xero. Neither proposal does that, and it is what makes the system feel native to BCJS rather than one more tool to log into.

---

## 1. Product principles (carried into every section)

1. **One record per project.** Every role (director, QS, PM, site, finance) reads the same data.
2. **The system can refuse.** Stage gates block a job; an override needs a named person and a reason, and goes on the record (Sean §3).
3. **Xero stays the ledger.** Microsoft 365 stays the place people work: email, Teams and files live where staff already are.
4. **AI drafts, people confirm.** No AI-produced figure, document or send is trusted without a human confirming it, and every AI action is audited.
5. **Phone-first on site and offline-tolerant.** Rural Monmouthshire has poor signal.
6. **Feedback built in (Sean §0).** Every page has a snag log and a context document.
7. **Definition of done:** a real job passes through the section end to end, in front of a witness, without anyone opening a spreadsheet or the database.

## 2. Architecture

| Layer | Choice | Why (vs the proposals) |
|---|---|---|
| Hosting | **Azure UK South**: Container Apps (web, API, worker), Azure Database for PostgreSQL Flexible Server (PITR, zone-redundant option), Key Vault, Blob for system artefacts | Sits alongside the M365 tenant, keeps data in the UK, and gives managed backups and failover. This settles Sean's decision 1g without a VPS to patch |
| App | **Next.js (App Router) + TypeScript** monorepo (pnpm/turbo): `apps/web`, `apps/worker`, `packages/db` (Drizzle + SQL migrations with RLS), `packages/domain` (money, gates, CVR, cash-flow engines), `packages/integrations` (`graph`, `xero`, `adobe-sign`), `packages/ai`, `packages/ui` (shadcn/Tailwind with BCJS tokens) | One language end to end; the domain engines are pure and unit-testable |
| Database | PostgreSQL 16 + **RLS per `company_id`** + **pgvector** for semantic search; money as `bigint` pence; append-only `audit_event` table (insert-only grant) | Follows Sean §1f, §2e and the money rules |
| Identity | **Microsoft Entra ID SSO** (OIDC) for staff, with MFA and conditional access enforced by BCJS's tenant. **Entra External ID / B2B guest** (or a magic link) for subcontractors and clients | Replaces the custom password, reset and MFA work in Sean §18g, so leavers lose access the moment IT disables them in M365 |
| Authorisation | Server-side permission keys plus role matrix plus project-level access (Sean §2). Roles seeded: Owner, Admin, Finance, PM, QS, Site Manager, Subcontractor, Viewer. Entra security groups map to roles | |
| Jobs | Queue on Postgres (pg-boss) in `apps/worker`: Xero sync, Graph subscriptions, OCR/AI extraction, report generation, expiry alerts | Covers Sean §18f |
| Site app | **PWA**: installable, IndexedDB outbox, background sync, photo capture with EXIF/GPS, visible "n waiting to sync" | Marco's site app idea |
| Observability | Application Insights + Sentry, `/healthz` uptime alerts, GitHub Actions CI (lint, typecheck, unit, RLS isolation suite, Playwright E2E) → staging (`uat.bcjs.co.uk`) → production (`app.bcjs.co.uk`) with migration rollback | |

## 3. Integrations

### Microsoft 365 (via Microsoft Graph, app registration in BCJS tenant)
- **SharePoint/OneDrive: document store.** Each project gets an auto-provisioned SharePoint document library or site from a template (Drawings, RAMS, Quotes, Contracts, Photos, Handover). The app's **document register** holds metadata, versions, supersede chains and permissions (Sean §1l). Files live in SharePoint, so staff also see them in Teams and Explorer. Graph change notifications keep the register in sync. *Decision D9.*
- **Outlook/Exchange.** Quotes go out on click from a shared mailbox (`estimating@`) via Graph `sendMail`, recorded with the exact document sent (Sean §6a). A mailbox subscription files client replies against the quotation through conversation-ID and reference matching (§6f), and AI suggests the match when a reply is ambiguous.
- **Teams.** One channel per live project, auto-created at award. Notifications arrive as Adaptive Cards with **Approve/Reject in Teams** for POs, timesheets, variations and gate overrides. The OCS can sit as a Teams tab. *Check that Teams Essentials supports the needed channel and app features (D12); it may need a Business Standard licence.*
- **Calendar.** Site surveys, pre-start meetings and handovers are booked into Outlook calendars, and the meeting record links back to the job.
- **Excel.** Legacy workbook import (Sean §5i), plus estimate export and re-import for offline pricing (Sean §5d option 2). The server recalculates every import.
- **Copilot / Claude interoperability.** Expose an **MCP server** and a Copilot agent (Copilot Studio declarative agent over the same API), permission-scoped per user. This matches Construction AI's "works alongside Copilot and Claude".

### Xero (OAuth 2.0, Sean §11, extended)
- Contacts sync, matched to suppliers and clients with duplicate detection.
- **Xero Tracking Categories = Project** (and optionally Stage), so P&L by job also works inside Xero.
- Cost codes mapped to Xero account codes, validated before any push.
- **Approved bills (ACCPAY) pushed**; payments and status pulled back. **Sales invoices and applications (ACCREC) pushed** (Sean §18b, moved earlier). Xero **webhooks** for invoice and contact changes, with a nightly reconciliation job as a safety net.
- Supports both flows Marco described: bills raised in the OCS and pushed to Xero, *or* entered in Xero as today and read back and matched to a PO. *Decision D10, per Finance.*
- Rate-limit handling (60/min, 5,000/day per tenant), sync log per record, reconciliation screen; rehearsed on the Xero demo company from staging only.
- Check current Xero API pricing tiers and app partner requirements before build (D11).

### Others
- **Adobe Acrobat Sign:** client acceptance of quotes and contracts, giving the "client's written acceptance" that the award gate needs (Sean §7a), with the signed PDF filed back to the register.
- **Kabyn and Briefcase:** purpose unknown. In discovery, work out what each does and decide whether to **replace, integrate or retire** it (D13). If Briefcase handles receipts or bills, it overlaps the invoice scanner.
- **Email/SMS to non-M365 users:** via Graph from the shared mailbox; SMS (for example Twilio) only if needed for subcontractor sign-on.

## 4. AI layer: "Construction AI parity plus"

Claude is the model, accessed through the Anthropic API with zero data retention or through **Claude in Microsoft Foundry**, to keep billing and data processing under the Azure agreement (D14). All AI calls go through `packages/ai`, which enforces the caller's permissions on every tool, logs prompt and tool use to the audit log, minimises data sent, and purges extracted text on a retention clock (Sean §19e).

| Capability | Where it lands | Release |
|---|---|---|
| **Dictated site diary:** voice to structured entry (labour, weather, deliveries, delays, instructions, visitors) | §10j site diary, PWA | R4 |
| **Invoice/bill extraction:** vision model reads supplier, date, net, VAT and lines; side-by-side confirm; duplicate flag; learns supplier layouts from corrections (few-shot memory) | §10f, settles D-10f as option 2 with a learning loop | R4 |
| **Site survey assistant:** photos and notes into a structured survey and a scope draft | §4f | R2 |
| **Estimating copilot:** drafts the scope, assumptions and exclusions from the survey and drawings; suggests rates from the BCJS rate library and past jobs; never sets a price unconfirmed | §5 | R2 |
| **Tender return comparison:** subcontractor quotes normalised against the package schedule, gaps and outliers flagged, queries drafted | §5/§9g | R2–R3 |
| **Quote and correspondence drafting** in BCJS tone; email reply classification and filing | §6 | R2 |
| **RAMS drafting** from a plain-language task description and BCJS's RAMS library, with mandatory competent-person sign-off | §8b | R3 |
| **Drawing register intelligence:** read title blocks (number, revision, status), detect superseded revisions, semantic search across drawings and specs (pgvector) | §1l document register | R3 |
| **Variation assistant:** drafts RFIs to the architect and variation descriptions from site notes and photos | Variations process | R4 |
| **Ask BCJS:** a chat assistant over all modules ("which jobs are amber on cash next month?", "show VO-114 history"), with a **read-only toolset first** and write actions later, behind confirmation | Everywhere, plus Teams, Copilot and MCP | R4 → R6 |
| **Lessons learned:** estimate-v-final and loss reasons summarised into pricing insights | §16d, §17 | R6 |
| **Heritage knowledge pack:** lime and listed-building method statements, plus conservation-officer correspondence templates (a niche Construction AI doesn't cover) | RAMS and docs | R6 |

## 5. Phased roadmap

Sean's release structure is kept, with Microsoft 365 and AI work folded in. Durations are indicative for a small senior team (see §7).

| Release | Outcome | Scope (Sean § refs plus additions) | Indicative |
|---|---|---|---|
| **R0 Discovery & design** | Agreed blueprint | Department workshops (Lucy's request), process deep-dives, Kabyn/Briefcase audit, cost code structure (D3) and approval limits (D4) drafted, clickable prototype in BCJS brand from Marco's screens, data migration inventory, DPIA started | 3–4 wks |
| **R1 Hold real work** | Platform live | §0, §1 on Azure, Entra SSO, §2 RBAC and audit, §3 gate engine, SharePoint project provisioning plus document register, Graph app registration, CI/CD, staging | 6–8 wks |
| **R2 Win work** | Enquiry → quote → award in the system | §4–§7, Outlook send and reply filing, Acrobat Sign acceptance, survey and estimating AI, legacy workbook import, Teams channel on award | 8–10 wks |
| **R3 Start properly** | Nobody on site until ready | §8–§9, RAMS AI, drawing register AI, Outlook calendar for the pre-start, Teams approvals | 5–6 wks |
| **R4 Control cost & cash** | Live job cost and 13-week cash | §10–§13: POs, GRN, invoice AI, **Xero** (§11), time and subcontractors (§12, NFC optional), cash flow and scenarios (§13), site diary dictation PWA, variations/CVR, director dashboard, Ask-BCJS read-only | 10–12 wks |
| **R5 Finish & get paid** | Snag → handover → final account | §14–§16, sales invoices to Xero, O&M pack assembled from SharePoint, warranty reminders | 5–6 wks |
| **R6 Learn & harden** | Insight and compliance | §17–§19, report snapshots, Ask-BCJS write actions, Copilot agent and MCP, GDPR tooling, pen test, Cyber Essentials Plus alignment | 5–6 wks |

R1 to R6 lasts roughly **10–12 months**, with something usable after each release. The fastest value comes from R2 (quoting) and R4 (cost and cash). If BCJS wants cash visibility sooner, a **"Xero cash and cost lite"** dashboard can be pulled forward into R1 (read-only Xero plus tracking categories).

## 6. Decisions BCJS owes (with when they block)

From Sean: D1 backups (proposed: Azure PITR plus a geo-redundant backup, which settles it), D2 offline pricing (§5d; recommend option 2 Excel round-trip at first, a full offline estimating PWA later), D3 cost codes (§9, needed during R2), D4 approval limits (§10, needed during R2), D5 invoice scanner (recommend AI service plus learning loop), D6 handover pack per job type (§15), D7 retention terms (§16), D8 record-keeping periods (§16/§19).
New: **D9** SharePoint vs Blob as the file store (rec. SharePoint) · **D10** where bills are entered, OCS or Xero · **D11** Xero API tier · **D12** M365 licence level (Teams Essentials limits) · **D13** Kabyn and Briefcase: replace or integrate · **D14** Claude hosting route and data residency · **D15** subcontractor identity (B2B guest or magic link) · **D16** NFC sign-on in or out.

## 7. Team, cost and commercial reality

- **Team:** a lead full-stack engineer (TypeScript/Postgres), a second engineer from R2, part-time UX/design (R0–R2), part-time QA, and Stuart as product/delivery lead. BCJS provides a named process owner per department plus Lucy as product owner and signatory.
- **Budget reality:** Marco's **£20k / 6 months** for 16 modules is not credible for this spec; Sean's spec alone is many engineer-months. Present BCJS with a staged commercial: a fixed price for R0, then per-release fixed price or a capped T&M, each tied to Sean's witness sign-off. (Day rates and the total to be set by Stuart; the plan provides effort ranges per release above.)
- **Running costs (indicative):** Azure about £150–£400/month, Claude usage about £50–£250/month depending on volume, a Xero API tier (check D11), Acrobat Sign (an existing Adobe licence may cover it), and Sentry. These are billed at cost.
- **Build vs buy check in R0:** a short comparison of Construction AI pricing against this build, so BCJS makes an informed choice. The pitch for building: native M365 and Xero, heritage specialism, owning their data and IP, and no per-seat fees.

## 8. Security, GDPR & compliance

Sean's security checklist and §19 are adopted in full, plus: Entra conditional access, Key Vault for secrets and Xero tokens, UK-only data residency, a DPIA before R1 go-live, processor agreements (Microsoft, Xero, Anthropic/Microsoft for AI, Adobe), AI data minimisation and purge, a pen test before R4 (money flows), and alignment with Cyber Essentials Plus. The RLS isolation suite and permission tests run on every push.

## 9. Deliverables in this repository

- `docs/delivery-plan.md`: this plan
- `docs/decisions.md`: decisions D1–D17 with owner, recommendation and what each blocks
- `docs/integrations.md`: Microsoft Graph and Xero scopes, endpoints and sync rules
- `docs/ai-capabilities.md`: AI features, guardrails and how they are evaluated
- `docs/inputs/summary.md`: summaries of the BCJS process roadmap, Sean's build programme, Marco's concept and the Construction AI feature list
- `prototype/`: the clickable Vercel prototype (§9a)

## 9a. Prototype on Vercel

**Purpose:** let Lucy, Emma and the department leads click through the target experience, including the M365, Xero and AI touchpoints, before any spend on the production build. This is a **front-end prototype with seeded mock data**. It has no real integrations and no real client data.

- **Location:** `prototype/` in the repo, using Next.js (App Router), TypeScript, Tailwind and shadcn/ui. BCJS brand tokens come from Marco's showcase: lime `#9BBA3C`, near-black `#1F1F1F`, slate `#415155`, ochre/red RAG colours, uppercase headings, light and dark themes.
- **Mock data:** `prototype/lib/mock/` holds fictional projects (Goytre Grange barn conversion, Usk Meadows, Raglan Court and others), enquiries, estimates, POs, variations, a Xero feed, cash-flow series, snags and RAMS. All figures are in pence, using the same `formatMoney` helper the real build will use. The site footer labels the data "illustrative only".
- **Screens (one per release outcome):**
  1. **Director dashboard:** KPI tiles, "caught early" banner, needs-attention list, cash RAG.
  2. **Enquiries pipeline:** a kanban board by stage, plus an enquiry timeline and a survey with photos.
  3. **Estimate builder:** packages, sections and lines; rate card flags; versions; "Draft scope with AI"; quote preview; "Send via Outlook" and "Send for Acrobat Sign" mocks.
  4. **Project hub:** an overview with **stage gate blocker list and override**, and tabs for Documents (a SharePoint-backed register with revisions), RAMS, Programme (simple Gantt) and Teams channel link.
  5. **Commercial:** a CVR with the variation register (approved, pending and disputed toggles).
  6. **Procurement and Xero feed:** POs, approval bands, AI invoice extraction side by side, a matched/exception list, and a Xero connection status mock.
  7. **Cash flow:** 13-week chart with scenario comparison (base, delay, late payment) and retention.
  8. **Site PWA view** (`/site`, mobile layout, installable manifest): today's work, time log, dictated diary, evidence gate, offline queue indicator.
  9. **Ask BCJS assistant:** a side panel answering questions about the mock data. If `ANTHROPIC_API_KEY` is set in Vercel, it is a **live Claude call** with read-only tools over the mock dataset (via a route handler); otherwise it shows scripted answers.
  10. **Teams approval card preview** and an **integrations page** showing the M365, Xero and Adobe connection mocks.
  11. **Feedback widget** on every page (Sean §0) that stores reports in local storage and exports them, so reviewers can leave snags while demoing.
- **Sign-in:** a role switcher (Director, QS, PM, Site, Finance, Subcontractor) changes the navigation and visible data, which demonstrates RBAC. The real build replaces it with Entra SSO.
- **Deploy:** a Vercel project linked to `stujarth/bcjs-ai` with the root directory `prototype/`, a preview deployment per PR, and Vercel deployment protection or a password so the prototype isn't public. Done through the Vercel MCP tools or a Git-linked project; if team or scope selection is ambiguous, I'll ask.
- **Production hosting note:** the prototype is on Vercel for speed. Production can stay on Azure UK South (§2) or use Vercel for the web tier with Azure Postgres and workers; this is decision **D17**, made in R0.
- **Prototype verification:** run `pnpm build` and `pnpm lint` locally; Playwright smoke tests visit every route at desktop and phone widths with no console errors; a Lighthouse PWA check on `/site`; then a manual click-through of the deployed URL with screenshots shared.

## 10. Verification

- **Plan review:** walk through it with Lucy and Emma, and confirm each roadmap stage maps to their process roadmap with no gaps (Enquiry … O&M manual).
- **During build, per release:** Sean's witness rule (a real job end to end, signed off by a named person); CI covering unit tests for the money, gate, CVR and cash engines, the RLS cross-tenant suite, and Playwright E2E for the release journey.
- **Integrations:** the Xero demo company from staging only, then a reconciliation report showing a zero diff on live. An M365 dev or sandbox tenant for Graph before BCJS tenant consent. AI evaluations: a set of real BCJS invoices, diaries and surveys with accuracy thresholds before each AI feature ships.
