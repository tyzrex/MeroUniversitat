-- CreateEnum
CREATE TYPE "EnglishTestType" AS ENUM ('NONE', 'IELTS', 'TOEFL_IBT', 'PTE_ACADEMIC', 'DUOLINGO_ENGLISH', 'CAMBRIDGE_ENGLISH', 'OTHER');

-- AlterTable Profile
ALTER TABLE "Profile" ADD COLUMN "englishTestType" "EnglishTestType" NOT NULL DEFAULT 'NONE';
ALTER TABLE "Profile" ADD COLUMN "englishTestScore" TEXT;

UPDATE "Profile"
SET
    "englishTestType" = 'IELTS',
    "englishTestScore" = TRIM(TRAILING '0' FROM TRIM(TRAILING '.' FROM CAST("ieltsScore" AS TEXT)))
WHERE "ieltsScore" IS NOT NULL;

ALTER TABLE "Profile" DROP COLUMN "ieltsScore";

-- AlterTable AcceptanceRecord
ALTER TABLE "AcceptanceRecord" ADD COLUMN "contributorName" TEXT;
ALTER TABLE "AcceptanceRecord" ADD COLUMN "programNameSnapshot" TEXT;
ALTER TABLE "AcceptanceRecord" ADD COLUMN "englishTestType" "EnglishTestType" NOT NULL DEFAULT 'NONE';
ALTER TABLE "AcceptanceRecord" ADD COLUMN "englishTestScore" TEXT;

UPDATE "AcceptanceRecord"
SET
    "englishTestType" = 'IELTS',
    "englishTestScore" = TRIM(TRAILING '0' FROM TRIM(TRAILING '.' FROM CAST("ieltsScore" AS TEXT)))
WHERE "ieltsScore" IS NOT NULL;

ALTER TABLE "AcceptanceRecord" DROP COLUMN "ieltsScore";

ALTER TABLE "AcceptanceRecord" DROP CONSTRAINT "AcceptanceRecord_userId_fkey";

ALTER TABLE "AcceptanceRecord" ALTER COLUMN "userId" DROP NOT NULL;

ALTER TABLE "AcceptanceRecord" ADD CONSTRAINT "AcceptanceRecord_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
