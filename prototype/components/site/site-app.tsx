"use client";

import { useEffect, useState } from "react";
import { Camera, CalendarDays, Clock, Mic, WifiOff, Wifi, RefreshCw, Wrench } from "lucide-react";
import { cn } from "@/lib/cn";
import { useRole } from "@/components/role-context";
import { TODAY } from "@/lib/mock/data";
import { useConnectivity } from "./use-connectivity";
import { TodayTab } from "./today-tab";
import { TimeTab } from "./time-tab";
import { DiaryTab } from "./diary-tab";
import { CaptureTab } from "./capture-tab";
import { KitTab } from "./kit-tab";

export type SiteTab = "today" | "time" | "diary" | "capture" | "kit";

const allTabs: { key: SiteTab; label: string; icon: typeof Clock }[] = [
  { key: "today", label: "Today", icon: CalendarDays },
  { key: "time", label: "Time", icon: Clock },
  { key: "diary", label: "Diary", icon: Mic },
  { key: "capture", label: "Capture", icon: Camera },
  { key: "kit", label: "Kit", icon: Wrench },
];

export function SiteApp() {
  const { role } = useRole();
  const isSub = role === "subcontractor";
  const tabs = isSub ? allTabs.filter((t) => t.key === "today" || t.key === "time" || t.key === "kit") : allTabs;
  const [tab, setTab] = useState<SiteTab>("today");
  const conn = useConnectivity();

  useEffect(() => {
    if (!tabs.some((t) => t.key === tab)) setTab("today");
  }, [tabs, tab]);

  useEffect(() => {
    if (process.env.NODE_ENV !== "production" || !("serviceWorker" in navigator)) return;
    navigator.serviceWorker.register("/sw.js").catch(() => {
      /* offline shell is a progressive enhancement */
    });
  }, []);

  return (
    <div className="flex min-h-[640px] flex-col bg-[#14191A] text-white">
      {/* Top bar */}
      <div className="flex items-center gap-2 px-4 pb-2 pt-3">
        <span className="h-5 w-5 rounded-md bg-gradient-to-br from-lime to-lime-dk" />
        <span className="text-sm font-bold uppercase tracking-wider">Site</span>
        <span
          className={cn(
            "ml-auto inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold",
            conn.online ? "bg-good/25 text-[#a8ce7e]" : "bg-warn/25 text-[#e9c27a]",
          )}
          role="status"
        >
          {conn.online ? <Wifi size={12} /> : <WifiOff size={12} />}
          {conn.online ? "Online" : "Offline"}
        </span>
      </div>
      <div className="flex items-center gap-2 px-4 pb-3 text-[11px] text-[#828b88]">
        <span className="truncate">
          {TODAY} · {isSub ? "Llanover Joinery Co" : "Dave R."} · Goytre Grange
        </span>
        {(conn.queue.length > 0 || conn.syncing) && (
          <span className="ml-auto inline-flex shrink-0 items-center gap-1 rounded-full bg-white/10 px-2 py-0.5 font-semibold text-white">
            <RefreshCw size={11} className={cn(conn.syncing && "animate-spin")} />
            {conn.syncing ? "Syncing…" : `${conn.queue.length} waiting to sync`}
          </span>
        )}
      </div>

      <label className="mx-4 mb-3 flex cursor-pointer items-center justify-between rounded-lg bg-white/5 px-3 py-2 text-xs text-[#a6afab]">
        Simulate no signal
        <input
          type="checkbox"
          checked={conn.simulateOffline}
          onChange={(e) => conn.setSimulateOffline(e.target.checked)}
          className="h-4 w-4 accent-[var(--lime)]"
        />
      </label>
      {conn.lastSynced && conn.queue.length === 0 && !conn.syncing && (
        <div className="mx-4 mb-2 text-[11px] text-[#a8ce7e]">✓ {conn.lastSynced}</div>
      )}

      <div className="flex-1 overflow-y-auto px-3 pb-4">
        {tab === "today" && <TodayTab subcontractor={isSub} onOpen={setTab} />}
        {tab === "time" && <TimeTab submit={conn.submit} online={conn.online} />}
        {tab === "diary" && <DiaryTab submit={conn.submit} />}
        {tab === "capture" && <CaptureTab submit={conn.submit} />}
        {tab === "kit" && <KitTab submit={conn.submit} holder={isSub ? "Llanover Joinery Co" : "Dave Rowntree"} />}
      </div>

      {/* Bottom tab bar */}
      <nav className="sticky bottom-0 flex border-t border-[#2e3639] bg-[#14191A]" aria-label="Site app">
        {tabs.map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              aria-current={tab === t.key ? "page" : undefined}
              className={cn("flex flex-1 flex-col items-center gap-0.5 py-2.5 text-[11px]", tab === t.key ? "text-lime" : "text-[#767f7c]")}
            >
              <Icon size={18} />
              {t.label}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
