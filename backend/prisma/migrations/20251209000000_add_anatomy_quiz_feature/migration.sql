-- CreateTable
CREATE TABLE IF NOT EXISTS "anatomy_quizzes" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "image_url" TEXT NOT NULL,
    "image_key" TEXT NOT NULL,
    "image_filename" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_by" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "anatomy_quizzes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "anatomy_questions" (
    "id" SERIAL NOT NULL,
    "quiz_id" INTEGER NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "anatomy_questions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "anatomy_quiz_tags" (
    "id" SERIAL NOT NULL,
    "quiz_id" INTEGER NOT NULL,
    "tag_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "anatomy_quiz_tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "anatomy_quiz_attempts" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "quiz_id" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'in_progress',
    "correct_count" INTEGER NOT NULL DEFAULT 0,
    "total_questions" INTEGER NOT NULL,
    "score" INTEGER NOT NULL DEFAULT 0,
    "started_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "anatomy_quiz_attempts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "anatomy_quiz_answers" (
    "id" SERIAL NOT NULL,
    "attempt_id" INTEGER NOT NULL,
    "question_id" INTEGER NOT NULL,
    "user_answer" TEXT NOT NULL,
    "is_correct" BOOLEAN NOT NULL,
    "similarity_score" DOUBLE PRECISION,
    "answered_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "anatomy_quiz_answers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "user_anatomy_progress" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "question_id" INTEGER NOT NULL,
    "quiz_id" INTEGER NOT NULL,
    "times_correct" INTEGER NOT NULL DEFAULT 0,
    "times_incorrect" INTEGER NOT NULL DEFAULT 0,
    "last_reviewed" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_anatomy_progress_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX IF NOT EXISTS "anatomy_quizzes_created_by_idx" ON "anatomy_quizzes"("created_by");
CREATE INDEX IF NOT EXISTS "anatomy_quizzes_is_active_idx" ON "anatomy_quizzes"("is_active");
CREATE INDEX IF NOT EXISTS "anatomy_quizzes_status_idx" ON "anatomy_quizzes"("status");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "anatomy_questions_quiz_id_idx" ON "anatomy_questions"("quiz_id");
CREATE INDEX IF NOT EXISTS "anatomy_questions_order_idx" ON "anatomy_questions"("order");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "anatomy_quiz_tags_quiz_id_idx" ON "anatomy_quiz_tags"("quiz_id");
CREATE INDEX IF NOT EXISTS "anatomy_quiz_tags_tag_id_idx" ON "anatomy_quiz_tags"("tag_id");
CREATE UNIQUE INDEX IF NOT EXISTS "anatomy_quiz_tags_quiz_id_tag_id_key" ON "anatomy_quiz_tags"("quiz_id", "tag_id");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "anatomy_quiz_attempts_user_id_idx" ON "anatomy_quiz_attempts"("user_id");
CREATE INDEX IF NOT EXISTS "anatomy_quiz_attempts_quiz_id_idx" ON "anatomy_quiz_attempts"("quiz_id");
CREATE INDEX IF NOT EXISTS "anatomy_quiz_attempts_status_idx" ON "anatomy_quiz_attempts"("status");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "anatomy_quiz_answers_attempt_id_idx" ON "anatomy_quiz_answers"("attempt_id");
CREATE INDEX IF NOT EXISTS "anatomy_quiz_answers_question_id_idx" ON "anatomy_quiz_answers"("question_id");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "user_anatomy_progress_user_id_idx" ON "user_anatomy_progress"("user_id");
CREATE INDEX IF NOT EXISTS "user_anatomy_progress_question_id_idx" ON "user_anatomy_progress"("question_id");
CREATE INDEX IF NOT EXISTS "user_anatomy_progress_quiz_id_idx" ON "user_anatomy_progress"("quiz_id");
CREATE UNIQUE INDEX IF NOT EXISTS "user_anatomy_progress_user_id_question_id_key" ON "user_anatomy_progress"("user_id", "question_id");

-- AddForeignKey
DO $$ BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints
        WHERE constraint_name = 'anatomy_questions_quiz_id_fkey'
    ) THEN
        ALTER TABLE "anatomy_questions" ADD CONSTRAINT "anatomy_questions_quiz_id_fkey"
        FOREIGN KEY ("quiz_id") REFERENCES "anatomy_quizzes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;

-- AddForeignKey
DO $$ BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints
        WHERE constraint_name = 'anatomy_quiz_tags_quiz_id_fkey'
    ) THEN
        ALTER TABLE "anatomy_quiz_tags" ADD CONSTRAINT "anatomy_quiz_tags_quiz_id_fkey"
        FOREIGN KEY ("quiz_id") REFERENCES "anatomy_quizzes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;

-- AddForeignKey
DO $$ BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints
        WHERE constraint_name = 'anatomy_quiz_tags_tag_id_fkey'
    ) THEN
        ALTER TABLE "anatomy_quiz_tags" ADD CONSTRAINT "anatomy_quiz_tags_tag_id_fkey"
        FOREIGN KEY ("tag_id") REFERENCES "tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;

-- AddForeignKey
DO $$ BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints
        WHERE constraint_name = 'anatomy_quiz_attempts_quiz_id_fkey'
    ) THEN
        ALTER TABLE "anatomy_quiz_attempts" ADD CONSTRAINT "anatomy_quiz_attempts_quiz_id_fkey"
        FOREIGN KEY ("quiz_id") REFERENCES "anatomy_quizzes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;

-- AddForeignKey
DO $$ BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints
        WHERE constraint_name = 'anatomy_quiz_answers_attempt_id_fkey'
    ) THEN
        ALTER TABLE "anatomy_quiz_answers" ADD CONSTRAINT "anatomy_quiz_answers_attempt_id_fkey"
        FOREIGN KEY ("attempt_id") REFERENCES "anatomy_quiz_attempts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;

-- AddForeignKey
DO $$ BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints
        WHERE constraint_name = 'anatomy_quiz_answers_question_id_fkey'
    ) THEN
        ALTER TABLE "anatomy_quiz_answers" ADD CONSTRAINT "anatomy_quiz_answers_question_id_fkey"
        FOREIGN KEY ("question_id") REFERENCES "anatomy_questions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;

-- Drop explanation column if it exists (schema update)
DO $$ BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'anatomy_questions'
        AND column_name = 'explanation'
    ) THEN
        ALTER TABLE "anatomy_questions" DROP COLUMN "explanation";
    END IF;
END $$;
