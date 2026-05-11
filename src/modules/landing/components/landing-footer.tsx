"use client";
import Link from "next/link";
import { Mail } from "lucide-react";
import { Container } from "@/modules/shared/components/container";
import { LogoSwitcher } from "@/modules/shared/components/logo-switcher";

const FOOTER_COLS = [
  {
    title: "Platform",
    links: [
      { label: "Universities", href: "/universities" },
      { label: "Programs", href: "/universities" },
      { label: "Community", href: "/community" },
      { label: "Timeline", href: "/dashboard/analytics" },
      { label: "Dashboard", href: "/dashboard" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Documents", href: "/community" },
      { label: "SOP Samples", href: "/community" },
      { label: "Guides", href: "/community" },
      { label: "Checklists", href: "/community" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Us", href: "/" },
      { label: "Contact", href: "/" },
      { label: "Privacy Policy", href: "/" },
      { label: "Terms of Service", href: "/" },
    ],
  },
] as const;

export function LandingFooter() {
  return (
    <footer className="border-t border-border bg-background">
      <Container className="py-12">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2.5">
              <LogoSwitcher size={80} className="size-[80px]" />
              <span className="font-bold text-foreground">MeroUniversität</span>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              A community-driven platform making Germany applications
              transparent and smarter for Nepali students.
            </p>
            <div className="mt-5 flex gap-2.5">
              {[Mail].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="flex size-8 items-center justify-center rounded border border-border text-muted-foreground transition hover:border-primary hover:text-primary"
                  aria-label="Social link"
                >
                  <Icon className="size-4" />
                </a>
              ))}
            </div>
          </div>

          {FOOTER_COLS.map((col) => (
            <div key={col.title}>
              <h4 className="text-sm font-bold text-foreground">{col.title}</h4>
              <ul className="mt-4 space-y-2">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      className="text-sm text-muted-foreground transition hover:text-foreground"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-border pt-8 text-sm text-muted-foreground sm:flex-row sm:justify-between">
          <span>
            © {new Date().getFullYear()} MeroUniversität. All rights reserved.
          </span>
          <span>Made with ❤️ for Nepali students</span>
        </div>
      </Container>
    </footer>
  );
}
