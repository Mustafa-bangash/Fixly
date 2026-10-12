/*
  Warnings:

  - A unique constraint covering the columns `[providerId,categoryId]` on the table `ProviderSkill` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "OtpChannel" AS ENUM ('EMAIL', 'SMS');

-- CreateEnum
CREATE TYPE "OtpPurpose" AS ENUM ('ACCOUNT_VERIFICATION', 'PASSWORD_RESET');

-- AlterTable
ALTER TABLE "Job" ADD COLUMN     "followUpResolved" BOOLEAN,
ADD COLUMN     "followUpSentAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "ProviderProfile" ADD COLUMN     "baseLatitude" DOUBLE PRECISION,
ADD COLUMN     "baseLongitude" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "ServiceCategory" ADD COLUMN     "defaultReminderIntervalMonths" INTEGER,
ADD COLUMN     "peakSeasonStartMonth" INTEGER;

-- CreateTable
CREATE TABLE "OtpCode" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "codeHash" TEXT NOT NULL,
    "channel" "OtpChannel" NOT NULL,
    "purpose" "OtpPurpose" NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "isUsed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OtpCode_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RequestBroadcast" (
    "id" TEXT NOT NULL,
    "requestId" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "notifiedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "respondedAt" TIMESTAMP(3),

    CONSTRAINT "RequestBroadcast_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "OtpCode_userId_purpose_idx" ON "OtpCode"("userId", "purpose");

-- CreateIndex
CREATE INDEX "RequestBroadcast_providerId_idx" ON "RequestBroadcast"("providerId");

-- CreateIndex
CREATE UNIQUE INDEX "RequestBroadcast_requestId_providerId_key" ON "RequestBroadcast"("requestId", "providerId");

-- CreateIndex
CREATE INDEX "Bid_requestId_idx" ON "Bid"("requestId");

-- CreateIndex
CREATE INDEX "Bid_providerId_idx" ON "Bid"("providerId");

-- CreateIndex
CREATE INDEX "Job_customerId_idx" ON "Job"("customerId");

-- CreateIndex
CREATE INDEX "Job_providerId_idx" ON "Job"("providerId");

-- CreateIndex
CREATE INDEX "Job_status_idx" ON "Job"("status");

-- CreateIndex
CREATE INDEX "Message_jobId_sentAt_idx" ON "Message"("jobId", "sentAt");

-- CreateIndex
CREATE INDEX "Notification_userId_isRead_idx" ON "Notification"("userId", "isRead");

-- CreateIndex
CREATE INDEX "ProviderLocationPing_jobId_recordedAt_idx" ON "ProviderLocationPing"("jobId", "recordedAt");

-- CreateIndex
CREATE UNIQUE INDEX "ProviderSkill_providerId_categoryId_key" ON "ProviderSkill"("providerId", "categoryId");

-- CreateIndex
CREATE INDEX "RepairRequest_status_categoryId_idx" ON "RepairRequest"("status", "categoryId");

-- CreateIndex
CREATE INDEX "RepairRequest_customerId_idx" ON "RepairRequest"("customerId");

-- AddForeignKey
ALTER TABLE "OtpCode" ADD CONSTRAINT "OtpCode_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RequestBroadcast" ADD CONSTRAINT "RequestBroadcast_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "RepairRequest"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RequestBroadcast" ADD CONSTRAINT "RequestBroadcast_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "ProviderProfile"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;
