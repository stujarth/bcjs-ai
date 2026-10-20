// Illustrative data only. Every name, figure and date is fictional.
import type {
  Attention,
  ComplianceItem,
  DiaryEntry,
  DocumentRecord,
  Enquiry,
  Estimate,
  LineKind,
  Person,
  ProgrammeTask,
  Project,
  PurchaseOrder,
  Rams,
  Scenario,
  Snag,
  StageGate,
  Timesheet,
  Variation,
  XeroBill,
} from "./types";

export const TODAY = "Tue 20 Oct 2026";

export const people: Person[] = [
  { id: "em", name: "Emma Milne", initials: "EM", role: "director", title: "Director" },
  { id: "lm", name: "Lucy Milne", initials: "LM", role: "pm", title: "Operations & Development" },
  { id: "jp", name: "James Price", initials: "JP", role: "qs", title: "Quantity Surveyor" },
  { id: "rh", name: "Rhian Howells", initials: "RH", role: "finance", title: "Finance" },
  { id: "dr", name: "Dave Rowntree", initials: "DR", role: "site", title: "Site Manager" },
  { id: "gt", name: "Gareth Thomas", initials: "GT", role: "pm", title: "Project Manager" },
  { id: "lj", name: "Llanover Joinery Co", initials: "LJ", role: "subcontractor", title: "Subcontractor" },
];

export const personById = (id: string) => people.find((p) => p.id === id);

export const projects: Project[] = [
  {
    id: "goytre",
    ref: "BCJS-2611",
    name: "Goytre Grange",
    client: "Mr & Mrs Ashworth",
    location: "Goytre, Monmouthshire",
    type: "Barn conversion",
    heritage: true,
    stage: "on-site",
    pmId: "gt",
    qsId: "jp",
    siteManagerId: "dr",
    contractValuePence: 84_890_000,
    budgetPence: 72_640_000,
    committedPence: 61_220_000,
    actualPence: 42_789_000,
    valueEarnedPence: 52_235_000,
    costToCompletePence: 32_655_000,
    forecastMarginPct: 14.2,
    cashRag: "amber",
    progressPct: 58,
    startDate: "06 Jul 2026",
    endDate: "18 Dec 2026",
    xeroTracking: "Project: BCJS-2611",
    sharepointUrl: "bcjs.sharepoint.com/sites/BCJS-2611-GoytreGrange",
    teamsChannel: "Projects › Goytre Grange",
  },
  {
    id: "raglan",
    ref: "BCJS-2604",
    name: "Raglan Court",
    client: "Raglan Court Estates Ltd",
    location: "Raglan, Monmouthshire",
    type: "Grade II listed restoration",
    heritage: true,
    stage: "on-site",
    pmId: "lm",
    qsId: "jp",
    siteManagerId: "dr",
    contractValuePence: 46_200_000,
    budgetPence: 39_800_000,
    committedPence: 30_150_000,
    actualPence: 24_310_000,
    valueEarnedPence: 28_900_000,
    costToCompletePence: 15_200_000,
    forecastMarginPct: 12.6,
    cashRag: "green",
    progressPct: 64,
    startDate: "11 May 2026",
    endDate: "27 Nov 2026",
    xeroTracking: "Project: BCJS-2604",
    sharepointUrl: "bcjs.sharepoint.com/sites/BCJS-2604-RaglanCourt",
    teamsChannel: "Projects › Raglan Court",
  },
  {
    id: "usk",
    ref: "BCJS-2615",
    name: "Usk Meadows",
    client: "Dr P. Kaur",
    location: "Usk, Monmouthshire",
    type: "Contemporary rear extension",
    heritage: false,
    stage: "on-site",
    pmId: "gt",
    qsId: "jp",
    siteManagerId: "dr",
    contractValuePence: 18_640_000,
    budgetPence: 15_900_000,
    committedPence: 11_480_000,
    actualPence: 8_120_000,
    valueEarnedPence: 9_400_000,
    costToCompletePence: 7_350_000,
    forecastMarginPct: 15.1,
    cashRag: "green",
    progressPct: 46,
    startDate: "24 Aug 2026",
    endDate: "05 Feb 2027",
    xeroTracking: "Project: BCJS-2615",
    sharepointUrl: "bcjs.sharepoint.com/sites/BCJS-2615-UskMeadows",
    teamsChannel: "Projects › Usk Meadows",
  },
  {
    id: "mamhilad",
    ref: "BCJS-2608",
    name: "Mamhilad Rise",
    client: "Mamhilad Homes LLP",
    location: "Mamhilad, Torfaen",
    type: "Eco new build (2 plots)",
    heritage: false,
    stage: "on-site",
    pmId: "lm",
    qsId: "jp",
    siteManagerId: "dr",
    contractValuePence: 61_500_000,
    budgetPence: 54_300_000,
    committedPence: 47_900_000,
    actualPence: 38_400_000,
    valueEarnedPence: 41_200_000,
    costToCompletePence: 17_600_000,
    forecastMarginPct: 9.8,
    cashRag: "red",
    progressPct: 71,
    startDate: "02 Mar 2026",
    endDate: "13 Nov 2026",
    xeroTracking: "Project: BCJS-2608",
    sharepointUrl: "bcjs.sharepoint.com/sites/BCJS-2608-MamhiladRise",
    teamsChannel: "Projects › Mamhilad Rise",
  },
  {
    id: "llanover",
    ref: "BCJS-2617",
    name: "Llanover Lodge",
    client: "Ms H. Jenkins",
    location: "Llanover, Monmouthshire",
    type: "Oak-frame garden room & balcony",
    heritage: false,
    stage: "pre-start",
    pmId: "gt",
    qsId: "jp",
    siteManagerId: "dr",
    contractValuePence: 9_850_000,
    budgetPence: 8_210_000,
    committedPence: 2_140_000,
    actualPence: 0,
    valueEarnedPence: 0,
    costToCompletePence: 8_210_000,
    forecastMarginPct: 16.7,
    cashRag: "green",
    progressPct: 0,
    startDate: "02 Nov 2026",
    endDate: "18 Dec 2026",
    xeroTracking: "Project: BCJS-2617",
    sharepointUrl: "bcjs.sharepoint.com/sites/BCJS-2617-LlanoverLodge",
    teamsChannel: "Projects › Llanover Lodge",
  },
  {
    id: "abergavenny",
    ref: "BCJS-2598",
    name: "Nevill Street Townhouse",
    client: "Mr T. Rees",
    location: "Abergavenny, Monmouthshire",
    type: "Bespoke kitchen & family bathroom",
    heritage: false,
    stage: "snagging",
    pmId: "lm",
    qsId: "jp",
    siteManagerId: "dr",
    contractValuePence: 7_420_000,
    budgetPence: 6_280_000,
    committedPence: 6_190_000,
    actualPence: 6_050_000,
    valueEarnedPence: 7_100_000,
    costToCompletePence: 230_000,
    forecastMarginPct: 15.6,
    cashRag: "green",
    progressPct: 97,
    startDate: "13 Jul 2026",
    endDate: "16 Oct 2026",
    xeroTracking: "Project: BCJS-2598",
    sharepointUrl: "bcjs.sharepoint.com/sites/BCJS-2598-NevillSt",
    teamsChannel: "Projects › Nevill Street",
  },
];

export const projectById = (id: string) => projects.find((p) => p.id === id);
export const liveProjects = projects.filter((p) => p.stage !== "closed");

