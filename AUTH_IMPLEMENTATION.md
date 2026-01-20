# Authentication Implementation Guide

## Overview

This frontend implements a session-based authentication system with JWT tokens (access token + refresh token) that communicates with a backend API. The authentication flow uses Google OAuth for login.

## Architecture

### Token Management
- **Access Token**: Short-lived JWT (e.g., 15 minutes) stored in localStorage
- **Refresh Token**: Long-lived token (e.g., 7 days) stored in localStorage
- **Automatic Refresh**: Tokens are automatically refreshed before expiration
- **Session Cookies**: Optional httpOnly cookies for additional security

### Key Components

1. **API Client** (`src/services/api.js`)
   - Axios instance with interceptors
   - Automatic token attachment to requests
   - Automatic token refresh on 401 errors
   - Request queuing during refresh

2. **Auth Service** (`src/services/authService.js`)
   - All authentication-related API calls
   - Login, logout, token refresh functions
   - Credits management functions

3. **Redux Slices**
   - `authSlice.js`: Authentication state management
   - `creditsSlice.js`: Credits state management

4. **Token Refresh Hook** (`src/hooks/useTokenRefresh.js`)
   - Monitors token expiration
   - Schedules automatic refresh
   - Handles token expired events

## Authentication Flow

### 1. Login Flow

```
User clicks "Continue with Google"
    ↓
Google OAuth popup appears
    ↓
User authenticates with Google
    ↓
Frontend receives Google credential (JWT)
    ↓
Frontend sends credential to backend: POST /api/auth/google
    ↓
Backend verifies Google token with Google
    ↓
Backend creates user session (if new user) or retrieves existing user
    ↓
Backend generates access token + refresh token
    ↓
Backend returns: { user, accessToken, refreshToken }
    ↓
Frontend stores tokens in localStorage
    ↓
Frontend fetches user credits: GET /api/credits
    ↓
Frontend redirects to dashboard
```

### 2. Token Refresh Flow

```
User makes API request
    ↓
Access token is attached to request header
    ↓
Backend validates token
    ↓
If token expired (401 error):
    ↓
    Axios interceptor catches 401
    ↓
    Queue pending requests
    ↓
    Send refresh request: POST /api/auth/refresh
    ↓
    Backend validates refresh token
    ↓
    Backend generates new access token
    ↓
    Backend returns: { accessToken }
    ↓
    Frontend stores new access token
    ↓
    Retry all queued requests with new token
```

### 3. Logout Flow

```
User clicks "Logout"
    ↓
Frontend sends: POST /api/auth/logout
    ↓
Backend invalidates session/tokens
    ↓
Frontend clears localStorage (tokens + user data)
    ↓
Frontend redirects to login page
```

## Required Backend API Endpoints

### 1. POST /api/auth/google
**Purpose**: Verify Google OAuth token and create session

**Request Body**:
```json
{
  "credential": "google_jwt_token_here"
}
```

**Response** (200 OK):
```json
{
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "name": "User Name",
    "picture": "https://avatar-url.com/image.jpg"
  },
  "accessToken": "jwt_access_token",
  "refreshToken": "jwt_refresh_token"
}
```

**Backend Implementation Steps**:
1. Verify Google token with Google's API
2. Extract user info (email, name, picture) from Google token
3. Check if user exists in database by email
4. If new user: create user record with initial credits (e.g., 100)
5. If existing user: retrieve user data
6. Generate access token (short-lived, e.g., 15 min)
7. Generate refresh token (long-lived, e.g., 7 days)
8. Store refresh token in database with user ID
9. Return user data and tokens

### 2. POST /api/auth/refresh
**Purpose**: Refresh expired access token

**Request Body**:
```json
{
  "refreshToken": "refresh_token_here"
}
```

**Response** (200 OK):
```json
{
  "accessToken": "new_jwt_access_token"
}
```

**Error** (401 Unauthorized):
```json
{
  "message": "Invalid or expired refresh token"
}
```

**Backend Implementation Steps**:
1. Verify refresh token signature
2. Check if refresh token exists in database and is not revoked
3. Check if refresh token is not expired
4. Generate new access token
5. Return new access token

### 3. GET /api/auth/me
**Purpose**: Get current user profile

**Headers**:
```
Authorization: Bearer <access_token>
```

