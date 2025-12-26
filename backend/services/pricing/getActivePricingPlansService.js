import prisma from '#prisma/client'
import { BaseService } from '#baseService.js'

export class GetActivePricingPlansService extends BaseService {
  static async call(bundleType = null) {
    const where = {
      is_active: true
    }

    if (bundleType) {
      where.bundle_type = bundleType
    }

    const plans = await prisma.pricing_plans.findMany({
      where: where,
      orderBy: [
        { order: 'asc' },
        { created_at: 'desc' }
      ]
    })

    return plans
  }
}
