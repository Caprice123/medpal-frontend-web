import prisma from '../../../prisma/client.js'
import { BaseService } from '../../baseService.js'

export class UpdatePricingPlanService extends BaseService {
  static async call(id, req) {
    const {
      name,
      code,
      description,
      price,
      bundle_type,
      duration_days,
      credits_included,
      is_active,
      is_popular,
      discount,
      order
    } = req.body

    const updateData = {}

    if (name !== undefined) updateData.name = name
    if (code !== undefined) updateData.code = code || null
    if (description !== undefined) updateData.description = description
    if (price !== undefined) updateData.price = Number(price)
    if (bundle_type !== undefined) updateData.bundle_type = bundle_type
    if (duration_days !== undefined) updateData.duration_days = Number(duration_days)
    if (credits_included !== undefined) updateData.credits_included = Number(credits_included)
    if (is_active !== undefined) updateData.is_active = is_active
    if (is_popular !== undefined) updateData.is_popular = is_popular
    if (discount !== undefined) updateData.discount = Number(discount)
    if (order !== undefined) updateData.order = Number(order)

    updateData.updated_at = new Date()

    const plan = await prisma.pricing_plans.update({
      where: { id: parseInt(id) },
      data: updateData
    })

    return plan
  }
}
