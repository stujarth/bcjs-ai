"use client";

import { useState } from "react";
import { formatMoney } from "@/lib/money";
import { timesheets } from "@/lib/mock/data";

const days = ["Mon", "Tue", "Wed", "Thu", "Fri"];
const RATE_PENCE = 3_400; // £34.00/h agreed subcontract rate

export function TimeTab({ submit, online }: { submit: (label: string) => boolean; online: boolean }) {
  const seed = timesheets.find((t) => t.party === "Llanover Joinery Co");
  const [ops, setOps] = useState<number[]>(seed?.operatives ?? [0, 0, 0, 0, 0]);
  const [hours, setHours] = useState<number[]>(seed?.hours ?? [0, 0, 0, 0, 0]);
  const [state, setState] = useState<"draft" | "sent" | "queued">("draft");

  const total = hours.reduce((a, b) => a + b, 0);
  // Whole pence: hours may be half-hours, so round once at the end.
  const costPence = Math.round(total * RATE_PENCE);

  const update = (setter: typeof setHours, i: number, v: string) => {
    const n = Math.max(0, Number(v) || 0);
    setter((arr) => arr.map((x, j) => (j === i ? n : x)));
    setState("draft");
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 px-1">
        <h2 className="text-sm font-semibold">Log time</h2>
        <span className="ml-auto text-[11px] text-[#828b88]">Week 43</span>
      </div>
      {[
        ["Subcontractor", "Llanover Joinery Co"],
        ["Project and phase", "Goytre Grange · Joinery"],
        ["Cost code", "JOI-04 First floor joinery"],
      ].map(([l, v]) => (
        <div key={l} className="rounded-lg bg-[#2E393B] px-3 py-2">
          <div className="text-[10px] uppercase tracking-wider text-[#828b88]">{l}</div>
          <div className="text-sm font-semibold">{v}</div>
        </div>
      ))}

      <div className="rounded-xl bg-gradient-to-r from-[#252D2F] to-[#1F2628] p-3">
        <div className="mb-1 grid grid-cols-[2.5rem_1fr_1fr] gap-2 text-[10px] uppercase tracking-wider text-[#828b88]">
          <span />
          <span>Operatives</span>
          <span>Hours</span>
        </div>
        {days.map((d, i) => (
          <div key={d} className="grid grid-cols-[2.5rem_1fr_1fr] items-center gap-2 border-t border-[#2e3639] py-1.5">
            <span className="text-xs text-[#a6afab]">{d}</span>
            <input
              aria-label={`${d} operatives`}
              type="number"
              inputMode="numeric"
              min={0}
              value={ops[i]}
              onChange={(e) => update(setOps, i, e.target.value)}
              className="w-full rounded-md bg-[#2E393B] px-2 py-1 text-sm text-white outline-none focus:ring-1 focus:ring-lime"
            />
            <input
              aria-label={`${d} hours`}
              type="number"
              inputMode="decimal"
              step={0.5}
              min={0}
              value={hours[i]}
              onChange={(e) => update(setHours, i, e.target.value)}
              className="w-full rounded-md bg-[#2E393B] px-2 py-1 text-sm text-white outline-none focus:ring-1 focus:ring-lime"
            />
          </div>
        ))}
        <div className="flex items-center border-t border-[#2e3639] pt-2 text-sm">
          <span className="text-[#a6afab]">Total</span>
          <span className="tabular ml-auto font-bold">{total.toFixed(1)} h</span>
        </div>
      </div>

      <div className="rounded-lg bg-[#2E393B] px-3 py-2">
        <div className="text-[10px] uppercase tracking-wider text-[#828b88]">Allocated to cost</div>
        <div className="flex items-baseline">
          <span className="text-xs text-[#a6afab]">Feeds the cost report on approval</span>
          <span className="tabular ml-auto text-base font-bold">{formatMoney(costPence)}</span>
        </div>
      </div>

      <button
        onClick={() => setState(submit("Timesheet wk 43") ? "sent" : "queued")}
        disabled={state !== "draft" || total === 0}
        className="w-full rounded-full bg-lime py-3 text-xs font-bold uppercase tracking-wider text-night disabled:opacity-60"
      >
        {state === "draft" ? "Submit for approval" : state === "sent" ? "Submitted ✓ awaiting approval" : "Saved on phone – will send"}
      </button>
      {!online && state === "draft" && <p className="px-1 text-[11px] text-[#e9c27a]">No signal: this will be saved on the phone and sent automatically.</p>}
      <p className="px-1 text-[11px] text-[#767f7c]">The person who approves this timesheet must be different from the person who submits it.</p>
    </div>
  );
}
