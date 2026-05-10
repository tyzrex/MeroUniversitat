import { CreateTeamForm } from "@/modules/teams/components/create-team-form";
import { JoinTeamForm } from "@/modules/teams/components/join-team-form";
import { listTeamsForUser } from "@/modules/teams/services/team.service";
import { DashboardPageIntro } from "@/modules/dashboard/components/dashboard-page-intro";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import { cn } from "@/lib/utils";
import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Columns3 } from "lucide-react";

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
  }));

  const rows = [...ownedRows, ...memberRows];

  const totalMembersAcross = rows.reduce((acc, r) => acc + r.memberCount, 0);
  const activeTeams = rows.length;

  return (
    <div className="flex flex-col gap-8">
      <DashboardPageIntro
        crumbs={[{ label: "Teams" }]}
        title="Team management"
        description="Create a space for your cohort, invite others with a code, and attach shared applications so everyone sees the same Kanban."
      >
        <Link
          className={cn(
            buttonVariants({ size: "lg" }),
            "h-11 rounded-xl border border-slate-200 bg-white text-[#0d2145] shadow-sm hover:bg-slate-50",
          )}
          href="/dashboard/applications/kanban"
        >
          <Columns3 className="size-4" strokeWidth={1.8} />
          Open Kanban
        </Link>
      </DashboardPageIntro>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard label="Your teams" value={rows.length} hint="Owned + joined" />
        <SummaryCard
          label="Seat count (approx.)"
          value={totalMembersAcross}
          hint="Sum of roster sizes"
        />
        <SummaryCard label="Active teams" value={activeTeams} hint="In your workspace" />
        <SummaryCard label="Pending invites" value="—" hint="Coming soon" />
      </section>

      <div className="grid gap-8 xl:grid-cols-[1fr_380px]">
        <div className="space-y-6">
          <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-[0_12px_35px_rgba(15,23,42,0.06)] ring-1 ring-slate-900/[0.03]">
            <div className="border-b border-slate-100 px-6 py-5">
              <h2 className="text-lg font-bold text-[#0d2145]">All teams</h2>
              <p className="text-muted-foreground mt-1 text-sm">
                Teams you own or belong to.
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] text-left text-sm">
                <thead className="border-b border-slate-100 bg-slate-50/90">
                  <tr>
                    <th className="px-6 py-3 font-semibold text-[#0d2145]">Team</th>
                    <th className="px-6 py-3 font-semibold text-[#0d2145]">Role</th>
                    <th className="px-6 py-3 font-semibold text-[#0d2145]">Members</th>
                    <th className="px-6 py-3 font-semibold text-[#0d2145]">
                      Applications
                    </th>
                    <th className="px-6 py-3 font-semibold text-[#0d2145]">
                      Invite code
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {rows.length === 0 ? (
                    <tr>
                      <td
                        className="text-muted-foreground px-6 py-10 text-center"
                        colSpan={5}
                      >
                        No teams yet — create one or join with a code (right).
                      </td>
                    </tr>
                  ) : (
                    rows.map((r) => (
                      <tr key={r.id} className="border-b border-slate-50 last:border-0">
                        <td className="px-6 py-4">
                          <p className="font-semibold text-[#0d2145]">{r.name}</p>
                          {r.description ? (
                            <p className="text-muted-foreground mt-0.5 max-w-xs truncate text-xs">
                              {r.description}
                            </p>
                          ) : null}
                        </td>
                        <td className="px-6 py-4">
                          <Badge variant="secondary" className="font-medium">
                            {r.isOwner ? "Owner" : r.memberRole}
                          </Badge>
                        </td>
                        <td className="text-muted-foreground px-6 py-4">
                          {r.memberCount}
                        </td>
                        <td className="text-muted-foreground px-6 py-4">
                          {r.applicationCount}
                        </td>
                        <td className="px-6 py-4">
                          <code className="rounded-lg bg-slate-100 px-2 py-1 text-xs">
                            {r.inviteCode}
                          </code>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="rounded-3xl border border-dashed border-slate-200 bg-white/80 p-6 text-sm text-slate-600 shadow-sm">
            <p className="font-bold text-[#0d2145]">Roadmap</p>
            <ul className="mt-2 list-inside list-disc space-y-1">
              <li>Member roles, activity feed, and invite approvals</li>
              <li>Shared application rows with “I applied here too” links</li>
            </ul>
          </div>
        </div>

        <aside className="space-y-6">
          <CreateTeamForm />
          <JoinTeamForm />
        </aside>
      </div>
    </div>
  );
}

function SummaryCard({
  hint,
  label,
  value,
}: Readonly<{ label: string; value: number | string; hint: string }>) {
  return (
    <div className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,0.05)] ring-1 ring-slate-900/[0.03]">
      <p className="text-muted-foreground text-xs font-semibold uppercase tracking-[0.16em]">
        {label}
      </p>
      <p className="mt-2 text-3xl font-extrabold tracking-tight text-[#0d2145]">
        {value}
      </p>
      <p className="text-muted-foreground mt-1 text-xs">{hint}</p>
    </div>
  );
}
