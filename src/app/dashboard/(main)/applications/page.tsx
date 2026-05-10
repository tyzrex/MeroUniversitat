import { applicationStatusLabel } from "@/modules/applications/lib/application-status-labels";
import { listDashboardApplications } from "@/modules/applications/services/application-list.service";
import { listTeamOptionsForUser } from "@/modules/teams/services/team.service";
import { ApplicationsFilterBar } from "@/modules/applications/components/applications-filter-bar";
import { DashboardPageIntro } from "@/modules/dashboard/components/dashboard-page-intro";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import {
  Columns3,
  FileText,
  Plus,
} from "lucide-react";
import { Suspense } from "react";

export const metadata = {
  title: "Applications | MeroUniversität",
};

export default async function ApplicationsPage({
  searchParams,
}: Readonly<{
  searchParams: Promise<{ team?: string; status?: string; q?: string }>;
}>) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) {
    redirect("/sign-in");
  }

  const sp = await searchParams;
  const filters = {
    teamId: sp.team || undefined,
    status: sp.status || undefined,
    search: sp.q || undefined,
  };

  const [apps, myTeams] = await Promise.all([
    listDashboardApplications(session.user.id, filters),
    listTeamOptionsForUser(session.user.id),
  ]);

  const myTeamIds = new Set(myTeams.map((t) => t.id));

  const hasFilters = Boolean(sp.team || sp.status || sp.q);

  return (
    <div className="flex flex-col gap-6">
      <DashboardPageIntro
        crumbs={[{ label: "Applications" }]}
        title="Applications"
        description="Solo and team rows you can see. Edit your own entries; use Me too when a teammate applied to the same university."
      >
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
      </DashboardPageIntro>

      <Suspense>
        <ApplicationsFilterBar teamOptions={myTeams} />
      </Suspense>

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
                <th className="px-5 py-3 font-semibold text-[#0d2145]">
                  Intake
                </th>
                <th className="px-5 py-3 font-semibold text-[#0d2145]">
                  Owner
                </th>
                <th className="px-5 py-3 font-semibold text-[#0d2145]">
                  Team
                </th>
                <th className="px-5 py-3 font-semibold text-[#0d2145]">
                  Status
                </th>
                <th className="px-5 py-3 font-semibold text-[#0d2145]">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {apps.length === 0 ? (
                <tr>
                  <td
                    className="px-5 py-16 text-center"
                    colSpan={7}
                  >
                    <div className="flex flex-col items-center gap-3">
                      <div className="flex size-14 items-center justify-center rounded-2xl bg-blue-50 text-[#4a52c8]">
                        <FileText className="size-7" strokeWidth={1.5} />
                      </div>
                      <p className="text-lg font-bold text-[#0d2145]">
                        {hasFilters
                          ? "No matching applications"
                          : "No applications yet"}
                      </p>
                      <p className="max-w-sm text-sm text-slate-500">
                        {hasFilters
                          ? "Try adjusting your filters or clear them to see all applications."
                          : "Start tracking your university applications. Add your first one to see it here and on the Kanban board."}
                      </p>
                      {!hasFilters ? (
                        <Link
                          className={cn(
                            buttonVariants({ size: "lg" }),
                            "mt-2 rounded-xl bg-[#0d2145] hover:bg-[#1a3461]",
                          )}
                          href="/dashboard/applications/new"
                        >
                          <Plus className="size-4" strokeWidth={1.8} />
                          Create your first application
                        </Link>
                      ) : (
                        <Link
                          className="mt-1 text-sm font-semibold text-[#4a52c8] hover:underline"
                          href="/dashboard/applications"
                        >
                          Clear all filters
                        </Link>
                      )}
                    </div>
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
                      className="border-b border-slate-50 transition-colors last:border-0 hover:bg-slate-50/50"
                    >
                      <td className="px-5 py-4">
                        <p className="font-semibold text-[#0d2145]">
                          {a.universityName}
                        </p>
                        <p className="text-xs text-slate-500">
                          {a.city ?? "—"}
                        </p>
                      </td>
                      <td className="px-5 py-4 text-slate-600">
                        {a.program?.name ?? a.programName ?? "—"}
                        {a.mirrorsApplication ? (
                          <span className="mt-1 block text-xs text-amber-700">
                            Linked to {a.mirrorsApplication.user.name}&apos;s
                            entry
                          </span>
                        ) : null}
                      </td>
                      <td className="px-5 py-4 text-slate-500">
                        {a.intakeSemester ?? "—"}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          {a.user.image ? (
                            <Image
                              alt=""
                              className="size-6 rounded-full object-cover"
                              height={24}
                              src={a.user.image}
                              width={24}
                            />
                          ) : (
                            <div className="flex size-6 items-center justify-center rounded-full bg-slate-100 text-[10px] font-bold text-slate-600">
                              {a.user.name?.charAt(0)?.toUpperCase() ?? "?"}
                            </div>
                          )}
                          <span className="text-sm font-medium text-slate-700">
                            {a.user.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        {a.team ? (
                          <Link
                            href={`/dashboard/teams/${a.team.id}`}
                            className="text-sm font-medium text-[#4a52c8] hover:underline"
                          >
                            {a.team.name}
                          </Link>
                        ) : (
                          <span className="text-xs text-slate-400">Solo</span>
                        )}
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
                              className="text-xs font-semibold text-[#4a52c8] underline-offset-4 hover:underline"
                              href={`/dashboard/applications/${a.id}/edit`}
                            >
                              Edit
                            </Link>
                          ) : null}
                          {canMeToo ? (
                            <Link
                              className="text-xs font-semibold text-amber-700 underline-offset-4 hover:underline"
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
