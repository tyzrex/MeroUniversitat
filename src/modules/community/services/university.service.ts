import { db } from "@/lib/db";
import { cache } from "react";

export type UniversitySearchRow = {
  id: string;
  name: string;
  city: string;
  slug: string;
};

export async function searchUniversities(options: {
  query: string;
  limit: number;
}): Promise<UniversitySearchRow[]> {
  const q = options.query.trim();
  const limit = Math.min(Math.max(options.limit, 1), 100);

  return db.university.findMany({
    where: q
      ? {
          OR: [
            { name: { contains: q, mode: "insensitive" } },
            { city: { contains: q, mode: "insensitive" } },
          ],
        }
      : undefined,
    orderBy: { name: "asc" },
    take: limit,
    select: { id: true, name: true, city: true, slug: true },
  });
}

export async function listUniversitiesDirectory(options: {
  query: string;
  limit: number;
}) {
  const q = options.query.trim();
  const limit = Math.min(Math.max(options.limit, 1), 100);

  return db.university.findMany({
    where: q
      ? {
          OR: [
            { name: { contains: q, mode: "insensitive" } },
            { city: { contains: q, mode: "insensitive" } },
          ],
        }
      : undefined,
    orderBy: [{ isPopular: "desc" }, { name: "asc" }],
    take: limit,
    select: {
      id: true,
      name: true,
      nameShort: true,
      city: true,
      state: true,
      slug: true,
      ranking: true,
      description: true,
      logoUrl: true,
      isPopular: true,
      _count: { select: { programs: true } },
    },
  });
}

export const getUniversityBySlug = cache(async (slug: string) => {
  return db.university.findUnique({
    where: { slug },
    include: {
      programs: {
        orderBy: { name: "asc" },
        take: 120,
      },
    },
  });
});
