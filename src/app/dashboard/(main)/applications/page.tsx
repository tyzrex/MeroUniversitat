import { ApplicationsMainView } from "@/modules/applications/components/applications-data-view";
import { ApplicationsStatsCards } from "@/modules/applications/components/applications-stats-cards";
import {
  ApplicationsMainBodySkeleton,
  ApplicationsStatsSkeleton,
} from "@/modules/applications/components/applications-skeletons";
import { DashboardPageIntro } from "@/modules/dashboard/components/dashboard-page-intro";
import {
  dashboardOutlineActionClass,
  dashboardPrimaryActionClass,
} from "@/modules/dashboard/lib/dashboard-header-actions";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Columns3, Plus } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

export const metadata = {
  title: "Applications | MeroUniversität",
};

export default async function ApplicationsPage({
  searchParams,
}: Readonly<{
  searchParams: Promise<{
    team?: string;
    status?: string;
    q?: string;
    intake?: string;
    page?: string;
  }>;
}>) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) {
    redirect("/sign-in");
  }

  const sp = await searchParams;

  return (
    <div className="flex min-w-0 flex-col gap-6">
      <DashboardPageIntro
        className="rounded-none border-0 bg-transparent p-0 shadow-none ring-0 md:p-0"
        crumbs={[{ label: "Applications" }]}
        title="Applications"
        description={
          <>
            Track and manage all university applications in one place. Use{" "}
            <strong className="font-semibold text-orange-700">Me too</strong>{" "}
            when a teammate applied to the same university.
          </>
        }
      >
        <Link
          className={dashboardOutlineActionClass()}
          href="/dashboard/applications/kanban"
        >
          <Columns3 className="size-4" strokeWidth={1.8} />
          Kanban Board
        </Link>
        <Link
          className={dashboardPrimaryActionClass()}
          href="/dashboard/applications/new"
        >
          <Plus className="size-4" strokeWidth={1.8} />
          New Application
        </Link>
      </DashboardPageIntro>

      <Suspense fallback={<ApplicationsStatsSkeleton />}>
        <ApplicationsStatsCards userId={session.user.id} />
      </Suspense>

      <Suspense fallback={<ApplicationsMainBodySkeleton />}>
        <ApplicationsMainView userId={session.user.id} searchParams={sp} />
      </Suspense>
    </div>
  );
}
