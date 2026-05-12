import { db } from "@/lib/db";
import { cache } from "react";

type FeedbackType = "FEATURE_REQUEST" | "COMMUNITY_FEEDBACK" | "BUG_REPORT" | "OTHER";
type FeedbackStatus = "PENDING" | "UNDER_REVIEW" | "ACKNOWLEDGED" | "IN_PROGRESS" | "COMPLETED" | "DECLINED";

export type FeedbackRow = {
  id: string;
  type: FeedbackType;
  title: string;
  description: string;
  category: string | null;
  status: FeedbackStatus;
  adminNotes: string | null;
  reviewedAt: Date | null;
  isAnonymous: boolean;
  createdAt: Date;
  updatedAt: Date;
  user: { id: string; name: string; email: string } | null;
  reviewer: { id: string; name: string } | null;
};

const feedbackInclude = {
  user: { select: { id: true, name: true, email: true } },
  reviewedBy: { select: { id: true, name: true } },
} as const;

export async function createFeedback(data: {
  userId: string | null;
  type: FeedbackType;
  title: string;
  description: string;
  category: string | null;
  isAnonymous: boolean;
}) {
  return db.feedback.create({
    data: {
      userId: data.userId,
      type: data.type,
      title: data.title.trim(),
      description: data.description.trim(),
      category: data.category?.trim() || null,
      isAnonymous: data.isAnonymous,
    },
  });
}

export async function updateFeedbackStatus(
  id: string,
  status: FeedbackStatus,
  adminNotes: string | null,
  reviewerId: string,
) {
  return db.feedback.update({
    where: { id },
    data: {
      status,
      adminNotes: adminNotes?.trim() || null,
      reviewedById: reviewerId,
      reviewedAt: new Date(),
    },
  });
}

export const listFeedbackForUser = cache(
  async function listFeedbackForUser(userId: string) {
    return db.feedback.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      include: feedbackInclude,
    });
  },
);

export const listFeedbackAdmin = cache(
  async function listFeedbackAdmin(filters?: {
    type?: FeedbackType;
    status?: FeedbackStatus;
  }) {
    return db.feedback.findMany({
      where: {
        ...(filters?.type ? { type: filters.type } : {}),
        ...(filters?.status ? { status: filters.status } : {}),
      },
      orderBy: { createdAt: "desc" },
      include: feedbackInclude,
    });
  },
);

export const getFeedbackById = cache(
  async function getFeedbackById(id: string) {
    return db.feedback.findUnique({
      where: { id },
      include: feedbackInclude,
    });
  },
);

export const getFeedbackStats = cache(async function getFeedbackStats() {
  const [total, pending, acknowledged, featureRequests, communityFeedback, bugs, other] =
    await Promise.all([
      db.feedback.count(),
      db.feedback.count({ where: { status: "PENDING" } }),
      db.feedback.count({ where: { status: "ACKNOWLEDGED" } }),
      db.feedback.count({ where: { type: "FEATURE_REQUEST" } }),
      db.feedback.count({ where: { type: "COMMUNITY_FEEDBACK" } }),
      db.feedback.count({ where: { type: "BUG_REPORT" } }),
      db.feedback.count({ where: { type: "OTHER" } }),
    ]);

  return {
    total,
    pending,
    acknowledged,
    featureRequestCount: featureRequests,
    communityFeedbackCount: communityFeedback,
    bugReportCount: bugs,
    otherCount: other,
  };
});
