"use client";

import { useEffect, useState } from "react";
import { Check, FileText, Upload } from "lucide-react";
import { AiNote, Badge, Button, Card, IntegrationTag, Progress, Table, Td, Th } from "@/components/ui";
import { cn } from "@/lib/cn";
import type { MainContract as MainContractData } from "@/lib/mock/data";
import { formatMoney } from "@/lib/money";
import { type CycleField, cycleLabels, formatDay, generateCycles, isoToDate, nextEvent } from "./cycles";

const steps = ["Reading 46 pages", "Identifying contract form", "Extracting particulars", "Mapping payment clauses", "Checking against the Construction Act"];

export function MainContract({ contract, todayIso }: { contract: MainContractData; todayIso: string }) {
  const [phase, setPhase] = useState<"idle" | "extracting" | "review">("idle");
  const [step, setStep] = useState(0);
  const [verified, setVerified] = useState<Record<string, boolean>>({});
  const [cyclesOn, setCyclesOn] = useState(false);

  useEffect(() => {
    if (phase !== "extracting") return;
    if (step >= steps.length) {
      setPhase("review");
      return;
    }
    const t = setTimeout(() => setStep((s) => s + 1), 650);
    return () => clearTimeout(t);
  }, [phase, step]);

  const allVerified = contract.terms.every((t) => verified[t.label]);
  const today = isoToDate(todayIso);
  const cycles = generateCycles(contract);
  const next = nextEvent(cycles, today);
  const fields = Object.keys(cycleLabels) as CycleField[];
  const retentionPence = Math.round((contract.contractSumPence * contract.retentionPct) / 100);

  return (
    <Card title="A · Main contract">
      {phase === "idle" && (
        <div className="flex flex-col items-start gap-3 rounded-lg border border-dashed border-hair bg-surface-2 p-5">
          <div className="flex items-center gap-2 text-sm">
            <FileText size={16} className="text-muted" />
            <span className="font-semibold">{contract.fileName}</span>
            <span className="text-muted">· {contract.pages} pages · from SharePoint › Contracts</span>
          </div>
          <p className="text-sm text-muted">Upload the signed contract. The AI reads the particulars and payment clauses; a person verifies each term before anything is used.</p>
          <Button
            onClick={() => {
              setStep(0);
              setPhase("extracting");
            }}
          >
            <Upload size={14} /> Read contract
          </Button>
        </div>
      )}

      {phase === "extracting" && (
        <div className="rounded-lg border border-hair bg-surface-2 p-5" aria-live="polite">
          <div className="mb-2 text-sm font-semibold">Reading {contract.form}…</div>
          <Progress value={(step / steps.length) * 100} />
          <ul className="mt-3 space-y-1 text-xs">
            {steps.map((s, i) => (
              <li key={s} className={cn(i < step ? "text-good" : i === step ? "text-ink" : "text-muted")}>
                {i < step ? "✓" : i === step ? "…" : "·"} {s}
              </li>
            ))}
          </ul>
        </div>
      )}

      {phase === "review" && (
        <>
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <Badge tone="accent">{contract.form}</Badge>
            <IntegrationTag system="SharePoint">{contract.fileName}</IntegrationTag>
            <IntegrationTag system="Claude">extracted, awaiting verification</IntegrationTag>
          </div>
          <AiNote className="mb-3">
            {contract.terms.length} key terms extracted, each with the clause it came from. Verify each one: unverified terms are never used to set payment dates or retention.
          </AiNote>
          <Table>
            <thead>
              <tr>
                <Th>Term</Th>
                <Th>Extracted value</Th>
                <Th>Source</Th>
                <Th right>Verified</Th>
              </tr>
            </thead>
            <tbody>
              {contract.terms.map((t) => (
                <tr key={t.label}>
                  <Td className="font-semibold">{t.label}</Td>
                  <Td>{t.value}</Td>
                  <Td className="text-xs text-muted">{t.clause}</Td>
                  <Td right>
                    <button
                      onClick={() => setVerified((v) => ({ ...v, [t.label]: !v[t.label] }))}
                      aria-pressed={!!verified[t.label]}
                      aria-label={`Verify ${t.label}`}
                      className={cn(
                        "inline-flex h-7 w-7 items-center justify-center rounded-full border",
                        verified[t.label] ? "border-good bg-good text-white" : "border-hair bg-surface text-muted hover:border-good",
                      )}
                    >
                      <Check size={14} />
                    </button>
                  </Td>
                </tr>
              ))}
            </tbody>
          </Table>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <Button variant="secondary" onClick={() => setVerified(Object.fromEntries(contract.terms.map((t) => [t.label, true])))}>
              Verify all as Lucy Milne
            </Button>
            <Button onClick={() => setCyclesOn(true)} disabled={!allVerified}>
              Generate payment cycles
            </Button>
            {!allVerified && <span className="text-xs text-muted">Verify every term to generate cycles.</span>}
          </div>
        </>
      )}

      {cyclesOn && (
        <div className="mt-5">
          <div className="mb-2 flex flex-wrap items-baseline justify-between gap-2">
            <h3 className="heading text-sm">Construction Act payment cycles</h3>
            <span className="text-xs text-muted">
              Retention {contract.retentionPct}% · {formatMoney(retentionPence)} on the contract sum · half released at practical completion
            </span>
          </div>
          {next && (
            <div className="mb-3 rounded-lg border border-warn/50 bg-warn-soft px-3 py-2 text-sm text-ink">
              Next deadline: <span className="font-bold">{next.label}</span>, cycle {next.cycle}, {formatDay(next.date)}
            </div>
          )}
          <Table>
            <thead>
              <tr>
                <Th>Cycle</Th>
                {fields.map((f) => (
                  <Th key={f}>{cycleLabels[f]}</Th>
                ))}
              </tr>
            </thead>
            <tbody>
              {cycles.map((c) => (
                <tr key={c.number}>
                  <Td className="font-semibold">{c.number}</Td>
                  {fields.map((f) => {
                    const isNext = next && next.cycle === c.number && next.field === f;
                    const past = c[f].getTime() < today.getTime();
                    return (
                      <Td key={f} className={cn("tabular whitespace-nowrap", past && "text-muted", isNext && "bg-warn-soft font-bold")}>
                        {formatDay(c[f])}
                      </Td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </Table>
          <p className="mt-2 text-xs text-muted">Dates are recalculated if a verified term changes. Reminders go to the QS in Teams two working days before each deadline.</p>
        </div>
      )}
    </Card>
  );
}
