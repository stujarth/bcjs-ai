import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

function Box({ title, items, accent, className }: { title: string; items: string[]; accent?: boolean; className?: string }) {
  return (
    <div className={cn("rounded-xl border p-3", accent ? "border-lime bg-accent-soft" : "border-hair bg-surface-2", className)}>
      <div className={cn("heading text-xs", accent ? "text-accent-ink" : "text-ink")}>{title}</div>
      <ul className="mt-1.5 flex flex-wrap gap-1">
        {items.map((i) => (
          <li key={i} className="rounded-md border border-hair bg-surface px-1.5 py-0.5 text-[11px] text-muted">
            {i}
          </li>
        ))}
      </ul>
    </div>
  );
}

function Link2({ label, vertical }: { label: ReactNode; vertical?: boolean }) {
  return (
    <div className={cn("flex items-center justify-center gap-1 text-[10.5px] font-semibold text-muted", vertical ? "flex-col py-1" : "")}>
      <span aria-hidden className="text-lime-dk">{vertical ? "↕" : "⇄"}</span>
      <span className="text-center">{label}</span>
    </div>
  );
}

/** Stacks vertically on phones; three columns from md upwards. */
export function ArchitectureDiagram() {
  return (
    <figure aria-label="System architecture" className="rounded-xl border border-hair bg-surface p-4">
      <div className="grid items-center gap-3 md:grid-cols-[1fr_auto_1.2fr_auto_1fr]">
        <Box title="People" items={["Directors", "QS & PMs", "Finance", "Site managers", "Subcontractors", "Clients"]} />
        <Link2 label="Entra SSO / guest" />
        <div className="space-y-2">
          <Box accent title="BCJS Operations Control System" items={["Web app", "Site PWA (offline)", "Document register", "Stage gates", "Audit log", "PostgreSQL · UK South"]} />
          <Link2 vertical label="permission-scoped tools, every call audited" />
          <Box title="Claude AI layer" items={["Ask BCJS", "Invoice reader", "Diary dictation", "RAMS drafts", "Drawing register"]} />
        </div>
        <Link2 label="APIs & webhooks" />
        <div className="space-y-2">
          <Box title="Microsoft 365" items={["Entra ID", "SharePoint", "Outlook", "Teams", "Excel", "Calendar"]} />
          <Box title="Xero" items={["Bills", "Sales invoices", "Payments", "Contacts", "Tracking: project"]} />
          <Box title="Adobe Acrobat Sign" items={["Quote acceptance", "Contracts"]} />
          <Box title="Copilot & MCP" items={["Copilot agent", "Claude connector"]} />
        </div>
      </div>
      <figcaption className="mt-3 text-[11px] text-muted">
        Xero stays the ledger and Microsoft 365 stays where people work. The OCS holds the project record and keeps both in step.
      </figcaption>
    </figure>
  );
}
