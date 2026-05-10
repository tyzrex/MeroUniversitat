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
  /** Top universities by application row count (visible to user + team pipelines). */
  topUniversities: { label: string; count: number }[];
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
  const uniMap = new Map<string, number>();
  for (const app of applications) {
    statusMap.set(app.status, (statusMap.get(app.status) ?? 0) + 1);
    const label = app.universityName.trim() || "Unknown";
    uniMap.set(label, (uniMap.get(label) ?? 0) + 1);
  }

  const statusBreakdown = [...statusMap.entries()]
    .map(([status, count]) => ({ status, count }))
    .sort((a, b) => b.count - a.count);

  const topUniversities = [...uniMap.entries()]
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);

  const now = new Date();
  const upcoming = applications.find((a) => a.deadline && a.deadline > now);
  const nearestDeadline = upcoming?.deadline
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
    topUniversities,
  };
});
