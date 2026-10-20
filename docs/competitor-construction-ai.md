# Competitor review: Construction AI (constructionai.io)

_Reviewed 20 October 2026. Sources: the full public site (34 pages and 47 blog posts), terms of use and privacy policy, Companies House, trade press, directory listings, and the full 1 h 46 min platform overview video (transcribed and frame-sampled). Entries marked "inference" are our judgement; everything else is sourced._

## Summary

Construction AI is a capable, UK-specific construction platform. It is strongest on the **tender-to-subcontract-to-payment chain**: rate library, drawing take-off, tender packages, AI bid analysis, contract term extraction, Construction Act payment cycles, CIS and reverse charge, and CVR. AI is built into all of it.

It is also **very young**: incorporated January 2025, launched March 2026, about 20 customers, one director and no filed accounts. Its fit with **Microsoft 365** (no Microsoft sign-in, SharePoint, Outlook or Teams integration) and with **offline site use** is weak. It is designed for main contractors with heavy subcontract chains rather than a joinery-led residential and heritage builder.

**How we position against it:** we match its best ideas feature for feature, then win on four things.

1. Native Microsoft 365 and a documented, two-way Xero integration.
2. A site app that genuinely works without signal.
3. Being built around BCJS's own process, with a heritage and joinery focus.
4. Lower vendor risk: BCJS can own the IP outright, or subscribe at an open price.

## Company

| Fact | Detail | Source |
|---|---|---|
| Legal entity | CONSTRUCTION AI LTD, company no. 16208350, incorporated 26 Jan 2025, Gerrards Cross | Companies House |
| Ownership | One director and person with significant control (75%+): Stephen McKenna, MCIOB, ex-Balfour Beatty and ISG QS. He also runs Gemstone Ltd, a contractor in Hitchin | Companies House; Construction Management, Apr 2026 |
| Accounts | None filed yet. First accounts are due 26 Oct 2026 | Companies House |
| Build | Built by the founder with Claude Code: more than 700k lines of code, 186 tables, 596 API routes | Construction Management, Apr 2026 |
| Launch | Beta in 2025; production launch 4 Mar 2026 | /story; press release |
| Traction | About 20 customers, some with 3–4 seats. No named customers, case studies or reviews (0 on Capterra and GetApp) | Construction Management; directories |
| Support | Founder-led. No SLA in the terms ("new and evolving product") | Blog; Terms of use |

## Product: what it does (verified in the video and on the site)

- **Library:** rate books (with AI bulk edits such as "add 10% to all rates"), scopes of works, design responsibility matrices, attendances, prelims, staff, payment schedules, document templates. Its "Speeds everything up" claim is central to its pitch.
- **Tenders:**
  - Schedule Builder, an Excel-like editor with nett, sell and margin.
  - Drawing review with take-off: calibrate the scale on a door, measure, export to the schedule.
  - Match rates from the library.
  - AI schedule building from a description.
  - Tender packages: an AI enquiry letter with project variables, plus scope, DRM, attendances, payment schedule, documents and programme.
  - A bidder portal (who opened the enquiry, RFIs, addenda) with standardised Excel returns.
  - **AI tender analysis:** base bid, unlisted items, pricing and standard qualifications, a RAG rating per line, auto-raised tender queries exported to Excel, and a normalisation figure.
  - Adjudication (% adjustment and margin per package), then bid return to the client and SignWell e-signature.
- **Financial:**
  - Contract PDF upload with AI extraction of key terms, which a person verifies.
  - Construction Act payment cycles generated automatically (application, due, payment notice, pay-less and final dates, retention).
  - A cash-flow forecast.
  - Subcontract orders built from the tender award, with a buy-out target and a gateway check that the order has a linked commitment in the purchase ledger.
  - Commitments covering retention, CIS and domestic reverse charge.
  - A CVR that fills itself, with best, likely and worst values per variation.
  - Payment applications where the client QS and subcontractors assess and submit inside the platform; payment notices then wait for a matching invoice.
- **Project management:**
  - Communications, with AI reading a client instruction PDF.
  - Upstream change on the cost report (CCI) and downstream change in subcontractor variations.
  - Drawing register with title-block reading.
  - Specifications searchable by meaning.
  - RFIs and submittals.
  - The **AI Programme Agent**, which built a 94-task linked programme from the project brief.
- **Project knowledge, the "time machine":** drawings, specifications and every project write are embedded and summarised by managed agents, which run on events or on a schedule. The result is a running project record for disputes and extension-of-time claims.
- **RAMS:** an 8-step wizard driven by voice and AI (method steps, 5×5 risk assessment, PPE and plant, site controls, competence), then distribution.
- **Site:** dictated diary that AI tidies up, inspection templates (a failed item raises a snag), photos, timecards.
- **AI assistant and agents:**
  - The in-app agent answers from project data and can search the web.
  - Scheduled briefings: a weekly Friday summary, a 14-day look-ahead and "Mission Control".
  - An **MCP server** with OAuth, project-scoped consent and audit (132 tools claimed), plus a REST API.
