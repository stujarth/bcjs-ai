"use client";

import { useCallback, useEffect, useState } from "react";

export interface QueuedItem {
  id: string;
  label: string;
}

/** Online/offline state plus a local outbox that drains when signal returns. */
export function useConnectivity() {
  const [browserOnline, setBrowserOnline] = useState(true);
  const [simulateOffline, setSimulateOffline] = useState(false);
  const [queue, setQueue] = useState<QueuedItem[]>([]);
  const [syncing, setSyncing] = useState(false);
  const [lastSynced, setLastSynced] = useState<string | null>(null);

  useEffect(() => {
    setBrowserOnline(navigator.onLine);
    const on = () => setBrowserOnline(true);
    const off = () => setBrowserOnline(false);
    window.addEventListener("online", on);
    window.addEventListener("offline", off);
    return () => {
      window.removeEventListener("online", on);
      window.removeEventListener("offline", off);
    };
  }, []);

  const online = browserOnline && !simulateOffline;

  useEffect(() => {
    if (!online || queue.length === 0) return;
    setSyncing(true);
    const t = setTimeout(() => {
      setLastSynced(`${queue.length} item${queue.length === 1 ? "" : "s"} synced`);
      setQueue([]);
      setSyncing(false);
    }, 1400);
    return () => clearTimeout(t);
  }, [online, queue]);

  /** Returns true if the action went straight through, false if it was queued. */
  const submit = useCallback(
    (label: string) => {
      if (online) {
        setLastSynced(`${label} sent`);
        return true;
      }
      setQueue((q) => [...q, { id: `${Date.now()}-${q.length}`, label }]);
      return false;
    },
    [online],
  );

  return { online, simulateOffline, setSimulateOffline, queue, syncing, lastSynced, submit };
}
