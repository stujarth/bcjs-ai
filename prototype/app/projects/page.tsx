import { PageHeader } from "@/components/ui";
import { ProjectList } from "@/components/projects/project-list";
import { projects } from "@/lib/mock/data";

export default function ProjectsPage() {
  return (
    <>
      <PageHeader kicker="Operations" title="Projects" subtitle={`${projects.length} jobs, one record each: the same data the director, QS, PM and site see.`} />
      <ProjectList />
    </>
  );
}
