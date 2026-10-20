"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { AlertTriangle, ChevronDown, Plus, X } from "lucide-react";
import { Badge, Button } from "@/components/ui";
import { cn } from "@/lib/cn";
import { enquiries, people, personById } from "@/lib/mock/data";
import type { Enquiry, EnquiryStage } from "@/lib/mock/types";
import { formatMoney, formatMoneyShort, sumPence } from "@/lib/money";

const activeStages: { key: EnquiryStage; label: string }[] = [
  { key: "new", label: "New" },
  { key: "qualifying", label: "Qualifying" },
  { key: "surveyed", label: "Surveyed" },
  { key: "converted", label: "Converted" },
];
const closedStages: { key: EnquiryStage; label: string }[] = [
  { key: "lost", label: "Lost" },
  { key: "dormant", label: "Dormant" },
];

function EnquiryCard({ e }: { e: Enquiry }) {
  const owner = personById(e.ownerId);
  return (
    <Link
      href={`/enquiries/${e.id}`}
      className="block rounded-lg border border-hair bg-surface p-3 shadow-[0_1px_2px_rgba(31,31,31,0.04)] transition hover:border-lime"
    >
      <div className="flex items-center gap-2">
        <span className="font-mono text-[11px] text-muted">{e.ref}</span>
        <span className="ml-auto text-[11px] text-muted">{e.ageDays}d</span>
      </div>
      <div className="mt-1 text-sm font-semibold text-ink">{e.client}</div>
      <div className="text-xs text-muted">{e.type}</div>
      <div className="mt-2 flex items-center gap-2">
        <span className="tabular text-sm font-bold">{formatMoneyShort(e.potentialValuePence)}</span>
        {e.lossReason && <Badge tone="bad">{e.lossReason}</Badge>}
        <span
          title={owner?.name}
          className="ml-auto flex h-6 w-6 items-center justify-center rounded-full bg-slate text-[10px] font-semibold text-white"
        >
          {owner?.initials}
        </span>
      </div>
    </Link>
  );
}

