-- This migration syncs the migration history with the current database state
-- These changes were already applied directly to the database

-- CreateTable
CREATE TABLE "user_card_progress" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "card_id" INTEGER NOT NULL,
    "times_correct" INTEGER NOT NULL DEFAULT 0,
    "times_incorrect" INTEGER NOT NULL DEFAULT 0,
    "last_reviewed" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_card_progress_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "user_card_progress_user_id_idx" ON "user_card_progress"("user_id");

-- CreateIndex
CREATE INDEX "user_card_progress_card_id_idx" ON "user_card_progress"("card_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_card_progress_user_id_card_id_key" ON "user_card_progress"("user_id", "card_id");

-- AlterTable
ALTER TABLE "flashcard_session_answers" ADD COLUMN "is_correct" BOOLEAN;
ALTER TABLE "flashcard_session_answers" ADD COLUMN "similarity_score" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "flashcard_session_cards" ADD COLUMN "original_card_id" INTEGER;

-- CreateIndex
CREATE INDEX "flashcard_session_cards_original_card_id_idx" ON "flashcard_session_cards"("original_card_id");
