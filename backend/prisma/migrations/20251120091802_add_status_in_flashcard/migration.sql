-- AlterTable - Add status column to flashcard_session_attempts
ALTER TABLE "flashcard_session_attempts" ADD COLUMN IF NOT EXISTS "status" TEXT NOT NULL DEFAULT 'not_started';

-- AlterTable - Make started_at nullable (if not already)
ALTER TABLE "flashcard_session_attempts" ALTER COLUMN "started_at" DROP DEFAULT;
ALTER TABLE "flashcard_session_attempts" ALTER COLUMN "started_at" DROP NOT NULL;

-- Update existing records to set correct status based on timestamps
UPDATE "flashcard_session_attempts"
SET "status" = CASE
    WHEN "completed_at" IS NOT NULL THEN 'completed'
    WHEN "started_at" IS NOT NULL THEN 'active'
    ELSE 'not_started'
END
WHERE "status" = 'not_started';

-- CreateIndex - Create index on status column (if not exists)
CREATE INDEX IF NOT EXISTS "flashcard_session_attempts_status_idx" ON "flashcard_session_attempts"("status");
