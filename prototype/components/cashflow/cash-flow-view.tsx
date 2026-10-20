"use client";

import { useState, type ReactNode } from "react";
import { Card, Stat, Table, Td, Th } from "@/components/ui";
import type { CashWeek, Scenario } from "@/lib/mock/types";
import { formatMoney, formatMoneyShort } from "@/lib/money";
import { cn } from "@/lib/cn";

function balances(weeks: CashWeek[], opening: number) {
  let bal = opening;
  return weeks.map((w) => (bal += w.inPence - w.outPence));
}

export function CashFlowView({
  scenarios,
  opening,
  retentionHeld,
  overdueIn,
  overdueCount,
}: {
  scenarios: Scenario[];
  opening: number;
  retentionHeld: number;
  overdueIn: number;
  overdueCount: number;
}) {
  const [key, setKey] = useState(scenarios[0].key);
  const [compare, setCompare] = useState(true);
  const scenario = scenarios.find((s) => s.key === key)!;
  const base = scenarios[0];
  const showGhost = compare && key !== base.key;

  const bal = balances(scenario.weeks, opening);
  const baseBal = balances(base.weeks, opening);
  const net30 = scenario.weeks.slice(0, 4).reduce((a, w) => a + w.inPence - w.outPence, 0);
  const low = Math.min(...bal);
  const lowIdx = bal.indexOf(low);
  const baseLow = Math.min(...baseBal);

  return (
    <>
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <div role="radiogroup" aria-label="Scenario" className="flex flex-wrap gap-1.5">
          {scenarios.map((s) => (
            <button
              key={s.key}
              role="radio"
              aria-checked={s.key === key}
              onClick={() => setKey(s.key)}
              className={cn(
                "rounded-full px-3 py-1.5 text-xs font-semibold transition",
                s.key === key ? "bg-ink text-bg" : "border border-hair bg-surface-2 text-muted hover:text-ink",
              )}
            >
              {s.name}
            </button>
          ))}
        </div>
        <label className={cn("ml-auto inline-flex items-center gap-2 text-xs text-ink", key === base.key && "opacity-50")}>
          <input type="checkbox" checked={compare} onChange={(e) => setCompare(e.target.checked)} disabled={key === base.key} className="accent-[var(--lime)]" />
          Compare against base case
        </label>
      </div>

      <div className="mb-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat label="Net, next 30 days" value={formatMoneyShort(net30)} meta={scenario.name} tone={net30 >= 0 ? "good" : "bad"} />
        <Stat
          label="Lowest point"
          value={formatMoneyShort(low)}
          meta={showGhost ? `${scenario.weeks[lowIdx].label} · base ${formatMoneyShort(baseLow)}` : `week ${lowIdx + 1} (${scenario.weeks[lowIdx].label})`}
          tone={low < 0 ? "bad" : low < 5_000_000 ? "warn" : "good"}
        />
        <Stat label="Retention held" value={formatMoneyShort(retentionHeld)} meta="across 3 projects" />
        <Stat label="Overdue in" value={formatMoneyShort(overdueIn)} meta={`${overdueCount} invoices`} tone="warn" />
      </div>

      <Card title={`13-week rolling forecast · ${scenario.name}`} className="mb-5">
        <p className="mb-3 text-sm text-muted">{scenario.description}</p>
        <CashChart weeks={scenario.weeks} balances={bal} ghost={showGhost ? baseBal : undefined} lowIdx={lowIdx} />
      </Card>

      <Table className="mb-5">
        <thead>
          <tr>
            <Th>Week</Th>
            <Th right>Money in</Th>
            <Th right>Money out</Th>
            <Th right>Net</Th>
            <Th right>Closing balance</Th>
            {showGhost && <Th right>vs base</Th>}
          </tr>
        </thead>
        <tbody>
          {scenario.weeks.map((w, i) => {
            const net = w.inPence - w.outPence;
            const diff = bal[i] - baseBal[i];
            return (
              <tr key={w.week} className={cn(i === lowIdx && "bg-warn-soft")}>
                <Td className="font-semibold">
                  {w.label}
                  {i === lowIdx && <span className="ml-2 text-xs font-normal text-warn">lowest</span>}
                </Td>
                <Td right>{formatMoney(w.inPence)}</Td>
                <Td right>{formatMoney(w.outPence)}</Td>
                <Td right className={net < 0 ? "text-bad" : "text-good"}>
                  {net < 0 ? "−" : "+"}
                  {formatMoney(Math.abs(net))}
                </Td>
                <Td right className={cn("font-semibold", bal[i] < 0 && "text-bad")}>{formatMoney(bal[i])}</Td>
                {showGhost && (
                  <Td right className={diff < 0 ? "text-bad" : diff > 0 ? "text-good" : "text-muted"}>
                    {diff === 0 ? "–" : `${diff < 0 ? "−" : "+"}${formatMoneyShort(Math.abs(diff))}`}
                  </Td>
                )}
              </tr>
            );
          })}
        </tbody>
      </Table>
    </>
  );
}

