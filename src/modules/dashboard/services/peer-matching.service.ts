import { db } from '@/lib/db';
import { cache } from 'react';

const GPA_BAND = 0.25;

export type SimilarPeerRow = {
	userId: string;
	displayName: string;
	gpa: number;
	universities: string[];
};

export type SimilarPeersResult = {
	enabled: boolean;
	/** User has opted in and can see peers if any exist. */
	optedIn: boolean;
	hasGpa: boolean;
	peers: SimilarPeerRow[];
};

/**
 * Opt-in peers with GPA within ±GPA_BAND of the viewer (excluding self).
 * Universities are distinct application labels from each peer’s pipeline.
 */
export const getSimilarPeersForUser = cache(
	async function getSimilarPeersForUser(
		userId: string
	): Promise<SimilarPeersResult> {
		const profile = await db.profile.findUnique({
			where: { userId },
			select: { peerMatchingOptIn: true, gpa: true }
		});

		const optedIn = profile?.peerMatchingOptIn ?? false;
		const myGpa = profile?.gpa != null ? Number(profile.gpa) : null;
		const hasGpa = myGpa != null && !Number.isNaN(myGpa);

		if (!optedIn || !hasGpa) {
			return {
				enabled: false,
				optedIn,
				hasGpa,
				peers: []
			};
		}

		const candidates = await db.profile.findMany({
			where: {
				peerMatchingOptIn: true,
				userId: { not: userId },
				gpa: { not: null }
			},
			select: {
				userId: true,
				gpa: true,
				user: { select: { name: true } }
			},
			take: 80
		});

		const close = candidates.filter((p) => {
			const g = Number(p.gpa);
			return !Number.isNaN(g) && Math.abs(g - myGpa!) <= GPA_BAND;
		});

		const peerIds = close.slice(0, 12).map((p) => p.userId);
		if (peerIds.length === 0) {
			return { enabled: true, optedIn, hasGpa, peers: [] };
		}

		const apps = await db.application.findMany({
			where: { userId: { in: peerIds } },
			select: { userId: true, universityName: true }
		});

		const uniByUser = new Map<string, Set<string>>();
		for (const a of apps) {
			const label = a.universityName.trim();
			if (!label) continue;
			if (!uniByUser.has(a.userId)) uniByUser.set(a.userId, new Set());
			uniByUser.get(a.userId)!.add(label);
		}

		const peers: SimilarPeerRow[] = close.slice(0, 10).map((p) => ({
			userId: p.userId,
			displayName: p.user.name,
			gpa: Math.round(Number(p.gpa) * 100) / 100,
			universities: [...(uniByUser.get(p.userId) ?? [])].slice(0, 8)
		}));

		return { enabled: true, optedIn, hasGpa, peers };
	}
);
