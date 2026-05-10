/**
 * Fetches the public Hipo "world universities" dataset, filters Germany,
 * and upserts into `University` (match by name when possible).
 *
 * Usage (from repo root, DATABASE_URL set):
 *   bun run scripts/seed-universities.ts
 */
import "dotenv/config";

import { db } from "../src/lib/db";

type RawUni = {
  name: string;
  web_pages: string[];
  country: string;
  "state-province": string | null;
};

function slugify(name: string): string {
  return name
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 96);
}

async function uniqueSlug(base: string): Promise<string> {
  const root = base || "university";
  for (let i = 0; i < 5000; i++) {
    const slug = i === 0 ? root : `${root}-${i}`;
    const taken = await db.university.findUnique({
      where: { slug },
      select: { id: true },
    });
    if (!taken) return slug;
  }
  throw new Error("Could not allocate unique slug");
}

async function main() {
  const res = await fetch(
    "https://raw.githubusercontent.com/Hipo/university-domains-list/master/world_universities_and_domains.json",
  );
  if (!res.ok) {
    throw new Error(`Download failed: HTTP ${res.status}`);
  }
  const data = (await res.json()) as RawUni[];
  const germany = data.filter((u) => u.country === "Germany");

  let inserted = 0;
  let updated = 0;

  for (const u of germany) {
    const city = u["state-province"]?.trim() || "Germany";
    const website = u.web_pages?.[0] ?? null;

    const found = await db.university.findFirst({
      where: { name: u.name },
      select: { id: true },
    });

    if (found) {
      await db.university.update({
        where: { id: found.id },
        data: { city, website },
      });
      updated++;
      continue;
    }

    const base = slugify(u.name);
    const slug = await uniqueSlug(base || "uni");

    await db.university.create({
      data: {
        name: u.name,
        city,
        slug,
        website,
      },
    });
    inserted++;
  }

  console.log(
    `Germany rows: ${germany.length}. Updated by name: ${updated}. Inserted: ${inserted}.`,
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await db.$disconnect();
  });
