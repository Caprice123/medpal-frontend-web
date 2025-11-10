# Credit-Based System Documentation

## Overview
This medical education web app features a comprehensive credit-based system where users purchase credits to access various learning features. The system supports both Xendit payment gateway integration and manual payment approval by admins.

## Features

### For Users
- **View Credit Balance**: See current credit balance in dashboard header
- **Purchase Credit Plans**: Buy credit packages via Xendit payment gateway
- **Use Features**: Each feature costs a specific amount of credits
- **Transaction History**: View all credit purchases and usage history
- **Auto Credit Addition**: Credits automatically added after successful Xendit payment

### For Admins
- **Manage Credit Plans**: Create, edit, activate/deactivate credit packages
- **View All Transactions**: Monitor all credit purchases and usage
- **Manual Payment Approval**: Approve or reject manual payments
- **Add Bonus Credits**: Grant bonus credits to users
- **Transaction Filtering**: Filter by type and status

## Database Schema

### CreditPlan Table
Stores credit packages that admins create:
- `name`: Plan name (e.g., "Starter Pack")
- `description`: Plan description
- `credits`: Number of credits in the plan
- `price`: Price in IDR (Decimal)
- `isActive`: Whether the plan is available for purchase
- `isPopular`: Highlight as popular plan
- `discount`: Discount percentage (0-100)
- `order`: Display order

### CreditTransaction Table
Tracks all credit movements:
- `type`: 'purchase', 'deduction', 'refund', 'bonus'
- `amount`: Credits (positive for additions, negative for deductions)
- `balanceBefore`: Balance before transaction
- `balanceAfter`: Balance after transaction
- `paymentStatus`: 'pending', 'completed', 'failed' (for purchases)
- `paymentMethod`: Payment method used
- `paymentReference`: Xendit invoice ID or payment reference
- `creditPlanId`: Link to credit plan (for purchases)

### UserCredit Table
Stores user credit balances:
- `userId`: Reference to user
- `balance`: Current credit balance

## API Endpoints

### User Endpoints

#### Get Credit Balance
```
GET /api/credits/balance
Headers: Authorization: Bearer <token>
Response: { success: true, data: { balance: 100, userId: 1 } }
```

#### Get Transaction History
```
GET /api/credits/transactions?limit=10&offset=0&type=purchase
Headers: Authorization: Bearer <token>
Response: { success: true, data: { transactions: [...], pagination: {...} } }
```

#### Purchase Credits
```
POST /api/credits/purchase
Headers: Authorization: Bearer <token>
Body: {
  creditPlanId: 1,
  paymentMethod: "xendit" // or "manual"
}
Response: {
  success: true,
  data: {
    transaction: {...},
    paymentInfo: {
      invoiceUrl: "https://checkout.xendit.co/...",
      invoiceId: "...",
      amount: 50000,
      credits: 100
    }
  }
}
```

#### Deduct Credits (Use Feature)
```
POST /api/credits/deduct
Headers: Authorization: Bearer <token>
Body: {
  amount: 10,
  description: "Using feature: Diagnosis AI",
  sessionId: 123 // optional
}
Response: {
  success: true,
  data: {
    transaction: {...},
    newBalance: 90
  }
}
```

### Admin Endpoints

#### Get All Credit Plans
```
GET /api/credit-plans
Headers: Authorization: Bearer <token> (admin only)
Response: { success: true, data: [...] }
```

#### Get Active Credit Plans (for users)
```
GET /api/credit-plans/active
Headers: Authorization: Bearer <token>
Response: { success: true, data: [...] }
```

#### Create Credit Plan
```
POST /api/credit-plans
Headers: Authorization: Bearer <token> (admin only)
Body: {
  name: "Starter Pack",
  description: "Perfect for beginners",
  credits: 100,
  price: 50000,
  isActive: true,
  isPopular: false,
  discount: 0,
  order: 0
}
```

