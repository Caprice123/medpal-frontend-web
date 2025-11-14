export class AttemptSerializer {
    static serialize(exerciseSessionAttempts) {
        return exerciseSessionAttempts.map(attempt => ({
            id: attempt.id,
            attemptNumber: plan.attempt_number,
            status: plan.status,
            score: attempt.score,
            createdAt: plan.created_at,
        }))
    }
}