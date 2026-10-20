"use client";

import { useState } from "react";
import { CheckCircle2, Ruler } from "lucide-react";
import { AiNote, Badge, Button, Card, IntegrationTag, Table, Td, Th } from "@/components/ui";
import { cn } from "@/lib/cn";
import { libraryItems } from "@/lib/mock/data";
import { formatMoney } from "@/lib/money";

// Mock barn ground floor. Drawing units are arbitrary until calibrated against the door.
const DOOR = { x: 300, y: 330, w: 30 }; // a 900 mm door opening
const rooms = [
  { id: "kitchen", name: "Kitchen / living", x: 40, y: 40, w: 300, h: 200, finish: "oak" },
  { id: "bed1", name: "Bedroom 1", x: 340, y: 40, w: 150, h: 150, finish: "oak" },
  { id: "bed2", name: "Bedroom 2", x: 490, y: 40, w: 130, h: 150, finish: "oak" },
  { id: "bath", name: "Bathroom", x: 340, y: 190, w: 110, h: 100, finish: "tile" },
  { id: "hall", name: "Hall & boot room", x: 40, y: 240, w: 300, h: 90, finish: "lime" },
  { id: "utility", name: "Utility", x: 450, y: 190, w: 170, h: 100, finish: "lime" },
] as const;

const rateFor = (code: string) => libraryItems.flatMap((b) => b.rates ?? []).find((r) => r.code === code);

interface TakeoffLine {
  code: string;
  description: string;
  rooms: string[];
}

const groups: TakeoffLine[] = [
  { code: "JOI-014", description: "Oak floorboards 20mm – supply & fit", rooms: ["kitchen", "bed1", "bed2"] },
  { code: "MAS-020", description: "Limecrete floor slab with insulation", rooms: rooms.map((r) => r.id) },
];

