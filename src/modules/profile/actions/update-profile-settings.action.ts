"use server";

import { db } from "@/lib/db";
import {
  profileSettingsSchema,
  type ProfileSettingsInput,
} from "@/modules/profile/schema/profile-settings-schema";
import { auth } from "@/lib/auth";
import type { ActionResult } from "@/modules/shared/types/action-result";
import type { FieldErrors } from "react-hook-form";
import { headers } from "next/headers";

export async function updateProfileSettingsAction(
  raw: unknown,
): Promise<ActionResult<void>> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user?.id) {
    return { ok: false, error: "You must be signed in." };
  }

  const parsed = profileSettingsSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      ok: false,
      error: "Please check the form for errors.",
      fieldErrors: parsed.error.flatten()
        .fieldErrors as unknown as FieldErrors,
    };
  }

  const data: ProfileSettingsInput = parsed.data;
  const userId = session.user.id;

  try {
    await db.$transaction([
      db.user.update({
        where: { id: userId },
        data: {
          name: data.name.trim(),
          bio: data.bio?.trim() || null,
        },
      }),
      db.profile.upsert({
        where: { userId },
        create: {
          userId,
          gpa:
            data.gpa !== undefined ? String(data.gpa) : null,
          percentage:
            data.percentage !== undefined ? String(data.percentage) : null,
          englishTestType: data.englishTestType,
          englishTestScore: data.englishTestScore?.trim() || null,
          germanLevel: data.germanLevel,
          nepalUniversity: data.nepalUniversity?.trim() || null,
          nepalBoard: data.nepalBoard?.trim() || null,
          subject: data.subject?.trim() || null,
          bachelorProgram: data.bachelorProgram?.trim() || null,
          workExperienceYrs: data.workExperienceYrs ?? 0,
          targetIntake: data.targetIntake?.trim() || null,
          isPublic: data.isPublic,
          preferredCities: [],
        },
        update: {
          gpa:
            data.gpa !== undefined ? String(data.gpa) : null,
          percentage:
            data.percentage !== undefined ? String(data.percentage) : null,
          englishTestType: data.englishTestType,
          englishTestScore: data.englishTestScore?.trim() || null,
          germanLevel: data.germanLevel,
          nepalUniversity: data.nepalUniversity?.trim() || null,
          nepalBoard: data.nepalBoard?.trim() || null,
          subject: data.subject?.trim() || null,
          bachelorProgram: data.bachelorProgram?.trim() || null,
          workExperienceYrs: data.workExperienceYrs ?? 0,
          targetIntake: data.targetIntake?.trim() || null,
          isPublic: data.isPublic,
        },
      }),
    ]);

    return { ok: true, data: undefined };
  } catch {
    return { ok: false, error: "Could not save profile." };
  }
}
