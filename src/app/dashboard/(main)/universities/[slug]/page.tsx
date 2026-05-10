import { UniversityDetailView } from "@/modules/community/components/university-detail-view";
import { getUniversityApplicationStats } from "@/modules/community/services/university-application-stats.service";
import { getUniversityBySlug } from "@/modules/community/services/university.service";
import { DashboardPageIntro } from "@/modules/dashboard/components/dashboard-page-intro";
import {
  dashboardOutlineActionClass,
  dashboardPrimaryActionClass,
} from "@/modules/dashboard/lib/dashboard-header-actions";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ExternalLink, Plus } from "lucide-react";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: Readonly<{
  params: Promise<{ slug: string }>;
}>): Promise<Metadata> {
  const { slug } = await params;
  const uni = await getUniversityBySlug(slug);
  if (!uni) {
    return { title: "University | MeroUniversität" };
  }
  return {
    title: `${uni.name} | MeroUniversität`,
  };
}

export default async function DashboardUniversityDetailPage({
  params,
}: Readonly<{
  params: Promise<{ slug: string }>;
}>) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) {
    redirect("/sign-in");
  }

  const { slug } = await params;
  const uni = await getUniversityBySlug(slug);
  if (!uni) {
    notFound();
  }

  const stats = await getUniversityApplicationStats(uni.id, session.user.id);
  const newAppHref = `/dashboard/applications/new?universityId=${encodeURIComponent(uni.id)}`;

  return (
    <div className="flex flex-col gap-6">
      <DashboardPageIntro
        className="rounded-none border-0 bg-transparent p-0 shadow-none ring-0 md:p-0"
        crumbs={[
          { label: "Universities", href: "/dashboard/universities" },
          { label: uni.nameShort ?? uni.name },
        ]}
        title={uni.name}
        description={`${uni.city}${uni.state ? `, ${uni.state}` : ""} · Application stats and quick actions below.`}
      >
        <Link className={dashboardOutlineActionClass()} href="/dashboard/universities">
          Directory
        </Link>
        <Link
          className={dashboardOutlineActionClass()}
          href={`/universities/${uni.slug}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <ExternalLink className="size-4" strokeWidth={1.8} />
          Public page
        </Link>
        <Link className={dashboardPrimaryActionClass()} href={newAppHref}>
          <Plus className="size-4" strokeWidth={1.8} />
          New application
        </Link>
      </DashboardPageIntro>

      <UniversityDetailView
        embedded
        uni={uni}
        stats={stats}
        backHref="/dashboard/universities"
        backLabel="Back to directory"
        isSignedIn
        signInCallbackPath={`/dashboard/universities/${uni.slug}`}
      />
    </div>
  );
}
