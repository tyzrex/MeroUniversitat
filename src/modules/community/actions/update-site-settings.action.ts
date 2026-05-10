"use server";

import { setAcceptanceManualReview } from "@/modules/community/services/site-settings.service";
import { requireAdminSession } from "@/modules/admin/server/guards";
import type { ActionResult } from "@/modules/shared/types/action-result";
import { z } from "zod";

const schema = z.object({
  acceptanceManualReview: z.boolean(),
});

export async function updateSiteSettingsAction(
  raw: unknown,
): Promise<ActionResult<void>> {
  await requireAdminSession();

  const parsed = schema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, error: "Invalid settings payload." };
  }

  try {
    await setAcceptanceManualReview(parsed.data.acceptanceManualReview);
    return { ok: true, data: undefined };
  } catch {
    return { ok: false, error: "Could not save settings." };
  }
}