export const enquiries: Enquiry[] = [
  {
    id: "e1", ref: "ENQ-0412", client: "Mr & Mrs Bowen", contact: "Sian Bowen", email: "sian.bowen@example.com", phone: "07700 900412",
    source: "Website", site: "Llanfoist, Abergavenny", type: "Two-storey side extension",
    description: "Two-storey side extension with open-plan kitchen below and en-suite above. Planning approved.",
    potentialValuePence: 14_500_000, ownerId: "lm", stage: "new", receivedDate: "19 Oct 2026", ageDays: 1,
    events: [
      { date: "19 Oct 09:12", by: "Website form", text: "Enquiry received via bcjs.co.uk contact form.", kind: "email" },
      { date: "19 Oct 09:13", by: "BCJS AI", text: "Duplicate check: no existing client match. Suggested owner: Lucy Milne (extensions).", kind: "ai" },
    ],
  },
  {
    id: "e2", ref: "ENQ-0409", client: "St Cadoc's PCC", contact: "Rev. A. Morgan", email: "pcc@example.org", phone: "01873 000409",
    source: "Architect", site: "Llancarfan", type: "Listed church hall – lime repointing & roof repair",
    description: "Grade II listed church hall. Lime repointing to two elevations, re-slate north pitch, replace lead flashing. Conservation officer engaged.",
    potentialValuePence: 6_800_000, ownerId: "gt", stage: "qualifying", receivedDate: "12 Oct 2026", ageDays: 8,
    events: [
      { date: "12 Oct", by: "Hartley Architects", text: "Tender invitation received with drawings and conservation report.", kind: "email" },
      { date: "14 Oct", by: "Gareth Thomas", text: "Called Rev. Morgan – budget c.£70k, start spring 2027.", kind: "call" },
      { date: "15 Oct", by: "Weekly review", text: "Moved to qualifying. Need scaffold access details.", kind: "stage" },
    ],
  },
  {
    id: "e3", ref: "ENQ-0405", client: "The Old Forge LLP", contact: "Huw Pritchard", email: "huw@example.com", phone: "07700 900405",
    source: "Repeat client", site: "Usk", type: "Barn conversion to holiday let",
    description: "Stone barn conversion to 2-bed holiday let. Oak frame internal, lime render, ASHP.",
    potentialValuePence: 38_000_000, ownerId: "lm", stage: "surveyed", receivedDate: "28 Sep 2026", ageDays: 22,
    events: [
      { date: "28 Sep", by: "Huw Pritchard", text: "Repeat client – asked for budget price for the second barn.", kind: "email" },
      { date: "06 Oct", by: "Lucy Milne", text: "Site survey completed – 42 photos, 18 measurements.", kind: "survey" },
      { date: "06 Oct", by: "BCJS AI", text: "Survey summarised into draft scope: 9 packages, 3 risks flagged (bat survey, ground conditions, access).", kind: "ai" },
      { date: "08 Oct", by: "Weekly review", text: "Qualified. Ready to convert to tender.", kind: "stage" },
    ],
  },
  {
    id: "e4", ref: "ENQ-0401", client: "Mrs E. Watkins", contact: "Eleri Watkins", email: "eleri@example.com", phone: "07700 900401",
    source: "Referral", site: "Pontypool", type: "Kitchen & utility refit",
    description: "Bespoke painted kitchen, utility room, new flooring throughout ground floor.",
    potentialValuePence: 3_900_000, ownerId: "gt", stage: "converted", receivedDate: "16 Sep 2026", ageDays: 34,
    events: [
      { date: "16 Sep", by: "Referral", text: "Referred by Mr T. Rees (Nevill Street).", kind: "note" },
      { date: "02 Oct", by: "Gareth Thomas", text: "Converted to tender EST-0233.", kind: "stage" },
    ],
  },
  {
    id: "e5", ref: "ENQ-0398", client: "Monmouth Rugby Club", contact: "Owain Lloyd", email: "owain@example.com", phone: "01600 000398",
    source: "Social", site: "Monmouth", type: "Clubhouse changing room refurbishment",
    description: "Changing room strip-out and refit.",
    potentialValuePence: 9_200_000, ownerId: "lm", stage: "lost", receivedDate: "01 Sep 2026", ageDays: 49, lossReason: "Price",
    events: [
      { date: "01 Sep", by: "Owain Lloyd", text: "Enquiry via Facebook.", kind: "note" },
      { date: "29 Sep", by: "Lucy Milne", text: "Lost on price – winner c.8% lower.", kind: "stage" },
    ],
  },
  {
    id: "e6", ref: "ENQ-0407", client: "Mr J. Davies", contact: "John Davies", email: "jd@example.com", phone: "07700 900407",
    source: "Checkatrade", site: "Cwmbran", type: "Garage conversion",
    description: "Single garage conversion to home office with WC.",
    potentialValuePence: 2_600_000, ownerId: "gt", stage: "qualifying", receivedDate: "09 Oct 2026", ageDays: 11,
    events: [{ date: "09 Oct", by: "Checkatrade", text: "Lead received.", kind: "email" }],
  },
  {
    id: "e7", ref: "ENQ-0389", client: "Caerleon Holdings", contact: "Bethan Evans", email: "bethan@example.com", phone: "01633 000389",
    source: "Architect", site: "Caerleon", type: "Georgian townhouse sash window restoration",
    description: "Restore 14 sash windows, replace 3 like-for-like.",
    potentialValuePence: 4_100_000, ownerId: "lm", stage: "dormant", receivedDate: "11 Aug 2026", ageDays: 70,
    events: [{ date: "11 Aug", by: "Architect", text: "Enquiry received – client deferred to 2027.", kind: "email" }],
  },
  {
    id: "e8", ref: "ENQ-0411", client: "Mr & Mrs Hale", contact: "Tom Hale", email: "tom.hale@example.com", phone: "07700 900411",
    source: "Website", site: "Monmouth", type: "Oak-frame porch & timber restoration",
    description: "New oak-frame porch and repair of rotten sole plates on 1890s cottage.",
    potentialValuePence: 2_250_000, ownerId: "gt", stage: "new", receivedDate: "18 Oct 2026", ageDays: 2,
    events: [{ date: "18 Oct", by: "Website form", text: "Enquiry received.", kind: "email" }],
  },
];

const L = (id: string, description: string, qty: number, unit: string, kind: LineKind, rate: number, card?: number) => ({
  id, description, qty, unit, kind, ratePence: rate, cardRatePence: card ?? rate,
});

export const estimates: Estimate[] = [
  {
    id: "est-0236",
    ref: "EST-0236",
    enquiryRef: "ENQ-0405",
    title: "The Old Forge – barn conversion to holiday let",
    client: "The Old Forge LLP",
    version: 2,
    status: "internal review",
    overheadPct: 8,
    marginPct: 12,
    packages: [
      {
        code: "PRE", name: "Preliminaries", lines: [
          L("p1", "Site set-up, welfare & hoarding", 1, "item", "plant", 420_000),
          L("p2", "Scaffold – full perimeter, 14 weeks", 14, "wk", "subcontract", 68_000),
          L("p3", "Site manager (part-time allocation)", 14, "wk", "labour", 95_000),
        ],
      },
      {
        code: "GRD", name: "Groundworks & drainage", lines: [
          L("g1", "Excavate for new slab, cart away", 62, "m³", "plant", 4_800),
          L("g2", "Foul drainage run to septic tank", 28, "m", "subcontract", 9_400),
          L("g3", "Limecrete slab with insulation", 86, "m²", "material", 7_900, 7_200),
        ],
      },
      {
        code: "MAS", name: "Stone & lime masonry", lines: [
          L("m1", "Rake out & repoint in NHL 3.5 lime", 210, "m²", "labour", 6_200),
          L("m2", "Rebuild collapsed gable section in reclaimed stone", 14, "m²", "labour", 28_500),
          L("m3", "Lime render, three-coat, to rear elevation", 74, "m²", "subcontract", 7_600),
        ],
      },
      {
        code: "JOI", name: "Joinery & oak frame", lines: [
          L("j1", "Green oak internal frame – supply & erect", 1, "item", "subcontract", 3_850_000),
          L("j2", "Bespoke oak staircase", 1, "item", "material", 680_000),
          L("j3", "Timber sash windows, double glazed", 9, "nr", "material", 165_000, 152_000),
        ],
      },
      {
        code: "ROF", name: "Roofing", lines: [
          L("r1", "Strip & re-slate in reclaimed Welsh slate", 148, "m²", "subcontract", 11_200),
          L("r2", "Lead flashings & valleys", 1, "item", "subcontract", 320_000),
        ],
      },
      {
        code: "MEP", name: "Mechanical & electrical", lines: [
          L("e1", "Air source heat pump & UFH", 1, "item", "subcontract", 1_450_000),
          L("e2", "Electrical first & second fix", 1, "item", "subcontract", 960_000),
        ],
      },
      {
        code: "FIN", name: "Finishes", lines: [
          L("f1", "Lime plaster to internal walls", 260, "m²", "labour", 3_900),
          L("f2", "Kitchen – supply & fit (PC sum)", 1, "item", "material", 1_200_000),
          L("f3", "Bathroom & en-suite fit-out", 2, "nr", "material", 540_000),
        ],
      },
    ],
    assumptions: [
      "Bat survey returns no roosting constraints.",
      "Existing access lane suitable for 7.5t deliveries.",
      "Building Regulations approval in place before start.",
    ],
    exclusions: ["Planning & building control fees", "Furniture & loose fittings", "Landscaping beyond 2m of the building"],
  },
];

