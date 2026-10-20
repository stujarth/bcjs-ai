import Link from "next/link";
import { Badge, Card, IntegrationTag, PageHeader, Proof, Stat, Table, Td, Th, type Tone } from "@/components/ui";
import { VariationRegister } from "@/components/commercial/variation-register";
import { LockPeriod } from "@/components/commercial/lock-period";
import { cvrLines, projectById, projects, valuations, variations } from "@/lib/mock/data";
import { formatMoney, formatMoneyShort, pct, sumPence } from "@/lib/money";
import { cn } from "@/lib/cn";

const valuationTone: Record<string, Tone> = { paid: "good", certified: "accent", applied: "neutral", overdue: "bad" };

export default async function CommercialPage({ searchParams }: { searchParams: Promise<{ project?: string }> }) {
  const { project: requested } = await searchParams;
  const withVariations = projects.filter((p) => variations.some((v) => v.projectId === p.id));
  const project = projectById(requested ?? "") && withVariations.some((p) => p.id === requested) ? projectById(requested!)! : projectById("goytre")!;

  const vos = variations.filter((v) => v.projectId === project.id);
  const lines = cvrLines[project.id];
  const history = valuations.filter((v) => v.projectId === project.id);
  // Forecast final value is the contract sum (approved variations already in it);
  // forecast final cost follows from the reported margin.
  const forecastValue = project.contractValuePence;
  const forecastCost = Math.round(forecastValue * (1 - project.forecastMarginPct / 100));
  const pendingValue = sumPence(vos.filter((v) => v.status === "pending" || v.status === "submitted").map((v) => v.valuePence));

  return (
    <>
      <PageHeader
        kicker="Commercial & QS"
        title={`${project.name} · period 8`}
        subtitle={`Cost and value reconciliation · ${project.ref} · QS James Price · next review 30 Nov`}
        actions={<LockPeriod period={8} projectName={project.name} />}
      />

      <nav aria-label="Project" className="mb-5 flex flex-wrap gap-1.5">
        {withVariations.map((p) => (
          <Link
            key={p.id}
            href={`/commercial?project=${p.id}`}
            aria-current={p.id === project.id ? "page" : undefined}
            className={cn(
              "rounded-full px-3 py-1.5 text-xs font-semibold",
              p.id === project.id ? "bg-ink text-bg" : "border border-hair bg-surface-2 text-muted hover:text-ink",
            )}
          >
            {p.name}
          </Link>
        ))}
      </nav>

      <Proof
        kicker="Cost and value reconciliation"
        headline={`${pct(project.forecastMarginPct)} forecast margin`}
        detail={`Value earned ${formatMoney(project.valueEarnedPence)} against cost to date ${formatMoney(project.actualPence)}, with ${formatMoney(
          project.costToCompletePence,
        )} to complete. Approved variations included; ${formatMoney(pendingValue)} pending excluded until signed.`}
      />

      <div className="mb-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat label="Value earned" value={formatMoneyShort(project.valueEarnedPence)} meta={`of ${formatMoneyShort(project.contractValuePence)} contract`} />
        <Stat label="Cost to date" value={formatMoneyShort(project.actualPence)} meta="actuals from Xero" />
        <Stat label="Committed" value={formatMoneyShort(project.committedPence)} meta={`of ${formatMoneyShort(project.budgetPence)} budget`} />
        <Stat label="Cost to complete" value={formatMoneyShort(project.costToCompletePence)} tone={project.forecastMarginPct < 10 ? "bad" : undefined} />
      </div>

      <Card title="Cost report by cost code" className="mb-5" action={<IntegrationTag system="Xero">actuals synced</IntegrationTag>}>
        {lines ? (
          <Table className="border-0">
            <thead>
              <tr>
                <Th>Cost code</Th>
                <Th right>Budget</Th>
                <Th right>Committed</Th>
                <Th right>Actual</Th>
                <Th right>Forecast final</Th>
                <Th right>Variance</Th>
              </tr>
            </thead>
            <tbody>
              {lines.map((l) => {
                const variance = l.budgetPence - l.forecastFinalPence;
                const overPct = (-variance / l.budgetPence) * 100;
                const bad = overPct >= 5;
                return (
                  <tr key={l.costCode} className={cn(bad && "bg-bad-soft")}>
                    <Td>
                      <span className="font-mono text-xs font-semibold">{l.costCode}</span> <span>{l.name}</span>
                      {bad && <div className="text-xs font-semibold text-bad">{overPct.toFixed(0)}% over budget, flagged in week 3</div>}
                    </Td>
                    <Td right>{formatMoney(l.budgetPence)}</Td>
                    <Td right>{formatMoney(l.committedPence)}</Td>
                    <Td right>{formatMoney(l.actualPence)}</Td>
                    <Td right>{formatMoney(l.forecastFinalPence)}</Td>
                    <Td right className={variance < 0 ? "font-semibold text-bad" : "text-good"}>
                      {variance < 0 ? "−" : "+"}
                      {formatMoney(Math.abs(variance))}
                    </Td>
                  </tr>
                );
              })}
              <tr className="bg-surface-2 font-bold">
                <Td>Total</Td>
                <Td right>{formatMoney(sumPence(lines.map((l) => l.budgetPence)))}</Td>
                <Td right>{formatMoney(sumPence(lines.map((l) => l.committedPence)))}</Td>
                <Td right>{formatMoney(sumPence(lines.map((l) => l.actualPence)))}</Td>
                <Td right>{formatMoney(sumPence(lines.map((l) => l.forecastFinalPence)))}</Td>
                <Td right>{formatMoney(sumPence(lines.map((l) => l.budgetPence - l.forecastFinalPence)))}</Td>
              </tr>
            </tbody>
          </Table>
        ) : (
          <p className="text-sm text-muted">The cost-code breakdown for {project.name} isn&apos;t loaded in this prototype. Goytre Grange shows the full view.</p>
        )}
      </Card>

      <div className="mb-5">
        <VariationRegister variations={vos} forecastValuePence={forecastValue} forecastCostPence={forecastCost} />
      </div>

      <Card title="Valuation & application history">
        {history.length ? (
          <Table className="border-0">
            <thead>
              <tr>
                <Th>No.</Th>
                <Th>Period</Th>
                <Th right>Applied</Th>
                <Th right>Certified</Th>
                <Th>Due</Th>
                <Th>Status</Th>
              </tr>
            </thead>
            <tbody>
              {history.map((v) => (
                <tr key={`${v.projectId}-${v.number}`}>
                  <Td className="font-mono text-xs">APP-{v.number}</Td>
                  <Td>{v.period}</Td>
                  <Td right>{formatMoney(v.appliedPence)}</Td>
                  <Td right>{v.certifiedPence ? formatMoney(v.certifiedPence) : "–"}</Td>
                  <Td>{v.dueDate}</Td>
                  <Td>
                    <Badge tone={valuationTone[v.status]}>{v.status}</Badge>
                  </Td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          <p className="text-sm text-muted">No applications recorded yet.</p>
        )}
      </Card>
    </>
  );
}
