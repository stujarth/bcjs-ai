// Estimate calculation engine: every total in one place, integer pence, rounded once (Sean §5b).
import type { Estimate, EstimateLine, LineKind } from "@/lib/mock/types";

export const lineTotal = (l: EstimateLine) => l.qty * l.ratePence;
export const isOverride = (l: EstimateLine) => l.ratePence !== l.cardRatePence;

export interface EstimateTotals {
  directPence: number;
  byKind: Record<LineKind, number>;
  overheadPence: number;
  marginPence: number;
  sellPence: number;
  packageDirect: { code: string; name: string; directPence: number }[];
  /** Sell price per package for the customer quote; sums exactly to sellPence. */
  packageSell: { code: string; name: string; sellPence: number }[];
}

export function calculate(est: Estimate): EstimateTotals {
  const byKind: Record<LineKind, number> = { labour: 0, material: 0, plant: 0, subcontract: 0 };
  const packageDirect = est.packages.map((p) => {
    let d = 0;
    for (const l of p.lines) {
      const t = lineTotal(l);
      byKind[l.kind] += t;
      d += t;
    }
    return { code: p.code, name: p.name, directPence: d };
  });
  const directPence = packageDirect.reduce((a, p) => a + p.directPence, 0);
  const factor = (1 + est.overheadPct / 100) * (1 + est.marginPct / 100);
  // Single rounding point for the headline figure.
  const sellPence = Math.round(directPence * factor);
  const overheadPence = Math.round((directPence * est.overheadPct) / 100);
  const marginPence = sellPence - directPence - overheadPence;

  // Allocate package sell prices; the last package absorbs the rounding remainder.
  let allocated = 0;
  const packageSell = packageDirect.map((p, i) => {
    const s = i === packageDirect.length - 1 ? sellPence - allocated : Math.round(p.directPence * factor);
    allocated += s;
    return { code: p.code, name: p.name, sellPence: s };
  });

  return { directPence, byKind, overheadPence, marginPence, sellPence, packageDirect, packageSell };
}
