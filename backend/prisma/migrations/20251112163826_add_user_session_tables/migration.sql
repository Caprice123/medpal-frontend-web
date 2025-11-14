-- CreateTable
CREATE TABLE "user_learning_sessions" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "started_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ended_at" TIMESTAMP(3),
    "status" TEXT NOT NULL DEFAULT 'active',

    CONSTRAINT "user_learning_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "exercise_sessions" (
    "id" SERIAL NOT NULL,
    "user_learning_session_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "exercise_topic_id" INTEGER NOT NULL,
    "topic_snapshot" TEXT NOT NULL,
    "credits_used" INTEGER NOT NULL,
    "started_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completed_at" TIMESTAMP(3),
    "status" TEXT NOT NULL DEFAULT 'active',
    "score" INTEGER NOT NULL DEFAULT 0,
    "total_questions" INTEGER NOT NULL,

    CONSTRAINT "exercise_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "exercise_session_answers" (
    "id" SERIAL NOT NULL,
    "exercise_session_id" INTEGER NOT NULL,
    "question_snapshot" TEXT NOT NULL,
    "user_answer" TEXT NOT NULL,
    "is_correct" BOOLEAN NOT NULL,
    "answered_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "time_taken_seconds" INTEGER,

    CONSTRAINT "exercise_session_answers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "user_learning_sessions_user_id_idx" ON "user_learning_sessions"("user_id");

-- CreateIndex
CREATE INDEX "user_learning_sessions_status_idx" ON "user_learning_sessions"("status");

-- CreateIndex
CREATE INDEX "user_learning_sessions_started_at_idx" ON "user_learning_sessions"("started_at");

-- CreateIndex
CREATE INDEX "exercise_sessions_user_learning_session_id_idx" ON "exercise_sessions"("user_learning_session_id");

-- CreateIndex
CREATE INDEX "exercise_sessions_user_id_idx" ON "exercise_sessions"("user_id");

-- CreateIndex
CREATE INDEX "exercise_sessions_exercise_topic_id_idx" ON "exercise_sessions"("exercise_topic_id");

-- CreateIndex
CREATE INDEX "exercise_sessions_status_idx" ON "exercise_sessions"("status");

-- CreateIndex
CREATE INDEX "exercise_sessions_started_at_idx" ON "exercise_sessions"("started_at");

-- CreateIndex
CREATE INDEX "exercise_session_answers_exercise_session_id_idx" ON "exercise_session_answers"("exercise_session_id");

-- CreateIndex
CREATE INDEX "exercise_session_answers_answered_at_idx" ON "exercise_session_answers"("answered_at");

-- AddForeignKey
ALTER TABLE "exercise_sessions" ADD CONSTRAINT "exercise_sessions_user_learning_session_id_fkey" FOREIGN KEY ("user_learning_session_id") REFERENCES "user_learning_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exercise_sessions" ADD CONSTRAINT "exercise_sessions_exercise_topic_id_fkey" FOREIGN KEY ("exercise_topic_id") REFERENCES "exercise_topics"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exercise_session_answers" ADD CONSTRAINT "exercise_session_answers_exercise_session_id_fkey" FOREIGN KEY ("exercise_session_id") REFERENCES "exercise_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
