import { DashboardBannerHero } from "@/modules/shared/components/dashboard-banner-hero";
import { SimilarPeersPanel } from "@/modules/dashboard/components/similar-peers-panel";
import { Skeleton } from "@/components/ui/skeleton";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export const metadata = {
  title: "Similar applicants | MeroUniversität",
};

function SimilarPeersFallback() {
  return (
    <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm ring-1 ring-slate-900/5 md:p-8">
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

export default function SimilarProfilesPage() {
  return (
    <div className="flex flex-col gap-8">
      <DashboardBannerHero
        crumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Similar applicants" },
        ]}
        eyebrow="Peer discovery"
        title="Applicants near your GPA"
        description={
          <>
            When you opt in on your profile, you can see other students who opted in and
            sit within ±0.25 GPA points — names and universities they track only, never
            documents or private notes.
          </>
        }
        actions={
          <Link
            href="/dashboard/profile#peer-matching"
            className="inline-flex h-12 items-center rounded-xl bg-white px-6 text-sm font-bold text-[#1238da] hover:bg-blue-50"
          >
            Peer matching settings
          </Link>
        }
      />

      <Suspense fallback={<SimilarPeersFallback />}>
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

  return (
    <SimilarPeersPanel userId={session.user.id} variant="fullPage" />
  );
}
