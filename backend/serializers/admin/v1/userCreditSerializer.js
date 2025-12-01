export class UserCreditSerializer {
    static serialize(userCredits) {
        // If single tag object, convert to array
        if (!Array.isArray(userCredits)) {
            if (!userCredits) return []
            return this.serializeOne(userCredits)
        }

        return userCredits.map((userCredit) => this.serializeOne(userCredit))
    }

    static serializeOne(userCredit) {
        return {
            balance: userCredit.balance,
        }
    }
}