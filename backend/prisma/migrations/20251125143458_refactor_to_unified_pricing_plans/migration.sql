/*
  Warnings:

  - You are about to drop the `subscription_plans` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user_subscriptions` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "user_subscriptions" DROP CONSTRAINT "user_subscriptions_subscription_plan_id_fkey";

-- DropTable
DROP TABLE "subscription_plans";

-- DropTable
DROP TABLE "user_subscriptions";

-- CreateTable
CREATE TABLE "pricing_plans" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "price" DECIMAL(10,2) NOT NULL,
    "bundle_type" TEXT NOT NULL DEFAULT 'credits',
    "duration_days" INTEGER,
    "credits_included" INTEGER NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "is_popular" BOOLEAN NOT NULL DEFAULT false,
    "discount" INTEGER NOT NULL DEFAULT 0,
    "order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pricing_plans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_purchases" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "pricing_plan_id" INTEGER NOT NULL,
    "bundle_type" TEXT NOT NULL,
    "purchase_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "subscription_start" TIMESTAMP(3),
    "subscription_end" TIMESTAMP(3),
    "subscription_status" TEXT,
    "credits_granted" INTEGER NOT NULL DEFAULT 0,
    "payment_status" TEXT NOT NULL DEFAULT 'completed',
    "payment_method" TEXT,
    "payment_reference" TEXT,
    "amount_paid" DECIMAL(10,2) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_purchases_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "pricing_plans_is_active_idx" ON "pricing_plans"("is_active");

-- CreateIndex
CREATE INDEX "pricing_plans_bundle_type_idx" ON "pricing_plans"("bundle_type");

-- CreateIndex
CREATE INDEX "pricing_plans_order_idx" ON "pricing_plans"("order");

-- CreateIndex
CREATE INDEX "user_purchases_user_id_idx" ON "user_purchases"("user_id");

-- CreateIndex
CREATE INDEX "user_purchases_pricing_plan_id_idx" ON "user_purchases"("pricing_plan_id");

-- CreateIndex
CREATE INDEX "user_purchases_bundle_type_idx" ON "user_purchases"("bundle_type");

-- CreateIndex
CREATE INDEX "user_purchases_subscription_status_idx" ON "user_purchases"("subscription_status");

-- CreateIndex
CREATE INDEX "user_purchases_subscription_end_idx" ON "user_purchases"("subscription_end");

-- AddForeignKey
ALTER TABLE "user_purchases" ADD CONSTRAINT "user_purchases_pricing_plan_id_fkey" FOREIGN KEY ("pricing_plan_id") REFERENCES "pricing_plans"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
