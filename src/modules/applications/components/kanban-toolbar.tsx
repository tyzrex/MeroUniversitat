"use client";

import type { KanbanViewMode } from "@/modules/applications/components/applications-kanban-board";
import { cn } from "@/lib/utils";
import { Layers, LayoutGrid } from "lucide-react";
import Link from "next/link";

const BASE = "/dashboard/applications/kanban";

function buildHref(opts: {
  view: KanbanViewMode;
  compact: boolean;
  nextView?: KanbanViewMode;
  nextCompact?: boolean;
}) {
  const view = opts.nextView ?? opts.view;
  const compact = opts.nextCompact ?? opts.compact;
  const params = new URLSearchParams();
  if (view !== "board") params.set("view", view);
  if (compact) params.set("compact", "1");
  const q = params.toString();
  return q ? `${BASE}?${q}` : BASE;
}

export function KanbanToolbar({
  compact,
  view,
}: Readonly<{
  compact: boolean;
  view: KanbanViewMode;
}>) {
  const tabClass = (active: boolean) =>
    cn(
      "inline-flex h-10 items-center gap-2 rounded-xl px-4 text-sm font-semibold transition-colors",
      active
        ? "bg-[#0d2145] text-white shadow-md"
        : "text-muted-foreground hover:bg-slate-50",
    );

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
      <div className="flex flex-wrap gap-2 rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">
        <Link className={tabClass(view === "board")} href={buildHref({ view, compact, nextView: "board" })}>
          <LayoutGrid className="size-4 opacity-90" strokeWidth={1.8} />
          Board
        </Link>
        <Link
          className={tabClass(view === "university")}
          href={buildHref({ view, compact, nextView: "university" })}
        >
          By university
        </Link>
        <Link
          className={tabClass(view === "member")}
          href={buildHref({ view, compact, nextView: "member" })}
        >
          By member
        </Link>
      </div>

      <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">
        <span className="text-muted-foreground px-2 text-xs font-semibold uppercase tracking-[0.14em]">
          Density
        </span>
        <Link
          className={cn(
            "inline-flex h-10 items-center gap-2 rounded-xl px-4 text-sm font-semibold transition-colors",
            !compact
              ? "bg-slate-900 text-white shadow-sm"
              : "text-muted-foreground hover:bg-slate-50",
          )}
          href={buildHref({ view, compact, nextCompact: false })}
        >
          Comfortable
        </Link>
        <Link
          className={cn(
            "inline-flex h-10 items-center gap-2 rounded-xl px-4 text-sm font-semibold transition-colors",
            compact
              ? "bg-slate-900 text-white shadow-sm"
              : "text-muted-foreground hover:bg-slate-50",
          )}
          href={buildHref({ view, compact, nextCompact: true })}
          title="Merge same university & program in one lane with avatars"
        >
          <Layers className="size-4 opacity-90" strokeWidth={1.8} />
          Compact / team stack
        </Link>
      </div>
    </div>
  );
}
