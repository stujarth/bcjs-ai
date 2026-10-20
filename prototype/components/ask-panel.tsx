"use client";

import { useEffect, useRef, useState } from "react";
import { Send, Sparkles, X } from "lucide-react";
import { cn } from "@/lib/cn";
import { useRole } from "./role-context";

interface Msg {
  role: "user" | "assistant";
  text: string;
  tools?: string[];
  live?: boolean;
}

const suggestions = [
  "Which jobs are amber or red on cash next month?",
  "Show me the history of VO-114",
  "What's stopping Llanover Lodge from starting on site?",
  "Which POs are waiting for my approval?",
  "Summarise Goytre Grange's commercial position",
];

export function AskPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { role } = useRole();
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => endRef.current?.scrollIntoView({ behavior: "smooth" }), [messages, busy]);

  const ask = async (q: string) => {
    if (!q.trim() || busy) return;
    const history = [...messages, { role: "user" as const, text: q.trim() }];
    setMessages(history);
    setInput("");
    setBusy(true);
    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role, messages: history.map(({ role, text }) => ({ role, text })) }),
      });
      const data = (await res.json()) as { answer: string; tools?: string[]; live?: boolean };
      setMessages((m) => [...m, { role: "assistant", text: data.answer, tools: data.tools, live: data.live }]);
    } catch {
      setMessages((m) => [...m, { role: "assistant", text: "Sorry, I couldn't reach the assistant just now." }]);
    } finally {
      setBusy(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <button className="absolute inset-0 bg-black/40" aria-label="Close assistant" onClick={onClose} />
      <aside className="relative flex h-full w-full max-w-md flex-col border-l border-hair bg-surface shadow-2xl" aria-label="Ask BCJS assistant">
        <div className="flex items-center gap-2 bg-night-2 px-4 py-3 text-white">
          <Sparkles size={16} className="text-lime" />
          <div className="flex-1">
            <div className="text-sm font-bold uppercase tracking-wider">Ask BCJS</div>
            <div className="text-[11px] text-[#9aa39f]">Answers from the project record, scoped to your role ({role}). Read-only.</div>
          </div>
          <button onClick={onClose} aria-label="Close" className="rounded p-1 text-[#b8c0bc] hover:text-white">
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 space-y-3 overflow-y-auto p-4">
          {messages.length === 0 && (
            <div>
              <p className="mb-3 text-sm text-muted">Ask anything about live jobs, money, orders, compliance or the pipeline. Try:</p>
              <div className="flex flex-col gap-2">
                {suggestions.map((s) => (
                  <button key={s} onClick={() => ask(s)} className="rounded-lg border border-hair bg-surface-2 px-3 py-2 text-left text-sm text-ink hover:border-lime">
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}
          {messages.map((m, i) => (
            <div key={i} className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}>
              <div
                className={cn(
                  "max-w-[90%] whitespace-pre-wrap rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed",
                  m.role === "user" ? "bg-ink text-bg" : "border border-hair bg-surface-2 text-ink",
                )}
              >
                {m.text}
                {m.tools && m.tools.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1 border-t border-hair pt-2">
                    {m.tools.map((t, j) => (
                      <span key={j} className="rounded bg-accent-soft px-1.5 py-0.5 font-mono text-[10px] text-accent-ink">
                        {t}
                      </span>
                    ))}
                  </div>
                )}
                {m.role === "assistant" && m.live === false && <div className="mt-1.5 text-[10px] text-muted">Scripted demo answer (no API key set)</div>}
              </div>
            </div>
          ))}
          {busy && <div className="text-xs text-muted">Reading the project record…</div>}
          <div ref={endRef} />
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            ask(input);
          }}
          className="flex gap-2 border-t border-hair p-3"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about any job, order or number…"
            className="flex-1 rounded-full border border-hair bg-surface-2 px-4 py-2 text-sm text-ink outline-none focus:border-lime"
          />
          <button type="submit" disabled={busy} className="rounded-full bg-lime p-2.5 text-night disabled:opacity-50" aria-label="Send">
            <Send size={16} />
          </button>
        </form>
      </aside>
    </div>
  );
}
