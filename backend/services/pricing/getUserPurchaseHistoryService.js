import prisma from '../../prisma/client.js'
import { BaseService } from '../baseService.js'

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
      creditsGranted: purchase.credits_granted,
      purchaseDate: purchase.purchase_date,
      paymentMethod: purchase.payment_method,
      paymentStatus: purchase.payment_status,
      // Include subscription details if applicable
      subscription: (purchase.bundle_type === 'subscription' || purchase.bundle_type === 'hybrid') ? {
        startDate: purchase.subscription_start,
        endDate: purchase.subscription_end,
        status: purchase.subscription_status
      } : null
    }))
  }
}
