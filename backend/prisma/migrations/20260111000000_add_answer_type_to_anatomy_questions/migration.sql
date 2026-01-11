-- AlterTable
ALTER TABLE "anatomy_questions" ADD COLUMN IF NOT EXISTS "answer_type" TEXT NOT NULL DEFAULT 'text';
ALTER TABLE "anatomy_questions" ADD COLUMN IF NOT EXISTS "choices" JSONB;
