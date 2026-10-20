import { Card, IntegrationTag, PageHeader, Stat } from "@/components/ui";
import { PoTable } from "@/components/procurement/po-table";
import { XeroFeed } from "@/components/procurement/xero-feed";
import { TeamsApprovalCard } from "@/components/procurement/teams-card";
import { approvalBands, purchaseOrders, xeroBills } from "@/lib/mock/data";
import { formatMoney, formatMoneyShort, sumPence } from "@/lib/money";

export default function ProcurementPage() {
  const committed = sumPence(purchaseOrders.map((p) => p.valuePence));
  const invoiced = sumPence(purchaseOrders.map((p) => p.invoicedPence));
  const awaiting = purchaseOrders.filter((p) => p.status === "awaiting approval");
  const coded = xeroBills.filter((b) => b.costCode).length;
  const teamsPo = purchaseOrders.find((p) => p.ref === "PO-2853")!;
  const teamsApprover = approvalBands.find((b) => teamsPo.valuePence <= b.upToPence)!.approver;

  return (
    <>
      <PageHeader
        kicker="Supply"
        title="Orders & the Xero feed"
        subtitle={`${purchaseOrders.length} open orders across ${new Set(purchaseOrders.map((p) => p.projectId)).size} projects. Committed spend is visible the moment an order is approved.`}
        actions={<IntegrationTag system="Xero">last sync 4 min ago · 0 errors</IntegrationTag>}
      />

      <div className="mb-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat label="Committed" value={formatMoneyShort(committed)} meta="approved and open orders" />
        <Stat label="Invoiced to date" value={formatMoneyShort(invoiced)} meta="against these orders" />
        <Stat label="Awaiting approval" value={awaiting.length} meta={formatMoney(sumPence(awaiting.map((p) => p.valuePence)))} tone="warn" />
        <Stat label="From Xero, coded" value={`${coded} / ${xeroBills.length}`} meta={`${xeroBills.length - coded} need a cost code`} tone={coded === xeroBills.length ? "good" : "warn"} />
      </div>

      <section className="mb-6">
        <div className="mb-2 flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="heading text-sm text-ink">Purchase orders</h2>
          <p className="text-xs text-muted">
            Bands: {approvalBands.map((b, i) => (b.upToPence === Number.MAX_SAFE_INTEGER ? `over ${formatMoney(approvalBands[i - 1].upToPence)} ${b.approver}` : `up to ${formatMoney(b.upToPence)} ${b.approver}`)).join(" · ")}. Switch role to see who can approve.
          </p>
        </div>
        <PoTable orders={purchaseOrders} />
      </section>

      <section className="mb-6">
        <XeroFeed bills={xeroBills} />
      </section>

      <div className="grid gap-5 lg:grid-cols-2">
        <Card title="Teams approval card preview">
          <p className="mb-3 text-sm text-muted">
            Approvers don&apos;t have to open the system. Orders above their band arrive as an Adaptive Card in Teams, and the decision is written back to the order&apos;s audit trail.
          </p>
          <TeamsApprovalCard po={teamsPo} approver={teamsApprover} />
        </Card>
        <Card title="How the money flows">
          <ol className="list-decimal space-y-2 pl-5 text-sm text-ink">
            <li>Order raised against a project budget line and cost code. Over-budget orders warn; suppliers with lapsed insurance are blocked.</li>
            <li>Approved order enters committed cost and the cash forecast on the same day, using the supplier&apos;s payment terms.</li>
            <li>Goods received on site against the order (three-way match).</li>
            <li>Bill arrives through Xero or the scanner, is matched to the order, and a person confirms every figure.</li>
            <li>Approved bill posts to Xero with the project tracking category; payment status flows back.</li>
          </ol>
        </Card>
      </div>
    </>
  );
}