export function Takeoff() {
  const [calibrated, setCalibrated] = useState(false);
  const [measured, setMeasured] = useState<Set<string>>(new Set());
  const [sent, setSent] = useState(false);
  const [matched, setMatched] = useState(false);

  const metresPerUnit = 0.9 / DOOR.w;
  const area = (id: string) => {
    const r = rooms.find((x) => x.id === id)!;
    // Round to 0.01 m² once, at the point of measuring.
    return Math.round(r.w * metresPerUnit * r.h * metresPerUnit * 100) / 100;
  };
  const toggle = (id: string) => {
    if (!calibrated) return;
    setMeasured((s) => {
      const n = new Set(s);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });
    setSent(false);
    setMatched(false);
  };
  const lines = groups.map((g) => {
    const qty = Math.round(g.rooms.filter((id) => measured.has(id)).reduce((a, id) => a + area(id), 0) * 100) / 100;
    const rate = rateFor(g.code);
    return { ...g, qty, ratePence: rate?.ratePence ?? 0 };
  });

  const step = !calibrated ? 1 : measured.size === 0 ? 2 : !sent ? 3 : !matched ? 4 : 5;

  return (
    <div className="grid gap-5 xl:grid-cols-[1.4fr_1fr]">
      <Card
        title="HA-OF-201 Ground floor plan · Rev B"
        action={<IntegrationTag system="SharePoint">current revision</IntegrationTag>}
      >
        <svg viewBox="0 0 660 380" className="w-full rounded-lg border border-hair bg-surface-2" role="img" aria-label="Ground floor plan for take-off">
          <rect x={30} y={30} width={600} height={310} fill="none" stroke="var(--ink)" strokeWidth={6} />
          {rooms.map((r) => {
            const on = measured.has(r.id);
            return (
              <g key={r.id} onClick={() => toggle(r.id)} className={cn(calibrated && "cursor-pointer")}>
                <rect
                  x={r.x}
                  y={r.y}
                  width={r.w}
                  height={r.h}
                  fill={on ? "var(--lime)" : "transparent"}
                  fillOpacity={on ? 0.35 : 0}
                  stroke="var(--ink)"
                  strokeWidth={1.5}
                />
                <text x={r.x + r.w / 2} y={r.y + r.h / 2 - 4} textAnchor="middle" fontSize={12} fill="var(--ink)">
                  {r.name}
                </text>
                {calibrated && (
                  <text x={r.x + r.w / 2} y={r.y + r.h / 2 + 12} textAnchor="middle" fontSize={11} fill="var(--muted)">
                    {area(r.id).toFixed(2)} m²
                  </text>
                )}
              </g>
            );
          })}
          <g onClick={() => setCalibrated(true)} className="cursor-pointer">
            <rect x={DOOR.x} y={DOOR.y} width={DOOR.w} height={14} fill={calibrated ? "var(--green)" : "var(--amber)"} />
            {!calibrated && (
              <text x={DOOR.x + DOOR.w / 2} y={DOOR.y + 32} textAnchor="middle" fontSize={11} fill="var(--amber)" fontWeight={700}>
                Click the door to calibrate
              </text>
            )}
          </g>
        </svg>
        <p className="mt-2 text-xs text-muted">
          {calibrated ? `Calibrated: door = 900 mm, so 1 drawing unit = ${(metresPerUnit * 1000).toFixed(0)} mm.` : "Scale is unknown until calibrated."} Click rooms to add or remove area measures.
        </p>
      </Card>

      <div className="flex min-w-0 flex-col gap-4">
        <Card title="Take-off steps">
          <ol className="space-y-2 text-sm">
            {["Calibrate against the 900 mm door", "Measure room areas", "Send quantities to the estimate", "Match rates from the Library"].map((s, k) => (
              <li key={s} className="flex items-center gap-2">
                {step > k + 1 ? <CheckCircle2 size={16} className="text-good" /> : <span className={cn("flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-bold", step === k + 1 ? "bg-lime text-night" : "bg-surface-2 text-muted ring-1 ring-hair")}>{k + 1}</span>}
                <span className={cn(step === k + 1 && "font-semibold")}>{s}</span>
              </li>
            ))}
          </ol>
          <div className="mt-4 flex flex-wrap gap-2">
            {!calibrated && (
              <Button onClick={() => setCalibrated(true)}>
                <Ruler size={14} /> Calibrate
              </Button>
            )}
            {calibrated && measured.size === 0 && (
              <Button variant="secondary" onClick={() => setMeasured(new Set(rooms.map((r) => r.id)))}>
                Measure all rooms
              </Button>
            )}
            <Button onClick={() => setSent(true)} disabled={measured.size === 0 || sent}>
              Send quantities to estimate
            </Button>
            <Button variant="secondary" onClick={() => setMatched(true)} disabled={!sent || matched}>
              Match rates from Library
            </Button>
          </div>
        </Card>

        <Card title="Measured lines">
          <Table>
            <thead>
              <tr>
                <Th>Line</Th>
                <Th right>Qty</Th>
                <Th right>Rate</Th>
                <Th right>Total</Th>
              </tr>
            </thead>
            <tbody>
              {lines.map((l) => (
                <tr key={l.code}>
                  <Td>
                    {l.description}
                    <div className="font-mono text-[11px] text-muted">{l.code}</div>
                  </Td>
                  <Td right>{l.qty.toFixed(2)} m²</Td>
                  <Td right>{matched ? formatMoney(l.ratePence, { pence: true }) : "–"}</Td>
                  <Td right className="font-semibold">
                    {matched ? formatMoney(Math.round(l.qty * l.ratePence)) : "–"}
                  </Td>
                </tr>
              ))}
            </tbody>
          </Table>
          {sent && (
            <div className="mt-2">
              <Badge tone="good">{matched ? "Quantities and rates are in the FIN package" : "Quantities sent to the FIN package"}</Badge>
            </div>
          )}
          <AiNote className="mt-3">
            Rates come from &quot;BCJS Joinery rates 2026&quot; and &quot;Lime &amp; masonry rates 2025&quot;. If a quantity changes on a new drawing revision, the line is flagged for review rather than changed silently.
          </AiNote>
        </Card>
      </div>
    </div>
  );
}