export const variations: Variation[] = [
  { ref: "VO-108", projectId: "goytre", description: "Additional drainage run, plot 4 to 7", raised: "14 Jul", costPence: 924_000, valuePence: 1_160_000, timeDays: 3, status: "approved", ageDays: 98, rfiRef: "RFI-031" },
  { ref: "VO-111", projectId: "goytre", description: "Upgraded ironmongery specification", raised: "02 Aug", costPence: 1_870_000, valuePence: 2_240_000, timeDays: 0, status: "approved", ageDays: 79 },
  { ref: "VO-114", projectId: "goytre", description: "Revised staircase detail, blocks A and B", raised: "13 Aug", costPence: 1_310_000, valuePence: 1_625_000, timeDays: 5, status: "pending", ageDays: 68, rfiRef: "RFI-036" },
  { ref: "VO-116", projectId: "goytre", description: "Ground conditions, additional piling", raised: "21 Aug", costPence: 2_485_000, valuePence: 2_990_000, timeDays: 8, status: "pending", ageDays: 60, rfiRef: "RFI-038" },
  { ref: "VO-117", projectId: "goytre", description: "Rework to first floor joinery", raised: "27 Aug", costPence: 462_000, valuePence: 0, timeDays: 0, status: "disputed", ageDays: 54 },
  { ref: "VO-118", projectId: "goytre", description: "Client instructed finish change, kitchens", raised: "01 Sep", costPence: 730_000, valuePence: 890_000, timeDays: 0, status: "submitted", ageDays: 49 },
  { ref: "VO-121", projectId: "raglan", description: "Additional lime repointing, east elevation", raised: "09 Sep", costPence: 640_000, valuePence: 810_000, timeDays: 4, status: "approved", ageDays: 41 },
  { ref: "VO-123", projectId: "mamhilad", description: "Upgrade to triple glazing, plot 2", raised: "22 Sep", costPence: 1_120_000, valuePence: 1_380_000, timeDays: 0, status: "pending", ageDays: 28 },
];

export const purchaseOrders: PurchaseOrder[] = [
  { ref: "PO-2841", supplier: "Abergavenny Timber & Board", projectId: "goytre", costCode: "JOI-04", costCodeName: "Joinery", valuePence: 4_260_000, invoicedPence: 1_840_000, status: "part delivered", raisedBy: "jp", raised: "18 Aug" },
  { ref: "PO-2846", supplier: "Gwent Aggregates", projectId: "goytre", costCode: "GRD-02", costCodeName: "Groundworks", valuePence: 1_875_000, invoicedPence: 1_875_000, status: "complete", raisedBy: "dr", raised: "21 Aug" },
  { ref: "PO-2851", supplier: "Torfaen Plant Hire", projectId: "mamhilad", costCode: "PLT-01", costCodeName: "Plant", valuePence: 640_000, invoicedPence: 213_000, status: "on hire", raisedBy: "dr", raised: "01 Sep" },
  { ref: "PO-2853", supplier: "Newport Steel Supplies", projectId: "raglan", costCode: "STR-03", costCodeName: "Structural", valuePence: 6_420_000, invoicedPence: 0, status: "awaiting approval", raisedBy: "jp", raised: "15 Oct" },
  { ref: "PO-2854", supplier: "Caerleon Glazing", projectId: "goytre", costCode: "FIN-02", costCodeName: "Finishing", valuePence: 2_190_000, invoicedPence: 0, status: "approved", raisedBy: "jp", raised: "12 Oct" },
  { ref: "PO-2856", supplier: "Llanover Joinery Co", projectId: "usk", costCode: "JOI-01", costCodeName: "Joinery", valuePence: 3_745_000, invoicedPence: 1_230_000, status: "part delivered", raisedBy: "gt", raised: "05 Sep" },
  { ref: "PO-2858", supplier: "Ty Mawr Lime", projectId: "raglan", costCode: "MAS-02", costCodeName: "Lime & masonry", valuePence: 486_000, invoicedPence: 486_000, status: "complete", raisedBy: "dr", raised: "22 Sep" },
  { ref: "PO-2861", supplier: "Brecon Reclaimed Slate", projectId: "goytre", costCode: "ROF-01", costCodeName: "Roofing", valuePence: 1_610_000, invoicedPence: 0, status: "awaiting approval", raisedBy: "jp", raised: "19 Oct" },
  { ref: "PO-2862", supplier: "Usk Valley Electrical", projectId: "usk", costCode: "MEP-02", costCodeName: "Electrical", valuePence: 940_000, invoicedPence: 0, status: "awaiting approval", raisedBy: "gt", raised: "19 Oct" },
  { ref: "PO-2863", supplier: "Gwent Aggregates", projectId: "llanover", costCode: "GRD-02", costCodeName: "Groundworks", valuePence: 214_000, invoicedPence: 0, status: "awaiting approval", raisedBy: "dr", raised: "20 Oct" },
];

export const approvalBands = [
  { upToPence: 250_000, approver: "Site Manager" },
  { upToPence: 1_000_000, approver: "Project Manager" },
  { upToPence: 5_000_000, approver: "Quantity Surveyor + PM" },
  { upToPence: Number.MAX_SAFE_INTEGER, approver: "Director" },
];

export const xeroBills: XeroBill[] = [
  { id: "x1", supplier: "Abergavenny Timber & Board", invoiceNo: "ATB-55120", date: "16 Oct", netPence: 1_998_000, vatPence: 399_600, poRef: "PO-2841", projectId: "goytre", costCode: "JOI-04", status: "exception", note: "Oak boards invoiced at £68.20/m vs £63.10/m on order (+8%). £1,480 over.", source: "Xero feed" },
  { id: "x2", supplier: "Gwent Aggregates", invoiceNo: "GA-20931", date: "15 Oct", netPence: 412_500, vatPence: 82_500, poRef: "PO-2846", projectId: "goytre", costCode: "GRD-02", status: "matched", source: "Xero feed" },
  { id: "x3", supplier: "Torfaen Plant Hire", invoiceNo: "TPH-7781", date: "14 Oct", netPence: 106_500, vatPence: 21_300, poRef: "PO-2851", projectId: "mamhilad", costCode: "PLT-01", status: "matched", source: "Xero feed" },
  { id: "x4", supplier: "Ty Mawr Lime", invoiceNo: "TML-3302", date: "13 Oct", netPence: 486_000, vatPence: 97_200, poRef: "PO-2858", projectId: "raglan", costCode: "MAS-02", status: "matched", source: "Scanned (AI)" },
  { id: "x5", supplier: "Llanover Joinery Co", invoiceNo: "LJC-0419", date: "17 Oct", netPence: 294_200, vatPence: 58_840, poRef: "PO-2856", projectId: "usk", costCode: "JOI-01", status: "awaiting review", note: "Matches approved timesheet wk 41 (86.5 h). Confirm to post.", source: "Scanned (AI)" },
  { id: "x6", supplier: "Screwfix Trade", invoiceNo: "SFX-88123", date: "17 Oct", netPence: 18_640, vatPence: 3_728, status: "exception", note: "No purchase order. Suggested: Goytre Grange / GEN-01 Consumables.", source: "Xero feed" },
  { id: "x7", supplier: "Caerleon Glazing", invoiceNo: "CG-1102", date: "18 Oct", netPence: 730_000, vatPence: 146_000, poRef: "PO-2854", projectId: "goytre", costCode: "FIN-02", status: "matched", source: "Xero feed" },
];

function weeks(series: Array<[number, number]>) {
  const start = 42; // ISO week of 19 Oct 2026
  return series.map(([inP, outP], i) => ({
    week: i + 1,
    label: `W${start + i > 53 ? start + i - 53 : start + i}`,
    inPence: inP * 100_000,
    outPence: outP * 100_000,
  }));
}

// Values in £k for readability, converted to pence above.
export const scenarios: Scenario[] = [
  {
    key: "base",
    name: "Base case",
    description: "Built from programme, payment terms and approved valuations.",
    weeks: weeks([
      [96, 48], [12, 62], [8, 41], [148, 58], [22, 66], [10, 71], [6, 49], [132, 55], [18, 47], [14, 52], [86, 44], [9, 38], [64, 40],
    ]),
  },
  {
    key: "goytre-delay",
    name: "Goytre +4 weeks",
    description: "Goytre Grange completion slips four weeks; valuation 6 moves to W51.",
    weeks: weeks([
      [96, 48], [12, 62], [8, 44], [88, 61], [22, 66], [10, 74], [6, 52], [132, 58], [18, 49], [74, 52], [86, 46], [9, 38], [64, 40],
    ]),
  },
  {
    key: "late-pay",
    name: "Client pays at 60 days",
    description: "All client receipts slip from 14 to 60 days.",
    weeks: weeks([
      [24, 48], [12, 62], [8, 41], [96, 58], [22, 66], [10, 71], [6, 49], [148, 55], [18, 47], [14, 52], [132, 44], [9, 38], [86, 40],
    ]),
  },
];

export const openingCashPence = 18_200_000;
export const retentionHeldPence = 5_840_000;

export const stageGates: StageGate[] = [
  {
    projectId: "llanover",
    from: "pre-start",
    to: "on-site",
    checks: [
      { label: "Budget baseline approved & locked", done: true, detail: "Locked by J. Price, 14 Oct" },
      { label: "PM, QS and site manager named", done: true },
      { label: "RAMS in date – oak frame erection", done: false, detail: "Draft (AI) awaiting competent-person sign-off" },
      { label: "Subcontractor insurance in date", done: false, detail: "Llanover Joinery Co – PL expires in 9 days" },
      { label: "Operative certifications in date", done: true },
      { label: "Pre-start meeting held & minuted", done: true, detail: "Teams meeting 15 Oct, minutes filed" },
      { label: "Client order reference recorded", done: true, detail: "PO HJ-2026-01" },
    ],
  },
  {
    projectId: "abergavenny",
    from: "snagging",
    to: "handover",
    checks: [
      { label: "No critical snags open", done: false, detail: "1 critical: extractor ducting" },
      { label: "Handover pack assembled", done: false, detail: "2 of 9 items missing" },
      { label: "Building control completion certificate", done: true },
      { label: "Client acceptance of minor snags", done: true },
    ],
  },
];

