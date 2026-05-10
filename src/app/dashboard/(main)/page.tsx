import { DashboardPageIntro } from "@/modules/dashboard/components/dashboard-page-intro";
import {
  dashboardOutlineActionClass,
  dashboardPrimaryActionClass,
} from "@/modules/dashboard/lib/dashboard-header-actions";
import { getDashboardStats } from "@/modules/dashboard/services/dashboard-stats.service";
import { SimilarPeersPanel } from "@/modules/dashboard/components/similar-peers-panel";
import {
  dashboardInsightShell,
  dashboardInsightShellAlt,
} from "@/modules/dashboard/lib/dashboard-theme";
import { applicationStatusLabel } from "@/modules/applications/lib/application-status-labels";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import {
  ArrowRight,
  Building2,
  Calendar,
  CalendarClock,
  ClipboardList,
  Columns3,
  Database,
  FileText,
  GraduationCap,
  KeyRound,
  Plus,
  Sparkles,
  UserCircle2,
  Users,
  UsersRound,
} from "lucide-react";
import Link from "next/link";
import type { ComponentType } from "react";

const PIPELINE_BAR_COLORS = [
  "#4f46e5",
  "#7c3aed",
  "#2563eb",
  "#0d9488",
  "#ea580c",
  "#db2777",
  "#ca8a04",
  "#059669",
  "#dc2626",
  "#0891b2",
  "#9333ea",
];

