"use client";

import { useState } from "react";
import { Check, Lock, LockOpen, Plus } from "lucide-react";
import { cn } from "@/lib/cn";
import { ramsSignOn } from "@/lib/mock/data";

const PHOTO_LABELS = [
  "Trench open",
  "Bedding",
  "Pipe laid",
  "Falls checked",
  "Joints",
  "Inspection chamber",
  "Backfill & compaction",
  "Reinstatement",
];
const MISSING = 6; // "Backfill & compaction" is outstanding

export function CaptureTab({ submit }: { submit: (label: string) => boolean }) {
  const [photos, setPhotos] = useState<boolean[]>(PHOTO_LABELS.map((_, i) => i !== MISSING));
  const [signed, setSigned] = useState<boolean[]>(ramsSignOn.map((r) => r.signed));
  const [state, setState] = useState<"open" | "sent" | "queued">("open");

  const missing = photos.filter((p) => !p).length;
  const unsigned = signed.filter((s) => !s).length;
  const complete = missing === 0 && unsigned === 0;

  return (
    <div className="space-y-3">
      <div className="px-1">
        <h2 className="text-sm font-semibold">Plot 4 to 7 · VO-108</h2>
        <p className="text-[11px] text-[#828b88]">Additional drainage run · evidence gate</p>
      </div>

      <div className="rounded-xl bg-gradient-to-r from-[#252D2F] to-[#1F2628] p-3">
        <div className="mb-2 flex items-center text-[11px] text-[#a6afab]">
          Required photo set
          <span className={cn("ml-auto font-semibold", missing ? "text-bad" : "text-[#a8ce7e]")}>{missing ? `${missing} missing` : "Complete"}</span>
        </div>
        <div className="grid grid-cols-4 gap-1.5">
          {photos.map((have, i) => (
            <button
              key={i}
              onClick={() => !have && setPhotos((p) => p.map((x, j) => (j === i ? true : x)))}
              aria-label={have ? `${PHOTO_LABELS[i]} captured` : `Capture ${PHOTO_LABELS[i]}`}
              title={PHOTO_LABELS[i]}
              className={cn(
                "flex aspect-square flex-col items-center justify-center rounded-lg text-[9px]",
                have ? "bg-[#2E393B] text-[#a8ce7e]" : "border-[1.5px] border-dashed border-[#8E5250] bg-bad/15 text-[#d08a87]",
              )}
            >
              {have ? <Check size={16} /> : <Plus size={16} />}
              {!have && <span className="mt-0.5 px-0.5 text-center leading-tight">Tap to capture</span>}
            </button>
          ))}
        </div>
        {missing > 0 && <p className="mt-2 text-[11px] text-[#d08a87]">Backfill and compaction photo outstanding. Needed before the works can be signed off.</p>}
      </div>

      <div className="rounded-xl bg-gradient-to-r from-[#252D2F] to-[#1F2628] p-3">
        <div className="mb-1 text-[11px] text-[#a6afab]">RAMS and sign-on</div>
        {ramsSignOn.map((r, i) => (
          <div key={r.name} className="flex items-center gap-2 border-t border-[#2e3639] py-2 text-xs first:border-t-0">
            <span className="font-semibold text-white">{r.name}</span>
            {r.note && <span className="text-[10px] text-[#e9c27a]">{r.note}</span>}
            {signed[i] ? (
              <span className="ml-auto text-[#a8ce7e]">✓ Signed</span>
            ) : (
              <button
                onClick={() => setSigned((s) => s.map((x, j) => (j === i ? true : x)))}
                className="ml-auto rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-semibold text-white"
              >
                Sign on now
              </button>
            )}
          </div>
        ))}
      </div>

      <div
        className={cn(
          "flex items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-xs",
          complete ? "bg-good/20 text-[#a8ce7e]" : "bg-[#2E393B] text-[#909996]",
        )}
      >
        {complete ? <LockOpen size={14} /> : <Lock size={14} />}
        {complete ? "Evidence complete – ready to submit" : "Sign-off locked until evidence complete"}
      </div>

      <button
        disabled={!complete || state !== "open"}
        onClick={() => setState(submit("VO-108 sign-off") ? "sent" : "queued")}
        className="w-full rounded-full bg-lime py-3 text-xs font-bold uppercase tracking-wider text-night disabled:opacity-40"
      >
        {state === "open" ? "Submit works" : state === "sent" ? "Submitted ✓" : "Saved on phone – will send"}
      </button>
    </div>
  );
}
