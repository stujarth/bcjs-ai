import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import type { Rag } from "@/lib/mock/types";

export function PageHeader({
  kicker,
  title,
  subtitle,
  actions,
}: {
  kicker?: string;
  title: string;
  subtitle?: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div className="min-w-0">
        {kicker && <div className="mb-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">{kicker}</div>}
        <h1 className="heading text-2xl text-ink">{title}</h1>
        {subtitle && <div className="mt-1 text-sm text-muted">{subtitle}</div>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}

export function Card({ children, className, title, action }: { children: ReactNode; className?: string; title?: string; action?: ReactNode }) {
  return (
    <section className={cn("min-w-0 rounded-xl border border-hair bg-surface p-4 shadow-[0_1px_3px_rgba(31,31,31,0.05)]", className)}>
      {title && (
        <div className="mb-3 flex items-center justify-between gap-2">
          <h2 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">{title}</h2>
          {action}
        </div>
      )}
      {children}
    </section>
  );
}

const toneClass = {
  good: "bg-good-soft text-good",
  warn: "bg-warn-soft text-warn",
  bad: "bg-bad-soft text-bad",
  neutral: "bg-surface-2 text-muted border border-hair",
  accent: "bg-accent-soft text-accent-ink",
  dark: "bg-night text-white",
} as const;
export type Tone = keyof typeof toneClass;

export function Badge({ tone = "neutral", children, className }: { tone?: Tone; children: ReactNode; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2 py-0.5 text-[11px] font-semibold", toneClass[tone], className)}>
      {children}
    </span>
  );
}

export const ragTone = (rag: Rag): Tone => (rag === "green" ? "good" : rag === "amber" ? "warn" : "bad");

export function RagDot({ rag, className }: { rag: Rag; className?: string }) {
  const c = rag === "green" ? "bg-good" : rag === "amber" ? "bg-warn" : "bg-bad";
  return <span aria-label={rag} className={cn("inline-block h-2 w-2 shrink-0 rounded-full", c, className)} />;
}

export function Stat({
  label,
  value,
  meta,
  tone,
}: {
  label: string;
  value: ReactNode;
  meta?: ReactNode;
  tone?: "good" | "bad" | "warn";
}) {
  const bar = tone === "good" ? "bg-good" : tone === "bad" ? "bg-bad" : tone === "warn" ? "bg-warn" : "bg-hair";
  const text = tone === "good" ? "text-good" : tone === "bad" ? "text-bad" : tone === "warn" ? "text-warn" : "text-ink";
  return (
    <div className="relative overflow-hidden rounded-xl border border-hair bg-surface p-4 pl-5">
      <span className={cn("absolute inset-y-0 left-0 w-1", bar)} />
      <div className="text-[11px] font-semibold uppercase tracking-[0.1em] text-muted">{label}</div>
      <div className={cn("tabular mt-1 text-2xl font-bold tracking-tight", text)}>{value}</div>
      {meta && <div className="mt-0.5 text-xs text-muted">{meta}</div>}
    </div>
  );
}

export function Button({
  children,
  variant = "primary",
  href,
  onClick,
  className,
  type = "button",
  disabled,
}: {
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost" | "dark";
  href?: string;
  onClick?: () => void;
  className?: string;
  type?: "button" | "submit";
  disabled?: boolean;
}) {
  const base =
    "inline-flex items-center justify-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold uppercase tracking-[0.06em] transition disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime";
  const variants = {
    primary: "bg-lime text-night hover:bg-lime-dk shadow-[0_2px_6px_rgba(155,186,60,0.35)]",
    secondary: "border border-hair bg-surface text-ink hover:bg-surface-2",
    ghost: "text-muted hover:text-ink hover:bg-surface-2",
    dark: "bg-night text-white hover:bg-chrome",
  };
  const cls = cn(base, variants[variant], className);
  if (href)
    return (
      <Link href={href} className={cls}>
        {children}
      </Link>
    );
  return (
    <button type={type} onClick={onClick} className={cls} disabled={disabled}>
      {children}
    </button>
  );
}

/** Horizontally scrollable table wrapper so wide tables never cause page scroll on phones. */
export function Table({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("overflow-x-auto rounded-xl border border-hair bg-surface", className)}>
      <table className="w-full min-w-[640px] border-collapse text-sm">{children}</table>
    </div>
  );
}
export function Th({ children, className, right }: { children?: ReactNode; className?: string; right?: boolean }) {
  return (
    <th
      className={cn(
        "border-b border-hair bg-surface-2 px-3 py-2 text-left text-[10.5px] font-bold uppercase tracking-[0.08em] text-muted",
        right && "text-right",
        className,
      )}
    >
      {children}
    </th>
  );
}
export function Td({ children, className, right }: { children?: ReactNode; className?: string; right?: boolean }) {
  return <td className={cn("border-b border-hair/70 px-3 py-2 align-top text-ink", right && "tabular text-right", className)}>{children}</td>;
}

export function Tabs<T extends string>({ tabs, value, onChange }: { tabs: { key: T; label: string; count?: number }[]; value: T; onChange: (k: T) => void }) {
  return (
    <div role="tablist" className="mb-4 flex flex-wrap gap-1.5">
      {tabs.map((t) => (
        <button
          key={t.key}
          role="tab"
          aria-selected={value === t.key}
          onClick={() => onChange(t.key)}
          className={cn(
            "rounded-full px-3 py-1.5 text-xs font-semibold transition",
            value === t.key ? "bg-ink text-bg" : "bg-surface-2 text-muted hover:text-ink border border-hair",
          )}
        >
          {t.label}
          {t.count !== undefined && <span className="ml-1.5 opacity-70">{t.count}</span>}
        </button>
      ))}
    </div>
  );
}

/** Dark "proof" banner used for the one number that matters on a screen. */
export function Proof({ kicker, headline, detail, action }: { kicker: string; headline: ReactNode; detail: ReactNode; action?: ReactNode }) {
  return (
    <div className="relative mb-5 flex flex-wrap items-center gap-4 overflow-hidden rounded-xl bg-gradient-to-r from-[#242f2a] via-[#20282a] to-[#232b2d] p-5 pl-6 text-white shadow-[0_3px_10px_rgba(31,31,31,0.16)]">
      <span className="absolute inset-y-0 left-0 w-1 bg-lime" />
      <div className="min-w-0 flex-1">
        <div className="text-[10.5px] font-semibold uppercase tracking-[0.18em] text-lime">{kicker}</div>
        <div className="mt-1 text-xl font-bold leading-tight sm:text-2xl">{headline}</div>
        <div className="mt-1 max-w-2xl text-sm text-[#a6afab]">{detail}</div>
      </div>
      {action}
    </div>
  );
}

export function AiNote({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("flex items-start gap-2 rounded-lg border border-lime/40 bg-accent-soft px-3 py-2 text-xs text-accent-ink", className)}>
      <span className="mt-px shrink-0 rounded bg-lime px-1 text-[9px] font-bold uppercase tracking-wider text-night">AI</span>
      <div>{children}</div>
    </div>
  );
}

