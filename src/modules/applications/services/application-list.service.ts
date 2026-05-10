import { db } from "@/lib/db";

/** Applications you own plus applications belonging to any team you’re in. */
export async function listDashboardApplications(userId: string) {
  const teamIds = await db.teamMember.findMany({
    where: { userId },
    select: { teamId: true },
  });
  const ids = teamIds.map((t) => t.teamId);

  return db.application.findMany({
    where: {
      OR: [{ userId }, ...(ids.length ? [{ teamId: { in: ids } }] : [])],
    },
    orderBy: [{ updatedAt: "desc" }],
    take: 200,
    include: {
      user: { select: { id: true, name: true, image: true } },
      team: { select: { id: true, name: true } },
      university: { select: { id: true, name: true, slug: true, city: true } },
      program: { select: { id: true, name: true } },
      mirrorsApplication: {
        select: {
          id: true,
          user: { select: { name: true } },
        },
      },
    },
  });
}
