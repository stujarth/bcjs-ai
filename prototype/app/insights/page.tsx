import Link from "next/link";
import { ArrowRight, CalendarClock } from "lucide-react";
import { AiNote, Badge, Card, IntegrationTag, PageHeader, Table, Td, Th, type Tone } from "@/components/ui";
import { MorningBriefing } from "@/components/insights/morning-briefing";
import { ProgrammeAgent } from "@/components/insights/programme-agent";
import { Inspections } from "@/components/insights/inspections";
import { cvrCommentary, lookAhead, morningBriefings, weeklySummary, type Line } from "@/components/insights/briefing-data";
import { formatDayShort } from "@/components/contracts/cycles";
import { inspectionTemplates, projectById, TODAY } from "@/lib/mock/data";

function Section({ title, lines }: { title: string; lines: Line[] }) {
  return (
    <div>
      <h3 className="mb-1 text-[11px] font-bold uppercase tracking-[0.12em] text-muted">{title}</h3>
      <ul className="divide-y divide-hair">
        {lines.map((l, i) => (
          <li key={i}>
            <Link href={l.href} className="flex items-center gap-2 py-1.5 text-sm hover:text-accent-ink">
              <span className="flex-1">{l.text}</span>
              <ArrowRight size={13} className="shrink-0 text-muted" />
            </Link>
          </li>
        ))}
        {lines.length === 0 && <li className="py-1.5 text-sm text-muted">Nothing due.</li>}
      </ul>
    </div>
  );
}

const kindTone: Record<string, Tone> = { Payment: "accent", Subcontract: "neutral", Compliance: "bad", Gate: "warn", RAMS: "warn" };
const driverTone = { good: "text-good", bad: "text-bad", warn: "text-warn" } as const;

export default function InsightsPage() {
  const summary = weeklySummary();
  const ahead = lookAhead(14);
  const cvr = cvrCommentary();
  const template = inspectionTemplates[0];

  return (
    <>
      <PageHeader
        kicker="AI briefings & agents"
        title="The business reports on itself"
        subtitle={`${TODAY} · every figure below is read from the project record, never typed by the AI`}
        actions={
          <>
            <IntegrationTag system="Teams">Fri 17:00</IntegrationTag>
            <IntegrationTag system="Outlook">directors&apos; inbox</IntegrationTag>
          </>
        }
      />

      <div className="mb-5 flex items-start gap-2 rounded-xl border border-hair bg-surface p-3 text-sm">
        <CalendarClock size={16} className="mt-0.5 shrink-0 text-accent-ink" />
        <div>
          Delivered to Teams and Outlook every Friday at 17:00, with a 07:30 morning briefing per person.{" "}
          <span className="text-muted">Everything on this page is AI output for a person to confirm; nothing here changes a record.</span>
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.5fr_1fr]">
        <Card title="Weekly summary · preview for Fri 23 Oct, 17:00">
          <div className="grid gap-5 md:grid-cols-2">
            <Section title="What moved" lines={summary.moved} />
            <Section title="Money" lines={summary.money} />
            <Section title="Risks" lines={summary.risks} />
            <Section title="Next week" lines={summary.next} />
          </div>
          <AiNote className="mt-4">Figures come from tool calls on live records; the model writes only the wording. Each line links to its source screen.</AiNote>
        </Card>
        <MorningBriefing briefings={morningBriefings()} />
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-2">
        <Card title="14-day look-ahead">
          <Table>
            <thead>
              <tr>
                <Th>Date</Th>
                <Th>What</Th>
                <Th>Type</Th>
              </tr>
            </thead>
            <tbody>
              {ahead.map((e, i) => (
                <tr key={i}>
                  <Td className="tabular whitespace-nowrap font-semibold">{formatDayShort(e.date)}</Td>
                  <Td>
                    <Link href={e.href} className="hover:underline">
                      {e.text}
                    </Link>
                  </Td>
                  <Td>
                    <Badge tone={kindTone[e.kind]}>{e.kind}</Badge>
                  </Td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card>

        <Card title="AI CVR commentary · Goytre Grange">
          <div className="mb-3 flex flex-wrap items-baseline gap-2">
            <span className="tabular text-2xl font-bold">{cvr.cur.marginPct.toFixed(1)}%</span>
            <span className={cvr.delta >= 0 ? "text-sm font-semibold text-good" : "text-sm font-semibold text-bad"}>
              {cvr.delta >= 0 ? "▲" : "▼"} {Math.abs(cvr.delta).toFixed(1)} pts on {cvr.prev.period}
            </span>
          </div>
          <div className="mb-3 flex gap-1.5">
            {cvr.history.map((h) => (
              <div key={h.period} className="flex-1 rounded-md bg-surface-2 px-2 py-1 text-center ring-1 ring-hair">
                <div className="text-[10px] text-muted">{h.period}</div>
                <div className="tabular text-xs font-semibold">{h.marginPct.toFixed(1)}%</div>
              </div>
            ))}
          </div>
          <p className="mb-2 text-sm">
            Forecast margin recovered {cvr.delta.toFixed(1)} points in period 8, after falling through the summer. The main drivers:
          </p>
          <ul className="space-y-1.5 text-sm">
            {cvr.drivers.map((d, i) => (
              <li key={i} className="flex gap-2">
                <span className={driverTone[d.tone]}>●</span>
                <span>{d.text}</span>
              </li>
            ))}
          </ul>
          <AiNote className="mt-3">
            Draft commentary for the period 8 report. James Price (QS) confirms or edits it before the CVR is locked.{" "}
            <Link href="/commercial" className="underline">
              Open CVR
            </Link>
          </AiNote>
        </Card>
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-2">
        <ProgrammeAgent />
        <div id="inspections" className="scroll-mt-20">
          <Inspections template={template} projectName={projectById(template.projectId)?.name ?? ""} />
        </div>
      </div>
    </>
  );
}
