"use client";

import { useState } from "react";
import { Badge, Card, Table, Td, Th, type Tone } from "@/components/ui";
import type { Variation, VariationStatus } from "@/lib/mock/types";
import { formatMoney, pct } from "@/lib/money";
import { cn } from "@/lib/cn";

const statusTone: Record<VariationStatus, Tone> = {
  approved: "good",
  pending: "warn",
  submitted: "neutral",
  disputed: "bad",
};

/**
 * Variation register with live forecast. Approved VOs are already in the forecast
 * (they sit in the contract value); the toggles add pending/submitted and, as a
 * worst case, the cost of disputed work with no recovery.
 */
export function VariationRegister({
  variations,
  forecastValuePence,
  forecastCostPence,
}: {
  variations: Variation[];
  forecastValuePence: number;
  forecastCostPence: number;
}) {
  const [includePending, setIncludePending] = useState(false);
  const [includeDisputed, setIncludeDisputed] = useState(false);

  const pending = variations.filter((v) => v.status === "pending" || v.status === "submitted");
  const disputed = variations.filter((v) => v.status === "disputed");
  const sum = (vs: Variation[], k: "valuePence" | "costPence") => vs.reduce((a, v) => a + v[k], 0);

  const baseMargin = ((forecastValuePence - forecastCostPence) / forecastValuePence) * 100;
  let value = forecastValuePence;
  let cost = forecastCostPence;
  if (includePending) {
    value += sum(pending, "valuePence");
    cost += sum(pending, "costPence");
  }
  if (includeDisputed) cost += sum(disputed, "costPence");
  const margin = ((value - cost) / value) * 100;
  const delta = margin - baseMargin;

  const included = (v: Variation) =>
    v.status === "approved" || (includePending && (v.status === "pending" || v.status === "submitted")) || (includeDisputed && v.status === "disputed");

  return (
    <Card title="Variation register">
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <Toggle checked={includePending} onChange={setIncludePending} label={`Include pending & submitted (${formatMoney(sum(pending, "valuePence"))})`} />
        <Toggle checked={includeDisputed} onChange={setIncludeDisputed} label={`Worst case: disputed at cost (${formatMoney(sum(disputed, "costPence"))})`} />
        <div className="ml-auto rounded-lg border border-hair bg-surface-2 px-3 py-2 text-sm" aria-live="polite">
          Forecast margin <span className="tabular font-bold">{pct(margin)}</span>
          {Math.abs(delta) >= 0.05 && (
            <span className={cn("tabular ml-2 text-xs font-semibold", delta > 0 ? "text-good" : "text-bad")}>
              {delta > 0 ? "▲" : "▼"} {Math.abs(delta).toFixed(1)} pts
            </span>
          )}
        </div>
      </div>
      {!includePending && pending.length > 0 && (
        <p className="mb-3 text-xs text-muted">
          {formatMoney(sum(pending, "valuePence"))} of pending and submitted variations are excluded until signed. Include them and forecast margin moves to{" "}
          <span className="font-semibold text-ink">
            {pct(
              ((forecastValuePence + sum(pending, "valuePence") - forecastCostPence - sum(pending, "costPence")) / (forecastValuePence + sum(pending, "valuePence"))) * 100,
            )}
          </span>
          .
        </p>
      )}
      <Table className="border-0">
        <thead>
          <tr>
            <Th>Ref</Th>
            <Th>Description</Th>
            <Th>Raised</Th>
            <Th right>Cost</Th>
            <Th right>Value</Th>
            <Th right>Time</Th>
            <Th>Status</Th>
            <Th>In forecast</Th>
          </tr>
        </thead>
        <tbody>
          {variations.map((v) => {
            const stale = (v.status === "pending" || v.status === "submitted") && v.ageDays > 30;
            return (
              <tr key={v.ref} className={cn(!included(v) && "opacity-60")}>
                <Td className="font-mono text-xs font-semibold">
                  {v.ref}
                  {v.rfiRef && <div className="font-sans font-normal text-muted">{v.rfiRef}</div>}
                </Td>
                <Td>{v.description}</Td>
                <Td className="whitespace-nowrap text-muted">{v.raised}</Td>
                <Td right>{formatMoney(v.costPence)}</Td>
                <Td right>{formatMoney(v.valuePence)}</Td>
                <Td right>{v.timeDays ? `+${v.timeDays} days` : "–"}</Td>
                <Td>
                  <Badge tone={statusTone[v.status]}>{v.status}</Badge>
                  {v.status !== "approved" && (
                    <div className={cn("mt-1 text-xs", stale ? "font-semibold text-bad" : "text-muted")}>{v.ageDays}d old</div>
                  )}
                </Td>
                <Td>{included(v) ? <span className="text-good">✓</span> : <span className="text-muted">–</span>}</Td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </Card>
  );
}

function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <label className="inline-flex cursor-pointer items-center gap-2 text-sm text-ink">
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cn("relative h-5 w-9 shrink-0 rounded-full transition", checked ? "bg-lime" : "bg-hair")}
      >
        <span className={cn("absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition", checked ? "left-[18px]" : "left-0.5")} />
      </button>
      {label}
    </label>
  );
}
