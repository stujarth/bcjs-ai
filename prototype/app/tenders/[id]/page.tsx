import { notFound } from "next/navigation";
import { Badge, IntegrationTag, PageHeader } from "@/components/ui";
import { TenderPackageView } from "@/components/tenders/tender-package-view";
import { libraryItems, suppliers, tenderPackages } from "@/lib/mock/data";

export function generateStaticParams() {
  return tenderPackages.map((t) => ({ id: t.id }));
}

export default async function TenderPackagePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const pkg = tenderPackages.find((t) => t.id === id);
  if (!pkg) notFound();
  const lib = (lid: string) => libraryItems.find((l) => l.id === lid)!;
  return (
    <>
      <PageHeader
        kicker={`Tenders · ${pkg.ref}`}
        title={pkg.name}
        subtitle={`${pkg.project} · from ${pkg.estimateRef} · ${pkg.trade}`}
        actions={
          <>
            <Badge tone="accent">{pkg.status}</Badge>
            <IntegrationTag system="Outlook">sent from estimating@</IntegrationTag>
          </>
        }
      />
      <TenderPackageView
        pkg={pkg}
        scope={lib(pkg.scopeId)}
        drm={lib(pkg.drmId)}
        attendances={lib(pkg.attendancesId)}
        payment={lib(pkg.paymentId)}
        tradeSuppliers={suppliers.filter((s) => s.kind === "Subcontractor")}
      />
    </>
  );
}
