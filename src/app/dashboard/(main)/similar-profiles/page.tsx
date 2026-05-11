import { DashboardBannerHero } from "@/modules/shared/components/dashboard-banner-hero";
import { SimilarPeersPanel } from "@/modules/dashboard/components/similar-peers-panel";
import { SimilarPeersPanelSkeleton } from "@/modules/dashboard/components/dashboard-route-skeletons";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { DashboardPageIntro } from "@/modules/dashboard/components/dashboard-page-intro";

export const metadata = {
  title: "Similar applicants | MeroUniversität",
};

export default function SimilarProfilesPage() {
  return (
    <div className="flex flex-col gap-8">
      <DashboardPageIntro
        crumbs={[{ label: "Similar applicants" }]}
        title="Applicants near your GPA"
        className="rounded-none border-0 bg-transparent p-0 shadow-none ring-0 md:p-0"
        description={
          <>
            When you opt in on your profile, you can see other students who
            opted in and sit within ±0.25 GPA points — names and universities
            they track only, never documents or private notes.
          </>
        }
      >
        <Link
          href="/dashboard/profile#peer-matching"
          className="inline-flex h-12 items-center rounded-xl bg-white px-6 text-sm font-bold text-[#1238da] hover:bg-blue-50"
        >
          Peer matching settings
        </Link>
      </DashboardPageIntro>

      <Suspense fallback={<SimilarPeersPanelSkeleton />}>
        <SimilarPeersBody />
      </Suspense>
    </div>
  );
}

async function SimilarPeersBody() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) {
    redirect("/sign-in");
  }

  return <SimilarPeersPanel userId={session.user.id} variant="fullPage" />;
}
