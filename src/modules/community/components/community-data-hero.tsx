"use client";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Building2, Send, ShieldCheck } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

export function CommunityDataHero({
  variant = "form",
}: Readonly<{
  variant?: "form" | "submissions" | "dashboard";
}>) {
  const isDashboard = variant === "dashboard";
  const isSubmissions = variant === "submissions";

  return (
    <header className="mb-6 overflow-hidden rounded-2xl border border-border dark:border-border/50">
      <div
        className="relative min-h-[285px] bg-cover bg-center p-7 md:p-10 dark:bg-slate-900"
        style={{ backgroundImage: "url('/bannerbg.png')" }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/80 to-primary/70 dark:from-slate-950/95 dark:via-slate-900/80 dark:to-slate-950/70" />
        <div className="relative flex min-h-[220px] flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <span className="inline-flex rounded-lg bg-white/12 px-4 py-2 text-sm font-semibold text-primary-foreground/90 backdrop-blur dark:bg-white/8 dark:text-white/90">
              Community Acceptance Data
            </span>
            <h1 className="mt-5 text-balance text-4xl font-extrabold tracking-tight text-white dark:text-white md:text-5xl">
              {isSubmissions
                ? "Browse real admission outcomes"
                : isDashboard
                  ? "Share & track admission outcomes"
                  : "Share your university result"}
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-white/88 dark:text-white/70 md:text-lg">
              {isSubmissions
                ? "Explore approved admission outcomes shared by students so you can compare real profiles, timelines, and decisions."
                : isDashboard
                  ? "Submit an outcome below, or open your list to check moderation status. Every entry is reviewed before it appears publicly."
                  : "Add your admission outcome and academic snapshot so future applicants can compare realistic profiles. All submissions are reviewed before publishing."}
            </p>
            <div className="mt-7 flex flex-wrap gap-4">
              {isDashboard ? (
                <>
                  <Link
                    className={cn(
                      buttonVariants({ size: "lg" }),
                      "h-12 rounded-xl bg-foreground px-6 font-bold text-background hover:bg-foreground/90 dark:bg-white dark:text-slate-900 dark:hover:bg-white/90",
                    )}
                    href="/dashboard/community-data/submissions"
                  >
                    <ShieldCheck className="size-4" strokeWidth={1.9} />
                    My submissions
                  </Link>
                  <Link
                    className={cn(
                      buttonVariants({ variant: "outline", size: "lg" }),
                      "h-12 rounded-xl border-white/35 bg-white/5 px-6 font-bold text-white backdrop-blur hover:bg-white/20 dark:border-white/20 dark:bg-white/10 dark:text-white dark:hover:bg-white/20",
                    )}
                    href="/dashboard/universities"
                  >
                    <Building2 className="size-4" strokeWidth={1.9} />
                    University directory
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    className={cn(
                      buttonVariants({ size: "lg" }),
                      "h-12 rounded-xl bg-foreground px-6 font-bold text-background hover:bg-foreground/90 dark:bg-white dark:text-slate-900 dark:hover:bg-white/90",
                    )}
                    href="/community-data"
                  >
                    <Send className="size-4" strokeWidth={1.9} />
                    Submit outcome
                  </Link>
                  <Link
                    className={cn(
                      buttonVariants({ variant: "outline", size: "lg" }),
                      "h-12 rounded-xl border-white/35 bg-white/5 px-6 font-bold text-white backdrop-blur hover:bg-white/20 dark:border-white/20 dark:bg-white/10 dark:text-white dark:hover:bg-white/20",
                    )}
                    href="/community-data/submissions"
                  >
                    <ShieldCheck className="size-4" strokeWidth={1.9} />
                    View submissions
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export function CommunityDataPageWrap({
  children,
}: Readonly<{ children: ReactNode }>) {
  return <div className="flex flex-col gap-8">{children}</div>;
}

export function UniversitiesDirectoryHero({
  resultCount,
  hasSearchQuery,
}: Readonly<{
  resultCount: number;
  hasSearchQuery: boolean;
}>) {
  return (
    <header className="overflow-hidden rounded-2xl border border-border dark:border-border/50">
      <div
        className="relative min-h-[260px] bg-cover bg-center p-7 text-white dark:bg-slate-900 md:p-10"
        style={{ backgroundImage: "url('/bannerbg.png')" }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/80 to-primary/70 dark:from-slate-950/95 dark:via-slate-900/80 dark:to-slate-950/70" />
        <div className="relative flex min-h-[200px] flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <span className="inline-flex rounded-lg bg-white/12 px-4 py-2 text-sm font-semibold text-primary-foreground/90 backdrop-blur dark:bg-white/8 dark:text-white/90">
              University directory
            </span>
            <h1 className="mt-5 text-balance text-4xl font-extrabold tracking-tight text-white dark:text-white md:text-5xl">
              Browse universities in Germany
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-white/88 dark:text-white/70 md:text-lg">
              Search by name or city, open full profiles, and track applications from
              your dashboard. Each profile shows how many students already track that
              institution on MeroUniversität.
            </p>
          </div>
          <div className="rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur dark:border-white/20 dark:bg-white/10 lg:min-w-[200px]">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary-foreground/80 dark:text-white/70">
              {hasSearchQuery ? "Matches" : "Showing"}
            </p>
            <p className="mt-1 text-3xl font-extrabold tabular-nums text-white dark:text-white">{resultCount}</p>
            <p className="text-sm text-white/70 dark:text-white/60">universities</p>
          </div>
        </div>
      </div>
    </header>
  );
}
