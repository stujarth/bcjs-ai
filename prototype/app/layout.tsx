import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { RoleProvider } from "@/components/role-context";
import { AppShell } from "@/components/app-shell";

export const metadata: Metadata = {
  title: "BCJS Operations",
  description: "Concept prototype of the BCJS Operations Control System. Illustrative data only.",
  manifest: "/manifest.webmanifest",
  robots: { index: false, follow: false },
  appleWebApp: { capable: true, title: "BCJS Site", statusBarStyle: "black-translucent" },
};

export const viewport: Viewport = {
  themeColor: "#1A2123",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en-GB">
      <body>
        <RoleProvider>
          <AppShell>{children}</AppShell>
        </RoleProvider>
      </body>
    </html>
  );
}
