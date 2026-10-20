import { cn } from "@/lib/cn";
import type { ProgrammeTask } from "@/lib/mock/types";

/** Planned bars over ghosted baseline bars, so slippage reads at a glance (Sean §9f). */
export function ProgrammeGantt({ tasks, currentWeek }: { tasks: ProgrammeTask[]; currentWeek: number }) {
  const total = Math.max(...tasks.map((t) => Math.max(t.startWeek + t.weeks, t.baselineStartWeek + t.baselineWeeks))) - 1;
  const left = (w: number) => `${((w - 1) / total) * 100}%`;
  const width = (n: number) => `${(n / total) * 100}%`;

  return (
    <div className="overflow-x-auto rounded-xl border border-hair bg-surface p-4">
      <div className="min-w-[640px]">
        <div className="mb-2 grid grid-cols-[180px_1fr] items-end gap-3">
          <div className="text-[10.5px] font-bold uppercase tracking-[0.08em] text-muted">Task</div>
          <div className="relative h-4 text-[10px] text-muted">
            {Array.from({ length: total }, (_, i) => i + 1)
              .filter((w) => w === 1 || w % 2 === 1)
              .map((w) => (
                <span key={w} className="absolute -translate-x-1/2" style={{ left: left(w + 0.5) }}>
                  W{w}
                </span>
              ))}
          </div>
        </div>
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-[192px] right-0">
            <div className="absolute inset-y-0 w-px bg-lime-dk" style={{ left: left(currentWeek) }}>
              <span className="absolute -top-1 left-1 whitespace-nowrap rounded bg-lime px-1 text-[9px] font-bold text-night">Today</span>
            </div>
          </div>
          {tasks.map((t) => (
            <div key={t.id} className="grid grid-cols-[180px_1fr] items-center gap-3 border-t border-hair/60 py-1.5">
              <div className="truncate text-sm">
                {t.critical && <span className="mr-1 text-bad" title="Critical path">●</span>}
                {t.name}
              </div>
              <div className="relative h-6">
                <div
                  className="absolute top-3.5 h-2 rounded-sm border border-dashed border-muted/60"
                  style={{ left: left(t.baselineStartWeek), width: width(t.baselineWeeks) }}
                  title={`Baseline: W${t.baselineStartWeek}, ${t.baselineWeeks} wks`}
                />
                <div
                  className={cn("absolute top-0.5 h-3.5 overflow-hidden rounded-sm", t.critical ? "bg-bad/25 ring-1 ring-bad/60" : "bg-slate/25 ring-1 ring-slate/50")}
                  style={{ left: left(t.startWeek), width: width(t.weeks) }}
                  title={`Planned: W${t.startWeek}, ${t.weeks} wks · ${t.progressPct}% complete`}
                >
                  <div className={cn("h-full", t.critical ? "bg-bad/70" : "bg-slate/70")} style={{ width: `${t.progressPct}%` }} />
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-3 flex flex-wrap gap-4 text-[11px] text-muted">
          <span>
            <span className="mr-1 inline-block h-2.5 w-4 rounded-sm bg-bad/60 align-middle" /> Critical path
          </span>
          <span>
            <span className="mr-1 inline-block h-2.5 w-4 rounded-sm bg-slate/60 align-middle" /> Planned (fill = progress)
          </span>
          <span>
            <span className="mr-1 inline-block h-2 w-4 rounded-sm border border-dashed border-muted align-middle" /> Baseline (frozen at start)
          </span>
        </div>
      </div>
    </div>
  );
}
