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
            startDate: userSubscription.start_date,
            endDate: userSubscription.end_date,
        }
    }
}