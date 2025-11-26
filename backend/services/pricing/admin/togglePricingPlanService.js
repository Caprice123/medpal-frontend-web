import prisma from '../../../prisma/client.js'
import { BaseService } from '../../baseService.js'

export class TogglePricingPlanService extends BaseService {
  static async call(id, req) {
    const plan = await prisma.pricing_plans.findUnique({
      where: { id: parseInt(id) }
    })

    if (!plan) {
      throw new Error('Pricing plan not found')
    }

    const updatedPlan = await prisma.pricing_plans.update({
      where: { id: parseInt(id) },
      data: {
        is_active: !plan.is_active,
        updated_at: new Date()
      }
    })

    return updatedPlan
  }
}