export const documents: DocumentRecord[] = [
  { id: "d1", projectId: "goytre", number: "HA-GG-201", title: "Ground floor plan", category: "Drawing", revision: "C", status: "Current", issuedBy: "Hartley Architects", date: "02 Oct", aiNote: "Title block read: Rev C supersedes Rev B (staircase relocated 450mm)." },
  { id: "d2", projectId: "goytre", number: "HA-GG-201", title: "Ground floor plan", category: "Drawing", revision: "B", status: "Superseded", issuedBy: "Hartley Architects", date: "21 Jul" },
  { id: "d3", projectId: "goytre", number: "HA-GG-310", title: "Staircase details, blocks A & B", category: "Drawing", revision: "A", status: "For comment", issuedBy: "Hartley Architects", date: "13 Aug", aiNote: "Linked to VO-114 and RFI-036." },
  { id: "d4", projectId: "goytre", number: "SE-GG-05", title: "Piling layout", category: "Drawing", revision: "P2", status: "Current", issuedBy: "Cardiff Structures", date: "24 Aug" },
  { id: "d5", projectId: "goytre", number: "RAMS-GG-07", title: "Working at height – roof", category: "RAMS", revision: "2", status: "Current", issuedBy: "Dave Rowntree", date: "10 Sep" },
  { id: "d6", projectId: "goytre", number: "Q-0219-v3", title: "Quotation v3 (accepted)", category: "Quote", revision: "3", status: "Current", issuedBy: "BCJS", date: "12 Jun" },
  { id: "d7", projectId: "goytre", number: "JCT-MW-2611", title: "JCT Minor Works – signed", category: "Contract", revision: "1", status: "Current", issuedBy: "Acrobat Sign", date: "24 Jun" },
  { id: "d8", projectId: "goytre", number: "SPEC-GG-LIME", title: "Lime mortar & render specification", category: "Specification", revision: "1", status: "Current", issuedBy: "Ty Mawr Lime", date: "30 Jun" },
  { id: "d9", projectId: "goytre", number: "PH-GG-VO108", title: "VO-108 drainage evidence (7 of 8)", category: "Photo set", revision: "-", status: "Current", issuedBy: "Site app", date: "19 Oct" },
];

export const rams: Rams[] = [
  { id: "r1", projectId: "goytre", title: "Working at height – roof", activity: "Re-slating & leadwork", status: "Approved", approvedBy: "Dave Rowntree", reviewDate: "10 Dec 2026", signedOn: 5, required: 5 },
  { id: "r2", projectId: "goytre", title: "Lime works", activity: "Repointing & render in NHL lime", status: "Approved", approvedBy: "Dave Rowntree", reviewDate: "02 Jan 2027", signedOn: 3, required: 4 },
  { id: "r3", projectId: "llanover", title: "Oak frame erection", activity: "Crane-assisted frame lift", status: "Draft (AI)", reviewDate: "–", signedOn: 0, required: 6 },
  { id: "r4", projectId: "mamhilad", title: "Excavations & groundworks", activity: "Drainage trenching >1.2m", status: "Review due", approvedBy: "Dave Rowntree", reviewDate: "22 Oct 2026", signedOn: 4, required: 4 },
];

export const snags: Snag[] = [
  { id: "s1", projectId: "abergavenny", location: "Kitchen", description: "Extractor ducting not connected to external grille", severity: "critical", owner: "Usk Valley Electrical", status: "open", ageDays: 3 },
  { id: "s2", projectId: "abergavenny", location: "Bathroom", description: "Silicone bead uneven at bath end", severity: "minor", owner: "BCJS – joinery", status: "open", ageDays: 3 },
  { id: "s3", projectId: "abergavenny", location: "Utility", description: "Cabinet door hinge adjustment", severity: "minor", owner: "BCJS – joinery", status: "fixed", ageDays: 5 },
  { id: "s4", projectId: "abergavenny", location: "Hall", description: "Paint touch-up to skirting", severity: "minor", owner: "BCJS – decorating", status: "accepted", ageDays: 6 },
];

export const compliance: ComplianceItem[] = [
  { party: "Llanover Joinery Co", kind: "Public liability", expires: "29 Oct 2026", daysLeft: 9 },
  { party: "K. Baird", kind: "CSCS", expires: "07 Nov 2026", daysLeft: 18 },
  { party: "Usk Valley Electrical", kind: "NICEIC", expires: "15 Nov 2026", daysLeft: 26 },
];

export const timesheets: Timesheet[] = [
  { id: "t1", party: "Llanover Joinery Co", projectId: "usk", costCode: "JOI-01", week: "Wk 43", hours: [16, 24, 22.5, 24, 0], operatives: [2, 3, 3, 3, 0], ratePence: 3_400, status: "submitted" },
  { id: "t2", party: "Gwent Groundworks", projectId: "goytre", costCode: "GRD-02", week: "Wk 43", hours: [18, 18, 18, 9, 0], operatives: [2, 2, 2, 1, 0], ratePence: 3_100, status: "submitted" },
  { id: "t3", party: "M. Ellery (BCJS)", projectId: "goytre", costCode: "MAS-01", week: "Wk 43", hours: [8, 8, 8, 8, 0], operatives: [1, 1, 1, 1, 0], ratePence: 2_800, status: "submitted" },
  { id: "t4", party: "Brecon Roofing", projectId: "raglan", costCode: "ROF-01", week: "Wk 43", hours: [24, 24, 16, 0, 0], operatives: [3, 3, 2, 0, 0], ratePence: 3_300, status: "submitted" },
];

export const diary: DiaryEntry[] = [
  {
    date: "Mon 19 Oct", projectId: "goytre", by: "Dave Rowntree", weather: "Overcast, light rain pm, 11°C",
    labour: "3 × Llanover Joinery, 2 × Gwent Groundworks, 1 × BCJS mason",
    progress: "First floor joists 80% complete block A. Drainage backfill plot 4–7 complete.",
    deliveries: "Abergavenny Timber – oak boards (partial, 60%).",
    delays: "Rain stopped lime pointing at 14:00 (frost-risk protocol).",
    instructions: "Client confirmed kitchen finish change (VO-118) verbally – written instruction requested.",
    visitors: "Building control – drainage inspection passed.",
    dictated: true,
  },
];

export const programme: ProgrammeTask[] = [
  { id: "pt1", projectId: "goytre", name: "Strip-out & enabling", startWeek: 1, weeks: 2, baselineStartWeek: 1, baselineWeeks: 2, progressPct: 100, critical: false },
  { id: "pt2", projectId: "goytre", name: "Groundworks & piling", startWeek: 3, weeks: 5, baselineStartWeek: 3, baselineWeeks: 4, progressPct: 100, critical: true },
  { id: "pt3", projectId: "goytre", name: "Drainage", startWeek: 6, weeks: 3, baselineStartWeek: 5, baselineWeeks: 3, progressPct: 100, critical: false },
  { id: "pt4", projectId: "goytre", name: "Stone & lime masonry", startWeek: 7, weeks: 8, baselineStartWeek: 6, baselineWeeks: 8, progressPct: 65, critical: true },
  { id: "pt5", projectId: "goytre", name: "Oak frame & first floor", startWeek: 10, weeks: 6, baselineStartWeek: 9, baselineWeeks: 6, progressPct: 70, critical: true },
  { id: "pt6", projectId: "goytre", name: "Roofing", startWeek: 14, weeks: 4, baselineStartWeek: 13, baselineWeeks: 4, progressPct: 10, critical: true },
  { id: "pt7", projectId: "goytre", name: "M&E first fix", startWeek: 15, weeks: 3, baselineStartWeek: 14, baselineWeeks: 3, progressPct: 0, critical: false },
  { id: "pt8", projectId: "goytre", name: "Finishes & kitchens", startWeek: 18, weeks: 5, baselineStartWeek: 17, baselineWeeks: 5, progressPct: 0, critical: true },
  { id: "pt9", projectId: "goytre", name: "Snagging & handover", startWeek: 23, weeks: 2, baselineStartWeek: 22, baselineWeeks: 2, progressPct: 0, critical: true },
];

