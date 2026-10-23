import type { Tone } from "@/components/ui";
import type { AssetStatus, HireRecord } from "@/lib/mock/data";

export const statusTone: Record<AssetStatus, Tone> = {
  available: "good",
  "in use": "accent",
  "on hire": "warn",
  service: "neutral",
  lost: "bad",
  damaged: "bad",
};

/** Hire cost to date in whole pence: daily rate is weekly ÷ 7, rounded once. */
export const hireCostToDate = (h: HireRecord) => Math.round((h.ratePerWeekPence * h.daysOnHire) / 7);

/** Idle hire is flagged after 5 days without use. */
export const IDLE_THRESHOLD_DAYS = 5;
