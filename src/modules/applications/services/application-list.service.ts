import { db } from "@/lib/db";
import type { Prisma } from "@/generated/prisma";

export type ApplicationListFilters = {
  teamId?: string; // specific team id, or "solo" for null teamId
  status?: string;
  search?: string; // university name search
};

/** Applications you own plus applications belonging to any team you're in. */
export async function listDashboardApplications(
  userId: string,
  filters?: ApplicationListFilters,
) {
  const teamIds = await db.teamMember.findMany({
    where: { userId },
    select: { teamId: true },
  });
  const ids = teamIds.map((t) => t.teamId);

  // Base visibility: own rows + team rows
  const visibilityFilter: Prisma.ApplicationWhereInput = {
    OR: [{ userId }, ...(ids.length ? [{ teamId: { in: ids } }] : [])],
  };

  // Additional filters
  const additionalFilters: Prisma.ApplicationWhereInput[] = [];

  if (filters?.teamId) {
    if (filters.teamId === "solo") {
      additionalFilters.push({ teamId: null });
    } else {
      additionalFilters.push({ teamId: filters.teamId });
    }
  }

  if (filters?.status) {
    additionalFilters.push({ status: filters.status as never });
  }

  if (filters?.search?.trim()) {
    additionalFilters.push({
      universityName: {
        contains: filters.search.trim(),
        mode: "insensitive",
      },
    });
  }

  const where: Prisma.ApplicationWhereInput =
    additionalFilters.length > 0
      ? { AND: [visibilityFilter, ...additionalFilters] }
      : visibilityFilter;

  return db.application.findMany({
    where,
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
