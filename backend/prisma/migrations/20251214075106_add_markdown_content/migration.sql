/*
  Warnings:

  - You are about to drop the column `explanation` on the `exercise_questions` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "exercise_questions" DROP COLUMN "explanation";

-- AlterTable
ALTER TABLE "summary_notes" ADD COLUMN     "markdown_content" TEXT;

-- CreateTable
CREATE TABLE "attachments" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "recordType" TEXT NOT NULL,
    "recordId" INTEGER NOT NULL,
    "blobId" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "attachments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "blobs" (
    "id" SERIAL NOT NULL,
    "key" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "metadata" TEXT NOT NULL,
    "contentType" TEXT NOT NULL,
    "byteSize" INTEGER NOT NULL,
    "checksum" TEXT NOT NULL,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "blobs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "attachments_recordType_recordId_name_idx" ON "attachments"("recordType", "recordId", "name");

-- CreateIndex
CREATE INDEX "attachments_blobId_idx" ON "attachments"("blobId");

-- CreateIndex
CREATE INDEX "blobs_key_idx" ON "blobs"("key");
