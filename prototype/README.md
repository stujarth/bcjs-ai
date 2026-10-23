# BCJS Operations: clickable prototype

This is a front-end concept prototype of the BCJS Operations Control System. It uses **seeded, fictional data** and has **no live integrations**. Microsoft 365, Xero and Acrobat Sign touchpoints are mocked to show where they fit.

## Run locally

```bash
pnpm install
pnpm dev        # http://localhost:3000
pnpm build && pnpm start
```

## What's in it

| Route | Screen | Plan phase (release) |
|---|---|---|
| `/` | Director dashboard: KPIs, caught-early banner, needs-attention list, cash sparkline | R4 |
| `/enquiries`, `/enquiries/[id]` | Pipeline kanban, enquiry timeline, site survey, convert to tender | R2 |
| `/estimates/est-0236` | Estimate builder: drawing take-off, rate-card overrides, versions, AI scope draft, quote preview, Outlook / Acrobat Sign send | R2 |
| `/projects`, `/projects/[id]` | Project hub: stage gate and override, documents (SharePoint), RAMS, programme, snags, audit | R1–R5 |
| `/library` | Library: rate books, scopes, DRM, attendances, prelims, payment schedules, templates; AI bulk rate change with preview | Phase 2 |
| `/tenders`, `/tenders/[id]` | Tender packages: AI enquiry letter, invitees with portal status, AI bid analysis (RAG, TQs, normalisation), adjudication, award to subcontract order | Phase 2 |
| `/contracts` | AI contract reading with clause references, Construction Act payment and pay-less notice cycles, subcontracts with CIS and reverse charge, commitment gateway, external parties | Phase 3 |
| `/insights` | AI briefings: Friday summary, 14-day look-ahead, per-role morning briefing, CVR commentary, programme agent, inspections that raise snags | Phases 3–4 |
| `/commercial` | CVR & variation register, with forecast-inclusion toggles | R4 |
| `/procurement` | POs & approval bands, Xero feed, AI invoice extraction review, Teams approval card | R4 |
| `/cashflow` | 13-week cash flow with scenarios | R4 |
| `/assets`, `/assets/[id]` | Tools & equipment (replaces Kabyn): register with bulk quantities by location, hire tracker with idle-hire off-hire, PAT/LOLER/calibration inspections that block check-out, movement log, QR labels | Phase 2 |
| `/site` | Site PWA: today, time, dictated diary, evidence gate, Kit (QR check-out/in), offline queue | R4 |
| `/compliance` | Expiry alerts, supplier register, incident log, AI RAMS drafter | R3 |
| `/integrations` | Microsoft 365 / Xero / Adobe / Claude connections and architecture | – |

- **Role switcher** (top bar): changes navigation and data visibility, to show role-based access. Production uses Entra ID SSO.
- **Feedback** (bottom right): logs a fault, change or idea against the current page and role. Reports are stored in the browser and can be exported as JSON.
- **Ask BCJS:** a read-only assistant. Without `ANTHROPIC_API_KEY` it gives scripted answers. With the key set on the deployment, it calls Claude with role-scoped tools over the mock data (`app/api/ask/route.ts`, `lib/ask-tools.ts`).

## Deploy (Vercel)

Import `stujarth/bcjs-ai` into Vercel and set **Root Directory = `prototype`** (framework: Next.js). Optionally set `ANTHROPIC_API_KEY`. Keep Deployment Protection on so the prototype isn't public.
