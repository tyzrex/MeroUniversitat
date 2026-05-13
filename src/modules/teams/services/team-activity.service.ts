import { db } from '@/lib/db';
import { cache } from 'react';

type ActivityData = {
	applicationId?: string;
	universityName?: string;
	programLabel?: string;
};

type TeamActivityRow = {
	type: string;
	createdAt: Date;
	data: unknown;
	team: { id: string; name: string };
	actor: { name: string; image: string | null } | null;
};

function readActivityData(data: unknown): ActivityData {
	if (!data || typeof data !== 'object') return {};
	const d = data as Record<string, unknown>;
	return {
		applicationId:
			typeof d.applicationId === 'string' ? d.applicationId : undefined,
		universityName:
			typeof d.universityName === 'string' ? d.universityName : undefined,
		programLabel:
			typeof d.programLabel === 'string' ? d.programLabel : undefined
	};
}

export type TeamActivityItem =
	| {
			type: 'member_joined';
			at: Date;
			teamId: string;
			teamName: string;
			actorName: string;
			actorImage: string | null;
	  }
	| {
			type: 'application_created' | 'application_updated';
			at: Date;
			teamId: string;
			teamName: string;
			actorName: string;
			actorImage: string | null;
			universityName: string;
			programLabel: string;
			applicationId: string;
	  };

function mapRowsToActivity(rows: TeamActivityRow[]): TeamActivityItem[] {
	return rows.flatMap<TeamActivityItem>((r) => {
		const actorName = r.actor?.name ?? 'Someone';
		const actorImage = r.actor?.image ?? null;
		const teamIdOut = r.team.id;
		const teamNameOut = r.team.name;

		if (r.type === 'MEMBER_JOINED') {
			return [
				{
					type: 'member_joined',
					at: r.createdAt,
					teamId: teamIdOut,
					teamName: teamNameOut,
					actorName,
					actorImage
				}
			];
		}

		if (r.type === 'APPLICATION_CREATED' || r.type === 'APPLICATION_UPDATED') {
			const data = readActivityData(r.data);
			return [
				{
					type:
						r.type === 'APPLICATION_CREATED'
							? 'application_created'
							: 'application_updated',
					at: r.createdAt,
					teamId: teamIdOut,
					teamName: teamNameOut,
					actorName,
					actorImage,
					universityName: data.universityName ?? 'University',
					programLabel: data.programLabel ?? 'Program TBD',
					applicationId: data.applicationId ?? ''
				}
			];
		}

		return [];
	});
}

export const listTeamActivityForUser = cache(
	async function listTeamActivityForUser(userId: string, take = 12) {
		const memberships = await db.teamMember.findMany({
			where: { userId },
			select: { teamId: true }
		});
		const teamIds = memberships.map((m) => m.teamId);
		if (teamIds.length === 0) return [] satisfies TeamActivityItem[];

		const rows = await db.teamActivity.findMany({
			where: { teamId: { in: teamIds } },
			orderBy: { createdAt: 'desc' },
			take,
			include: {
				team: { select: { id: true, name: true } },
				actor: { select: { name: true, image: true } }
			}
		});

		return mapRowsToActivity(rows as TeamActivityRow[]);
	}
);

export const listTeamActivityForTeam = cache(
	async function listTeamActivityForTeam(teamId: string, take = 12) {
		const rows = await db.teamActivity.findMany({
			where: { teamId },
			orderBy: { createdAt: 'desc' },
			take,
			include: {
				team: { select: { id: true, name: true } },
				actor: { select: { name: true, image: true } }
			}
		});

		return mapRowsToActivity(rows as TeamActivityRow[]);
	}
);
