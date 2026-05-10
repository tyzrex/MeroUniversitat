import { KanbanToolbar } from "@/modules/applications/components/kanban-toolbar";
import type { KanbanViewMode } from "@/modules/applications/components/applications-kanban-board";
import { listTeamOptionsForUser } from "@/modules/teams/services/team.service";

/** Toolbar only — loads team list for filters. */
export async function KanbanToolbarSection({
  userId,
  view,
  teamFromQuery,
}: Readonly<{
  userId: string;
  view: KanbanViewMode;
  teamFromQuery?: string;
}>) {
  const teamOptions = await listTeamOptionsForUser(userId);
  return (
    <KanbanToolbar
      view={view}
      teamId={teamFromQuery}
      teamOptions={teamOptions}
    />
  );
}
