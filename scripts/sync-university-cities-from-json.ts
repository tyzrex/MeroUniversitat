/**
 * Updates `University.city` from `scripts/universities.json` matched by `slug`.
 *
 * Usage (repo root, DATABASE_URL set):
 *   bun run scripts/sync-university-cities-from-json.ts
 */
import 'dotenv/config';

import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { db } from '../src/lib/db';

type UniJson = { slug: string; city: string };

const __dirname = dirname(fileURLToPath(import.meta.url));

async function main() {
	const raw = readFileSync(join(__dirname, 'universities.json'), 'utf-8');
	const entries = JSON.parse(raw) as UniJson[];

	let updated = 0;
	let skipped = 0;

	for (const u of entries) {
		if (!u.slug?.trim() || !u.city?.trim()) {
			skipped++;
			continue;
		}
		const res = await db.university.updateMany({
			where: { slug: u.slug.trim() },
			data: { city: u.city.trim() }
		});
		if (res.count > 0) updated += res.count;
		else skipped++;
	}

	console.log(
		`Processed ${entries.length} JSON rows. Updated ${updated} DB rows (matched by slug). Unmatched or empty: ${skipped}.`
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
