import type { ReactNode } from "react";
import { Container } from "@/modules/shared/components/container";
import Link from "next/link";

const links = [
  { href: "/admin/community", label: "Community review" },
  { href: "/admin/settings", label: "Site settings" },
] as const;

export function AdminShell({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <div className="min-h-svh bg-slate-100">
      <header className="border-b border-slate-200 bg-white shadow-sm">
        <Container className="flex h-14 max-w-[1500px] flex-wrap items-center gap-4 py-2">
          <Link
            className="font-bold tracking-tight text-[#0d2145]"
            href="/admin/community"
          >
            Admin
          </Link>
          <nav className="flex flex-wrap gap-4 text-sm font-medium">
            {links.map((l) => (
              <Link
                key={l.href}
                className="text-muted-foreground hover:text-foreground transition-colors"
                href={l.href}
              >
                {l.label}
              </Link>
            ))}
          </nav>
          <Link
            className="text-muted-foreground hover:text-foreground ml-auto text-sm font-medium transition-colors"
            href="/dashboard"
          >
            ← Dashboard
          </Link>
        </Container>
      </header>
      <div className="p-6">
        <Container className="max-w-[1500px]">{children}</Container>
      </div>
    </div>
  );
}
