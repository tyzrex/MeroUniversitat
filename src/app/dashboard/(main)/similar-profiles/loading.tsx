import { DashboardBannerSkeleton } from "@/modules/dashboard/components/dashboard-route-skeletons";
import { Skeleton } from "@/components/ui/skeleton";

export default function SimilarProfilesLoading() {
  return (
    <div className="flex flex-col gap-8">
      <DashboardBannerSkeleton />
      <div className="rounded-3xl border border-slate-200/80 bg-white p-6 md:p-8">
        <Skeleton className="h-6 w-48" />
        <div className="mt-8 space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-2xl" />
          ))}
        </div>
      </div>
    </div>
  );
}
