"use client";

import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export function ApplicationsPagination({
  total,
  page,
  pageSize,
}: Readonly<{ total: number; page: number; pageSize: number }>) {
  const searchParams = useSearchParams();
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  function hrefForPage(nextPage: number) {
    const params = new URLSearchParams(searchParams.toString());
    if (nextPage <= 1) params.delete("page");
    else params.set("page", String(nextPage));
    const qs = params.toString();
    return qs ? `/dashboard/applications?${qs}` : "/dashboard/applications";
  }

  const start = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, total);

  const windowSize = 5;
  let from = Math.max(1, page - Math.floor(windowSize / 2));
  const to = Math.min(totalPages, from + windowSize - 1);
  from = Math.max(1, to - windowSize + 1);

  const numbers: number[] = [];
  for (let i = from; i <= to; i++) numbers.push(i);

  return (
    <div className="flex flex-col gap-3 border-t border-border/60 px-5 py-4 text-sm sm:flex-row sm:items-center sm:justify-between">
      <p className="text-muted-foreground">
        Showing{" "}
        <span className="font-semibold text-foreground">{start}</span> to{" "}
        <span className="font-semibold text-foreground">{end}</span> of{" "}
        <span className="font-semibold text-foreground">{total}</span>{" "}
        applications.
      </p>

      <nav className="flex flex-wrap items-center gap-1" aria-label="Pagination">
        <Link
          aria-disabled={page <= 1}
          className={cn(
            "inline-flex size-9 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition-colors hover:bg-muted",
            page <= 1 && "pointer-events-none opacity-40",
          )}
          href={hrefForPage(page - 1)}
          prefetch={false}
        >
          <ChevronLeft className="size-4" strokeWidth={2} />
        </Link>

        {from > 1 ? (
          <>
            <PageNum href={hrefForPage(1)} active={false}>
              1
            </PageNum>
            {from > 2 ? (
              <span className="px-1 text-muted-foreground">…</span>
            ) : null}
          </>
        ) : null}

        {numbers.map((n) => (
          <PageNum key={n} href={hrefForPage(n)} active={n === page}>
            {n}
          </PageNum>
        ))}

        {to < totalPages ? (
          <>
            {to < totalPages - 1 ? (
              <span className="px-1 text-muted-foreground">…</span>
            ) : null}
            <PageNum href={hrefForPage(totalPages)} active={false}>
              {totalPages}
            </PageNum>
          </>
        ) : null}

        <Link
          aria-disabled={page >= totalPages}
          className={cn(
            "inline-flex size-9 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition-colors hover:bg-muted",
            page >= totalPages && "pointer-events-none opacity-40",
          )}
          href={hrefForPage(page + 1)}
          prefetch={false}
        >
          <ChevronRight className="size-4" strokeWidth={2} />
        </Link>
      </nav>
    </div>
  );
}

function PageNum({
  href,
  active,
  children,
}: Readonly<{ href: string; active: boolean; children: React.ReactNode }>) {
  return (
    <Link
      href={href}
      prefetch={false}
      className={cn(
        "inline-flex min-w-9 items-center justify-center rounded-lg px-2 py-1.5 text-sm font-semibold transition-colors",
        active
          ? "bg-foreground text-background"
          : "border border-transparent text-muted-foreground hover:border-border hover:bg-muted",
      )}
    >
      {children}
    </Link>
  );
}
