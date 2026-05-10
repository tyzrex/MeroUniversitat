import { db } from "@/lib/db";
import type {
  ApplicationCreateInput,
  ApplicationStatusValue,
  ApplicationUpdateInput,
} from "@/modules/applications/schema/application-form-schema";

async function assertTeamMembership(userId: string, teamId: string) {
  const m = await db.teamMember.findUnique({
    where: { teamId_userId: { teamId, userId } },
  });
  if (!m) {
    throw new Error("You are not a member of this team.");
  }
}

/** Linking “I applied here too” — teammate’s row must be on a team you belong to. */
async function assertCanMirrorApplication(
  userId: string,
  mirrorApplicationId: string,
  explicitTeamId: string | null | undefined,
) {
  const mirror = await db.application.findUnique({
    where: { id: mirrorApplicationId },
    select: {
      id: true,
      userId: true,
      teamId: true,
    },
  });

  if (!mirror) {
    throw new Error("Original application not found.");
  }

  if (mirror.userId === userId) {
    throw new Error("Use edit on your own application.");
  }

  if (!mirror.teamId) {
    throw new Error("You can only mirror team applications.");
  }

  await assertTeamMembership(userId, mirror.teamId);

  if (explicitTeamId && explicitTeamId !== mirror.teamId) {
    throw new Error("Team must match the application you are linking.");
  }
}

export async function createApplicationForUser(
  userId: string,
  input: ApplicationCreateInput,
) {
  const uni = await db.university.findUnique({
    where: { id: input.universityId },
    select: { id: true, name: true, city: true },
  });
  if (!uni) {
    throw new Error("University not found.");
  }

  let teamId: string | null = input.teamId?.trim() || null;

  if (input.mirrorsApplicationId?.trim()) {
    await assertCanMirrorApplication(
      userId,
      input.mirrorsApplicationId.trim(),
      teamId,
    );
    const mirror = await db.application.findUnique({
      where: { id: input.mirrorsApplicationId.trim() },
      select: { teamId: true },
    });
    teamId = mirror?.teamId ?? null;
  }

  if (teamId) {
    await assertTeamMembership(userId, teamId);
  }

  const programId: string | null = null;

  const deadline = input.deadline?.trim()
    ? new Date(input.deadline)
    : undefined;
  if (deadline && Number.isNaN(deadline.getTime())) {
    throw new Error("Invalid deadline date.");
  }

  const groupId = input.applicationGroupId?.trim() || null;

  return db.application.create({
    data: {
      userId,
      teamId,
      universityId: uni.id,
      universityName: uni.name,
      city: uni.city,
      programId,
      programName: input.programName?.trim() || null,
      intakeSemester: input.intakeSemester?.trim() || null,
      status: input.status as never,
      notes: input.notes?.trim() || null,
      deadline: deadline && !Number.isNaN(deadline.getTime()) ? deadline : null,
      mirrorsApplicationId: input.mirrorsApplicationId?.trim() || null,
      applicationGroupId: groupId,
    },
  });
}

export async function getApplicationForEditor(userId: string, applicationId: string) {
  const app = await db.application.findUnique({
    where: { id: applicationId },
    include: {
      university: { select: { id: true, name: true, city: true } },
    },
  });

  if (!app || app.userId !== userId) {
    return null;
  }

  return app;
}

/** Quick status change from Kanban — owner must match `userId`. */
export async function updateApplicationStatusForOwner(
  userId: string,
  applicationId: string,
  status: ApplicationStatusValue,
) {
  const existing = await db.application.findUnique({
    where: { id: applicationId },
    select: { userId: true },
  });

  if (!existing || existing.userId !== userId) {
    throw new Error("Application not found or access denied.");
  }

  return db.application.update({
    where: { id: applicationId },
    data: { status: status as never },
  });
}

export async function updateApplicationForUser(
  userId: string,
  data: ApplicationUpdateInput,
) {
  const existing = await db.application.findUnique({
    where: { id: data.id },
  });

  if (!existing || existing.userId !== userId) {
    throw new Error("Application not found or access denied.");
  }

  const uni = await db.university.findUnique({
    where: { id: data.universityId },
    select: { id: true, name: true, city: true },
  });
  if (!uni) {
    throw new Error("University not found.");
  }

  let teamId: string | null = data.teamId?.trim() || null;
  if (existing.mirrorsApplicationId) {
    teamId = existing.teamId;
  } else if (teamId) {
    await assertTeamMembership(userId, teamId);
  }

  const deadline = data.deadline?.trim()
    ? new Date(data.deadline)
    : null;
  if (deadline && Number.isNaN(deadline.getTime())) {
    throw new Error("Invalid deadline date.");
  }

  return db.application.update({
    where: { id: data.id },
    data: {
      universityId: uni.id,
      universityName: uni.name,
      city: uni.city,
      programName: data.programName?.trim() || null,
      intakeSemester: data.intakeSemester?.trim() || null,
      teamId,
      status: data.status as never,
      notes: data.notes?.trim() || null,
      deadline:
        deadline && !Number.isNaN(deadline.getTime()) ? deadline : null,
    },
  });
}

export async function getMirrorPrefill(mirrorApplicationId: string, userId: string) {
  await assertCanMirrorApplication(userId, mirrorApplicationId, undefined);

  const mirror = await db.application.findUnique({
    where: { id: mirrorApplicationId },
    select: {
      universityId: true,
      teamId: true,
      intakeSemester: true,
      university: { select: { id: true, name: true, city: true } },
      team: { select: { id: true, name: true } },
      user: { select: { name: true } },
    },
  });

  return mirror;
}
