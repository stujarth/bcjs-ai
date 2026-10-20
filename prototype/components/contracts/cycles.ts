// Construction Act payment cycle generator. Pure and deterministic (UTC) so it
// renders identically on server and client. Production runs the same rules per
// contract and per subcontract (Sean §10h / §16).
import type { MainContract } from "@/lib/mock/data";

export interface PaymentCycle {
  number: number;
  application: Date;
  due: Date;
  paymentNotice: Date;
  payLessDeadline: Date;
  finalDate: Date;
}

const DAY = 86_400_000;
const addDays = (d: Date, n: number) => new Date(d.getTime() + n * DAY);

export function isoToDate(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d));
}

// Fixed formatting rather than toLocaleDateString: Node and browser ICU data
// disagree on month abbreviations ("Sept" vs "Sep"), which breaks hydration.
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const dd = (d: Date) => String(d.getUTCDate()).padStart(2, "0");

export function formatDay(d: Date): string {
  return `${dd(d)} ${MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}

export function formatDayShort(d: Date): string {
  return `${WEEKDAYS[d.getUTCDay()]} ${dd(d)} ${MONTHS[d.getUTCMonth()]}`;
}

export function generateCycles(c: MainContract, count = 6): PaymentCycle[] {
  const [y, m] = c.firstCycleMonth.split("-").map(Number);
  return Array.from({ length: count }, (_, i) => {
    const application = new Date(Date.UTC(y, m - 1 + i, c.applicationDay));
    const due = addDays(application, c.dueAfterDays);
    const finalDate = addDays(due, c.finalAfterDays);
    return {
      number: i + 1,
      application,
      due,
      paymentNotice: addDays(due, c.paymentNoticeAfterDueDays),
      payLessDeadline: addDays(finalDate, -c.payLessBeforeFinalDays),
      finalDate,
    };
  });
}

export type CycleField = "application" | "due" | "paymentNotice" | "payLessDeadline" | "finalDate";

export const cycleLabels: Record<CycleField, string> = {
  application: "Application",
  due: "Due date",
  paymentNotice: "Payment notice (employer)",
  payLessDeadline: "Pay-less notice deadline",
  finalDate: "Final date for payment",
};

/** Every dated event across the cycles, in date order. */
export function cycleEvents(cycles: PaymentCycle[]) {
  const fields = Object.keys(cycleLabels) as CycleField[];
  return cycles
    .flatMap((c) => fields.map((f) => ({ cycle: c.number, field: f, label: cycleLabels[f], date: c[f] })))
    .sort((a, b) => a.date.getTime() - b.date.getTime());
}

/** The first event on or after today. */
export function nextEvent(cycles: PaymentCycle[], today: Date) {
  return cycleEvents(cycles).find((e) => e.date.getTime() >= today.getTime());
}

export const cisRate = (s: "gross" | "20" | "30") => (s === "gross" ? 0 : Number(s));

/** CIS deduction on the labour element only, in whole pence, rounded once. */
export const cisDeductionPence = (labourPence: number, s: "gross" | "20" | "30") => Math.round((labourPence * cisRate(s)) / 100);
