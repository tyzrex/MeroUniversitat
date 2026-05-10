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
    <header className="mb-6 overflow-hidden rounded-2xl border border-slate-200 bg-[#0b2bb8]">
      <div
        className="relative min-h-[285px] bg-cover bg-center p-7 text-white md:p-10"
        style={{ backgroundImage: "url('/bannerbg.png')" }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-[#032c8c]/95 via-[#1432c7]/84 to-[#3935de]/76" />
        <div className="relative flex min-h-[220px] flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <span className="inline-flex rounded-lg bg-white/12 px-4 py-2 text-sm font-semibold text-blue-50 backdrop-blur">
              Community Acceptance Data
            </span>
            <h1 className="mt-5 text-balance text-4xl font-extrabold tracking-tight md:text-5xl">
              {isSubmissions
                ? "Browse real admission outcomes"
                : isDashboard
                  ? "Share & track admission outcomes"
                  : "Share your university result"}
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-white/88 md:text-lg">
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
                      "h-12 rounded-xl bg-white px-6 font-bold text-[#1238da] hover:bg-blue-50",
                    )}
                    href="/dashboard/community-data/submissions"
                  >
                    <ShieldCheck className="size-4" strokeWidth={1.9} />
                    My submissions
                  </Link>
                  <Link
                    className={cn(
                      buttonVariants({ variant: "outline", size: "lg" }),
                      "h-12 rounded-xl border-white/35 bg-white/5 px-6 font-bold text-white backdrop-blur hover:bg-white hover:text-[#1238da]",
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
                      "h-12 rounded-xl bg-white px-6 font-bold text-[#1238da] hover:bg-blue-50",
                    )}
                    href="/community-data"
                  >
                    <Send className="size-4" strokeWidth={1.9} />
                    Submit outcome
                  </Link>
                  <Link
                    className={cn(
                      buttonVariants({ variant: "outline", size: "lg" }),
                      "h-12 rounded-xl border-white/35 bg-white/5 px-6 font-bold text-white backdrop-blur hover:bg-white hover:text-[#1238da]",
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

/** Banner hero matching Community Data — use on dashboard universities directory only. */
export function UniversitiesDirectoryHero({
  resultCount,
  hasSearchQuery,
}: Readonly<{
  resultCount: number;
  hasSearchQuery: boolean;
}>) {
  return (
    <header className="overflow-hidden rounded-2xl border border-slate-200 bg-[#0b2bb8]">
      <div
        className="relative min-h-[260px] bg-cover bg-center p-7 text-white md:p-10"
        style={{ backgroundImage: "url('/bannerbg.png')" }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-[#032c8c]/95 via-[#1432c7]/84 to-[#3935de]/76" />
        <div className="relative flex min-h-[200px] flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <span className="inline-flex rounded-lg bg-white/12 px-4 py-2 text-sm font-semibold text-blue-50 backdrop-blur">
              University directory
            </span>
            <h1 className="mt-5 text-balance text-4xl font-extrabold tracking-tight md:text-5xl">
              Browse universities in Germany
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-white/88 md:text-lg">
              Search by name or city, open full profiles, and track applications from
              your dashboard. Each profile shows how many students already track that
              institution on MeroUniversität.
            </p>
          </div>
          <div className="rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur lg:min-w-[200px]">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-100">
              {hasSearchQuery ? "Matches" : "Showing"}
            </p>
            <p className="mt-1 text-3xl font-extrabold tabular-nums">{resultCount}</p>
            <p className="text-sm text-white/70">universities</p>
          </div>
        </div>
      </div>
    </header>
  );
}
