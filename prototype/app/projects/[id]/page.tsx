import Link from "next/link";
import { notFound } from "next/navigation";
import { Check } from "lucide-react";
import { Badge, IntegrationTag, PageHeader, RagDot, ragTone } from "@/components/ui";
import { StageGatePanel } from "@/components/projects/stage-gate-panel";
import { ProjectTabs } from "@/components/projects/project-tabs";
import { auditEvents, diary, documents, personById, programme, projectById, projects, rams, snags, stageGates, variations } from "@/lib/mock/data";
import type { ProjectStage } from "@/lib/mock/types";
import { cn } from "@/lib/cn";

const stages: ProjectStage[] = ["tender", "won", "pre-start", "on-site", "snagging", "handover", "closed"];

export function generateStaticParams() {
  return projects.map((p) => ({ id: p.id }));
}

export default async function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = projectById(id);
  if (!project) notFound();

  const current = stages.indexOf(project.stage);
  const gate = stageGates.find((g) => g.projectId === project.id);

  return (
    <>
      <div className="mb-2 text-xs text-muted">
        <Link href="/projects" className="hover:underline">
          Projects
        </Link>{" "}
        / {project.ref}
      </div>
      <PageHeader
        kicker={`${project.ref} · ${project.type}`}
        title={project.name}
        subtitle={
          <>
            {project.client} · {project.location} · {project.startDate} – {project.endDate} · PM {personById(project.pmId)?.name} · QS {personById(project.qsId)?.name} · Site{" "}
            {personById(project.siteManagerId)?.name}
          </>
        }
        actions={
          <>
            {project.heritage && <Badge tone="warn">Heritage</Badge>}
            <Badge tone={ragTone(project.cashRag)}>
              <RagDot rag={project.cashRag} /> Cash {project.cashRag}
            </Badge>
          </>
        }
      />

      <div className="mb-4 flex flex-wrap gap-2">
        <IntegrationTag system="SharePoint">{project.sharepointUrl}</IntegrationTag>
        <IntegrationTag system="Teams">{project.teamsChannel}</IntegrationTag>
        <IntegrationTag system="Xero">{project.xeroTracking}</IntegrationTag>
      </div>

      <ol className="mb-5 flex overflow-x-auto rounded-xl border border-hair bg-surface p-2" aria-label="Project stage">
        {stages.map((s, i) => (
          <li
            key={s}
            aria-current={i === current ? "step" : undefined}
            className={cn(
              "flex min-w-[96px] flex-1 items-center justify-center gap-1.5 rounded-lg px-2 py-2 text-xs font-semibold capitalize",
              i < current && "text-good",
              i === current && "bg-lime text-night",
              i > current && "text-muted",
            )}
          >
            {i < current ? <Check size={13} /> : <span className="tabular text-[10px] opacity-70">{i + 1}</span>}
            {s}
          </li>
        ))}
      </ol>

      {gate && <StageGatePanel gate={gate} />}

      <ProjectTabs
        project={project}
        documents={documents.filter((d) => d.projectId === project.id)}
        rams={rams.filter((r) => r.projectId === project.id)}
        programme={programme.filter((t) => t.projectId === project.id)}
        snags={snags.filter((s) => s.projectId === project.id)}
        audit={auditEvents[project.id] ?? []}
        diary={diary.find((d) => d.projectId === project.id)}
        variations={variations.filter((v) => v.projectId === project.id)}
      />
    </>
  );
}
