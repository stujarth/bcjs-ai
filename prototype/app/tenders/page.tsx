import Link from "next/link";
import { Badge, Card, PageHeader, Stat } from "@/components/ui";
import { tenderPackages } from "@/lib/mock/data";
import { formatMoney, formatMoneyShort, sumPence } from "@/lib/money";

const tone = { draft: "neutral", "out to tender": "warn", analysis: "accent", awarded: "good" } as const;

export default function TendersPage() {
  const returned = tenderPackages.flatMap((t) => t.bidders).filter((b) => b.returned).length;
  const invited = tenderPackages.flatMap((t) => t.bidders).length;
  return (
    <>
      <PageHeader
        kicker="Win work · Tenders"
        title="Tender packages"
        subtitle="Send packages to your supply chain, get returns back in one format, and let AI compare them line by line before you commit a price."
      />
      <div className="mb-5 grid grid-cols-2 gap-3 md:grid-cols-4">
        <Stat label="Live packages" value={tenderPackages.length} meta="The Old Forge (EST-0236)" />
        <Stat label="Budget out to tender" value={formatMoneyShort(sumPence(tenderPackages.map((t) => t.budgetPence)))} meta="from the estimate" />
        <Stat label="Returns in" value={`${returned} / ${invited}`} meta="bidders invited" tone="warn" />
        <Stat label="Tender queries raised" value={sumPence(tenderPackages.map((t) => t.tqs.length))} meta="by AI, checked by QS" tone="good" />
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        {tenderPackages.map((t) => (
          <Link key={t.id} href={`/tenders/${t.id}`} className="block">
            <Card className="h-full transition hover:border-lime">
              <div className="mb-1 flex items-center gap-2">
                <span className="font-mono text-[11px] text-muted">{t.ref}</span>
                <Badge tone={tone[t.status]} className="ml-auto">
                  {t.status}
                </Badge>
              </div>
              <div className="font-semibold">{t.name}</div>
              <div className="text-xs text-muted">
                {t.project} · {t.trade}
              </div>
              <dl className="mt-3 grid grid-cols-2 gap-2 text-xs">
                <div>
                  <dt className="text-muted">Budget</dt>
                  <dd className="tabular font-semibold">{formatMoney(t.budgetPence)}</dd>
                </div>
                <div>
                  <dt className="text-muted">Returns due</dt>
                  <dd className="font-semibold">{t.returnDeadline}</dd>
                </div>
                <div>
                  <dt className="text-muted">Bidders</dt>
                  <dd className="font-semibold">
                    {t.bidders.filter((b) => b.returned).length} of {t.bidders.length} returned
                  </dd>
                </div>
                <div>
                  <dt className="text-muted">Tender queries</dt>
                  <dd className="font-semibold">{t.tqs.length}</dd>
                </div>
              </dl>
            </Card>
          </Link>
        ))}
      </div>
    </>
  );
}
