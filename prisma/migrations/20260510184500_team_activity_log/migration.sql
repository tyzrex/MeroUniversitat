-- CreateEnum
CREATE TYPE "TeamActivityType" AS ENUM (
  'TEAM_CREATED',
  'MEMBER_JOINED',
  'MEMBER_LEFT',
  'MEMBER_REMOVED',
  'MEMBER_ROLE_UPDATED',
  'INVITE_REGENERATED',
  'APPLICATION_CREATED',
  'APPLICATION_UPDATED',
  'APPLICATION_STATUS_CHANGED',
  'APPLICATION_DELETED'
);

-- CreateTable
CREATE TABLE "TeamActivity" (
  "id" TEXT NOT NULL,
  "teamId" TEXT NOT NULL,
  "actorUserId" TEXT,
  "type" "TeamActivityType" NOT NULL,
  "data" JSONB,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "TeamActivity_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "TeamActivity" ADD CONSTRAINT "TeamActivity_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeamActivity" ADD CONSTRAINT "TeamActivity_actorUserId_fkey" FOREIGN KEY ("actorUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- CreateIndex
CREATE INDEX "TeamActivity_teamId_createdAt_idx" ON "TeamActivity"("teamId", "createdAt");

-- CreateIndex
CREATE INDEX "TeamActivity_actorUserId_createdAt_idx" ON "TeamActivity"("actorUserId", "createdAt");