#### Update Credit Plan
```
PUT /api/credit-plans/:id
Headers: Authorization: Bearer <token> (admin only)
Body: { name: "Updated Name", price: 60000, ... }
```

#### Delete Credit Plan
```
DELETE /api/credit-plans/:id
Headers: Authorization: Bearer <token> (admin only)
```

#### Toggle Plan Status
```
PATCH /api/credit-plans/:id/toggle
Headers: Authorization: Bearer <token> (admin only)
```

#### Get All Transactions (Admin)
```
GET /api/credits/transactions/all?limit=100&offset=0&type=purchase&status=pending
Headers: Authorization: Bearer <token> (admin only)
```

#### Confirm Payment (Manual)
```
POST /api/credits/confirm/:transactionId
Headers: Authorization: Bearer <token> (admin only)
Body: { status: "completed" } // or "failed"
```

#### Add Bonus Credits
```
POST /api/credits/bonus
Headers: Authorization: Bearer <token> (admin only)
Body: {
  userId: 1,
  amount: 50,
  description: "Welcome bonus"
}
```

### Webhook Endpoints

#### Xendit Invoice Webhook
```
POST /api/webhooks/xendit/invoice
Headers: x-callback-token: <your-webhook-token>
Body: { id, external_id, status, paid_amount, ... }
```

#### Xendit Virtual Account Webhook
```
POST /api/webhooks/xendit/va
Headers: x-callback-token: <your-webhook-token>
Body: { external_id, amount, bank_code, ... }
```

## Xendit Integration Setup

