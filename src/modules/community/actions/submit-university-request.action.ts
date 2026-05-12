"use server";

import type { ActionResult } from "@/modules/shared/types/action-result";
import { universityRequestFormSchema } from "@/modules/community/schema/university-request-form-schema";
import { createUniversityRequest } from "@/modules/community/services/university-request.service";
import { requireAuthSession } from "@/modules/admin/server/guards";
import { revalidatePath } from "next/cache";
import type { FieldErrors } from "react-hook-form";

export async function submitUniversityRequestAction(raw: unknown): Promise<
  ActionResult<{
    id: string;
    slug: string;
    verificationStatus: string;
    alreadyExists: boolean;
  }>
> {
  const parsed = universityRequestFormSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      ok: false,
      error: "Please fix the highlighted fields.",
      fieldErrors: parsed.error.flatten().fieldErrors as unknown as FieldErrors,
    };
  }

  const session = await requireAuthSession();

  try {
    const result = await createUniversityRequest(parsed.data, session.user.id);
    revalidatePath("/universities");
    revalidatePath("/dashboard/universities");
    revalidatePath(`/universities/${result.university.slug}`);
    revalidatePath(`/dashboard/universities/${result.university.slug}`);
    return {
      ok: true,
      data: {
        id: result.university.id,
        slug: result.university.slug,
        verificationStatus: result.university.verificationStatus,
        alreadyExists: result.status === "exists",
      },
    };
  } catch {
    return {
      ok: false,
      error: "Could not submit this request. Try again later.",
    };
  }
}