**Response** (200 OK):
```json
{
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "name": "User Name",
    "picture": "https://avatar-url.com/image.jpg",
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

### 4. POST /api/auth/logout
**Purpose**: Logout user and invalidate tokens

**Headers**:
```
Authorization: Bearer <access_token>
```

**Response** (200 OK):
```json
{
  "message": "Logged out successfully"
}
```

**Backend Implementation Steps**:
1. Verify access token
2. Get user ID from token
3. Revoke/delete refresh token from database
4. (Optional) Add access token to blacklist
5. Return success

### 5. GET /api/credits
**Purpose**: Get user's credit balance

**Headers**:
```
Authorization: Bearer <access_token>
```

**Response** (200 OK):
```json
{
  "balance": 100
}
```

### 6. POST /api/credits/deduct
**Purpose**: Deduct credits for feature usage

**Headers**:
```
Authorization: Bearer <access_token>
```

**Request Body**:
```json
{
  "featureId": 1,
  "amount": 10
}
```

**Response** (200 OK):
```json
{
  "newBalance": 90,
  "transaction": {
    "id": "transaction_id",
    "type": "deduction",
    "amount": -10,
    "description": "Used feature: AI Diagnosis Assistant",
    "timestamp": "2024-01-01T00:00:00Z"
  }
}
```

**Error** (400 Bad Request):
```json
{
  "message": "Insufficient credits"
}
```

**Backend Implementation Steps**:
1. Verify access token and get user ID
2. Check if user has sufficient credits
3. Deduct credits from user balance
4. Create transaction record
5. Return new balance and transaction

### 7. POST /api/credits/topup
**Purpose**: Add credits to user account

**Headers**:
```
Authorization: Bearer <access_token>
```

**Request Body**:
```json
{
  "amount": 100,
  "paymentMethod": "stripe"
}
```

**Response** (200 OK):
```json
{
  "newBalance": 200,
  "transaction": {
    "id": "transaction_id",
    "type": "topup",
    "amount": 100,
    "description": "Top-up via stripe",
    "timestamp": "2024-01-01T00:00:00Z"
  }
}
```

### 8. GET /api/credits/transactions
**Purpose**: Get user's credit transaction history

**Headers**:
```
Authorization: Bearer <access_token>
```

**Response** (200 OK):
```json
{
  "transactions": [
    {
      "id": "transaction_id",
      "type": "deduction",
      "amount": -10,
      "description": "Used feature: AI Diagnosis Assistant",
      "timestamp": "2024-01-01T00:00:00Z"
    },
    {
      "id": "transaction_id_2",
      "type": "topup",
      "amount": 100,
      "description": "Top-up via stripe",
      "timestamp": "2024-01-01T00:00:00Z"
    }
  ]
}
```

## Database Schema Recommendations

### Users Table
```sql
CREATE TABLE users (
  id VARCHAR(255) PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  picture TEXT,
  credits INTEGER DEFAULT 100,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Refresh Tokens Table
```sql
CREATE TABLE refresh_tokens (
  id VARCHAR(255) PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  token TEXT NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  revoked BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

### Transactions Table
```sql
CREATE TABLE transactions (
  id VARCHAR(255) PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL, -- 'deduction' or 'topup'
  amount INTEGER NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

## Security Considerations

### Token Security
1. **Access tokens are short-lived** (15 minutes recommended)
2. **Refresh tokens are long-lived** (7 days recommended)
3. **Refresh tokens should be rotated** on each use (optional but recommended)
4. **Store refresh tokens securely** in database with user association
5. **Consider httpOnly cookies** for additional XSS protection

### API Security
1. **Verify Google tokens** on the backend, never trust the frontend
2. **Use HTTPS** for all API communications
3. **Implement rate limiting** on auth endpoints
4. **Validate all inputs** to prevent injection attacks
5. **Use CORS** appropriately
6. **Add CSRF protection** if using cookies

### Token Generation
```javascript
// Example JWT payload for access token
{
  userId: "user_id",
  email: "user@example.com",
  type: "access",
  iat: 1234567890,
  exp: 1234567890 + (15 * 60) // 15 minutes
}

// Example JWT payload for refresh token
{
  userId: "user_id",
  type: "refresh",
  iat: 1234567890,
  exp: 1234567890 + (7 * 24 * 60 * 60) // 7 days
}
```

## Environment Variables

Frontend (.env):
```env
VITE_GOOGLE_CLIENT_ID=your_google_client_id
VITE_API_BASE_URL=http://localhost:3000/api
```

Backend (.env):
```env
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
JWT_SECRET=your_jwt_secret_key
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d
DATABASE_URL=your_database_connection_string
```

## Testing the Integration

1. **Test Login**:
   - Click Google login button
   - Verify token storage in localStorage
   - Verify user data in Redux store

2. **Test Token Refresh**:
   - Wait for access token to expire
   - Make an API request
   - Verify automatic token refresh

3. **Test Logout**:
   - Click logout button
   - Verify tokens are cleared
   - Verify redirect to login page

4. **Test Protected Routes**:
   - Try accessing /dashboard without login
   - Verify redirect to /login

5. **Test Credits**:
   - Use a feature
   - Verify credits are deducted
   - Verify transaction is recorded

## Common Issues & Solutions

### Issue: Token refresh loop
**Solution**: Ensure refresh endpoint doesn't require access token

### Issue: CORS errors
**Solution**: Configure backend CORS to allow credentials and frontend origin

### Issue: Tokens not persisting
**Solution**: Check localStorage access and browser settings

### Issue: 401 errors on every request
**Solution**: Verify token format and Authorization header

### Issue: Google login not working
**Solution**: Verify Google OAuth credentials and authorized origins
