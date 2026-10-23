"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Badge, Table, Td, Th } from "@/components/ui";
import { cn } from "@/lib/cn";
import { assetBlocked, assets, type AssetStatus } from "@/lib/mock/data";
import { formatMoney } from "@/lib/money";
import { statusTone } from "./format";

const STATUSES: ("all" | AssetStatus)[] = ["all", "available", "in use", "on hire", "service", "lost"];

export function AssetRegister() {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<(typeof STATUSES)[number]>("all");
  const [category, setCategory] = useState("all");
  const categories = useMemo(() => ["all", ...Array.from(new Set(assets.map((a) => a.category))).sort()], []);

  const rows = assets.filter(
    (a) =>
      (status === "all" || a.status === status) &&
      (category === "all" || a.category === category) &&
      (!q ||
        `${a.name} ${a.tag} ${a.location} ${a.holder ?? ""} ${a.supplier} ${(a.split ?? []).map((s) => s.location).join(" ")}`
          .toLowerCase()
          .includes(q.toLowerCase())),
  );

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <label className="flex min-w-0 flex-1 items-center gap-2 rounded-full border border-hair bg-surface px-3 py-1.5 text-sm sm:max-w-xs">
          <Search size={14} className="text-muted" />
          <span className="sr-only">Search assets</span>
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search name, tag, site, holder…" className="w-full bg-transparent outline-none" />
        </label>
        <select value={category} onChange={(e) => setCategory(e.target.value)} className="rounded-full border border-hair bg-surface px-3 py-1.5 text-xs" aria-label="Category">
          {categories.map((c) => (
            <option key={c} value={c}>
              {c === "all" ? "All categories" : c}
            </option>
          ))}
        </select>
        <div className="flex flex-wrap gap-1.5" role="tablist" aria-label="Status">
          {STATUSES.map((s) => (
            <button
              key={s}
              role="tab"
              aria-selected={status === s}
              onClick={() => setStatus(s)}
              className={cn("rounded-full px-3 py-1 text-xs font-semibold", status === s ? "bg-ink text-bg" : "border border-hair bg-surface-2 text-muted")}
            >
              {s === "all" ? "All" : s}
            </button>
          ))}
        </div>
      </div>

      <Table>
        <thead>
          <tr>
            <Th>Asset</Th>
            <Th>Category</Th>
            <Th right>Qty</Th>
            <Th>Where</Th>
            <Th>Held by</Th>
            <Th>Status</Th>
            <Th right>Value</Th>
          </tr>
        </thead>
        <tbody>
          {rows.map((a) => (
            <tr key={a.id} className="hover:bg-surface-2">
              <Td>
                <Link href={`/assets/${a.id}`} className="font-semibold hover:underline">
                  {a.name}
                </Link>
                <div className="font-mono text-[11px] text-muted">
                  {a.tag} · {a.ownership === "hired" ? `hired from ${a.supplier}` : a.supplier}
                </div>
              </Td>
              <Td className="text-xs text-muted">{a.category}</Td>
              <Td right>{a.qty}</Td>
              <Td className="text-xs">
                {a.split ? (
                  <div className="flex flex-wrap gap-1">
                    {a.split.map((s) => (
                      <span key={s.location} className="rounded bg-surface-2 px-1.5 py-0.5 ring-1 ring-hair">
                        {s.location.replace(" (Pontypool)", "")} <b className="tabular">{s.qty}</b>
                      </span>
                    ))}
                  </div>
                ) : (
                  a.location
                )}
              </Td>
              <Td className="text-xs">{a.holder ?? "–"}</Td>
              <Td>
                <div className="flex flex-wrap gap-1">
                  <Badge tone={statusTone[a.status]}>{a.status}</Badge>
                  {assetBlocked(a.id) && <Badge tone="bad">inspection overdue</Badge>}
                </div>
              </Td>
              <Td right>{a.ownership === "hired" ? <span className="text-muted">hired</span> : formatMoney(a.valuePence * a.qty)}</Td>
            </tr>
          ))}
          {rows.length === 0 && (
            <tr>
              <Td className="py-6 text-center text-muted">No assets match.</Td>
            </tr>
          )}
        </tbody>
      </Table>
      <p className="mt-2 text-xs text-muted">
        Bulk items (fencing, barrows, signs, transformers) are one record with a quantity per location, not one row per panel. Serialised tools keep their own record and QR tag.
      </p>
    </div>
  );
}
