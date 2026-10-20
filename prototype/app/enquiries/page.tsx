import { AiNote, PageHeader, Stat } from "@/components/ui";
import { EnquiryPipeline } from "@/components/enquiries/pipeline";
import { enquiries } from "@/lib/mock/data";
import { formatMoneyShort, pct, sumPence } from "@/lib/money";

export default function EnquiriesPage() {
  const open = enquiries.filter((e) => ["new", "qualifying", "surveyed"].includes(e.stage));
  const decided = enquiries.filter((e) => e.stage === "converted" || e.stage === "lost");
  const converted = enquiries.filter((e) => e.stage === "converted").length;
  const avgAge = Math.round(open.reduce((a, e) => a + e.ageDays, 0) / (open.length || 1));
  const lossReasons = new Set(enquiries.filter((e) => e.lossReason).map((e) => e.lossReason)).size;

  return (
    <>
      <PageHeader
        kicker="Win work · Enquiries"
        title="Enquiry pipeline"
        subtitle="Every enquiry is written down, has an owner, and shows up in the pipeline. Monday's weekly review works from this board."
      />
      <div className="mb-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat label="Open pipeline" value={formatMoneyShort(sumPence(open.map((e) => e.potentialValuePence)))} meta={`${open.length} open enquiries`} />
        <Stat label="Conversion rate" value={pct((converted / (decided.length || 1)) * 100, 0)} meta={`${converted} of ${decided.length} decided`} tone="good" />
        <Stat label="Average age" value={`${avgAge} days`} meta="open enquiries" tone={avgAge > 14 ? "warn" : undefined} />
        <Stat label="Loss reasons" value={lossReasons} meta="from a fixed list, so they can be counted" />
      </div>
      <AiNote className="mb-5">
        Duplicate check runs as you type: a new enquiry from an existing client or contact is flagged before it is saved, so the client register stays clean.
      </AiNote>
      <EnquiryPipeline />
    </>
  );
}
