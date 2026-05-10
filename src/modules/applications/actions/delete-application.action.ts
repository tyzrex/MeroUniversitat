"use server";

import { auth } from "@/lib/auth";
import type { ActionResult } from "@/modules/shared/types/action-result";
import { deleteApplicationForUser } from "@/modules/applications/services/application-mutations.service";
import { headers } from "next/headers";
import { z } from "zod";

const payloadSchema = z.object({
  id: z.string().min(1),
});

export async function deleteApplicationAction(
  raw: unknown,
): Promise<ActionResult<void>> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user?.id) {
    return { ok: false, error: "Sign in to delete an application." };
  }

  const parsed = payloadSchema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, error: "Invalid delete request." };
  }

  try {
    await deleteApplicationForUser(session.user.id, parsed.data.id);
    return { ok: true, data: undefined };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Could not delete the application.";
    return { ok: false, error: msg };
  }
}

