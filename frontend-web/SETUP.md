# MedPalm - Medical AI Platform Setup Guide

A medical-themed web application with Google OAuth authentication, credit-based features, and AI-powered medical catalogs.

## Features

- **Google OAuth Login**: Secure authentication using Google Sign-In
- **Credit System**: Users have credits that get deducted when using features
- **Medical Catalogs**: Various AI-powered medical tools and features
- **Top-up System**: Users can add credits to their account
- **Medical Theme**: Beautiful UI with medical-inspired color palette
- **Redux State Management**: Centralized state management for auth and credits
- **Styled Components**: Modern, maintainable CSS-in-JS styling

## Setup Instructions

### 1. Install Dependencies

```bash
cd frontend-web
npm install
```

### 2. Get Google OAuth Client ID

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API
4. Go to **Credentials** → **Create Credentials** → **OAuth Client ID**
5. Choose **Web application**
6. Add authorized JavaScript origins:
   - `http://localhost:5173` (for development)
   - Your production URL (when deploying)
7. Add authorized redirect URIs:
   - `http://localhost:5173` (for development)
8. Copy the **Client ID**

### 3. Configure Environment Variables

Create a `.env` file in the `frontend-web` directory:

```bash
cp .env.example .env
```

Edit `.env` and add your Google OAuth Client ID:

```env
VITE_GOOGLE_CLIENT_ID=your_actual_google_client_id_here
```

### 4. Run the Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## Project Structure

```
frontend-web/
├── src/
│   ├── config/
│   │   └── googleOAuth.js       # Google OAuth configuration
│   ├── routes/
│   │   ├── Login.jsx            # Login page with Google Sign-In
│   │   └── Dashboard.jsx        # Main dashboard with catalogs
│   ├── store/
│   │   ├── store.js             # Redux store configuration
│   │   └── slices/
│   │       ├── authSlice.js     # Authentication state management
│   │       └── creditsSlice.js  # Credits state management
│   ├── theme/
│   │   ├── colors.js            # Color palette
│   │   └── GlobalStyles.js      # Global styles
│   ├── App.jsx                  # Main app component with routing
│   └── main.jsx                 # Entry point
├── .env                         # Environment variables (create this)
├── .env.example                 # Environment variables template
└── package.json
```

## How It Works

### Authentication Flow

1. User lands on `/login` page
2. Clicks "Continue with Google" button
3. Google OAuth popup appears
4. After successful authentication, user data is stored in Redux
5. User gets 100 initial credits
6. User is redirected to `/dashboard`

### Credit System

- Each feature has a specific credit cost
- When a user clicks "Use Feature", credits are deducted
- If insufficient credits, user is notified to top up
- All transactions are stored in Redux state

### Available Catalogs

1. **AI Diagnosis Assistant** (10 credits) - Diagnostic suggestions
2. **Drug Interaction Checker** (5 credits) - Check drug interactions
3. **Lab Report Analysis** (15 credits) - Analyze lab reports
4. **Medical Literature Search** (8 credits) - Search research papers
5. **Genetic Risk Assessment** (20 credits) - Analyze genetic data
6. **Treatment Plan Generator** (12 credits) - Generate treatment plans

## Color Palette

The app uses a medical-inspired color scheme:

- **Primary**: Cyan/Teal (`#0891B2`) - Medical professionalism
- **Secondary**: Indigo (`#6366F1`) - Trust and technology
- **Success**: Emerald (`#10B981`) - Health and wellness
- **Warning**: Amber (`#F59E0B`) - Caution
- **Error**: Red (`#EF4444`) - Critical alerts

## Next Steps

### To Implement Top-up Feature

1. Integrate a payment gateway (Stripe, PayPal, etc.)
2. Create a Top-up modal component
3. Add API endpoints for payment processing
4. Update credits after successful payment

### To Connect to Backend

1. Create API service functions in `src/services/api.js`
2. Update Redux slices to use async thunks
3. Add API calls for:
   - User authentication and profile
   - Credits balance and transactions
   - Feature usage tracking
   - Payment processing

### To Add More Features

1. Create new catalog items in `Dashboard.jsx`
2. Add specific feature pages/modals
3. Implement feature-specific logic
4. Connect to backend APIs

## Common Issues

### Google OAuth Not Working

- Make sure `VITE_GOOGLE_CLIENT_ID` is set in `.env`
- Verify the Client ID is correct
- Check authorized origins in Google Cloud Console
- Restart the dev server after changing `.env`

### Styles Not Applying

- Make sure styled-components is installed
- Check that GlobalStyles is imported in App.jsx
- Clear browser cache

## Support

For issues and questions, please refer to the documentation or create an issue in the project repository.
