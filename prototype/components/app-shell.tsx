"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import {
  Banknote,
  Building2,
  Calculator,
  HardHat,
  Inbox,
  LayoutDashboard,
  Menu,
  Moon,
  Plug,
  ShieldCheck,
  Sparkles,
  Sun,
  TrendingUp,
  Truck,
  X,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { roles, useRole } from "./role-context";
import { AskPanel } from "./ask-panel";
import { FeedbackWidget } from "./feedback-widget";

const nav = [
  { group: "Operations", items: [
    { key: "dashboard", href: "/", label: "Dashboard", icon: LayoutDashboard },
    { key: "projects", href: "/projects", label: "Projects", icon: Building2 },
    { key: "site", href: "/site", label: "Site app", icon: HardHat },
  ]},
  { group: "Win work", items: [
    { key: "enquiries", href: "/enquiries", label: "Enquiries", icon: Inbox },
    { key: "estimates", href: "/estimates/est-0236", label: "Estimating", icon: Calculator },
  ]},
  { group: "Commercial", items: [
    { key: "commercial", href: "/commercial", label: "CVR & variations", icon: TrendingUp },
    { key: "procurement", href: "/procurement", label: "Orders & Xero", icon: Truck },
    { key: "cashflow", href: "/cashflow", label: "Cash flow", icon: Banknote },
  ]},
  { group: "Governance", items: [
    { key: "compliance", href: "/compliance", label: "H&S & compliance", icon: ShieldCheck },
    { key: "integrations", href: "/integrations", label: "Integrations", icon: Plug },
  ]},
];

function useTheme() {
  const [theme, setTheme] = useState<"light" | "dark" | null>(null);
  useEffect(() => {
    try {
      const t = localStorage.getItem("bcjs-theme") as "light" | "dark" | null;
      if (t) {
        document.documentElement.dataset.theme = t;
        setTheme(t);
      }
    } catch {
      /* storage unavailable */
    }
  }, []);
  const toggle = () => {
    const current = theme ?? (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    const next = current === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    setTheme(next);
    try {
      localStorage.setItem("bcjs-theme", next);
    } catch {
      /* storage unavailable */
    }
  };
  return { theme, toggle };
}

function Lockup() {
  return (
    <Link href="/" className="flex items-center gap-2.5">
      <span className="flex h-8 w-8 items-center justify-center rounded-md bg-gradient-to-br from-lime to-lime-dk text-[11px] font-bold text-night">BC</span>
      <span className="leading-tight">
        <span className="block text-[13px] font-bold uppercase tracking-[0.16em] text-white">BCJS</span>
        <span className="block text-[9.5px] uppercase tracking-[0.14em] text-lime">Operations</span>
      </span>
    </Link>
  );
}

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const { can } = useRole();
  return (
    <nav className="flex flex-col gap-4">
      {nav.map((g) => {
        const items = g.items.filter((i) => can(i.key));
        if (!items.length) return null;
        return (
          <div key={g.group}>
            <div className="mb-1.5 px-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#7f8986]">{g.group}</div>
            <ul className="flex flex-col gap-0.5">
              {items.map((i) => {
                const base = i.href.split("/").slice(0, 2).join("/") || "/";
                const active = i.href === "/" ? pathname === "/" : pathname.startsWith(base);
                const Icon = i.icon;
                return (
                  <li key={i.key}>
                    <Link
                      href={i.href}
                      onClick={onNavigate}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "flex items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] transition",
                        active ? "bg-lime/15 font-semibold text-lime shadow-[inset_3px_0_0_var(--lime)]" : "text-[#b8c0bc] hover:bg-white/5 hover:text-white",
                      )}
                    >
                      <Icon size={16} strokeWidth={2} />
                      {i.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        );
      })}
    </nav>
  );
}

function RoleSwitcher() {
  const { role, setRole } = useRole();
  const current = roles.find((r) => r.key === role)!;
  return (
    <label className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 py-1 pl-1 pr-2 text-xs text-white">
      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate text-[10px] font-semibold">{current.initials}</span>
      <span className="sr-only">Viewing as</span>
      <select
        value={role}
        onChange={(e) => setRole(e.target.value as typeof role)}
        className="cursor-pointer bg-transparent text-xs font-semibold text-white outline-none [&>option]:text-black"
      >
        {roles.map((r) => (
          <option key={r.key} value={r.key}>
            {r.label} · {r.person}
          </option>
        ))}
      </select>
    </label>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [askOpen, setAskOpen] = useState(false);
  const { theme, toggle } = useTheme();
  const pathname = usePathname();

  useEffect(() => setMenuOpen(false), [pathname]);

  return (
    <div className="min-h-dvh lg:pl-60">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-60 flex-col gap-6 overflow-y-auto bg-night-2 px-3 py-5 lg:flex">
        <div className="px-2">
          <Lockup />
        </div>
        <NavLinks />
        <div className="mt-auto rounded-lg border border-white/10 p-3 text-[11px] leading-relaxed text-[#8b9491]">
          Concept prototype. Illustrative data only. No live connections.
        </div>
      </aside>

      {/* Top bar */}
      <header className="sticky top-0 z-20 flex items-center gap-2 border-b border-black/20 bg-gradient-to-b from-[#232b2d] to-night-2 px-4 py-2.5">
        <button className="rounded-md p-1.5 text-white lg:hidden" onClick={() => setMenuOpen(true)} aria-label="Open menu">
          <Menu size={20} />
        </button>
        <div className="lg:hidden">
          <Lockup />
        </div>
        <div className="ml-auto flex items-center gap-2">
          <button
            onClick={() => setAskOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-full bg-lime px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-night shadow-[0_2px_6px_rgba(155,186,60,0.4)] hover:bg-lime-dk"
          >
            <Sparkles size={14} /> <span className="hidden sm:inline">Ask BCJS</span>
          </button>
          <div className="hidden sm:block">
            <RoleSwitcher />
          </div>
          <button onClick={toggle} className="rounded-full p-1.5 text-[#b8c0bc] hover:text-white" aria-label="Toggle theme">
            {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </div>
      </header>

      {/* Mobile drawer */}
      {menuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button className="absolute inset-0 bg-black/50" aria-label="Close menu" onClick={() => setMenuOpen(false)} />
          <div className="absolute inset-y-0 left-0 flex w-72 max-w-[85vw] flex-col gap-5 overflow-y-auto bg-night-2 px-3 py-4">
            <div className="flex items-center justify-between px-2">
              <Lockup />
              <button onClick={() => setMenuOpen(false)} className="p-1 text-white" aria-label="Close menu">
                <X size={20} />
              </button>
            </div>
            <div className="px-2">
              <RoleSwitcher />
            </div>
            <NavLinks onNavigate={() => setMenuOpen(false)} />
          </div>
        </div>
      )}

      <main className="mx-auto w-full max-w-[1280px] px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      <footer className="mx-auto max-w-[1280px] px-4 pb-24 text-[11px] text-muted sm:px-6 lg:px-8">
        BCJS Operations Control System · concept prototype · all project names, people and figures are illustrative only.
      </footer>

      <AskPanel open={askOpen} onClose={() => setAskOpen(false)} />
      <FeedbackWidget />
    </div>
  );
}
