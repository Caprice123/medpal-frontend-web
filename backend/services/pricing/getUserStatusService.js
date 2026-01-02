import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'
import moment from 'moment-timezone'

/**
 * Get comprehensive user status including subscription and credits
 */
export class GetUserStatusService extends BaseService {
  static async call(userId) {
    // Get active subscription from user_subscriptions table
    const activeSubscription = await prisma.user_subscriptions.findFirst({
      where: {
        user_id: userId,
        status: 'active',
        end_date: {
          gte: new Date()
        }
      },
      orderBy: {
        end_date: 'desc'
      }
    })

    // Get credit balance
    const userCredit = await prisma.user_credits.findUnique({
      where: { user_id: userId }
    })

    const creditBalance = userCredit ? userCredit.balance : 0

    return {
      hasActiveSubscription: !!activeSubscription,
      subscription: activeSubscription ? {
        id: activeSubscription.id,
        startDate: activeSubscription.start_date,
        endDate: activeSubscription.end_date,
        status: activeSubscription.status,
        daysRemaining: Math.ceil((new Date(activeSubscription.end_date) - new Date()) / (1000 * 60 * 60 * 24))
      } : null,
      creditBalance: parseFloat(creditBalance) || 0,
      userId: userId
    }
  }
}

/**
 * Check if user has active subscription
 */
export class HasActiveSubscriptionService extends BaseService {
  static async call(userId) {
    if (process.env.NODE_ENV == "development") {
        return true
    }
    const subscription = await prisma.user_subscriptions.findFirst({
      where: {
        user_id: userId,
        status: 'active',
        start_date: {
            lte: moment(new Date()).toDate()
        },
        end_date: {
            gte: moment(new Date()).toDate()
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
      where: { user_id: userId }
    })

    return userCredit ? userCredit.balance : 0
  }
}
