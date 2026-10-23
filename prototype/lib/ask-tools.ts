// Read-only tools over the mock project record, shared by the live Claude route
// and the scripted fallback. Production swaps these for permission-checked API calls.
import type Anthropic from "@anthropic-ai/sdk";
import {
  assets,
  compliance,
  hireRecords,
  enquiries,
  openingCashPence,
  projects,
  purchaseOrders,
  retentionHeldPence,
  scenarios,
  stageGates,
  variations,
  xeroBills,
} from "./mock/data";
import type { RoleKey } from "./mock/types";
import { formatMoney } from "./money";

const MONEY_ROLES: RoleKey[] = ["director", "qs", "pm", "finance"];

export const askTools: Anthropic.Beta.BetaTool[] = [
  {
    name: "list_projects",
    description: "List live BCJS projects with stage, contract value, forecast margin, cash RAG and progress.",
    input_schema: { type: "object", properties: {}, additionalProperties: false },
  },
  {
    name: "get_project",
    description: "Full commercial position for one project: budget, committed, actual, value earned, cost to complete, margin.",
    input_schema: {
      type: "object",
      properties: { project_id: { type: "string", description: "Project id, e.g. goytre, raglan, usk, mamhilad, llanover, abergavenny" } },
      required: ["project_id"],
      additionalProperties: false,
    },
  },
  {
    name: "list_variations",
    description: "Variation register, optionally for one project. Includes cost, value, time impact, status and age.",
    input_schema: { type: "object", properties: { project_id: { type: "string" } }, additionalProperties: false },
  },
  {
    name: "list_purchase_orders",
    description: "Purchase orders, optionally filtered by status (awaiting approval, approved, part delivered, complete, on hire).",
    input_schema: { type: "object", properties: { status: { type: "string" } }, additionalProperties: false },
  },
  {
    name: "list_xero_exceptions",
    description: "Supplier bills from the Xero feed or AI scanner that need review (price variance, no PO, awaiting confirmation).",
    input_schema: { type: "object", properties: {}, additionalProperties: false },
  },
  {
    name: "get_cash_forecast",
    description: "13-week company cash forecast for a scenario: base, goytre-delay, or late-pay.",
    input_schema: { type: "object", properties: { scenario: { type: "string", enum: ["base", "goytre-delay", "late-pay"] } }, additionalProperties: false },
  },
  {
    name: "get_stage_gate",
    description: "Stage gate checklist for a project's next transition and what is blocking it.",
    input_schema: { type: "object", properties: { project_id: { type: "string" } }, required: ["project_id"], additionalProperties: false },
  },
  {
    name: "list_compliance_alerts",
    description: "Insurance and certification expiries within 30 days.",
    input_schema: { type: "object", properties: {}, additionalProperties: false },
  },
  {
    name: "list_enquiries",
    description: "Enquiry pipeline, optionally filtered by stage (new, qualifying, surveyed, converted, lost, dormant).",
    input_schema: { type: "object", properties: { stage: { type: "string" } }, additionalProperties: false },
  },
  {
    name: "list_assets_on_hire",
    description: "Plant and equipment currently on hire: supplier, job, PO, days on hire, idle days, weekly rate and cost to date.",
    input_schema: { type: "object", properties: {}, additionalProperties: false },
  },
];

const moneyTools = new Set(["list_assets_on_hire", "get_project", "list_variations", "list_purchase_orders", "list_xero_exceptions", "get_cash_forecast", "list_projects"]);

