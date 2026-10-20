"use client";

import { cn } from "@/lib/cn";
import { siteAreas } from "@/lib/mock/data";
import type { SiteTab } from "./site-app";

const border = { lime: "border-l-lime", green: "border-l-good", slate: "border-l-slate" } as const;
const statusText = { lime: "text-lime", green: "text-[#a8ce7e]", slate: "text-[#a6afab]" } as const;

export function TodayTab({ subcontractor, onOpen }: { subcontractor: boolean; onOpen: (t: SiteTab) => void }) {
  // A subcontractor only sees the areas they work in.
  const areas = subcontractor ? siteAreas.filter((a) => a.id === "blockA") : siteAreas;
  return (
    <div>
      <h2 className="mb-2 px-1 text-xs font-semibold uppercase tracking-[0.14em] text-[#828b88]">Today&apos;s work</h2>
      <ul className="space-y-2">
        {areas.map((a) => (
          <li key={a.id}>
            <button
              onClick={() => onOpen(a.id === "plot47" || a.id === "externals" ? "capture" : subcontractor ? "time" : "diary")}
              className={cn(
                "w-full rounded-xl border-l-[3px] bg-gradient-to-r from-[#252D2F] to-[#1F2628] px-3.5 py-3 text-left shadow-[0_2px_6px_rgba(0,0,0,0.22)]",
                border[a.tone],
              )}
            >
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold">{a.title}</span>
                <span className={cn("ml-auto text-[11px] font-semibold", statusText[a.tone])}>{a.status}</span>
              </div>
              <div className="text-xs text-[#a6afab]">{a.subtitle}</div>
              <div className="mt-0.5 text-[11px] text-[#828b88]">{a.detail}</div>
            </button>
          </li>
        ))}
      </ul>
      <p className="mt-4 px-1 text-[11px] leading-relaxed text-[#767f7c]">
        Colour shows what is outstanding. Anything entered with no signal is kept on the phone and sent as soon as signal returns.
      </p>
    </div>
  );
}
