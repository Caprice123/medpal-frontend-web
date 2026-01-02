-- Migration: Restructure user_purchases and user_subscriptions
-- This migration properly separates concerns between purchase records and subscription records

-- Step 1: Migrate existing subscription data from user_purchases to user_subscriptions
INSERT INTO user_subscriptions (user_id, start_date, end_date, created_at, updated_at)
SELECT
  user_id,
  subscription_start,
  subscription_end,
  created_at,
  updated_at
FROM user_purchases
WHERE subscription_start IS NOT NULL
  AND subscription_end IS NOT NULL
  AND bundle_type IN ('subscription', 'hybrid')
  AND payment_status = 'completed';

-- Step 2: Remove subscription-related columns from user_purchases
ALTER TABLE user_purchases DROP COLUMN IF EXISTS subscription_start;
ALTER TABLE user_purchases DROP COLUMN IF EXISTS subscription_end;
ALTER TABLE user_purchases DROP COLUMN IF EXISTS subscription_status;

-- Step 3: Remove credits_granted column (this should only be in credit_transactions ledger)
ALTER TABLE user_purchases DROP COLUMN IF EXISTS credits_granted;

-- Note: The purchase_date column can be used to track when the purchase was made
-- The payment_status tracks if the payment was completed
-- Subscription dates are now properly in user_subscriptions table
-- Credits granted are tracked in credit_transactions table
