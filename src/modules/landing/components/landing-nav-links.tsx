"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { label: "Home", href: "/" },
  { label: "Universities", href: "/universities" },
  { label: "Community Data", href: "/community-data" },
  { label: "Resources", href: "/#resources" },
  { label: "About", href: "/#about" },
] as const;

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  if (href.includes("#")) return false;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function LandingNavLinks() {
  const pathname = usePathname();

  return (
    <nav className="hidden h-full items-center gap-8 lg:flex">
      {NAV.map((item) => {
        const active = isActive(pathname, item.href);
        return (
          <Link
            key={item.href + item.label}
            href={item.href}
            className={cn(
              "relative flex h-20 items-center text-sm font-semibold text-foreground transition-colors hover:text-primary",
              active && "text-primary",
            )}
          >
            {item.label}
            <span
              className={cn(
                "absolute bottom-0 left-1/2 h-0.5 w-10 -translate-x-1/2 rounded-full bg-primary transition-opacity",
                active ? "opacity-100" : "opacity-0",
              )}
            />
          </Link>
        );
      })}
    </nav>
  );
}
