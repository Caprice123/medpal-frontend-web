export class CreditPlanDetailSerializer {
    static serialize(plan) {
        return {
            id: plan.id,
            name: plan.name,
            description: plan.description,
            price: plan.price,
            duration: plan.duration,
            order: plan.order,
        }
    }
}
