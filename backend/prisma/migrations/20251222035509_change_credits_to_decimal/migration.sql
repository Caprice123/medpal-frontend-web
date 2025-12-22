-- AlterTable: Change user_credits.balance from Int to Decimal(10,2)
ALTER TABLE "user_credits" ALTER COLUMN "balance" TYPE DECIMAL(10,2);

-- AlterTable: Change credit_transactions amount fields from Int to Decimal(10,2)
ALTER TABLE "credit_transactions" ALTER COLUMN "amount" TYPE DECIMAL(10,2);
ALTER TABLE "credit_transactions" ALTER COLUMN "balanceBefore" TYPE DECIMAL(10,2);
ALTER TABLE "credit_transactions" ALTER COLUMN "balanceAfter" TYPE DECIMAL(10,2);
