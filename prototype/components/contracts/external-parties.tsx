"use client";

import { useState } from "react";
import { UserPlus, X } from "lucide-react";
import { Badge, Button, Card } from "@/components/ui";
import { cn } from "@/lib/cn";
import type { ExternalParty } from "@/lib/mock/data";

const roleAccess: Record<ExternalParty["role"], string[]> = {
  "Client QS": ["Applications & valuations", "Variations", "Payment notices"],
  Architect: ["Drawings", "RFIs", "Instructions"],
  Client: ["Progress photos", "Programme", "Handover pack"],
  "Structural engineer": ["Drawings", "RFIs"],
};

export function ExternalParties({ initial }: { initial: ExternalParty[] }) {
  const [parties, setParties] = useState(initial);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [org, setOrg] = useState("");
  const [role, setRole] = useState<ExternalParty["role"]>("Structural engineer");

  const invite = () => {
    if (!name.trim()) return;
    setParties((p) => [
      ...p,
      { name: name.trim(), organisation: org.trim() || "–", role, email: "", sees: roleAccess[role], invited: "20 Oct 2026", status: "invited" },
    ]);
    setName("");
    setOrg("");
    setOpen(false);
  };

  return (
    <Card
      title="C · External parties"
      action={
        <Button variant="secondary" className="px-3 py-1" onClick={() => setOpen(true)}>
          <UserPlus size={13} /> Invite
        </Button>
      }
    >
      <p className="mb-3 text-sm text-muted">
        Consultants and the client get a secure, project-only view. They see only what their role allows, and every view and download is audited.
      </p>
      <ul className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {parties.map((p) => (
          <li key={p.name} className="rounded-lg border border-hair bg-surface-2 p-3">
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="font-semibold">{p.name}</div>
                <div className="text-xs text-muted">
                  {p.role} · {p.organisation}
                </div>
              </div>
              <Badge tone={p.status === "active" ? "good" : "warn"}>{p.status}</Badge>
            </div>
            <div className="mt-2 flex flex-wrap gap-1">
              {p.sees.map((s) => (
                <span key={s} className="rounded bg-surface px-1.5 py-0.5 text-[11px] text-muted ring-1 ring-hair">
                  {s}
                </span>
              ))}
            </div>
            <div className="mt-2 text-[11px] text-muted">Invited {p.invited}</div>
          </li>
        ))}
      </ul>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <button className="absolute inset-0 bg-black/40" aria-label="Close" onClick={() => setOpen(false)} />
          <div role="dialog" aria-modal="true" aria-label="Invite external party" className="relative w-full max-w-md rounded-2xl border border-hair bg-surface p-5 shadow-2xl">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="heading text-sm">Invite to Goytre Grange</h3>
              <button onClick={() => setOpen(false)} aria-label="Close" className="text-muted hover:text-ink">
                <X size={16} />
              </button>
            </div>
            <label className="mb-2 block text-xs font-semibold text-muted">
              Name
              <input value={name} onChange={(e) => setName(e.target.value)} className="mt-1 w-full rounded-lg border border-hair bg-surface-2 px-3 py-2 text-sm text-ink outline-none focus:border-lime" />
            </label>
            <label className="mb-2 block text-xs font-semibold text-muted">
              Organisation
              <input value={org} onChange={(e) => setOrg(e.target.value)} className="mt-1 w-full rounded-lg border border-hair bg-surface-2 px-3 py-2 text-sm text-ink outline-none focus:border-lime" />
            </label>
            <div className="mb-3 text-xs font-semibold text-muted">Role</div>
            <div className="mb-3 flex flex-wrap gap-1.5">
              {(Object.keys(roleAccess) as ExternalParty["role"][]).map((r) => (
                <button
                  key={r}
                  onClick={() => setRole(r)}
                  className={cn("rounded-full px-3 py-1 text-xs font-semibold", role === r ? "bg-ink text-bg" : "border border-hair bg-surface-2 text-muted")}
                >
                  {r}
                </button>
              ))}
            </div>
            <div className="mb-4 text-xs text-muted">Will see: {roleAccess[role].join(", ")}</div>
            <div className="flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button onClick={invite} disabled={!name.trim()}>
                Send invite
              </Button>
            </div>
            <p className="mt-3 text-[11px] text-muted">Production: invited as an Entra External ID guest, scoped to this project only.</p>
          </div>
        </div>
      )}
    </Card>
  );
}
