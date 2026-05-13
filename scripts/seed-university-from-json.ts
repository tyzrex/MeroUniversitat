/**
 * Upserts university rows from scripts/universities.json into `University`.
 *
 * Usage (from repo root, DATABASE_URL set):
 *   bun run scripts/seed-university-from-json.ts
 */
import 'dotenv/config';
import universities from './universities.json';

import { db } from '../src/lib/db';

type University = {
	name: string;
	slug: string;
	city: string;
	website: string | null;
	logoUrl: string | null;
	_logoSource: string | null;
};

function slugify(name: string): string {
	return name
		.normalize('NFKD')
		.replace(/[\u0300-\u036f]/g, '')
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '')
		.slice(0, 96);
}

async function uniqueSlug(base: string): Promise<string> {
	const root = base || 'university';
	for (let i = 0; i < 5000; i++) {
		const slug = i === 0 ? root : `${root}-${i}`;
		const taken = await db.university.findUnique({
			where: { slug },
			select: { id: true }
		});
		if (!taken) return slug;
	}
	throw new Error('Could not allocate unique slug');
}

function normalize(value: string | null | undefined): string | null {
	const trimmed = value?.trim();
	return trimmed ? trimmed : null;
}

async function main() {
	const data = universities as University[];

	let inserted = 0;
	let updated = 0;

	for (const u of data) {
		const name = u.name.trim();
		const city = normalize(u.city) ?? 'Germany';
		const website = normalize(u.website);
		const logoUrl = normalize(u.logoUrl);
		const imageUrl = logoUrl;
		const slug = normalize(u.slug) ?? (await uniqueSlug(slugify(name)));

		const found = await db.university.findFirst({
			where: {
				OR: [{ slug }, { name }]
			},
			select: { id: true }
		});

		if (found) {
			await db.university.update({
				where: { id: found.id },
				data: {
					name,
					city,
					website,
					logoUrl,
					imageUrl
				}
			});
			updated++;
		} else {
			await db.university.create({
				data: {
					name,
					city,
					slug,
					website,
					logoUrl,
					imageUrl
				}
			});
			inserted++;
		}
	}

	console.log(
		`JSON rows: ${data.length}. Updated: ${updated}. Inserted: ${inserted}.`
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
