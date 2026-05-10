import { DashboardBannerHero } from "@/modules/shared/components/dashboard-banner-hero";
import { VisaJourneyTracker } from "@/modules/visa/components/visa-journey-tracker";
import { listVisaCheckpointsForUser } from "@/modules/visa/services/visa-journey.service";
import { VisaJourneySectionSkeleton } from "@/modules/dashboard/components/dashboard-route-skeletons";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export const metadata = {
  title: "Visa & embassy journey | MeroUniversität",
};

export default function VisaJourneyPage() {
  return (
    <div className="flex flex-col gap-8">
      <DashboardBannerHero
        crumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Visa & embassy journey" },
        ]}
        eyebrow="Nepal embassy pipeline"
        title="Track every milestone in one place"
        description={
          <>
            Enter dates as you move from documents and admit through CSP, embassy queue,
            prelim and case review, interview, and passport pickup. Optional “expected
            next” dates help during long waits.
          </>
        }
        actions={
          <>
            <Link
              href="/dashboard/profile#embassy-timeline"
              className="inline-flex h-12 items-center rounded-xl border border-white/35 bg-white/10 px-6 text-sm font-bold text-white backdrop-blur hover:bg-white hover:text-[#1238da]"
            >
              Community sharing toggle
            </Link>
            <Link
              href="/dashboard/timelines"
              className="inline-flex h-12 items-center rounded-xl bg-white px-6 text-sm font-bold text-[#1238da] hover:bg-blue-50"
            >
              Consular timeline
            </Link>
          </>
        }
      />

      <Suspense fallback={<VisaJourneySectionSkeleton />}>
        <VisaJourneyBody />
      </Suspense>
    </div>
  );
}

async function VisaJourneyBody() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) {
    redirect("/sign-in");
  }

  const checkpoints = await listVisaCheckpointsForUser(session.user.id);

  return (
    <section className="rounded-3xl border border-slate-200/80 bg-gradient-to-br from-[#0d2145]/3 via-white to-indigo-50/40 p-6 shadow-sm ring-1 ring-slate-900/5 md:p-8">
      <p className="text-muted-foreground mb-8 max-w-2xl text-sm leading-relaxed">
        Save each row when you&apos;re done editing it. Clearing a date removes that
        milestone. Sharing aggregated waits with the community is optional — enable it
        from{" "}
        <Link
          href="/dashboard/profile#embassy-timeline"
          className="font-semibold text-[#1238da] underline-offset-4 hover:underline"
        >
          Profile → embassy timeline
        </Link>
        .
      </p>
      <VisaJourneyTracker checkpoints={checkpoints} />
    </section>
  );
}