export const attention: Attention[] = [
  { id: "a1", rag: "red", text: "Mamhilad Rise forecast margin below 10% threshold", value: "9.8%", href: "/projects/mamhilad" },
  { id: "a2", rag: "red", text: "Goytre Grange groundworks 8% over budget", value: "£11,400", href: "/commercial" },
  { id: "a3", rag: "amber", text: "VO-114 pending client approval for 68 days", value: "£16,250", href: "/commercial" },
  { id: "a4", rag: "amber", text: "4 POs awaiting approval", value: "£91.9k", href: "/procurement" },
  { id: "a5", rag: "amber", text: "Llanover Joinery public liability expires in 9 days", href: "/projects/llanover" },
  { id: "a6", rag: "amber", text: "4 timesheets awaiting approval", href: "/site" },
];

export const integrations = [
  { name: "Microsoft Entra ID", area: "Sign-in & MFA", status: "connected", detail: "SSO for 14 staff · conditional access enforced by BCJS tenant" },
  { name: "SharePoint", area: "Documents", status: "connected", detail: "6 project sites provisioned · document register synced" },
  { name: "Outlook", area: "Quotes & replies", status: "connected", detail: "estimating@bcjs.co.uk shared mailbox · 23 replies auto-filed this month" },
  { name: "Teams", area: "Approvals & alerts", status: "connected", detail: "Project channels created at award · approvals as Adaptive Cards" },
  { name: "Xero", area: "Ledger", status: "connected", detail: "Bespoke Construction & Joinery Solutions Ltd · last sync 4 min ago · 0 errors" },
  { name: "Adobe Acrobat Sign", area: "Client acceptance", status: "connected", detail: "Quote & contract signatures filed back to the register" },
  { name: "Claude (Anthropic)", area: "AI assistant & extraction", status: "connected", detail: "UK/EU processing · zero data retention · every AI action audited" },
  { name: "Microsoft 365 Copilot", area: "Agent", status: "planned", detail: "BCJS Operations agent – ask questions from Copilot chat (R6)" },
  { name: "Kabyn", area: "To confirm in discovery", status: "review", detail: "Replace, integrate or retire – decision D13" },
  { name: "Briefcase", area: "To confirm in discovery", status: "review", detail: "Replace, integrate or retire – decision D13" },
] as const;

// --- Commercial / cash additions (appended) ---

export interface CvrLine {
  costCode: string;
  name: string;
  budgetPence: number;
  committedPence: number;
  actualPence: number;
  forecastFinalPence: number;
}

/** Goytre Grange CVR by cost code, period 8. Variance = budget − forecast final. */
export const cvrLines: Record<string, CvrLine[]> = {
  goytre: [
    { costCode: "PRE-01", name: "Preliminaries", budgetPence: 6_840_000, committedPence: 5_120_000, actualPence: 3_960_000, forecastFinalPence: 6_790_000 },
    { costCode: "GRD-02", name: "Groundworks & piling", budgetPence: 14_250_000, committedPence: 14_980_000, actualPence: 13_820_000, forecastFinalPence: 15_390_000 },
    { costCode: "DRN-01", name: "Drainage", budgetPence: 4_120_000, committedPence: 4_060_000, actualPence: 3_980_000, forecastFinalPence: 4_090_000 },
    { costCode: "MAS-01", name: "Stone & lime masonry", budgetPence: 11_600_000, committedPence: 9_840_000, actualPence: 7_210_000, forecastFinalPence: 11_450_000 },
    { costCode: "JOI-04", name: "Joinery & oak frame", budgetPence: 15_900_000, committedPence: 13_420_000, actualPence: 8_930_000, forecastFinalPence: 15_820_000 },
    { costCode: "ROF-01", name: "Roofing", budgetPence: 7_480_000, committedPence: 5_210_000, actualPence: 980_000, forecastFinalPence: 7_400_000 },
    { costCode: "MEP-01", name: "Mechanical & electrical", budgetPence: 6_950_000, committedPence: 4_870_000, actualPence: 1_240_000, forecastFinalPence: 6_910_000 },
    { costCode: "FIN-02", name: "Finishes & kitchens", budgetPence: 5_500_000, committedPence: 3_720_000, actualPence: 2_669_000, forecastFinalPence: 5_440_000 },
  ],
};

export interface Valuation {
  projectId: string;
  number: number;
  period: string;
  appliedPence: number;
  certifiedPence: number;
  dueDate: string;
  status: "paid" | "certified" | "applied" | "overdue";
}

export const valuations: Valuation[] = [
  { projectId: "goytre", number: 1, period: "Jul 2026", appliedPence: 8_420_000, certifiedPence: 8_420_000, dueDate: "14 Aug", status: "paid" },
  { projectId: "goytre", number: 2, period: "Aug 2026", appliedPence: 12_960_000, certifiedPence: 12_610_000, dueDate: "14 Sep", status: "paid" },
  { projectId: "goytre", number: 3, period: "Sep 2026", appliedPence: 15_880_000, certifiedPence: 15_880_000, dueDate: "14 Oct", status: "paid" },
  { projectId: "goytre", number: 4, period: "Oct 2026", appliedPence: 15_325_000, certifiedPence: 0, dueDate: "13 Nov", status: "applied" },
  { projectId: "raglan", number: 5, period: "Sep 2026", appliedPence: 6_480_000, certifiedPence: 6_480_000, dueDate: "14 Oct", status: "paid" },
  { projectId: "mamhilad", number: 7, period: "Sep 2026", appliedPence: 7_120_000, certifiedPence: 6_840_000, dueDate: "12 Oct", status: "overdue" },
];

export interface OverdueReceipt {
  client: string;
  projectId: string;
  ref: string;
  amountPence: number;
  daysOverdue: number;
}

export const overdueReceipts: OverdueReceipt[] = [
  { client: "Mamhilad Homes LLP", projectId: "mamhilad", ref: "APP-2608-07", amountPence: 2_280_000, daysOverdue: 8 },
  { client: "Mr T. Rees", projectId: "abergavenny", ref: "INV-2598-04", amountPence: 840_000, daysOverdue: 4 },
];

export const cashRagThresholds = { amberMarginPct: 12, redMarginPct: 10, amberLowPointPence: 5_000_000 };

// ---- Compliance: supplier & subcontractor register, incident log ----
export interface Supplier {
  id: string;
  name: string;
  trade: string;
  kind: "Supplier" | "Subcontractor";
  paymentTerms: string;
  plExpiry: string;
  elExpiry: string;
  status: "good" | "expiring" | "expired";
}

export const suppliers: Supplier[] = [
  { id: "su1", name: "Llanover Joinery Co", trade: "Joinery & oak frame", kind: "Subcontractor", paymentTerms: "14 days", plExpiry: "29 Oct 2026", elExpiry: "29 Oct 2026", status: "expiring" },
  { id: "su2", name: "Gwent Groundworks", trade: "Groundworks & drainage", kind: "Subcontractor", paymentTerms: "30 days", plExpiry: "14 Mar 2027", elExpiry: "14 Mar 2027", status: "good" },
  { id: "su3", name: "Brecon Roofing", trade: "Slate & leadwork", kind: "Subcontractor", paymentTerms: "30 days", plExpiry: "02 Feb 2027", elExpiry: "02 Feb 2027", status: "good" },
  { id: "su4", name: "Usk Valley Electrical", trade: "Electrical (NICEIC)", kind: "Subcontractor", paymentTerms: "30 days", plExpiry: "21 Jun 2027", elExpiry: "21 Jun 2027", status: "good" },
  { id: "su5", name: "Abergavenny Timber & Board", trade: "Timber merchant", kind: "Supplier", paymentTerms: "30 days EOM", plExpiry: "–", elExpiry: "–", status: "good" },
  { id: "su6", name: "Ty Mawr Lime", trade: "Lime mortars & renders", kind: "Supplier", paymentTerms: "30 days", plExpiry: "–", elExpiry: "–", status: "good" },
  { id: "su7", name: "Cardiff Scaffold Services", trade: "Scaffolding", kind: "Subcontractor", paymentTerms: "30 days", plExpiry: "12 Oct 2026", elExpiry: "12 Oct 2026", status: "expired" },
  { id: "su8", name: "Torfaen Plant Hire", trade: "Plant hire", kind: "Supplier", paymentTerms: "30 days", plExpiry: "08 Apr 2027", elExpiry: "08 Apr 2027", status: "good" },
];

export interface Incident {
  ref: string;
  date: string;
  projectId: string;
  kind: "Near miss" | "Minor injury" | "Dangerous occurrence";
  description: string;
  reportedBy: string;
  riddor: boolean;
  actions: string;
}

export const incidents: Incident[] = [
  { ref: "INC-014", date: "08 Oct 2026", projectId: "goytre", kind: "Near miss", description: "Unsecured slate fell from scaffold lift into exclusion zone. No one in the area.", reportedBy: "Dave Rowntree", riddor: false, actions: "Toe boards and brick guards checked on all lifts; toolbox talk given 09 Oct." },
  { ref: "INC-013", date: "22 Sep 2026", projectId: "mamhilad", kind: "Minor injury", description: "Operative cut hand on sheet metal flashing. First aid given on site.", reportedBy: "Dave Rowntree", riddor: false, actions: "Cut-resistant gloves made mandatory for flashing work." },
  { ref: "INC-012", date: "04 Sep 2026", projectId: "raglan", kind: "Near miss", description: "Excavator slewed close to overhead line during spoil removal.", reportedBy: "Gareth Thomas", riddor: false, actions: "Goal posts and banksman added; RAMS updated to rev 3." },
];

