"use client";

import { useState } from "react";
import { AlertTriangle } from "lucide-react";
import { Badge, Button, Card, Table, Td, Th } from "@/components/ui";
import type { Subcontract } from "@/lib/mock/data";
import { formatMoney } from "@/lib/money";
import { cisDeductionPence, formatDayShort, isoToDate } from "./cycles";

const cisLabel = { gross: "Gross", "20": "20% (registered)", "30": "30% (unverified)" } as const;

export function Subcontracts({ items }: { items: Subcontract[] }) {
  const [rows, setRows] = useState(items);
  const [created, setCreated] = useState<string | null>(null);

  const createCommitment = (ref: string) => {
    setRows((rs) => rs.map((r) => (r.ref === ref ? { ...r, commitmentRef: "CM-0427" } : r)));
    setCreated(ref);
  };

  const byDate = [...rows].sort((a, b) => isoToDate(a.nextApplicationIso).getTime() - isoToDate(b.nextApplicationIso).getTime());

  return (
    <Card title="B · Subcontracts & commitments">
      <Table>
        <thead>
          <tr>
            <Th>Subcontract</Th>
            <Th right>Value</Th>
            <Th right>Retention</Th>
            <Th>CIS</Th>
            <Th right>CIS on labour</Th>
            <Th>VAT</Th>
            <Th>Commitment</Th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => {
            const retention = Math.round((r.valuePence * r.retentionPct) / 100);
            const cis = cisDeductionPence(r.labourPence, r.cis);
            return (
              <tr key={r.ref}>
                <Td>
                  <div className="font-semibold">{r.party}</div>
                  <div className="text-xs text-muted">
                    {r.ref} · {r.trade}
                  </div>
                </Td>
                <Td right>{formatMoney(r.valuePence)}</Td>
                <Td right>
                  {r.retentionPct}%<div className="text-xs text-muted">{formatMoney(retention)}</div>
                </Td>
                <Td>
                  <Badge tone={r.cis === "gross" ? "good" : r.cis === "30" ? "bad" : "neutral"}>{cisLabel[r.cis]}</Badge>
                </Td>
                <Td right>
                  {formatMoney(cis)}
                  <div className="text-xs text-muted">on {formatMoney(r.labourPence)} labour</div>
                </Td>
                <Td>{r.drcVat ? <Badge tone="accent">Domestic reverse charge</Badge> : <Badge>Standard</Badge>}</Td>
                <Td>
                  {r.commitmentRef ? (
                    <Badge tone="good">Linked · {r.commitmentRef}</Badge>
                  ) : (
                    <div className="flex flex-col items-start gap-1.5">
                      <Badge tone="bad">
                        <AlertTriangle size={11} /> No commitment
                      </Badge>
                      <Button variant="secondary" className="px-3 py-1" onClick={() => createCommitment(r.ref)}>
                        Create commitment
                      </Button>
                    </div>
                  )}
                </Td>
              </tr>
            );
          })}
        </tbody>
      </Table>

      {rows.some((r) => !r.commitmentRef) ? (
        <div className="mt-3 flex items-start gap-2 rounded-lg border border-bad/40 bg-bad-soft px-3 py-2 text-sm text-ink">
          <AlertTriangle size={16} className="mt-0.5 shrink-0 text-bad" />
          <div>
            <span className="font-semibold">Gateway check:</span> a subcontract can&apos;t be issued for signature until its value is committed in the purchase
            ledger. Otherwise the cost report and cash flow understate what BCJS owes.
          </div>
        </div>
      ) : (
        created && (
          <div className="mt-3 rounded-lg border border-good/40 bg-good-soft px-3 py-2 text-sm text-ink">
            Commitment CM-0427 created for {rows.find((r) => r.ref === created)?.party}. It now shows as committed cost and in the cash forecast. Subcontract
            ready to issue via Acrobat Sign.
          </div>
        )
      )}

      <div className="mt-5">
        <h3 className="heading mb-2 text-sm">Next subcontractor payment notices due</h3>
        <ul className="divide-y divide-hair rounded-lg border border-hair">
          {byDate.map((r) => {
            const app = isoToDate(r.nextApplicationIso);
            const notice = new Date(app.getTime() + 5 * 86_400_000);
            return (
              <li key={r.ref} className="flex flex-wrap items-center gap-x-4 gap-y-1 px-3 py-2 text-sm">
                <span className="font-semibold">{r.party}</span>
                <span className="text-muted">Application {formatDayShort(app)}</span>
                <span className="ml-auto">
                  Payment notice due <span className="tabular font-semibold">{formatDayShort(notice)}</span>
                </span>
              </li>
            );
          })}
        </ul>
        <p className="mt-2 text-xs text-muted">
          Each subcontract gets its own Construction Act cycle from its payment terms. Their own variations are flagged as domestic variations against the
          main contract.
        </p>
      </div>
    </Card>
  );
}
