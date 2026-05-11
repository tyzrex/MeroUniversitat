import { ApplicationRowActions } from "@/modules/applications/components/application-row-actions";
import { ApplicationStatusPill } from "@/modules/applications/components/application-status-pill";
import { ApplicationsFilterBar } from "@/modules/applications/components/applications-filter-bar";
import { ApplicationsMeTooBanner } from "@/modules/applications/components/applications-me-too-banner";
import { ApplicationsPagination } from "@/modules/applications/components/applications-pagination";
import { UniversityLogo } from "@/modules/community/components/university-logo";
import {
  listDashboardApplicationsPaginated,
  listIntakeOptionsForUser,
} from "@/modules/applications/services/application-list.service";
import { dashboardPrimaryActionClass } from "@/modules/dashboard/lib/dashboard-header-actions";
import { listTeamOptionsForUser } from "@/modules/teams/services/team.service";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { FileText, Plus } from "lucide-react";
import { Suspense } from "react";

const PAGE_SIZE = 10;

export type ApplicationsSearchParams = {
  team?: string;
  status?: string;
  q?: string;
  intake?: string;
  page?: string;
};

/** Table, filters, pagination, footer banner — heavy queries (Suspense on parent). */
export async function ApplicationsMainView({
  userId,
  searchParams,
}: Readonly<{ userId: string; searchParams: ApplicationsSearchParams }>) {
  const filters = {
    teamId: searchParams.team || undefined,
    status: searchParams.status || undefined,
    search: searchParams.q || undefined,
    intake: searchParams.intake || undefined,
  };

  const requestedPage = Number.parseInt(searchParams.page ?? "1", 10);
  const pageNum =
    Number.isFinite(requestedPage) && requestedPage > 0 ? requestedPage : 1;

  const [paginated, myTeams, intakeOptions] = await Promise.all([
    listDashboardApplicationsPaginated(userId, filters, {
      page: pageNum,
      pageSize: PAGE_SIZE,
    }),
    listTeamOptionsForUser(userId),
    listIntakeOptionsForUser(userId),
  ]);

  const { rows: apps, total, page } = paginated;

  const myTeamIds = new Set(myTeams.map((t) => t.id));

  const hasFilters = Boolean(
    searchParams.team ||
      searchParams.status ||
      searchParams.q ||
      searchParams.intake,
  );

  return (
    <div className="flex min-w-0 flex-col gap-6">
      <ApplicationsFilterBar
        teamOptions={myTeams}
        intakeOptions={intakeOptions}
      />

      <div className="min-w-0 max-w-full overflow-hidden rounded-3xl border border-border/80 bg-card ring-1 ring-border/40">
        <div className="overflow-x-auto overscroll-x-contain">
          <table className="w-full min-w-[1020px] text-left text-sm">
            <thead className="border-b border-border/60 bg-muted/40">
              <tr>
                <th className="px-5 py-3 font-semibold text-foreground">
                  University
                </th>
                <th className="px-5 py-3 font-semibold text-foreground">
                  Program / subject
                </th>
                <th className="px-5 py-3 font-semibold text-foreground">
                  Intake
                </th>
                <th className="px-5 py-3 font-semibold text-foreground">
                  Owner
                </th>
                <th className="px-5 py-3 font-semibold text-foreground">
                  Team
                </th>
                <th className="px-5 py-3 font-semibold text-foreground">
                  Status
                </th>
                <th className="px-5 py-3 font-semibold text-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {apps.length === 0 ? (
                <tr>
                  <td className="px-5 py-16 text-center" colSpan={7}>
                    <div className="flex flex-col items-center gap-3">
                      <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                        <FileText className="size-7" strokeWidth={1.5} />
                      </div>
                      <p className="text-lg font-bold text-foreground">
                        {hasFilters
                          ? "No matching applications"
                          : "No applications yet"}
                      </p>
                      <p className="max-w-sm text-sm text-muted-foreground">
                        {hasFilters
                          ? "Try adjusting your filters or clear them to see all applications."
                          : "Start tracking your university applications. Add your first one to see it here and on the Kanban board."}
                      </p>
                      {!hasFilters ? (
                        <Link
                          className={cn(dashboardPrimaryActionClass(), "mt-2")}
                          href="/dashboard/applications/new"
                        >
                          <Plus className="size-4" strokeWidth={1.8} />
                          Create your first application
                        </Link>
                      ) : (
                        <Link
                          className="mt-1 text-sm font-semibold text-primary hover:underline"
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
                  const isOwner = a.userId === userId;
                  const canMeToo =
                    !isOwner &&
                    Boolean(a.teamId) &&
                    myTeamIds.has(a.teamId as string);

                  const uniName = a.university?.name ?? a.universityName;

                  const cityLine =
                    [a.university?.city ?? a.city, a.university?.state]
                      .filter(Boolean)
                      .join(", ") || "—";

                  return (
                    <tr
                      key={a.id}
                      className="border-b border-border/40 transition-colors last:border-0 hover:bg-muted/40"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <UniversityLogo
                            name={uniName}
                            logoUrl={a.university?.logoUrl}
                            imageUrl={a.university?.imageUrl}
                            size="sm"
                            className="shadow-md shadow-black/5"
                          />
                          <div className="min-w-0">
                            <p className="font-semibold text-foreground">
                              {uniName}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {cityLine}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-muted-foreground">
                        {a.program?.name ?? a.programName ?? "—"}
                        {a.mirrorsApplication ? (
                          <span className="mt-1 block text-xs text-amber-700 dark:text-amber-300">
                            Linked to {a.mirrorsApplication.user.name}&apos;s
                            entry
                          </span>
                        ) : null}
                      </td>
                      <td className="px-5 py-4 text-muted-foreground">
                        {a.intakeSemester ?? "—"}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2.5">
                          {a.user.image ? (
                            <Image
                              alt=""
                              className="size-8 rounded-full object-cover ring-2 ring-background"
                              height={32}
                              src={a.user.image}
                              width={32}
                            />
                          ) : (
                            <div className="flex size-8 items-center justify-center rounded-full bg-muted text-xs font-bold text-foreground ring-2 ring-background">
                              {a.user.name?.charAt(0)?.toUpperCase() ?? "?"}
                            </div>
                          )}
                          <span className="text-sm font-medium text-foreground">
                            {a.user.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        {a.team ? (
                          <Link
                            href={`/dashboard/teams/${a.team.id}`}
                            className="text-sm font-semibold text-primary hover:underline"
                          >
                            {a.team.name}
                          </Link>
                        ) : (
                          <span className="text-xs font-medium text-muted-foreground">
                            Solo
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        <ApplicationStatusPill status={a.status} />
                      </td>
                      <td className="px-5 py-4">
                        <ApplicationRowActions
                          applicationId={a.id}
                          isOwner={isOwner}
                          canMeToo={canMeToo}
                          mirrorHref={`/dashboard/applications/new?mirror=${a.id}`}
                        />
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {total > 0 ? (
          <Suspense fallback={null}>
            <ApplicationsPagination
              total={total}
              page={page}
              pageSize={PAGE_SIZE}
            />
          </Suspense>
        ) : null}
      </div>

      <ApplicationsMeTooBanner />
    </div>
  );
}
