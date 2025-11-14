/*
  Warnings:

  - You are about to drop the column `question_snapshot` on the `exercise_session_answers` table. All the data in the column will be lost.
  - Added the required column `exercise_session_question_id` to the `exercise_session_answers` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "exercise_sessions" DROP CONSTRAINT "exercise_sessions_exercise_topic_id_fkey";

-- AlterTable
ALTER TABLE "exercise_session_answers" DROP COLUMN "question_snapshot",
ADD COLUMN     "exercise_session_question_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "exercise_sessions" ALTER COLUMN "exercise_topic_id" DROP NOT NULL,
ALTER COLUMN "topic_snapshot" DROP NOT NULL,
ALTER COLUMN "credits_used" SET DEFAULT 0,
ALTER COLUMN "status" SET DEFAULT 'not_started',
ALTER COLUMN "total_questions" SET DEFAULT 0;

-- AlterTable
ALTER TABLE "user_learning_sessions" ADD COLUMN     "type" TEXT NOT NULL DEFAULT 'exercise';

-- CreateTable
CREATE TABLE "exercise_session_questions" (
    "id" SERIAL NOT NULL,
    "exercise_session_id" INTEGER NOT NULL,
    "question_id" INTEGER NOT NULL,
    "question_text" TEXT NOT NULL,
    "answer_text" TEXT NOT NULL,
    "explanation" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "exercise_session_questions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "exercise_session_questions_exercise_session_id_idx" ON "exercise_session_questions"("exercise_session_id");

-- CreateIndex
CREATE INDEX "exercise_session_questions_order_idx" ON "exercise_session_questions"("order");

-- CreateIndex
CREATE INDEX "exercise_session_answers_exercise_session_question_id_idx" ON "exercise_session_answers"("exercise_session_question_id");

-- CreateIndex
CREATE INDEX "user_learning_sessions_type_idx" ON "user_learning_sessions"("type");

-- AddForeignKey
ALTER TABLE "exercise_session_answers" ADD CONSTRAINT "exercise_session_answers_exercise_session_question_id_fkey" FOREIGN KEY ("exercise_session_question_id") REFERENCES "exercise_session_questions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exercise_sessions" ADD CONSTRAINT "exercise_sessions_exercise_topic_id_fkey" FOREIGN KEY ("exercise_topic_id") REFERENCES "exercise_topics"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exercise_session_questions" ADD CONSTRAINT "exercise_session_questions_exercise_session_id_fkey" FOREIGN KEY ("exercise_session_id") REFERENCES "exercise_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
