import { db } from '@/lib/db';
import { cache } from 'react';

export type UniversityApplicationStats = {
	totalTrackedApplications: number;
	distinctApplicants: number;
	myApplicationCount: number;
	/** Published community outcomes for this institution. */
	communityPublishedOutcomes: number;
};

/** Aggregate application counts for a directory university (platform-wide + optional viewer). */
export const getUniversityApplicationStats = cache(
	async function getUniversityApplicationStats(
		universityId: string,
		viewerUserId?: string | null
	): Promise<UniversityApplicationStats> {
		const [total, grouped, mine, communityPublishedOutcomes] =
			await Promise.all([
				db.application.count({ where: { universityId } }),
				db.application.groupBy({
					by: ['userId'],
					where: { universityId }
				}),
				viewerUserId
					? db.application.count({
							where: { universityId, userId: viewerUserId }
						})
					: Promise.resolve(0),
				db.acceptanceRecord.count({
					where: {
						universityId,
						moderationStatus: 'APPROVED'
					}
				})
			]);

		return {
			totalTrackedApplications: total,
			distinctApplicants: grouped.length,
			myApplicationCount: mine,
			communityPublishedOutcomes
		};
	}
);
