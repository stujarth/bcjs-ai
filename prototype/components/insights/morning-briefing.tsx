"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { AiNote, Card } from "@/components/ui";
import { roles, useRole } from "@/components/role-context";
import type { RoleKey } from "@/lib/mock/types";
import type { Line } from "./briefing-data";

export function MorningBriefing({ briefings }: { briefings: Record<RoleKey, Line[]> }) {
  const { role } = useRole();
  const who = roles.find((r) => r.key === role)!;
  return (
    <Card title={`Morning briefing · ${who.person}`}>
      <p className="mb-2 text-xs text-muted">
        07:30 in Teams for the {who.label.toLowerCase()} role. Switch role in the top bar to see someone else&apos;s.
      </p>
      <ul className="divide-y divide-hair">
        {briefings[role].map((l, i) => (
          <li key={i}>
            <Link href={l.href} className="flex items-center gap-2 py-2 text-sm hover:text-accent-ink">
              <span className="flex-1">{l.text}</span>
              <ArrowRight size={14} className="shrink-0 text-muted" />
            </Link>
          </li>
        ))}
      </ul>
      <AiNote className="mt-3">Built only from records this role is permitted to see.</AiNote>
    </Card>
  );
}
