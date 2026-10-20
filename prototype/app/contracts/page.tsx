import { IntegrationTag, PageHeader, Stat } from "@/components/ui";
import { MainContract } from "@/components/contracts/main-contract";
import { Subcontracts } from "@/components/contracts/subcontracts";
import { ExternalParties } from "@/components/contracts/external-parties";
import { cisDeductionPence } from "@/components/contracts/cycles";
import { externalParties, mainContracts, projectById, subcontracts, TODAY, TODAY_ISO } from "@/lib/mock/data";
import { formatMoneyShort, sumPence } from "@/lib/money";

export default function ContractsPage() {
  const contract = mainContracts[0];
  const project = projectById(contract.projectId)!;
  const subs = subcontracts.filter((s) => s.projectId === project.id);
  const subValue = sumPence(subs.map((s) => s.valuePence));
  const subRetention = sumPence(subs.map((s) => Math.round((s.valuePence * s.retentionPct) / 100)));
  const cis = sumPence(subs.map((s) => cisDeductionPence(s.labourPence, s.cis)));

  return (
    <>
      <PageHeader
        kicker={`Contracts & payments · ${project.name}`}
        title="Contract read once, dates never missed"
        subtitle={`${TODAY} · ${project.ref} · ${project.client}`}
        actions={
          <>
            <IntegrationTag system="SharePoint">Contracts library</IntegrationTag>
            <IntegrationTag system="Acrobat Sign">subcontract signing</IntegrationTag>
          </>
        }
      />
      <div className="mb-5 grid grid-cols-2 gap-3 md:grid-cols-4">
        <Stat label="Main contract" value={formatMoneyShort(contract.contractSumPence)} meta={`${contract.retentionPct}% retention`} />
        <Stat label="Subcontracts let" value={formatMoneyShort(subValue)} meta={`${subs.length} packages`} />
        <Stat label="Retention held on subs" value={formatMoneyShort(subRetention)} meta="released at PC and end of defects" />
        <Stat label="CIS to deduct (this value)" value={formatMoneyShort(cis)} meta="on labour elements only" tone="warn" />
      </div>
      <div className="flex flex-col gap-5">
        <MainContract contract={contract} todayIso={TODAY_ISO} />
        <Subcontracts items={subs} />
        <ExternalParties initial={externalParties[project.id] ?? []} />
      </div>
    </>
  );
}
