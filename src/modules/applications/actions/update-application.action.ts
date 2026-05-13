'use server';

import { applicationUpdateSchema } from '@/modules/applications/schema/application-form-schema';
import { updateApplicationForUser } from '@/modules/applications/services/application-mutations.service';
import { auth } from '@/lib/auth';
import type { ActionResult } from '@/modules/shared/types/action-result';
import type { FieldErrors } from 'react-hook-form';
import { headers } from 'next/headers';

export async function updateApplicationAction(
	raw: unknown
): Promise<ActionResult<{ id: string }>> {
	const session = await auth.api.getSession({
		headers: await headers()
	});
	if (!session?.user?.id) {
		return { ok: false, error: 'Sign in to save changes.' };
	}

	const parsed = applicationUpdateSchema.safeParse(raw);
	if (!parsed.success) {
		return {
			ok: false,
			error: 'Please fix the highlighted fields.',
			fieldErrors: parsed.error.flatten().fieldErrors as unknown as FieldErrors
		};
	}

	try {
		const app = await updateApplicationForUser(session.user.id, parsed.data);
		return { ok: true, data: { id: app.id } };
	} catch (e) {
		const msg =
			e instanceof Error ? e.message : 'Could not update the application.';
		return { ok: false, error: msg };
	}
}
