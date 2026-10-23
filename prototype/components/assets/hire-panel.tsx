"use client";

import Link from "next/link";
import { useState } from "react";
import { Badge, Button, Card } from "@/components/ui";
import { assets, hireRecords, projectById } from "@/lib/mock/data";
import { formatMoney } from "@/lib/money";
import { hireCostToDate, IDLE_THRESHOLD_DAYS } from "./format";

export function HirePanel({ only }: { only?: string }) {
  const [requested, setRequested] = useState<Record<string, string>>({});
  const list = hireRecords
    .filter((h) => !only || h.assetId === only)
    .sort((a, b) => b.idleDays - a.idleDays);

  const offHire = (id: string) => setRequested((r) => ({ ...r, [id]: `OFF-${id.toUpperCase()}-${2200 + Object.keys(r).length}` }));

  return (
    <Card title={only ? "Hire record" : "On hire now"} action={!only ? <span className="text-xs text-muted">sorted by idle days</span> : undefined}>
      <ul className="divide-y divide-hair">
        {list.map((h) => {
          const asset = assets.find((a) => a.id === h.assetId)!;
          const idle = h.idleDays > IDLE_THRESHOLD_DAYS;
          const ref = requested[h.id];
          return (
            <li key={h.id} className="flex flex-wrap items-center gap-3 py-3 text-sm">
              <div className="min-w-0 flex-1">
                <Link href={`/assets/${asset.id}`} className="font-semibold hover:underline">
                  {asset.name}
                </Link>
                <div className="text-xs text-muted">
                  {h.supplier} · {projectById(h.projectId)?.name} · {h.costCode} ·{" "}
                  <Link href="/procurement" className="text-accent-ink hover:underline">
                    {h.poRef}
                  </Link>
                </div>
                <div className="mt-1 flex flex-wrap gap-1.5 text-xs">
                  <Badge tone="neutral">
                    on hire {h.daysOnHire} days since {h.onHireDate}
                  </Badge>
                  <Badge tone="neutral">{formatMoney(h.ratePerWeekPence)}/wk</Badge>
                  {idle && !ref && <Badge tone="bad">idle {h.idleDays} days: off-hire?</Badge>}
                </div>
              </div>
              <div className="text-right">
                <div className="tabular font-bold">{formatMoney(hireCostToDate(h))}</div>
                <div className="text-[11px] text-muted">cost to date</div>
              </div>
              {ref ? (
                <Badge tone="good">Off-hire requested · {ref}</Badge>
              ) : (
                <Button variant={idle ? "primary" : "secondary"} onClick={() => offHire(h.id)}>
                  Off-hire
                </Button>
              )}
            </li>
          );
        })}
      </ul>
      {!only && (
        <p className="mt-2 text-xs text-muted">
          Idle is time since the last scan or site diary use. After {IDLE_THRESHOLD_DAYS} days the PM gets a Teams nudge to off-hire. The supplier&apos;s collection reference is recorded and the
          Xero bill is matched to the hire period.
        </p>
      )}
    </Card>
  );
}
