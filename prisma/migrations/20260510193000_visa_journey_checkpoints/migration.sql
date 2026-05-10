-- CreateEnum
CREATE TYPE "VisaJourneyMilestone" AS ENUM (
  'DOCUMENTS_PREP',
  'UNIVERSITY_ADMIT',
  'CSP_SUBMITTED',
  'WAITING_LIST',
  'PRELIM_REVIEW',
  'CASE_REVIEW',
  'INTERVIEW',
  'PASSPORT_COLLECTED'
);

-- AlterTable
ALTER TABLE "Profile" ADD COLUMN "embassyTimelinePublic" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "VisaJourneyCheckpoint" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "milestone" "VisaJourneyMilestone" NOT NULL,
    "occurredAt" TIMESTAMP(3) NOT NULL,
    "notes" TEXT,
    "expectedEta" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VisaJourneyCheckpoint_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "VisaJourneyCheckpoint_userId_milestone_key" ON "VisaJourneyCheckpoint"("userId", "milestone");

CREATE INDEX "VisaJourneyCheckpoint_userId_idx" ON "VisaJourneyCheckpoint"("userId");

-- AddForeignKey
ALTER TABLE "VisaJourneyCheckpoint" ADD CONSTRAINT "VisaJourneyCheckpoint_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
