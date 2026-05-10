import { getTeamDetail } from "@/modules/teams/services/team-detail.service";
import { TeamMemberTable } from "@/modules/teams/components/team-member-table";
import { TeamInviteCodeCard } from "@/modules/teams/components/team-invite-code-card";
import { LeaveTeamButton } from "@/modules/teams/components/leave-team-button";
import { listTeamActivityForTeam } from "@/modules/teams/services/team-activity.service";
import { applicationStatusLabel } from "@/modules/applications/lib/application-status-labels";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { DashboardPageIntro } from "@/modules/dashboard/components/dashboard-page-intro";
import {
  dashboardOutlineActionClass,
  dashboardPrimaryActionClass,
} from "@/modules/dashboard/lib/dashboard-header-actions";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  Columns3,
  Crown,
  FileText,
  Plus,
  Users,
} from "lucide-react";

export async function generateMetadata() {
  return { title: `Team | MeroUniversität` };
}

export default async function TeamDetailPage({
  params,
}: Readonly<{
  params: Promise<{ id: string }>;
}>) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) {
    redirect("/sign-in");
  }

  const { id: teamId } = await params;
  const team = await getTeamDetail(teamId, session.user.id);

  if (!team) {
    notFound();
  }

  const totalApps = team._count.applications;
  const activity = await listTeamActivityForTeam(team.id, 10);
  const statusCounts = team.applications.reduce<Record<string, number>>(
    (acc, a) => {
      acc[a.status] = (acc[a.status] ?? 0) + 1;
      return acc;
    },
    {},
  );
  const statusBars = Object.entries(statusCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);
  const maxCount = Math.max(1, ...statusBars.map(([, v]) => v));

  return (
    <div className="flex flex-col gap-8">
      <DashboardPageIntro
        className="rounded-none border-0 bg-transparent p-0 shadow-none ring-0 md:p-0"
        crumbs={[
          { label: "Teams", href: "/dashboard/teams" },
          { label: team.name },
        ]}
        title={team.name}
        description={
          team.description ??
          "Shared applications and activity for this team. Owners manage the invite code; admins help moderate members."
        }
      >
        <Link className={dashboardOutlineActionClass()} href="/dashboard/teams">
          All teams
        </Link>
        <Link
          className={dashboardPrimaryActionClass()}
          href={`/dashboard/applications/kanban?team=${teamId}`}
        >
          <Columns3 className="size-4" strokeWidth={1.8} />
          Team Kanban
        </Link>
      </DashboardPageIntro>

      {/* Summary stats */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          label="Members"
          value={team._count.members}
          hint="Active in this team"
          icon={<Users className="size-5 text-[#4a52c8]" strokeWidth={1.8} />}
        />
        <SummaryCard
          label="Applications"
          value={totalApps}
          hint="Shared pipeline"
          icon={
            <FileText className="size-5 text-[#4a52c8]" strokeWidth={1.8} />
          }
        />
        <SummaryCard
          label="Owner"
          value={team.owner.name}
          hint={team.isOwner ? "You" : "Team creator"}
          icon={<Crown className="size-5 text-amber-500" strokeWidth={1.8} />}
        />
        <SummaryCard
          label="Created"
          value={new Date(team.createdAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
          hint="Team start date"
        />
      </section>

      {/* Main content + sidebar */}
      <div className="grid gap-8 xl:grid-cols-[1fr_320px]">
        {/* Left: Members table + Applications */}
        <div className="space-y-8">
          <TeamMemberTable
            teamId={team.id}
            members={team.members}
            currentUserId={session.user.id}
            isOwner={team.isOwner}
            isAdmin={team.isAdmin}
          />

          {/* Recent team applications */}
          <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-[0_12px_35px_rgba(15,23,42,0.06)] ring-1 ring-slate-900/3">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
              <div>
                <h2 className="text-lg font-bold text-[#0d2145]">
                  Team applications
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Recent applications shared within this team.
                </p>
              </div>
              <Link
                className={cn(
                  buttonVariants({ size: "sm" }),
                  "rounded-lg bg-[#0d2145] hover:bg-[#1a3461]",
                )}
                href={`/dashboard/applications/new`}
              >
                <Plus className="size-3.5" strokeWidth={2} />
                New
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] text-left text-sm">
                <thead className="border-b border-slate-100 bg-slate-50/90">
                  <tr>
                    <th className="px-6 py-3 font-semibold text-[#0d2145]">
                      University
                    </th>
                    <th className="px-6 py-3 font-semibold text-[#0d2145]">
                      Program
                    </th>
                    <th className="px-6 py-3 font-semibold text-[#0d2145]">
                      Applicant
                    </th>
                    <th className="px-6 py-3 font-semibold text-[#0d2145]">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {team.applications.length === 0 ? (
                    <tr>
                      <td
                        className="px-6 py-10 text-center text-sm text-slate-500"
                        colSpan={4}
                      >
                        No applications yet.{" "}
                        <Link
                          className="font-semibold text-[#4a52c8] underline-offset-4 hover:underline"
                          href="/dashboard/applications/new"
                        >
                          Create the first one
                        </Link>
                        .
                      </td>
                    </tr>
                  ) : (
                    team.applications.map((app) => (
                      <tr
                        key={app.id}
                        className="border-b border-slate-50 last:border-0"
                      >
                        <td className="px-6 py-4">
                          <p className="font-semibold text-[#0d2145]">
                            {app.universityName}
                          </p>
                          <p className="text-xs text-slate-500">
                            {app.university?.city ?? "—"}
                          </p>
                        </td>
                        <td className="px-6 py-4 text-slate-600">
                          {app.program?.name ?? app.programName ?? "—"}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            {app.user.image ? (
                              <Image
                                alt=""
                                className="size-6 rounded-full object-cover"
                                height={24}
                                src={app.user.image}
                                width={24}
                              />
                            ) : (
                              <div className="flex size-6 items-center justify-center rounded-full bg-slate-100 text-[10px] font-bold text-slate-600">
                                {app.user.name?.charAt(0)?.toUpperCase() ?? "?"}
                              </div>
                            )}
                            <span className="text-sm font-medium text-slate-700">
                              {app.user.name}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <Badge variant="outline" className="font-medium">
                            {applicationStatusLabel(app.status)}
                          </Badge>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right sidebar */}
        <aside className="space-y-6">
          <TeamInviteCodeCard
            teamId={team.id}
            inviteCode={team.inviteCode}
            isOwner={team.isOwner}
          />

          <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-[0_12px_35px_rgba(15,23,42,0.06)] ring-1 ring-slate-900/3">
            <h3 className="text-lg font-bold text-[#0d2145]">Activity log</h3>
            <p className="mt-1 text-sm text-slate-500">
              Recent joins and application changes for this team.
            </p>
            {activity.length === 0 ? (
              <p className="mt-4 text-sm text-slate-500">No activity yet.</p>
            ) : (
              <ul className="mt-4 space-y-3">
                {activity.map((it, idx) => (
                  <li
                    key={`${it.type}-${it.at.toISOString()}-${idx}`}
                    className="text-sm"
                  >
                    <span className="font-semibold text-[#0d2145]">
                      {it.actorName}
                    </span>{" "}
                    <span className="text-slate-600">
                      {it.type === "member_joined"
                        ? "joined"
                        : it.type === "application_created"
                          ? "added an application"
                          : "updated an application"}
                    </span>
                    {it.type !== "member_joined" ? (
                      <span className="text-slate-500">
                        {" "}
                        · {it.universityName}
                      </span>
                    ) : null}
                    <span className="text-slate-400"> · </span>
                    <span className="text-xs text-slate-400">
                      {new Intl.DateTimeFormat("en", {
                        month: "short",
                        day: "numeric",
                      }).format(it.at)}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-[0_12px_35px_rgba(15,23,42,0.06)] ring-1 ring-slate-900/3">
            <h3 className="text-lg font-bold text-[#0d2145]">
              Pipeline snapshot
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              Quick distribution of team applications by status.
            </p>
            {statusBars.length === 0 ? (
              <p className="mt-4 text-sm text-slate-500">
                No applications yet.
              </p>
            ) : (
              <div className="mt-4 space-y-3">
                {statusBars.map(([status, count]) => (
                  <div key={status}>
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-700">
                        {applicationStatusLabel(status)}
                      </span>
                      <span className="text-slate-400">{count}</span>
                    </div>
                    <div className="mt-1 h-2 rounded-full bg-slate-100">
                      <div
                        className="h-2 rounded-full bg-[#4a52c8]"
                        style={{
                          width: `${Math.round((count / maxCount) * 100)}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {!team.isOwner ? (
            <LeaveTeamButton teamId={team.id} teamName={team.name} />
          ) : null}

          <div className="rounded-2xl border border-dashed border-slate-200 bg-white/80 p-5 text-sm text-slate-600 ">
            <p className="font-bold text-[#0d2145]">Team tips</p>
            <ul className="mt-2 list-inside list-disc space-y-1 text-xs">
              <li>Share the invite code with friends to grow your team</li>
              <li>
                Use{" "}
                <Link
                  className="font-semibold text-[#4a52c8] hover:underline"
                  href="/dashboard/applications/new"
                >
                  New application
                </Link>{" "}
                to add a shared row
              </li>
              <li>
                See who applied where on the{" "}
                <Link
                  className="font-semibold text-[#4a52c8] hover:underline"
                  href="/dashboard/applications/kanban"
                >
                  Kanban board
                </Link>
              </li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}

function SummaryCard({
  label,
  value,
  hint,
  icon,
}: Readonly<{
  label: string;
  value: string | number;
  hint: string;
  icon?: React.ReactNode;
}>) {
  return (
    <div className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,0.05)] ring-1 ring-slate-900/3">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
            {label}
          </p>
          <p className="mt-2 text-2xl font-extrabold tracking-tight text-[#0d2145]">
            {value}
          </p>
          <p className="mt-1 text-xs text-slate-400">{hint}</p>
        </div>
        {icon ? (
          <div className="flex size-11 items-center justify-center rounded-2xl bg-blue-50">
            {icon}
          </div>
        ) : null}
      </div>
    </div>
  );
}
