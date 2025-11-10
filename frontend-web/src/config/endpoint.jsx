const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'

export default {
    Root: "/",
    Login: "/api/v1/login",
    Logout: "/api/v1/logout",
    creditPlans: `${API_BASE_URL}/api/credit-plans`,
    credits: `${API_BASE_URL}/api/credits`,
    exercises: {
        generate: `${API_BASE_URL}/admin/v1/exercises/generate`,
        topics: `${API_BASE_URL}/admin/v1/exercises/topics`,
        topic: (id) => `${API_BASE_URL}/admin/v1/exercises/topics/${id}`,
        questions: (id) => `${API_BASE_URL}/admin/v1/exercises/topics/${id}/questions`,
        tags: `${API_BASE_URL}/admin/v1/exercises/tags`,
    },
}
