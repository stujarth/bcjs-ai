import { CheckCircle2, CircleDashed, HelpCircle, ShieldCheck } from "lucide-react";
import { Badge, Card, PageHeader, Table, Td, Th, type Tone } from "@/components/ui";
import { ArchitectureDiagram } from "@/components/integrations/architecture-diagram";
import { integrations, xeroSyncLog } from "@/lib/mock/data";

type Status = (typeof integrations)[number]["status"];

const statusMeta: Record<Status, { tone: Tone; label: string; icon: typeof CheckCircle2 }> = {
  connected: { tone: "good", label: "Connected", icon: CheckCircle2 },
  planned: { tone: "neutral", label: "Planned", icon: CircleDashed },
  review: { tone: "warn", label: "In discovery", icon: HelpCircle },
};

// What flows each way, and how the connection is secured.
const flows: Record<string, { out?: string; in?: string; secured: string }> = {
  "Microsoft Entra ID": { in: "Identity, MFA, security groups → roles", secured: "OIDC single sign-on; leavers lose access when IT disables them in M365" },
  SharePoint: { out: "Project sites & folders created at award; new document versions", in: "File changes via Graph change notifications", secured: "Least-privilege Graph scopes (Sites.Selected), app registration in BCJS tenant" },
  Outlook: { out: "Quotes sent on click from estimating@", in: "Client replies filed against the quotation", secured: "Shared mailbox only, Graph Mail.Send scoped by application access policy" },
  Teams: { out: "Project channel at award; approval cards for POs, timesheets, variations, overrides", in: "Approve / reject decisions", secured: "Teams app installed by BCJS admin; every decision written to the audit log" },
  Xero: { out: "Approved bills, sales invoices & applications", in: "Payments, contacts, bills entered in Xero", secured: "OAuth consent on Xero's own screen; tokens encrypted at rest; mapping validated before any push" },
  "Adobe Acrobat Sign": { out: "Quotes & contracts for signature", in: "Signed PDF + audit certificate", secured: "OAuth app; signed copy filed to the document register" },
  "Claude (Anthropic)": { out: "Minimum text needed for the task", in: "Drafts & extracted fields for a person to confirm", secured: "Zero data retention; tools inherit the user's permissions; no AI figure trusted until confirmed" },
  "Microsoft 365 Copilot": { in: "Questions from Copilot chat", secured: "Declarative agent over the same permission-checked API" },
};

export default function IntegrationsPage() {
  return (
    <>
      <PageHeader
        kicker="Integrations"
        title="Native to Microsoft 365 and Xero"
        subtitle="One project record in the OCS, kept in step with the systems BCJS already uses. Connections shown are illustrative mocks."
      />

      <div className="mb-6">
        <ArchitectureDiagram />
      </div>

      <div className="mb-6 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {integrations.map((i) => {
          const meta = statusMeta[i.status];
          const Icon = meta.icon;
          const f = flows[i.name];
          return (
            <Card key={i.name} className="flex flex-col">
              <div className="mb-1 flex items-start gap-2">
                <div className="min-w-0 flex-1">
                  <div className="font-bold text-ink">{i.name}</div>
                  <div className="text-xs text-muted">{i.area}</div>
                </div>
                <Badge tone={meta.tone}>
                  <Icon size={12} /> {meta.label}
                </Badge>
              </div>
              <p className="text-sm text-muted">{i.detail}</p>
              {f && (
                <div className="mt-3 space-y-1.5 border-t border-hair pt-3 text-xs">
                  {f.out && (
                    <div>
                      <span className="font-semibold text-ink">OCS → {i.name.split(" ")[0]}:</span> <span className="text-muted">{f.out}</span>
                    </div>
                  )}
                  {f.in && (
                    <div>
                      <span className="font-semibold text-ink">{i.name.split(" ")[0]} → OCS:</span> <span className="text-muted">{f.in}</span>
                    </div>
                  )}
                  <div className="flex items-start gap-1.5 pt-1 text-muted">
                    <ShieldCheck size={13} className="mt-px shrink-0 text-good" /> {f.secured}
                  </div>
                </div>
              )}
            </Card>
          );
        })}
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.6fr_1fr]">
        <Card title="Xero sync log">
          <Table className="border-0">
            <thead>
              <tr>
                <Th>When</Th>
                <Th>Direction</Th>
                <Th>Record</Th>
                <Th>Result</Th>
                <Th>Detail</Th>
              </tr>
            </thead>
            <tbody>
              {xeroSyncLog.map((r, idx) => (
                <tr key={idx}>
                  <Td className="whitespace-nowrap text-xs text-muted">{r.at}</Td>
                  <Td className="whitespace-nowrap text-xs">{r.direction}</Td>
                  <Td className="text-xs font-semibold">{r.record}</Td>
                  <Td>
                    <Badge tone={r.result === "ok" ? "good" : "warn"}>{r.result}</Badge>
                  </Td>
                  <Td className="text-xs text-muted">{r.detail}</Td>
                </tr>
              ))}
            </tbody>
          </Table>
          <p className="mt-2 text-[11px] text-muted">Rate limits respected (60 calls/min, 5,000/day). Rehearsed on Xero&apos;s demo company before the live organisation is connected.</p>
        </Card>

        <Card title="To confirm in discovery" className="border-warn/40">
          <div className="space-y-2 text-sm">
            <p className="text-ink">
              <span className="font-bold">Kabyn</span> and <span className="font-bold">Briefcase</span> are in BCJS&apos;s current toolset, but what they cover isn&apos;t
              documented yet.
            </p>
            <p className="text-muted">
              Decision <span className="font-mono font-semibold text-ink">D13</span>: for each one, replace it with an OCS module, integrate it, or retire it. If Briefcase handles
              receipts or bills, it overlaps the AI invoice reader.
            </p>
            <Badge tone="warn">Needed before Release 2</Badge>
          </div>
        </Card>
      </div>
    </>
  );
}
