"use client";

import { useState } from "react";
import { BookOpen, Sparkles, X } from "lucide-react";
import { AiNote, Badge, Button, Card, Table, Tabs, Td, Th } from "@/components/ui";
import type { LibraryItem, LibraryKind } from "@/lib/mock/data";
import { formatMoney } from "@/lib/money";

const kinds: { key: LibraryKind; label: string }[] = [
  { key: "rates", label: "Rate books" },
  { key: "scopes", label: "Scopes of works" },
  { key: "drm", label: "DRM templates" },
  { key: "attendances", label: "Attendances" },
  { key: "prelims", label: "Prelims" },
  { key: "payment", label: "Payment schedules" },
  { key: "templates", label: "Document templates" },
];

const UPLIFT_PCT = 3.5;
// Round each uplifted rate once, to the nearest penny.
const uplift = (pence: number) => Math.round((pence * (100 + UPLIFT_PCT)) / 100);

export function LibraryView({ items }: { items: LibraryItem[] }) {
  const [kind, setKind] = useState<LibraryKind>("rates");
  const [preview, setPreview] = useState(false);
  const [applied, setApplied] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const flash = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const visible = items.filter((i) => i.kind === kind);
  const old = items.filter((i) => i.kind === "rates" && i.year === 2025);
  const oldLines = old.flatMap((b) => (b.rates ?? []).map((r) => ({ book: b.name, ...r })));
  const ratesFor = (b: LibraryItem) => (applied && b.year === 2025 ? (b.rates ?? []).map((r) => ({ ...r, ratePence: uplift(r.ratePence) })) : b.rates ?? []);

  return (
    <>
      <Tabs<LibraryKind> value={kind} onChange={setKind} tabs={kinds.map((k) => ({ ...k, count: items.filter((i) => i.kind === k.key).length }))} />

      {kind === "rates" && (
        <Card className="mb-4">
          <div className="flex flex-wrap items-center gap-3">
            <Sparkles size={16} className="text-lime-dk" />
            <div className="min-w-0 flex-1 text-sm">
              <span className="font-semibold">AI bulk action:</span> &quot;Apply +{UPLIFT_PCT}% to all 2025 rates&quot;
              <div className="text-xs text-muted">
                {old.length} rate books · {oldLines.length} rates shown here (of {old.reduce((a, b) => a + b.count, 0)} in full). You see every change before anything is saved.
              </div>
            </div>
            {applied ? <Badge tone="good">Applied · new versions saved</Badge> : <Button onClick={() => setPreview(true)}>Preview changes</Button>}
          </div>
        </Card>
      )}

      <div className="grid gap-4 lg:grid-cols-2">
        {visible.map((it) => (
          <Card key={it.id}>
            <div className="flex flex-wrap items-start gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent-soft text-accent-ink">
                <BookOpen size={16} />
              </span>
              <div className="min-w-0 flex-1">
                <div className="font-semibold">{it.name}</div>
                <div className="text-xs text-muted">{it.description}</div>
                <div className="mt-1.5 flex flex-wrap gap-1.5 text-[11px] text-muted">
                  <Badge>
                    {it.count} {it.countLabel}
                  </Badge>
                  <span>Owner {it.owner}</span>
                  <span>· Updated {applied && it.year === 2025 ? "today" : it.updated}</span>
                </div>
              </div>
              <Button variant="secondary" onClick={() => flash(`"${it.name}" added to EST-0236. Everything it brings in stays editable.`)}>
                Use in estimate
              </Button>
            </div>
            {it.rates && (
              <div className="mt-3 overflow-x-auto">
                <table className="w-full min-w-[420px] text-sm">
                  <tbody>
                    {ratesFor(it).map((r) => (
                      <tr key={r.code} className="border-t border-hair">
                        <td className="py-1.5 pr-2 font-mono text-[11px] text-muted">{r.code}</td>
                        <td className="py-1.5 pr-2">{r.description}</td>
                        <td className="py-1.5 pr-2 text-muted">{r.unit}</td>
                        <td className="tabular py-1.5 text-right">{formatMoney(r.ratePence, { pence: true })}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        ))}
      </div>

      {preview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <button className="absolute inset-0 bg-black/40" aria-label="Close preview" onClick={() => setPreview(false)} />
          <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-hair bg-surface p-5 shadow-2xl">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="heading text-sm">Preview: +{UPLIFT_PCT}% on 2025 rates</h2>
              <button onClick={() => setPreview(false)} aria-label="Close" className="rounded p-1 text-muted hover:text-ink">
                <X size={16} />
              </button>
            </div>
            <AiNote className="mb-3">
              I&apos;ve found {old.length} rate books dated 2025. Each changed rate is rounded once to the nearest penny. The old version is kept, so estimates already priced don&apos;t move.
            </AiNote>
            <Table>
              <thead>
                <tr>
                  <Th>Book</Th>
                  <Th>Rate</Th>
                  <Th right>Now</Th>
                  <Th right>After</Th>
                </tr>
              </thead>
              <tbody>
                {oldLines.map((r) => (
                  <tr key={r.code}>
                    <Td className="text-xs text-muted">{r.book}</Td>
                    <Td>
                      {r.description} <span className="text-muted">/{r.unit}</span>
                    </Td>
                    <Td right>{formatMoney(r.ratePence, { pence: true })}</Td>
                    <Td right className="font-semibold">
                      {formatMoney(uplift(r.ratePence), { pence: true })}
                    </Td>
                  </tr>
                ))}
              </tbody>
            </Table>
            <div className="mt-4 flex justify-end gap-2">
              <Button variant="secondary" onClick={() => setPreview(false)}>
                Cancel
              </Button>
              <Button
                onClick={() => {
                  setApplied(true);
                  setPreview(false);
                  flash(`${old.length} rate books updated as new versions. The change is in the audit log under your name.`);
                }}
              >
                Confirm &amp; save as new version
              </Button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div role="status" className="fixed bottom-16 left-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 rounded-xl bg-night px-4 py-3 text-sm text-white shadow-xl">
          {toast}
        </div>
      )}
    </>
  );
}
