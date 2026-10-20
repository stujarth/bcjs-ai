"use client";

import { useState } from "react";
import { AlertTriangle, CheckCircle2, Circle, FileText, ScanLine } from "lucide-react";
import { AiNote, Badge, Button, Card, type Tone } from "@/components/ui";
import { invoiceDocuments, projectById, purchaseOrders } from "@/lib/mock/data";
import type { InvoiceDocLine } from "@/lib/mock/data";
import type { XeroBill } from "@/lib/mock/types";
import { formatMoney } from "@/lib/money";
import { cn } from "@/lib/cn";

type InvoiceLine = InvoiceDocLine;

const statusTone: Record<XeroBill["status"], Tone> = { matched: "good", exception: "bad", "awaiting review": "warn" };

const lineTotal = (l: InvoiceLine) => Math.round(l.qty * l.ratePence);

function docFor(bill: XeroBill) {
  const doc = invoiceDocuments.find((d) => d.billId === bill.id);
  if (doc) return doc;
  return {
    billId: bill.id,
    supplierAddress: "South Wales",
    supplierVat: "GB 000 0000 00",
    confidencePct: 98,
    lines: [{ description: bill.poRef ? `Goods as per order ${bill.poRef}` : "Sundry consumables", qty: 1, unit: "item", ratePence: bill.netPence }] as InvoiceLine[],
  };
}

