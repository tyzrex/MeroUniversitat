import { db } from "@/lib/db";
import { cache } from "react";

/** Full team detail for the team detail page. Throws if user is not a member. */
export const getTeamDetail = cache(
  async function getTeamDetail(teamId: string, currentUserId: string) {
    const membership = await db.teamMember.findUnique({
      where: { teamId_userId: { teamId, userId: currentUserId } },
    });

    if (!membership) {
      return null;
    }

    const team = await db.team.findUnique({
      where: { id: teamId },
      include: {
        owner: { select: { id: true, name: true, email: true, image: true } },
        members: {
          include: {
            user: {
              select: { id: true, name: true, email: true, image: true },
            },
          },
          orderBy: [{ role: "asc" }, { joinedAt: "asc" }],
        },
        applications: {
          orderBy: { updatedAt: "desc" },
          take: 20,
          include: {
            user: { select: { id: true, name: true, image: true } },
            university: {
              select: { id: true, name: true, slug: true, city: true },
            },
            program: { select: { id: true, name: true } },
          },
        },
        _count: { select: { members: true, applications: true } },
      },
    });

    if (!team) {
      return null;
    }

    return {
      ...team,
      currentUserRole: membership.role,
      isOwner: team.ownerId === currentUserId,
      isAdmin:
        membership.role === "OWNER" || membership.role === "ADMIN",
    };
  },
);

export type TeamDetail = NonNullable<
  Awaited<ReturnType<typeof getTeamDetail>>
>;
