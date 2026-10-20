"use client";

import { useState } from "react";
import { CheckCircle2, Sparkles } from "lucide-react";
import { AiNote, Badge, Button, Card } from "@/components/ui";
import { roles, useRole } from "@/components/role-context";

// Pre-written draft standing in for a Claude call over the BCJS RAMS library.
const draft = {
  title: "RAMS: Green oak frame lift & erection (mobile crane)",
  hazards: [
    "Crane overturning on soft garden ground",
    "Suspended loads and swinging frame members",
    "Working at height while pegging and bracing joints",
    "Manual handling of heavy green oak sections",
    "Members of the public or client family entering the lift zone",
  ],
  controls: [
    "Ground-bearing assessment by the crane supplier; outrigger mats sized to calculated bearing pressure",
    "Appointed person and lift plan (BS 7121); trained slinger/signaller on every lift",
    "Exclusion zone fenced and signed; client briefed and household kept clear during lifts",
    "Tag lines on all members; no one under suspended loads",
    "MEWP or podium steps for high-level pegging; harness clipped in MEWP baskets",
    "Two-person lifts for sections over 25kg; lifting aids where possible",
    "Lifts suspended when wind exceeds 20 mph at jib height (anemometer reading logged)",
  ],
  ppe: ["Hard hat", "Hi-vis vest", "Safety boots (S3)", "Rigger gloves", "Eye protection when drilling or pegging"],
  sequence: [
    "Pre-lift briefing; all operatives sign onto this RAMS in the site app",
    "Set up crane on mats; appointed person checks the set-up against the lift plan",
    "Lift and place sole plates and posts; temporary bracing fixed before the load is released",
    "Lift tie beams and principal rafters in the agreed order; peg joints from the MEWP",
    "Final bracing check by the frame carpenter, then the crane is signed off and stood down",
  ],
  emergency:
    "Nearest A&E: Nevill Hall Hospital, Abergavenny (approx. 12 min). First aider on site: D. Rowntree. Emergency stop signal agreed with the crane operator. Report all incidents in the OCS incident log the same day.",
};

export function RamsDrafter() {
  const { role } = useRole();
  const person = roles.find((r) => r.key === role)!;
  const [task, setTask] = useState("Lift and erect green oak frame using 25t mobile crane, 4 operatives, garden with soft ground");
  const [stage, setStage] = useState<"idle" | "thinking" | "drafted" | "signed">("idle");

  const generate = () => {
    setStage("thinking");
    setTimeout(() => setStage("drafted"), 900);
  };

  return (
    <Card title="AI RAMS drafter" action={<Badge tone="accent">Claude · BCJS RAMS library</Badge>}>
      <label htmlFor="rams-task" className="mb-1 block text-xs font-semibold text-muted">
        Describe the task in plain English
      </label>
      <textarea
        id="rams-task"
        value={task}
        onChange={(e) => {
          setTask(e.target.value);
          if (stage !== "idle") setStage("idle");
        }}
        rows={3}
        className="w-full rounded-lg border border-hair bg-surface-2 p-2.5 text-sm text-ink outline-none focus:border-lime"
      />
      <div className="mt-2 flex justify-end">
        <Button onClick={generate} disabled={!task.trim() || stage === "thinking"}>
          <Sparkles size={13} /> {stage === "thinking" ? "Drafting…" : "Generate draft"}
        </Button>
      </div>

      {(stage === "drafted" || stage === "signed") && (
        <div className="mt-4 space-y-4 border-t border-hair pt-4 text-sm">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="heading text-sm">{draft.title}</div>
            {stage === "signed" ? <Badge tone="good">Approved</Badge> : <Badge tone="accent">Draft (AI): not for use</Badge>}
          </div>
          <Section title="Hazards" items={draft.hazards} />
          <Section title="Controls" items={draft.controls} />
          <Section title="PPE" items={draft.ppe} />
          <div>
            <div className="mb-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">Sequence of work</div>
            <ol className="list-decimal space-y-1 pl-5">
              {draft.sequence.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ol>
          </div>
          <div>
            <div className="mb-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">Emergency arrangements</div>
            <p>{draft.emergency}</p>
          </div>
          {stage === "drafted" ? (
            <>
              <AiNote>
                Drafted by AI from your description and BCJS&apos;s approved RAMS library. A competent person must review, amend and sign it off before anyone works to it. The
                sign-off is recorded in the audit log.
              </AiNote>
              <div className="flex justify-end">
                <Button onClick={() => setStage("signed")}>Sign off as competent person</Button>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2 rounded-lg bg-good-soft px-3 py-2 text-good">
              <CheckCircle2 size={16} /> Signed off by {person.person} ({person.label}). Filed to the document register and the operative sign-on list has opened.
            </div>
          )}
        </div>
      )}
    </Card>
  );
}

function Section({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <div className="mb-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">{title}</div>
      <ul className="list-disc space-y-1 pl-5">
        {items.map((i) => (
          <li key={i}>{i}</li>
        ))}
      </ul>
    </div>
  );
}