export function XeroFeed({ bills }: { bills: XeroBill[] }) {
  const [selectedId, setSelectedId] = useState<string>(bills.find((b) => b.status !== "matched")?.id ?? bills[0].id);
  const [posted, setPosted] = useState<Record<string, string>>({});
  const selected = bills.find((b) => b.id === selectedId)!;

  return (
    <div className="grid gap-5 xl:grid-cols-[minmax(0,340px)_minmax(0,1fr)]">
      <Card title="From the Xero feed & scanner">
        <ul className="-mx-1 flex flex-col gap-1">
          {bills.map((b) => {
            const done = posted[b.id];
            return (
              <li key={b.id}>
                <button
                  onClick={() => setSelectedId(b.id)}
                  aria-current={b.id === selectedId}
                  className={cn(
                    "flex w-full items-start gap-2.5 rounded-lg px-2.5 py-2 text-left transition",
                    b.id === selectedId ? "bg-accent-soft ring-1 ring-lime/50" : "hover:bg-surface-2",
                  )}
                >
                  {b.source === "Scanned (AI)" ? <ScanLine size={15} className="mt-0.5 shrink-0 text-accent-ink" /> : <FileText size={15} className="mt-0.5 shrink-0 text-muted" />}
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold text-ink">{b.supplier}</span>
                    <span className="block text-xs text-muted">
                      {b.invoiceNo} · {b.date} · {b.poRef ?? "no PO"}
                    </span>
                  </span>
                  <span className="text-right">
                    <span className="tabular block text-sm font-semibold">{formatMoney(b.netPence)}</span>
                    <Badge tone={done ? "good" : statusTone[b.status]} className="mt-0.5">
                      {done ? "posted" : b.status}
                    </Badge>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
        <p className="mt-3 border-t border-hair pt-3 text-xs text-muted">
          Xero stays the ledger. Bills keep being entered in Xero as today, or scanned here; either way they&apos;re matched to an order and cost code before they reach the job cost.
        </p>
      </Card>

      <InvoiceReview
        key={selected.id}
        bill={selected}
        postedBy={posted[selected.id]}
        onPost={() => setPosted((p) => ({ ...p, [selected.id]: "Rhian Howells, 20 Oct 16:51" }))}
      />
    </div>
  );
}

function InvoiceReview({ bill, postedBy, onPost }: { bill: XeroBill; postedBy?: string; onPost: () => void }) {
  const doc = docFor(bill);
  const po = purchaseOrders.find((p) => p.ref === bill.poRef);
  const varianceLine = doc.lines.find((l) => l.orderRatePence && l.orderRatePence !== l.ratePence);
  const variancePence = varianceLine ? Math.round(varianceLine.qty * (varianceLine.ratePence - varianceLine.orderRatePence!)) : 0;

  const fields: { key: string; label: string; value: string; warn?: boolean }[] = [
    { key: "supplier", label: "Supplier", value: bill.supplier },
    { key: "date", label: "Invoice date", value: `${bill.date} 2026` },
    { key: "no", label: "Invoice no.", value: bill.invoiceNo },
    { key: "net", label: "Net", value: formatMoney(bill.netPence, { pence: true }) },
    { key: "vat", label: "VAT (20%)", value: formatMoney(bill.vatPence, { pence: true }) },
    { key: "po", label: "PO match", value: po ? `${po.ref} · ${formatMoney(po.valuePence)} order` : "No purchase order", warn: !po },
    { key: "code", label: "Project / cost code", value: bill.projectId ? `${projectById(bill.projectId)?.name} · ${bill.costCode}` : "Suggested: Goytre Grange · GEN-01", warn: !bill.costCode },
  ];
  const [confirmed, setConfirmed] = useState<Record<string, boolean>>(() => (bill.status === "matched" ? Object.fromEntries(fields.map((f) => [f.key, true])) : {}));
  const allConfirmed = fields.every((f) => confirmed[f.key]);

  return (
    <Card title={bill.source === "Scanned (AI)" ? "AI invoice extraction · review" : "Bill from Xero · review"}>
      <div className="grid gap-4 lg:grid-cols-2">
        {/* The document as received */}
        <div className="rounded-lg border border-hair bg-white p-4 font-mono text-[11px] leading-relaxed text-[#1f1f1f] shadow-inner" aria-label="Supplier invoice document">
          <div className="flex justify-between gap-2 border-b border-[#ddd] pb-2">
            <div>
              <div className="font-sans text-sm font-bold">{bill.supplier}</div>
              <div className="text-[#666]">{doc.supplierAddress}</div>
              <div className="text-[#666]">VAT {doc.supplierVat}</div>
            </div>
            <div className="text-right">
              <div className="font-sans text-sm font-bold">INVOICE</div>
              <div>{bill.invoiceNo}</div>
              <div>{bill.date} 2026</div>
            </div>
          </div>
          <div className="mt-2 text-[#666]">
            To: Bespoke Construction &amp; Joinery Solutions Ltd
            <br />
            Your order: {bill.poRef ?? "—"}
          </div>
          <table className="mt-3 w-full">
            <thead>
              <tr className="border-b border-[#ddd] text-left">
                <th className="py-1 font-semibold">Item</th>
                <th className="py-1 text-right font-semibold">Qty</th>
                <th className="py-1 text-right font-semibold">Rate</th>
                <th className="py-1 text-right font-semibold">Total</th>
              </tr>
            </thead>
            <tbody>
              {doc.lines.map((l, i) => (
                <tr key={i} className={cn("border-b border-[#eee] align-top", !!l.orderRatePence && l.orderRatePence !== l.ratePence && "bg-[#fdeceb]")}>
                  <td className="py-1 pr-2">{l.description}</td>
                  <td className="py-1 text-right">
                    {l.qty} {l.unit}
                  </td>
                  <td className="py-1 text-right">{formatMoney(l.ratePence, { pence: true })}</td>
                  <td className="py-1 text-right">{formatMoney(lineTotal(l), { pence: true })}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mt-2 ml-auto w-44 space-y-0.5 text-right">
            <div>Net {formatMoney(bill.netPence, { pence: true })}</div>
            <div>VAT {formatMoney(bill.vatPence, { pence: true })}</div>
            <div className="font-bold">Total {formatMoney(bill.netPence + bill.vatPence, { pence: true })}</div>
          </div>
        </div>

        {/* What was read, each figure confirmed by a person */}
        <div className="flex flex-col gap-2">
          {bill.source === "Scanned (AI)" && <div className="text-xs text-muted">Read with {doc.confidencePct}% confidence. Every figure is confirmed by a person before it counts as cost.</div>}
          <ul className="flex flex-col gap-1.5">
            {fields.map((f) => (
              <li key={f.key}>
                <button
                  onClick={() => setConfirmed((c) => ({ ...c, [f.key]: !c[f.key] }))}
                  disabled={!!postedBy}
                  className={cn(
                    "flex w-full items-center gap-2 rounded-lg border px-3 py-2 text-left text-sm transition",
                    confirmed[f.key] ? "border-good/40 bg-good-soft" : "border-hair bg-surface-2 hover:border-lime",
                  )}
                  aria-pressed={!!confirmed[f.key]}
                >
                  {confirmed[f.key] ? <CheckCircle2 size={16} className="shrink-0 text-good" /> : <Circle size={16} className="shrink-0 text-muted" />}
                  <span className="w-32 shrink-0 text-xs text-muted">{f.label}</span>
                  <span className={cn("min-w-0 flex-1 font-semibold", f.warn ? "text-warn" : "text-ink")}>{f.value}</span>
                </button>
              </li>
            ))}
          </ul>

          {variancePence > 0 && varianceLine && (
            <div className="flex items-start gap-2 rounded-lg border border-bad/30 bg-bad-soft px-3 py-2 text-xs text-bad">
              <AlertTriangle size={14} className="mt-0.5 shrink-0" />
              <span>
                Price variance: invoiced at {formatMoney(varianceLine.ratePence, { pence: true })}/{varianceLine.unit} against {formatMoney(varianceLine.orderRatePence!, { pence: true })}/
                {varianceLine.unit} on {bill.poRef} (+{(((varianceLine.ratePence - varianceLine.orderRatePence!) / varianceLine.orderRatePence!) * 100).toFixed(0)}%).{" "}
                <strong>{formatMoney(variancePence)} over order.</strong> Query with supplier or approve the difference.
              </span>
            </div>
          )}
          {!po && <AiNote>{bill.note}</AiNote>}
          {bill.status === "awaiting review" && bill.note && <AiNote>{bill.note}</AiNote>}
          <div className="rounded-lg bg-surface-2 px-3 py-2 text-xs text-muted">
            Duplicate check: no other bill from {bill.supplier} with invoice {bill.invoiceNo} or the same net and date. ✓
          </div>

          {postedBy ? (
            <div className="rounded-lg bg-good-soft px-3 py-2 text-sm font-semibold text-good" role="status">
              Posted to Xero as an approved bill, confirmed by {postedBy}. Payment status will flow back to the job cost.
            </div>
          ) : (
            <Button onClick={onPost} disabled={!allConfirmed} className="self-start">
              Confirm &amp; post to Xero
            </Button>
          )}
          {!postedBy && !allConfirmed && <div className="text-[11px] text-muted">Tick each field to confirm it before posting.</div>}
        </div>
      </div>
    </Card>
  );
}
