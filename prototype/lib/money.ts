// All money is held as integer pence, exactly as the production build will.
// Format only at the edge.

const gbp = new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", maximumFractionDigits: 0 });
const gbpPence = new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", minimumFractionDigits: 2 });

export function formatMoney(pence: number, opts: { pence?: boolean } = {}): string {
  return opts.pence ? gbpPence.format(pence / 100) : gbp.format(Math.round(pence / 100));
}

/** £1.24m / £186k style for KPI tiles. */
export function formatMoneyShort(pence: number): string {
  const pounds = pence / 100;
  const abs = Math.abs(pounds);
  const sign = pounds < 0 ? "-" : "";
  if (abs >= 1_000_000) return `${sign}£${(abs / 1_000_000).toFixed(2)}m`;
  if (abs >= 10_000) return `${sign}£${Math.round(abs / 1000)}k`;
  if (abs >= 1_000) return `${sign}£${(abs / 1000).toFixed(1)}k`;
  return `${sign}£${Math.round(abs)}`;
}

export function pct(n: number, digits = 1): string {
  return `${n.toFixed(digits)}%`;
}

export function sumPence(values: number[]): number {
  return values.reduce((a, b) => a + b, 0);
}
