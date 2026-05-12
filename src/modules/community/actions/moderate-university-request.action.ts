"use server";

import { requireAdminSession } from "@/modules/admin/server/guards";
import type { ActionResult } from "@/modules/shared/types/action-result";
import { setUniversityRequestModeration } from "@/modules/community/services/university-request.service";
import { z } from "zod";

const moderateSchema = z.object({
  id: z.string().min(1),
  decision: z.enum(["APPROVED", "REJECTED"]),
});

export async function moderateUniversityRequestAction(
  raw: unknown,
): Promise<ActionResult<void>> {
  const session = await requireAdminSession();

  const parsed = moderateSchema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, error: "Invalid request." };
  }

  try {
    await setUniversityRequestModeration(
      parsed.data.id,
      parsed.data.decision,
      session.user.id,
    );
    return { ok: true, data: undefined };
  } catch {
    return { ok: false, error: "Could not update this request." };
  }
}
