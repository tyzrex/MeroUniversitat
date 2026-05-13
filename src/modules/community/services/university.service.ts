import { db } from '@/lib/db';
import type { Prisma } from '@/generated/prisma/client';
import { cache } from 'react';

export type UniversitySearchRow = {
	id: string;
	name: string;
	city: string;
	slug: string;
	logoUrl: string | null;
	imageUrl: string | null;
	verificationStatus: 'APPROVED' | 'PENDING' | 'REJECTED';
};

export async function searchUniversities(options: {
	query: string;
	limit: number;
}): Promise<UniversitySearchRow[]> {
	const q = options.query.trim();
	const limit = Math.min(Math.max(options.limit, 1), 100);

	const where: Prisma.UniversityWhereInput = {
		verificationStatus: { not: 'REJECTED' },
		...(q
			? {
					OR: [
						{ name: { contains: q, mode: 'insensitive' } },
						{ city: { contains: q, mode: 'insensitive' } }
					]
				}
			: {})
	};

	return db.university.findMany({
		where,
		orderBy: { name: 'asc' },
		take: limit,
		select: {
			id: true,
			name: true,
			city: true,
			slug: true,
			logoUrl: true,
			imageUrl: true,
			verificationStatus: true
		}
	});
}

export async function listUniversitiesDirectory(options: {
	query: string;
	page: number;
	pageSize: number;
}) {
	const q = options.query.trim();
	const pageSize = Math.min(Math.max(options.pageSize, 1), 100);
	const page = Math.max(options.page, 1);

	const where: Prisma.UniversityWhereInput = {
		verificationStatus: { not: 'REJECTED' },
		...(q
			? {
					OR: [
						{ name: { contains: q, mode: 'insensitive' } },
						{ city: { contains: q, mode: 'insensitive' } }
					]
				}
			: {})
	};

	const total = await db.university.count({ where });
	const totalPages = Math.max(1, Math.ceil(total / pageSize));
	const safePage = Math.min(page, totalPages);
	const take = pageSize * safePage;

	const rows = await db.university.findMany({
		where,
		orderBy: [
			{ verificationStatus: 'asc' },
			{ isPopular: 'desc' },
			{ name: 'asc' }
		],
		take,
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
			imageUrl: true,
			isPopular: true,
			verificationStatus: true,
			_count: { select: { programs: true, applications: true } }
		}
	});

	return {
		rows,
		total,
		page: safePage,
		pageSize,
		totalPages
	};
}

export const getUniversityBySlug = cache(async (slug: string) => {
	return db.university.findFirst({
		where: { slug, verificationStatus: { not: 'REJECTED' } },
		include: {
			programs: {
				orderBy: { name: 'asc' },
				take: 120
			}
		}
	});
});
