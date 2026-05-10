"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { requireAdminSession } from "@/modules/admin/server/guards";
import type { ActionResult } from "@/modules/shared/types/action-result";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

export async function setUserSuspendedAction(
  targetUserId: string,
  suspended: boolean,
): Promise<ActionResult<void>> {
  await requireAdminSession();

  const session = await auth.api.getSession({ headers: await headers() });
  if (session?.user?.id === targetUserId) {
    return { ok: false, error: "You cannot suspend your own account." };
  }

  const target = await db.user.findUnique({
    where: { id: targetUserId },
    select: { role: true },
  });
  if (!target) {
    return { ok: false, error: "User not found." };
  }
  if (target.role === "ADMIN") {
    return { ok: false, error: "Cannot change suspension for admin accounts." };
  }

  await db.user.update({
    where: { id: targetUserId },
    data: { suspendedAt: suspended ? new Date() : null },
  });

  revalidatePath("/admin/users");
  revalidatePath("/admin");
  return { ok: true, data: undefined };
}

/** Form `action` — must return `void` for Next.js types (errors are no-ops here). */
export async function toggleUserSuspendedFormAction(
  formData: FormData,
): Promise<void> {
  const userId = String(formData.get("userId") ?? "").trim();
  const suspend = formData.get("suspend") === "true";
  if (!userId) return;
  await setUserSuspendedAction(userId, suspend);
}
