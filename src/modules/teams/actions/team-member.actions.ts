"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import type { ActionResult } from "@/modules/shared/types/action-result";
import { headers } from "next/headers";
import { z } from "zod";

// ─── Schemas ──────────────────────────────────────────────────────────────────

const removeMemberSchema = z.object({
  teamId: z.string().min(1),
  memberId: z.string().min(1), // userId of member to remove
});

const updateRoleSchema = z.object({
  teamId: z.string().min(1),
  memberId: z.string().min(1),
  role: z.enum(["ADMIN", "MEMBER"]),
});

const teamIdSchema = z.object({
  teamId: z.string().min(1),
});

// ─── Helpers ──────────────────────────────────────────────────────────────────

async function requireSession() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) throw new Error("Not authenticated.");
  return session.user.id;
}

async function requireAdminOrOwner(teamId: string, userId: string) {
  const membership = await db.teamMember.findUnique({
    where: { teamId_userId: { teamId, userId } },
  });
  if (!membership || (membership.role !== "OWNER" && membership.role !== "ADMIN")) {
    throw new Error("Only team owners and admins can perform this action.");
  }
  return membership;
}

async function requireOwner(teamId: string, userId: string) {
  const team = await db.team.findUnique({
    where: { id: teamId },
    select: { ownerId: true },
  });
  if (!team || team.ownerId !== userId) {
    throw new Error("Only the team owner can perform this action.");
  }
  return team;
}

// ─── Actions ──────────────────────────────────────────────────────────────────

/** Owner/admin removes a member from the team. Cannot remove the owner. */
export async function removeMemberAction(
  raw: unknown,
): Promise<ActionResult<void>> {
  try {
    const userId = await requireSession();
    const { teamId, memberId } = removeMemberSchema.parse(raw);

    await requireAdminOrOwner(teamId, userId);

    // Cannot remove the team owner
    const team = await db.team.findUnique({
      where: { id: teamId },
      select: { ownerId: true },
    });
    if (team?.ownerId === memberId) {
      return { ok: false, error: "Cannot remove the team owner." };
    }

    // Cannot remove yourself via this action (use leave instead)
    if (memberId === userId) {
      return { ok: false, error: "Use 'Leave team' to remove yourself." };
    }

    await db.teamMember.delete({
      where: { teamId_userId: { teamId, userId: memberId } },
    });

    await db.teamActivity.create({
      data: {
        teamId,
        actorUserId: userId,
        type: "MEMBER_REMOVED",
        data: { memberUserId: memberId },
      },
    });

    return { ok: true, data: undefined };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Could not remove the member.";
    return { ok: false, error: msg };
  }
}

/** Owner changes a member's role (ADMIN ↔ MEMBER). Cannot change own role. */
export async function updateMemberRoleAction(
  raw: unknown,
): Promise<ActionResult<void>> {
  try {
    const userId = await requireSession();
    const { teamId, memberId, role } = updateRoleSchema.parse(raw);

    await requireOwner(teamId, userId);

    if (memberId === userId) {
      return { ok: false, error: "Cannot change your own role." };
    }

    await db.teamMember.update({
      where: { teamId_userId: { teamId, userId: memberId } },
      data: { role },
    });

    await db.teamActivity.create({
      data: {
        teamId,
        actorUserId: userId,
        type: "MEMBER_ROLE_UPDATED",
        data: { memberUserId: memberId, role },
      },
    });

    return { ok: true, data: undefined };
  } catch (e) {
    const msg =
      e instanceof Error ? e.message : "Could not update the member role.";
    return { ok: false, error: msg };
  }
}

/** Current user leaves the team. Owner cannot leave (must transfer ownership first). */
export async function leaveTeamAction(
  raw: unknown,
): Promise<ActionResult<void>> {
  try {
    const userId = await requireSession();
    const { teamId } = teamIdSchema.parse(raw);

    const team = await db.team.findUnique({
      where: { id: teamId },
      select: { ownerId: true },
    });

    if (!team) {
      return { ok: false, error: "Team not found." };
    }

    if (team.ownerId === userId) {
      return {
        ok: false,
        error:
          "Team owners cannot leave. Transfer ownership or delete the team first.",
      };
    }

    await db.teamMember.delete({
      where: { teamId_userId: { teamId, userId } },
    });

    await db.teamActivity.create({
      data: {
        teamId,
        actorUserId: userId,
        type: "MEMBER_LEFT",
      },
    });

    return { ok: true, data: undefined };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Could not leave the team.";
    return { ok: false, error: msg };
  }
}

/** Owner regenerates the invite code (invalidates old one). */
export async function regenerateInviteCodeAction(
  raw: unknown,
): Promise<ActionResult<{ inviteCode: string }>> {
  try {
    const userId = await requireSession();
    const { teamId } = teamIdSchema.parse(raw);

    await requireOwner(teamId, userId);

    // Generate a shorter, friendlier invite code
    const code = generateInviteCode();

    const updated = await db.team.update({
      where: { id: teamId },
      data: { inviteCode: code },
      select: { inviteCode: true },
    });

    await db.teamActivity.create({
      data: {
        teamId,
        actorUserId: userId,
        type: "INVITE_REGENERATED",
      },
    });

    return { ok: true, data: { inviteCode: updated.inviteCode } };
  } catch (e) {
    const msg =
      e instanceof Error ? e.message : "Could not regenerate invite code.";
    return { ok: false, error: msg };
  }
}

/** 6-character alphanumeric invite code. */
function generateInviteCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no I/O/1/0 for readability
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}
