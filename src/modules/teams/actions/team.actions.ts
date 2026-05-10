"use server";

import {
  createTeamForUser,
  joinTeamByInviteCode,
} from "@/modules/teams/services/team.service";
import { auth } from "@/lib/auth";
import type { ActionResult } from "@/modules/shared/types/action-result";
import { headers } from "next/headers";
import { z } from "zod";

const createSchema = z.object({
  name: z.string().min(2).max(120),
  description: z.string().max(500).optional().or(z.literal("")),
});

const joinSchema = z.object({
  code: z.string().min(4).max(64),
});

export async function createTeamAction(
  raw: unknown,
): Promise<ActionResult<{ teamId: string }>> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) {
    return { ok: false, error: "Sign in to create a team." };
  }

  const parsed = createSchema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, error: "Check the team name and try again." };
  }

  try {
    const team = await createTeamForUser({
      userId: session.user.id,
      name: parsed.data.name,
      description: parsed.data.description,
    });
    return { ok: true, data: { teamId: team.id } };
  } catch {
    return { ok: false, error: "Could not create the team." };
  }
}

export async function joinTeamByCodeAction(
  raw: unknown,
): Promise<ActionResult<{ teamId: string; alreadyMember: boolean }>> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) {
    return { ok: false, error: "Sign in to join a team." };
  }

  const parsed = joinSchema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, error: "Enter a valid invite code." };
  }

  try {
    const result = await joinTeamByInviteCode({
      userId: session.user.id,
      code: parsed.data.code,
    });
    return {
      ok: true,
      data: {
        teamId: result.team.id,
        alreadyMember: result.alreadyMember,
      },
    };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Could not join the team.";
    return { ok: false, error: msg };
  }
}
