import { db } from "@/lib/db";

export async function listTeamsForUser(userId: string) {
  const owned = await db.team.findMany({
    where: { ownerId: userId },
    include: {
      members: { include: { user: { select: { id: true, name: true, image: true } } } },
      _count: { select: { members: true, applications: true } },
    },
    orderBy: { updatedAt: "desc" },
  });

  const memberOf = await db.teamMember.findMany({
    where: {
      userId,
      team: { ownerId: { not: userId } },
    },
    include: {
      team: {
        include: {
          owner: { select: { id: true, name: true, image: true } },
          members: {
            include: { user: { select: { id: true, name: true, image: true } } },
          },
          _count: { select: { members: true, applications: true } },
        },
      },
    },
    orderBy: { joinedAt: "desc" },
  });

  return { owned, memberOf };
}

export async function listTeamOptionsForUser(userId: string) {
  const { owned, memberOf } = await listTeamsForUser(userId);
  const map = new Map<string, { id: string; name: string }>();
  for (const t of owned) {
    map.set(t.id, { id: t.id, name: t.name });
  }
  for (const m of memberOf) {
    map.set(m.team.id, { id: m.team.id, name: m.team.name });
  }
  return [...map.values()].sort((a, b) => a.name.localeCompare(b.name));
}

export async function createTeamForUser(options: {
  userId: string;
  name: string;
  description?: string | null;
}) {
  const team = await db.team.create({
    data: {
      ownerId: options.userId,
      name: options.name.trim(),
      description: options.description?.trim() || null,
      members: {
        create: {
          userId: options.userId,
          role: "OWNER",
        },
      },
    },
    include: {
      _count: { select: { members: true, applications: true } },
    },
  });

  // Activity log
  await db.teamActivity.create({
    data: {
      teamId: team.id,
      actorUserId: options.userId,
      type: "TEAM_CREATED",
    },
  });
  return team;
}

export async function joinTeamByInviteCode(options: {
  userId: string;
  code: string;
}) {
  const normalized = options.code.trim();
  const team = await db.team.findFirst({
    where: {
      inviteCode: { equals: normalized, mode: "insensitive" },
      isActive: true,
    },
  });

  if (!team) {
    throw new Error("No active team matches that invite code.");
  }

  const existing = await db.teamMember.findUnique({
    where: {
      teamId_userId: { teamId: team.id, userId: options.userId },
    },
  });

  if (existing) {
    return { team, alreadyMember: true as const };
  }

  await db.teamMember.create({
    data: {
      teamId: team.id,
      userId: options.userId,
      role: "MEMBER",
    },
  });

  await db.teamActivity.create({
    data: {
      teamId: team.id,
      actorUserId: options.userId,
      type: "MEMBER_JOINED",
    },
  });

  return { team, alreadyMember: false as const };
}
