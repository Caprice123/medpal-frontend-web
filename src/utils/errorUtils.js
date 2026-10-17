import { actions } from "@store/common/reducer";
import axios from "axios";
import { captureException } from "@config/sentry";

const { setError } = actions

const isDev = import.meta.env.MODE === 'development';

// Server down / CORS / DNS failure hits every in-flight request at once, so one
// outage can easily produce dozens of identical events. Report the first one
// per window only.
const NETWORK_ERROR_THROTTLE_MS = 30_000;
let lastNetworkErrorReportedAt = 0;

const reportNetworkError = (err, userMessage) => {
    const now = Date.now();
    if (now - lastNetworkErrorReportedAt < NETWORK_ERROR_THROTTLE_MS) return;
    lastNetworkErrorReportedAt = now;

    const isOffline = typeof navigator !== 'undefined' && navigator.onLine === false;

    captureException(err, {
        userMessage,
        url: err.config?.url,
        baseURL: err.config?.baseURL,
        method: err.config?.method,
        timeout: err.config?.timeout,
        online: typeof navigator !== 'undefined' ? navigator.onLine : null,
        page: typeof window !== 'undefined' ? window.location.pathname : null,
    }, {
        level: 'error',
        tags: {
            error_type: 'network',
            error_code: 'CORS_ERROR',
            axios_code: err.code || 'unknown',
            // Lets you filter out "user's wifi died" from "our API is unreachable"
            offline: String(isOffline),
        },
        // Group every unreachable-server event into a single issue, regardless
        // of which endpoint happened to fire first.
        fingerprint: ['api-unreachable'],
    });
}

export const handleApiError = (err, dispatch) => {
    if (isDev) {
        console.error('[API Error]', err);
    }

    if (axios.isAxiosError(err)) {
        if (err.response) {
            const error = err.response.data.error;
            dispatch(setError(error));
        } else if (err.code === "ERR_NETWORK") {
            const errorMessage = "Sistem tidak dapat konek ke server.";
            reportNetworkError(err, errorMessage);
            dispatch(setError({ message: errorMessage, code: "CORS_ERROR" }));
        } else {
            const errorMessage = "An unknown error occurred.";
            dispatch(setError({ message: errorMessage, code: "UNKNOWN_ERROR" }));
        }
    } else {
        const errorMessage = "An unexpected error occurred.";
        dispatch(setError({ message: errorMessage, code: "UNEXPECTED_ERROR" }));
    }
}
