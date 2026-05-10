import {
  ApplicationsKanbanBoard,
  type KanbanViewMode,
} from "@/modules/applications/components/applications-kanban-board";
import type { KanbanBoardCard } from "@/modules/applications/lib/kanban-columns";
import {
  listDashboardApplications,
  type ApplicationListFilters,
} from "@/modules/applications/services/application-list.service";

/** Board only — loads applications for visible pipeline. */
export async function KanbanBoardSection({
  userId,
  view,
  filters,
}: Readonly<{
  userId: string;
  view: KanbanViewMode;
  filters: ApplicationListFilters;
}>) {
  const apps = await listDashboardApplications(userId, filters);

  const cards: KanbanBoardCard[] = apps.map((a) => ({
    id: a.id,
    userId: a.userId,
    teamId: a.teamId,
    status: a.status,
    universityName: a.universityName,
    programLabel: a.program?.name ?? a.programName ?? "Program TBD",
    ownerName: a.user.name ?? "Member",
    ownerImage: a.user.image ?? null,
    teamLabel: a.team?.name ?? null,
    logoUrl: a.university?.logoUrl ?? a.university?.imageUrl ?? null,
    city: a.city ?? a.university?.city ?? null,
    intakeSemester: a.intakeSemester ?? null,
  }));

  return (
    <ApplicationsKanbanBoard
      cards={cards}
      currentUserId={userId}
      view={view}
    />
  );
}
