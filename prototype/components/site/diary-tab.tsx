"use client";

import { useEffect, useRef, useState } from "react";
import { Mic, Square } from "lucide-react";
import { cn } from "@/lib/cn";
import { diary } from "@/lib/mock/data";

const SCRIPT =
  "Overcast, bit of rain this afternoon, about eleven degrees. Three from Llanover Joinery, two Gwent Groundworks and Mike on the pointing. First floor joists in block A about eighty percent. Backfill on plots four to seven done. Abergavenny Timber dropped about sixty percent of the oak boards. Rain stopped the lime pointing at two o'clock. Client says go ahead with the kitchen finish change, I've asked for it in writing. Building control passed the drainage.";

type Phase = "idle" | "listening" | "structuring" | "review" | "saved";

export function DiaryTab({ submit }: { submit: (label: string) => boolean }) {
  const entry = diary[0];
  const [phase, setPhase] = useState<Phase>("idle");
  const [transcript, setTranscript] = useState("");
  const [queued, setQueued] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => () => {
    if (timer.current) clearInterval(timer.current);
  }, []);

  // Prototype: plays back a scripted transcript. Production uses on-device speech capture.
  const start = () => {
    setPhase("listening");
    setTranscript("");
    const words = SCRIPT.split(" ");
    let i = 0;
    timer.current = setInterval(() => {
      i++;
      setTranscript(words.slice(0, i).join(" "));
      if (i >= words.length) stop();
    }, 70);
  };

  const stop = () => {
    if (timer.current) clearInterval(timer.current);
    timer.current = null;
    setPhase("structuring");
    setTimeout(() => setPhase("review"), 1100);
  };

  const fields: [string, string][] = [
    ["Weather", entry.weather],
    ["Labour", entry.labour],
    ["Progress", entry.progress],
    ["Deliveries", entry.deliveries],
    ["Delays", entry.delays],
    ["Instructions", entry.instructions],
    ["Visitors", entry.visitors],
  ];

  return (
    <div className="space-y-3">
      <div className="px-1">
        <h2 className="text-sm font-semibold">Site diary</h2>
        <p className="text-[11px] text-[#828b88]">Goytre Grange · {entry.date}</p>
      </div>

      <div className="flex flex-col items-center gap-2 rounded-xl bg-gradient-to-r from-[#252D2F] to-[#1F2628] p-4">
        <button
          onClick={phase === "listening" ? stop : start}
          disabled={phase === "structuring"}
          aria-label={phase === "listening" ? "Stop dictation" : "Start dictation"}
          className={cn(
            "flex h-16 w-16 items-center justify-center rounded-full text-night shadow-[0_3px_10px_rgba(155,186,60,0.3)]",
            phase === "listening" ? "animate-pulse bg-bad text-white" : "bg-lime",
          )}
        >
          {phase === "listening" ? <Square size={22} /> : <Mic size={26} />}
        </button>
        <div className="text-xs text-[#a6afab]">
          {phase === "idle" && "Tap and talk through your day"}
          {phase === "listening" && "Listening… tap to stop"}
          {phase === "structuring" && "Sorting it into the diary…"}
          {(phase === "review" || phase === "saved") && "Check it, then confirm"}
        </div>
        {transcript && <p className="w-full rounded-lg bg-[#2E393B] p-2.5 text-xs italic leading-relaxed text-[#cbd1c9]">“{transcript}”</p>}
      </div>

      {(phase === "review" || phase === "saved") && (
        <>
          <div className="flex items-start gap-2 rounded-lg border border-lime/40 bg-lime/10 px-3 py-2 text-[11px] text-[#c4dc7a]">
            <span className="mt-px shrink-0 rounded bg-lime px-1 text-[9px] font-bold uppercase text-night">AI</span>
            Sorted into 7 diary fields. Spotted a verbal client instruction (VO-118), so a written-instruction request has been drafted for the PM.
          </div>
          <dl className="divide-y divide-[#2e3639] rounded-xl bg-gradient-to-r from-[#252D2F] to-[#1F2628] px-3">
            {fields.map(([k, v]) => (
              <div key={k} className="py-2">
                <dt className="text-[10px] uppercase tracking-wider text-[#828b88]">{k}</dt>
                <dd className="text-xs text-white">{v}</dd>
              </div>
            ))}
          </dl>
          <button
            disabled={phase === "saved"}
            onClick={() => {
              setQueued(!submit("Diary entry 19 Oct"));
              setPhase("saved");
            }}
            className="w-full rounded-full bg-lime py-3 text-xs font-bold uppercase tracking-wider text-night disabled:opacity-60"
          >
            {phase === "saved" ? (queued ? "Saved on phone – will send" : "Diary entry confirmed ✓") : "Confirm entry"}
          </button>
        </>
      )}
    </div>
  );
}
