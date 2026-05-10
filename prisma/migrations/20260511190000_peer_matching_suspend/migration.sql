-- AlterTable
ALTER TABLE "Profile" ADD COLUMN "peerMatchingOptIn" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "User" ADD COLUMN "suspendedAt" TIMESTAMP(3);