export function runAskTool(name: string, input: Record<string, unknown>, role: RoleKey): string {
  if (moneyTools.has(name) && !MONEY_ROLES.includes(role)) {
    return JSON.stringify({ error: `Not permitted: the ${role} role cannot see commercial figures.` });
  }
  const pid = typeof input.project_id === "string" ? input.project_id.toLowerCase() : undefined;
  switch (name) {
    case "list_projects":
      return JSON.stringify(
        projects.map((p) => ({
          id: p.id, name: p.name, type: p.type, stage: p.stage, contract_value: formatMoney(p.contractValuePence),
          forecast_margin_pct: p.forecastMarginPct, cash_rag: p.cashRag, progress_pct: p.progressPct, end: p.endDate,
        })),
      );
    case "get_project": {
      const p = projects.find((x) => x.id === pid);
      if (!p) return JSON.stringify({ error: "Unknown project id" });
      return JSON.stringify({
        ...p,
        contract_value: formatMoney(p.contractValuePence), budget: formatMoney(p.budgetPence), committed: formatMoney(p.committedPence),
        actual: formatMoney(p.actualPence), value_earned: formatMoney(p.valueEarnedPence), cost_to_complete: formatMoney(p.costToCompletePence),
      });
    }
    case "list_variations":
      return JSON.stringify(
        variations
          .filter((v) => !pid || v.projectId === pid)
          .map((v) => ({ ...v, cost: formatMoney(v.costPence), value: formatMoney(v.valuePence) })),
      );
    case "list_purchase_orders": {
      const status = typeof input.status === "string" ? input.status.toLowerCase() : undefined;
      return JSON.stringify(
        purchaseOrders
          .filter((p) => !status || p.status === status)
          .map((p) => ({ ...p, value: formatMoney(p.valuePence), invoiced: formatMoney(p.invoicedPence) })),
      );
    }
    case "list_xero_exceptions":
      return JSON.stringify(xeroBills.filter((b) => b.status !== "matched").map((b) => ({ ...b, net: formatMoney(b.netPence, { pence: true }) })));
    case "get_cash_forecast": {
      const s = scenarios.find((x) => x.key === (input.scenario ?? "base")) ?? scenarios[0];
      let bal = openingCashPence;
      const weeks = s.weeks.map((w) => {
        bal += w.inPence - w.outPence;
        return { week: w.label, in: formatMoney(w.inPence), out: formatMoney(w.outPence), closing: formatMoney(bal) };
      });
      return JSON.stringify({ scenario: s.name, opening: formatMoney(openingCashPence), retention_held: formatMoney(retentionHeldPence), weeks });
    }
    case "get_stage_gate": {
      const g = stageGates.find((x) => x.projectId === pid);
      return JSON.stringify(g ?? { note: "No pending gate for this project." });
    }
    case "list_compliance_alerts":
      return JSON.stringify(compliance);
    case "list_enquiries": {
      const stage = typeof input.stage === "string" ? input.stage.toLowerCase() : undefined;
      return JSON.stringify(
        enquiries
          .filter((e) => !stage || e.stage === stage)
          .map((e) => ({ ref: e.ref, client: e.client, type: e.type, stage: e.stage, value: formatMoney(e.potentialValuePence), age_days: e.ageDays, source: e.source })),
      );
    }
    case "list_assets_on_hire":
      return JSON.stringify(hireRecordsSummary());
    default:
      return JSON.stringify({ error: `Unknown tool ${name}` });
  }
}