- **CPD Hub:** training Q&A and an iHASCO integration.

## Gaps and risks (for an SME like BCJS)

| Area | Finding | Source |
|---|---|---|
| Microsoft 365 | **No** Microsoft (Entra) sign-in, and nothing for SharePoint, Outlook or Teams. Copilot is supported only through Copilot Studio as an MCP tool, which needs a Copilot Studio tenant. Documents would leave SharePoint for a separate store | Full-site scan; /docs/connect-microsoft-365-copilot |
| Xero | Claimed via Apideck ("costs and payments sync"), but the depth and direction aren't documented | Privacy policy; /features/financial |
| Offline site use | Contradictory. The site says "works offline", but the site FAQ says a connection is needed, and their own July 2026 blog says "there's no offline mobile app yet, no timesheets, no configurable approval chains" | /features; blog |
| Pricing | Shifting: tiered plans (£130 Solo to £2,250 Scale per month), then a £100-per-seat-per-month quote, a £2,000 founding lifetime offer, and now "quote only". The terms add AI credits and £0.05 a page over 2,000 pages a month, which contradicts "no credit packs" | Directories; press; /pricing; Terms 6.4 |
| Terms | Fees non-refundable on termination; liability capped at 12 months' fees; data loss excluded and customers must keep their own backups; 90 days to export after termination. (The video quotes a 30-day money-back guarantee) | Terms of use; video 01:10 |
| Data | Database in London, but the application runs on Vercel globally and AI goes to US processors (Anthropic, Voyage, Deepgram). Some features need the customer's own Anthropic key. No ISO 27001, Cyber Essentials or SOC 2 claims | Privacy policy; Terms 6.5 |
| Fit (inference) | Built around main contractors with heavy tender and subcontract chains. A residential, heritage and joinery business would use part of it. Nothing on joinery manufacture, heritage materials or listed-building evidence | Site; video |
| Vendor risk (inference) | Single founder-owner, no filed accounts, no SLA, about 20 customers. High key-person and viability risk for a core business system | Companies House; press |

## Head to head

| | Construction AI | Scout for BCJS |
|---|---|---|
| Fit | One product for every contractor | Built around BCJS's process map, cost codes, approval limits, joinery and heritage work |
| Microsoft 365 | Copilot via Copilot Studio only | Microsoft sign-in, SharePoint documents, quotes sent from Outlook, approvals in Teams, plus a Copilot agent and MCP |
| Xero | Claimed via Apideck, undocumented | Documented two-way sync: contacts, tracking categories per job, bills, payments, sales invoices, and a reconciliation view |
| Site with no signal | Not yet (by their own account) | Offline-first site app: diary, time, photos and evidence gate, synced when signal returns |
| Tender and commercial depth | Strong today | Matched in the plan: library, take-off, tender packages, AI bid analysis, contract extraction, payment cycles, CIS/DRC, CVR |
| AI | Broad (agents, knowledge, programme, RAMS, analysis) | The same capabilities on Claude, plus evaluation on BCJS's own documents before each feature ships |
| Price | Opaque; earlier tiers were £350–£2,250/month for 3 to 75 seats | Published: £49,500 to own outright, or £10,000 setup + £895/month SaaS |
| Ownership | Licence only | BCJS can own the software and IP |
| Assurance | No SLA; liability capped at fees | Agreed SLA and support; DPIA; Cyber Essentials Plus alignment; penetration test before the system writes to Xero |
| Time to value | 14-day trial, then self-configure | MVP running on BCJS's live jobs in week 4 |

**On price, like for like (inference):** BCJS has around 15 users. On Construction AI's earlier published tiers that is the Growth plan at £995 a month (10 office and 15 site seats), about £11,940 a year, or £10,150 with the annual discount. Implementation is quoted separately, and the terms add AI and page overage charges. Scout's Option 2 is £895 a month with setup and AI included.

## What we have added to our plan because of this review

These are scheduled in the [delivery plan](delivery-plan.md) and shown in the prototype.

- **Phase 2:**
  - Library: rate books, scopes, DRM, attendances, prelims, payment schedules, templates.
  - Drawing take-off with match rates.
  - Tender packages with a bidder portal and **AI tender analysis** (RAG, tender queries, normalisation), adjudication, and award to a subcontract order with a buy-out target.
- **Phase 3:**
  - Contract upload with AI key-term extraction.
  - **Construction Act payment cycles** (payment and pay-less notices) for the main contract and each subcontract.
  - CIS and domestic reverse charge on commitments, and a commitment gateway on subcontract orders.
  - Client QS and subcontractor portals for applications.
  - The AI Programme Agent.
  - Inspection templates that raise snags.
- **Phase 4:**
  - Project knowledge record (the "time machine") with managed agents.
  - Scheduled AI briefings to Teams and Outlook.
  - Best, likely and worst values on variations.
  - AI CVR commentary.
