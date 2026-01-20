import * as Sentry from '@sentry/react';

/**
 * Initialize Sentry for error tracking in React
 */
export const initSentry = () => {
  // Only initialize in production
  if (import.meta.env.MODE !== 'production') {
    console.log('ℹ️ Sentry disabled in development mode');
    return;
  }

  // Only initialize if DSN is provided
  if (!import.meta.env.VITE_SENTRY_DSN) {
    console.warn('⚠️ Sentry DSN not configured. Error tracking is disabled.');
    return;
  }

  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    environment: import.meta.env.MODE || 'production',

    // Set tracesSampleRate to capture 10% of transactions for performance monitoring
    tracesSampleRate: 0.1,

    // Set `tracePropagationTargets` to control for which URLs distributed tracing should be enabled
    tracePropagationTargets: [
      /^https:\/\/yourserver\.io\/api/,
      import.meta.env.VITE_API_BASE_URL,
    ],

    integrations: [
      // Enable React error boundary
      new Sentry.BrowserTracing({
        // Set sampling rate for performance monitoring
        tracingOrigins: [import.meta.env.VITE_API_BASE_URL],
      }),
      // Enable Replay for session recording (optional)
      new Sentry.Replay({
        maskAllText: true,
        blockAllMedia: true,
      }),
    ],

    // Capture Replay for 10% of all sessions,
    // plus 100% of sessions with an error
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,

    // Ignore certain errors
    ignoreErrors: [
      // Browser extensions
      'ResizeObserver loop limit exceeded',
      'Non-Error promise rejection captured',
      // Network errors
      'NetworkError',
      'Network request failed',
      'Failed to fetch',
      // Common non-actionable errors
      'AbortError',
      'cancelled',
    ],

    // Filter sensitive data
    beforeSend(event, hint) {
      // Filter out sensitive data from request
      if (event.request) {
        delete event.request.cookies;
        if (event.request.headers) {
          delete event.request.headers.authorization;
          delete event.request.headers.cookie;
        }
      }

      // Filter out localStorage/sessionStorage data
      if (event.contexts?.browser) {
        delete event.contexts.browser;
      }

      return event;
    },
  });

  console.log('✅ Sentry initialized for error tracking');
};

/**
 * Manually capture an exception
 * @param {Error} error - Error to capture
 * @param {Object} context - Additional context
 */
export const captureException = (error, context = {}) => {
  Sentry.captureException(error, {
    extra: context,
  });
};

/**
 * Manually capture a message
 * @param {string} message - Message to capture
 * @param {string} level - Severity level (fatal, error, warning, info, debug)
 */
export const captureMessage = (message, level = 'info') => {
  Sentry.captureMessage(message, level);
};

/**
 * Set user context for error tracking
 * @param {Object} user - User information
 */
export const setUser = (user) => {
  Sentry.setUser({
    id: user.id,
    email: user.email,
    username: user.name,
  });
};

/**
 * Clear user context
 */
export const clearUser = () => {
  Sentry.setUser(null);
};

/**
 * Error Boundary component
 * Wrap your app with this component to catch React errors
 */
export const ErrorBoundary = Sentry.ErrorBoundary;

/**
 * Create Sentry React Router integration
 * Use this with React Router for better error tracking
 */
export const createRoutesFromChildren = Sentry.createRoutesFromChildren;
export const matchRoutes = Sentry.matchRoutes;
export const useLocation = Sentry.useLocation;
export const useNavigationType = Sentry.useNavigationType;

export default Sentry;
