import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Badge, Button, Card, IntegrationTag, PageHeader, Proof, Progress, RagDot, Stat, Table, Td, Th, ragTone } from "@/components/ui";
import { CashSparkline } from "@/components/cash-sparkline";
import { attention, compliance, liveProjects, personById, scenarios, TODAY, variations, openingCashPence } from "@/lib/mock/data";
import { formatMoney, formatMoneyShort, pct, sumPence } from "@/lib/money";

export default function DashboardPage() {
  const onSite = liveProjects.filter((p) => p.stage !== "tender");
  const committed = sumPence(onSite.map((p) => p.committedPence));
  const budget = sumPence(onSite.map((p) => p.budgetPence));
  const contract = sumPence(onSite.map((p) => p.contractValuePence));
  const weighted = onSite.reduce((a, p) => a + p.forecastMarginPct * p.contractValuePence, 0) / contract;
  const pendingVo = variations.filter((v) => v.status === "pending" || v.status === "submitted");
  const base = scenarios[0].weeks;
  const net30 = sumPence(base.slice(0, 4).map((w) => w.inPence - w.outPence));

  return (
    <>
      <PageHeader
        kicker="Director dashboard"
        title="The whole business at a glance"
        subtitle={`${TODAY} · ${onSite.length} live projects · updated 4 minutes ago`}
        actions={
          <>
            <IntegrationTag system="Xero">synced 4 min ago</IntegrationTag>
            <IntegrationTag system="SharePoint">6 sites</IntegrationTag>
          </>
        }
      />

      <Proof
        kicker="Caught early"
        headline="£11,400 caught in week 3"
        detail="Goytre Grange groundworks ran 8% over budget, and you knew in the week it happened, not at the next monthly valuation. Early enough to recover it in the programme."
        action={<Button href="/commercial">Open cost report</Button>}
      />

      <div className="mb-5 grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-5">
        <Stat label="Committed spend" value={formatMoneyShort(committed)} meta={`of ${formatMoneyShort(budget)} budget`} />
        <Stat label="Forecast margin" value={pct(weighted)} meta="▲ 0.6 pts on last period" tone="good" />
        <Stat label="Variations pending" value={formatMoneyShort(sumPence(pendingVo.map((v) => v.valuePence)))} meta={`${pendingVo.length} awaiting client`} tone="warn" />
        <Stat label="Cash, next 30 days" value={formatMoneyShort(openingCashPence + net30)} meta="net position, base case" tone="good" />
        <Stat label="Certs expiring" value={compliance.length} meta="within 30 days" tone="bad" />
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.6fr_1fr]">
        <Card title="Live projects" action={<Link href="/projects" className="text-xs font-semibold text-accent-ink hover:underline">All projects</Link>}>
          <Table className="border-0">
            <thead>
              <tr>
                <Th>Project</Th>
                <Th>Stage</Th>
                <Th right>Contract</Th>
                <Th right>Margin</Th>
                <Th>Progress</Th>
                <Th>Cash</Th>
              </tr>
            </thead>
            <tbody>
              {onSite.map((p) => (
                <tr key={p.id} className="hover:bg-surface-2">
                  <Td>
                    <Link href={`/projects/${p.id}`} className="font-semibold hover:underline">
                      {p.name}
                    </Link>
                    <div className="text-xs text-muted">
                      {p.type} · PM {personById(p.pmId)?.name}
                    </div>
                  </Td>
                  <Td>
                    <Badge tone={p.stage === "on-site" ? "accent" : "neutral"}>{p.stage}</Badge>
                  </Td>
                  <Td right>{formatMoney(p.contractValuePence)}</Td>
                  <Td right>
                    <span className={p.forecastMarginPct < 10 ? "font-bold text-bad" : "text-ink"}>{pct(p.forecastMarginPct)}</span>
                  </Td>
                  <Td className="min-w-28">
                    <div className="mb-1 text-xs text-muted">{p.progressPct}%</div>
                    <Progress value={p.progressPct} />
                  </Td>
                  <Td>
                    <Badge tone={ragTone(p.cashRag)}>
                      <RagDot rag={p.cashRag} /> {p.cashRag}
                    </Badge>
                  </Td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card>

        <div className="flex min-w-0 flex-col gap-5">
          <Card title="Needs attention">
            <ul className="divide-y divide-hair">
              {attention.map((a) => (
                <li key={a.id}>
                  <Link href={a.href} className="flex items-center gap-2.5 py-2 text-sm hover:text-accent-ink">
                    <RagDot rag={a.rag} />
                    <span className="flex-1">{a.text}</span>
                    {a.value && <span className="tabular font-semibold">{a.value}</span>}
                    <ArrowRight size={14} className="text-muted" />
                  </Link>
                </li>
              ))}
            </ul>
          </Card>
          <Card title="13-week cash, base case" action={<Link href="/cashflow" className="text-xs font-semibold text-accent-ink hover:underline">Scenarios</Link>}>
            <CashSparkline weeks={base} opening={openingCashPence} />
          </Card>
        </div>
      </div>
    </>
  );
}
