import { IntegrationTag, PageHeader } from "@/components/ui";
import { LibraryView } from "@/components/library/library-view";
import { libraryItems } from "@/lib/mock/data";

export default function LibraryPage() {
  return (
    <>
      <PageHeader
        kicker="Win work · Library"
        title="Library"
        subtitle="Build it once, use it on every job. Rate books, scopes, design responsibility matrices, attendances, prelims, payment schedules and letter templates all feed estimates, tender packages and subcontracts."
        actions={<IntegrationTag system="SharePoint">templates stored per version</IntegrationTag>}
      />
      <LibraryView items={libraryItems} />
    </>
  );
}