export interface AuditEvent {
  at: string;
  who: string;
  action: string;
  detail: string;
}

export const auditEvents: Record<string, AuditEvent[]> = {
  goytre: [
    { at: "19 Oct 16:42", who: "Dave Rowntree", action: "diary.submit", detail: "Site diary 19 Oct submitted (dictated)" },
    { at: "19 Oct 11:05", who: "James Price", action: "po.raise", detail: "PO-2861 Brecon Reclaimed Slate £16,100 raised – awaiting approval" },
    { at: "16 Oct 09:30", who: "Xero sync", action: "bill.exception", detail: "ATB-55120 flagged +8% over order rate" },
    { at: "30 Sep 17:00", who: "James Price", action: "cvr.lock", detail: "Period 8 CVR locked and snapshotted" },
    { at: "02 Oct 10:14", who: "BCJS AI", action: "document.supersede", detail: "HA-GG-201 rev C supersedes rev B (title block read, confirmed by Gareth Thomas)" },
  ],
};

export const xeroSyncLog = [
  { at: "20 Oct 09:41", direction: "Xero → OCS", record: "Payment · GA-20931", result: "ok", detail: "Gwent Aggregates paid £4,950.00 – job cost updated" },
  { at: "20 Oct 09:41", direction: "OCS → Xero", record: "Bill · CG-1102", result: "ok", detail: "Pushed as ACCPAY, tracking Project: BCJS-2611" },
  { at: "20 Oct 09:12", direction: "Xero → OCS", record: "Contact · Screwfix Trade", result: "ok", detail: "Matched to existing supplier – no duplicate created" },
  { at: "19 Oct 17:05", direction: "OCS → Xero", record: "Sales invoice · APP-2611-06", result: "ok", detail: "Valuation 6 issued, £64,300.00 + VAT" },
  { at: "19 Oct 16:58", direction: "OCS → Xero", record: "Bill · ATB-55120", result: "held", detail: "Held – price variance on PO-2841 awaiting QS review" },
  { at: "19 Oct 02:00", direction: "Reconciliation", record: "Nightly check", result: "ok", detail: "284 bills, 0 differences between OCS and Xero" },
] as const;

export const siteAreas = [
  { id: "plot47", title: "Plot 4 to 7", subtitle: "Drainage run, VO-108", status: "Capture needed", tone: "lime", detail: "1 of 8 photos missing" },
  { id: "blockA", title: "Block A", subtitle: "First floor joinery · 71%", status: "In progress", tone: "green", detail: "3 operatives on site today" },
  { id: "blockB", title: "Block B", subtitle: "Staircase install", status: "Ready to close", tone: "green", detail: "All evidence captured" },
  { id: "externals", title: "Externals", subtitle: "Groundworks, phase 2", status: "RAMS due", tone: "slate", detail: "2 operatives not yet signed on" },
] as const;

export const ramsSignOn = [
  { name: "D. Rowntree", signed: true, note: "" },
  { name: "M. Ellery", signed: true, note: "" },
  { name: "K. Baird", signed: false, note: "CSCS expiry 18 days" },
] as const;

// --- Enquiries & estimating (appended) ---

export interface SurveyItem {
  label: string;
  measurement?: string;
  photo: boolean;
  done: boolean;
}

export const siteSurveys: Record<string, { date: string; by: string; items: SurveyItem[]; photos: string[] }> = {
  "ENQ-0405": {
    date: "06 Oct 2026",
    by: "Lucy Milne",
    items: [
      { label: "External footprint", measurement: "14.2 × 6.1 m", photo: true, done: true },
      { label: "Eaves / ridge height", measurement: "3.4 m / 7.9 m", photo: true, done: true },
      { label: "Wall construction & thickness", measurement: "Rubble stone, 600 mm", photo: true, done: true },
      { label: "Roof covering & condition", measurement: "Welsh slate, ~30% loss", photo: true, done: true },
      { label: "Openings (doors / windows)", measurement: "9 windows, 2 doors", photo: true, done: true },
      { label: "Access for deliveries", measurement: "Lane 3.1 m, 7.5t limit", photo: true, done: true },
      { label: "Services (water, power, drainage)", measurement: "Single-phase, no mains drainage", photo: true, done: true },
      { label: "Protected species / bat evidence", photo: true, done: false },
      { label: "Ground conditions", photo: false, done: false },
    ],
    photos: ["North elevation", "Gable collapse", "Roof void", "Lane access", "Existing slab", "Sole plate", "Window W4", "Services entry"],
  },
};

export const aiScopeDrafts: Record<string, { packages: { name: string; note: string }[]; risks: string[] }> = {
  "ENQ-0405": {
    packages: [
      { name: "Preliminaries", note: "Scaffold full perimeter; welfare; 14-week programme" },
      { name: "Groundworks & drainage", note: "New limecrete slab, septic tank run (no mains drainage)" },
      { name: "Stone & lime masonry", note: "Repoint ~210 m² in NHL 3.5; rebuild collapsed gable section" },
      { name: "Joinery & oak frame", note: "Green oak internal frame, staircase, 9 sash windows" },
      { name: "Roofing", note: "Re-slate in reclaimed Welsh slate (~30% loss), leadwork" },
      { name: "Mechanical & electrical", note: "ASHP + UFH; single-phase supply check" },
      { name: "Finishes", note: "Lime plaster, kitchen PC sum, bathroom & en-suite" },
    ],
    risks: ["Bat survey outstanding – may restrict roof works season", "Ground conditions unknown under slab", "Lane access limits deliveries to 7.5t"],
  },
};

export const estimateVersions: Record<string, { version: number; status: string; date: string; by: string; totalSellPence: number; note: string }[]> = {
  "est-0236": [
    { version: 1, status: "submitted", date: "09 Oct 2026", by: "James Price", totalSellPence: 41_268_000, note: "Budget price issued to client" },
    { version: 2, status: "internal review", date: "19 Oct 2026", by: "James Price", totalSellPence: 0, note: "Oak frame re-quoted; ASHP added; slate quantity re-measured" },
  ],
};

export interface InvoiceDocLine {
  description: string;
  qty: number;
  unit: string;
  /** Unit rate in pence; may carry fractions of a penny per unit only via qty. */
  ratePence: number;
  /** Rate on the matched purchase order, when it differs. */
  orderRatePence?: number;
}

export interface InvoiceDocument {
  billId: string;
  supplierAddress: string;
  supplierVat: string;
  lines: InvoiceDocLine[];
  confidencePct: number;
}

/** What the AI scanner "read" from each supplier bill. Bills not listed render a single PO line. */
export const invoiceDocuments: InvoiceDocument[] = [
  {
    billId: "x1",
    supplierAddress: "Unit 4, Llanfoist Industrial Estate, Abergavenny NP7 9XX",
    supplierVat: "GB 123 4567 89",
    confidencePct: 97,
    lines: [
      { description: "European oak boards, 25×150 PAR, kiln dried", qty: 290.2, unit: "m", ratePence: 6_820, orderRatePence: 6_310 },
      { description: "Delivery – Goytre Grange", qty: 1, unit: "item", ratePence: 18_836 },
    ],
  },
  {
    billId: "x5",
    supplierAddress: "The Workshop, Llanover, Abergavenny NP7 9XX",
    supplierVat: "GB 987 6543 21",
    confidencePct: 99,
    lines: [
      { description: "Labour – first floor joinery, wk 41 (per approved timesheet)", qty: 86.5, unit: "h", ratePence: 3_400 },
      { description: "Mileage", qty: 2, unit: "mi", ratePence: 50 },
    ],
  },
];

// ---------- Contracts, payments, external parties, inspections ----------

export const TODAY_ISO = "2026-10-20";

export interface ContractTerm {
  label: string;
  value: string;
  clause: string;
}

export interface MainContract {
  projectId: string;
  form: string;
  fileName: string;
  pages: number;
  contractSumPence: number;
  retentionPct: number;
  /** Day of month the interim application is made. */
  applicationDay: number;
  /** Days from application to due date. */
  dueAfterDays: number;
  /** Days from due date to final date for payment. */
  finalAfterDays: number;
  /** Payment notice: days after the due date. */
  paymentNoticeAfterDueDays: number;
  /** Pay-less notice: days before the final date. */
  payLessBeforeFinalDays: number;
  firstCycleMonth: string; // YYYY-MM
  terms: ContractTerm[];
}

