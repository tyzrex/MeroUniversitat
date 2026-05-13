import { db } from '@/lib/db';
import {
	EMBASSY_PIPELINE_MILESTONES,
	type VisaJourneyMilestoneValue,
	VISA_JOURNEY_MILESTONES,
	VISA_MILESTONE_LABELS
} from '@/modules/visa/lib/milestone-order';

export type CheckpointDto = {
	milestone: VisaJourneyMilestoneValue;
	occurredAt: string;
	notes: string | null;
	expectedEta: string | null;
};

export async function listVisaCheckpointsForUser(
	userId: string
): Promise<CheckpointDto[]> {
	const rows = await db.visaJourneyCheckpoint.findMany({
		where: { userId },
		orderBy: { occurredAt: 'asc' }
	});
	return rows.map((r) => ({
		milestone: r.milestone as VisaJourneyMilestoneValue,
		occurredAt: r.occurredAt.toISOString(),
		notes: r.notes,
		expectedEta: r.expectedEta?.toISOString() ?? null
	}));
}

export type CommunityWaitlistRow = {
	anonLabel: string;
	intake: string | null;
	stages: Partial<
		Record<(typeof EMBASSY_PIPELINE_MILESTONES)[number], string | undefined>
	>;
	furthest: VisaJourneyMilestoneValue | null;
};

export async function listCommunityWaitlistRows(
	limit = 16
): Promise<CommunityWaitlistRow[]> {
	const users = await db.user.findMany({
		where: {
			profile: { embassyTimelinePublic: true },
			visaJourneyCheckpoints: { some: {} }
		},
		select: {
			id: true,
			visaJourneyCheckpoints: {
				select: {
					milestone: true,
					occurredAt: true
				}
			},
			profile: { select: { targetIntake: true } }
		},
		orderBy: { updatedAt: 'desc' },
		take: limit
	});

	return users.map((u, idx) => {
		const anonLabel = `Anonymous ${idx + 1}`;
		const stages: CommunityWaitlistRow['stages'] = {};
		let furthest: VisaJourneyMilestoneValue | null = null;
		let furthestOrder = -1;

		for (const m of EMBASSY_PIPELINE_MILESTONES) {
			const hit = u.visaJourneyCheckpoints.find((c) => c.milestone === m);
			if (hit) {
				stages[m] = hit.occurredAt.toISOString().slice(0, 10);
				const ord = EMBASSY_PIPELINE_MILESTONES.indexOf(m);
				if (ord > furthestOrder) {
					furthestOrder = ord;
					furthest = m;
				}
			}
		}

		return {
			anonLabel,
			intake: u.profile?.targetIntake ?? null,
			stages,
			furthest
		};
	});
}

export async function countCspSubmissionsByMonth(): Promise<
	Record<string, number>
> {
	const rows = await db.visaJourneyCheckpoint.findMany({
		where: {
			milestone: 'CSP_SUBMITTED',
			user: {
				profile: { embassyTimelinePublic: true }
			}
		},
		select: { occurredAt: true }
	});

	const bucket: Record<string, number> = {};
	for (const r of rows) {
		const key = `${r.occurredAt.getUTCFullYear()}-${String(r.occurredAt.getUTCMonth() + 1).padStart(2, '0')}`;
		bucket[key] = (bucket[key] ?? 0) + 1;
	}
	return bucket;
}

export async function consularCommunityStats(): Promise<{
	contributorCount: number;
	checkpointCount: number;
}> {
	const [contributorCount, checkpointCount] = await Promise.all([
		db.user.count({
			where: {
				profile: { embassyTimelinePublic: true },
				visaJourneyCheckpoints: { some: {} }
			}
		}),
		db.visaJourneyCheckpoint.count({
			where: {
				user: { profile: { embassyTimelinePublic: true } }
			}
		})
	]);
	return { contributorCount, checkpointCount };
}

export function buildJourneyState(checkpoints: CheckpointDto[]): {
	milestone: VisaJourneyMilestoneValue;
	label: string;
	done: boolean;
	dateIso: string | null;
	expectedEta: string | null;
	notes: string | null;
}[] {
	const byMilestone = new Map(
		checkpoints.map((c) => [c.milestone, c] as const)
	);
	return VISA_JOURNEY_MILESTONES.map((milestone) => {
		const c = byMilestone.get(milestone);
		return {
			milestone,
			label: VISA_MILESTONE_LABELS[milestone],
			done: Boolean(c),
			dateIso: c ? c.occurredAt : null,
			expectedEta: c?.expectedEta ?? null,
			notes: c?.notes ?? null
		};
	});
}
