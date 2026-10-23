import { AlertTriangle } from "lucide-react";
import { Badge, Card, PageHeader, Stat, Table, Td, Th } from "@/components/ui";
import { RamsDrafter } from "@/components/compliance/rams-drafter";
import Link from "next/link";
import { assetInspections, assets, compliance, incidents, projectById, rams, suppliers } from "@/lib/mock/data";

export default function CompliancePage() {
  const expiring = suppliers.filter((s) => s.status !== "good");
  const ramsAttention = rams.filter((r) => r.status !== "Approved");
  const kitDue = assetInspections.filter((i) => i.daysLeft <= 30).sort((a, b) => a.daysLeft - b.daysLeft);

  return (
    <>
      <PageHeader
        kicker="Governance"
        title="Health, safety & compliance"
        subtitle="Lapsed tickets, expired insurance and missing RAMS surface before someone is on site, not after."
      />

      <div className="mb-5 grid grid-cols-2 gap-3 md:grid-cols-4">
        <Stat label="Expiring in 30 days" value={compliance.length} meta="certs & insurance" tone="warn" />
        <Stat label="Suppliers flagged" value={expiring.length} meta="ordering blocked if expired" tone={expiring.some((s) => s.status === "expired") ? "bad" : "warn"} />
        <Stat label="RAMS needing action" value={ramsAttention.length} meta="draft or review due" tone="warn" />
        <Stat label="Incidents (90 days)" value={incidents.length} meta="0 RIDDOR reportable" />
      </div>

      <div className="mb-5 grid gap-5 lg:grid-cols-[1fr_1.2fr]">
        <Card title="Expiry alerts">
          <ul className="divide-y divide-hair">
            {compliance.map((c) => (
              <li key={`${c.party}-${c.kind}`} className="flex items-center gap-3 py-2 text-sm">
                <AlertTriangle size={16} className={c.daysLeft <= 14 ? "text-bad" : "text-warn"} />
                <div className="flex-1">
                  <div className="font-semibold">{c.party}</div>
                  <div className="text-xs text-muted">
                    {c.kind} · expires {c.expires}
                  </div>
                </div>
                <Badge tone={c.daysLeft <= 14 ? "bad" : "warn"}>{c.daysLeft} days</Badge>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-muted">Expiries feed the job readiness checklist and block purchase orders to that supplier until renewed.</p>
          <h3 className="mb-1 mt-4 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">Tools & equipment inspections</h3>
          <ul className="divide-y divide-hair">
            {kitDue.map((i) => {
              const a = assets.find((x) => x.id === i.assetId)!;
              return (
                <li key={`${i.assetId}-${i.kind}`} className="flex items-center gap-3 py-2 text-sm">
                  <AlertTriangle size={16} className={i.daysLeft < 0 ? "text-bad" : "text-warn"} />
                  <div className="flex-1">
                    <Link href={`/assets/${a.id}`} className="font-semibold hover:underline">
                      {a.name}
                    </Link>
                    <div className="text-xs text-muted">
                      {i.kind} · due {i.due}
                    </div>
                  </div>
                  <Badge tone={i.daysLeft < 0 ? "bad" : "warn"}>{i.daysLeft < 0 ? `${-i.daysLeft} days overdue` : `${i.daysLeft} days`}</Badge>
                </li>
              );
            })}
          </ul>
        </Card>
        <RamsDrafter />
      </div>

      <h2 className="mb-2 mt-6 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">Supplier & subcontractor register</h2>
      <Table className="mb-6">
        <thead>
          <tr>
            <Th>Name</Th>
            <Th>Trade</Th>
            <Th>Type</Th>
            <Th>Terms</Th>
            <Th>Public liability</Th>
            <Th>Employer&apos;s liability</Th>
            <Th>Status</Th>
          </tr>
        </thead>
        <tbody>
          {suppliers.map((s) => (
            <tr key={s.id}>
              <Td className="font-semibold">{s.name}</Td>
              <Td>{s.trade}</Td>
              <Td>{s.kind}</Td>
              <Td>{s.paymentTerms}</Td>
              <Td>{s.plExpiry}</Td>
              <Td>{s.elExpiry}</Td>
              <Td>
                <Badge tone={s.status === "good" ? "good" : s.status === "expiring" ? "warn" : "bad"}>
                  {s.status === "expired" ? "expired: orders blocked" : s.status}
                </Badge>
              </Td>
            </tr>
          ))}
        </tbody>
      </Table>

      <h2 className="mb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">RAMS register</h2>
      <Table className="mb-6">
        <thead>
          <tr>
            <Th>Project</Th>
            <Th>RAMS</Th>
            <Th>Activity</Th>
            <Th>Status</Th>
            <Th right>Signed on</Th>
            <Th>Review</Th>
          </tr>
        </thead>
        <tbody>
          {rams.map((r) => (
            <tr key={r.id}>
              <Td>{projectById(r.projectId)?.name}</Td>
              <Td className="font-semibold">{r.title}</Td>
              <Td>{r.activity}</Td>
              <Td>
                <Badge tone={r.status === "Approved" ? "good" : r.status === "Draft (AI)" ? "accent" : "warn"}>{r.status}</Badge>
              </Td>
              <Td right>
                {r.signedOn}/{r.required}
              </Td>
              <Td>{r.reviewDate}</Td>
            </tr>
          ))}
        </tbody>
      </Table>

      <div className="mb-2 flex flex-wrap items-center gap-2">
        <h2 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">Incident & accident log</h2>
        <Badge tone="dark">Append-only</Badge>
      </div>
      <Table>
        <thead>
          <tr>
            <Th>Ref</Th>
            <Th>Date</Th>
            <Th>Project</Th>
            <Th>Type</Th>
            <Th>What happened</Th>
            <Th>Actions taken</Th>
            <Th>RIDDOR</Th>
          </tr>
        </thead>
        <tbody>
          {incidents.map((i) => (
            <tr key={i.ref}>
              <Td className="font-mono text-xs">{i.ref}</Td>
              <Td className="whitespace-nowrap">{i.date}</Td>
              <Td>{projectById(i.projectId)?.name}</Td>
              <Td>
                <Badge tone={i.kind === "Near miss" ? "warn" : "bad"}>{i.kind}</Badge>
              </Td>
              <Td>
                {i.description}
                <div className="text-xs text-muted">Reported by {i.reportedBy}</div>
              </Td>
              <Td>{i.actions}</Td>
              <Td>{i.riddor ? "Yes" : "No"}</Td>
            </tr>
          ))}
        </tbody>
      </Table>
      <p className="mt-2 text-xs text-muted">Entries can be added to but never edited or deleted. Corrections are new entries that reference the original.</p>
    </>
  );
}