function CashChart({ weeks, balances, ghost, lowIdx }: { weeks: CashWeek[]; balances: number[]; ghost?: number[]; lowIdx: number }) {
  const W = 760;
  const H = 300;
  const pad = { l: 52, r: 12, t: 12, b: 28 };
  const values = [0, ...weeks.map((w) => w.inPence), ...weeks.map((w) => -w.outPence), ...balances, ...(ghost ?? [])];
  const max = Math.max(...values);
  const min = Math.min(...values);
  const span = max - min || 1;
  const y = (v: number) => pad.t + ((max - v) / span) * (H - pad.t - pad.b);
  const slot = (W - pad.l - pad.r) / weeks.length;
  const cx = (i: number) => pad.l + slot * i + slot / 2;
  const barW = Math.min(18, slot * 0.32);
  const line = (pts: number[]) => pts.map((v, i) => `${i ? "L" : "M"}${cx(i).toFixed(1)},${y(v).toFixed(1)}`).join(" ");

  // ~5 gridlines on round £50k steps
  const step = 5_000_000;
  const ticks: number[] = [];
  for (let v = Math.ceil(min / step) * step; v <= max; v += step) ticks.push(v);

  return (
    <div>
      <div className="mb-2 flex flex-wrap gap-4 text-xs text-muted">
        <Legend swatch={<span className="h-2.5 w-2.5 rounded-sm" style={{ background: "var(--chart-in)" }} />}>Money in</Legend>
        <Legend swatch={<span className="h-2.5 w-2.5 rounded-sm" style={{ background: "var(--chart-out)" }} />}>Money out</Legend>
        <Legend swatch={<span className="h-0.5 w-4" style={{ background: "var(--chart-net)" }} />}>Closing balance</Legend>
        {ghost && <Legend swatch={<span className="h-0 w-4 border-t-2 border-dashed border-muted" />}>Base case balance</Legend>}
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-labelledby="cash-chart-title">
        <title id="cash-chart-title">Weekly money in and out with projected closing cash balance over 13 weeks</title>
        {ticks.map((t) => (
          <g key={t}>
            <line x1={pad.l} x2={W - pad.r} y1={y(t)} y2={y(t)} stroke="var(--hair)" strokeDasharray={t === 0 ? undefined : "2 4"} />
            <text x={pad.l - 6} y={y(t) + 3} textAnchor="end" fontSize={10} fill="var(--muted)">
              {formatMoneyShort(t)}
            </text>
          </g>
        ))}
        {weeks.map((w, i) => (
          <g key={w.week}>
            <rect x={cx(i) - barW - 1} y={y(w.inPence)} width={barW} height={Math.max(0, y(0) - y(w.inPence))} rx={2} fill="var(--chart-in)" opacity={0.85}>
              <title>{`${w.label} in ${formatMoney(w.inPence)}`}</title>
            </rect>
            <rect x={cx(i) + 1} y={y(0)} width={barW} height={Math.max(0, y(-w.outPence) - y(0))} rx={2} fill="var(--chart-out)" opacity={0.85}>
              <title>{`${w.label} out ${formatMoney(w.outPence)}`}</title>
            </rect>
            <text x={cx(i)} y={H - 8} textAnchor="middle" fontSize={10} fill="var(--muted)">
              {w.label}
            </text>
          </g>
        ))}
        {ghost && <path d={line(ghost)} fill="none" stroke="var(--muted)" strokeWidth={1.5} strokeDasharray="5 4" opacity={0.8} />}
        <path d={line(balances)} fill="none" stroke="var(--chart-net)" strokeWidth={2.25} strokeLinejoin="round" />
        {balances.map((v, i) => (
          <circle key={i} cx={cx(i)} cy={y(v)} r={i === lowIdx ? 5 : 2.5} fill={i === lowIdx ? "var(--amber)" : "var(--chart-net)"} stroke="var(--surface)" strokeWidth={1.5}>
            <title>{`${weeks[i].label} closing ${formatMoney(v)}`}</title>
          </circle>
        ))}
        <text x={cx(lowIdx)} y={y(balances[lowIdx]) + 18} textAnchor="middle" fontSize={10.5} fontWeight={700} fill="var(--amber)">
          Low {formatMoneyShort(balances[lowIdx])}
        </text>
      </svg>
    </div>
  );
}

function Legend({ swatch, children }: { swatch: ReactNode; children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      {swatch}
      {children}
    </span>
  );
}
