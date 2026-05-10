import { DashboardPageIntro } from "@/modules/dashboard/components/dashboard-page-intro";
import { getDashboardStats } from "@/modules/dashboard/services/dashboard-stats.service";
import { applicationStatusLabel } from "@/modules/applications/lib/application-status-labels";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import {
  ArrowRight,
  Building2,
  Calendar,
  ClipboardList,
  Columns3,
  Database,
  FileText,
  GraduationCap,
  KeyRound,
  Plus,
  Users,
  UsersRound,
} from "lucide-react";
import Link from "next/link";
import type { ComponentType } from "react";

export default async function DashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) {
    redirect("/sign-in");
  }

  const stats = await getDashboardStats(session.user.id);

  const quickActions = getQuickActions(stats.workspacePreference, stats.teamCount);

  return (
    <div className="flex flex-col gap-8">
      <DashboardPageIntro
        crumbs={[{ label: "Overview" }]}
        title="Your Germany application hub"
        description="Keep your applications, university research, timelines, and community contributions in one workspace. Use the sidebar to jump between tools."
      >
        <Link
          className={cn(
            buttonVariants({ size: "lg" }),
            "h-11 rounded-xl bg-[#0d2145] text-white shadow-md hover:bg-[#1a3461]",
          )}
          href="/dashboard/applications/new"
        >
          <Plus className="size-4" strokeWidth={1.8} />
          New application
        </Link>
        <Link
          className={cn(
            buttonVariants({ variant: "outline", size: "lg" }),
            "h-11 rounded-xl border-slate-200 bg-white hover:bg-slate-50",
          )}
          href="/dashboard/applications/kanban"
        >
          <Columns3 className="size-4" strokeWidth={1.8} />
          Kanban board
        </Link>
      </DashboardPageIntro>

      {/* Real metrics */}
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          icon={GraduationCap}
          label="Applications"
          value={stats.applicationCount}
          hint={
            stats.applicationCount === 0
              ? "Start tracking"
              : `${stats.statusBreakdown[0]?.count ?? 0} ${applicationStatusLabel(stats.statusBreakdown[0]?.status ?? "")}`
          }
        />
        <MetricCard
          icon={Users}
          label="Teams"
          value={stats.teamCount}
          hint={
            stats.teamCount === 0 ? "Join or create" : "Active memberships"
          }
        />
        <MetricCard
          icon={Database}
          label="Community records"
          value="Share"
          hint="Help future applicants"
        />
        {stats.nearestDeadline ? (
          <MetricCard
            icon={Calendar}
            label="Next deadline"
            value={stats.nearestDeadline.deadline.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })}
            hint={stats.nearestDeadline.universityName}
          />
        ) : (
          <MetricCard
            icon={Building2}
            label="Universities"
            value="Explore"
            hint="Browse the directory"
          />
        )}
      </section>

      {/* Status breakdown (if user has applications) */}
      {stats.statusBreakdown.length > 0 ? (
        <section className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-[0_12px_35px_rgba(15,23,42,0.06)] ring-1 ring-slate-900/[0.03]">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-[#0d2145]">
                Pipeline overview
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Where your applications stand right now.
              </p>
            </div>
            <Link
              href="/dashboard/applications"
              className="text-sm font-semibold text-[#4a52c8] hover:underline"
            >
              View all →
            </Link>
          </div>
          <div className="flex flex-wrap gap-2">
            {stats.statusBreakdown.map(({ status, count }) => (
              <div
                key={status}
                className="flex items-center gap-2 rounded-xl border border-slate-100 bg-slate-50/80 px-3 py-2"
              >
                <Badge variant="outline" className="font-semibold">
                  {applicationStatusLabel(status)}
                </Badge>
                <span className="text-sm font-bold text-[#0d2145]">
                  {count}
                </span>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {/* Team awareness banner */}
      {stats.workspacePreference === "SOLO" && stats.teamCount === 0 ? (
        <section className="rounded-3xl border border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50 p-6 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-white text-[#4a52c8] shadow-sm">
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
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "h-11 rounded-xl bg-[#0d2145] text-white hover:bg-[#1a3461]",
                )}
              >
                <Users className="size-4" strokeWidth={1.8} />
                Create team
              </Link>
              <Link
                href="/dashboard/teams"
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "h-11 rounded-xl border-slate-200 bg-white hover:bg-slate-50",
                )}
              >
                <KeyRound className="size-4" strokeWidth={1.8} />
                Join with code
              </Link>
            </div>
          </div>
        </section>
      ) : null}

      {/* Quick actions */}
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
              className="group rounded-3xl border border-slate-200/80 bg-white p-6 shadow-[0_12px_35px_rgba(15,23,42,0.06)] ring-1 ring-slate-900/[0.03] transition-all hover:-translate-y-0.5 hover:shadow-[0_18px_50px_rgba(15,23,42,0.10)]"
              href={href}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex size-12 items-center justify-center rounded-2xl bg-blue-50 text-[#4a52c8]">
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
        "Add a university program to your pipeline and monitor its progress on the Kanban board.",
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
        "Explore universities and programs from the public directory.",
      href: "/universities",
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

function MetricCard({
  icon: Icon,
  label,
  value,
  hint,
}: Readonly<{
  icon: ComponentType<{ className?: string; strokeWidth?: number }>;
  label: string;
  value: string | number;
  hint: string;
}>) {
  return (
    <div className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,0.05)] ring-1 ring-slate-900/[0.03]">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-slate-500">{label}</p>
          <p className="mt-1 text-2xl font-extrabold tracking-tight text-[#0d2145]">
            {value}
          </p>
          <p className="mt-1 text-xs text-slate-400">{hint}</p>
        </div>
        <div className="flex size-11 items-center justify-center rounded-2xl bg-blue-50 text-[#4a52c8]">
          <Icon className="size-5" strokeWidth={1.8} />
        </div>
      </div>
    </div>
  );
}
