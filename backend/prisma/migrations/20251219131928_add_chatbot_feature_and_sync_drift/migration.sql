-- Sync drift changes

-- AlterTable flashcard_cards: Add image_url column
-- ALTER TABLE "flashcard_cards" ADD COLUMN IF NOT EXISTS "image_url" TEXT;

-- -- AlterTable flashcard_decks: Add flashcard_count column
-- ALTER TABLE "flashcard_decks" ADD COLUMN IF NOT EXISTS "flashcard_count" INTEGER;

-- -- AlterTable user_mcq_progress: Add foreign key on question_id
-- DO $$ BEGIN
--   IF NOT EXISTS (
--     SELECT 1 FROM pg_constraint
--     WHERE conname = 'user_mcq_progress_question_id_fkey'
--   ) THEN
--     ALTER TABLE "user_mcq_progress" ADD CONSTRAINT "user_mcq_progress_question_id_fkey"
--     FOREIGN KEY ("question_id") REFERENCES "mcq_questions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
--   END IF;
-- END $$;

-- -- AlterTable user_sessions: Add unique index on refreshToken
-- DO $$ BEGIN
--   IF NOT EXISTS (
--     SELECT 1 FROM pg_indexes
--     WHERE indexname = 'user_sessions_refreshToken_key'
--   ) THEN
--     CREATE UNIQUE INDEX "user_sessions_refreshToken_key" ON "user_sessions"("refreshToken");
--   END IF;
-- END $$;

-- ============= Chatbot Feature =============

-- CreateTable chatbot_conversations
CREATE TABLE "chatbot_conversations" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "topic" TEXT NOT NULL,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "chatbot_conversations_pkey" PRIMARY KEY ("id")
);

-- CreateTable chatbot_messages
CREATE TABLE "chatbot_messages" (
    "id" SERIAL NOT NULL,
    "conversation_id" INTEGER NOT NULL,
    "sender_type" TEXT NOT NULL,
    "mode_type" TEXT,
    "content" TEXT NOT NULL,
    "credits_used" INTEGER NOT NULL DEFAULT 0,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "chatbot_messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable chatbot_message_sources
CREATE TABLE "chatbot_message_sources" (
    "id" SERIAL NOT NULL,
    "message_id" INTEGER NOT NULL,
    "source_type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "url" TEXT,
    "score" DOUBLE PRECISION,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "chatbot_message_sources_pkey" PRIMARY KEY ("id")
);

-- CreateTable chatbot_message_feedbacks
CREATE TABLE "chatbot_message_feedbacks" (
    "id" SERIAL NOT NULL,
    "message_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "is_helpful" BOOLEAN NOT NULL,
    "feedback" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "chatbot_message_feedbacks_pkey" PRIMARY KEY ("id")
);

-- CreateIndex for chatbot_conversations
CREATE INDEX "chatbot_conversations_user_id_idx" ON "chatbot_conversations"("user_id");
CREATE INDEX "chatbot_conversations_created_at_idx" ON "chatbot_conversations"("created_at");
CREATE INDEX "chatbot_conversations_updated_at_idx" ON "chatbot_conversations"("updated_at");
CREATE INDEX "chatbot_conversations_is_deleted_idx" ON "chatbot_conversations"("is_deleted");
CREATE INDEX "chatbot_conversations_user_id_is_deleted_updated_at_idx" ON "chatbot_conversations"("user_id", "is_deleted", "updated_at");

-- CreateIndex for chatbot_messages
CREATE INDEX "chatbot_messages_conversation_id_idx" ON "chatbot_messages"("conversation_id");
CREATE INDEX "chatbot_messages_sender_type_idx" ON "chatbot_messages"("sender_type");
CREATE INDEX "chatbot_messages_mode_type_idx" ON "chatbot_messages"("mode_type");
CREATE INDEX "chatbot_messages_created_at_idx" ON "chatbot_messages"("created_at");
CREATE INDEX "chatbot_messages_is_deleted_idx" ON "chatbot_messages"("is_deleted");
CREATE INDEX "chatbot_messages_conversation_id_created_at_idx" ON "chatbot_messages"("conversation_id", "created_at");

-- CreateIndex for chatbot_message_sources
CREATE INDEX "chatbot_message_sources_message_id_idx" ON "chatbot_message_sources"("message_id");
CREATE INDEX "chatbot_message_sources_source_type_idx" ON "chatbot_message_sources"("source_type");

-- CreateIndex for chatbot_message_feedbacks
CREATE INDEX "chatbot_message_feedbacks_message_id_idx" ON "chatbot_message_feedbacks"("message_id");
CREATE INDEX "chatbot_message_feedbacks_user_id_idx" ON "chatbot_message_feedbacks"("user_id");
CREATE INDEX "chatbot_message_feedbacks_is_helpful_idx" ON "chatbot_message_feedbacks"("is_helpful");
CREATE UNIQUE INDEX "chatbot_message_feedbacks_message_id_user_id_key" ON "chatbot_message_feedbacks"("message_id", "user_id");

-- AddForeignKey
ALTER TABLE "chatbot_messages" ADD CONSTRAINT "chatbot_messages_conversation_id_fkey" FOREIGN KEY ("conversation_id") REFERENCES "chatbot_conversations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "chatbot_message_sources" ADD CONSTRAINT "chatbot_message_sources_message_id_fkey" FOREIGN KEY ("message_id") REFERENCES "chatbot_messages"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "chatbot_message_feedbacks" ADD CONSTRAINT "chatbot_message_feedbacks_message_id_fkey" FOREIGN KEY ("message_id") REFERENCES "chatbot_messages"("id") ON DELETE CASCADE ON UPDATE CASCADE;
