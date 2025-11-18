-- CreateTable
CREATE TABLE "flashcard_decks" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "content_type" TEXT NOT NULL,
    "content" TEXT,
    "pdf_url" TEXT,
    "pdf_key" TEXT,
    "pdf_filename" TEXT,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_by" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "flashcard_decks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "flashcard_cards" (
    "id" SERIAL NOT NULL,
    "deck_id" INTEGER NOT NULL,
    "front" TEXT NOT NULL,
    "back" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "flashcard_cards_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "flashcard_deck_tags" (
    "id" SERIAL NOT NULL,
    "deck_id" INTEGER NOT NULL,
    "tag_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "flashcard_deck_tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "flashcard_sessions" (
    "id" SERIAL NOT NULL,
    "user_learning_session_id" INTEGER NOT NULL,
    "flashcard_deck_id" INTEGER,
    "total_cards" INTEGER NOT NULL,
    "credits_used" INTEGER NOT NULL DEFAULT 0,
    "number_of_attempts" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "flashcard_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "flashcard_session_cards" (
    "id" SERIAL NOT NULL,
    "flashcard_session_id" INTEGER NOT NULL,
    "front_text" TEXT NOT NULL,
    "back_text" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "flashcard_session_cards_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "flashcard_session_attempts" (
    "id" SERIAL NOT NULL,
    "flashcard_session_id" INTEGER NOT NULL,
    "attempt_number" INTEGER NOT NULL DEFAULT 1,
    "started_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "flashcard_session_attempts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "flashcard_session_answers" (
    "id" SERIAL NOT NULL,
    "flashcard_session_attempt_id" INTEGER NOT NULL,
    "flashcard_session_card_id" INTEGER NOT NULL,
    "user_answer" TEXT NOT NULL,
    "time_taken_seconds" INTEGER,
    "answered_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "flashcard_session_answers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "flashcard_decks_created_by_idx" ON "flashcard_decks"("created_by");

-- CreateIndex
CREATE INDEX "flashcard_decks_is_active_idx" ON "flashcard_decks"("is_active");

-- CreateIndex
CREATE INDEX "flashcard_decks_status_idx" ON "flashcard_decks"("status");

-- CreateIndex
CREATE INDEX "flashcard_cards_deck_id_idx" ON "flashcard_cards"("deck_id");

-- CreateIndex
CREATE INDEX "flashcard_cards_order_idx" ON "flashcard_cards"("order");

-- CreateIndex
CREATE INDEX "flashcard_deck_tags_deck_id_idx" ON "flashcard_deck_tags"("deck_id");

-- CreateIndex
CREATE INDEX "flashcard_deck_tags_tag_id_idx" ON "flashcard_deck_tags"("tag_id");

-- CreateIndex
CREATE UNIQUE INDEX "flashcard_deck_tags_deck_id_tag_id_key" ON "flashcard_deck_tags"("deck_id", "tag_id");

-- CreateIndex
CREATE UNIQUE INDEX "flashcard_sessions_user_learning_session_id_key" ON "flashcard_sessions"("user_learning_session_id");

-- CreateIndex
CREATE INDEX "flashcard_sessions_user_learning_session_id_idx" ON "flashcard_sessions"("user_learning_session_id");

-- CreateIndex
CREATE INDEX "flashcard_sessions_flashcard_deck_id_idx" ON "flashcard_sessions"("flashcard_deck_id");

-- CreateIndex
CREATE INDEX "flashcard_session_cards_flashcard_session_id_idx" ON "flashcard_session_cards"("flashcard_session_id");

-- CreateIndex
CREATE INDEX "flashcard_session_cards_order_idx" ON "flashcard_session_cards"("order");

-- CreateIndex
CREATE INDEX "flashcard_session_attempts_flashcard_session_id_idx" ON "flashcard_session_attempts"("flashcard_session_id");

-- CreateIndex
CREATE INDEX "flashcard_session_attempts_started_at_idx" ON "flashcard_session_attempts"("started_at");

-- CreateIndex
CREATE INDEX "flashcard_session_answers_flashcard_session_attempt_id_idx" ON "flashcard_session_answers"("flashcard_session_attempt_id");

-- CreateIndex
CREATE INDEX "flashcard_session_answers_flashcard_session_card_id_idx" ON "flashcard_session_answers"("flashcard_session_card_id");

-- CreateIndex
CREATE INDEX "flashcard_session_answers_answered_at_idx" ON "flashcard_session_answers"("answered_at");

-- AddForeignKey
ALTER TABLE "flashcard_cards" ADD CONSTRAINT "flashcard_cards_deck_id_fkey" FOREIGN KEY ("deck_id") REFERENCES "flashcard_decks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "flashcard_deck_tags" ADD CONSTRAINT "flashcard_deck_tags_deck_id_fkey" FOREIGN KEY ("deck_id") REFERENCES "flashcard_decks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "flashcard_deck_tags" ADD CONSTRAINT "flashcard_deck_tags_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "flashcard_sessions" ADD CONSTRAINT "flashcard_sessions_user_learning_session_id_fkey" FOREIGN KEY ("user_learning_session_id") REFERENCES "user_learning_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "flashcard_sessions" ADD CONSTRAINT "flashcard_sessions_flashcard_deck_id_fkey" FOREIGN KEY ("flashcard_deck_id") REFERENCES "flashcard_decks"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "flashcard_session_cards" ADD CONSTRAINT "flashcard_session_cards_flashcard_session_id_fkey" FOREIGN KEY ("flashcard_session_id") REFERENCES "flashcard_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "flashcard_session_attempts" ADD CONSTRAINT "flashcard_session_attempts_flashcard_session_id_fkey" FOREIGN KEY ("flashcard_session_id") REFERENCES "flashcard_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "flashcard_session_answers" ADD CONSTRAINT "flashcard_session_answers_flashcard_session_attempt_id_fkey" FOREIGN KEY ("flashcard_session_attempt_id") REFERENCES "flashcard_session_attempts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "flashcard_session_answers" ADD CONSTRAINT "flashcard_session_answers_flashcard_session_card_id_fkey" FOREIGN KEY ("flashcard_session_card_id") REFERENCES "flashcard_session_cards"("id") ON DELETE CASCADE ON UPDATE CASCADE;
