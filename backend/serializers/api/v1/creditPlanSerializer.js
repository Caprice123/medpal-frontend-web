export class CreditPlanSerializer {
    static serialize(plans) {
        return plans.map(plan => ({
            id: plan.id,
            name: plan.name,
            price: plan.price,
            duration: plan.duration,
            order: plan.order,
        }))
    }
}