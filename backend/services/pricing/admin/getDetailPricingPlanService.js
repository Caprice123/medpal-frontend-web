import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'

export class GetDetailPricingPlanService extends BaseService {
  static async call(id) {
    const plan = await prisma.pricing_plans.findUnique({
      where: { id: parseInt(id) },
      include: {
        _count: {
          select: { user_purchases: true }
        }
      }
    })

    if (!plan) {
      throw new Error('Pricing plan not found')
    }

    return plan
  }
}
