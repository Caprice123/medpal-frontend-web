-- Add status column to user_subscriptions table
-- Default to 'active' for backward compatibility with existing subscriptions

-- Step 1: Add status column with default value 'active'
ALTER TABLE user_subscriptions
ADD COLUMN status VARCHAR(20) NOT NULL DEFAULT 'active';

-- Step 2: Create index on status for efficient queries
CREATE INDEX user_subscriptions_status_idx ON user_subscriptions(status);

-- Step 3: Add comment for documentation
COMMENT ON COLUMN user_subscriptions.status IS 'Subscription status: active, not_active, expired';
