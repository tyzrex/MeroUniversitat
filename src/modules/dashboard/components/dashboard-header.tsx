"use client";

import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import type { DashboardUser } from "@/modules/dashboard/components/dashboard-layout-client";
import { UserAccountMenu } from "@/modules/shared/components/user-account-menu";
import { ThemeToggle } from "@/modules/shared/components/theme-toggle";
import { cn } from "@/lib/utils";
import { Database, LayoutDashboard, Search } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const TOP_LINKS = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
  {
    label: "Community data",
    href: "/dashboard/community-data",
    icon: Database,
  },
] as const;

export function DashboardHeader({
  user,
}: Readonly<{
  user: DashboardUser | null;
}>) {
  const pathname = usePathname();

  return (
    <header className="flex h-14 shrink-0 flex-wrap items-center gap-3 border-b border-border bg-background px-4 py-2 sm:flex-nowrap">
      <SidebarTrigger className="-ml-1 text-muted-foreground" />
      <Separator className="mr-1 h-6 bg-border" orientation="vertical" />
      <nav className="hidden items-center gap-0.5 lg:flex">
        {TOP_LINKS.map(({ label, href, icon: Icon }) => {
          const active =
            href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname === href || pathname.startsWith(`${href}/`);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold transition-colors",
                active
                  ? "bg-muted text-foreground"
                  : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
              )}
            >
              <Icon className="size-4" strokeWidth={1.75} />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="ml-auto flex shrink-0 items-center gap-2">
        <ThemeToggle />
        {user ? (
          <UserAccountMenu user={user} variant="compact" />
        ) : (
          <>
            <Link
              href="/sign-in"
              className={cn(
                buttonVariants({ variant: "outline", size: "sm" }),
                "font-semibold",
              )}
            >
              Sign in
            </Link>
            <Link
              href="/sign-up"
              className={cn(buttonVariants({ size: "sm" }), "font-semibold")}
            >
              Get started
            </Link>
          </>
        )}
      </div>
    </header>
  );
}
