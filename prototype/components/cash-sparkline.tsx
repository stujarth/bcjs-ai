import type { CashWeek } from "@/lib/mock/types";
import { formatMoneyShort } from "@/lib/money";

/** Closing-balance line for a 13-week forecast, with the low point marked. */
export function CashSparkline({ weeks, opening }: { weeks: CashWeek[]; opening: number }) {
  let bal = opening;
  const points = weeks.map((w) => (bal += w.inPence - w.outPence));
  const min = Math.min(0, ...points);
  const max = Math.max(...points);
  const W = 320;
  const H = 96;
  const x = (i: number) => (i / (points.length - 1)) * (W - 8) + 4;
  const y = (v: number) => H - 8 - ((v - min) / (max - min || 1)) * (H - 16);
  const lowIdx = points.indexOf(Math.min(...points));
  const d = points.map((v, i) => `${i ? "L" : "M"}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(" ");

  return (
    <div>
      <svg viewBox={`0 0 ${W} ${H}`} className="h-24 w-full" role="img" aria-label="Projected closing cash balance by week">
        {min < 0 && <line x1={0} x2={W} y1={y(0)} y2={y(0)} stroke="var(--hair)" strokeDasharray="3 3" />}
        <path d={`${d} L${x(points.length - 1)},${H} L${x(0)},${H} Z`} fill="var(--lime)" opacity={0.12} />
        <path d={d} fill="none" stroke="var(--lime-dk)" strokeWidth={2} strokeLinejoin="round" />
        <circle cx={x(lowIdx)} cy={y(points[lowIdx])} r={4} fill="var(--amber)" stroke="var(--surface)" strokeWidth={1.5} />
      </svg>
      <div className="mt-2 flex justify-between text-xs text-muted">
        <span>
          Lowest <span className="tabular font-semibold text-ink">{formatMoneyShort(points[lowIdx])}</span> in {weeks[lowIdx].label}
        </span>
        <span>
          Week 13 <span className="tabular font-semibold text-ink">{formatMoneyShort(points.at(-1)!)}</span>
        </span>
      </div>
    </div>
  );
}
