"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { CheckCircle2, Circle, Eye, FileSpreadsheet, Loader2, Sparkles, Trophy } from "lucide-react";
import { AiNote, Badge, Button, Card, IntegrationTag, RagDot, Table, Tabs, Td, Th } from "@/components/ui";
import { cn } from "@/lib/cn";
import type { Bidder, LibraryItem, Supplier, TenderPackage } from "@/lib/mock/data";
import { formatMoney, pct } from "@/lib/money";

type Tab = "package" | "letter" | "scope" | "documents" | "invitees" | "analysis" | "adjudication";

const variables: Record<string, (p: TenderPackage) => string> = {
  "{project.name}": (p) => p.project,
  "{site.address}": () => "The Old Forge, Bridge Street, Usk NP15 1BQ",
  "{package.name}": (p) => p.name,
  "{package.ref}": (p) => p.ref,
  "{return.deadline}": (p) => `12:00 on ${p.returnDeadline}`,
  "{rfi.deadline}": (p) => p.rfiDeadline,
  "{bcjs.contact}": () => "Lucy Milne, Business Operations & Development Manager",
};

const aiDraft = `Dear Sir/Madam,

{project.name} – {package.name} ({package.ref})

You are invited to tender for the above sub-contract works at {site.address}, in accordance with the enclosed scope of works, design responsibility matrix, schedule of attendances, payment schedule and drawings.

Please return your priced schedule using the enclosed Excel return, so that all tenders can be compared on the same basis. Any items you believe are missing should be entered as unlisted items, and any qualifications entered on the qualifications tab rather than in a covering letter.

Queries must be raised through the tender portal by {rfi.deadline}. Your completed tender must be returned by {return.deadline}.

Yours faithfully,
{bcjs.contact}
Bespoke Construction & Joinery Solutions Ltd`;

const resolve = (text: string, p: TenderPackage) => Object.entries(variables).reduce((t, [k, fn]) => t.split(k).join(fn(p)), text);

function LetterTab({ pkg }: { pkg: TenderPackage }) {
  const [text, setText] = useState("Dear Sir/Madam,\n\n");
  const [busy, setBusy] = useState(false);
  const ref = useRef<HTMLTextAreaElement>(null);

  const insert = (v: string) => {
    const el = ref.current;
    const at = el ? el.selectionStart : text.length;
    setText((t) => t.slice(0, at) + v + t.slice(at));
  };

  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <Card title="Enquiry letter (from Library: Subcontract enquiry letter)">
        <div className="mb-2 flex flex-wrap gap-1.5">
          {Object.keys(variables).map((v) => (
            <button
              key={v}
              draggable
              onDragStart={(e) => e.dataTransfer.setData("text/plain", v)}
              onClick={() => insert(v)}
              className="cursor-grab rounded-md border border-lime/50 bg-accent-soft px-2 py-0.5 font-mono text-[11px] text-accent-ink"
              title="Drag into the letter, or click to insert"
            >
              {v}
            </button>
          ))}
        </div>
        <textarea
          ref={ref}
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={16}
          className="w-full rounded-lg border border-hair bg-surface-2 p-3 font-mono text-xs leading-relaxed text-ink outline-none focus:border-lime"
          aria-label="Letter text with variables"
        />
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <Button
            onClick={() => {
              setBusy(true);
              setTimeout(() => {
                setText(aiDraft);
                setBusy(false);
              }, 900);
            }}
          >
            {busy ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />} Draft with AI
          </Button>
          <span className="text-xs text-muted">Variables are filled from the project record. Nothing is sent until you press send.</span>
        </div>
      </Card>
      <Card title="Preview, as the bidder sees it">
        <div className="whitespace-pre-wrap rounded-lg border border-hair bg-surface p-4 text-sm leading-relaxed">{resolve(text, pkg)}</div>
      </Card>
    </div>
  );
}

