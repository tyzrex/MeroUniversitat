import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import type { AcceptanceRecordFormValues } from "@/modules/community/schema/acceptance-record-form-schema";
import { getSiteSettings } from "@/modules/community/services/site-settings.service";

function parseOptionalDate(value?: string) {
  if (!value?.trim()) return undefined;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? undefined : d;
}

/** After editing `prisma/schema.prisma`, run `npm run db:generate` (needs Node ≥20). */
export async function createAcceptanceRecord(
  data: AcceptanceRecordFormValues,
  session: Awaited<ReturnType<typeof auth.api.getSession>>,
) {
  const uni = await db.university.findUnique({
    where: { id: data.universityId },
    select: { id: true },
  });
  if (!uni) {
    throw new Error("University not found");
  }

  let programId: string | null = data.programId?.trim() || null;
  if (programId) {
    const program = await db.program.findFirst({
      where: { id: programId, universityId: data.universityId },
      select: { id: true },
    });
    if (!program) programId = null;
  }

  const contributorName = data.contributorName?.trim();
  const settings = await getSiteSettings();
  const moderationStatus = settings.acceptanceManualReview
    ? "PENDING"
    : "APPROVED";

  return db.acceptanceRecord.create({
    data: {
      userId: session?.user?.id ?? null,
      contributorName: contributorName?.length ? contributorName : null,
      universityId: data.universityId,
      programId,
      programNameSnapshot: data.programNameFree?.trim() || null,
      gpa: data.gpa !== undefined ? String(data.gpa) : null,
      percentage:
        data.percentage !== undefined ? String(data.percentage) : null,
      englishTestType: data.englishTestType,
      englishTestScore: data.englishTestScore?.trim() || null,
      germanLevel: data.germanLevel,
      nepalBoard: data.nepalBoard?.trim() || null,
      subject: data.subject?.trim() || null,
      workExperienceYrs: data.workExperienceYrs ?? 0,
      hasAPS: data.hasAPS,
      intake: data.intake.trim(),
      result: data.result,
      appliedDate: parseOptionalDate(data.appliedDate),
      responseDate: parseOptionalDate(data.responseDate),
      offerDate: parseOptionalDate(data.offerDate),
      notes: data.notes?.trim() || null,
      isAnonymous: data.isAnonymous,
      moderationStatus,
    },
  });
}

export async function listApprovedAcceptanceRecordsPublic(limit = 12) {
  return db.acceptanceRecord.findMany({
    where: {
      moderationStatus: "APPROVED",
      isDeleted: false,
    },
    orderBy: { createdAt: "desc" },
    take: limit,
    include: {
      university: {
        select: {
          name: true,
          city: true,
          slug: true,
          logoUrl: true,
          imageUrl: true,
        },
      },
    },
  });
}

export async function listAcceptanceRecordsForUser(userId: string) {
  return db.acceptanceRecord.findMany({
    where: { userId, isDeleted: false },
    orderBy: { createdAt: "desc" },
    include: {
      university: {
        select: {
          name: true,
          city: true,
          slug: true,
          logoUrl: true,
          imageUrl: true,
        },
      },
    },
  });
}

export async function getAcceptanceRecordForUser(id: string, userId: string) {
  return db.acceptanceRecord.findFirst({
    where: { id, userId, isDeleted: false },
    include: {
      university: {
        select: {
          name: true,
          city: true,
          state: true,
          slug: true,
          website: true,
          logoUrl: true,
          imageUrl: true,
        },
      },
      program: {
        select: {
          name: true,
          degree: true,
          subject: true,
          language: true,
          programUrl: true,
        },
      },
    },
  });
}

export async function listPendingAcceptanceRecords() {
  return db.acceptanceRecord.findMany({
    where: {
      moderationStatus: "PENDING",
      isDeleted: false,
    },
    orderBy: { createdAt: "asc" },
    include: {
      university: { select: { name: true, slug: true } },
      user: { select: { email: true, name: true } },
    },
  });
}

export async function setAcceptanceRecordModeration(
  id: string,
  moderationStatus: "APPROVED" | "REJECTED",
) {
  await db.acceptanceRecord.update({
    where: { id },
    data: { moderationStatus },
  });
}
