"use server";

import { requireModeratorSession } from "@/modules/admin/server/guards";
import { updateFeedbackStatus } from "@/modules/feedback/services/feedback.service";
import type { ActionResult } from "@/modules/shared/types/action-result";
import { z } from "zod";

const statusValues = [
  "PENDING",
  "UNDER_REVIEW",
  "ACKNOWLEDGED",
  "IN_PROGRESS",
  "COMPLETED",
  "DECLINED",
] as const;

const schema = z.object({
  id: z.string().min(1),
  status: z.enum(statusValues),
  adminNotes: z.string().max(2000).optional().or(z.literal("")),
});

export async function updateFeedbackStatusAction(
  raw: unknown,
): Promise<ActionResult<void>> {
  const parsed = schema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, error: "Invalid request." };
  }

  const session = await requireModeratorSession();

  try {
    await updateFeedbackStatus(
      parsed.data.id,
      parsed.data.status,
      parsed.data.adminNotes ?? null,
      session.user.id,
    );
    return { ok: true, data: undefined };
  } catch {
    return { ok: false, error: "Could not update feedback." };
  }
}
