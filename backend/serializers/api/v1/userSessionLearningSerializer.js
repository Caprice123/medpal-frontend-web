export class UserLearningSessionSerializer {
    static serialize(user_learning_sessions) {
        return user_learning_sessions.map(plan => ({
            id: plan.id,
            title: plan.title,
            type: plan.type,
            creditUsed: plan.credit_used,
            createdAt: plan.created_at,
        }))
    }
}