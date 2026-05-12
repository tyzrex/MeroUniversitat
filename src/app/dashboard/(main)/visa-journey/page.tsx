import { DashboardPageIntro } from "@/modules/dashboard/components/dashboard-page-intro";
import {
  dashboardOutlineActionClass,
  dashboardPrimaryActionClass,
} from "@/modules/dashboard/lib/dashboard-header-actions";
import { VisaJourneyTracker } from "@/modules/visa/components/visa-journey-tracker";
import { listVisaCheckpointsForUser } from "@/modules/visa/services/visa-journey.service";
import { VisaJourneySectionSkeleton } from "@/modules/dashboard/components/dashboard-route-skeletons";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import Link from "next/link";
import { CalendarClock, MapPin, Sparkles } from "lucide-react";
import { redirect } from "next/navigation";
import { Suspense } from "react";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Visa & embassy journey | MeroUniversität",
  description:
    "Track your visa and embassy journey from application to passport pickup.",
};

export default function VisaJourneyPage() {
  return (
    <div className="flex min-w-0 flex-col gap-6">
      <DashboardPageIntro
        className="rounded-none border-0 bg-transparent p-0 shadow-none ring-0 md:p-0"
        crumbs={[{ label: "Visa & embassy journey" }]}
        title="Track every milestone"
        description={
          <>
            Log dates as you move from documents and admission through CSP,
            embassy queue, prelim and review, interview, and passport pickup.
            Optional expected-next dates help during long waits — toggle
            community sharing in profile when you’re ready.
          </>
        }
      >
        <Link
          className={dashboardOutlineActionClass(
            "inline-flex items-center gap-2",
          )}
          href="/dashboard/profile#embassy-timeline"
        >
          <Sparkles className="size-4" strokeWidth={1.75} />
          Sharing settings
        </Link>
        <Link
          className={dashboardPrimaryActionClass(
            "inline-flex items-center gap-2 shadow-lg shadow-[#1238da]/20",
          )}
          href="/dashboard/timelines"
        >
          <MapPin className="size-4" strokeWidth={1.75} />
          Consular timeline
        </Link>
      </DashboardPageIntro>

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
    <section className="rounded-3xl border border-slate-200/80 bg-gradient-to-br from-[#0d2145]/3 via-white to-indigo-50/40 p-6  ring-1 ring-slate-900/5 md:p-8">
      <div className="mb-6 flex flex-wrap items-start gap-3 border-b border-slate-100 pb-6">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-700">
          <CalendarClock className="size-5" strokeWidth={1.75} />
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="text-lg font-bold text-[#0d2145]">
            Milestone checklist
          </h2>
          <p className="text-muted-foreground mt-1 max-w-2xl text-sm leading-relaxed">
            Save each row when you&apos;re done editing. Clearing dates removes
            that step. Aggregated community intelligence lives on{" "}
            <Link
              href="/dashboard/timelines"
              className="font-semibold text-[#1238da] underline-offset-4 hover:underline"
            >
              Consular timeline
            </Link>
            .
          </p>
        </div>
      </div>
      <VisaJourneyTracker checkpoints={checkpoints} />
    </section>
  );
}
