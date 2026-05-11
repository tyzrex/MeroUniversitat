import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Container } from "@/modules/shared/components/container";
import { ArrowLeft, Database, Settings, ShieldCheck, Users } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

const links = [
  { href: "/admin", label: "Overview", icon: ShieldCheck },
  { href: "/admin/community", label: "Community review", icon: Database },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/settings", label: "Site settings", icon: Settings },
] as const;

export function AdminShell({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <div className="min-h-svh bg-gradient-to-b from-background via-muted/40 to-background">
      <header className="sticky top-0 z-30 border-b border-border/70 bg-background/80 backdrop-blur-xl">
        <Container className="flex min-h-16 max-w-[1500px] flex-wrap items-center gap-4 py-3">
          <Link
            className="flex items-center gap-3 rounded-2xl outline-none ring-[#4a52c8]/30 focus-visible:ring-2"
            href="/admin"
          >
            <span className="flex size-10 items-center justify-center rounded-2xl bg-foreground text-background shadow-md shadow-black/10 dark:shadow-black/40">
              <ShieldCheck className="size-5" strokeWidth={1.8} />
            </span>
            <span>
              <span className="block text-sm font-extrabold tracking-tight text-foreground">
                Admin Console
              </span>
              <span className="text-muted-foreground block text-xs font-medium">
                Moderation & settings
              </span>
            </span>
          </Link>

          <nav className="flex flex-wrap gap-2 text-sm font-semibold md:ml-4">
            {links.map(({ href, icon: Icon, label }) => (
              <Link
                key={href}
                className="inline-flex h-10 items-center gap-2 rounded-xl px-3 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                href={href}
              >
                <Icon className="size-4" strokeWidth={1.8} />
                {label}
              </Link>
            ))}
          </nav>

          <Link
            className={cn(
              buttonVariants({ variant: "outline", size: "lg" }),
              "ml-auto h-10 rounded-xl bg-background font-semibold",
            )}
            href="/dashboard"
          >
            <ArrowLeft className="size-4" strokeWidth={1.8} />
            Dashboard
          </Link>
        </Container>
      </header>
      <main className="px-0 py-6 md:py-8">
        <Container className="max-w-[1500px]">{children}</Container>
      </main>
    </div>
  );
}
