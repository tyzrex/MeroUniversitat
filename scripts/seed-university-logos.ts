/**
 * Upserts logo + image URLs from scripts/universities.json into `University` by slug.
 *
 * Usage (repo root, DATABASE_URL set):
 *   bun run scripts/seed-university-logos.ts
 */
import "dotenv/config";

import { readFile } from "node:fs/promises";
import { join } from "node:path";

import { db } from "../src/lib/db";

type UniJson = {
  slug: string;
  logoUrl: string | null;
};

async function main() {
  const raw = await readFile(
    join(process.cwd(), "scripts", "universities.json"),
    "utf-8",
  );
  const rows = JSON.parse(raw) as UniJson[];

  let updated = 0;
  let skipped = 0;

  for (const row of rows) {
    if (!row.slug || !row.logoUrl?.trim()) {
      skipped++;
      continue;
    }

    const url = row.logoUrl.trim();
    const res = await db.university.updateMany({
      where: { slug: row.slug },
      data: {
        logoUrl: url,
        /** Same asset as logo until a separate campus/hero image is scraped. */
        imageUrl: url,
      },
    });

    if (res.count > 0) updated += res.count;
    else skipped++;
  }

  console.log(
    `Logo URLs applied: ${updated} row(s). Skipped (no slug/logo or unknown slug): ${skipped}.`,
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
