import { db } from "@/lib/db";
import type { Prisma } from "@/generated/prisma/client";

export type ApplicationListFilters = {
  teamId?: string;
  status?: string;
  search?: string;
  intake?: string;
};

export type ApplicationDashboardStatCard = {
  key: string;
  title: string;
  value: number;
  trendPct: number | null;
};

async function teamIdsForUser(userId: string): Promise<string[]> {
  const rows = await db.teamMember.findMany({
    where: { userId },
    select: { teamId: true },
  });
  return rows.map((t) => t.teamId);
}

function visibilityFilter(
  userId: string,
  teamIds: string[],
): Prisma.ApplicationWhereInput {
  return {
    OR: [{ userId }, ...(teamIds.length ? [{ teamId: { in: teamIds } }] : [])],
  };
}

function filtersToAdditionalWhere(
  filters?: ApplicationListFilters,
): Prisma.ApplicationWhereInput[] {
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

  if (filters?.intake?.trim()) {
    additionalFilters.push({ intakeSemester: filters.intake.trim() });
  }

  if (filters?.search?.trim()) {
    const q = filters.search.trim();
    additionalFilters.push({
      OR: [
        { universityName: { contains: q, mode: "insensitive" } },
        { programName: { contains: q, mode: "insensitive" } },
        { user: { name: { contains: q, mode: "insensitive" } } },
      ],
    });
  }

  return additionalFilters;
}

export async function applicationListWhere(
  userId: string,
  filters?: ApplicationListFilters,
): Promise<Prisma.ApplicationWhereInput> {
  const teamIds = await teamIdsForUser(userId);
  const visibility = visibilityFilter(userId, teamIds);
  const additionalFilters = filtersToAdditionalWhere(filters);

  return additionalFilters.length > 0
    ? { AND: [visibility, ...additionalFilters] }
    : visibility;
}

const applicationListInclude = {
  user: { select: { id: true, name: true, image: true } },
  team: { select: { id: true, name: true } },
  university: {
    select: {
      id: true,
      name: true,
      slug: true,
      city: true,
      state: true,
      logoUrl: true,
      imageUrl: true,
    },
  },
  program: { select: { id: true, name: true } },
  mirrorsApplication: {
    select: {
      id: true,
      user: { select: { name: true } },
    },
  },
} satisfies Prisma.ApplicationInclude;

export type DashboardApplicationRow = Prisma.ApplicationGetPayload<{
  include: typeof applicationListInclude;
}>;

/** Applications you own plus applications belonging to any team you're in (legacy: capped at 200). */
export async function listDashboardApplications(
  userId: string,
  filters?: ApplicationListFilters,
) {
  const where = await applicationListWhere(userId, filters);

  return db.application.findMany({
    where,
    orderBy: [{ updatedAt: "desc" }],
    take: 200,
    include: applicationListInclude,
  });
}

export async function listDashboardApplicationsPaginated(
  userId: string,
  filters: ApplicationListFilters | undefined,
  pagination: { page: number; pageSize: number },
): Promise<{ rows: DashboardApplicationRow[]; total: number; page: number }> {
  const where = await applicationListWhere(userId, filters);
  const total = await db.application.count({ where });
  const totalPages = Math.max(1, Math.ceil(total / pagination.pageSize));
  const safePage = Math.min(Math.max(1, pagination.page), totalPages);
  const skip = (safePage - 1) * pagination.pageSize;

  const rows = await db.application.findMany({
    where,
    orderBy: [{ updatedAt: "desc" }],
    skip,
    take: pagination.pageSize,
    include: applicationListInclude,
  });

  return { rows, total, page: safePage };
}

export async function listIntakeOptionsForUser(
  userId: string,
): Promise<string[]> {
  const teamIds = await teamIdsForUser(userId);
  const visibility = visibilityFilter(userId, teamIds);

  const grouped = await db.application.groupBy({
    by: ["intakeSemester"],
    where: {
      AND: [visibility, { intakeSemester: { not: null } }],
    },
  });

  const values = grouped
    .map((g) => g.intakeSemester)
    .filter((v): v is string => Boolean(v?.trim()));

  return [...new Set(values)].sort((a, b) => a.localeCompare(b));
}

async function activityTrendPct(
  base: Prisma.ApplicationWhereInput,
  bucket: Prisma.ApplicationWhereInput,
): Promise<number | null> {
  const now = Date.now();
  const msDay = 86400000;
  const curStart = new Date(now - 30 * msDay);
  const prevStart = new Date(now - 60 * msDay);

  const [curr, prev] = await Promise.all([
    db.application.count({
      where: {
        AND: [
          base,
          bucket,
          { updatedAt: { gte: curStart } },
        ],
      },
    }),
    db.application.count({
      where: {
        AND: [
          base,
          bucket,
          { updatedAt: { gte: prevStart, lt: curStart } },
        ],
      },
    }),
  ]);

  if (curr === 0 && prev === 0) return null;
  if (prev === 0) return curr === 0 ? null : 100;

  return Math.round(((curr - prev) / prev) * 100);
}

export async function getDashboardApplicationStats(
  userId: string,
): Promise<ApplicationDashboardStatCard[]> {
  const teamIds = await teamIdsForUser(userId);
  const base = visibilityFilter(userId, teamIds);

  const archivedStatuses = ["WITHDRAWN", "REJECTED"] as const;

  const [
    total,
    interested,
    offerLetters,
    archived,
    tTotal,
    tInterested,
    tOffer,
    tArchived,
  ] = await Promise.all([
    db.application.count({ where: base }),
    db.application.count({
      where: { AND: [base, { status: "INTERESTED" }] },
    }),
    db.application.count({
      where: { AND: [base, { status: "OFFER_LETTER" }] },
    }),
    db.application.count({
      where: {
        AND: [base, { status: { in: [...archivedStatuses] } }],
      },
    }),
    activityTrendPct(base, {}),
    activityTrendPct(base, { status: "INTERESTED" }),
    activityTrendPct(base, { status: "OFFER_LETTER" }),
    activityTrendPct(base, { status: { in: [...archivedStatuses] } }),
  ]);

  return [
    {
      key: "total",
      title: "Total applications",
      value: total,
      trendPct: tTotal,
    },
    {
      key: "interested",
      title: "Interested",
      value: interested,
      trendPct: tInterested,
    },
    {
      key: "offer",
      title: "Offer letters",
      value: offerLetters,
      trendPct: tOffer,
    },
    {
      key: "archived",
      title: "Archived",
      value: archived,
      trendPct: tArchived,
    },
  ];
}
