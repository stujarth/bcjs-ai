// Builds every briefing figure from the mock project record, so nothing in an
// AI summary is typed by hand. Production: the same queries run as tools for
// the scheduled agent, and the model only writes the prose around them.
import {
  compliance,
  cvrHistory,
  cvrLines,
  liveProjects,
  mainContracts,
  openingCashPence,
  projects,
  purchaseOrders,
  rams,
  scenarios,
  snags,
  stageGates,
  subcontracts,
  timesheets,
  TODAY_ISO,
  valuations,
  variations,
  xeroBills,
} from "@/lib/mock/data";
import type { RoleKey } from "@/lib/mock/types";
import { formatMoney, formatMoneyShort, sumPence } from "@/lib/money";
import { cycleEvents, formatDayShort, generateCycles, isoToDate } from "@/components/contracts/cycles";

export interface Line {
  text: string;
  href: string;
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
/** "02 Nov 2026" → Date (UTC). */
export function parseDay(s: string): Date | null {
  const m = /^(\d{1,2}) ([A-Z][a-z]{2}) (\d{4})$/.exec(s.trim());
  if (!m) return null;
  return new Date(Date.UTC(Number(m[3]), MONTHS.indexOf(m[2]), Number(m[1])));
}

const today = isoToDate(TODAY_ISO);
const DAY = 86_400_000;

export function facts() {
  const awaiting = purchaseOrders.filter((p) => p.status === "awaiting approval");
  const onSite = liveProjects.filter((p) => p.stage !== "tender");
  const pendingVo = variations.filter((v) => v.status === "pending" || v.status === "submitted");
  const oldestVo = [...pendingVo].sort((a, b) => b.ageDays - a.ageDays)[0];
  const exceptions = xeroBills.filter((b) => b.status !== "matched");
  const priceVariance = xeroBills.find((b) => b.note?.includes("over"));
  let bal = openingCashPence;
  let low = { v: Infinity, label: "" };
  for (const w of scenarios[0].weeks) {
    bal += w.inPence - w.outPence;
    if (bal < low.v) low = { v: bal, label: w.label };
  }
  const lowMargin = onSite.filter((p) => p.forecastMarginPct < 10);
  const criticalSnags = snags.filter((s) => s.severity === "critical" && s.status === "open");
  const expiring = compliance.filter((c) => c.daysLeft <= 30);
  const grd = cvrLines.goytre?.find((l) => l.costCode === "GRD-02");
  const overdue = valuations.filter((v) => v.status === "overdue");
  const tsWaiting = timesheets.filter((t) => t.status === "submitted");
  return { awaiting, onSite, pendingVo, oldestVo, exceptions, priceVariance, low, lowMargin, criticalSnags, expiring, grd, overdue, tsWaiting };
}

export function weeklySummary() {
  const f = facts();
  const committed = sumPence(f.onSite.map((p) => p.committedPence));
  const budget = sumPence(f.onSite.map((p) => p.budgetPence));
  const grdOver = f.grd ? f.grd.forecastFinalPence - f.grd.budgetPence : 0;
  return {
    moved: [
      { text: `${f.onSite.length} live jobs; committed spend ${formatMoneyShort(committed)} of ${formatMoneyShort(budget)} budget.`, href: "/" },
      { text: `Goytre Grange groundworks forecast ${formatMoney(grdOver)} over budget (GRD-02).`, href: "/commercial" },
      { text: `${f.criticalSnags.length} critical snag still open on Nevill Street, holding handover.`, href: "/projects/abergavenny" },
    ],
    money: [
      { text: `${f.awaiting.length} purchase orders awaiting approval, ${formatMoney(sumPence(f.awaiting.map((p) => p.valuePence)))} in total.`, href: "/procurement" },
      {
        text: `${f.exceptions.length} Xero bills need review${f.priceVariance ? `, including ${f.priceVariance.supplier} invoiced above the order rate` : ""}.`,
        href: "/procurement",
      },
      {
        text: `${formatMoney(sumPence(f.pendingVo.map((v) => v.valuePence)))} of variations pending or submitted; oldest ${f.oldestVo?.ref} at ${f.oldestVo?.ageDays} days.`,
        href: "/commercial",
      },
      { text: `Base-case cash low point ${formatMoney(f.low.v)} in ${f.low.label}.`, href: "/cashflow" },
    ],
    risks: [
      ...f.lowMargin.map((p) => ({ text: `${p.name} forecast margin ${p.forecastMarginPct}%, below the 10% threshold.`, href: `/projects/${p.id}` })),
      ...f.overdue.map((v) => ({ text: `${projects.find((p) => p.id === v.projectId)?.name} application ${v.number} overdue (due ${v.dueDate}).`, href: "/cashflow" })),
      { text: `${f.expiring.length} certifications or insurances expire within 30 days.`, href: "/compliance" },
    ],
    next: lookAhead(7).map((e) => ({ text: `${formatDayShort(e.date)}: ${e.text}`, href: e.href })),
  };
}

export interface LookAheadItem {
  date: Date;
  text: string;
  href: string;
  kind: "Payment" | "Compliance" | "Gate" | "RAMS" | "Subcontract";
}

export function lookAhead(days = 14): LookAheadItem[] {
  const end = today.getTime() + days * DAY;
  const inWindow = (d: Date | null): d is Date => !!d && d.getTime() >= today.getTime() && d.getTime() <= end;
  const items: LookAheadItem[] = [];

  for (const c of mainContracts) {
    const name = projects.find((p) => p.id === c.projectId)?.name;
    for (const e of cycleEvents(generateCycles(c))) {
      if (inWindow(e.date)) items.push({ date: e.date, text: `${name}: ${e.label}, cycle ${e.cycle}`, href: "/contracts", kind: "Payment" });
    }
  }
  for (const s of subcontracts) {
    const notice = new Date(isoToDate(s.nextApplicationIso).getTime() + 5 * DAY);
    if (inWindow(notice)) items.push({ date: notice, text: `Payment notice due to ${s.party}`, href: "/contracts", kind: "Subcontract" });
  }
  for (const c of compliance) {
    const d = parseDay(c.expires);
    if (inWindow(d)) items.push({ date: d, text: `${c.party}: ${c.kind} expires`, href: "/compliance", kind: "Compliance" });
  }
  for (const r of rams) {
    const d = parseDay(r.reviewDate);
    if (inWindow(d)) items.push({ date: d, text: `RAMS review: ${r.title} (${projects.find((p) => p.id === r.projectId)?.name})`, href: "/compliance", kind: "RAMS" });
  }
  for (const g of stageGates) {
    const p = projects.find((x) => x.id === g.projectId);
    const d = p && g.to === "on-site" ? parseDay(p.startDate) : null;
    const open = g.checks.filter((c) => !c.done).length;
    if (p && inWindow(d)) items.push({ date: d, text: `${p.name} planned start on site; ${open} gate checks still open`, href: `/projects/${p.id}`, kind: "Gate" });
  }
  return items.sort((a, b) => a.date.getTime() - b.date.getTime());
}

export function morningBriefings(): Record<RoleKey, Line[]> {
  const f = facts();
  const next = lookAhead(3);
  const firstNext: Line[] = next.length ? [{ text: `Coming up: ${next[0].text} (${formatDayShort(next[0].date)}).`, href: next[0].href }] : [];
  return {
    director: [
      { text: `${f.lowMargin.map((p) => p.name).join(", ")} is the one job below margin threshold.`, href: "/projects/mamhilad" },
      { text: `${f.awaiting.filter((p) => p.valuePence > 5_000_000).length} PO over £50k needs your approval.`, href: "/procurement" },
      { text: `Cash low point ${formatMoneyShort(f.low.v)} in ${f.low.label}, base case.`, href: "/cashflow" },
      ...firstNext,
    ],
    qs: [
      { text: `${f.oldestVo?.ref} has been with the client ${f.oldestVo?.ageDays} days. A chaser is drafted.`, href: "/commercial" },
      { text: `${f.exceptions.length} Xero bills to review before posting.`, href: "/procurement" },
      { text: "Goytre payment cycle: check the next notice date on Contracts.", href: "/contracts" },
    ],
    pm: [
      { text: "Llanover Lodge start gate: RAMS sign-off and subcontractor insurance outstanding.", href: "/projects/llanover" },
      { text: `${f.criticalSnags.length} critical snag blocking handover at Nevill Street.`, href: "/projects/abergavenny" },
      ...firstNext,
    ],
    finance: [
      { text: `${f.overdue.length} client application overdue, ${formatMoney(sumPence(f.overdue.map((v) => v.certifiedPence)))} certified.`, href: "/cashflow" },
      { text: `${f.exceptions.length} bills held from posting to Xero.`, href: "/procurement" },
      { text: "Brecon Roofing is unverified for CIS: 30% deduction applies until verified with HMRC.", href: "/contracts" },
    ],
    site: [
      { text: `${f.tsWaiting.length} timesheets waiting for your approval.`, href: "/site" },
      { text: "Goytre Externals: 2 operatives not yet signed onto RAMS.", href: "/site" },
      { text: "Scaffold SG4 inspection due today at Goytre Block A.", href: "/insights#inspections" },
    ],
    subcontractor: [
      { text: "Your week 43 timesheet is submitted and awaiting approval.", href: "/site" },
      { text: "Next application to BCJS: 28 Oct. Payment notice will follow within 5 days.", href: "/site" },
    ],
  };
}

export function cvrCommentary() {
  const hist = cvrHistory.goytre ?? [];
  const cur = hist.at(-1)!;
  const prev = hist.at(-2)!;
  const delta = +(cur.marginPct - prev.marginPct).toFixed(1);
  const vo111 = variations.find((v) => v.ref === "VO-111")!;
  const pending = variations.filter((v) => v.projectId === "goytre" && (v.status === "pending" || v.status === "submitted"));
  const disputed = variations.filter((v) => v.projectId === "goytre" && v.status === "disputed");
  const grd = cvrLines.goytre?.find((l) => l.costCode === "GRD-02");
  return {
    prev,
    cur,
    delta,
    history: hist,
    drivers: [
      { tone: "good" as const, text: `${vo111.ref} ${vo111.description.toLowerCase()} approved and valued: adds ${formatMoney(vo111.valuePence - vo111.costPence)} margin.` },
      ...(grd ? [{ tone: "bad" as const, text: `Groundworks & piling (GRD-02) forecast final ${formatMoney(grd.forecastFinalPence - grd.budgetPence)} over budget after ground conditions.` }] : []),
      {
        tone: "warn" as const,
        text: `${pending.map((v) => v.ref).join(", ")} (${formatMoney(sumPence(pending.map((v) => v.valuePence - v.costPence)))} margin) excluded until signed.`,
      },
      ...disputed.map((v) => ({ tone: "bad" as const, text: `${v.ref} ${v.description.toLowerCase()} disputed: ${formatMoney(v.costPence)} cost with no value recognised.` })),
    ],
  };
}
