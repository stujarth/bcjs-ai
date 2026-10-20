import Link from "next/link";
import { Badge, Card, IntegrationTag, PageHeader, RagDot, ragTone } from "@/components/ui";
import { CashFlowView } from "@/components/cashflow/cash-flow-view";
import { cashRagThresholds, liveProjects, openingCashPence, overdueReceipts, retentionHeldPence, scenarios } from "@/lib/mock/data";
import { formatMoney, pct, sumPence } from "@/lib/money";

const ragReason: Record<string, string> = {
  goytre: "£46k of variations unsigned; application 4 due 13 Nov",
  raglan: "Valuations certified on time",
  usk: "Payments on 14-day terms, all received",
  mamhilad: "Margin below red threshold; application 7 overdue 8 days",
  llanover: "Deposit received; starts 2 Nov",
  abergavenny: "Final account due; £8.4k overdue 4 days",
};

export default function CashFlowPage() {
  const overdue = sumPence(overdueReceipts.map((o) => o.amountPence));

  return (
    <>
      <PageHeader
        kicker="Commercial"
        title="Cash flow & scenarios"
        subtitle="What's coming in and when. Built from project programmes, payment terms, approved orders, logged time and valuations. Nobody rebuilds it by hand each month."
        actions={<IntegrationTag system="Xero">actuals reconciled</IntegrationTag>}
      />

      <CashFlowView scenarios={scenarios} opening={openingCashPence} retentionHeld={retentionHeldPence} overdueIn={overdue} overdueCount={overdueReceipts.length} />

      <div className="grid gap-5 lg:grid-cols-2">
        <Card title="Cash RAG by project">
          <ul className="divide-y divide-hair">
            {liveProjects.map((p) => (
              <li key={p.id} className="flex items-start gap-3 py-2.5">
                <RagDot rag={p.cashRag} className="mt-1.5" />
                <div className="min-w-0 flex-1">
                  <Link href={`/projects/${p.id}`} className="text-sm font-semibold text-ink hover:underline">
                    {p.name}
                  </Link>
                  <div className="text-xs text-muted">{ragReason[p.id]}</div>
                </div>
                <div className="text-right">
                  <Badge tone={ragTone(p.cashRag)}>{p.cashRag}</Badge>
                  <div className="tabular mt-0.5 text-xs text-muted">margin {pct(p.forecastMarginPct)}</div>
                </div>
              </li>
            ))}
          </ul>
          <p className="mt-3 border-t border-hair pt-3 text-xs text-muted">
            Red below {cashRagThresholds.redMarginPct}% forecast margin, amber below {cashRagThresholds.amberMarginPct}% or where a project&apos;s cash dips under{" "}
            {formatMoney(cashRagThresholds.amberLowPointPence)}. These thresholds are BCJS&apos;s to set, and they&apos;re recalculated each time the forecast moves.
          </p>
        </Card>

        <div className="flex flex-col gap-5">
          <Card title="What each scenario changes">
            <ul className="space-y-3 text-sm">
              {scenarios.map((s) => (
                <li key={s.key}>
                  <div className="font-semibold text-ink">{s.name}</div>
                  <div className="text-muted">{s.description}</div>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-xs text-muted">Scenarios are saved and compared side by side, never overwritten. The base case stays the reference.</p>
          </Card>
          <Card title="Overdue receipts">
            <ul className="divide-y divide-hair">
              {overdueReceipts.map((o) => (
                <li key={o.ref} className="flex items-center gap-3 py-2 text-sm">
                  <span className="min-w-0 flex-1">
                    <span className="font-semibold text-ink">{o.client}</span>
                    <span className="block font-mono text-xs text-muted">{o.ref}</span>
                  </span>
                  <span className="tabular font-semibold">{formatMoney(o.amountPence)}</span>
                  <Badge tone="bad">{o.daysOverdue}d</Badge>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
    </>
  );
}
