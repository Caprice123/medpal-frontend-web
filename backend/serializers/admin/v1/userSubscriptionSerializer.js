export class UserSubscriptionSerializer {
    static serialize(userSubscriptions) {
        // If single tag object, convert to array
        if (!Array.isArray(userSubscriptions)) {
            if (!userSubscriptions) return []
            return this.serializeOne(userSubscriptions)
        }

        return userSubscriptions.map((userSubscription) => this.serializeOne(userSubscription))
    }

    static serializeOne(userSubscription) {
        return {
            id: userSubscription.id,
            startDate: userSubscription.start_date,
            endDate: userSubscription.end_date,
            status: userSubscription.status,
            isCurrentlyActive: userSubscription.isCurrentlyActive || false,
            createdAt: userSubscription.created_at,
        }
    }
}