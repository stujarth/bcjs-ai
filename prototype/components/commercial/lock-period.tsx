"use client";

import { useState } from "react";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui";

/** Sean §10i: a reported period is frozen; later corrections land in the next one. */
export function LockPeriod({ period, projectName }: { period: number; projectName: string }) {
  const [locked, setLocked] = useState(false);
  const [confirming, setConfirming] = useState(false);

  if (locked)
    return (
      <div className="flex items-center gap-2 rounded-full bg-good-soft px-3 py-1.5 text-xs font-semibold text-good" role="status">
        <Lock size={13} /> Period {period} locked · snapshot frozen by Emma Milne, 20 Oct 16:42
      </div>
    );

  if (confirming)
    return (
      <div className="flex flex-wrap items-center gap-2 rounded-xl border border-hair bg-surface p-2 pl-3 text-xs">
        <span className="max-w-xs text-ink">
          Freeze {projectName} period {period}? Figures become read-only and any later corrections land in period {period + 1}.
        </span>
        <Button variant="dark" onClick={() => setLocked(true)}>
          Lock
        </Button>
        <Button variant="ghost" onClick={() => setConfirming(false)}>
          Cancel
        </Button>
      </div>
    );

  return (
    <Button variant="secondary" onClick={() => setConfirming(true)}>
      <Lock size={13} /> Lock period {period}
    </Button>
  );
}
