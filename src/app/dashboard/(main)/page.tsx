import type { Metadata } from "next";
import { DashboardHomeContent } from "@/modules/dashboard/components/dashboard-home-content";
import { DashboardHomeSkeleton } from "@/modules/dashboard/components/dashboard-route-skeletons";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Dashboard",
  description:
    "Overview of your applications, upcoming deadlines, and recent activity.",
};

export default async function DashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) {
    redirect("/sign-in");
  }

  return (
    <Suspense fallback={<DashboardHomeSkeleton />}>
      <DashboardHomeContent userId={session.user.id} />
    </Suspense>
  );
}
