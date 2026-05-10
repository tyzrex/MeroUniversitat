"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import type { ActionResult } from "@/modules/shared/types/action-result";
import { parseDateOnlyInput } from "@/modules/visa/lib/date-only";
import type { VisaJourneyMilestoneValue } from "@/modules/visa/lib/milestone-order";
import {
  upsertVisaCheckpointSchema,
  type UpsertVisaCheckpointInput,
} from "@/modules/visa/schema/visa-checkpoint-schema";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

export async function upsertVisaCheckpointAction(
  raw: unknown,
): Promise<ActionResult<void>> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user?.id) {
    return { ok: false, error: "You must be signed in." };
  }

  const parsed = upsertVisaCheckpointSchema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, error: "Invalid milestone data." };
  }

  const data: UpsertVisaCheckpointInput = parsed.data;
  const userId = session.user.id;
  const milestone = data.milestone as VisaJourneyMilestoneValue;

  const occurredAt = parseDateOnlyInput(
    data.occurredAt?.trim() ? data.occurredAt : undefined,
  );
  const expectedEta = parseDateOnlyInput(
    data.expectedEta?.trim() ? data.expectedEta : undefined,
  );

  if (!occurredAt) {
    await db.visaJourneyCheckpoint.deleteMany({
      where: { userId, milestone },
    });
    revalidatePath("/dashboard/profile");
    revalidatePath("/dashboard/timelines");
    return { ok: true, data: undefined };
  }

  await db.visaJourneyCheckpoint.upsert({
    where: {
      userId_milestone: { userId, milestone },
    },
    create: {
      userId,
      milestone,
      occurredAt,
      notes: data.notes?.trim() || null,
      expectedEta,
    },
    update: {
      occurredAt,
      notes: data.notes?.trim() || null,
      expectedEta,
    },
  });

  revalidatePath("/dashboard/profile");
  revalidatePath("/dashboard/timelines");
  return { ok: true, data: undefined };
}