/** Deterministic answers used when no ANTHROPIC_API_KEY is configured. */
export function scriptedAnswer(q: string, role: RoleKey): { answer: string; tools: string[] } {
  const s = q.toLowerCase();
  const money = MONEY_ROLES.includes(role);
  if (!money && /(cash|margin|po|order|variation|vo-|commercial|cost)/.test(s)) {
    return { answer: `As ${role}, you don't have access to commercial figures. I can help with RAMS, snags, the site diary, timesheets and compliance.`, tools: [] };
  }
  if (s.includes("vo-114")) {
    return {
      tools: ["list_variations(project_id: goytre)"],
      answer:
        "VO-114 – Revised staircase detail, blocks A and B (Goytre Grange)\n• Raised 13 Aug from RFI-036 after Hartley Architects issued drawing HA-GG-310 rev A\n• Cost £13,100 · value £16,250 · +5 days\n• Status: pending client approval for 68 days\n\nIt's excluded from the forecast margin until signed. Including it (and VO-116) would lift Goytre's forecast margin from 14.2% to about 14.4%. Shall I draft a chaser to the client for you to review?",
    };
  }
  if (s.includes("llanover") || s.includes("stopping") || s.includes("start on site")) {
    return {
      tools: ["get_stage_gate(project_id: llanover)"],
      answer:
        "Llanover Lodge can't move to on-site yet. Two of seven checks are outstanding:\n1. RAMS – oak frame erection is an AI draft awaiting competent-person sign-off (Dave Rowntree).\n2. Llanover Joinery Co public liability expires 29 Oct (9 days), which is before the frame lift.\n\nEverything else is in place: budget locked 14 Oct, team named, pre-start meeting minuted in Teams. Planned start: 2 Nov.",
    };
  }
  if (s.includes("po") || s.includes("approval") || s.includes("order")) {
    const waiting = purchaseOrders.filter((p) => p.status === "awaiting approval");
    return {
      tools: ["list_purchase_orders(status: awaiting approval)"],
      answer:
        `${waiting.length} purchase orders are awaiting approval:\n` +
        waiting.map((p) => `• ${p.ref} ${p.supplier} – ${formatMoney(p.valuePence)} (${projects.find((x) => x.id === p.projectId)?.name}, ${p.costCode})`).join("\n") +
        "\n\nPO-2853 (£64,200) is above the £50k band, so it needs director approval. You can approve from here or from the Teams card.",
    };
  }
  if (s.includes("goytre") || s.includes("commercial")) {
    return {
      tools: ["get_project(project_id: goytre)", "list_variations(project_id: goytre)"],
      answer:
        "Goytre Grange – period 8, CVR locked 30 Sep\n• Value earned £522,350 vs cost to date £427,890\n• Cost to complete £326,550 · forecast margin 14.2%\n• Committed £612,200 of £726,400 budget\n• Groundworks ran 8% over (£11,400) in week 3, now recovered in the forecast\n• £46,150 of variations pending or submitted, excluded until signed\n\nRisk: VO-116 (piling, £29,900) has been pending for 60 days.",
    };
  }
  if (s.includes("cash") || s.includes("amber") || s.includes("red")) {
    const low = (key: string) => {
      const sc = scenarios.find((x) => x.key === key)!;
      let bal = openingCashPence;
      let best = { v: Infinity, label: "" };
      for (const w of sc.weeks) {
        bal += w.inPence - w.outPence;
        if (bal < best.v) best = { v: bal, label: w.label };
      }
      return best;
    };
    const base = low("base");
    const late = low("late-pay");
    const net30 = openingCashPence + scenarios[0].weeks.slice(0, 4).reduce((a, w) => a + w.inPence - w.outPence, 0);
    const byRag = (r: string) => projects.filter((p) => p.stage !== "closed" && p.cashRag === r).map((p) => p.name).join(", ") || "none";
    return {
      tools: ["list_projects()", "get_cash_forecast(scenario: base)", "get_cash_forecast(scenario: late-pay)"],
      answer:
        `Cash RAG by project:\n• Red – ${byRag("red")} (Mamhilad margin 9.8%, below the 10% threshold)\n• Amber – ${byRag("amber")} (£46k of variations unsigned)\n• Green – ${byRag("green")}\n\n` +
        `Company position, base case: ${formatMoney(net30)} at 30 days; lowest point ${formatMoney(base.v)} in ${base.label}.\n` +
        `If clients pay at 60 days the low point falls to ${formatMoney(late.v)} in ${late.label}, so that's the scenario to watch.`,
    };
  }
  if (s.includes("enquir") || s.includes("pipeline")) {
    const open = enquiries.filter((e) => ["new", "qualifying", "surveyed"].includes(e.stage));
    return {
      tools: ["list_enquiries()"],
      answer: `${open.length} open enquiries worth ${formatMoney(open.reduce((a, e) => a + e.potentialValuePence, 0))} in total. The biggest is ENQ-0405 The Old Forge (£380k, surveyed, ready to convert). Two new web enquiries arrived in the last 48 hours and have no survey booked yet.`,
    };
  }
  if (s.includes("hire") || s.includes("plant") || s.includes("idle")) {
    const rows = hireRecordsSummary().sort((a, b) => b.idle_days - a.idle_days);
    const idle = rows.filter((r) => r.idle_days > 5);
    return {
      tools: ["list_assets_on_hire()"],
      answer:
        `${rows.length} items on hire, costing ${formatMoney(hireRecords.reduce((n, h) => n + h.ratePerWeekPence, 0))} a week:\n` +
        rows.map((r) => `• ${r.asset} (${r.supplier}, ${r.job}): ${r.days_on_hire} days, ${r.cost_to_date} so far${r.idle_days > 5 ? `, idle ${r.idle_days} days` : ""}`).join("\n") +
        (idle.length ? `\n\n${idle.length} have been idle for more than 5 days. Off-hiring them today saves about ${formatMoney(idle.reduce((n, r) => n + r.rate_pence, 0))} a week. Want me to draft the off-hire requests for you to send?` : ""),
    };
  }
  if (s.includes("insurance") || s.includes("cscs") || s.includes("compliance") || s.includes("expir")) {
    return {
      tools: ["list_compliance_alerts()"],
      answer: compliance.map((c) => `• ${c.party} – ${c.kind} expires ${c.expires} (${c.daysLeft} days)`).join("\n"),
    };
  }
  return {
    tools: [],
    answer:
      "In the live build I'd answer from the full project record. This demo has scripted answers for cash RAG, VO-114, Llanover Lodge's start gate, POs awaiting approval, Goytre's commercial position, the enquiry pipeline and compliance expiries. Set ANTHROPIC_API_KEY on the deployment to switch to live Claude answers.",
  };
}

function hireRecordsSummary() {
  return hireRecords.map((h) => {
    const a = assets.find((x) => x.id === h.assetId);
    return {
      asset: a?.name ?? h.assetId,
      supplier: h.supplier,
      job: projects.find((p) => p.id === h.projectId)?.name ?? h.projectId,
      po: h.poRef,
      days_on_hire: h.daysOnHire,
      idle_days: h.idleDays,
      rate_pence: h.ratePerWeekPence,
      weekly_rate: formatMoney(h.ratePerWeekPence),
      cost_to_date: formatMoney(Math.round((h.ratePerWeekPence * h.daysOnHire) / 7)),
    };
  });
}
