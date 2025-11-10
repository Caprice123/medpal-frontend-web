-- CreateTable
CREATE TABLE "tags" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "exercise_topics" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "content_type" TEXT NOT NULL,
    "content" TEXT,
    "pdf_url" TEXT,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_by" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "exercise_topics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "exercise_topic_tags" (
    "id" SERIAL NOT NULL,
    "topic_id" INTEGER NOT NULL,
    "tag_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "exercise_topic_tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "exercise_questions" (
    "id" SERIAL NOT NULL,
    "topic_id" INTEGER NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "explanation" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "exercise_questions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "tags_type_idx" ON "tags"("type");

-- CreateIndex
CREATE INDEX "tags_is_active_idx" ON "tags"("is_active");

-- CreateIndex
CREATE UNIQUE INDEX "tags_name_type_key" ON "tags"("name", "type");

-- CreateIndex
CREATE INDEX "exercise_topics_is_active_idx" ON "exercise_topics"("is_active");

-- CreateIndex
CREATE INDEX "exercise_topics_created_by_idx" ON "exercise_topics"("created_by");

-- CreateIndex
CREATE INDEX "exercise_topics_status_idx" ON "exercise_topics"("status");

-- CreateIndex
CREATE INDEX "exercise_topic_tags_topic_id_idx" ON "exercise_topic_tags"("topic_id");

-- CreateIndex
CREATE INDEX "exercise_topic_tags_tag_id_idx" ON "exercise_topic_tags"("tag_id");

-- CreateIndex
CREATE UNIQUE INDEX "exercise_topic_tags_topic_id_tag_id_key" ON "exercise_topic_tags"("topic_id", "tag_id");

-- CreateIndex
CREATE INDEX "exercise_questions_topic_id_idx" ON "exercise_questions"("topic_id");

-- CreateIndex
CREATE INDEX "exercise_questions_order_idx" ON "exercise_questions"("order");

-- AddForeignKey
ALTER TABLE "exercise_topic_tags" ADD CONSTRAINT "exercise_topic_tags_topic_id_fkey" FOREIGN KEY ("topic_id") REFERENCES "exercise_topics"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exercise_topic_tags" ADD CONSTRAINT "exercise_topic_tags_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exercise_questions" ADD CONSTRAINT "exercise_questions_topic_id_fkey" FOREIGN KEY ("topic_id") REFERENCES "exercise_topics"("id") ON DELETE CASCADE ON UPDATE CASCADE;
