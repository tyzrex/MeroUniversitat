import { DashboardPageIntro } from "@/modules/dashboard/components/dashboard-page-intro";
import {
  dashboardOutlineActionClass,
} from "@/modules/dashboard/lib/dashboard-header-actions";
import { CreateTeamDialog } from "@/modules/teams/components/create-team-dialog";
import { JoinTeamDialog } from "@/modules/teams/components/join-team-dialog";
import { TeamListTable } from "@/modules/teams/components/team-list-table";
import { listTeamsForUser } from "@/modules/teams/services/team.service";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Columns3, FileText, Users, UsersRound } from "lucide-react";
import { TeamActivityPanel } from "@/modules/teams/components/team-activity-panel";

export const metadata = {
  title: "Team management | MeroUniversität",
};

export default async function TeamsPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) {
    redirect("/sign-in");
  }

  const { owned, memberOf } = await listTeamsForUser(session.user.id);

  const ownedRows = owned.map((t) => ({
    id: t.id,
    name: t.name,
    description: t.description,
    inviteCode: t.inviteCode,
    memberCount: t._count.members,
    applicationCount: t._count.applications,
    isOwner: true as const,
    memberRole: "OWNER" as const,
    members: t.members.map((m) => ({
      image: m.user.image,
      name: m.user.name,
    })),
  }));

  const memberRows = memberOf.map((m) => ({
    id: m.team.id,
    name: m.team.name,
    description: m.team.description,
    inviteCode: m.team.inviteCode,
    memberCount: m.team._count.members,
    applicationCount: m.team._count.applications,
    isOwner: false as const,
    memberRole: m.role,
    members: m.team.members.map((tm) => ({
      image: tm.user.image,
      name: tm.user.name,
    })),
  }));

  const rows = [...ownedRows, ...memberRows];

  const totalMembersAcross = rows.reduce((acc, r) => acc + r.memberCount, 0);
  const totalApps = rows.reduce((acc, r) => acc + r.applicationCount, 0);

  return (
    <div className="flex flex-col gap-8">
      <DashboardPageIntro
        className="rounded-none border-0 bg-transparent p-0 shadow-none ring-0 md:p-0"
        crumbs={[{ label: "Teams" }]}
        title="Team management"
        description="Manage teams, members, roles, and their shared application pipeline."
      >
        <Link
          className={dashboardOutlineActionClass()}
          href="/dashboard/applications/kanban"
        >
          <Columns3 className="size-4" strokeWidth={1.8} />
          Kanban board
        </Link>
        <CreateTeamDialog />
        <JoinTeamDialog />
      </DashboardPageIntro>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          label="Your teams"
          value={rows.length}
          icon={<UsersRound className="size-5 text-[#4a52c8]" strokeWidth={1.8} />}
        />
        <SummaryCard
          label="Total members"
          value={totalMembersAcross}
          icon={<Users className="size-5 text-[#4a52c8]" strokeWidth={1.8} />}
        />
        <SummaryCard
          label="Shared applications"
          value={totalApps}
          icon={<FileText className="size-5 text-[#4a52c8]" strokeWidth={1.8} />}
        />
        <SummaryCard
          label="Active teams"
          value={rows.length}
          icon={<Columns3 className="size-5 text-[#4a52c8]" strokeWidth={1.8} />}
        />
      </section>

      <div className="grid gap-8 xl:grid-cols-[1fr_380px]">
        <div className="space-y-6">
          <TeamListTable rows={rows} />
        </div>

        <aside className="space-y-6">
          <TeamActivityPanel userId={session.user.id} />
        </aside>
      </div>
    </div>
  );
}

function SummaryCard({
  label,
  value,
  icon,
}: Readonly<{ label: string; value: number | string; icon?: React.ReactNode }>) {
  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-5 ring-1 ring-slate-900/5">
      <div className="flex items-center gap-4">
        {icon ? (
          <div className="flex size-11 items-center justify-center rounded-2xl bg-blue-50">
            {icon}
          </div>
        ) : null}
        <div className="min-w-0">
          <p className="text-xs font-semibold text-slate-500">{label}</p>
          <p className="mt-1 text-3xl font-extrabold tracking-tight text-[#0d2145]">
            {value}
          </p>
        </div>
      </div>
    </div>
  );
}
