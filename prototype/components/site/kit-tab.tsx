"use client";

import { useState } from "react";
import { Lock, QrCode, ScanLine } from "lucide-react";
import { cn } from "@/lib/cn";
import { assetBlocked, assets, liveProjects, type Asset } from "@/lib/mock/data";

const scannable = assets.filter((a) => a.kind === "serialised" && a.ownership === "owned" && a.status !== "lost");

export function KitTab({ submit, holder }: { submit: (label: string) => boolean; holder: string }) {
  const [scanning, setScanning] = useState(false);
  const [picked, setPicked] = useState<Asset | null>(null);
  const [job, setJob] = useState(liveProjects[0].id);
  const [condition, setCondition] = useState<"good" | "fair" | "poor">("good");
  const [mine, setMine] = useState<Asset[]>(() => assets.filter((a) => a.holder === holder));
  const [result, setResult] = useState<string | null>(null);

  const holding = picked ? mine.some((m) => m.id === picked.id) : false;
  const blocked = picked ? assetBlocked(picked.id) : false;

  const confirm = () => {
    if (!picked) return;
    const action = holding ? "Checked in" : "Checked out";
    const sent = submit(`${action}: ${picked.name}`);
    setMine((m) => (holding ? m.filter((x) => x.id !== picked.id) : [...m, picked]));
    setResult(`${action} ${picked.tag}${sent ? "" : " · queued, syncs when signal returns"}`);
    setPicked(null);
  };

  return (
    <div className="space-y-3">
      <div className="px-1">
        <h2 className="text-sm font-semibold">Kit</h2>
        <p className="text-[11px] text-[#828b88]">Scan a QR tag to check tools out or back in</p>
      </div>

      {!picked && (
        <button
          onClick={() => {
            setScanning(true);
            setResult(null);
          }}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-lime py-3 text-sm font-bold uppercase tracking-wider text-night"
        >
          <ScanLine size={18} /> Scan QR
        </button>
      )}

      {scanning && !picked && (
        <div className="rounded-xl bg-black p-3">
          <div className="relative mx-auto mb-3 aspect-square w-40 rounded-lg border-2 border-dashed border-lime/70">
            <QrCode size={64} className="absolute inset-0 m-auto text-white/20" />
            <span className="absolute inset-x-2 top-1/2 h-0.5 animate-pulse bg-lime" />
          </div>
          <p className="mb-2 text-center text-[11px] text-[#a6afab]">Demo: tap a tag to simulate a scan</p>
          <div className="max-h-44 space-y-1 overflow-y-auto">
            {scannable.map((a) => (
              <button
                key={a.id}
                onClick={() => {
                  setPicked(a);
                  setScanning(false);
                }}
                className="flex w-full items-center justify-between rounded-lg bg-white/5 px-2.5 py-1.5 text-left text-xs"
              >
                <span className="truncate">{a.name}</span>
                <span className="ml-2 shrink-0 font-mono text-[10px] text-[#828b88]">{a.tag}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {picked && (
        <div className="rounded-xl bg-gradient-to-r from-[#252D2F] to-[#1F2628] p-3 text-sm">
          <div className="font-semibold">{picked.name}</div>
          <div className="mb-2 font-mono text-[11px] text-[#828b88]">
            {picked.tag} · now at {picked.location}
            {picked.holder ? ` · ${picked.holder}` : ""}
          </div>
          {blocked ? (
            <div className="flex items-start gap-2 rounded-lg bg-bad/20 p-2.5 text-xs text-[#f0b3b0]">
              <Lock size={14} className="mt-0.5 shrink-0" />
              Inspection overdue. This item can&apos;t be checked out until it has been tested. Return it to the yard.
            </div>
          ) : (
            <>
              {!holding && (
                <label className="mb-2 block text-[11px] text-[#a6afab]">
                  Job
                  <select value={job} onChange={(e) => setJob(e.target.value)} className="mt-1 w-full rounded-lg bg-[#2E393B] px-2 py-1.5 text-sm text-white">
                    {liveProjects.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </label>
              )}
              <div className="mb-3 text-[11px] text-[#a6afab]">
                Condition
                <div className="mt-1 flex gap-1.5">
                  {(["good", "fair", "poor"] as const).map((c) => (
                    <button key={c} onClick={() => setCondition(c)} className={cn("flex-1 rounded-lg py-1.5 text-xs font-semibold", condition === c ? "bg-white text-night" : "bg-white/10")}>
                      {c}
                    </button>
                  ))}
                </div>
              </div>
              <button onClick={confirm} className="w-full rounded-full bg-lime py-2.5 text-xs font-bold uppercase tracking-wider text-night">
                {holding ? "Check in" : `Check out to ${holder}`}
              </button>
            </>
          )}
          <button onClick={() => setPicked(null)} className="mt-2 w-full text-center text-[11px] text-[#828b88]">
            Cancel
          </button>
        </div>
      )}

      {result && <div className="rounded-lg bg-good/20 px-3 py-2 text-xs text-[#a8ce7e]">✓ {result}</div>}

      <div className="rounded-xl bg-gradient-to-r from-[#252D2F] to-[#1F2628] p-3">
        <div className="mb-1.5 text-[11px] text-[#a6afab]">My kit · {holder}</div>
        {mine.length ? (
          <ul className="space-y-1 text-xs">
            {mine.map((a) => (
              <li key={a.id} className="flex items-center justify-between border-t border-[#2E3639] pt-1 first:border-0 first:pt-0">
                <span className="truncate">{a.name}</span>
                <span className="ml-2 shrink-0 font-mono text-[10px] text-[#828b88]">{a.tag}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-xs text-[#828b88]">Nothing signed out to you.</p>
        )}
      </div>
    </div>
  );
}
