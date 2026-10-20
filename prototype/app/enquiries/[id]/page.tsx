import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Camera, Check, ClipboardList, Mail, MessageSquare, Phone, Sparkles, StickyNote, Workflow } from "lucide-react";
import { AiNote, Badge, Button, Card, IntegrationTag, PageHeader } from "@/components/ui";
import { cn } from "@/lib/cn";
import { aiScopeDrafts, enquiries, personById, siteSurveys } from "@/lib/mock/data";
import type { EnquiryEvent, EnquiryStage } from "@/lib/mock/types";
import { formatMoney } from "@/lib/money";

export function generateStaticParams() {
  return enquiries.map((e) => ({ id: e.id }));
}

const stepper: { key: EnquiryStage; label: string }[] = [
  { key: "new", label: "New" },
  { key: "qualifying", label: "Qualifying" },
  { key: "surveyed", label: "Surveyed" },
  { key: "converted", label: "Converted to tender" },
];

const eventIcon: Record<EnquiryEvent["kind"], typeof Mail> = {
  email: Mail,
  call: Phone,
  note: StickyNote,
  survey: ClipboardList,
  stage: Workflow,
  ai: Sparkles,
};

export default async function EnquiryDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const e = enquiries.find((x) => x.id === id);
  if (!e) notFound();

  const owner = personById(e.ownerId);
  const survey = siteSurveys[e.ref];
  const scope = aiScopeDrafts[e.ref];
  const closed = e.stage === "lost" || e.stage === "dormant";
  const stageIdx = stepper.findIndex((s) => s.key === e.stage);

  return (
    <>
      <Link href="/enquiries" className="mb-3 inline-flex items-center gap-1 text-xs font-semibold text-muted hover:text-ink">
        <ArrowLeft size={14} /> Pipeline
      </Link>
      <PageHeader
        kicker={`${e.ref} · ${e.source}`}
        title={e.client}
        subtitle={`${e.type} · ${e.site}`}
        actions={
          e.stage === "surveyed" ? (
            <Button href="/estimates/est-0236">Convert to tender</Button>
          ) : e.stage === "converted" ? (
            <Badge tone="good">Converted</Badge>
          ) : closed ? (
            <Badge tone={e.stage === "lost" ? "bad" : "neutral"}>
              {e.stage}
              {e.lossReason ? ` · ${e.lossReason}` : ""}
            </Badge>
          ) : (
            <Button variant="secondary">Book site survey</Button>
          )
        }
      />

      {/* Stage stepper */}
      {!closed && (
        <ol className="mb-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {stepper.map((s, i) => {
            const done = i < stageIdx;
            const current = i === stageIdx;
            return (
              <li
                key={s.key}
                className={cn(
                  "flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-semibold",
                  current ? "border-lime bg-accent-soft text-accent-ink" : done ? "border-hair bg-surface text-ink" : "border-hair bg-surface-2 text-muted",
                )}
              >
                <span
                  className={cn(
                    "flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px]",
                    done ? "bg-good text-white" : current ? "bg-lime text-night" : "bg-hair text-muted",
                  )}
                >
                  {done ? <Check size={12} /> : i + 1}
                </span>
                {s.label}
              </li>
            );
          })}
        </ol>
      )}

      <div className="grid gap-5 xl:grid-cols-[1fr_1.4fr]">
        <div className="flex flex-col gap-5">
          <Card title="Enquiry">
            <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-sm">
              <dt className="text-muted">Contact</dt>
              <dd>{e.contact}</dd>
              <dt className="text-muted">Email</dt>
              <dd className="break-all">{e.email}</dd>
              <dt className="text-muted">Phone</dt>
              <dd>{e.phone}</dd>
              <dt className="text-muted">Source</dt>
              <dd>{e.source}</dd>
              <dt className="text-muted">Owner</dt>
              <dd>{owner?.name}</dd>
              <dt className="text-muted">Potential</dt>
              <dd className="tabular font-semibold">{formatMoney(e.potentialValuePence)}</dd>
              <dt className="text-muted">Received</dt>
              <dd>
                {e.receivedDate} ({e.ageDays} days)
              </dd>
            </dl>
            <p className="mt-3 border-t border-hair pt-3 text-sm text-ink">{e.description}</p>
          </Card>

          <Card title="Timeline">
            <ol className="relative space-y-4 border-l border-hair pl-5">
              {e.events.map((ev, i) => {
                const Icon = eventIcon[ev.kind];
                return (
                  <li key={i} className="relative">
                    <span
                      className={cn(
                        "absolute -left-[31px] flex h-5 w-5 items-center justify-center rounded-full ring-4 ring-surface",
                        ev.kind === "ai" ? "bg-lime text-night" : "bg-slate text-white",
                      )}
                    >
                      <Icon size={11} />
                    </span>
                    <div className="text-[11px] text-muted">
                      {ev.date} · {ev.by}
                    </div>
                    {ev.kind === "ai" ? <AiNote className="mt-1">{ev.text}</AiNote> : <div className="text-sm text-ink">{ev.text}</div>}
                  </li>
                );
              })}
              <li className="relative">
                <span className="absolute -left-[31px] flex h-5 w-5 items-center justify-center rounded-full bg-hair text-muted ring-4 ring-surface">
                  <MessageSquare size={11} />
                </span>
                <div className="text-xs text-muted">Emails to and from {e.contact} are filed here automatically from Outlook.</div>
              </li>
            </ol>
          </Card>
        </div>

        <div className="flex flex-col gap-5">
          <Card
            title="Site survey"
            action={
              <IntegrationTag system="Outlook">{survey ? `done ${survey.date}` : "Book survey in Outlook"}</IntegrationTag>
            }
          >
            {survey ? (
              <>
                <p className="mb-3 text-xs text-muted">
                  The same fixed checklist every time, filled in on a phone on site by {survey.by}. Every measurement has a photo.
                </p>
                <ul className="divide-y divide-hair text-sm">
                  {survey.items.map((it) => (
                    <li key={it.label} className="flex items-center gap-3 py-2">
                      <span
                        className={cn(
                          "flex h-5 w-5 shrink-0 items-center justify-center rounded-full",
                          it.done ? "bg-good text-white" : "border border-dashed border-warn text-warn",
                        )}
                      >
                        {it.done ? <Check size={12} /> : "!"}
                      </span>
                      <span className="flex-1">{it.label}</span>
                      <span className="tabular text-right text-xs text-muted">{it.measurement ?? (it.done ? "" : "Outstanding")}</span>
                      {it.photo && <Camera size={14} className="shrink-0 text-muted" aria-label="Photo attached" />}
                    </li>
                  ))}
                </ul>
                <div className="mt-3 grid grid-cols-4 gap-2">
                  {survey.photos.map((p) => (
                    <div
                      key={p}
                      className="flex aspect-square items-end rounded-lg bg-gradient-to-br from-slate/70 to-night-2 p-1.5 text-[10px] leading-tight text-white/90"
                    >
                      {p}
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="rounded-lg border border-dashed border-hair p-6 text-center text-sm text-muted">
                No survey yet. Booking it creates an Outlook calendar event for the surveyor and sends the client a confirmation.
              </div>
            )}
          </Card>

          {scope && (
            <Card title="Draft scope from survey" action={<IntegrationTag system="Claude">draft</IntegrationTag>}>
              <AiNote className="mb-3">
                Drafted from the survey checklist, 42 photos and the conservation notes. The estimator reviews every line, and nothing is priced until a person confirms it.
              </AiNote>
              <ul className="space-y-2 text-sm">
                {scope.packages.map((p) => (
                  <li key={p.name} className="rounded-lg bg-surface-2 px-3 py-2">
                    <div className="font-semibold">{p.name}</div>
                    <div className="text-xs text-muted">{p.note}</div>
                  </li>
                ))}
              </ul>
              <div className="mt-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">Risks flagged</div>
              <ul className="mt-1 list-disc space-y-1 pl-5 text-sm">
                {scope.risks.map((r) => (
                  <li key={r}>{r}</li>
                ))}
              </ul>
              {e.stage === "surveyed" && (
                <div className="mt-4 flex justify-end">
                  <Button href="/estimates/est-0236">Convert to tender</Button>
                </div>
              )}
            </Card>
          )}
        </div>
      </div>
    </>
  );
}
