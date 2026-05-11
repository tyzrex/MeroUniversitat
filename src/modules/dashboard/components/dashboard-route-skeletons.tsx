import { Skeleton } from "@/components/ui/skeleton";

/** Main `/dashboard` overview — metrics + two-column insights + quick actions. */
export function DashboardHomeSkeleton() {
  return (
    <div className="flex flex-col gap-8">
      <div className="space-y-4">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-10 w-full max-w-xl" />
        <Skeleton className="h-4 w-full max-w-2xl" />
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-36 rounded-3xl" />
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <Skeleton className="min-h-[280px] rounded-3xl" />
        <Skeleton className="min-h-[280px] rounded-3xl" />
      </div>
      <Skeleton className="h-48 rounded-3xl" />
      <div className="grid gap-5 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-44 rounded-3xl" />
        ))}
      </div>
    </div>
  );
}

export function ConsularTimelineSkeleton() {
  return (
    <div className="flex flex-col gap-8">
      <div className="space-y-4">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-10 w-full max-w-lg" />
        <Skeleton className="h-4 w-full max-w-xl" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-28 rounded-2xl" />
        ))}
      </div>
      <Skeleton className="min-h-[240px] rounded-3xl" />
      <div className="grid gap-6 lg:grid-cols-2">
        <Skeleton className="min-h-[320px] rounded-3xl" />
        <Skeleton className="min-h-[320px] rounded-3xl" />
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Skeleton className="h-56 rounded-3xl" />
          <Skeleton className="min-h-[200px] rounded-3xl" />
        </div>
        <Skeleton className="min-h-[280px] rounded-3xl" />
      </div>
    </div>
  );
}

export function DashboardBannerSkeleton() {
  return (
    <div className="mb-6 overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
      <div className="min-h-[260px] p-7 md:p-10">
        <Skeleton className="h-4 w-40 bg-white/40" />
        <Skeleton className="mt-6 h-8 w-3/4 max-w-lg bg-white/40" />
        <Skeleton className="mt-4 h-4 w-full max-w-xl bg-white/40" />
        <Skeleton className="mt-2 h-4 w-5/6 max-w-lg bg-white/40" />
      </div>
    </div>
  );
}

export function UniversityCardsGridSkeleton({
  count = 6,
}: Readonly<{ count?: number }>) {
  return (
    <ul className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <li key={i}>
          <div className="rounded-3xl border border-slate-200/80 bg-white p-6  ring-1 ring-slate-900/5">
            <div className="flex gap-4">
              <Skeleton className="size-14 shrink-0 rounded-2xl" />
              <div className="min-w-0 flex-1 space-y-2">
                <Skeleton className="h-5 w-4/5" />
                <Skeleton className="h-4 w-2/5" />
              </div>
            </div>
            <Skeleton className="mt-5 h-12 w-full" />
            <div className="mt-5 flex gap-2 border-t border-slate-100 pt-5">
              <Skeleton className="h-6 w-24 rounded-full" />
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}

export function TeamsPageSkeleton() {
  return (
    <div className="flex flex-col gap-8">
      <div className="space-y-4">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-10 w-full max-w-xl" />
        <Skeleton className="h-4 w-full max-w-2xl" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-28 rounded-2xl" />
        ))}
      </div>
      <div className="grid gap-8 xl:grid-cols-[1fr_380px]">
        <Skeleton className="min-h-[320px] rounded-3xl" />
        <Skeleton className="min-h-[280px] rounded-3xl" />
      </div>
    </div>
  );
}

export function CommunityDataFormSkeleton() {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6  ring-1 ring-slate-900/5 md:p-8">
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-full max-w-xl" />
      </div>
      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <Skeleton className="h-12 w-full rounded-xl" />
        <Skeleton className="h-12 w-full rounded-xl" />
        <Skeleton className="h-12 w-full rounded-xl md:col-span-2" />
        <Skeleton className="h-32 w-full rounded-xl md:col-span-2" />
      </div>
    </div>
  );
}

export function CommunityDataPageSkeleton() {
  return (
    <div className="flex flex-col gap-8 pb-12">
      <DashboardBannerSkeleton />
      <CommunityDataFormSkeleton />
    </div>
  );
}

export function VisaJourneySectionSkeleton() {
  return (
    <div className="rounded-3xl border border-slate-200/80 bg-gradient-to-br from-[#0d2145]/3 via-white to-indigo-50/40 p-6  ring-1 ring-slate-900/5 md:p-8">
      <Skeleton className="mb-6 h-16 w-full max-w-xl rounded-2xl" />
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <Skeleton className="h-11 w-full rounded-none border-b border-slate-100" />
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton
            key={i}
            className="h-20 w-full rounded-none border-b border-slate-50 last:border-0"
          />
        ))}
      </div>
    </div>
  );
}

export function ProfilePageSkeleton() {
  return (
    <div className="flex flex-col gap-8">
      <DashboardBannerSkeleton />
      <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-8">
        <Skeleton className="h-8 w-56" />
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-11 rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  );
}

/** Inner panel only — use under `DashboardBannerHero` while SimilarPeers streams. */
export function SimilarPeersPanelSkeleton() {
  return (
    <div className="rounded-3xl border border-slate-200/80 bg-white p-6  ring-1 ring-slate-900/5 md:p-8">
      <Skeleton className="h-6 w-48" />
      <Skeleton className="mt-4 h-4 w-full max-w-lg" />
      <div className="mt-8 space-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-24 rounded-2xl" />
        ))}
      </div>
    </div>
  );
}

/** Full route loading — matches `similar-profiles/loading.tsx`. */
export function SimilarProfilesPageSkeleton() {
  return (
    <div className="flex flex-col gap-8">
      <DashboardBannerSkeleton />
      <SimilarPeersPanelSkeleton />
    </div>
  );
}
