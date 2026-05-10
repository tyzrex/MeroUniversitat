import { db } from "@/lib/db";

export type DashboardStats = {
  applicationCount: number;
  teamCount: number;
  statusBreakdown: { status: string; count: number }[];
  nearestDeadline: { universityName: string; deadline: Date } | null;
  workspacePreference: string | null;
};

/** Aggregated dashboard stats for the current user. */
export async function getDashboardStats(
  userId: string,
): Promise<DashboardStats> {
  // Fetch workspace preference, applications, teams, and nearest deadline in parallel
  const [user, teamMemberships, applications] = await Promise.all([
    db.user.findUnique({
      where: { id: userId },
      select: { workspacePreference: true },
    }),
    db.teamMember.findMany({
      where: { userId },
      select: { teamId: true },
    }),
    db.application.findMany({
      where: {
        OR: [
          { userId },
          {
            teamId: {
              in: (
                await db.teamMember.findMany({
                  where: { userId },
                  select: { teamId: true },
                })
              ).map((t) => t.teamId),
            },
          },
        ],
      },
      select: {
        status: true,
        deadline: true,
        universityName: true,
      },
      orderBy: { deadline: "asc" },
    }),
  ]);

  // Status breakdown
  const statusMap = new Map<string, number>();
  for (const app of applications) {
    statusMap.set(app.status, (statusMap.get(app.status) ?? 0) + 1);
  }
  const statusBreakdown = [...statusMap.entries()]
    .map(([status, count]) => ({ status, count }))
    .sort((a, b) => b.count - a.count);

  // Nearest future deadline
  const now = new Date();
  const upcoming = applications.find(
    (a) => a.deadline && a.deadline > now,
  );
  const nearestDeadline = upcoming?.deadline
    ? { universityName: upcoming.universityName, deadline: upcoming.deadline }
    : null;

  return {
    applicationCount: applications.length,
    teamCount: teamMemberships.length,
    statusBreakdown,
    nearestDeadline,
    workspacePreference: user?.workspacePreference ?? null,
  };
}
