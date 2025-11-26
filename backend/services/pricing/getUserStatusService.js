import prisma from '../../prisma/client.js'
import { BaseService } from '../baseService.js'

/**
 * Get comprehensive user status including subscription and credits
 */
export class GetUserStatusService extends BaseService {
  static async call(userId) {
    // Get active subscription
    const activeSubscription = await prisma.user_purchases.findFirst({
      where: {
        user_id: userId,
        bundle_type: { in: ['subscription', 'hybrid'] },
        subscription_status: 'active',
        subscription_end: {
          gte: new Date()
        }
      },
      include: {
        pricing_plan: true
      },
      orderBy: {
        subscription_end: 'desc'
      }
    })

    // Get credit balance
    const userCredit = await prisma.user_credits.findUnique({
      where: { userId: userId }
    })

    const creditBalance = userCredit ? userCredit.balance : 0

    return {
      hasActiveSubscription: !!activeSubscription,
      subscription: activeSubscription ? {
        id: activeSubscription.id,
        planName: activeSubscription.pricing_plan.name,
        bundleType: activeSubscription.bundle_type,
        startDate: activeSubscription.subscription_start,
        endDate: activeSubscription.subscription_end,
        daysRemaining: Math.ceil((new Date(activeSubscription.subscription_end) - new Date()) / (1000 * 60 * 60 * 24))
      } : null,
      creditBalance: creditBalance,
      userId: userId
    }
  }
}

/**
 * Check if user has active subscription
 */
export class HasActiveSubscriptionService extends BaseService {
  static async call(userId) {
    const subscription = await prisma.user_purchases.findFirst({
      where: {
        user_id: userId,
        bundle_type: { in: ['subscription', 'hybrid'] },
        subscription_status: 'active',
        subscription_end: {
          gte: new Date()
        }
      }
    })

    return !!subscription
  }
}

/**
 * Get user's credit balance
 */
export class GetUserCreditBalanceService extends BaseService {
  static async call(userId) {
    const userCredit = await prisma.user_credits.findUnique({
      where: { userId: userId }
    })

    return userCredit ? userCredit.balance : 0
  }
}
