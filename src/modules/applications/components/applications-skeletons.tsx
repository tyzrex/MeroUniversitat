import { Skeleton } from "@/components/ui/skeleton";

export function ApplicationsStatsSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="rounded-2xl border border-border/80 bg-card p-5 ring-1 ring-border/60"
        >
          <Skeleton className="size-10 rounded-xl" />
          <Skeleton className="mt-4 h-9 w-16" />
          <Skeleton className="mt-2 h-4 w-32" />
        </div>
      ))}
    </div>
  );
}

export function ApplicationsFiltersSkeleton() {
  return (
    <div className="rounded-2xl border border-border/80 bg-card p-4 ring-1 ring-border/60">
      <div className="flex flex-col gap-3 lg:flex-row lg:flex-wrap">
        <Skeleton className="h-10 min-h-[40px] flex-1 rounded-xl" />
        <Skeleton className="h-10 w-full rounded-xl sm:w-36" />
        <Skeleton className="h-10 w-full rounded-xl sm:w-36" />
        <Skeleton className="h-10 w-full rounded-xl sm:w-32" />
      </div>
    </div>
  );
}

export function ApplicationsTableSkeleton() {
  return (
    <div className="min-w-0 max-w-full overflow-hidden rounded-3xl border border-border/80 bg-card ring-1 ring-border/40">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1020px] text-left text-sm">
          <thead className="border-b border-border/60 bg-muted/40">
            <tr>
              {["University", "Program", "Intake", "Owner", "Team", "Status", "Actions"].map(
                (h) => (
                  <th key={h} className="px-5 py-3">
                    <Skeleton className="h-4 w-20" />
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 8 }).map((_, i) => (
              <tr key={i} className="border-b border-border/40">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <Skeleton className="size-11 shrink-0 rounded-xl" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-40" />
                      <Skeleton className="h-3 w-28" />
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4">
                  <Skeleton className="h-4 w-36" />
                </td>
                <td className="px-5 py-4">
                  <Skeleton className="h-4 w-16" />
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-2">
                    <Skeleton className="size-8 rounded-full" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </td>
                <td className="px-5 py-4">
                  <Skeleton className="h-4 w-28" />
                </td>
                <td className="px-5 py-4">
                  <Skeleton className="h-6 w-24 rounded-full" />
                </td>
                <td className="px-5 py-4">
                  <Skeleton className="h-4 w-20" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex flex-col gap-3 border-t border-border/60 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <Skeleton className="h-4 w-56" />
        <div className="flex gap-2">
          <Skeleton className="size-9 rounded-lg" />
          <Skeleton className="size-9 rounded-lg" />
          <Skeleton className="size-9 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

/** Filters + table only — use under Suspense when stats load separately (avoids duplicate stats skeleton). */
export function ApplicationsMainBodySkeleton() {
  return (
    <div className="flex min-w-0 flex-col gap-6">
      <ApplicationsFiltersSkeleton />
      <ApplicationsTableSkeleton />
      <Skeleton className="h-32 w-full rounded-3xl" />
    </div>
  );
}

/** Intro block matching Kanban-style `DashboardPageIntro` (transparent shell). Long title skeleton reduces layout shift vs short pages. */
export function DashboardIntroSkeleton() {
  return (
    <div className="border-0 bg-transparent p-0">
      <Skeleton className="h-4 w-52 md:w-64" />
      <Skeleton className="mt-5 h-9 w-[min(100%,42rem)] max-w-full" />
      <Skeleton className="mt-3 h-9 w-[min(100%,36rem)] max-w-full md:h-10" />
      <Skeleton className="mt-3 h-4 w-full max-w-2xl" />
      <Skeleton className="mt-2 h-4 w-full max-w-xl" />
      <div className="mt-5 flex flex-wrap gap-2">
        <Skeleton className="h-11 w-[8.5rem] rounded-xl border border-border/60 bg-muted/60" />
        <Skeleton className="h-11 w-[10rem] rounded-xl border border-border/60 bg-muted/60" />
      </div>
    </div>
  );
}

/** Full applications route loading (nav transitions): intro + stats + body. */
export function ApplicationsFullPageSkeleton() {
  return (
    <div className="flex min-w-0 flex-col gap-6">
      <DashboardIntroSkeleton />
      <ApplicationsStatsSkeleton />
      <ApplicationsMainBodySkeleton />
    </div>
  );
}

export function ApplicationsPageSkeleton() {
  return <ApplicationsFullPageSkeleton />;
}

export function KanbanToolbarSkeleton() {
  return (
    <div className="flex min-w-0 flex-col gap-4">
      <div className="flex flex-wrap gap-2 rounded-2xl border border-border bg-card p-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-10 w-24 rounded-xl" />
        ))}
      </div>
      <Skeleton className="h-12 w-full max-w-md rounded-2xl" />
    </div>
  );
}

export function KanbanBoardSkeleton() {
  return (
    <div className="w-full min-w-0 max-w-full">
      <div className="overflow-x-auto overscroll-x-contain pb-2 [-webkit-overflow-scrolling:touch]">
        <div className="flex w-max gap-4">
          {Array.from({ length: 7 }).map((_, i) => (
            <div
              key={i}
              className="flex min-h-[520px] max-h-[min(86vh,920px)] w-[min(94vw,340px)] shrink-0 flex-col overflow-hidden rounded-xl border border-border bg-card p-3 sm:w-[310px] lg:w-[328px] xl:w-[360px]"
            >
              <div className="mb-3 space-y-2 border-b border-border/60 pb-2">
                <Skeleton className="h-5 w-36" />
                <Skeleton className="h-3 w-full max-w-[180px]" />
              </div>
              <div className="flex min-h-0 flex-1 flex-col gap-2.5 overflow-hidden">
                {Array.from({ length: 3 }).map((_, j) => (
                  <div
                    key={j}
                    className="rounded-xl border border-border/60 p-3"
                  >
                    <div className="flex gap-3">
                      <Skeleton className="size-12 shrink-0 rounded-xl" />
                      <div className="min-w-0 flex-1 space-y-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-3 w-2/3" />
                        <Skeleton className="h-3 w-1/2" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function KanbanPageSkeleton() {
  return (
    <div className="flex min-w-0 flex-col gap-6">
      <DashboardIntroSkeleton />
      <KanbanToolbarSkeleton />
      <KanbanBoardSkeleton />
    </div>
  );
}
