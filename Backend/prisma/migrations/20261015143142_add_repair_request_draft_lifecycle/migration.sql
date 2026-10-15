-- AlterEnum
ALTER TYPE "RequestStatus" ADD VALUE 'DRAFT';

-- AlterTable
ALTER TABLE "RepairRequest" ADD COLUMN     "biddingDeadline" TIMESTAMP(3),
ADD COLUMN     "biddingDurationMinutes" INTEGER,
ADD COLUMN     "detailedAddress" TEXT,
ADD COLUMN     "lastActivityAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "serviceArea" TEXT,
ADD COLUMN     "submittedAt" TIMESTAMP(3),
ALTER COLUMN "status" SET DEFAULT 'DRAFT';

-- AlterTable
ALTER TABLE "RequestMedia" ADD COLUMN     "publicId" TEXT;

-- CreateIndex
CREATE INDEX "RepairRequest_status_lastActivityAt_idx" ON "RepairRequest"("status", "lastActivityAt");

-- CreateIndex
CREATE INDEX "RepairRequest_status_biddingDeadline_idx" ON "RepairRequest"("status", "biddingDeadline");
