import { db } from "@/lib/db";
import type { UniversityRequestFormInput } from "@/modules/community/schema/university-request-form-schema";

function normalize(value: string | null | undefined): string | null {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

function slugify(name: string): string {
  return name
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 96);
}

async function uniqueSlug(base: string): Promise<string> {
  const root = base || "university";
  for (let i = 0; i < 5000; i += 1) {
    const slug = i === 0 ? root : `${root}-${i}`;
    const taken = await db.university.findUnique({
      where: { slug },
      select: { id: true },
    });
    if (!taken) return slug;
  }
  throw new Error("Could not allocate unique slug");
}

function buildMatchFilters(name: string, website: string | null) {
  const filters: Array<Record<string, unknown>> = [
    { name: { equals: name, mode: "insensitive" } },
  ];
  if (website) {
    filters.push({ website: { equals: website, mode: "insensitive" } });
  }
  return filters;
}

export async function createUniversityRequest(
  input: UniversityRequestFormInput,
  userId: string,
) {
  const name = input.name.trim();
  const city = input.city.trim();
  const website = normalize(input.website);
  const programUrl = normalize(input.programUrl);
  const notes = normalize(input.notes);
  const filters = buildMatchFilters(name, website);

  const existing = await db.university.findFirst({
    where: {
      OR: filters,
      verificationStatus: { not: "REJECTED" },
    },
    select: { id: true, slug: true, verificationStatus: true },
  });

  if (existing) {
    return { status: "exists" as const, university: existing };
  }

  const rejected = await db.university.findFirst({
    where: {
      OR: filters,
      verificationStatus: "REJECTED",
    },
    select: { id: true, slug: true },
  });

  if (rejected) {
    const revived = await db.university.update({
      where: { id: rejected.id },
      data: {
        name,
        city,
        website,
        requestProgramUrl: programUrl,
        requestNotes: notes,
        verificationStatus: "PENDING",
        requestedById: userId,
        requestedAt: new Date(),
        reviewedById: null,
        reviewedAt: null,
      },
      select: { id: true, slug: true, verificationStatus: true },
    });
    return { status: "reopened" as const, university: revived };
  }

  const slug = await uniqueSlug(slugify(name));
  const created = await db.university.create({
    data: {
      name,
      city,
      website,
      slug,
      requestProgramUrl: programUrl,
      requestNotes: notes,
      verificationStatus: "PENDING",
      requestedById: userId,
      requestedAt: new Date(),
    },
    select: { id: true, slug: true, verificationStatus: true },
  });

  return { status: "created" as const, university: created };
}

export async function listPendingUniversityRequests() {
  return db.university.findMany({
    where: { verificationStatus: "PENDING" },
    orderBy: { requestedAt: "asc" },
    select: {
      id: true,
      name: true,
      city: true,
      website: true,
      requestProgramUrl: true,
      requestNotes: true,
      requestedAt: true,
      requestedBy: { select: { name: true, email: true } },
    },
  });
}

export async function setUniversityRequestModeration(
  id: string,
  decision: "APPROVED" | "REJECTED",
  reviewerId: string,
) {
  return db.university.update({
    where: { id },
    data: {
      verificationStatus: decision,
      reviewedById: reviewerId,
      reviewedAt: new Date(),
    },
    select: { id: true },
  });
}
