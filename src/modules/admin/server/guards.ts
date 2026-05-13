import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

export async function requireAuthSession() {
	const session = await auth.api.getSession({
		headers: await headers()
	});
	if (!session?.user?.id) {
		redirect('/sign-in');
	}
	return session;
}

/** Moderators and admins may review community submissions. */
export async function requireModeratorSession() {
	const session = await requireAuthSession();
	const user = await db.user.findUnique({
		where: { id: session.user.id },
		select: { role: true }
	});
	if (user?.role !== 'MODERATOR' && user?.role !== 'ADMIN') {
		redirect('/dashboard');
	}
	return session;
}

/** Site-wide toggles (manual review, etc.). */
export async function requireAdminSession() {
	const session = await requireAuthSession();
	const user = await db.user.findUnique({
		where: { id: session.user.id },
		select: { role: true }
	});
	if (user?.role !== 'ADMIN') {
		redirect('/dashboard');
	}
	return session;
}