export function IntegrationTag({ system, children }: { system: "Xero" | "SharePoint" | "Outlook" | "Teams" | "Acrobat Sign" | "Entra ID" | "Claude"; children?: ReactNode }) {
  const colour: Record<string, string> = {
    Xero: "#13B5EA",
    SharePoint: "#038387",
    Outlook: "#0F6CBD",
    Teams: "#5B5FC7",
    "Acrobat Sign": "#B30B00",
    "Entra ID": "#0078D4",
    Claude: "#9BBA3C",
  };
  return (
    <span className="inline-flex items-center gap-1.5 rounded-md border border-hair bg-surface-2 px-2 py-0.5 text-[11px] text-muted">
      <span className="h-2 w-2 rounded-sm" style={{ background: colour[system] }} />
      <span className="font-semibold text-ink">{system}</span>
      {children}
    </span>
  );
}

export function Progress({ value, tone = "accent" }: { value: number; tone?: "accent" | "good" | "bad" | "warn" }) {
  const c = tone === "good" ? "bg-good" : tone === "bad" ? "bg-bad" : tone === "warn" ? "bg-warn" : "bg-lime";
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-2 ring-1 ring-hair" role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={100}>
      <div className={cn("h-full rounded-full", c)} style={{ width: `${Math.min(100, Math.max(0, value))}%` }} />
    </div>
  );
}
