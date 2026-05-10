import { KanbanBoardSection } from "@/modules/applications/components/kanban-board-section";
import { KanbanToolbarSection } from "@/modules/applications/components/kanban-toolbar-section";
import type { KanbanViewMode } from "@/modules/applications/components/applications-kanban-board";
import type { ApplicationListFilters } from "@/modules/applications/services/application-list.service";
import { listTeamOptionsForUser } from "@/modules/teams/services/team.service";
import {
  KanbanBoardSkeleton,
  KanbanToolbarSkeleton,
} from "@/modules/applications/components/applications-skeletons";
import {
  dashboardOutlineActionClass,
  dashboardPrimaryActionClass,
} from "@/modules/dashboard/lib/dashboard-header-actions";
import { DashboardPageIntro } from "@/modules/dashboard/components/dashboard-page-intro";
import { auth } from "@/lib/auth";
import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { BarChart3, FileText, Plus } from "lucide-react";
import { Suspense } from "react";

export const metadata = {
  title: "Kanban | MeroUniversität",
};

function parseView(raw: string | undefined): KanbanViewMode {
  if (
    raw === "university" ||
    raw === "member" ||
    raw === "team" ||
    raw === "solo"
  ) {
    return raw;
  }
  return "board";
}

export default async function ApplicationsKanbanPage({
  searchParams,
}: Readonly<{
  searchParams: Promise<{ view?: string; team?: string }>;
}>) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) {
    redirect("/sign-in");
  }

  const sp = await searchParams;
  const view = parseView(sp.view);
  const teamFromQuery = sp.team?.trim() || undefined;

  const teamOptions = await listTeamOptionsForUser(session.user.id);
  const teamLabel = teamFromQuery
    ? teamOptions.find((t) => t.id === teamFromQuery)?.name
    : undefined;

  const filters: ApplicationListFilters = {};
  if (view === "solo") {
    filters.teamId = "solo";
  } else if (teamFromQuery) {
    filters.teamId = teamFromQuery;
  }

  const titleSuffix =
    view === "solo" ? " · Solo" : teamLabel ? ` · ${teamLabel}` : "";

  return (
    <div className="flex min-w-0 flex-col gap-6">
      <DashboardPageIntro
        className="rounded-none border-0 bg-transparent p-0 shadow-none ring-0 md:p-0"
        crumbs={[
          { label: "Applications", href: "/dashboard/applications" },
          { label: "Kanban Board" },
        ]}
        title={`Kanban board${titleSuffix}`}
        description="Track and manage all university applications in your pipeline. Drag cards between columns or click a card to update status."
      >
        <Link
          className={dashboardOutlineActionClass()}
          href="/dashboard/applications"
        >
          <FileText className="size-4" strokeWidth={1.8} />
          Applications list
        </Link>
        <Link
          className={dashboardPrimaryActionClass()}
          href="/dashboard/applications/new"
        >
          <Plus className="size-4" strokeWidth={1.8} />
          New application
        </Link>
      </DashboardPageIntro>

      <Suspense fallback={<KanbanToolbarSkeleton />}>
        <KanbanToolbarSection
          userId={session.user.id}
          view={view}
          teamFromQuery={teamFromQuery}
        />
      </Suspense>

      <Suspense fallback={<KanbanBoardSkeleton />}>
        <KanbanBoardSection
          userId={session.user.id}
          view={view}
          filters={filters}
        />
      </Suspense>

      <footer className="flex min-w-0 flex-col gap-4 border-t border-slate-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 flex-wrap items-center gap-x-5 gap-y-2 text-xs text-slate-600">
          <span className="font-semibold text-[#0d2145]">Pipeline stages</span>
          <span className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-sky-500" /> Researching
          </span>
          <span className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-amber-400" /> Preparing
          </span>
          <span className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-violet-500" /> Submitted
          </span>
          <span className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-orange-500" /> Decision
          </span>
          <span className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-emerald-500" /> Results
          </span>
          <span className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-teal-500" /> Enrolled
          </span>
          <span className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-slate-400" /> Archived
          </span>
        </div>
        <Link
          href="/dashboard/applications"
          className={dashboardOutlineActionClass(
            "inline-flex h-10 shrink-0 items-center gap-2 px-4 text-sm",
          )}
        >
          <BarChart3 className="size-4" strokeWidth={1.8} />
          View list & filters
        </Link>
      </footer>
    </div>
  );
}
