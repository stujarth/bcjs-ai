"use client";

import { useState } from "react";
import type { PurchaseOrder } from "@/lib/mock/types";
import { formatMoney } from "@/lib/money";
import { projectById } from "@/lib/mock/data";

/** Preview of the Adaptive Card the approver gets in Teams. */
export function TeamsApprovalCard({ po, approver }: { po: PurchaseOrder; approver: string }) {
  const [state, setState] = useState<"open" | "approved" | "rejected">("open");
  const project = projectById(po.projectId);
  return (
    <div className="overflow-hidden rounded-lg border border-hair bg-surface shadow-sm">
      <div className="flex items-center gap-2 bg-[#5B5FC7] px-3 py-2 text-xs font-semibold text-white">
        <span className="flex h-5 w-5 items-center justify-center rounded bg-white/20 text-[10px] font-bold">T</span>
        Microsoft Teams · BCJS Operations
        <span className="ml-auto font-normal opacity-80">now</span>
      </div>
      <div className="border-l-4 border-[#5B5FC7] p-4">
        <div className="text-[11px] font-semibold uppercase tracking-wider text-muted">Purchase order approval</div>
        <div className="mt-1 text-lg font-bold text-ink">
          {po.ref} · {formatMoney(po.valuePence)}
        </div>
        <dl className="mt-2 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-sm">
          <dt className="text-muted">Supplier</dt>
          <dd className="text-ink">{po.supplier}</dd>
          <dt className="text-muted">Project</dt>
          <dd className="text-ink">{project?.name}</dd>
          <dt className="text-muted">Cost code</dt>
          <dd className="text-ink">
            {po.costCode} {po.costCodeName}
          </dd>
          <dt className="text-muted">Budget left</dt>
          <dd className="text-ink">Within budget line · supplier insurance in date</dd>
          <dt className="text-muted">Needs</dt>
          <dd className="text-ink">{approver}</dd>
        </dl>
        {state === "open" ? (
          <div className="mt-4 flex gap-2">
            <button onClick={() => setState("approved")} className="rounded bg-[#5B5FC7] px-4 py-1.5 text-sm font-semibold text-white hover:bg-[#4f52b2]">
              Approve
            </button>
            <button onClick={() => setState("rejected")} className="rounded border border-hair px-4 py-1.5 text-sm font-semibold text-ink hover:bg-surface-2">
              Reject
            </button>
            <button className="ml-auto text-sm text-[#5B5FC7] hover:underline">Open in BCJS</button>
          </div>
        ) : (
          <div className="mt-4 rounded bg-surface-2 px-3 py-2 text-sm text-ink" role="status">
            {state === "approved" ? "✓ Approved" : "✕ Rejected"} by Emma Milne in Teams · recorded on the PO audit trail
          </div>
        )}
      </div>
    </div>
  );
}
