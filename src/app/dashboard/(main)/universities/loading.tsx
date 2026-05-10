import {
  DashboardBannerSkeleton,
  UniversityCardsGridSkeleton,
} from "@/modules/dashboard/components/dashboard-route-skeletons";

export default function UniversitiesLoading() {
  return (
    <div className="flex flex-col gap-8">
      <DashboardBannerSkeleton />
      <div className="rounded-3xl border border-slate-200/80 bg-white p-4 shadow-sm sm:flex sm:items-center sm:gap-3">
        <div className="h-12 flex-1 rounded-2xl bg-slate-100" />
        <div className="mt-3 h-12 w-full rounded-2xl bg-slate-100 sm:mt-0 sm:w-28" />
      </div>
      <UniversityCardsGridSkeleton />
    </div>
  );
}