function NewEnquiryModal({ onClose }: { onClose: () => void }) {
  const [name, setName] = useState("");
  const [saved, setSaved] = useState(false);
  const match = useMemo(() => {
    const q = name.trim().toLowerCase();
    if (q.length < 3) return undefined;
    return enquiries.find((e) => e.client.toLowerCase().includes(q) || e.contact.toLowerCase().includes(q));
  }, [name]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button className="absolute inset-0 bg-black/40" aria-label="Close" onClick={onClose} />
      <div className="relative w-full max-w-lg rounded-2xl border border-hair bg-surface p-5 shadow-2xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="heading text-base">New enquiry</h2>
          <button onClick={onClose} aria-label="Close" className="rounded p-1 text-muted hover:text-ink">
            <X size={16} />
          </button>
        </div>
        {saved ? (
          <div className="space-y-3 text-sm">
            <p>
              Enquiry <span className="font-mono">ENQ-0413</span> logged and assigned to <strong>Lucy Milne</strong>. It appears in Monday&apos;s weekly review.
            </p>
            <Button onClick={onClose}>Done</Button>
          </div>
        ) : (
          <form
            className="space-y-3"
            onSubmit={(e) => {
              e.preventDefault();
              setSaved(true);
            }}
          >
            <label className="block text-xs font-semibold text-muted">
              Client name
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Try typing “Pritchard” or “Bowen”"
                className="mt-1 w-full rounded-lg border border-hair bg-surface-2 px-3 py-2 text-sm text-ink outline-none focus:border-lime"
              />
            </label>
            {match && (
              <div className="flex items-start gap-2 rounded-lg border border-warn/50 bg-warn-soft px-3 py-2 text-xs text-ink">
                <AlertTriangle size={14} className="mt-0.5 shrink-0 text-warn" />
                <div>
                  <strong>Possible duplicate client:</strong> {match.client} ({match.contact}), {match.ref}, {match.stage}. Link to the existing client
                  instead of creating a new one?
                  <div className="mt-1.5 flex gap-2">
                    <button type="button" className="font-semibold text-accent-ink underline">
                      Link to existing
                    </button>
                    <button type="button" className="text-muted underline">
                      It&apos;s a different client
                    </button>
                  </div>
                </div>
              </div>
            )}
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="block text-xs font-semibold text-muted">
                Source
                <select className="mt-1 w-full rounded-lg border border-hair bg-surface-2 px-3 py-2 text-sm text-ink">
                  {["Website", "Referral", "Repeat client", "Architect", "Checkatrade", "Social"].map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </label>
              <label className="block text-xs font-semibold text-muted">
                Potential value (£)
                <input inputMode="numeric" placeholder="e.g. 45000" className="mt-1 w-full rounded-lg border border-hair bg-surface-2 px-3 py-2 text-sm text-ink" />
              </label>
            </div>
            <label className="block text-xs font-semibold text-muted">
              What do they want?
              <textarea rows={3} className="mt-1 w-full rounded-lg border border-hair bg-surface-2 px-3 py-2 text-sm text-ink" />
            </label>
            <div className="flex justify-end gap-2 pt-1">
              <Button variant="secondary" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">Log enquiry</Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export function EnquiryPipeline() {
  const [owner, setOwner] = useState<string>("all");
  const [stage, setStage] = useState<string>("all");
  const [showClosed, setShowClosed] = useState(false);
  const [modal, setModal] = useState(false);

  const owners = people.filter((p) => enquiries.some((e) => e.ownerId === p.id));
  const filtered = enquiries.filter((e) => (owner === "all" || e.ownerId === owner) && (stage === "all" || e.stage === stage));
  const column = (k: EnquiryStage) => filtered.filter((e) => e.stage === k);

  return (
    <>
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <select
          aria-label="Filter by owner"
          value={owner}
          onChange={(e) => setOwner(e.target.value)}
          className="rounded-full border border-hair bg-surface px-3 py-1.5 text-xs font-semibold text-ink"
        >
          <option value="all">All owners</option>
          {owners.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
        <select
          aria-label="Filter by stage"
          value={stage}
          onChange={(e) => setStage(e.target.value)}
          className="rounded-full border border-hair bg-surface px-3 py-1.5 text-xs font-semibold text-ink"
        >
          <option value="all">All stages</option>
          {[...activeStages, ...closedStages].map((s) => (
            <option key={s.key} value={s.key}>
              {s.label}
            </option>
          ))}
        </select>
        <div className="ml-auto">
          <Button onClick={() => setModal(true)}>
            <Plus size={14} /> New enquiry
          </Button>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {activeStages.map((s) => {
          const items = column(s.key);
          return (
            <div key={s.key} className="rounded-xl border border-hair bg-surface-2 p-2.5">
              <div className="mb-2 flex items-center gap-2 px-1">
                <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-muted">{s.label}</span>
                <span className="rounded-full bg-surface px-1.5 text-[11px] font-semibold text-muted ring-1 ring-hair">{items.length}</span>
                <span className="tabular ml-auto text-xs font-semibold text-ink">{formatMoney(sumPence(items.map((e) => e.potentialValuePence)))}</span>
              </div>
              <div className="flex flex-col gap-2">
                {items.map((e) => (
                  <EnquiryCard key={e.id} e={e} />
                ))}
                {items.length === 0 && <div className="px-1 py-4 text-center text-xs text-muted">Nothing here</div>}
              </div>
            </div>
          );
        })}
      </div>

      <button
        onClick={() => setShowClosed((v) => !v)}
        className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-muted hover:text-ink"
        aria-expanded={showClosed}
      >
        <ChevronDown size={14} className={cn("transition", showClosed && "rotate-180")} />
        Lost & dormant ({closedStages.reduce((a, s) => a + column(s.key).length, 0)})
      </button>
      {showClosed && (
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {closedStages.map((s) => (
            <div key={s.key} className="rounded-xl border border-hair bg-surface-2 p-2.5">
              <div className="mb-2 px-1 text-[11px] font-bold uppercase tracking-[0.12em] text-muted">{s.label}</div>
              <div className="flex flex-col gap-2">
                {column(s.key).map((e) => (
                  <EnquiryCard key={e.id} e={e} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {modal && <NewEnquiryModal onClose={() => setModal(false)} />}
    </>
  );
}
