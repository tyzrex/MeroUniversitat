-- CreateEnum
CREATE TYPE "AcceptanceModerationStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- AlterTable
ALTER TABLE "AcceptanceRecord" ADD COLUMN "moderationStatus" "AcceptanceModerationStatus" NOT NULL DEFAULT 'APPROVED';

-- CreateTable
CREATE TABLE "SiteSettings" (
    "id" TEXT NOT NULL,
    "acceptanceManualReview" BOOLEAN NOT NULL DEFAULT true,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SiteSettings_pkey" PRIMARY KEY ("id")
);

INSERT INTO "SiteSettings" ("id", "acceptanceManualReview", "updatedAt")
VALUES ('default', true, CURRENT_TIMESTAMP);
