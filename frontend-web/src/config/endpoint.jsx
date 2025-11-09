const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'

export default {
    Root: "/",
    Login: "/api/v1/login",
    Logout: "/api/v1/logout",
    creditPlans: `${API_BASE_URL}/api/credit-plans`,
    credits: `${API_BASE_URL}/api/credits`,
}
