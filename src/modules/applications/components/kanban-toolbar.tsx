"use client";

import type { KanbanViewMode } from "@/modules/applications/components/applications-kanban-board";
import { cn } from "@/lib/utils";
import { Layers, LayoutGrid, Filter } from "lucide-react";
import Link from "next/link";

const BASE = "/dashboard/applications/kanban";

type TeamOption = { id: string; name: string };

function buildHref(opts: {
  view: KanbanViewMode;
  compact: boolean;
  teamId: string;
  nextView?: KanbanViewMode;
  nextCompact?: boolean;
  nextTeamId?: string;
}) {
  const view = opts.nextView ?? opts.view;
  const compact = opts.nextCompact ?? opts.compact;
  const teamId = opts.nextTeamId ?? opts.teamId;
  const params = new URLSearchParams();
  if (view !== "board") params.set("view", view);
  if (compact) params.set("compact", "1");
  if (teamId) params.set("team", teamId);
  const q = params.toString();
  return q ? `${BASE}?${q}` : BASE;
}

export function KanbanToolbar({
  compact,
  view,
  teamId,
  teamOptions,
  teamLabel,
}: Readonly<{
  compact: boolean;
  view: KanbanViewMode;
  teamId?: string;
  teamOptions?: TeamOption[];
  teamLabel?: string;
}>) {
  const currentTeam = teamId ?? "";

  const tabClass = (active: boolean) =>
    cn(
      "inline-flex h-10 items-center gap-2 rounded-xl px-4 text-sm font-semibold transition-colors",
      active
        ? "bg-[#0d2145] text-white shadow-md"
        : "text-muted-foreground hover:bg-slate-50",
    );

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
      <div className="flex flex-wrap items-center gap-3">
        {/* View tabs */}
        <div className="flex flex-wrap gap-2 rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">
          <Link
            className={tabClass(view === "board")}
            href={buildHref({ view, compact, teamId: currentTeam, nextView: "board" })}
          >
            <LayoutGrid className="size-4 opacity-90" strokeWidth={1.8} />
            Board
          </Link>
          <Link
            className={tabClass(view === "university")}
            href={buildHref({ view, compact, teamId: currentTeam, nextView: "university" })}
          >
            By university
          </Link>
          <Link
            className={tabClass(view === "member")}
            href={buildHref({ view, compact, teamId: currentTeam, nextView: "member" })}
          >
            By member
          </Link>
        </div>

        {/* Team filter */}
        {teamOptions && teamOptions.length > 0 ? (
          <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">
            <Filter className="ml-2 size-4 text-slate-400" strokeWidth={1.8} />
            <select
              value={currentTeam}
              onChange={(e) => {
                const href = buildHref({
                  view,
                  compact,
                  teamId: currentTeam,
                  nextTeamId: e.target.value,
                });
                window.location.href = href;
              }}
              className="h-10 rounded-xl border-0 bg-transparent px-2 text-sm font-semibold text-slate-700 outline-none"
            >
              <option value="">All applications</option>
              {teamOptions.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>
        ) : null}
      </div>

      {/* Density toggle */}
      <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">
        <span className="px-2 text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
          Density
        </span>
        <Link
          className={cn(
            "inline-flex h-10 items-center gap-2 rounded-xl px-4 text-sm font-semibold transition-colors",
            !compact
              ? "bg-slate-900 text-white shadow-sm"
              : "text-muted-foreground hover:bg-slate-50",
          )}
          href={buildHref({ view, compact, teamId: currentTeam, nextCompact: false })}
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
          href={buildHref({ view, compact, teamId: currentTeam, nextCompact: true })}
          title="Merge same university & program in one lane with avatars"
        >
          <Layers className="size-4 opacity-90" strokeWidth={1.8} />
          Compact / team stack
        </Link>
      </div>
    </div>
  );
}
