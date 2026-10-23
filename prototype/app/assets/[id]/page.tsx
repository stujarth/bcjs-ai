import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { Badge, Card, PageHeader, Stat } from "@/components/ui";
import { HirePanel } from "@/components/assets/hire-panel";
import { QrLabel } from "@/components/assets/qr-label";
import { statusTone } from "@/components/assets/format";
import { assetBlocked, assetInspections, assetMovements, assets, hireRecords, projectById } from "@/lib/mock/data";
import { formatMoney } from "@/lib/money";

export function generateStaticParams() {
  return assets.map((a) => ({ id: a.id }));
}

export default async function AssetPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const a = assets.find((x) => x.id === id);
  if (!a) notFound();
  const moves = assetMovements.filter((m) => m.assetId === a.id);
  const inspections = assetInspections.filter((i) => i.assetId === a.id);
  const hire = hireRecords.find((h) => h.assetId === a.id);
  const project = a.projectId ? projectById(a.projectId) : undefined;
  const blocked = assetBlocked(a.id);

  return (
    <>
      <PageHeader
        kicker={`Tools & equipment · ${a.tag}`}
        title={a.name}
        subtitle={`${a.category} · ${a.kind === "bulk" ? `${a.qty} units` : `serial ${a.serial}`} · ${a.ownership === "hired" ? `hired from ${a.supplier}` : `bought from ${a.supplier}`}`}
        actions={
          <>
            <Badge tone={statusTone[a.status]}>{a.status}</Badge>
            {blocked && <Badge tone="bad">check-out blocked: inspection overdue</Badge>}
          </>
        }
      />

      <div className="mb-5 grid grid-cols-2 gap-3 md:grid-cols-4">
        <Stat label="Where" value={<span className="text-base">{a.location}</span>} meta={project ? `Job: ${project.name}` : "No job"} />
        <Stat label="Held by" value={<span className="text-base">{a.holder ?? "–"}</span>} meta={`Condition: ${a.condition}`} />
        <Stat label="Utilisation" value={`${a.utilisationPct}%`} meta="last 90 days" tone={a.utilisationPct < 25 ? "warn" : "good"} />
        <Stat
          label={a.chargePerWeekPence ? "Charge-out" : "Value"}
          value={a.chargePerWeekPence ? `${formatMoney(a.chargePerWeekPence)}/wk` : a.ownership === "hired" ? "Hired" : formatMoney(a.valuePence * a.qty)}
          meta={a.chargePerWeekPence ? "posted to the job cost report" : undefined}
        />
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.4fr_1fr]">
        <div className="flex min-w-0 flex-col gap-5">
          {a.split && (
            <Card title="Quantity by location">
              <ul className="divide-y divide-hair">
                {a.split.map((s) => (
                  <li key={s.location} className="flex items-center justify-between py-2 text-sm">
                    <span>{s.location}</span>
                    <span className="tabular font-bold">{s.qty}</span>
                  </li>
                ))}
              </ul>
            </Card>
          )}
          {hire && <HirePanel only={a.id} />}
          <Card title="Movement log (append-only)">
            {moves.length ? (
              <ol className="space-y-3">
                {moves.map((m, i) => (
                  <li key={i} className="flex gap-3 text-sm">
                    <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-lime" />
                    <div>
                      <div className="flex flex-wrap items-center gap-1.5">
                        <Badge tone={m.kind === "reported" ? "bad" : "neutral"}>{m.kind}</Badge>
                        <span>{m.from}</span>
                        <ArrowRight size={12} className="text-muted" />
                        <span>{m.to}</span>
                      </div>
                      <div className="text-xs text-muted">
                        {m.at} · {m.by}
                        {m.note ? ` · ${m.note}` : ""}
                      </div>
                    </div>
                  </li>
                ))}
              </ol>
            ) : (
              <p className="text-sm text-muted">No movements since import from Kabyn.</p>
            )}
          </Card>
        </div>
        <div className="flex min-w-0 flex-col gap-5">
          <Card title="QR label">
            <QrLabel tag={a.tag} name={a.name} />
            <p className="mt-2 text-xs text-muted">Scan in the site app to check out or in. Printed as a sheet of labels.</p>
          </Card>
          <Card title="Inspections">
            {inspections.length ? (
              <ul className="divide-y divide-hair">
                {inspections.map((i) => (
                  <li key={i.kind} className="flex items-center justify-between py-2 text-sm">
                    <div>
                      <div className="font-semibold">{i.kind}</div>
                      <div className="text-xs text-muted">
                        last {i.lastDone} · due {i.due}
                      </div>
                    </div>
                    <Badge tone={i.daysLeft < 0 ? "bad" : i.daysLeft <= 30 ? "warn" : "good"}>{i.daysLeft < 0 ? "overdue" : `${i.daysLeft} days`}</Badge>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted">No inspection regime for this item.</p>
            )}
          </Card>
          <Link href="/assets" className="text-xs font-semibold text-accent-ink hover:underline">
            ← All tools & equipment
          </Link>
        </div>
      </div>
    </>
  );
}
