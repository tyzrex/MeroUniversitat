-- CreateEnum
CREATE TYPE "UniversityVerificationStatus" AS ENUM ('APPROVED', 'PENDING', 'REJECTED');

-- DropIndex
DROP INDEX "Application_applicationGroupId_idx";

-- DropIndex
DROP INDEX "Application_mirrorsApplicationId_idx";

-- DropIndex
DROP INDEX "Application_universityId_idx";

-- AlterTable
ALTER TABLE "University" ADD COLUMN     "requestNotes" TEXT,
ADD COLUMN     "requestProgramUrl" TEXT,
ADD COLUMN     "requestedAt" TIMESTAMP(3),
ADD COLUMN     "requestedById" TEXT,
ADD COLUMN     "reviewedAt" TIMESTAMP(3),
ADD COLUMN     "reviewedById" TEXT,
ADD COLUMN     "verificationStatus" "UniversityVerificationStatus" NOT NULL DEFAULT 'APPROVED';

-- AddForeignKey
ALTER TABLE "University" ADD CONSTRAINT "University_requestedById_fkey" FOREIGN KEY ("requestedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "University" ADD CONSTRAINT "University_reviewedById_fkey" FOREIGN KEY ("reviewedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
