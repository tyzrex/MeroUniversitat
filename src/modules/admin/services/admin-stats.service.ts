import { db } from '@/lib/db';
import { cache } from 'react';

export type AdminOverviewStats = {
	userCount: number;
	pendingAcceptanceCount: number;
	approvedAcceptanceCount: number;
	applicationCount: number;
	suspendedUserCount: number;
	pendingFeedbackCount: number;
	totalFeedbackCount: number;
};

export const getAdminOverviewStats = cache(
	async function getAdminOverviewStats(): Promise<AdminOverviewStats> {
		const [
			userCount,
			pendingAcceptanceCount,
			approvedAcceptanceCount,
			applicationCount,
			suspendedUserCount,
			pendingFeedbackCount,
			totalFeedbackCount
		] = await Promise.all([
			db.user.count(),
			db.acceptanceRecord.count({
				where: { moderationStatus: 'PENDING' }
			}),
			db.acceptanceRecord.count({
				where: { moderationStatus: 'APPROVED' }
			}),
			db.application.count(),
			db.user.count({ where: { suspendedAt: { not: null } } }),
			db.feedback.count({ where: { status: 'PENDING' } }),
			db.feedback.count()
		]);

		return {
			userCount,
			pendingAcceptanceCount,
			approvedAcceptanceCount,
			applicationCount,
			suspendedUserCount,
			pendingFeedbackCount,
			totalFeedbackCount
		};
	}
);

export type AdminUserRow = {
	id: string;
	name: string;
	email: string;
	role: string;
	createdAt: Date;
	suspendedAt: Date | null;
	applicationCount: number;
};

export const listAdminUsers = cache(async function listAdminUsers(
	limit = 80
): Promise<AdminUserRow[]> {
	const users = await db.user.findMany({
		orderBy: { createdAt: 'desc' },
		take: Math.min(limit, 200),
		select: {
			id: true,
			name: true,
			email: true,
			role: true,
			createdAt: true,
			suspendedAt: true,
			_count: { select: { applications: true } }
		}
	});

	return users.map((u) => ({
		id: u.id,
		name: u.name,
		email: u.email,
		role: u.role,
		createdAt: u.createdAt,
		suspendedAt: u.suspendedAt,
		applicationCount: u._count.applications
	}));
});
