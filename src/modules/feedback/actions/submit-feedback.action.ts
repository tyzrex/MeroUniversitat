'use server';

import { feedbackFormSchema } from '@/modules/feedback/schema/feedback-form-schema';
import { createFeedback } from '@/modules/feedback/services/feedback.service';
import { getOptionalSession } from '@/modules/shared/server/session';
import type { ActionResult } from '@/modules/shared/types/action-result';
import type { FieldErrors } from 'react-hook-form';

export async function submitFeedbackAction(
	raw: unknown
): Promise<ActionResult<{ id: string }>> {
	const parsed = feedbackFormSchema.safeParse(raw);
	if (!parsed.success) {
		return {
			ok: false,
			error: 'Please fix the highlighted fields.',
			fieldErrors: parsed.error.flatten().fieldErrors as unknown as FieldErrors
		};
	}

	const session = await getOptionalSession();

	try {
		const record = await createFeedback({
			userId: session?.user?.id ?? null,
			type: parsed.data.type,
			title: parsed.data.title,
			description: parsed.data.description,
			category: parsed.data.category ?? null,
			isAnonymous: parsed.data.isAnonymous
		});
		return {
			ok: true,
			data: { id: record.id }
		};
	} catch {
		return {
			ok: false,
			error: 'Could not save your submission. Try again later.'
		};
	}
}
