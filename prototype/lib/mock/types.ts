// Shapes mirror the production data model in docs/delivery-plan.md.
// Money is integer pence throughout.

export type RoleKey = "director" | "qs" | "pm" | "site" | "finance" | "subcontractor";

export type ProjectStage =
  | "tender"
  | "won"
  | "pre-start"
  | "on-site"
  | "snagging"
  | "handover"
  | "closed";

export type Rag = "green" | "amber" | "red";

export interface Person {
  id: string;
  name: string;
  initials: string;
  role: RoleKey;
  title: string;
}

export interface Project {
  id: string;
  ref: string;
  name: string;
  client: string;
  location: string;
  type: string;
  heritage: boolean;
  stage: ProjectStage;
  pmId: string;
  qsId: string;
  siteManagerId: string;
  contractValuePence: number;
  budgetPence: number;
  committedPence: number;
  actualPence: number;
  valueEarnedPence: number;
  costToCompletePence: number;
  forecastMarginPct: number;
  cashRag: Rag;
  progressPct: number;
  startDate: string;
  endDate: string;
  xeroTracking: string;
  sharepointUrl: string;
  teamsChannel: string;
}

export type EnquiryStage = "new" | "qualifying" | "surveyed" | "converted" | "lost" | "dormant";

export interface EnquiryEvent {
  date: string;
  by: string;
  text: string;
  kind: "note" | "email" | "call" | "survey" | "stage" | "ai";
}

export interface Enquiry {
  id: string;
  ref: string;
  client: string;
  contact: string;
  email: string;
  phone: string;
  source: "Website" | "Referral" | "Repeat client" | "Architect" | "Checkatrade" | "Social";
  site: string;
  type: string;
  description: string;
  potentialValuePence: number;
  ownerId: string;
  stage: EnquiryStage;
  receivedDate: string;
  ageDays: number;
  lossReason?: string;
  events: EnquiryEvent[];
}

export type LineKind = "labour" | "material" | "plant" | "subcontract";

export interface EstimateLine {
  id: string;
  description: string;
  qty: number;
  unit: string;
  kind: LineKind;
  ratePence: number;
  cardRatePence: number;
}

export interface EstimatePackage {
  code: string;
  name: string;
  lines: EstimateLine[];
}

export interface Estimate {
  id: string;
  ref: string;
  enquiryRef: string;
  title: string;
  client: string;
  version: number;
  status: "draft" | "internal review" | "approved" | "submitted";
  overheadPct: number;
  marginPct: number;
  packages: EstimatePackage[];
  assumptions: string[];
  exclusions: string[];
}

export type VariationStatus = "approved" | "pending" | "disputed" | "submitted";

export interface Variation {
  ref: string;
  projectId: string;
  description: string;
  raised: string;
  costPence: number;
  valuePence: number;
  timeDays: number;
  status: VariationStatus;
  ageDays: number;
  rfiRef?: string;
}

export interface PurchaseOrder {
  ref: string;
  supplier: string;
  projectId: string;
  costCode: string;
  costCodeName: string;
  valuePence: number;
  invoicedPence: number;
  status: "awaiting approval" | "approved" | "part delivered" | "complete" | "on hire";
  raisedBy: string;
  raised: string;
}

export interface XeroBill {
  id: string;
  supplier: string;
  invoiceNo: string;
  date: string;
  netPence: number;
  vatPence: number;
  poRef?: string;
  projectId?: string;
  costCode?: string;
  status: "matched" | "exception" | "awaiting review";
  note?: string;
  source: "Xero feed" | "Scanned (AI)";
}

export interface CashWeek {
  week: number;
  label: string;
  inPence: number;
  outPence: number;
}

export interface Scenario {
  key: string;
  name: string;
  description: string;
  weeks: CashWeek[];
}

export interface GateCheck {
  label: string;
  done: boolean;
  detail?: string;
}

export interface StageGate {
  projectId: string;
  from: ProjectStage;
  to: ProjectStage;
  checks: GateCheck[];
}

export interface DocumentRecord {
  id: string;
  projectId: string;
  number: string;
  title: string;
  category: "Drawing" | "RAMS" | "Quote" | "Contract" | "Specification" | "Photo set" | "Handover";
  revision: string;
  status: "Current" | "Superseded" | "For comment";
  issuedBy: string;
  date: string;
  aiNote?: string;
}

export interface Rams {
  id: string;
  projectId: string;
  title: string;
  activity: string;
  status: "Approved" | "Draft (AI)" | "Expired" | "Review due";
  approvedBy?: string;
  reviewDate: string;
  signedOn: number;
  required: number;
}

export interface Snag {
  id: string;
  projectId: string;
  location: string;
  description: string;
  severity: "critical" | "minor";
  owner: string;
  status: "open" | "fixed" | "accepted";
  ageDays: number;
}

export interface ComplianceItem {
  party: string;
  kind: "CSCS" | "Public liability" | "Employer's liability" | "Gas Safe" | "NICEIC" | "SSSTS";
  expires: string;
  daysLeft: number;
}

export interface Timesheet {
  id: string;
  party: string;
  projectId: string;
  costCode: string;
  week: string;
  hours: number[];
  operatives: number[];
  ratePence: number;
  status: "submitted" | "approved";
}

export interface DiaryEntry {
  date: string;
  projectId: string;
  by: string;
  weather: string;
  labour: string;
  progress: string;
  deliveries: string;
  delays: string;
  instructions: string;
  visitors: string;
  dictated: boolean;
}

export interface ProgrammeTask {
  id: string;
  projectId: string;
  name: string;
  startWeek: number;
  weeks: number;
  baselineStartWeek: number;
  baselineWeeks: number;
  progressPct: number;
  critical: boolean;
}

export interface Attention {
  id: string;
  rag: Rag;
  text: string;
  value?: string;
  href: string;
}
