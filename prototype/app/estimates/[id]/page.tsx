import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Badge, PageHeader } from "@/components/ui";
import { EstimateBuilder } from "@/components/estimates/estimate-builder";
import { estimates } from "@/lib/mock/data";

export function generateStaticParams() {
  return estimates.map((e) => ({ id: e.id }));
}

export default async function EstimatePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const est = estimates.find((e) => e.id === id);
  if (!est) notFound();

  return (
    <>
      <Link href="/enquiries/e3" className="mb-3 inline-flex items-center gap-1 text-xs font-semibold text-muted hover:text-ink">
        <ArrowLeft size={14} /> {est.enquiryRef}
      </Link>
      <PageHeader
        kicker={`Win work · Estimating · ${est.ref}`}
        title={est.title}
        subtitle={
          <span className="inline-flex flex-wrap items-center gap-2">
            {est.client} · version {est.version} <Badge tone="warn">{est.status}</Badge>
          </span>
        }
      />
      <EstimateBuilder estimate={est} />
    </>
  );
}
