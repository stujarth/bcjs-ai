"use client";

import { useState } from "react";
import { Badge, Card } from "@/components/ui";
import { cn } from "@/lib/cn";
import type { InspectionTemplate } from "@/lib/mock/data";

type Result = "pass" | "fail";

export function Inspections({ template, projectName }: { template: InspectionTemplate; projectName: string }) {
  const [results, setResults] = useState<Record<string, Result>>({});

  const set = (id: string, r: Result) => setResults((s) => ({ ...s, [id]: r }));
  const failed = template.items.filter((i) => results[i.id] === "fail");
  const done = Object.keys(results).length;

  return (
    <Card title={`Inspection · ${template.name}`}>
      <div className="mb-3 flex flex-wrap items-center gap-2 text-xs text-muted">
        <Badge>{template.standard}</Badge>
        <span>
          {projectName} · {template.location}
        </span>
        <span className="ml-auto">
          {done}/{template.items.length} checked
        </span>
      </div>
      <ul className="divide-y divide-hair">
        {template.items.map((i) => (
          <li key={i.id} className="flex flex-wrap items-center gap-2 py-2 text-sm">
            <div className="min-w-0 flex-1">
              {i.label}
              {i.guidance && <div className="text-[11px] text-muted">{i.guidance}</div>}
            </div>
            <div className="flex gap-1" role="group" aria-label={`Result for ${i.label}`}>
              {(["pass", "fail"] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => set(i.id, r)}
                  aria-pressed={results[i.id] === r}
                  className={cn(
                    "rounded-full px-3 py-1 text-xs font-semibold capitalize",
                    results[i.id] === r ? (r === "pass" ? "bg-good text-white" : "bg-bad text-white") : "border border-hair bg-surface-2 text-muted",
                  )}
                >
                  {r}
                </button>
              ))}
            </div>
          </li>
        ))}
      </ul>
      {failed.length > 0 && (
        <div className="mt-3 rounded-lg border border-bad/40 bg-bad-soft p-3">
          <div className="mb-1 text-xs font-bold uppercase tracking-wider text-bad">
            {failed.length} snag{failed.length > 1 ? "s" : ""} raised automatically
          </div>
          <ul className="space-y-1 text-sm">
            {failed.map((i, n) => (
              <li key={i.id}>
                <span className="font-semibold">SN-GG-{String(41 + n).padStart(3, "0")}</span> {i.label}: failed. Owner {template.owner} · {template.costCode} · scaffold
                tagged &quot;do not use&quot; until closed
              </li>
            ))}
          </ul>
        </div>
      )}
      {done === template.items.length && failed.length === 0 && (
        <div className="mt-3 rounded-lg border border-good/40 bg-good-soft p-3 text-sm">All items passed. Scafftag renewed for 7 days and filed to the register.</div>
      )}
    </Card>
  );
}