export const mainContracts: MainContract[] = [
  {
    projectId: "goytre",
    form: "JCT Minor Works Building Contract 2016 (MW 2016)",
    fileName: "JCT-MW-2611-signed.pdf",
    pages: 46,
    contractSumPence: 84_890_000,
    retentionPct: 3,
    applicationDay: 25,
    dueAfterDays: 7,
    finalAfterDays: 14,
    paymentNoticeAfterDueDays: 5,
    payLessBeforeFinalDays: 5,
    firstCycleMonth: "2026-08",
    terms: [
      { label: "Employer", value: "Mr & Mrs Ashworth", clause: "Articles, p.2" },
      { label: "Contract sum", value: "£848,900.00 excl. VAT", clause: "Article 2" },
      { label: "Date for commencement", value: "06 Jul 2026", clause: "Contract Particulars, 2.2" },
      { label: "Date for completion", value: "18 Dec 2026", clause: "Contract Particulars, 2.2" },
      { label: "Liquidated damages", value: "£1,250 per week or part week", clause: "Contract Particulars, 2.8" },
      { label: "Rectification period", value: "12 months from practical completion", clause: "Contract Particulars, 2.10" },
      { label: "Retention", value: "3% (1.5% released at practical completion)", clause: "Contract Particulars, 4.3 / 4.4" },
      { label: "Interim payments", value: "Monthly; due 7 days after each application", clause: "Clause 4.3" },
      { label: "Final date for payment", value: "14 days after the due date", clause: "Clause 4.3" },
      { label: "Payment / pay-less notices", value: "Payment notice within 5 days of due date; pay-less notice no later than 5 days before final date", clause: "Clauses 4.4 / 4.5" },
    ],
  },
];

export type CisStatus = "gross" | "20" | "30";

export interface Subcontract {
  ref: string;
  projectId: string;
  party: string;
  trade: string;
  valuePence: number;
  /** Labour element of the value, which CIS applies to. */
  labourPence: number;
  retentionPct: number;
  cis: CisStatus;
  drcVat: boolean;
  commitmentRef: string | null;
  paymentTermsDays: number;
  nextApplicationIso: string;
}

export const subcontracts: Subcontract[] = [
  { ref: "SC-2611-03", projectId: "goytre", party: "Llanover Joinery Co", trade: "First floor joinery & oak staircase", valuePence: 3_850_000, labourPence: 2_400_000, retentionPct: 5, cis: "20", drcVat: true, commitmentRef: "CM-0412", paymentTermsDays: 30, nextApplicationIso: "2026-10-28" },
  { ref: "SC-2611-01", projectId: "goytre", party: "Gwent Groundworks", trade: "Groundworks, drainage & piling", valuePence: 15_200_000, labourPence: 6_100_000, retentionPct: 5, cis: "gross", drcVat: true, commitmentRef: "CM-0398", paymentTermsDays: 30, nextApplicationIso: "2026-10-25" },
  { ref: "SC-2611-05", projectId: "goytre", party: "Brecon Roofing", trade: "Re-slating & leadwork", valuePence: 5_840_000, labourPence: 3_100_000, retentionPct: 3, cis: "30", drcVat: true, commitmentRef: null, paymentTermsDays: 30, nextApplicationIso: "2026-11-02" },
];

export interface ExternalParty {
  name: string;
  organisation: string;
  role: "Client QS" | "Architect" | "Client" | "Structural engineer";
  email: string;
  sees: string[];
  invited: string;
  status: "active" | "invited";
}

export const externalParties: Record<string, ExternalParty[]> = {
  goytre: [
    { name: "Megan Rees", organisation: "Cardiff QS Partnership", role: "Client QS", email: "megan@example.com", sees: ["Applications & valuations", "Variations", "Payment notices"], invited: "08 Jul 2026", status: "active" },
    { name: "Tom Hartley", organisation: "Hartley Architects", role: "Architect", email: "tom@example.com", sees: ["Drawings", "RFIs", "Instructions"], invited: "08 Jul 2026", status: "active" },
    { name: "Mr & Mrs Ashworth", organisation: "Client", role: "Client", email: "ashworth@example.com", sees: ["Progress photos", "Programme", "Handover pack"], invited: "10 Jul 2026", status: "active" },
  ],
};

/** CVR margin history for Goytre, period by period. */
export const cvrHistory: Record<string, { period: string; marginPct: number }[]> = {
  goytre: [
    { period: "P5 Jul", marginPct: 15.0 },
    { period: "P6 Aug", marginPct: 14.6 },
    { period: "P7 Sep", marginPct: 13.6 },
    { period: "P8 Oct", marginPct: 14.2 },
  ],
};

export interface InspectionItem {
  id: string;
  label: string;
  guidance: string;
}

export interface InspectionTemplate {
  key: string;
  name: string;
  standard: string;
  projectId: string;
  location: string;
  costCode: string;
  owner: string;
  items: InspectionItem[];
}

export const inspectionTemplates: InspectionTemplate[] = [
  {
    key: "sg4",
    name: "Scaffold weekly inspection",
    standard: "NASC SG4 / TG20",
    projectId: "goytre",
    location: "Full perimeter scaffold, Block A",
    costCode: "PRE-01 Preliminaries (scaffold)",
    owner: "Brecon Scaffolding",
    items: [
      { id: "i1", label: "Base plates and sole boards sound and level", guidance: "No undermining after rain" },
      { id: "i2", label: "Ties at correct spacing and secure", guidance: "Per TG20 compliance sheet" },
      { id: "i3", label: "Guardrails, mid-rails and toe boards in place", guidance: "All working lifts" },
      { id: "i4", label: "Boards fully supported, no traps or gaps", guidance: "" },
      { id: "i5", label: "Ladder access secured and extends 1m above platform", guidance: "" },
      { id: "i6", label: "Loading bay gate closed and working", guidance: "" },
      { id: "i7", label: "Scafftag in date and signed", guidance: "Inspected within the last 7 days" },
    ],
  },
];

// ---------- Library & tenders (appended) ----------
export type LibraryKind = "rates" | "scopes" | "drm" | "attendances" | "prelims" | "payment" | "templates";

export interface RateLine {
  code: string;
  description: string;
  unit: string;
  ratePence: number;
}

export interface LibraryItem {
  id: string;
  kind: LibraryKind;
  name: string;
  description: string;
  count: number;
  countLabel: string;
  owner: string;
  updated: string;
  year?: number;
  rates?: RateLine[];
}

export const libraryItems: LibraryItem[] = [
  {
    id: "rb-joi", kind: "rates", name: "BCJS Joinery rates 2026", description: "Oak frame, staircases, sash windows, bespoke joinery", count: 46, countLabel: "rates", owner: "James Price", updated: "02 Oct 2026", year: 2026,
    rates: [
      { code: "JOI-001", description: "Green oak frame – supply & erect", unit: "m³", ratePence: 412_000 },
      { code: "JOI-014", description: "Oak floorboards 20mm – supply & fit", unit: "m²", ratePence: 9_850 },
      { code: "JOI-022", description: "Timber sash window, double glazed", unit: "nr", ratePence: 152_000 },
      { code: "JOI-031", description: "Oak staircase, straight flight", unit: "nr", ratePence: 680_000 },
    ],
  },
  {
    id: "rb-lime", kind: "rates", name: "Lime & masonry rates 2025", description: "NHL pointing, lime plaster, render, stone rebuild", count: 28, countLabel: "rates", owner: "James Price", updated: "14 Nov 2025", year: 2025,
    rates: [
      { code: "MAS-002", description: "Rake out & repoint, NHL 3.5", unit: "m²", ratePence: 6_000 },
      { code: "MAS-011", description: "Lime plaster, 2-coat, internal walls", unit: "m²", ratePence: 3_750 },
      { code: "MAS-015", description: "Three-coat lime render", unit: "m²", ratePence: 7_300 },
      { code: "MAS-020", description: "Limecrete floor slab with insulation", unit: "m²", ratePence: 7_200 },
    ],
  },
  {
    id: "rb-grd", kind: "rates", name: "Groundworks rates 2025", description: "Excavation, drainage, slabs", count: 33, countLabel: "rates", owner: "Dave Rowntree", updated: "03 Sep 2025", year: 2025,
    rates: [
      { code: "GRD-004", description: "Excavate & cart away", unit: "m³", ratePence: 4_600 },
      { code: "GRD-012", description: "Foul drainage run, 100mm", unit: "m", ratePence: 9_100 },
      { code: "GRD-018", description: "Type 1 sub-base, 150mm", unit: "m²", ratePence: 1_450 },
    ],
  },
  { id: "sc-oak", kind: "scopes", name: "Oak frame – supply & erect", description: "Design, fabrication, delivery, crane lift, erection, pegging", count: 18, countLabel: "clauses", owner: "Gareth Thomas", updated: "21 Aug 2026" },
  { id: "sc-roof", kind: "scopes", name: "Slate roofing & leadwork", description: "Strip, battens, membrane, reclaimed Welsh slate, Code 5 lead", count: 22, countLabel: "clauses", owner: "Gareth Thomas", updated: "11 Jun 2026" },
  { id: "sc-mep", kind: "scopes", name: "Air source heat pump & UFH", description: "Design, MCS certification, commissioning, handover", count: 16, countLabel: "clauses", owner: "Lucy Milne", updated: "30 Jul 2026" },
  { id: "drm-std", kind: "drm", name: "Domestic design responsibility matrix", description: "Architect / engineer / BCJS / subcontractor split", count: 24, countLabel: "activities", owner: "Lucy Milne", updated: "18 Mar 2026" },
  { id: "drm-her", kind: "drm", name: "Heritage & listed building DRM", description: "Adds conservation officer and heritage consultant", count: 31, countLabel: "activities", owner: "Lucy Milne", updated: "05 May 2026" },
  { id: "att-std", kind: "attendances", name: "Standard attendances", description: "Welfare, power, water, scaffold, skips, hoisting", count: 19, countLabel: "items", owner: "Dave Rowntree", updated: "12 Jan 2026" },
  { id: "pre-std", kind: "prelims", name: "Residential prelims", description: "Site set-up, welfare, management, insurances, cleaning", count: 27, countLabel: "items", owner: "James Price", updated: "09 Feb 2026" },
  { id: "pay-14", kind: "payment", name: "14 day payment terms", description: "Monthly applications, due date +14 days, 3% retention", count: 12, countLabel: "cycles", owner: "Rhian Howells", updated: "04 Apr 2026" },
  { id: "pay-30", kind: "payment", name: "30 day payment terms", description: "Monthly applications, due date +30 days, 5% retention", count: 12, countLabel: "cycles", owner: "Rhian Howells", updated: "04 Apr 2026" },
  { id: "pay-35", kind: "payment", name: "35 day payment terms", description: "Monthly applications, due date +35 days, 5% retention", count: 12, countLabel: "cycles", owner: "Rhian Howells", updated: "04 Apr 2026" },
  { id: "tpl-enq", kind: "templates", name: "Subcontract enquiry letter", description: "Invitation to tender with return and RFI deadlines", count: 14, countLabel: "variables", owner: "Lucy Milne", updated: "16 Sep 2026" },
  { id: "tpl-ret", kind: "templates", name: "Tender return letter", description: "Cover letter to the client with the BCJS quotation", count: 11, countLabel: "variables", owner: "Lucy Milne", updated: "16 Sep 2026" },
  { id: "tpl-sub", kind: "templates", name: "Subcontract particulars", description: "Order particulars, programme, retention, CIS, DRC", count: 22, countLabel: "variables", owner: "Rhian Howells", updated: "02 Oct 2026" },
];

