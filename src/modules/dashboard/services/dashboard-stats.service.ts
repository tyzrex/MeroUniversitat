import { db } from "@/lib/db";
import { cache } from "react";

export type DashboardStats = {
  applicationCount: number;
  teamCount: number;
  statusBreakdown: { status: string; count: number }[];
  nearestDeadline: { universityName: string; deadline: Date } | null;
  workspacePreference: string | null;
  acceptanceSubmissionCount: number;
  /** True when profile missing or core academic fields empty — prompt user to complete settings. */
  profileIncomplete: boolean;
  /** Next application deadlines (future only), sorted soonest first. */
  upcomingDeadlines: {
    universityName: string;
    deadline: Date;
    intakeSemester: string | null;
  }[];
};

function isProfileIncomplete(profile: {
  gpa: unknown;
  percentage: unknown;
  nepalUniversity: string | null;
  bachelorProgram: string | null;
} | null): boolean {
  if (!profile) return true;
  const hasGpa = profile.gpa != null;
  const hasPct = profile.percentage != null;
  const hasNepalUni = (profile.nepalUniversity?.trim() ?? "").length > 0;
  const hasDegree = (profile.bachelorProgram?.trim() ?? "").length > 0;
  return !(hasGpa || hasPct || hasNepalUni || hasDegree);
}

/** Aggregated dashboard stats for the current user (deduped per request). */
export const getDashboardStats = cache(async function getDashboardStats(
  userId: string,
): Promise<DashboardStats> {
  const teamMemberships = await db.teamMember.findMany({
    where: { userId },
    select: { teamId: true },
  });
  const teamIds = teamMemberships.map((t) => t.teamId);

  const [
    user,
    applications,
    profile,
    acceptanceSubmissionCount,
  ] = await Promise.all([
    db.user.findUnique({
      where: { id: userId },
      select: { workspacePreference: true },
    }),
    db.application.findMany({
      where: {
        OR: [
          { userId },
          ...(teamIds.length > 0 ? [{ teamId: { in: teamIds } }] : []),
        ],
      },
      select: {
        status: true,
        deadline: true,
        universityName: true,
        intakeSemester: true,
      },
      orderBy: { deadline: "asc" },
    }),
    db.profile.findUnique({
      where: { userId },
      select: {
        gpa: true,
        percentage: true,
        nepalUniversity: true,
        bachelorProgram: true,
      },
    }),
    db.acceptanceRecord.count({ where: { userId } }),
  ]);

  const statusMap = new Map<string, number>();
  for (const app of applications) {
    statusMap.set(app.status, (statusMap.get(app.status) ?? 0) + 1);
  }

  const statusBreakdown = [...statusMap.entries()]
    .map(([status, count]) => ({ status, count }))
    .sort((a, b) => b.count - a.count);

  const now = new Date();
  const upcomingDeadlinesRaw = applications.filter(
    (a) => a.deadline && a.deadline > now,
  );
  const seen = new Set<string>();
  const upcomingDeadlines: DashboardStats["upcomingDeadlines"] = [];
  for (const a of upcomingDeadlinesRaw.sort(
    (x, y) => x.deadline!.getTime() - y.deadline!.getTime(),
  )) {
    const key = `${a.universityName}-${a.deadline!.toISOString()}`;
    if (seen.has(key)) continue;
    seen.add(key);
    upcomingDeadlines.push({
      universityName: a.universityName.trim() || "University",
      deadline: a.deadline!,
      intakeSemester: a.intakeSemester,
    });
    if (upcomingDeadlines.length >= 6) break;
  }

  const upcoming = upcomingDeadlines[0];
  const nearestDeadline = upcoming
    ? { universityName: upcoming.universityName, deadline: upcoming.deadline }
    : null;

  return {
    applicationCount: applications.length,
    teamCount: teamMemberships.length,
    statusBreakdown,
    nearestDeadline,
    workspacePreference: user?.workspacePreference ?? null,
    acceptanceSubmissionCount,
    profileIncomplete: isProfileIncomplete(profile),
    upcomingDeadlines,
  };
});
