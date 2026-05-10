"use server";

import {
  APPLICATION_STATUSES,
} from "@/modules/applications/schema/application-form-schema";
import { updateApplicationStatusForOwner } from "@/modules/applications/services/application-mutations.service";
import { auth } from "@/lib/auth";
import type { ActionResult } from "@/modules/shared/types/action-result";
import { headers } from "next/headers";
import { z } from "zod";

const payloadSchema = z.object({
  applicationId: z.string().min(1),
  status: z.enum(APPLICATION_STATUSES),
});

export async function updateApplicationStatusAction(
  raw: unknown,
): Promise<ActionResult<void>> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user?.id) {
    return { ok: false, error: "Sign in to update status." };
  }

  const parsed = payloadSchema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, error: "Invalid status update." };
  }

  try {
    await updateApplicationStatusForOwner(
      session.user.id,
      parsed.data.applicationId,
      parsed.data.status,
    );
    return { ok: true, data: undefined };
  } catch (e) {
    const msg =
      e instanceof Error ? e.message : "Could not update the application.";
    return { ok: false, error: msg };
  }
}
