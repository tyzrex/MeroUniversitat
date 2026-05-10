import {
  DashboardIntroSkeleton,
  KanbanBoardSkeleton,
  KanbanToolbarSkeleton,
} from "@/modules/applications/components/applications-skeletons";

export default function ApplicationsKanbanLoading() {
  return (
    <div className="flex min-w-0 flex-col gap-6">
      <DashboardIntroSkeleton />
      <KanbanToolbarSkeleton />
      <KanbanBoardSkeleton />
    </div>
  );
}
