import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import type * as React from "react";

export type DashboardCrumb = {
  label: string;
  /** Omit for the current page segment. */
  href?: string;
};

/**
 * Breadcrumb trail + page title + explanation. Designed for the main dashboard
 * inset (padding is handled by the shell layout).
 */
export function DashboardPageIntro({
  crumbs,
  title,
  description,
  className,
  children,
}: Readonly<{
  crumbs: DashboardCrumb[];
  title: string;
  description?: string;
  className?: string;
  /** Actions aligned on large screens (e.g. primary buttons). */
  children?: React.ReactNode;
}>) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-slate-200/80 bg-white p-6 shadow-[0_10px_30px_rgba(15,23,42,0.05)] ring-1 ring-slate-900/5 md:p-7",
        className,
      )}
    >
      <nav
        aria-label="Breadcrumb"
        className="flex flex-wrap items-center gap-1 text-sm text-slate-500"
      >
        <Link
          href="/dashboard"
          className="hover:text-[#0d2145] hover:underline-offset-4"
        >
          Dashboard
        </Link>
        {crumbs.map((c) => (
          <span key={`${c.label}-${c.href ?? "here"}`} className="contents">
            <ChevronRight
              className="mx-0.5 inline size-3.5 shrink-0 opacity-45"
              aria-hidden
            />
            {c.href ? (
              <Link
                href={c.href}
                className="hover:text-[#0d2145] hover:underline-offset-4"
              >
                {c.label}
              </Link>
            ) : (
              <span className="font-semibold text-slate-800">{c.label}</span>
            )}
          </span>
        ))}
      </nav>

      <div className="mt-5 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 flex-1">
          <h1 className="text-balance text-2xl font-extrabold tracking-tight text-[#0d2145] md:text-3xl">
            {title}
          </h1>
          {description ? (
            <p className="text-muted-foreground mt-2 max-w-3xl text-sm leading-relaxed md:text-base">
              {description}
            </p>
          ) : null}
        </div>
        {children ? (
          <div className="flex shrink-0 flex-wrap gap-2 lg:justify-end">{children}</div>
        ) : null}
      </div>
    </div>
  );
}