function ScopeTab({ scope, drm, attendances, payment }: { scope: LibraryItem; drm: LibraryItem; attendances: LibraryItem; payment: LibraryItem }) {
  const drmRows = [
    ["Frame structural design", "Engineer", "Subcontractor"],
    ["Connection details & pegging", "Subcontractor", "Subcontractor"],
    ["Listed building consent conditions", "Architect", "BCJS"],
    ["Temporary works & propping", "Subcontractor", "Subcontractor"],
    ["Crane lift plan & appointed person", "BCJS", "BCJS"],
  ];
  return (
    <div className="grid gap-5 lg:grid-cols-2">
      {[
        { label: "Scope of works", item: scope },
        { label: "Schedule of attendances", item: attendances },
        { label: "Payment schedule", item: payment },
      ].map(({ label, item }) => (
        <Card key={label} title={label} action={<Badge tone="accent">From Library</Badge>}>
          <div className="font-semibold">{item.name}</div>
          <div className="text-sm text-muted">{item.description}</div>
          <div className="mt-2 text-xs text-muted">
            {item.count} {item.countLabel} · owner {item.owner} · version {item.updated}
          </div>
        </Card>
      ))}
      <Card title={`Design responsibility matrix · ${drm.name}`} className="lg:col-span-2">
        <Table>
          <thead>
            <tr>
              <Th>Activity</Th>
              <Th>Design by</Th>
              <Th>Delivered by</Th>
            </tr>
          </thead>
          <tbody>
            {drmRows.map(([a, d, b]) => (
              <tr key={a}>
                <Td>{a}</Td>
                <Td>{d}</Td>
                <Td>{b}</Td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card>
    </div>
  );
}

function bidTotals(pkg: TenderPackage, i: number, b: Bidder) {
  const base = pkg.lines.reduce((a, l) => a + l.pricesPence[i], 0);
  return { base, adjusted: base + b.unlistedPence + b.normalisationPence };
}

function AnalysisTab({ pkg, onWinner, winner }: { pkg: TenderPackage; winner: number | null; onWinner: (i: number) => void }) {
  const steps = ["Pricing schedule", "Unlisted items", "Pricing qualifications", "Standard qualifications"];
  const [step, setStep] = useState(pkg.lines.length ? steps.length : -1);
  const [ordered, setOrdered] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const running = step >= 0 && step < steps.length;
  const done = step >= steps.length;
  const bidders = pkg.bidders.map((b, i) => ({ b, i })).filter(({ b }) => b.returned);

  if (!pkg.lines.length)
    return (
      <Card>
        <p className="text-sm text-muted">
          No returns yet. {pkg.bidders.filter((b) => b.portalOpened).length} of {pkg.bidders.length} bidders have opened the package in the portal. Returns are due {pkg.returnDeadline}.
        </p>
      </Card>
    );

  const run = () => {
    setStep(0);
    steps.forEach((_, k) => setTimeout(() => setStep(k + 1), 700 * (k + 1)));
  };
  const totals = bidders.map(({ b, i }) => ({ i, ...bidTotals(pkg, i, b) }));
  const lowest = totals.reduce((a, t) => (t.adjusted < a.adjusted ? t : a), totals[0]);
  const win = winner !== null ? totals.find((t) => t.i === winner) : null;
  const buyOut = win ? Math.round((win.adjusted * 975) / 1000) : 0;
  const flash = (m: string) => {
    setToast(m);
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <>
      <Card className="mb-4">
        <div className="flex flex-wrap items-center gap-3">
          <Sparkles size={16} className="text-lime-dk" />
          <div className="min-w-0 flex-1">
            <div className="text-sm font-semibold">AI tender analysis</div>
            <div className="mt-1 flex flex-wrap gap-3 text-xs text-muted">
              {steps.map((s, k) => (
                <span key={s} className="inline-flex items-center gap-1">
                  {step > k ? <CheckCircle2 size={13} className="text-good" /> : step === k ? <Loader2 size={13} className="animate-spin" /> : <Circle size={13} />}
                  {s}
                </span>
              ))}
            </div>
          </div>
          <Button variant="secondary" onClick={run} disabled={running}>
            {done ? "Re-run analysis" : "Run analysis"}
          </Button>
        </div>
      </Card>

      {done && (
        <>
          <Table className="mb-4">
            <thead>
              <tr>
                <Th>Line</Th>
                {bidders.map(({ b }) => (
                  <Th key={b.name} right>
                    {b.name}
                  </Th>
                ))}
                <Th>AI note</Th>
              </tr>
            </thead>
            <tbody>
              {pkg.lines.map((l) => (
                <tr key={l.item}>
                  <Td>
                    <span className="inline-flex items-center gap-2">
                      <RagDot rag={l.rag} /> {l.item}
                    </span>
                  </Td>
                  {bidders.map(({ i }) => (
                    <Td key={i} right className={cn(l.pricesPence[i] === 0 && "text-bad")}>
                      {l.pricesPence[i] === 0 ? "Excluded" : formatMoney(l.pricesPence[i])}
                    </Td>
                  ))}
                  <Td className="text-xs text-muted">{l.note ?? "Within range"}</Td>
                </tr>
              ))}
              {(
                [
                  ["Base bid", (t: (typeof totals)[number]) => formatMoney(t.base)],
                  ["Unlisted items", (t: (typeof totals)[number]) => formatMoney(pkg.bidders[t.i].unlistedPence)],
                  ["Normalisation (AI, for excluded scope)", (t: (typeof totals)[number]) => formatMoney(pkg.bidders[t.i].normalisationPence)],
                ] as const
              ).map(([label, fn]) => (
                <tr key={label} className="bg-surface-2">
                  <Td className="font-semibold">{label}</Td>
                  {totals.map((t) => (
                    <Td key={t.i} right>
                      {fn(t)}
                    </Td>
                  ))}
                  <Td />
                </tr>
              ))}
              <tr className="bg-accent-soft">
                <Td className="font-bold">Adjusted base bid</Td>
                {totals.map((t) => (
                  <Td key={t.i} right className="font-bold">
                    {formatMoney(t.adjusted)} {t.i === lowest.i && <Badge tone="good">lowest</Badge>}
                  </Td>
                ))}
                <Td />
              </tr>
            </tbody>
          </Table>

          <div className="mb-4 grid gap-4 lg:grid-cols-2">
            {bidders.map(({ b, i }) => (
              <Card key={b.name} title={`${b.name} · qualifications`}>
                <div className="text-xs font-semibold text-muted">Pricing qualifications</div>
                <ul className="mb-2 list-disc pl-5 text-sm">{b.pricingQuals.length ? b.pricingQuals.map((q) => <li key={q}>{q}</li>) : <li className="text-muted">None</li>}</ul>
                <div className="text-xs font-semibold text-muted">Standard qualifications</div>
                <ul className="list-disc pl-5 text-sm">{b.standardQuals.map((q) => <li key={q}>{q}</li>)}</ul>
                <div className="mt-3">
                  {winner === i ? (
                    <Badge tone="good">
                      <Trophy size={12} /> Selected winner
                    </Badge>
                  ) : (
                    <Button variant="secondary" onClick={() => onWinner(i)} disabled={winner !== null}>
                      Select winner
                    </Button>
                  )}
                </div>
              </Card>
            ))}
          </div>

          <Card
            title={`Tender queries raised by AI (${pkg.tqs.length})`}
            action={
              <Button variant="secondary" onClick={() => flash(`${pkg.ref}-TQs.xlsx downloaded. Bidders answer in the same format, then re-upload.`)}>
                <FileSpreadsheet size={14} /> Export to Excel
              </Button>
            }
            className="mb-4"
          >
            <ul className="divide-y divide-hair">
              {pkg.tqs.map((q) => (
                <li key={q.ref} className="flex flex-wrap items-start gap-2 py-2 text-sm">
                  <RagDot rag={q.rag} className="mt-1.5" />
                  <span className="font-mono text-[11px] text-muted">{q.ref}</span>
                  <span className="font-semibold">{q.bidder}</span>
                  <span className="min-w-0 flex-1 basis-full sm:basis-auto">{q.query}</span>
                  {q.valuePence && <span className="tabular text-xs text-muted">normalised {formatMoney(q.valuePence)}</span>}
                </li>
              ))}
            </ul>
            <AiNote className="mt-2">Queries are drafted for the QS to check. Nothing goes to a bidder until it is sent from the portal.</AiNote>
          </Card>

          {win && (
            <Card title="Award">
              <div className="grid gap-3 sm:grid-cols-3">
                <div>
                  <div className="text-xs text-muted">Awarded (adjusted bid)</div>
                  <div className="tabular text-xl font-bold">{formatMoney(win.adjusted)}</div>
                </div>
                <div>
                  <div className="text-xs text-muted">Buy-out target (−2.5%)</div>
                  <div className="tabular text-xl font-bold text-good">{formatMoney(buyOut)}</div>
                </div>
                <div>
                  <div className="text-xs text-muted">Against estimate budget</div>
                  <div className={cn("tabular text-xl font-bold", win.adjusted > pkg.budgetPence ? "text-bad" : "text-good")}>
                    {win.adjusted > pkg.budgetPence ? "+" : "−"}
                    {formatMoney(Math.abs(win.adjusted - pkg.budgetPence))}
                  </div>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap items-center gap-2">
                {ordered ? (
                  <>
                    <Badge tone="good">Subcontract order SO-0412 created · commitment on the purchase ledger</Badge>
                    <Link href="/procurement" className="text-xs font-semibold text-accent-ink hover:underline">
                      Open in Orders &amp; Xero →
                    </Link>
                  </>
                ) : (
                  <Button onClick={() => setOrdered(true)}>Create subcontract order</Button>
                )}
              </div>
              <p className="mt-2 text-xs text-muted">The order carries the tender documents, DRM, attendances, payment schedule, retention, CIS and reverse-charge VAT settings into the subcontract.</p>
            </Card>
          )}
        </>
      )}
      {toast && (
        <div role="status" className="fixed bottom-16 left-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 rounded-xl bg-night px-4 py-3 text-sm text-white shadow-xl">
          {toast}
        </div>
      )}
    </>
  );
}

function AdjudicationTab({ pkg, winner }: { pkg: TenderPackage; winner: number | null }) {
  const returned = pkg.bidders.map((b, i) => ({ b, i })).filter(({ b }) => b.returned);
  const lowestCost = returned.length ? Math.min(...returned.map(({ b, i }) => bidTotals(pkg, i, b).adjusted)) : pkg.budgetPence;
  const cost = winner !== null ? bidTotals(pkg, winner, pkg.bidders[winner]).adjusted : lowestCost;
  const [adj, setAdj] = useState(-2.5);
  const [margin, setMargin] = useState(7.5);
  const [pushed, setPushed] = useState(false);
  // One rounding point for the adjudicated sell price.
  const sell = Math.round(cost * (1 + adj / 100) * (1 + margin / 100));

  return (
    <Card title="Adjudication">
      <Table>
        <thead>
          <tr>
            <Th>Package</Th>
            <Th right>Market price</Th>
            <Th right>Adjustment %</Th>
            <Th right>Margin %</Th>
            <Th right>Adjudicated sell</Th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <Td>
              {pkg.code} · {pkg.name}
              <div className="text-xs text-muted">{winner !== null ? "winning bid" : returned.length ? "lowest adjusted bid" : "estimate budget (no returns yet)"}</div>
            </Td>
            <Td right>{formatMoney(cost)}</Td>
            <Td right>
              <input type="number" step={0.5} value={adj} onChange={(e) => setAdj(Number(e.target.value))} className="w-20 rounded border border-hair bg-surface-2 px-2 py-1 text-right text-sm" aria-label="Adjustment percent" />
            </Td>
            <Td right>
              <input type="number" step={0.5} value={margin} onChange={(e) => setMargin(Number(e.target.value))} className="w-20 rounded border border-hair bg-surface-2 px-2 py-1 text-right text-sm" aria-label="Margin percent" />
            </Td>
            <Td right className="font-bold">
              {formatMoney(sell)}
            </Td>
          </tr>
        </tbody>
      </Table>
      <p className="mt-2 text-xs text-muted">
        Note: &quot;{pct(adj)} for anticipated better buying&quot;. Every adjustment is recorded with who made it and why.
      </p>
      <div className="mt-3">
        {pushed ? <Badge tone="good">Pushed to {pkg.estimateRef} · {pkg.code} package now {formatMoney(sell)}</Badge> : <Button onClick={() => setPushed(true)}>Push to estimate</Button>}
      </div>
    </Card>
  );
}

export function TenderPackageView({
  pkg,
  scope,
  drm,
  attendances,
  payment,
  tradeSuppliers,
}: {
  pkg: TenderPackage;
  scope: LibraryItem;
  drm: LibraryItem;
  attendances: LibraryItem;
  payment: LibraryItem;
  tradeSuppliers: Supplier[];
}) {
  const [tab, setTab] = useState<Tab>(pkg.lines.length ? "analysis" : "package");
  const [winner, setWinner] = useState<number | null>(null);
  const invitedNames = new Set(pkg.bidders.map((b) => b.name));

  return (
    <>
      <Tabs<Tab>
        value={tab}
        onChange={setTab}
        tabs={[
          { key: "package", label: "Package" },
          { key: "letter", label: "Letter" },
          { key: "scope", label: "Scope, DRM & terms" },
          { key: "documents", label: "Documents", count: pkg.documents.length },
          { key: "invitees", label: "Invitees", count: pkg.bidders.length },
          { key: "analysis", label: "Analysis" },
          { key: "adjudication", label: "Adjudication" },
        ]}
      />

      {tab === "package" && (
        <div className="grid gap-4 md:grid-cols-3">
          {[
            ["Issued", pkg.issued],
            ["RFI deadline", pkg.rfiDeadline],
            ["Return deadline", `12:00, ${pkg.returnDeadline}`],
            ["Estimate budget", formatMoney(pkg.budgetPence)],
            ["Pricing schedule", `${pkg.code} package from ${pkg.estimateRef}, sent as a locked Excel return`],
            ["Portal", "Bidders download the pack, raise RFIs and upload returns in one place"],
          ].map(([k, v]) => (
            <Card key={k}>
              <div className="text-[11px] font-semibold uppercase tracking-[0.1em] text-muted">{k}</div>
              <div className="mt-1 text-sm font-semibold">{v}</div>
            </Card>
          ))}
        </div>
      )}

      {tab === "letter" && <LetterTab pkg={pkg} />}
      {tab === "scope" && <ScopeTab scope={scope} drm={drm} attendances={attendances} payment={payment} />}

      {tab === "documents" && (
        <Card title="Enquiry documents" action={<IntegrationTag system="SharePoint">current revisions only</IntegrationTag>}>
          <Table>
            <thead>
              <tr>
                <Th>Number</Th>
                <Th>Title</Th>
                <Th>Revision</Th>
              </tr>
            </thead>
            <tbody>
              {pkg.documents.map((d) => (
                <tr key={d.number}>
                  <Td className="font-mono text-xs">{d.number}</Td>
                  <Td>{d.title}</Td>
                  <Td>
                    <Badge tone="accent">Rev {d.revision}</Badge>
                  </Td>
                </tr>
              ))}
            </tbody>
          </Table>
          <p className="mt-2 text-xs text-muted">If a drawing is superseded after issue, bidders are sent an addendum automatically.</p>
        </Card>
      )}

      {tab === "invitees" && (
        <div className="grid gap-4 lg:grid-cols-2">
          <Card title="Invited">
            <ul className="divide-y divide-hair">
              {pkg.bidders.map((b) => (
                <li key={b.name} className="flex flex-wrap items-center gap-2 py-2 text-sm">
                  <span className="font-semibold">{b.name}</span>
                  <span className="ml-auto inline-flex items-center gap-1 text-xs text-muted">
                    <Eye size={12} /> {b.portalOpened ? `opened ${b.portalOpened}` : "not opened"}
                  </span>
                  <Badge tone={b.returned ? "good" : "warn"}>{b.returned ? "returned" : "awaiting"}</Badge>
                </li>
              ))}
            </ul>
          </Card>
          <Card title={`Supplier register · ${pkg.trade}`}>
            <ul className="divide-y divide-hair">
              {tradeSuppliers.map((s) => (
                <li key={s.id} className="flex flex-wrap items-center gap-2 py-2 text-sm">
                  <span>{s.name}</span>
                  <span className="text-xs text-muted">{s.trade}</span>
                  <span className="ml-auto">
                    {invitedNames.has(s.name) ? (
                      <Badge tone="accent">invited</Badge>
                    ) : s.status === "expired" ? (
                      <Badge tone="bad">insurance expired · can&apos;t invite</Badge>
                    ) : (
                      <Badge>available</Badge>
                    )}
                  </span>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      )}

      {tab === "analysis" && <AnalysisTab pkg={pkg} winner={winner} onWinner={setWinner} />}
      {tab === "adjudication" && <AdjudicationTab pkg={pkg} winner={winner} />}
    </>
  );
}