export default async function DashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) {
    redirect("/sign-in");
  }

  const stats = await getDashboardStats(session.user.id);

  const quickActions = getQuickActions(stats.workspacePreference, stats.teamCount);

  const maxStatus = Math.max(
    1,
    ...stats.statusBreakdown.map((s) => s.count),
  );

  return (
    <div className="flex flex-col gap-8">
      <DashboardPageIntro
        className="rounded-none border-0 bg-transparent p-0 shadow-none ring-0 md:p-0"
        crumbs={[{ label: "Overview" }]}
        title="Your Germany application hub"
        description={
          <>
            Deadlines, Kanban, teams, and community outcomes — scoped to you and the
            teams you join.
          </>
        }
      >
        <Link
          className={dashboardPrimaryActionClass()}
          href="/dashboard/applications/new"
        >
          <Plus className="size-4" strokeWidth={1.8} />
          New application
        </Link>
        <Link
          className={dashboardOutlineActionClass()}
          href="/dashboard/applications/kanban"
        >
          <Columns3 className="size-4" strokeWidth={1.8} />
          Kanban board
        </Link>
      </DashboardPageIntro>

      {stats.profileIncomplete ? (
        <section className="rounded-3xl border border-amber-200/90 bg-gradient-to-br from-amber-50 via-orange-50/80 to-rose-50/60 p-6 ring-1 ring-amber-100/80 md:p-7">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-white text-amber-700 shadow-sm ring-1 ring-amber-100">
                <UserCircle2 className="size-7" strokeWidth={1.8} />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-800/90">
                  Profile
                </p>
                <h2 className="mt-1 text-lg font-bold text-[#0d2145] md:text-xl">
                  Complete your academic profile
                </h2>
                <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-700">
                  Add GPA, degree background, or target intake so recommendations and
                  community submissions stay accurate — it takes under two minutes.
                </p>
              </div>
            </div>
            <Link
              href="/dashboard/settings"
              className={dashboardPrimaryActionClass(
                "shrink-0 bg-[#c2410c] hover:bg-[#9a3412]",
              )}
            >
              Open settings
            </Link>
          </div>
        </section>
      ) : null}

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <GradientMetricCard
          accent="from-indigo-500/15 via-white to-violet-500/10"
          iconWrapClass="bg-indigo-500/15 text-indigo-700"
          icon={GraduationCap}
          label="Applications"
          value={stats.applicationCount}
          hint={
            stats.applicationCount === 0
              ? "Start tracking"
              : `${stats.statusBreakdown[0]?.count ?? 0} · ${applicationStatusLabel(stats.statusBreakdown[0]?.status ?? "")}`
          }
        />
        <GradientMetricCard
          accent="from-sky-500/15 via-white to-cyan-500/10"
          iconWrapClass="bg-sky-500/15 text-sky-800"
          icon={Users}
          label="Teams"
          value={stats.teamCount}
          hint={
            stats.teamCount === 0 ? "Join or create" : "Active memberships"
          }
        />
        <GradientMetricCard
          accent="from-emerald-500/15 via-white to-teal-500/10"
          iconWrapClass="bg-emerald-500/15 text-emerald-800"
          icon={Database}
          label="Community submissions"
          value={stats.acceptanceSubmissionCount}
          hint={
            stats.acceptanceSubmissionCount === 0
              ? "Share your first outcome"
              : "Outcomes you submitted"
          }
          href="/dashboard/community-data/submissions"
        />
        {stats.nearestDeadline ? (
          <GradientMetricCard
            accent="from-rose-500/15 via-white to-fuchsia-500/10"
            iconWrapClass="bg-rose-500/15 text-rose-800"
            icon={Calendar}
            label="Next deadline"
            value={stats.nearestDeadline.deadline.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })}
            hint={stats.nearestDeadline.universityName}
            href="/dashboard/applications"
          />
        ) : (
          <GradientMetricCard
            accent="from-blue-500/15 via-white to-indigo-500/10"
            iconWrapClass="bg-blue-500/15 text-blue-900"
            icon={Building2}
            label="Universities"
            value="Browse"
            hint="Directory & stats per uni"
            href="/dashboard/universities"
          />
        )}
      </section>

      {(stats.statusBreakdown.length > 0 ||
        stats.upcomingDeadlines.length > 0) ? (
        <section className="grid gap-6 lg:grid-cols-2">
          {stats.statusBreakdown.length > 0 ? (
            <div className={dashboardInsightShell}>
              <div className="mb-5 flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <Sparkles className="size-5 text-[#4a52c8]" strokeWidth={1.8} />
                    <h2 className="text-lg font-bold text-[#0d2145]">
                      Pipeline mix
                    </h2>
                  </div>
                  <p className="mt-1 text-sm text-slate-500">
                    Share of rows by status — matches your Kanban columns.
                  </p>
                </div>
                <Link
                  href="/dashboard/applications/kanban"
                  className="text-sm font-semibold text-[#4a52c8] hover:underline"
                >
                  Open board →
                </Link>
              </div>
              <div className="space-y-4">
                {stats.statusBreakdown.map(({ status, count }, i) => (
                  <div key={status}>
                    <div className="mb-1 flex justify-between text-sm">
                      <span className="font-medium text-slate-700">
                        {applicationStatusLabel(status)}
                      </span>
                      <span className="tabular-nums font-bold text-[#0d2145]">
                        {count}
                      </span>
                    </div>
                    <div className="h-2.5 overflow-hidden rounded-full bg-white/80 ring-1 ring-slate-200/80">
                      <div
                        className="h-full rounded-full shadow-sm"
                        style={{
                          width: `${(count / maxStatus) * 100}%`,
                          backgroundColor:
                            PIPELINE_BAR_COLORS[i % PIPELINE_BAR_COLORS.length],
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex flex-col justify-center rounded-3xl border border-dashed border-slate-200 bg-slate-50/50 p-8 text-center">
              <Sparkles className="mx-auto size-10 text-slate-300" strokeWidth={1.5} />
              <p className="mt-4 font-semibold text-[#0d2145]">
                No pipeline data yet
              </p>
              <p className="text-muted-foreground mt-2 text-sm">
                Add your first application to see status distribution here.
              </p>
              <Link
                href="/dashboard/applications/new"
                className={`${dashboardPrimaryActionClass()} mx-auto mt-5`}
              >
                Add application
              </Link>
            </div>
          )}

          {stats.upcomingDeadlines.length > 0 ? (
            <div className={dashboardInsightShellAlt}>
              <div className="mb-5 flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <CalendarClock className="size-5 text-sky-700" strokeWidth={1.8} />
                    <h2 className="text-lg font-bold text-[#0d2145]">
                      Deadline radar
                    </h2>
                  </div>
                  <p className="mt-1 text-sm text-slate-500">
                    Next dates across solo and team pipelines — stay ahead of
                    submissions.
                  </p>
                </div>
                <Link
                  href="/dashboard/applications"
                  className="text-sm font-semibold text-[#4a52c8] hover:underline"
                >
                  View list →
                </Link>
              </div>
              <ul className="space-y-3">
                {stats.upcomingDeadlines.map((row, i) => {
                  const days = Math.ceil(
                    (row.deadline.getTime() - Date.now()) / (86400000),
                  );
                  return (
                    <li
                      key={`${row.universityName}-${row.deadline.toISOString()}-${i}`}
                      className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-white/70 bg-white/90 px-4 py-3 shadow-sm ring-1 ring-slate-900/[0.04]"
                    >
                      <div className="min-w-0">
                        <p className="truncate font-semibold text-[#0d2145]">
                          {row.universityName}
                        </p>
                        {row.intakeSemester ? (
                          <p className="text-muted-foreground text-xs">
                            Intake {row.intakeSemester}
                          </p>
                        ) : null}
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                          {days <= 0 ? "Soon" : `In ${days}d`}
                        </p>
                        <p className="text-sm font-bold tabular-nums text-[#0d2145]">
                          {row.deadline.toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          ) : (
            <div className="flex flex-col justify-center rounded-3xl border border-dashed border-slate-200 bg-sky-50/40 p-8 text-center">
              <CalendarClock className="mx-auto size-10 text-sky-200" strokeWidth={1.5} />
              <p className="mt-4 font-semibold text-[#0d2145]">
                No upcoming deadlines
              </p>
              <p className="text-muted-foreground mt-2 text-sm">
                Add deadline dates on your application rows to see a countdown here.
              </p>
            </div>
          )}
        </section>
      ) : null}

      <SimilarPeersPanel userId={session.user.id} />

      {stats.workspacePreference === "SOLO" && stats.teamCount === 0 ? (
        <section className="rounded-3xl border border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50 p-6 ring-1 ring-blue-100/80">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl border border-white/80 bg-white text-[#4a52c8] ring-1 ring-slate-200/60">
                <UsersRound className="size-6" strokeWidth={1.8} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#0d2145]">
                  Want to collaborate?
                </h3>
                <p className="mt-1 max-w-md text-sm text-slate-600">
                  Create a team or join one with an invite code to share
                  applications and see everyone&apos;s progress on the same
                  Kanban board.
                </p>
              </div>
            </div>
            <div className="flex shrink-0 gap-2">
              <Link
                href="/dashboard/teams"
                className={dashboardPrimaryActionClass("gap-2")}
              >
                <Users className="size-4" strokeWidth={1.8} />
                Create team
              </Link>
              <Link
                href="/dashboard/teams"
                className={dashboardOutlineActionClass("gap-2")}
              >
                <KeyRound className="size-4" strokeWidth={1.8} />
                Join with code
              </Link>
            </div>
          </div>
        </section>
      ) : null}

      <section>
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-[#0d2145]">Quick actions</h2>
            <p className="mt-1 text-sm text-slate-500">
              Continue with the most useful parts of your workspace.
            </p>
          </div>
        </div>
        <div className="grid gap-5 lg:grid-cols-3">
          {quickActions.map(({ description, href, icon: Icon, title }) => (
            <Link
              key={href}
              className="group rounded-3xl border border-slate-200/80 bg-white p-6 ring-1 ring-slate-900/5 transition-colors hover:border-[#4a52c8]/30 hover:bg-gradient-to-br hover:from-white hover:to-indigo-50/40"
              href={href}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#4a52c8]/15 to-indigo-500/10 text-[#4a52c8]">
                  <Icon className="size-6" strokeWidth={1.8} />
                </div>
                <ArrowRight
                  className="size-4 text-slate-400 transition-transform group-hover:translate-x-1 group-hover:text-[#4a52c8]"
                  strokeWidth={1.9}
                />
              </div>
              <h3 className="mt-5 text-lg font-bold text-[#0d2145]">
                {title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                {description}
              </p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

function getQuickActions(
  preference: string | null,
  teamCount: number,
) {
  const actions: {
    title: string;
    description: string;
    href: string;
    icon: ComponentType<{ className?: string; strokeWidth?: number }>;
  }[] = [
    {
      title: "Track a new application",
      description:
        "Add a university row to your pipeline and move it on the Kanban board.",
      href: "/dashboard/applications/new",
      icon: FileText,
    },
    {
      title: "Share acceptance data",
      description:
        "Add your admission outcome to help future applicants compare profiles.",
      href: "/dashboard/community-data",
      icon: Plus,
    },
  ];

  if (teamCount > 0) {
    actions.push({
      title: "View your teams",
      description:
        "Manage members, see shared applications, and copy invite codes.",
      href: "/dashboard/teams",
      icon: UsersRound,
    });
  } else if (preference === "SOLO") {
    actions.push({
      title: "Browse universities",
      description:
        "Search the directory and see how many students track each institution.",
      href: "/dashboard/universities",
      icon: Building2,
    });
  } else {
    actions.push({
      title: "View my submissions",
      description:
        "Track moderation status and open detailed submission profiles.",
      href: "/dashboard/community-data/submissions",
      icon: ClipboardList,
    });
  }

  return actions;
}

function GradientMetricCard({
  icon: Icon,
  label,
  value,
  hint,
  accent,
  iconWrapClass,
  href,
}: Readonly<{
  icon: ComponentType<{ className?: string; strokeWidth?: number }>;
  label: string;
  value: string | number;
  hint: string;
  accent: string;
  iconWrapClass: string;
  href?: string;
}>) {
  const inner = (
    <>
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-slate-600">{label}</p>
          <p className="mt-1 text-2xl font-extrabold tracking-tight text-[#0d2145]">
            {value}
          </p>
          <p className="mt-1 text-xs text-slate-500">{hint}</p>
        </div>
        <div
          className={`flex size-11 items-center justify-center rounded-2xl ${iconWrapClass}`}
        >
          <Icon className="size-5" strokeWidth={1.8} />
        </div>
      </div>
    </>
  );

  const shell = (
    <div
      className={`rounded-3xl border border-slate-200/70 bg-gradient-to-br p-5 ring-1 ring-slate-900/[0.04] transition-colors ${accent} ${href ? "cursor-pointer hover:ring-[#4a52c8]/25" : ""}`}
    >
      {inner}
    </div>
  );

  if (href) {
    return <Link href={href}>{shell}</Link>;
  }
  return shell;
}
