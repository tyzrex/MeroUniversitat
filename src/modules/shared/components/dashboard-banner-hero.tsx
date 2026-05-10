import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import type * as React from "react";

export type DashboardBannerCrumb = {
  label: string;
  href?: string;
};

/**
 * Shared blue banner used across dashboard (and dashboard-only community/university views).
 * Matches the Community Data / Universities directory visual language.
 */
export function DashboardBannerHero({
  crumbs,
  eyebrow,
  title,
  description,
  aside,
  actions,
  className,
  minHeightClass = "min-h-[260px]",
}: Readonly<{
  crumbs?: DashboardBannerCrumb[];
  eyebrow: string;
  title: React.ReactNode;
  description: React.ReactNode;
  aside?: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
  /** Inner content area min-height (default matches universities/community). */
  minHeightClass?: string;
}>) {
  return (
    <header
      className={cn(
        "mb-6 overflow-hidden rounded-2xl border border-slate-200 bg-[#0b2bb8]",
        className,
      )}
    >
      <div
        className={cn(
          "relative bg-cover bg-center p-7 text-white md:p-10",
          minHeightClass,
        )}
        style={{ backgroundImage: "url('/bannerbg.png')" }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-[#032c8c]/95 via-[#1432c7]/84 to-[#3935de]/76" />
        <div className="relative flex min-h-[200px] flex-col gap-6">
          {crumbs?.length ? (
            <nav
              aria-label="Breadcrumb"
              className="flex flex-wrap items-center gap-1 text-sm text-white/75"
            >
              <Link
                href="/dashboard"
                className="hover:text-white hover:underline-offset-4"
              >
                Dashboard
              </Link>
              {crumbs.map((c) => (
                <span key={`${c.label}-${c.href ?? "here"}`} className="contents">
                  <ChevronRight
                    className="mx-0.5 inline size-3.5 shrink-0 opacity-60"
                    aria-hidden
                  />
                  {c.href ? (
                    <Link
                      href={c.href}
                      className="hover:text-white hover:underline-offset-4"
                    >
                      {c.label}
                    </Link>
                  ) : (
                    <span className="font-semibold text-white">{c.label}</span>
                  )}
                </span>
              ))}
            </nav>
          ) : null}

          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <span className="inline-flex rounded-lg bg-white/12 px-4 py-2 text-sm font-semibold text-blue-50 backdrop-blur">
                {eyebrow}
              </span>
              <h1 className="mt-5 text-balance text-3xl font-extrabold tracking-tight md:text-4xl lg:text-5xl">
                {title}
              </h1>
              <div className="mt-5 max-w-2xl text-base leading-7 text-white/88 md:text-lg">
                {description}
              </div>
              {actions ? (
                <div className="mt-7 flex flex-wrap gap-4">{actions}</div>
              ) : null}
            </div>
            {aside ? <div className="shrink-0">{aside}</div> : null}
          </div>
        </div>
      </div>
    </header>
  );
}