### 1. Get Xendit API Keys
1. Sign up at [https://dashboard.xendit.co/](https://dashboard.xendit.co/)
2. Go to Settings → Developers → API Keys
3. Copy your Secret Key (starts with `xnd_`)
4. Add to `.env`: `XENDIT_SECRET_KEY=xnd_development_...`

### 2. Configure Webhook
1. In Xendit Dashboard, go to Settings → Webhooks
2. Add webhook URL: `https://your-domain.com/api/webhooks/xendit/invoice`
3. Set webhook events:
   - Invoice paid
   - Invoice expired
4. Generate a webhook verification token
5. Add to `.env`: `XENDIT_WEBHOOK_TOKEN=your_custom_token`

### 3. Test with Development Mode
- Use `xnd_development_` key for testing
- Xendit provides test payment methods
- No real money is charged in development mode

### 4. Production Checklist
- [ ] Switch to `xnd_production_` API key
- [ ] Update webhook URLs to production domain
- [ ] Verify webhook token is secure
- [ ] Test payment flow end-to-end
- [ ] Set up proper error monitoring

## Payment Flow

### Xendit Payment Flow
1. User clicks "Buy Credits" → Opens credit plans modal
2. User selects a plan → Frontend calls `/api/credits/purchase`
3. Backend creates transaction with status `pending`
4. Backend calls Xendit API to create invoice
5. Frontend receives `invoiceUrl` and opens it in new tab
6. User completes payment on Xendit checkout page
7. Xendit sends webhook to `/api/webhooks/xendit/invoice`
8. Backend verifies webhook token
9. Backend updates transaction status to `completed`
10. Backend adds credits to user's balance
11. User sees updated balance in dashboard

### Manual Payment Flow
1. User clicks "Buy Credits" with `paymentMethod: "manual"`
2. Backend creates transaction with status `pending`
3. User receives payment reference
4. Admin views pending transactions in admin panel
5. Admin clicks "Approve" or "Reject"
6. If approved, credits are added to user's balance

## Frontend Components

### User Components

#### `<CreditPurchase />`
Location: `frontend-web/src/components/CreditPurchase.jsx`
- Modal for purchasing credit plans
- Displays available plans with pricing
- Handles Xendit payment initiation
- Opens payment URL in new window

#### Dashboard Integration
Location: `frontend-web/src/routes/Dashboard.jsx`
- Shows credit balance in header
- "Top Up" button opens purchase modal
- Displays transaction history
- Feature selection modal with credit deduction

### Admin Components

#### `<CreditPlans />`
Location: `frontend-web/src/routes/Admin/CreditPlans.jsx`
- CRUD operations for credit plans
- Create/edit plan modal with form
- Toggle plan activation
- Visual indicators for popular plans

#### `<Transactions />`
Location: `frontend-web/src/routes/Admin/Transactions.jsx`
- View all transactions with filters
- Approve/reject pending payments
- Transaction details display
- Pagination support

#### Admin Panel Integration
Location: `frontend-web/src/routes/Admin/AdminPanel.jsx`
- Tab navigation for Features, Credit Plans, Transactions, Users
- Integrated credit management section

## Environment Variables

### Backend (.env)
```env
# Xendit Configuration
XENDIT_SECRET_KEY=xnd_development_your_secret_key
XENDIT_WEBHOOK_TOKEN=your_webhook_verification_token
FRONTEND_URL=http://localhost:3000

# Database
DATABASE_URL=postgresql://user:pass@host:port/db

# JWT & Auth
JWT_SECRET=your_jwt_secret
GOOGLE_CLIENT_ID=your_google_client_id
```

### Frontend (.env)
```env
VITE_API_BASE_URL=http://localhost:5000
```

## Testing

### Test Credit Purchase
1. Create a test credit plan as admin
2. Login as regular user
3. Click "Top Up" in dashboard
4. Select a plan and click "Buy Now"
5. Complete payment on Xendit test page
6. Verify credits are added to balance

### Test Credit Deduction
1. Ensure user has credits
2. Click "Create New Session" in dashboard
3. Select a feature
4. Click "Use Feature"
5. Verify credits are deducted

### Test Admin Approval
1. Create transaction with `paymentMethod: "manual"`
2. Login as admin
3. Go to Admin Panel → Transactions
4. Find pending transaction
5. Click "Approve Payment"
6. Verify credits are added

## Security Considerations

### Webhook Security
- Always verify `x-callback-token` header
- Log all webhook requests
- Return 200 even on errors (to prevent retries)
- Validate webhook payload structure

### Payment Security
- Never store credit card details
- All payments through Xendit (PCI-DSS compliant)
- Validate amounts on backend, not frontend
- Use database transactions for balance updates

### Authorization
- All admin endpoints require admin role
- Token-based authentication (JWT)
- Credit operations require valid user session

## Troubleshooting

### Credits Not Added After Payment
1. Check Xendit webhook is configured correctly
2. Verify `XENDIT_WEBHOOK_TOKEN` matches dashboard setting
3. Check backend logs for webhook errors
4. Manually call `/api/credits/confirm/:transactionId` as admin

### Payment Page Not Opening
1. Verify `XENDIT_SECRET_KEY` is set correctly
2. Check browser pop-up blocker settings
3. Verify frontend can reach backend API
4. Check console for CORS errors

### Insufficient Credits Error
1. Verify user's actual balance via API
2. Check if credits were deducted but UI not updated
3. Refresh the page to sync balance
4. Admin can add bonus credits if needed

## Migration Guide

### Running Migrations
```bash
cd backend
npm run db:generate  # Generate Prisma client
npm run db:migrate:dev  # Run migrations
```

### Initial Data Setup
After migration, create initial credit plans via admin panel or seed script.

## Support

For issues related to:
- **Xendit Integration**: Contact Xendit support or check their [documentation](https://developers.xendit.co/)
- **Database Issues**: Verify `DATABASE_URL` and run migrations
- **Authentication**: Check JWT configuration and token expiry

## Future Enhancements

- [ ] Subscription-based credit auto-renewal
- [ ] Referral bonus credits
- [ ] Credit expiry dates
- [ ] Multiple currency support
- [ ] Payment method selection (VA, e-wallet, cards)
- [ ] Email notifications for transactions
- [ ] Credit usage analytics dashboard
- [ ] Bulk credit operations for admins
