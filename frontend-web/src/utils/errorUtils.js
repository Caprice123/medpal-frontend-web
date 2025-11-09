import { actions } from "@store/common/reducer";
import axios from "axios";

const { setError } = actions

export const handleApiError = (err, dispatch) => {
    if (axios.isAxiosError(err)) {
        if (err.response) {
            const error = err.response.data.error; // or error.response.data.error
            dispatch(setError(error));
        } else if (err.code === "ERR_NETWORK") {
            // Handle CORS or network errors
            const errorMessage = "Sistem tidak dapat konek ke server.";
            dispatch(setError({ message: errorMessage, code: "CORS_ERROR" }));
        } else {
            // Handle unknown errors
            const errorMessage = "An unknown error occurred.";
            dispatch(setError({ message: errorMessage, code: "UNKNOWN_ERROR" }));
        }
    } else {
        console.error(err)
        const errorMessage = "An unexpected error occurred.";
        dispatch(setError({ message: errorMessage, code: "UNEXPECTED_ERROR" }));
    }
}