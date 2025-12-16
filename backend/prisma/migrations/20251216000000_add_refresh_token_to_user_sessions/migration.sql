-- AlterTable
ALTER TABLE "user_sessions" ADD COLUMN IF NOT EXISTS "refreshToken" TEXT,
ADD COLUMN IF NOT EXISTS "refreshTokenExpiresAt" TIMESTAMP(3);

-- CreateIndex
CREATE INDEX IF NOT EXISTS "user_sessions_refreshToken_idx" ON "user_sessions"("refreshToken");
