"use client";

import { useState } from "react";
import { Camera, FileUp, Plus } from "lucide-react";
import { AiNote, Badge, Button, Card, IntegrationTag, Stat, Table, Tabs, Td, Th } from "@/components/ui";
import { ProgrammeGantt } from "./programme-gantt";
import type { AuditEvent } from "@/lib/mock/data";
import type { DiaryEntry, DocumentRecord, ProgrammeTask, Project, Rams, Snag, Variation } from "@/lib/mock/types";
import { formatMoney, formatMoneyShort, pct } from "@/lib/money";

type TabKey = "overview" | "documents" | "rams" | "programme" | "snags" | "audit";

export function ProjectTabs({
  project,
  documents,
  rams,
  programme,
  snags,
  audit,
  diary,
  variations,
}: {
  project: Project;
  documents: DocumentRecord[];
  rams: Rams[];
  programme: ProgrammeTask[];
  snags: Snag[];
  audit: AuditEvent[];
  diary?: DiaryEntry;
  variations: Variation[];
}) {
  const [tab, setTab] = useState<TabKey>("overview");
  const [docs, setDocs] = useState(documents);
  const [snagList, setSnagList] = useState(snags);
  const [snagText, setSnagText] = useState("");
  const [snagSeverity, setSnagSeverity] = useState<Snag["severity"]>("minor");

  const openVos = variations.filter((v) => v.status !== "approved");
  const openSnags = snagList.filter((s) => s.status === "open");
  const criticalOpen = openSnags.filter((s) => s.severity === "critical");

  // A new revision supersedes the current one; nothing is overwritten (Sean §1l).
  const uploadRevision = (doc: DocumentRecord) => {
    const next = doc.revision.match(/^[A-Z]$/) ? String.fromCharCode(doc.revision.charCodeAt(0) + 1) : `${Number(doc.revision) + 1 || 2}`;
    setDocs((all) => [
      { ...doc, id: `${doc.id}-${next}`, revision: next, status: "Current", date: "20 Oct", issuedBy: "Uploaded (prototype)", aiNote: `New revision ${next}. Rev ${doc.revision} kept and marked superseded.` },
      ...all.map((d) => (d.id === doc.id ? { ...d, status: "Superseded" as const } : d)),
    ]);
  };

  const raiseSnag = () => {
    if (!snagText.trim()) return;
    setSnagList((s) => [
      { id: `new-${s.length}`, projectId: project.id, location: "Unassigned", description: snagText.trim(), severity: snagSeverity, owner: "To assign", status: "open", ageDays: 0 },
      ...s,
    ]);
    setSnagText("");
  };

  return (
    <>
      <Tabs
        tabs={[
          { key: "overview", label: "Overview" },
          { key: "documents", label: "Documents", count: docs.length },
          { key: "rams", label: "RAMS", count: rams.length },
          { key: "programme", label: "Programme" },
          { key: "snags", label: "Snags", count: openSnags.length },
          { key: "audit", label: "Audit" },
        ]}
        value={tab}
        onChange={setTab}
      />

      {tab === "overview" && (
        <div className="grid gap-5">
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
            <Stat label="Contract value" value={formatMoneyShort(project.contractValuePence)} />
            <Stat label="Budget" value={formatMoneyShort(project.budgetPence)} />
            <Stat label="Committed" value={formatMoneyShort(project.committedPence)} meta={`${Math.round((project.committedPence / project.budgetPence) * 100)}% of budget`} />
            <Stat label="Actual cost" value={formatMoneyShort(project.actualPence)} />
            <Stat label="Value earned" value={formatMoneyShort(project.valueEarnedPence)} />
            <Stat label="Forecast margin" value={pct(project.forecastMarginPct)} tone={project.forecastMarginPct < 10 ? "bad" : "good"} />
          </div>
          <div className="grid gap-5 lg:grid-cols-[1.4fr_1fr]">
            <Card title="Latest site diary">
              {diary ? (
                <div className="text-sm">
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <span className="font-semibold">{diary.date}</span>
                    <span className="text-muted">· {diary.by}</span>
                    {diary.dictated && <Badge tone="accent">Dictated → structured by AI</Badge>}
                  </div>
                  <dl className="grid gap-x-4 gap-y-1.5 sm:grid-cols-[110px_1fr]">
                    {(
                      [
                        ["Weather", diary.weather],
                        ["Labour", diary.labour],
                        ["Progress", diary.progress],
                        ["Deliveries", diary.deliveries],
                        ["Delays", diary.delays],
                        ["Instructions", diary.instructions],
                        ["Visitors", diary.visitors],
                      ] as const
                    ).map(([k, v]) => (
                      <div key={k} className="contents">
                        <dt className="text-xs font-semibold uppercase tracking-wider text-muted">{k}</dt>
                        <dd className="text-ink">{v}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              ) : (
                <p className="text-sm text-muted">No diary entries yet. Entries are made from the site app.</p>
              )}
            </Card>
            <Card title="Open variations">
              <div className="tabular text-3xl font-bold">{openVos.length}</div>
              <div className="mb-3 text-xs text-muted">worth {formatMoney(openVos.reduce((a, v) => a + v.valuePence, 0))}, excluded from forecast until signed</div>
              <ul className="space-y-1.5 text-sm">
                {openVos.map((v) => (
                  <li key={v.ref} className="flex items-center justify-between gap-2">
                    <span>
                      <span className="font-mono text-xs text-muted">{v.ref}</span> {v.description}
                    </span>
                    <Badge tone={v.status === "disputed" ? "bad" : "warn"}>{v.status}</Badge>
                  </li>
                ))}
                {openVos.length === 0 && <li className="text-muted">None open.</li>}
              </ul>
            </Card>
          </div>
        </div>
      )}

      {tab === "documents" && (
        <div className="grid gap-3">
          <div className="flex flex-wrap items-center gap-2 text-xs text-muted">
            <IntegrationTag system="SharePoint">{project.sharepointUrl}</IntegrationTag>
            Files are stored in the project&apos;s SharePoint site. The register holds revisions, status and who issued what. A new upload supersedes and never overwrites.
          </div>
          {docs.length === 0 ? (
            <Card>
              <p className="text-sm text-muted">No documents registered yet.</p>
            </Card>
          ) : (
            <Table>
              <thead>
                <tr>
                  <Th>Number</Th>
                  <Th>Title</Th>
                  <Th>Category</Th>
                  <Th>Rev</Th>
                  <Th>Status</Th>
                  <Th>Issued</Th>
                  <Th />
                </tr>
              </thead>
              <tbody>
                {docs.map((d) => (
                  <tr key={d.id} className={d.status === "Superseded" ? "opacity-50" : ""}>
                    <Td className="font-mono text-xs">{d.number}</Td>
                    <Td>
                      <div className={d.status === "Superseded" ? "line-through" : "font-semibold"}>{d.title}</div>
                      {d.aiNote && <AiNote className="mt-1.5">{d.aiNote}</AiNote>}
                    </Td>
                    <Td>{d.category}</Td>
                    <Td className="font-mono">{d.revision}</Td>
                    <Td>
                      <Badge tone={d.status === "Current" ? "good" : d.status === "For comment" ? "warn" : "neutral"}>{d.status}</Badge>
                    </Td>
                    <Td className="text-xs text-muted">
                      {d.issuedBy}
                      <br />
                      {d.date}
                    </Td>
                    <Td>
                      {d.status !== "Superseded" && (
                        <button onClick={() => uploadRevision(d)} className="inline-flex items-center gap-1 whitespace-nowrap text-xs font-semibold text-accent-ink hover:underline">
                          <FileUp size={13} /> New revision
                        </button>
                      )}
                    </Td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </div>
      )}

      {tab === "rams" && (
        <div className="grid gap-3 md:grid-cols-2">
          {rams.length === 0 && (
            <Card>
              <p className="text-sm text-muted">No RAMS filed for this job yet.</p>
            </Card>
          )}
          {rams.map((r) => (
            <Card key={r.id}>
              <div className="mb-2 flex items-start justify-between gap-2">
                <div>
                  <div className="font-semibold">{r.title}</div>
                  <div className="text-xs text-muted">{r.activity}</div>
                </div>
                <Badge tone={r.status === "Approved" ? "good" : r.status === "Draft (AI)" ? "accent" : "warn"}>{r.status}</Badge>
              </div>
              <div className="text-xs text-muted">
                Signed on: <span className="tabular font-semibold text-ink">{r.signedOn}</span> of {r.required} operatives · review {r.reviewDate}
                {r.approvedBy && <> · approved by {r.approvedBy}</>}
              </div>
              {r.status === "Draft (AI)" && <AiNote className="mt-2">Drafted from a plain-language task description. A competent person must review and sign it off before anyone works to it.</AiNote>}
            </Card>
          ))}
        </div>
      )}

      {tab === "programme" &&
        (programme.length ? (
          <ProgrammeGantt tasks={programme} currentWeek={16} />
        ) : (
          <Card>
            <p className="text-sm text-muted">No programme yet. The baseline is set and frozen at the pre-start gate.</p>
          </Card>
        ))}

      {tab === "snags" && (
        <div className="grid gap-4">
          {criticalOpen.length > 0 && (
            <div className="rounded-lg border border-bad/40 bg-bad-soft px-3 py-2 text-sm text-bad">
              {criticalOpen.length} critical snag{criticalOpen.length > 1 ? "s" : ""} open: handover is blocked until {criticalOpen.length > 1 ? "they are" : "it is"} fixed and accepted.
            </div>
          )}
          <Card title="Raise a snag">
            <div className="flex flex-wrap gap-2">
              <input
                value={snagText}
                onChange={(e) => setSnagText(e.target.value)}
                placeholder="What's wrong, and where?"
                className="min-w-0 flex-1 rounded-full border border-hair bg-surface-2 px-4 py-2 text-sm text-ink outline-none focus:border-lime"
              />
              <select
                value={snagSeverity}
                onChange={(e) => setSnagSeverity(e.target.value as Snag["severity"])}
                className="rounded-full border border-hair bg-surface-2 px-3 py-2 text-sm text-ink"
                aria-label="Severity"
              >
                <option value="minor">Minor</option>
                <option value="critical">Critical</option>
              </select>
              <Button variant="secondary">
                <Camera size={13} /> Photo
              </Button>
              <Button onClick={raiseSnag}>
                <Plus size={13} /> Raise
              </Button>
            </div>
          </Card>
          {snagList.length === 0 ? (
            <Card>
              <p className="text-sm text-muted">No snags recorded.</p>
            </Card>
          ) : (
            <Table>
              <thead>
                <tr>
                  <Th>Location</Th>
                  <Th>Description</Th>
                  <Th>Severity</Th>
                  <Th>Owner</Th>
                  <Th>Status</Th>
                  <Th right>Age</Th>
                </tr>
              </thead>
              <tbody>
                {snagList.map((s) => (
                  <tr key={s.id}>
                    <Td>{s.location}</Td>
                    <Td>{s.description}</Td>
                    <Td>
                      <Badge tone={s.severity === "critical" ? "bad" : "neutral"}>{s.severity}</Badge>
                    </Td>
                    <Td>{s.owner}</Td>
                    <Td>
                      <Badge tone={s.status === "open" ? "warn" : "good"}>{s.status}</Badge>
                    </Td>
                    <Td right>{s.ageDays}d</Td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </div>
      )}

      {tab === "audit" && (
        <Card title="Audit trail · append-only">
          {audit.length === 0 ? (
            <p className="text-sm text-muted">Every action on this job is recorded here. Nothing can be edited or deleted.</p>
          ) : (
            <ol className="relative space-y-3 border-l border-hair pl-4">
              {audit.map((a, i) => (
                <li key={i} className="relative text-sm">
                  <span className="absolute -left-[21px] top-1.5 h-2.5 w-2.5 rounded-full bg-lime" />
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-[11px] text-muted">{a.at}</span>
                    <span className="rounded bg-surface-2 px-1.5 font-mono text-[11px] text-accent-ink">{a.action}</span>
                    <span className="font-semibold">{a.who}</span>
                  </div>
                  <div className="text-ink">{a.detail}</div>
                </li>
              ))}
            </ol>
          )}
        </Card>
      )}
    </>
  );
}
