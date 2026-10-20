"use client";

import { useState } from "react";
import { AlertTriangle, CheckCircle2, FileSignature, FileSpreadsheet, Mail, ShieldAlert, X } from "lucide-react";
import { AiNote, Badge, Button, Card, IntegrationTag, Table, Tabs, Td, Th } from "@/components/ui";
import { cn } from "@/lib/cn";
import { estimateVersions } from "@/lib/mock/data";
import type { Estimate, LineKind } from "@/lib/mock/types";
import { formatMoney, pct } from "@/lib/money";
import { calculate, isOverride, lineTotal } from "./calc";
import { Takeoff } from "./takeoff";

type Tab = "build" | "takeoff" | "quote" | "versions";

const kindLabel: Record<LineKind, string> = { labour: "Labour", material: "Materials", plant: "Plant", subcontract: "Subcontract" };

interface Check {
  id: string;
  level: "blocking" | "warning";
  text: string;
}

function SendModal({ channel, estimate, sellPence, onClose }: { channel: "outlook" | "sign"; estimate: Estimate; sellPence: number; onClose: () => void }) {
  const [sent, setSent] = useState(false);
  const outlook = channel === "outlook";
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button className="absolute inset-0 bg-black/40" aria-label="Close" onClick={onClose} />
      <div className="relative w-full max-w-md rounded-2xl border border-hair bg-surface p-5 shadow-2xl">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="heading text-base">{outlook ? "Send quotation via Outlook" : "Send for Acrobat Sign"}</h2>
          <button onClick={onClose} aria-label="Close" className="rounded p-1 text-muted hover:text-ink">
            <X size={16} />
          </button>
        </div>
        {sent ? (
          <div className="space-y-3 text-sm">
            <p className="flex items-start gap-2">
              <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-good" />
              Quotation Q-0236-v{estimate.version} {outlook ? "sent" : "sent for signature"}. The send is recorded with who clicked, when, and the exact document
              sent. Replies will be filed against this quotation automatically.
            </p>
            <Button onClick={onClose}>Done</Button>
          </div>
        ) : (
          <>
            <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 text-sm">
              <dt className="text-muted">From</dt>
              <dd className="font-mono text-xs">estimating@bcjs.co.uk</dd>
              <dt className="text-muted">To</dt>
              <dd>Huw Pritchard, {estimate.client}</dd>
              <dt className="text-muted">Document</dt>
              <dd>
                Q-0236-v{estimate.version}.pdf · frozen from {estimate.ref} v{estimate.version}
              </dd>
              <dt className="text-muted">Total</dt>
              <dd className="tabular font-semibold">{formatMoney(sellPence)} + VAT</dd>
              <dt className="text-muted">Sent by</dt>
              <dd>James Price (QS)</dd>
            </dl>
            <p className="mt-3 rounded-lg bg-surface-2 p-2.5 text-xs text-muted">
              Nothing is sent automatically. Pressing send freezes this version, and it is recorded on the job with your name, the time and the exact
              PDF.{" "}
              {outlook
                ? "It goes from the shared estimating mailbox, so replies land in one place."
                : "The signed copy comes back from Acrobat Sign and is filed in the SharePoint register as the client's written acceptance."}
            </p>
            <div className="mt-4 flex justify-end gap-2">
              <Button variant="secondary" onClick={onClose}>
                Cancel
              </Button>
              <Button onClick={() => setSent(true)}>{outlook ? "Send now" : "Send for signature"}</Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export function EstimateBuilder({ estimate }: { estimate: Estimate }) {
  const [tab, setTab] = useState<Tab>("build");
  const [modal, setModal] = useState<"outlook" | "sign" | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [overrides, setOverrides] = useState<Record<string, string>>({});
  const [overrideFor, setOverrideFor] = useState<string | null>(null);
  const [reason, setReason] = useState("");

  const t = calculate(estimate);
  const overrideLines = estimate.packages.flatMap((p) => p.lines).filter(isOverride);
  const checks: Check[] = [
    {
      id: "scaffold",
      level: "blocking",
      text: "Scaffold priced for 14 weeks but the draft programme runs 16 weeks.",
    },
    { id: "ratecard", level: "warning", text: `${overrideLines.length} lines priced away from the rate card.` },
    { id: "pc", level: "warning", text: "Kitchen is a PC sum. Confirm the client allowance is in the assumptions." },
  ];
  const blocking = checks.filter((c) => c.level === "blocking" && !overrides[c.id]);

  const versions = estimateVersions[estimate.id] ?? [];
  const v1 = versions.find((v) => v.version === 1);

  const flash = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <>
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <Button
          variant="secondary"
          onClick={() => flash(`${estimate.ref}-v${estimate.version}.xlsx exported. Re-importing recalculates every total on the server.`)}
        >
          <FileSpreadsheet size={14} /> Export to Excel for offline pricing
        </Button>
        <div className="ml-auto flex flex-wrap gap-2">
          <Button variant="dark" onClick={() => setModal("outlook")} disabled={blocking.length > 0}>
            <Mail size={14} /> Send via Outlook
          </Button>
          <Button onClick={() => setModal("sign")} disabled={blocking.length > 0}>
            <FileSignature size={14} /> Send for Acrobat Sign
          </Button>
        </div>
      </div>
      {blocking.length > 0 && (
        <p className="-mt-2 mb-4 text-right text-xs text-bad">Sending is blocked until the blocking check below is fixed or overridden with a reason.</p>
      )}

      <Tabs<Tab>
        value={tab}
        onChange={setTab}
        tabs={[
          { key: "build", label: "Build-up" },
          { key: "takeoff", label: "Take-off" },
          { key: "quote", label: "Customer quote preview" },
          { key: "versions", label: "Versions", count: versions.length },
        ]}
      />

      {tab === "build" && (
        <div className="grid gap-5 xl:grid-cols-[1.7fr_1fr]">
          <div className="flex min-w-0 flex-col gap-4">
            {estimate.packages.map((p) => {
              const pd = t.packageDirect.find((x) => x.code === p.code)!;
              return (
                <Card key={p.code} title={`${p.code} · ${p.name}`} action={<span className="tabular text-sm font-bold">{formatMoney(pd.directPence)}</span>}>
                  <Table className="border-0">
                    <thead>
                      <tr>
                        <Th>Item</Th>
                        <Th right>Qty</Th>
                        <Th>Unit</Th>
                        <Th>Kind</Th>
                        <Th right>Rate</Th>
                        <Th right>Total</Th>
                      </tr>
                    </thead>
                    <tbody>
                      {p.lines.map((l) => (
                        <tr key={l.id}>
                          <Td>
                            {l.description}
                            {isOverride(l) && (
                              <div className="mt-0.5">
                                <Badge tone="warn">override · card {formatMoney(l.cardRatePence, { pence: true })}</Badge>
                              </div>
                            )}
                          </Td>
                          <Td right>{l.qty}</Td>
                          <Td>{l.unit}</Td>
                          <Td className="text-xs text-muted">{kindLabel[l.kind]}</Td>
                          <Td right>{formatMoney(l.ratePence, { pence: true })}</Td>
                          <Td right className="font-semibold">
                            {formatMoney(lineTotal(l))}
                          </Td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </Card>
              );
            })}
          </div>

          <div className="flex min-w-0 flex-col gap-4">
            <Card title="Calculation">
              <dl className="space-y-1.5 text-sm">
                {(Object.keys(t.byKind) as LineKind[]).map((k) => (
                  <div key={k} className="flex justify-between">
                    <dt className="text-muted">{kindLabel[k]}</dt>
                    <dd className="tabular">{formatMoney(t.byKind[k])}</dd>
                  </div>
                ))}
                <div className="flex justify-between border-t border-hair pt-1.5 font-semibold">
                  <dt>Direct cost</dt>
                  <dd className="tabular">{formatMoney(t.directPence)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted">Overhead {pct(estimate.overheadPct, 0)}</dt>
                  <dd className="tabular">{formatMoney(t.overheadPence)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted">Margin {pct(estimate.marginPct, 0)}</dt>
                  <dd className="tabular">{formatMoney(t.marginPence)}</dd>
                </div>
                <div className="flex justify-between rounded-lg bg-accent-soft px-2 py-2 text-base font-bold text-accent-ink">
                  <dt>Total sell</dt>
                  <dd className="tabular">{formatMoney(t.sellPence)}</dd>
                </div>
              </dl>
              <p className="mt-2 text-[11px] text-muted">Every total is worked out once, here, in whole pence and rounded once. No spreadsheet formulas.</p>
            </Card>

            <Card title="Validation before submission">
              <ul className="space-y-2">
                {checks.map((c) => {
                  const ov = overrides[c.id];
                  return (
                    <li
                      key={c.id}
                      className={cn(
                        "rounded-lg border px-3 py-2 text-sm",
                        ov ? "border-hair bg-surface-2" : c.level === "blocking" ? "border-bad/40 bg-bad-soft" : "border-warn/40 bg-warn-soft",
                      )}
                    >
                      <div className="flex items-start gap-2">
                        {c.level === "blocking" ? (
                          <ShieldAlert size={15} className={cn("mt-0.5 shrink-0", ov ? "text-muted" : "text-bad")} />
                        ) : (
                          <AlertTriangle size={15} className="mt-0.5 shrink-0 text-warn" />
                        )}
                        <div className="flex-1">
                          <div className={cn(ov && "line-through opacity-70")}>{c.text}</div>
                          {ov && <div className="mt-0.5 text-xs text-muted">Overridden by James Price: “{ov}”. On the record.</div>}
                          {!ov && c.level === "blocking" && overrideFor !== c.id && (
                            <button onClick={() => setOverrideFor(c.id)} className="mt-1 text-xs font-semibold text-bad underline">
                              Record an override
                            </button>
                          )}
                          {overrideFor === c.id && (
                            <form
                              className="mt-2 flex gap-2"
                              onSubmit={(e) => {
                                e.preventDefault();
                                if (!reason.trim()) return;
                                setOverrides((o) => ({ ...o, [c.id]: reason.trim() }));
                                setOverrideFor(null);
                                setReason("");
                              }}
                            >
                              <input
                                autoFocus
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                                placeholder="Reason (required)"
                                className="min-w-0 flex-1 rounded-md border border-hair bg-surface px-2 py-1 text-xs text-ink"
                              />
                              <button type="submit" className="rounded-md bg-ink px-2 py-1 text-xs font-semibold text-bg">
                                Override
                              </button>
                            </form>
                          )}
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </Card>

            <Card title="Scope, assumptions & exclusions" action={<IntegrationTag system="Claude">draft</IntegrationTag>}>
              <AiNote className="mb-3">
                Drafted from the site survey, drawings and BCJS&apos;s past barn conversions. The QS edits and approves. It never sets a price.
              </AiNote>
              <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">Assumptions</div>
              <ul className="mb-3 mt-1 list-disc space-y-1 pl-5 text-sm">
                {estimate.assumptions.map((a) => (
                  <li key={a}>{a}</li>
                ))}
              </ul>
              <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">Exclusions</div>
              <ul className="mt-1 list-disc space-y-1 pl-5 text-sm">
                {estimate.exclusions.map((a) => (
                  <li key={a}>{a}</li>
                ))}
              </ul>
            </Card>
          </div>
        </div>
      )}

      {tab === "quote" && (
        <div className="mx-auto max-w-3xl">
          <p className="mb-3 text-xs text-muted">
            This is what the client sees: a price per package, the scope, assumptions and exclusions. Day rates, cost build-up and margin are never shown.
          </p>
          <div className="rounded-xl border border-hair bg-surface p-6 shadow-sm sm:p-8">
            <div className="mb-6 flex flex-wrap items-start justify-between gap-4 border-b-4 border-lime pb-4">
              <div>
                <div className="text-lg font-bold uppercase tracking-[0.16em]">Bespoke Construction</div>
                <div className="text-xs uppercase tracking-[0.14em] text-accent-ink">&amp; Joinery Solutions</div>
              </div>
              <div className="text-right text-xs text-muted">
                Quotation Q-0236-v{estimate.version}
                <br />
                20 October 2026
                <br />
                Valid for 30 days
              </div>
            </div>
            <div className="mb-4 text-sm">
              <div className="font-semibold">{estimate.client}</div>
              <div className="text-muted">{estimate.title}</div>
            </div>
            <table className="w-full text-sm">
              <tbody>
                {t.packageSell.map((p) => (
                  <tr key={p.code} className="border-b border-hair">
                    <td className="py-2">{p.name}</td>
                    <td className="tabular py-2 text-right">{formatMoney(p.sellPence)}</td>
                  </tr>
                ))}
                <tr className="font-bold">
                  <td className="py-3">Total (excluding VAT)</td>
                  <td className="tabular py-3 text-right">{formatMoney(t.sellPence)}</td>
                </tr>
              </tbody>
            </table>
            <div className="mt-4 grid gap-4 text-xs sm:grid-cols-2">
              <div>
                <div className="mb-1 font-semibold uppercase tracking-wider text-muted">Assumptions</div>
                <ul className="list-disc space-y-0.5 pl-4">
                  {estimate.assumptions.map((a) => (
                    <li key={a}>{a}</li>
                  ))}
                </ul>
              </div>
              <div>
                <div className="mb-1 font-semibold uppercase tracking-wider text-muted">Exclusions</div>
                <ul className="list-disc space-y-0.5 pl-4">
                  {estimate.exclusions.map((a) => (
                    <li key={a}>{a}</li>
                  ))}
                </ul>
              </div>
            </div>
            <p className="mt-6 text-[11px] text-muted">Clarence Chambers, Clarence St, Pontypool NP4 6XP · Member of the Federation of Master Builders</p>
          </div>
        </div>
      )}

      {tab === "takeoff" && <Takeoff />}

      {tab === "versions" && (
        <div className="grid gap-5 lg:grid-cols-2">
          {versions.map((v) => {
            const total = v.version === estimate.version ? t.sellPence : v.totalSellPence;
            return (
              <Card key={v.version} title={`Version ${v.version}`} action={<Badge tone={v.status === "submitted" ? "neutral" : "warn"}>{v.status}</Badge>}>
                <div className="tabular text-2xl font-bold">{formatMoney(total)}</div>
                <div className="mt-1 text-xs text-muted">
                  {v.date} · {v.by}
                </div>
                <p className="mt-2 text-sm">{v.note}</p>
                {v.status === "submitted" && <p className="mt-2 text-xs text-muted">Frozen at submission. It can be read exactly as it was sent.</p>}
              </Card>
            );
          })}
          {v1 && (
            <Card title="Compare v1 → v2" className="lg:col-span-2">
              <div className="flex flex-wrap items-baseline gap-3 text-sm">
                <span className="tabular">{formatMoney(v1.totalSellPence)}</span>
                <span className="text-muted">→</span>
                <span className="tabular font-bold">{formatMoney(t.sellPence)}</span>
                <Badge tone={t.sellPence >= v1.totalSellPence ? "warn" : "good"}>
                  {t.sellPence >= v1.totalSellPence ? "+" : "−"}
                  {formatMoney(Math.abs(t.sellPence - v1.totalSellPence))}
                </Badge>
              </div>
              <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-ink">
                <li>JOI · Green oak frame re-quoted by subcontractor (+£4,200)</li>
                <li>MEP · Air source heat pump & UFH added (+£14,500)</li>
                <li>ROF · Slate re-measured from 132 m² to 148 m²</li>
              </ul>
            </Card>
          )}
        </div>
      )}

      {modal && <SendModal channel={modal} estimate={estimate} sellPence={t.sellPence} onClose={() => setModal(null)} />}
      {toast && (
        <div role="status" className="fixed bottom-16 left-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 rounded-xl bg-night px-4 py-3 text-sm text-white shadow-xl">
          {toast}
        </div>
      )}
    </>
  );
}
