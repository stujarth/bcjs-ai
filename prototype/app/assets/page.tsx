import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import { AiNote, Badge, Card, PageHeader, Stat, Table, Td, Th } from "@/components/ui";
import { AssetRegister } from "@/components/assets/register";
import { HirePanel } from "@/components/assets/hire-panel";
import { hireCostToDate } from "@/components/assets/format";
import { assetInspections, assets, hireRecords, hireReturned, kabynImport, projectById } from "@/lib/mock/data";
import { formatMoney, sumPence } from "@/lib/money";

export default function AssetsPage() {
  const units = assets.reduce((n, a) => n + a.qty, 0);
  const inUse = assets.filter((a) => a.status === "in use").length;
  const hireWeekly = sumPence(hireRecords.map((h) => h.ratePerWeekPence));
  const due = assetInspections.filter((i) => i.daysLeft <= 30).sort((a, b) => a.daysLeft - b.daysLeft);
  const lost = assets.filter((a) => a.status === "lost");
  const owned = sumPence(assets.filter((a) => a.ownership === "owned").map((a) => a.valuePence * a.qty));
  const chipper = assets.find((a) => a.id === "a05")!;

  return (
    <>
      <PageHeader
        kicker="Operations"
        title="Tools & equipment"
        subtitle="Every tool, plant item and hire has an owner, a location and a cost code. Scan the QR to check kit in or out on site, even with no signal."
        actions={<Badge tone="accent">Replaces Kabyn · Phase 2</Badge>}
      />

      <div className="mb-5 rounded-xl border border-lime/40 bg-accent-soft px-4 py-3 text-sm text-accent-ink">
        <b>Imported from Kabyn:</b> {kabynImport.records} records became {kabynImport.assets} assets. {kabynImport.bulkGrouped} bulk items were grouped, so 40 identical fence panels are now one line with a quantity, and {kabynImport.duplicatesMerged} duplicates were merged.{" "}
        {kabynImport.missingLocation} records had no location and are listed for a yard stock-take. QR labels are ready to print.
      </div>

      <div className="mb-5 grid grid-cols-2 gap-3 md:grid-cols-5">
        <Stat label="Assets" value={kabynImport.assets} meta={`${assets.length} shown in this demo · ${units} units, ${formatMoney(owned)} owned`} />
        <Stat label="In use on jobs" value={inUse} meta="checked out by QR" tone="good" />
        <Stat label="On hire" value={hireRecords.length} meta={`${formatMoney(hireWeekly)} a week`} tone="warn" />
        <Stat label="Inspections due" value={due.length} meta={`${due.filter((d) => d.daysLeft < 0).length} overdue · blocked`} tone="bad" />
        <Stat label="Lost or damaged" value={lost.length} meta="charged to the job" tone="bad" />
      </div>

      <div className="mb-5 grid gap-5 xl:grid-cols-[1.4fr_1fr]">
        <HirePanel />
        <div className="flex min-w-0 flex-col gap-5">
          <Card title="Inspections due (PAT, LOLER, calibration, service)">
            <ul className="divide-y divide-hair">
              {due.map((i) => {
                const a = assets.find((x) => x.id === i.assetId)!;
                return (
                  <li key={`${i.assetId}-${i.kind}`} className="flex items-center gap-3 py-2 text-sm">
                    <AlertTriangle size={15} className={i.daysLeft < 0 ? "text-bad" : "text-warn"} />
                    <div className="min-w-0 flex-1">
                      <Link href={`/assets/${a.id}`} className="font-semibold hover:underline">
                        {a.name}
                      </Link>
                      <div className="text-xs text-muted">
                        {i.kind} · due {i.due}
                      </div>
                    </div>
                    <Badge tone={i.daysLeft < 0 ? "bad" : "warn"}>{i.daysLeft < 0 ? `${-i.daysLeft} days overdue` : i.daysLeft === 0 ? "due today" : `${i.daysLeft} days`}</Badge>
                  </li>
                );
              })}
            </ul>
            <p className="mt-2 text-xs text-muted">Overdue items can&apos;t be checked out. Dates also feed the compliance page and the start-on-site checklist.</p>
          </Card>
          <AiNote>
            The {chipper.name} has been hired {chipper.hiredTimesThisYear} times this year, about {formatMoney(hireCostToDate(hireRecords[1]) * 3)} in hire. Buying one would pay back in under a year. Suggestion
            only: a person decides.
          </AiNote>
        </div>
      </div>

      <h2 className="mb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">Register</h2>
      <AssetRegister />

      <h2 className="mb-2 mt-6 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">Hire returned (last 30 days)</h2>
      <Table>
        <thead>
          <tr>
            <Th>Item</Th>
            <Th>Supplier</Th>
            <Th>Job</Th>
            <Th right>Days</Th>
            <Th right>Cost</Th>
            <Th>Returned</Th>
            <Th>Collection ref</Th>
          </tr>
        </thead>
        <tbody>
          {hireReturned.map((h) => (
            <tr key={h.collectionRef}>
              <Td className="font-semibold">{h.asset}</Td>
              <Td>{h.supplier}</Td>
              <Td>{projectById(h.projectId)?.name}</Td>
              <Td right>{h.days}</Td>
              <Td right>{formatMoney(h.costPence)}</Td>
              <Td>{h.returned}</Td>
              <Td className="font-mono text-xs">{h.collectionRef}</Td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
}
