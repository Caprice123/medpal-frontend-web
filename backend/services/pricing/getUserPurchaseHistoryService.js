import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'

export class GetUserPurchaseHistoryService extends BaseService {
  static async call(userId) {
    const purchases = await prisma.user_purchases.findMany({
      where: {
        user_id: userId
      },
      include: {
        pricing_plan: true
      },
      orderBy: {
        purchase_date: 'desc'
      }
    })

    return purchases.map(purchase => ({
      id: purchase.id,
      planName: purchase.pricing_plan.name,
      bundleType: purchase.bundle_type,
      amountPaid: purchase.amount_paid,
      purchaseDate: purchase.purchase_date,
      paymentMethod: purchase.payment_method,
      paymentStatus: purchase.payment_status,
      // Pricing plan details
      pricingPlan: {
        creditsIncluded: purchase.pricing_plan.credits_included,
        durationDays: purchase.pricing_plan.duration_days
      }
    }))
  }
}
