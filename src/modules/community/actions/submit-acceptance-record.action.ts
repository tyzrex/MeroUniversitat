"use server";

import { acceptanceRecordFormSchema } from "@/modules/community/schema/acceptance-record-form-schema";
import { createAcceptanceRecord } from "@/modules/community/services/acceptance-record.service";
import { getOptionalSession } from "@/modules/shared/server/session";
import type { ActionResult } from "@/modules/shared/types/action-result";
import type { FieldErrors } from "react-hook-form";

export async function submitAcceptanceRecordAction(
  raw: unknown,
): Promise<ActionResult<{ id: string }>> {
  const parsed = acceptanceRecordFormSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      ok: false,
      error: "Please fix the highlighted fields.",
      fieldErrors: parsed.error.flatten()
        .fieldErrors as unknown as FieldErrors,
    };
  }

  const session = await getOptionalSession();

  try {
    const record = await createAcceptanceRecord(parsed.data, session);
    return { ok: true, data: { id: record.id } };
  } catch {
    return {
      ok: false,
      error: "Could not save your submission. Try again later.",
    };
  }
}
