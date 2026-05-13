'use server';

import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import type { ActionResult } from '@/modules/shared/types/action-result';
import { headers } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const schema = z.object({
	preference: z.enum(['SOLO', 'TEAM'])
});

/** First dashboard visit — pick solo vs team (join/create team later). */
export async function completeWorkspaceOnboardingAction(
	raw: unknown
): Promise<ActionResult<void>> {
	const session = await auth.api.getSession({
		headers: await headers()
	});
	if (!session?.user?.id) {
		return { ok: false, error: 'Sign in to continue.' };
	}

	const parsed = schema.safeParse(raw);
	if (!parsed.success) {
		return { ok: false, error: 'Invalid choice.' };
	}

	await db.user.update({
		where: { id: session.user.id },
		data: {
			workspacePreference: parsed.data.preference,
			onboardingCompletedAt: new Date()
		}
	});

	revalidatePath('/dashboard');
	revalidatePath('/dashboard/onboarding');

	return { ok: true, data: undefined };
}
