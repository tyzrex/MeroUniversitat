import { UniversitiesDirectoryDashboard } from "@/modules/community/components/universities-directory-dashboard";
import {
  DashboardBannerSkeleton,
  UniversityCardsGridSkeleton,
} from "@/modules/dashboard/components/dashboard-route-skeletons";
import { Suspense } from "react";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Universities | MeroUniversität",
  description:
    "Browse and manage German universities from your dashboard.",
};

function UniversitiesFallback() {
  return (
    <div className="flex flex-col gap-8">
      <DashboardBannerSkeleton />
      <div className="rounded-3xl border border-slate-200/80 bg-white p-4  sm:flex sm:items-center sm:gap-3">
        <div className="h-12 flex-1 rounded-2xl bg-slate-100" />
        <div className="mt-3 h-12 w-full rounded-2xl bg-slate-100 sm:mt-0 sm:w-28" />
      </div>
      <UniversityCardsGridSkeleton />
    </div>
  );
}

export default function DashboardUniversitiesPage({
  searchParams,
}: Readonly<{
  searchParams: Promise<{ q?: string; page?: string }>;
}>) {
  return (
    <Suspense fallback={<UniversitiesFallback />}>
      <UniversitiesDirectoryPageInner searchParams={searchParams} />
    </Suspense>
  );
}

async function UniversitiesDirectoryPageInner({
  searchParams,
}: Readonly<{
  searchParams: Promise<{ q?: string; page?: string }>;
}>) {
  const params = await searchParams;
  const q = params.q ?? "";
  const page = Math.max(1, Number(params.page ?? "1") || 1);
  return (
    <div className="flex flex-col gap-8">
      <UniversitiesDirectoryDashboard query={q} page={page} />
    </div>
  );
}
