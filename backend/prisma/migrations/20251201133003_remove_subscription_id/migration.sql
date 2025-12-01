/*
  Warnings:

  - You are about to drop the column `subscription_id` on the `user_subscriptions` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "user_subscriptions_user_id_subscription_id_idx";

-- AlterTable
ALTER TABLE "user_subscriptions" DROP COLUMN "subscription_id";
