-- CreateEnum
CREATE TYPE "MediaCleanupStatus" AS ENUM ('NOT_REQUIRED', 'PENDING', 'FAILED');

-- AlterEnum
ALTER TYPE "RequestStatus" ADD VALUE 'EXPIRED';

-- AlterTable
ALTER TABLE "RequestMedia" ADD COLUMN     "cleanupAttempts" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "cleanupLastError" TEXT,
ADD COLUMN     "cleanupRetryAt" TIMESTAMP(3),
ADD COLUMN     "cleanupStatus" "MediaCleanupStatus" NOT NULL DEFAULT 'NOT_REQUIRED';

-- CreateIndex
CREATE INDEX "RequestMedia_cleanupStatus_cleanupRetryAt_idx" ON "RequestMedia"("cleanupStatus", "cleanupRetryAt");
