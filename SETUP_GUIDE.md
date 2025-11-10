# Credit System Setup Guide

## Quick Start

### 1. Install Dependencies

```bash
# Backend
cd backend
npm install

# Frontend
cd frontend-web
npm install
```

### 2. Configure Environment Variables

#### Backend `.env`
Copy `.env.example` to `.env` and configure:

```bash
cd backend
cp .env.example .env
```

Then edit `.env` and add:
```env
# Your PostgreSQL database
DATABASE_URL="postgresql://user:password@host:port/database?schema=public"

# Xendit credentials (get from https://dashboard.xendit.co)
XENDIT_SECRET_KEY=xnd_development_your_key_here
XENDIT_WEBHOOK_TOKEN=your_webhook_token_here

# Frontend URL for payment redirects
FRONTEND_URL=http://localhost:3000

# Other configs...
JWT_SECRET=your_secret
GOOGLE_CLIENT_ID=your_google_client_id
```

#### Frontend `.env`
```env
VITE_API_BASE_URL=http://localhost:5000
```

### 3. Generate Database Migration

The Prisma schema has been updated with the credit system tables. To apply these changes to your database:

```bash
cd backend

# Option 1: Generate migration and apply it
npm run db:migrate:dev -- --name add_credit_system

# This will:
# 1. Create a new migration file in prisma/migrations/
# 2. Apply the migration to your database
# 3. Regenerate Prisma Client
```

If you encounter SSL/TLS errors with your database connection, you have two options:

**Option A: Disable SSL in connection string (development only)**
```env
DATABASE_URL="postgresql://user:password@host:port/database?schema=public&sslmode=disable"
```

**Option B: Use existing schema and just regenerate client**
```bash
# If migration fails, just generate the Prisma client
npm run db:generate
```

### 4. Manual Migration (Alternative)

If `db:migrate:dev` fails, you can create the tables manually by running this SQL:

```sql
-- Create credit_plans table
CREATE TABLE credit_plans (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  credits INTEGER NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  is_popular BOOLEAN DEFAULT false,
  discount INTEGER DEFAULT 0,
  "order" INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create credit_transactions table
CREATE TABLE credit_transactions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  user_credit_id INTEGER NOT NULL,
  type TEXT NOT NULL,
  amount INTEGER NOT NULL,
  balance_before INTEGER NOT NULL,
  balance_after INTEGER NOT NULL,
  description TEXT,
  credit_plan_id INTEGER,
  session_id INTEGER,
  payment_status TEXT,
  payment_method TEXT,
  payment_reference TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_credit_id) REFERENCES user_credits(id),
  FOREIGN KEY (credit_plan_id) REFERENCES credit_plans(id)
);

-- Add relation to user_credits if needed
-- (The user_credits table should already exist from previous migrations)

-- Create indexes
CREATE INDEX idx_credit_transactions_user_id ON credit_transactions(user_id);
CREATE INDEX idx_credit_transactions_user_credit_id ON credit_transactions(user_credit_id);
CREATE INDEX idx_credit_transactions_type ON credit_transactions(type);
CREATE INDEX idx_credit_transactions_payment_status ON credit_transactions(payment_status);
```

After running the SQL manually, generate the Prisma client:
```bash
npm run db:generate
```

### 5. Configure Xendit Webhooks

1. **Login to Xendit Dashboard**: https://dashboard.xendit.co/
2. **Go to Settings → Webhooks**
3. **Add Webhook URL**:
   - Development: `https://your-ngrok-url.ngrok.io/api/webhooks/xendit/invoice`
   - Production: `https://your-domain.com/api/webhooks/xendit/invoice`
4. **Select Events**:
   - ✅ Invoice paid
   - ✅ Invoice expired
5. **Set Verification Token**: Choose a secure random string and add it to your `.env` as `XENDIT_WEBHOOK_TOKEN`

**For Local Development:**
Use ngrok to expose your local server:
```bash
ngrok http 5000
# Use the https URL for Xendit webhook
```

