"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Download, MessageSquareWarning, X } from "lucide-react";
import { cn } from "@/lib/cn";
import { useRole } from "./role-context";

// Sean §0: every page can report on itself; the report captures its own context.
interface Report {
  id: string;
  kind: "Fault" | "Change" | "Idea";
  text: string;
  page: string;
  role: string;
  at: string;
  status: "open";
}

const KEY = "bcjs-feedback";

function load(): Report[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "[]") as Report[];
  } catch {
    return [];
  }
}

export function FeedbackWidget() {
  const pathname = usePathname();
  const { role } = useRole();
  const [open, setOpen] = useState(false);
  const [kind, setKind] = useState<Report["kind"]>("Idea");
  const [text, setText] = useState("");
  const [reports, setReports] = useState<Report[]>([]);
  const [sent, setSent] = useState(false);

  useEffect(() => setReports(load()), [open]);

  const submit = () => {
    if (!text.trim()) return;
    const r: Report = { id: crypto.randomUUID(), kind, text: text.trim(), page: pathname, role, at: new Date().toISOString(), status: "open" };
    const next = [r, ...reports];
    setReports(next);
    try {
      localStorage.setItem(KEY, JSON.stringify(next));
    } catch {
      /* storage unavailable */
    }
    setText("");
    setSent(true);
    setTimeout(() => setSent(false), 2500);
  };

  const exportAll = () => {
    const blob = new Blob([JSON.stringify(reports, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "bcjs-prototype-feedback.json";
    a.click();
  };

  const here = reports.filter((r) => r.page === pathname);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-4 right-4 z-30 inline-flex items-center gap-1.5 rounded-full bg-night px-3.5 py-2 text-xs font-semibold text-white shadow-lg ring-1 ring-white/10 hover:bg-chrome"
      >
        <MessageSquareWarning size={14} className="text-lime" /> Feedback
        {here.length > 0 && <span className="rounded-full bg-lime px-1.5 text-[10px] font-bold text-night">{here.length}</span>}
      </button>
      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-end sm:p-4">
          <button className="absolute inset-0 bg-black/30" aria-label="Close feedback" onClick={() => setOpen(false)} />
          <div className="relative w-full max-w-sm rounded-t-2xl border border-hair bg-surface p-4 shadow-2xl sm:rounded-2xl">
            <div className="mb-3 flex items-center justify-between">
              <div>
                <div className="heading text-sm">Report on this page</div>
                <div className="font-mono text-[11px] text-muted">
                  {pathname} · viewing as {role}
                </div>
              </div>
              <button onClick={() => setOpen(false)} aria-label="Close" className="rounded p-1 text-muted hover:text-ink">
                <X size={16} />
              </button>
            </div>
            <div className="mb-2 flex gap-1.5">
              {(["Fault", "Change", "Idea"] as const).map((k) => (
                <button
                  key={k}
                  onClick={() => setKind(k)}
                  className={cn("rounded-full px-3 py-1 text-xs font-semibold", kind === k ? "bg-ink text-bg" : "border border-hair bg-surface-2 text-muted")}
                >
                  {k}
                </button>
              ))}
            </div>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={3}
              placeholder="What did you spot, or what should change?"
              className="w-full rounded-lg border border-hair bg-surface-2 p-2.5 text-sm text-ink outline-none focus:border-lime"
            />
            <div className="mt-2 flex items-center justify-between gap-2">
              <button onClick={exportAll} disabled={!reports.length} className="inline-flex items-center gap-1 text-xs text-muted hover:text-ink disabled:opacity-40">
                <Download size={13} /> Export all ({reports.length})
              </button>
              <button onClick={submit} className="rounded-full bg-lime px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-night hover:bg-lime-dk">
                {sent ? "Logged ✓" : "Submit"}
              </button>
            </div>
            {here.length > 0 && (
              <ul className="mt-3 max-h-40 space-y-1.5 overflow-y-auto border-t border-hair pt-3">
                {here.map((r) => (
                  <li key={r.id} className="rounded-lg bg-surface-2 px-2.5 py-1.5 text-xs">
                    <span className="font-semibold">{r.kind}</span> · <span className="text-muted">open</span>
                    <div className="text-ink">{r.text}</div>
                  </li>
                ))}
              </ul>
            )}
            <p className="mt-3 text-[11px] text-muted">Prototype: reports are kept in this browser. In production they become a tracked thread with replies on the page.</p>
          </div>
        </div>
      )}
    </>
  );
}
