import {
  ApplicationsKanbanBoard,
  type KanbanViewMode,
} from "@/modules/applications/components/applications-kanban-board";
import { KanbanToolbar } from "@/modules/applications/components/kanban-toolbar";
import type { KanbanBoardCard } from "@/modules/applications/lib/kanban-columns";
import { listDashboardApplications } from "@/modules/applications/services/application-list.service";
import { DashboardPageIntro } from "@/modules/dashboard/components/dashboard-page-intro";
import { auth } from "@/lib/auth";
import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Kanban | MeroUniversität",
};

export default async function ApplicationsKanbanPage({
  searchParams,
}: Readonly<{
  searchParams: Promise<{ view?: string; compact?: string }>;
}>) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) {
    redirect("/sign-in");
  }

  const sp = await searchParams;
  const rawView = sp.view;
  const view: KanbanViewMode =
    rawView === "university" || rawView === "member" ? rawView : "board";
  const compact = sp.compact === "1";

  const apps = await listDashboardApplications(session.user.id);

  const cards: KanbanBoardCard[] = apps.map((a) => ({
    id: a.id,
    userId: a.userId,
    status: a.status,
    universityName: a.universityName,
    programLabel: a.program?.name ?? a.programName ?? "Program TBD",
    ownerName: a.user.name,
    ownerImage: a.user.image ?? null,
    teamLabel: a.team?.name ?? null,
  }));

  const description =
    view === "board"
      ? compact
        ? "Compact mode merges rows that share the same university and program inside each column: one header with teammate avatars, then minimal rows per person. Drag and status picks still apply only to applications you own."
        : "Four pipeline columns group statuses. Drag your cards between columns for quick moves, or choose any exact status on the card."
      : view === "university"
        ? "Grouped by institution — scan where your cohort is applying."
        : "Grouped by teammate — see who owns each row.";

  return (
    <div className="flex flex-col gap-8">
      <DashboardPageIntro
        crumbs={[
          { label: "Applications", href: "/dashboard/applications" },
          { label: "Kanban" },
        ]}
        title="Kanban board"
        description={description}
      />

      <KanbanToolbar compact={compact} view={view} />

      <ApplicationsKanbanBoard
        cards={cards}
        compact={compact}
        currentUserId={session.user.id}
        view={view}
      />

      <p className="text-muted-foreground text-center text-sm">
        <Link
          className="text-primary font-semibold underline-offset-4 hover:underline"
          href="/dashboard/applications"
        >
          ← Applications list
        </Link>
      </p>
    </div>
  );
}
