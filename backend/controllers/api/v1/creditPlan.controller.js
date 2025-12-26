import { PrismaClient } from '@prisma/client'
import { CreditPlanSerializer } from '#serializers/api/v1/creditPlanSerializer';

const prisma = new PrismaClient()

class CreditPlanController {
    async index(req, res) {
        const plans = await prisma.credit_plans.findMany({
            where: {
                isActive: true
            },
            orderBy: [
                { order: 'asc' },
                { createdAt: 'desc' }
            ]
        })

        res.status(200).json({
            data: CreditPlanSerializer.serialize(plans)
        })
    }
}

export default new CreditPlanController();
