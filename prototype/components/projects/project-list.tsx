"use client";

import Link from "next/link";
import { useState } from "react";
import { Badge, Progress, RagDot, Tabs, ragTone } from "@/components/ui";
import { personById, projects } from "@/lib/mock/data";
import type { ProjectStage } from "@/lib/mock/types";
import { formatMoney, pct } from "@/lib/money";

type Filter = "all" | ProjectStage;

const filters: Filter[] = ["all", "pre-start", "on-site", "snagging", "handover", "closed"];

export function ProjectList() {
  const [filter, setFilter] = useState<Filter>("all");
  const shown = projects.filter((p) => filter === "all" || p.stage === filter);

  return (
    <>
      <Tabs
        tabs={filters.map((f) => ({ key: f, label: f === "all" ? "All" : f, count: f === "all" ? projects.length : projects.filter((p) => p.stage === f).length }))}
        value={filter}
        onChange={setFilter}
      />
      {shown.length === 0 && <p className="text-sm text-muted">No projects at this stage.</p>}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {shown.map((p) => (
          <Link
            key={p.id}
            href={`/projects/${p.id}`}
            className="group relative flex flex-col overflow-hidden rounded-xl border border-hair bg-surface p-4 transition hover:border-lime"
          >
            <span className="absolute inset-x-0 top-0 h-1 bg-lime" />
            <div className="mb-2 flex items-start justify-between gap-2">
              <div className="min-w-0">
                <div className="font-mono text-[11px] text-muted">{p.ref}</div>
                <div className="heading text-base text-ink group-hover:text-accent-ink">{p.name}</div>
                <div className="text-xs text-muted">
                  {p.type} · {p.location}
                </div>
              </div>
              <Badge tone={p.stage === "on-site" ? "accent" : "neutral"}>{p.stage}</Badge>
            </div>
            <div className="mb-3 flex flex-wrap gap-1.5">
              {p.heritage && <Badge tone="warn">Heritage</Badge>}
              <Badge tone={ragTone(p.cashRag)}>
                <RagDot rag={p.cashRag} /> Cash {p.cashRag}
              </Badge>
            </div>
            <dl className="mb-3 grid grid-cols-2 gap-x-3 gap-y-1.5 text-xs">
              <dt className="text-muted">Contract</dt>
              <dd className="tabular text-right font-semibold">{formatMoney(p.contractValuePence)}</dd>
              <dt className="text-muted">Forecast margin</dt>
              <dd className={`tabular text-right font-semibold ${p.forecastMarginPct < 10 ? "text-bad" : ""}`}>{pct(p.forecastMarginPct)}</dd>
              <dt className="text-muted">Completion</dt>
              <dd className="text-right">{p.endDate}</dd>
            </dl>
            <div className="mb-1 flex justify-between text-xs text-muted">
              <span>Progress</span>
              <span className="tabular">{p.progressPct}%</span>
            </div>
            <Progress value={p.progressPct} />
            <div className="mt-3 border-t border-hair pt-2 text-[11px] text-muted">
              PM {personById(p.pmId)?.name} · QS {personById(p.qsId)?.name} · Site {personById(p.siteManagerId)?.name}
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
