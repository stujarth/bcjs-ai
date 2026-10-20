# Integrations

Two principles apply throughout. **Xero stays the ledger. Microsoft 365 stays where people work.** The OCS is the single project record that connects them.

Everything in this document is a design for the production build. The prototype mocks all of it.

## Microsoft 365 (Microsoft Graph)

One multi-purpose app registration sits in the BCJS Entra tenant, with admin consent given once by a BCJS Global Admin. Secrets and certificates are held in Azure Key Vault. Application permissions are kept to the minimum; where possible we use `Sites.Selected` and RBAC for Applications in Exchange to scope access to named sites and mailboxes, rather than tenant-wide access.

| Capability | Graph surface | Permission (minimum) | Notes |
|---|---|---|---|
| Staff sign-in (SSO, MFA) | OIDC via Entra ID | `openid profile email offline_access`, `User.Read` (delegated) | Entra security groups map to OCS roles. Conditional access is enforced by BCJS's tenant |
| Subcontractor and client access | Entra External ID / B2B guests | `User.Invite.All` (only when inviting) | Decision D15 |
| Project document library | `/sites/{id}/drives`, `/drives/{id}/items` | `Sites.Selected` + per-site grant | A site or library is provisioned from a template at award. The OCS register stores the drive item ID, eTag and version |
| Keep the register in sync | Change notifications on `driveItem` plus delta queries | Same as above | Webhook plus a nightly delta for safety |
| Send quotes and correspondence | `POST /users/{estimating}/sendMail` | `Mail.Send`, restricted by an Exchange application access policy to the shared mailbox | Records the exact attachment version, sender and time (Sean §6a) |
| File client replies | Change notifications on mailbox messages, `conversationId` | `Mail.Read` on the shared mailbox only | Matches by quotation reference or conversation ID. When the match is ambiguous, AI suggests one and a person confirms |
| Teams channel per project | `POST /teams/{id}/channels` | `Channel.Create` | Created at award; needs a licence that supports Teams-connected SharePoint (D12) |
| Approvals and alerts | Bot Framework Adaptive Cards (Teams app) | Teams app manifest + bot | Approve or reject POs, timesheets, variations and gate overrides. The action calls the OCS API and is audited as the clicking user |
| Calendar bookings | `POST /users/{id}/events` | `Calendars.ReadWrite` (delegated) | Site surveys, pre-start meetings and handovers, linked to the record |
| Excel round-trip | Workbook upload and parse server-side | none | Legacy workbook import (§5i) and offline pricing (D2). The server recalculates everything |
| Copilot agent | Copilot Studio declarative agent → OCS API (OAuth) | per-user delegated | R6. The same permission checks apply as in the app |

## Xero

The connection is a Xero OAuth 2.0 web app with the authorisation-code flow, consented by BCJS on Xero's own screen. Tokens are encrypted at rest in Key Vault and refreshed automatically. Only one tenant (organisation) is connected.

**Scopes:** `accounting.contacts`, `accounting.transactions`, `accounting.settings.read`, `accounting.attachments`, `offline_access`. Check D11 (tiers) and Xero's current granular-scope rules before registering.

| Flow | Direction | Endpoint | Trigger | Rule |
|---|---|---|---|---|
| Contacts | Xero ⇄ OCS | `GET/POST /Contacts` | Initial import plus webhook | Match on name, VAT number and email; a person resolves duplicates |
| Tracking categories | OCS → Xero | `PUT /TrackingCategories/{id}/Options` | Project created at award | Option = project ref (e.g. `BCJS-2611`) so P&L by job works in Xero |
| Account mapping | Xero → OCS | `GET /Accounts` | Settings screen | Cost code → account code mapping is validated before any push (Sean §11d) |
| Supplier bills | OCS → Xero | `POST /Invoices` (`ACCPAY`) + `/Attachments` | Bill approved in the OCS | Lines carry the account code and tracking option; the original PDF is attached |
| Bills entered in Xero | Xero → OCS | Webhook `INVOICE` events → `GET /Invoices/{id}` | Alternative flow (D10) | Matched to a PO and cost code; price variance flagged |
| Payments | Xero → OCS | Webhook + `GET /Payments` | Payment recorded in Xero | Updates the actual cost and cash-flow actuals (Sean §13f) |
| Sales invoices and applications | OCS → Xero | `POST /Invoices` (`ACCREC`) | Valuation certified / application approved | Retention held as a separate line; client order ref carried (Sean §7b) |
| Reconciliation | Both | nightly job | Scheduled | Reconciliation screen shows the OCS against Xero per record, with a sync log (Sean §11h) |

**Limits and resilience.** Xero allows 60 calls per minute, 5,000 per day and 5 concurrent calls per tenant. All Xero calls run on the worker queue with batching, exponential back-off and a call estimate shown before large syncs. Webhooks are verified with the `x-xero-signature` HMAC.

**Rehearsal.** All Xero work is built and tested against the Xero Demo Company from staging. Staging never connects to the live organisation (Sean §11i).

## Adobe Acrobat Sign

The client's written acceptance of a quotation or contract is captured via the Acrobat Sign REST API (agreements created from the frozen quote PDF). A webhook tells the OCS when an agreement is signed; the signed PDF is filed to the register and satisfies the award gate (Sean §7a). An existing Adobe licence may cover Acrobat Sign.

## Claude (AI layer)

See [ai-capabilities.md](ai-capabilities.md). Every AI call goes through one server-side module, which applies the user's permissions to every tool, keeps an audit log, minimises the data sent, and enforces retention.

## Kabyn and Briefcase

Their purpose is not yet known. Both are audited in R0 (decision D13) to decide whether to replace, integrate or retire each one.
