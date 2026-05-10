import { applicationStatusLabel } from "@/modules/applications/lib/application-status-labels";
import { listDashboardApplications } from "@/modules/applications/services/application-list.service";
import { listTeamOptionsForUser } from "@/modules/teams/services/team.service";
import { DashboardPageIntro } from "@/modules/dashboard/components/dashboard-page-intro";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Columns3, Plus } from "lucide-react";

export const metadata = {
  title: "Applications | MeroUniversität",
};

export default async function ApplicationsPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) {
    redirect("/sign-in");
  }

  const apps = await listDashboardApplications(session.user.id);
  const myTeams = await listTeamOptionsForUser(session.user.id);
  const myTeamIds = new Set(myTeams.map((t) => t.id));

  return (
    <div className="flex flex-col gap-8">
      <DashboardPageIntro
        crumbs={[{ label: "Applications" }]}
        title="Applications"
        description="Solo and team rows you can see. Edit your own entries; use Me too when a teammate applied to the same university team pipeline."
      >
        <Link
          className={cn(
            buttonVariants({ size: "lg" }),
            "h-11 rounded-xl border-white/35 bg-white/10 text-white backdrop-blur hover:bg-white hover:text-[#0d2145]",
          )}
          href="/dashboard/applications/kanban"
        >
          <Columns3 className="size-4" strokeWidth={1.8} />
          Kanban board
        </Link>
        <Link
          className={cn(
            buttonVariants({ size: "lg" }),
            "h-11 rounded-xl bg-white text-[#0d2145] shadow-lg shadow-black/10 hover:bg-white/90",
          )}
          href="/dashboard/applications/new"
        >
          <Plus className="size-4" strokeWidth={1.8} />
          New application
        </Link>
      </DashboardPageIntro>

      <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-[0_12px_35px_rgba(15,23,42,0.06)] ring-1 ring-slate-900/[0.03]">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1020px] text-left text-sm">
            <thead className="border-b border-slate-100 bg-slate-50/90">
              <tr>
                <th className="px-5 py-3 font-semibold text-[#0d2145]">
                  University
                </th>
                <th className="px-5 py-3 font-semibold text-[#0d2145]">
                  Program / subject
                </th>
                <th className="px-5 py-3 font-semibold text-[#0d2145]">Intake</th>
                <th className="px-5 py-3 font-semibold text-[#0d2145]">Owner</th>
                <th className="px-5 py-3 font-semibold text-[#0d2145]">Team</th>
                <th className="px-5 py-3 font-semibold text-[#0d2145]">Status</th>
                <th className="px-5 py-3 font-semibold text-[#0d2145]">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {apps.length === 0 ? (
                <tr>
                  <td
                    className="text-muted-foreground px-5 py-12 text-center"
                    colSpan={7}
                  >
                    No applications yet.{" "}
                    <Link
                      className="text-primary font-semibold underline-offset-4 hover:underline"
                      href="/dashboard/applications/new"
                    >
                      Create your first
                    </Link>
                    .
                  </td>
                </tr>
              ) : (
                apps.map((a) => {
                  const isOwner = a.userId === session.user.id;
                  const canMeToo =
                    !isOwner &&
                    Boolean(a.teamId) &&
                    myTeamIds.has(a.teamId as string);

                  return (
                    <tr
                      key={a.id}
                      className="border-b border-slate-50 last:border-0"
                    >
                      <td className="px-5 py-4">
                        <p className="font-semibold text-[#0d2145]">
                          {a.universityName}
                        </p>
                        <p className="text-muted-foreground text-xs">
                          {a.city ?? "—"}
                        </p>
                      </td>
                      <td className="text-muted-foreground px-5 py-4">
                        {a.program?.name ?? a.programName ?? "—"}
                        {a.mirrorsApplication ? (
                          <span className="mt-1 block text-xs text-amber-800">
                            Linked to {a.mirrorsApplication.user.name}&apos;s entry
                          </span>
                        ) : null}
                      </td>
                      <td className="text-muted-foreground px-5 py-4">
                        {a.intakeSemester ?? "—"}
                      </td>
                      <td className="px-5 py-4">
                        <span className="text-sm font-medium">{a.user.name}</span>
                      </td>
                      <td className="text-muted-foreground px-5 py-4">
                        {a.team?.name ?? "—"}
                      </td>
                      <td className="px-5 py-4">
                        <Badge variant="outline" className="font-medium">
                          {applicationStatusLabel(a.status)}
                        </Badge>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex flex-col gap-1.5">
                          {isOwner ? (
                            <Link
                              className="text-primary text-xs font-semibold underline-offset-4 hover:underline"
                              href={`/dashboard/applications/${a.id}/edit`}
                            >
                              Edit
                            </Link>
                          ) : null}
                          {canMeToo ? (
                            <Link
                              className="text-xs font-semibold text-amber-800 underline-offset-4 hover:underline"
                              href={`/dashboard/applications/new?mirror=${a.id}`}
                            >
                              Me too
                            </Link>
                          ) : null}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
