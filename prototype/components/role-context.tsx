"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { RoleKey } from "@/lib/mock/types";

export const roles: { key: RoleKey; label: string; person: string; initials: string }[] = [
  { key: "director", label: "Director", person: "Emma Milne", initials: "EM" },
  { key: "qs", label: "Quantity Surveyor", person: "James Price", initials: "JP" },
  { key: "pm", label: "Project Manager", person: "Lucy Milne", initials: "LM" },
  { key: "finance", label: "Finance", person: "Rhian Howells", initials: "RH" },
  { key: "site", label: "Site Manager", person: "Dave Rowntree", initials: "DR" },
  { key: "subcontractor", label: "Subcontractor", person: "Llanover Joinery Co", initials: "LJ" },
];

// Which nav sections each role sees. Production enforces this server-side (Sean §2);
// here it only shapes the prototype navigation.
export const roleAccess: Record<RoleKey, string[]> = {
  director: ["dashboard", "enquiries", "estimates", "projects", "commercial", "procurement", "cashflow", "site", "compliance", "integrations"],
  qs: ["dashboard", "enquiries", "estimates", "projects", "commercial", "procurement", "cashflow", "site"],
  pm: ["dashboard", "enquiries", "estimates", "projects", "commercial", "procurement", "site", "compliance"],
  finance: ["dashboard", "commercial", "procurement", "cashflow", "integrations"],
  site: ["projects", "site", "compliance"],
  subcontractor: ["site"],
};

interface RoleState {
  role: RoleKey;
  setRole: (r: RoleKey) => void;
  can: (section: string) => boolean;
}

const RoleCtx = createContext<RoleState | null>(null);

export function RoleProvider({ children }: { children: ReactNode }) {
  const [role, setRoleState] = useState<RoleKey>("director");

  useEffect(() => {
    try {
      const saved = localStorage.getItem("bcjs-role") as RoleKey | null;
      if (saved && saved in roleAccess) setRoleState(saved);
    } catch {
      /* storage unavailable */
    }
  }, []);

  const setRole = (r: RoleKey) => {
    setRoleState(r);
    try {
      localStorage.setItem("bcjs-role", r);
    } catch {
      /* storage unavailable */
    }
  };

  return <RoleCtx.Provider value={{ role, setRole, can: (s) => roleAccess[role].includes(s) }}>{children}</RoleCtx.Provider>;
}

export function useRole() {
  const ctx = useContext(RoleCtx);
  if (!ctx) throw new Error("useRole must be used inside RoleProvider");
  return ctx;
}
