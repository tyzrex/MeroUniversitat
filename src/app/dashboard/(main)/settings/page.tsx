import { DashboardPageIntro } from "@/modules/dashboard/components/dashboard-page-intro";
import {
  dashboardOutlineActionClass,
  dashboardPrimaryActionClass,
} from "@/modules/dashboard/lib/dashboard-header-actions";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  ClipboardList,
  Database,
  GraduationCap,
  Shield,
  UserRound,
} from "lucide-react";

export default async function SettingsPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) {
    redirect("/sign-in");
  }

  const profile = await db.profile.findUnique({
    where: { userId: session.user.id },
    select: {
      peerMatchingOptIn: true,
      gpa: true,
      percentage: true,
    },
  });

  const submissionCount = await db.acceptanceRecord.count({
    where: { userId: session.user.id },
  });

  const hasAcademicHint =
    profile?.gpa != null ||
    profile?.percentage != null ||
    profile?.peerMatchingOptIn;

  return (
    <div className="flex flex-col gap-8">
      <DashboardPageIntro
        className="rounded-none border-0 bg-transparent p-0 shadow-none ring-0 md:p-0"
        crumbs={[{ label: "Settings" }]}
        title="Settings"
        description="Profile, community sharing, and discovery preferences."
      />

      <section className="rounded-3xl border border-slate-200/80 bg-gradient-to-br from-white via-slate-50/60 to-indigo-50/25 p-6 ring-1 ring-slate-900/5 md:p-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div className="flex gap-4">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-[#0d2145]/90 text-white shadow-md">
              <UserRound className="size-6" strokeWidth={1.8} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#0d2145] md:text-xl">
                Academic profile
              </h2>
              <p className="text-muted-foreground mt-2 max-w-xl text-sm leading-relaxed">
                GPA, percentage, tests, and target intake — used for dashboard
                insights and optional peer matching.
              </p>
              {!hasAcademicHint ? (
                <p className="mt-3 text-sm font-medium text-amber-800">
                  Add GPA or percentage so your stats and community submissions stay
                  consistent.
                </p>
              ) : null}
            </div>
          </div>
          <Link
            href="/dashboard/profile"
            className={dashboardPrimaryActionClass("shrink-0")}
          >
            Edit profile
          </Link>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200/80 bg-white p-6 ring-1 ring-slate-900/5 md:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex gap-4">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-[#4a52c8]/15 text-[#4a52c8]">
              <Shield className="size-6" strokeWidth={1.8} />
            </div>
            <div className="max-w-xl">
              <h2 className="text-lg font-bold text-[#0d2145]">
                Similar applicants &amp; data sharing
              </h2>
              <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                Peer discovery is{" "}
                <strong className="text-[#0d2145]">off by default</strong>. Turn it
                on from your profile to let opted-in users near your GPA see which
                universities you track — never your documents or private Kanban
                notes.
              </p>
              <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
                Current opt-in:{" "}
                <span className="font-semibold text-[#0d2145]">
                  {profile?.peerMatchingOptIn ? "On" : "Off"}
                </span>
              </p>
            </div>
          </div>
          <Link
            href="/dashboard/profile#peer-matching"
            className={dashboardOutlineActionClass("shrink-0")}
          >
            Manage in profile
          </Link>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200/80 bg-white p-6 ring-1 ring-slate-900/5 md:p-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div className="flex gap-4">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
              <Database className="size-6" strokeWidth={1.8} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#0d2145]">
                Community acceptance data
              </h2>
              <p className="text-muted-foreground mt-2 max-w-xl text-sm leading-relaxed">
                Submit outcomes or review moderation status. Forms pre-fill GPA and
                scores from your profile when you&apos;re signed in.
              </p>
              <p className="mt-3 text-sm font-semibold text-[#0d2145]">
                Your submissions: {submissionCount}
              </p>
            </div>
          </div>
          <div className="flex shrink-0 flex-wrap gap-2">
            <Link
              href="/dashboard/community-data"
              className={dashboardPrimaryActionClass()}
            >
              <GraduationCap className="size-4" strokeWidth={1.8} />
              Share outcome
            </Link>
            <Link
              href="/dashboard/community-data/submissions"
              className={dashboardOutlineActionClass()}
            >
              <ClipboardList className="size-4" strokeWidth={1.8} />
              My submissions
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
