"use client";

import { useState } from "react";
import { Sparkles } from "lucide-react";
import { AiNote, Badge, Button, Card } from "@/components/ui";
import { cn } from "@/lib/cn";

interface Task {
  id: string;
  name: string;
  start: number;
  weeks: number;
  after: string[];
  note?: string;
}

// Scripted stand-in for the agent: a fixed base sequence for a heritage conversion,
// scaled to the requested duration and trimmed to what the brief mentions.
const base: (Task & { needs?: RegExp })[] = [
  { id: "t1", name: "Enabling works & site set-up", start: 0, weeks: 1, after: [] },
  { id: "t2", name: "Strip-out & structural repairs", start: 1, weeks: 2, after: ["t1"] },
  { id: "t3", name: "Groundworks, drainage & slab", start: 2, weeks: 3, after: ["t1"] },
  { id: "t4", name: "Stone & lime masonry", start: 3, weeks: 5, after: ["t2"], needs: /lime|stone|heritage/i, note: "Lime works avoid frost: weather window applied" },
  { id: "t5", name: "Green oak frame erection", start: 6, weeks: 3, after: ["t3", "t4"], needs: /oak/i, note: "Crane day, RAMS required" },
  { id: "t6", name: "Roofing & leadwork", start: 8, weeks: 3, after: ["t5"] },
  { id: "t7", name: "Air source heat pump & UFH first fix", start: 10, weeks: 2, after: ["t6"], needs: /ashp|heat pump/i },
  { id: "t8", name: "Electrical first & second fix", start: 10, weeks: 4, after: ["t6"] },
  { id: "t9", name: "Lime plaster & finishes", start: 12, weeks: 3, after: ["t7", "t8"], needs: /lime/i },
  { id: "t10", name: "Kitchen, bathrooms & joinery fit-out", start: 14, weeks: 2, after: ["t9"] },
  { id: "t11", name: "Snagging, commissioning & handover", start: 16, weeks: 2, after: ["t10"] },
];

function generate(brief: string): { tasks: Task[]; total: number } {
  const m = /(\d{1,2})\s*weeks?/i.exec(brief);
  const total = Math.min(52, Math.max(8, m ? Number(m[1]) : 18));
  const k = total / 18;
  const kept = base.filter((t) => !t.needs || t.needs.test(brief));
  const ids = new Set(kept.map((t) => t.id));
  const tasks = kept.map((t) => ({
    id: t.id,
    name: t.name,
    start: Math.round(t.start * k),
    weeks: Math.max(1, Math.round(t.weeks * k)),
    after: t.after.filter((a) => ids.has(a)),
    note: t.note,
  }));
  return { tasks, total };
}

export function ProgrammeAgent() {
  const [brief, setBrief] = useState("Barn conversion to holiday let, 18 weeks, lime works, oak frame, ASHP");
  const [result, setResult] = useState<{ tasks: Task[]; total: number } | null>(null);
  const [busy, setBusy] = useState(false);
  const [baselined, setBaselined] = useState(false);

  const run = () => {
    setBusy(true);
    setBaselined(false);
    setTimeout(() => {
      setResult(generate(brief));
      setBusy(false);
    }, 900);
  };

  const names = Object.fromEntries((result?.tasks ?? []).map((t, i) => [t.id, String(i + 1)]));

  return (
    <Card title="Programme agent">
      <label htmlFor="brief" className="mb-1 block text-xs font-semibold text-muted">
        Describe the job
      </label>
      <textarea
        id="brief"
        value={brief}
        onChange={(e) => setBrief(e.target.value)}
        rows={2}
        className="w-full rounded-lg border border-hair bg-surface-2 p-2.5 text-sm text-ink outline-none focus:border-lime"
      />
      <div className="mt-2 flex flex-wrap items-center gap-2">
        <Button onClick={run} disabled={busy || !brief.trim()}>
          <Sparkles size={14} /> {busy ? "Building programme…" : "Generate programme"}
        </Button>
        {result && (
          <Button variant={baselined ? "secondary" : "dark"} onClick={() => setBaselined(true)} disabled={baselined}>
            {baselined ? "Baseline locked ✓" : "Confirm as baseline"}
          </Button>
        )}
      </div>

      {result && (
        <div className="mt-4">
          <div className="mb-2 flex items-center justify-between text-xs text-muted">
            <span>{result.tasks.length} activities · {result.total} weeks</span>
            {baselined && <Badge tone="good">Baseline v1 · Gareth Thomas · 20 Oct</Badge>}
          </div>
          <div className="overflow-x-auto">
            <div className="min-w-[560px]">
              <div className="mb-1 grid grid-cols-[minmax(180px,1.2fr)_3fr] text-[10px] text-muted">
                <span />
                <div className="flex justify-between">
                  {Array.from({ length: Math.ceil(result.total / 2) + 1 }, (_, i) => (
                    <span key={i}>W{i * 2 + 1}</span>
                  ))}
                </div>
              </div>
              {result.tasks.map((t, i) => (
                <div key={t.id} className="grid grid-cols-[minmax(180px,1.2fr)_3fr] items-center border-t border-hair/70 py-1.5 text-xs">
                  <div className="pr-2">
                    <span className="mr-1 text-muted">{i + 1}.</span>
                    {t.name}
                    {t.after.length > 0 && <span className="ml-1 text-[10px] text-muted">after {t.after.map((a) => names[a]).join(", ")}</span>}
                    {t.note && <div className="text-[10px] text-accent-ink">{t.note}</div>}
                  </div>
                  <div className="relative h-4 rounded bg-surface-2">
                    <div
                      className={cn("absolute inset-y-0 rounded", baselined ? "bg-slate" : "bg-lime")}
                      style={{ left: `${(t.start / result.total) * 100}%`, width: `${(t.weeks / result.total) * 100}%` }}
                      title={`Week ${t.start + 1} for ${t.weeks} weeks`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <AiNote className="mt-3">
            Draft programme from the brief, BCJS&apos;s past jobs and trade sequences. The PM checks durations and links before it becomes the baseline; slippage is measured
            against the confirmed version only.
          </AiNote>
        </div>
      )}
    </Card>
  );
}
