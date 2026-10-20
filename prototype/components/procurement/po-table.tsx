"use client";

import { useState } from "react";
import { Check, X } from "lucide-react";
import { Badge, Table, Td, Th, type Tone } from "@/components/ui";
import { useRole } from "@/components/role-context";
import { approvalBands, projectById } from "@/lib/mock/data";
import type { PurchaseOrder, RoleKey } from "@/lib/mock/types";
import { formatMoney } from "@/lib/money";

const statusTone: Record<PurchaseOrder["status"], Tone> = {
  "awaiting approval": "warn",
  approved: "accent",
  "part delivered": "neutral",
  complete: "good",
  "on hire": "neutral",
};

// Which approval bands each prototype role may sign off (Sean §10a, D4).
const roleBand: Record<RoleKey, number> = { site: 0, pm: 1, qs: 2, director: 3, finance: -1, subcontractor: -1 };

function bandFor(valuePence: number) {
  const idx = approvalBands.findIndex((b) => valuePence <= b.upToPence);
  return { idx, ...approvalBands[idx] };
}

export function PoTable({ orders }: { orders: PurchaseOrder[] }) {
  const { role } = useRole();
  const [decisions, setDecisions] = useState<Record<string, "approved" | "rejected">>({});

  return (
    <Table>
      <thead>
        <tr>
          <Th>Order</Th>
          <Th>Supplier</Th>
          <Th>Project · cost code</Th>
          <Th right>Value</Th>
          <Th right>Invoiced</Th>
          <Th>Approval band</Th>
          <Th>Status</Th>
        </tr>
      </thead>
      <tbody>
        {orders.map((po) => {
          const band = bandFor(po.valuePence);
          const decision = decisions[po.ref];
          const canApprove = roleBand[role] >= band.idx;
          const status = decision ?? po.status;
          return (
            <tr key={po.ref}>
              <Td className="font-mono text-xs font-semibold">
                {po.ref}
                <div className="font-sans font-normal text-muted">{po.raised}</div>
              </Td>
              <Td>{po.supplier}</Td>
              <Td>
                {projectById(po.projectId)?.name}
                <div className="text-xs text-muted">
                  {po.costCode} {po.costCodeName}
                </div>
              </Td>
              <Td right>{formatMoney(po.valuePence)}</Td>
              <Td right>{po.invoicedPence ? formatMoney(po.invoicedPence) : "–"}</Td>
              <Td className="text-xs text-muted">{band.approver}</Td>
              <Td>
                {po.status === "awaiting approval" && !decision ? (
                  canApprove ? (
                    <div className="flex gap-1.5">
                      <button
                        onClick={() => setDecisions((d) => ({ ...d, [po.ref]: "approved" }))}
                        className="inline-flex items-center gap-1 rounded-full bg-lime px-2.5 py-1 text-[11px] font-bold text-night hover:bg-lime-dk"
                      >
                        <Check size={12} /> Approve
                      </button>
                      <button
                        onClick={() => setDecisions((d) => ({ ...d, [po.ref]: "rejected" }))}
                        className="inline-flex items-center gap-1 rounded-full border border-hair px-2.5 py-1 text-[11px] font-semibold text-muted hover:text-bad"
                        aria-label={`Reject ${po.ref}`}
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ) : (
                    <div>
                      <Badge tone="warn">awaiting approval</Badge>
                      <div className="mt-1 text-[11px] text-muted">Needs {band.approver}</div>
                    </div>
                  )
                ) : (
                  <div>
                    <Badge tone={status === "rejected" ? "bad" : status === "approved" ? "accent" : statusTone[po.status]}>{status}</Badge>
                    {decision && <div className="mt-1 text-[11px] text-muted">by you, just now · audited</div>}
                  </div>
                )}
              </Td>
            </tr>
          );
        })}
      </tbody>
    </Table>
  );
}
