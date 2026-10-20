# AI capabilities

Construction AI's pitch is "AI from the ground up, not bolted on". This plan matches that across the whole job lifecycle and goes further in three places: native Microsoft 365, Xero, and BCJS's heritage specialism.

## Guardrails (apply to every feature)

1. **AI drafts, people confirm.** No AI-produced figure, document, email or record change takes effect until a named person confirms it. The confirmation is the audited action (Sean's security checklist: "no AI-calculated figure ever trusted without a person confirming it").
2. **Same permissions as the user.** AI tools call the same server-side permission checks as the UI. A site manager's assistant cannot see margins; a subcontractor's cannot see other subcontractors.
3. **Audited.** Every prompt, tool call and output is written to the append-only audit log, linked to the user and the record.
4. **Minimised and purged.** Only the fields a task needs are sent. Extracted document text is purged on a retention clock (Sean §19e). Provider: Anthropic API with zero data retention, or Claude via Microsoft Foundry (decision D14).
5. **Deterministic money.** Totals, CVR, cash flow and valuations are calculated by the domain engine in integer pence, never by the model. AI may explain or summarise the numbers but never produces them.
6. **Evaluated before release.** Each feature ships only after it passes an evaluation set built from real BCJS documents, with accuracy thresholds agreed with the department owner (see below).

## Features by release

> **Release to phase mapping (fast-track plan):** R0–R1 plus the cost-control parts of R4 make up the **Phase 1 MVP (weeks 1–4)**. R2 becomes **Phase 2 (weeks 5–8)**. R3 and the cash, Xero-write and invoice-scanning parts of R4 become **Phase 3 (weeks 9–12)**. R5–R6 become **Phase 4 (weeks 13–18)**. The dictated site diary moves into the MVP.


| Release | Feature | Input → output | Confirmed by |
|---|---|---|---|
| R2 | Enquiry triage | Web form or email → client match / duplicate warning, suggested owner, summary | Ops |
| R2 | Site survey assistant | Survey photos + notes → structured survey + draft scope with risks | PM |
| R2 | Estimating copilot | Survey, drawings, BCJS rate library, past jobs → draft packages, lines, assumptions and exclusions; rate suggestions with source | QS |
| R2 | Quote and correspondence drafting | Frozen estimate → quote cover letter in BCJS tone; client reply → classified and filed against the right quotation | QS / Ops |
| R2–R3 | Tender return comparison | Subcontractor quotes (PDF, email) → normalised against the package schedule; gaps, outliers and qualifications flagged; draft queries | QS |
| R3 | RAMS drafter | Plain-language activity → structured RAMS (hazards, controls, PPE, sequence, emergency) from BCJS's library | Competent person |
| R3 | Drawing register intelligence | Uploaded drawing → title block read (number, revision, status), superseded revision detected, linked to RFIs and variations; semantic search across drawings and specifications | PM |
| R4 | Invoice extraction | Supplier bill (PDF or photo) → supplier, date, number, net, VAT, lines; PO match; duplicate and price-variance flags; learns each supplier's layout from corrections | Finance |
| R4 | Dictated site diary | Voice note on site → structured diary (weather, labour, progress, deliveries, delays, instructions, visitors) | Site manager |
| R4 | Variation assistant | Site notes + photos → draft RFI to the architect and variation description | PM / QS |
| R4 | Ask BCJS (read-only) | Plain-English question → answer from permission-scoped read tools across modules, with the tools used shown | – |
| R6 | Ask BCJS (actions) | "Chase VO-114", "raise a PO for…" → prepared action awaiting one-click confirmation | The user |
| R6 | Lessons learned | Estimate-v-final, loss reasons, snag history → pricing insights for the estimator | QS |
| R6 | Heritage knowledge pack | Lime, stone and listed-building method statements and conservation-officer correspondence templates, grounded in BCJS's own past work and supplier guidance (e.g. Ty Mawr) | – |
| R6 | Copilot and Claude interoperability | MCP server and Copilot agent over the same API, so staff can ask from Teams or Copilot chat | – |

## Evaluation

For each feature, we collect a set of real, anonymised BCJS examples (e.g. 50 supplier invoices across 15 suppliers, 20 dictated diaries, 10 surveys), define the expected output with the department owner, and measure:

- **Extraction:** field-level accuracy, with a target of 98% or better on totals and VAT before go-live. Any miss must be caught by the confirm step.
- **Drafting** (RAMS, scope, quotes): rubric scoring by the department owner (completeness, correctness, tone). Must be no worse than a competent first draft.
- **Ask BCJS:** answer correctness against the record, plus "refuses or says unknown when it should".

Evaluations are re-run whenever the model, prompt or tools change.

## Prototype

The prototype's **Ask BCJS** panel shows the read-only assistant. Without `ANTHROPIC_API_KEY` it gives scripted answers. With the key set, it calls Claude through `prototype/app/api/ask/route.ts` using read-only, role-scoped tools over the mock data (`prototype/lib/ask-tools.ts`).
