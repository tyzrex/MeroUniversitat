import { db } from "@/lib/db";

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
