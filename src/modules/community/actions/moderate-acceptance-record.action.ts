'use server';

import { setAcceptanceRecordModeration } from '@/modules/community/services/acceptance-record.service';
import { requireModeratorSession } from '@/modules/admin/server/guards';
import type { ActionResult } from '@/modules/shared/types/action-result';
import { z } from 'zod';

const moderateSchema = z.object({
	id: z.string().min(1),
	decision: z.enum(['APPROVED', 'REJECTED'])
});

export async function moderateAcceptanceRecordAction(
	raw: unknown
): Promise<ActionResult<void>> {
	await requireModeratorSession();

	const parsed = moderateSchema.safeParse(raw);
	if (!parsed.success) {
		return { ok: false, error: 'Invalid request.' };
	}

	try {
		await setAcceptanceRecordModeration(parsed.data.id, parsed.data.decision);
		return { ok: true, data: undefined };
	} catch {
		return { ok: false, error: 'Could not update this record.' };
	}
}