### 6. Start the Application

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend-web
npm run dev
```

### 7. Create Initial Credit Plans (Admin)

1. Login as admin user (set `role = 'admin'` in users table)
2. Go to Admin Panel → Credit Plans tab
3. Click "Add New Plan"
4. Create sample plans:
   - **Starter**: 100 credits, Rp 50,000
   - **Professional**: 500 credits, Rp 200,000
   - **Premium**: 1000 credits, Rp 350,000

## Testing the System

### Test Xendit Payment (Development Mode)

1. **Make a Purchase**:
   - Login as regular user
   - Click "Top Up" button
   - Select a credit plan
   - Click "Buy Now"
   - Payment page opens in new window

2. **Complete Test Payment**:
   - On Xendit test page, use test payment methods
   - Complete the payment flow
   - Return to your app

3. **Verify Credits Added**:
   - Check dashboard - credits should be updated
   - Go to Admin Panel → Transactions to see the completed transaction

### Test Manual Payment Approval

1. **Modify Payment Method** (in `CreditPurchase.jsx`):
   ```javascript
   // Change from 'xendit' to 'manual'
   paymentMethod: 'manual'
   ```

2. **Make Purchase**: User creates purchase request

3. **Admin Approval**:
   - Login as admin
   - Go to Admin Panel → Transactions tab
   - Find pending transaction
   - Click "Approve Payment"
   - Credits added to user

### Test Credit Deduction

1. Ensure user has credits
2. Click "Create New Session"
3. Select any feature
4. Click "Use Feature"
5. Verify credits deducted

## Database Schema Changes

The credit system adds these tables:

### `credit_plans`
- Stores credit packages admins create
- Includes pricing, discount, active status

### `credit_transactions`
- Records all credit movements
- Links to credit plans and user sessions
- Tracks payment status for purchases

### `user_credits` (modified)
- Added `transactions` relation

## API Endpoints Summary

### User Endpoints
- `GET /api/credits/balance` - Get credit balance
- `GET /api/credits/transactions` - Get transaction history
- `POST /api/credits/purchase` - Buy credits
- `POST /api/credits/deduct` - Use credits for features

### Admin Endpoints
- `GET /api/credit-plans` - Get all plans
- `POST /api/credit-plans` - Create plan
- `PUT /api/credit-plans/:id` - Update plan
- `DELETE /api/credit-plans/:id` - Delete plan
- `GET /api/credits/transactions/all` - All transactions
- `POST /api/credits/confirm/:id` - Approve payment
- `POST /api/credits/bonus` - Add bonus credits

### Webhooks
- `POST /api/webhooks/xendit/invoice` - Xendit invoice callback
- `POST /api/webhooks/xendit/va` - Xendit VA callback

## Troubleshooting

### Migration Fails with TLS Error
**Error**: `Error opening a TLS connection`

**Solution**: Add `sslmode=disable` to DATABASE_URL (development only):
```env
DATABASE_URL="postgresql://user:pass@host:port/db?schema=public&sslmode=disable"
```

### Xendit Webhook Not Working
1. Verify `XENDIT_WEBHOOK_TOKEN` matches dashboard
2. Check webhook URL is publicly accessible
3. View logs in Xendit dashboard → Webhooks → Request logs
4. Ensure backend is running and accessible

### Credits Not Updating After Payment
1. Check backend logs for webhook errors
2. Verify transaction in database: `SELECT * FROM credit_transactions WHERE payment_status = 'pending'`
3. Manually approve via admin panel if needed

### Cannot Create Credit Plans
1. Verify user role is 'admin'
2. Check browser console for errors
3. Verify API endpoint in `frontend-web/src/config/endpoint.jsx`

## Production Deployment Checklist

- [ ] Switch `XENDIT_SECRET_KEY` to production key
- [ ] Update webhook URLs to production domain
- [ ] Enable SSL/TLS for database connection
- [ ] Set strong `JWT_SECRET`
- [ ] Configure CORS for production domain
- [ ] Set up proper error monitoring (Sentry, etc.)
- [ ] Test payment flow end-to-end
- [ ] Set up database backups
- [ ] Configure rate limiting for APIs
- [ ] Review and update credit plan pricing

## Next Steps

1. ✅ Set up environment variables
2. ✅ Run database migrations
3. ✅ Configure Xendit webhooks
4. ✅ Create initial credit plans
5. ✅ Test payment flow
6. ✅ Test credit deduction
7. 🚀 Deploy to production

For detailed documentation, see `CREDIT_SYSTEM_README.md`.