export type BidRag = "green" | "amber" | "red";

export interface BidLine {
  item: string;
  pricesPence: number[]; // one per bidder, same order as bidders
  rag: BidRag;
  note?: string;
}

export interface Bidder {
  name: string;
  supplierId?: string;
  portalOpened: string | null;
  returned: boolean;
  unlistedPence: number;
  pricingQuals: string[];
  standardQuals: string[];
  normalisationPence: number;
}

export interface TenderQuery {
  ref: string;
  bidder: string;
  rag: BidRag;
  query: string;
  valuePence?: number;
}

export interface TenderPackage {
  id: string;
  ref: string;
  project: string;
  estimateRef: string;
  code: string;
  name: string;
  trade: string;
  status: "draft" | "out to tender" | "analysis" | "awarded";
  issued: string;
  rfiDeadline: string;
  returnDeadline: string;
  scopeId: string;
  drmId: string;
  attendancesId: string;
  paymentId: string;
  documents: { number: string; title: string; revision: string }[];
  budgetPence: number;
  bidders: Bidder[];
  lines: BidLine[];
  tqs: TenderQuery[];
}

export const tenderPackages: TenderPackage[] = [
  {
    id: "tp-joi", ref: "TP-0236-JOI", project: "The Old Forge – barn conversion", estimateRef: "EST-0236", code: "JOI", name: "JOI oak frame", trade: "Joinery & oak frame",
    status: "analysis", issued: "05 Oct 2026", rfiDeadline: "12 Oct 2026", returnDeadline: "19 Oct 2026",
    scopeId: "sc-oak", drmId: "drm-her", attendancesId: "att-std", paymentId: "pay-30",
    documents: [
      { number: "HA-OF-201", title: "Ground floor plan", revision: "B" },
      { number: "HA-OF-301", title: "Oak frame elevations", revision: "A" },
      { number: "SE-OF-04", title: "Frame engineering calcs", revision: "P1" },
    ],
    budgetPence: 3_850_000,
    bidders: [
      { name: "Llanover Joinery Co", supplierId: "su1", portalOpened: "06 Oct 09:14", returned: true, unlistedPence: 0, pricingQuals: ["Crane hire excluded – by main contractor"], standardQuals: ["Price valid 30 days", "Programme subject to timber availability"], normalisationPence: 185_000 },
      { name: "Wye Valley Oak Frames", portalOpened: "06 Oct 16:40", returned: true, unlistedPence: 42_000, pricingQuals: [], standardQuals: ["Price valid 60 days"], normalisationPence: 0 },
      { name: "Black Mountains Timber Frame", portalOpened: null, returned: false, unlistedPence: 0, pricingQuals: [], standardQuals: [], normalisationPence: 0 },
    ],
    lines: [
      { item: "Frame design & engineering coordination", pricesPence: [240_000, 310_000, 0], rag: "amber", note: "Wye Valley 29% higher" },
      { item: "Green oak supply (11.2 m³)", pricesPence: [1_780_000, 1_860_000, 0], rag: "green" },
      { item: "Fabrication & jointing", pricesPence: [960_000, 1_020_000, 0], rag: "green" },
      { item: "Delivery & crane lift", pricesPence: [0, 210_000, 0], rag: "red", note: "Llanover excludes crane – normalised at £1,850" },
      { item: "Erection & pegging", pricesPence: [540_000, 520_000, 0], rag: "green" },
      { item: "Preservative & finishing", pricesPence: [95_000, 60_000, 0], rag: "amber", note: "Llanover 58% higher" },
    ],
    tqs: [
      { ref: "TQ-01", bidder: "Llanover Joinery Co", rag: "red", query: "Crane hire is excluded. Please price the 25t mobile crane for a 1-day lift including the appointed person.", valuePence: 185_000 },
      { ref: "TQ-02", bidder: "Llanover Joinery Co", rag: "amber", query: "Preservative & finishing is 58% above the other return. Please confirm specification and coats." },
      { ref: "TQ-03", bidder: "Wye Valley Oak Frames", rag: "amber", query: "Design & engineering is 29% above the other return. Does this include the structural engineer's site visits?" },
      { ref: "TQ-04", bidder: "Wye Valley Oak Frames", rag: "amber", query: "Unlisted item 'Temporary propping' £420. Confirm this is required by the frame design." },
    ],
  },
  {
    id: "tp-rof", ref: "TP-0236-ROF", project: "The Old Forge – barn conversion", estimateRef: "EST-0236", code: "ROF", name: "ROF roofing", trade: "Slate & leadwork",
    status: "out to tender", issued: "09 Oct 2026", rfiDeadline: "16 Oct 2026", returnDeadline: "23 Oct 2026",
    scopeId: "sc-roof", drmId: "drm-her", attendancesId: "att-std", paymentId: "pay-30",
    documents: [
      { number: "HA-OF-210", title: "Roof plan", revision: "A" },
      { number: "HA-OF-410", title: "Eaves & verge details", revision: "A" },
    ],
    budgetPence: 1_977_600,
    bidders: [
      { name: "Brecon Roofing", supplierId: "su3", portalOpened: "09 Oct 11:02", returned: false, unlistedPence: 0, pricingQuals: [], standardQuals: [], normalisationPence: 0 },
      { name: "Monmouth Slate & Lead", portalOpened: "10 Oct 08:30", returned: false, unlistedPence: 0, pricingQuals: [], standardQuals: [], normalisationPence: 0 },
    ],
    lines: [],
    tqs: [],
  },
  {
    id: "tp-mep", ref: "TP-0236-MEP", project: "The Old Forge – barn conversion", estimateRef: "EST-0236", code: "MEP", name: "MEP heat pump & UFH", trade: "Mechanical & electrical",
    status: "draft", issued: "–", rfiDeadline: "30 Oct 2026", returnDeadline: "06 Nov 2026",
    scopeId: "sc-mep", drmId: "drm-std", attendancesId: "att-std", paymentId: "pay-35",
    documents: [{ number: "MEP-OF-01", title: "Heating layout", revision: "P1" }],
    budgetPence: 2_410_000,
    bidders: [
      { name: "Usk Valley Electrical", supplierId: "su4", portalOpened: null, returned: false, unlistedPence: 0, pricingQuals: [], standardQuals: [], normalisationPence: 0 },
    ],
    lines: [],
    tqs: [],
  },
];
