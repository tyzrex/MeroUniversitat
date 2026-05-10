-- CreateEnum
CREATE TYPE "WorkspacePreference" AS ENUM ('SOLO', 'TEAM');

-- AlterTable
ALTER TABLE "User" ADD COLUMN "workspacePreference" "WorkspacePreference";

-- AlterTable
ALTER TABLE "Application" ADD COLUMN "universityId" TEXT,
ADD COLUMN "intakeSemester" TEXT,
ADD COLUMN "applicationGroupId" TEXT,
ADD COLUMN "mirrorsApplicationId" TEXT;

-- AddForeignKey
ALTER TABLE "Application" ADD CONSTRAINT "Application_universityId_fkey" FOREIGN KEY ("universityId") REFERENCES "University"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey (self-reference)
ALTER TABLE "Application" ADD CONSTRAINT "Application_mirrorsApplicationId_fkey" FOREIGN KEY ("mirrorsApplicationId") REFERENCES "Application"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- CreateIndex
CREATE INDEX "Application_universityId_idx" ON "Application"("universityId");

CREATE INDEX "Application_applicationGroupId_idx" ON "Application"("applicationGroupId");

CREATE INDEX "Application_mirrorsApplicationId_idx" ON "Application"("mirrorsApplicationId");
