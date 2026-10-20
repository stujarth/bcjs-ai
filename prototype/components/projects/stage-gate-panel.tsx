"use client";

import { useState } from "react";
import { Check, Lock, ShieldAlert, X } from "lucide-react";
import { Badge, Button, Card } from "@/components/ui";
import { roles, useRole } from "@/components/role-context";
import type { StageGate } from "@/lib/mock/types";

// Sean §3: the system can refuse, say why, and record who overruled it.
export function StageGatePanel({ gate }: { gate: StageGate }) {
  const { role } = useRole();
  const person = roles.find((r) => r.key === role)!;
  const blocked = gate.checks.filter((c) => !c.done);
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [override, setOverride] = useState<{ by: string; reason: string; at: string } | null>(null);

  const record = () => {
    if (reason.trim().length < 10) return;
    setOverride({ by: `${person.person} (${person.label})`, reason: reason.trim(), at: new Date().toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" }) });
    setOpen(false);
  };

  return (
    <Card
      title={`Stage gate · ${gate.from} → ${gate.to}`}
      action={
        override ? <Badge tone="warn">Overridden</Badge> : blocked.length ? <Badge tone="bad">Blocked: {blocked.length} items</Badge> : <Badge tone="good">Ready</Badge>
      }
      className="mb-5"
    >
      <ul className="mb-4 grid gap-1.5 sm:grid-cols-2">
        {gate.checks.map((c) => (
          <li key={c.label} className="flex items-start gap-2 rounded-lg bg-surface-2 px-3 py-2 text-sm">
            {c.done ? (
              <Check size={16} className="mt-0.5 shrink-0 text-good" aria-label="Done" />
            ) : (
              <X size={16} className="mt-0.5 shrink-0 text-bad" aria-label="Blocked" />
            )}
            <div>
              <div className={c.done ? "text-ink" : "font-semibold text-ink"}>{c.label}</div>
              {c.detail && <div className="text-xs text-muted">{c.detail}</div>}
            </div>
          </li>
        ))}
      </ul>

      {override ? (
        <div className="rounded-lg border border-warn/40 bg-warn-soft p-3 text-sm">
          <div className="flex items-center gap-1.5 font-semibold text-warn">
            <ShieldAlert size={15} /> Moved to {gate.to} by override, recorded in the audit log
          </div>
          <div className="mt-1 text-ink">&ldquo;{override.reason}&rdquo;</div>
          <div className="mt-1 font-mono text-[11px] text-muted">
            gate.override · {override.by} · {override.at} · appears on the override report
          </div>
        </div>
      ) : (
        <div className="flex flex-wrap items-center gap-3">
          <Button disabled={blocked.length > 0}>
            <Lock size={13} /> Move to {gate.to}
          </Button>
          {blocked.length > 0 && (
            <>
              <span className="text-xs text-muted">
                Blocked: {blocked.length} item{blocked.length > 1 ? "s" : ""} outstanding.
              </span>
              <Button variant="secondary" onClick={() => setOpen(true)}>
                Override with reason
              </Button>
            </>
          )}
        </div>
      )}

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <button className="absolute inset-0 bg-black/40" aria-label="Cancel override" onClick={() => setOpen(false)} />
          <div role="dialog" aria-modal="true" aria-labelledby="override-title" className="relative w-full max-w-md rounded-2xl border border-hair bg-surface p-5 shadow-2xl">
            <h3 id="override-title" className="heading mb-1 text-sm">
              Override the {gate.to} gate
            </h3>
            <p className="mb-3 text-sm text-muted">
              {blocked.length} check{blocked.length > 1 ? "s are" : " is"} still outstanding. The override is recorded against{" "}
              <strong className="text-ink">{person.person}</strong> ({person.label}) in the append-only audit log and appears on the override report.
            </p>
            <label className="mb-1 block text-xs font-semibold text-muted" htmlFor="override-reason">
              Reason (required)
            </label>
            <textarea
              id="override-reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
              placeholder="e.g. Client needs groundworks to start; RAMS sign-off booked for Monday before any frame lift."
              className="w-full rounded-lg border border-hair bg-surface-2 p-2.5 text-sm text-ink outline-none focus:border-lime"
            />
            <div className="mt-3 flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button onClick={record} disabled={reason.trim().length < 10}>
                Record override
              </Button>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
