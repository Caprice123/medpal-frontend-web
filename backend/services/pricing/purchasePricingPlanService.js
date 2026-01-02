import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'

export class PurchasePricingPlanService extends BaseService {
  static async call(userId, pricingPlanId, paymentMethod = 'manual') {
    // Get the pricing plan
    const plan = await prisma.pricing_plans.findUnique({
      where: { id: pricingPlanId }
    })

    if (!plan) {
      throw new Error('Pricing plan not found')
    }

    if (!plan.is_active) {
      throw new Error('Pricing plan is not active')
    }

    // For Xendit payments, create purchase with pending status
    // Create subscription with 'not_active' status
    // Credits will be granted after webhook confirms payment
    if (paymentMethod === 'xendit') {
      const result = await prisma.$transaction(async (tx) => {
        // 1. Create the purchase record with pending status
        const purchase = await tx.user_purchases.create({
          data: {
            user_id: userId,
            pricing_plan_id: pricingPlanId,
            bundle_type: plan.bundle_type,
            payment_status: 'pending',
            payment_method: paymentMethod,
            amount_paid: plan.price
          },
          include: {
            pricing_plan: true
          }
        })

        // 2. Create subscription record with 'not_active' status if plan includes subscription
        if (plan.bundle_type === 'subscription' || plan.bundle_type === 'hybrid') {
          // Check if user has an active subscription
          const activeSubscription = await tx.user_subscriptions.findFirst({
            where: {
              user_id: userId,
              end_date: { gte: new Date() },
              status: 'active' // Only consider active subscriptions
            },
            orderBy: {
              end_date: 'desc' // Get the latest ending subscription
            }
          })

          let subscriptionStart
          let subscriptionEnd

          if (activeSubscription) {
            // If user has active subscription, extend from current end date
            subscriptionStart = activeSubscription.end_date
            subscriptionEnd = new Date(subscriptionStart)
            subscriptionEnd.setDate(subscriptionEnd.getDate() + (plan.duration_days || 30))
          } else {
            // If no active subscription, start from today
            subscriptionStart = new Date()
            subscriptionEnd = new Date(subscriptionStart)
            subscriptionEnd.setDate(subscriptionEnd.getDate() + (plan.duration_days || 30))
          }

          await tx.user_subscriptions.create({
            data: {
              user_id: userId,
              start_date: subscriptionStart,
              end_date: subscriptionEnd,
              status: 'not_active' // Mark as not_active until payment is confirmed
            }
          })
        }

        return purchase
      })

      return result
    }

    // For manual/other payment methods, complete immediately
    // Create purchase and properly populate all 4 tables in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // 1. Create the purchase record (user_purchases table)
      const purchase = await tx.user_purchases.create({
        data: {
          user_id: userId,
          pricing_plan_id: pricingPlanId,
          bundle_type: plan.bundle_type,
          payment_status: 'completed',
          payment_method: paymentMethod,
          amount_paid: plan.price
        },
        include: {
          pricing_plan: true
        }
      })

      // 2. Create subscription record if plan includes subscription (user_subscriptions table)
      if (plan.bundle_type === 'subscription' || plan.bundle_type === 'hybrid') {
        // Check if user has an active subscription
        const activeSubscription = await tx.user_subscriptions.findFirst({
          where: {
            user_id: userId,
            end_date: { gte: new Date() },
            status: 'active' // Only consider active subscriptions
          },
          orderBy: {
            end_date: 'desc' // Get the latest ending subscription
          }
        })

        let subscriptionStart
        let subscriptionEnd

        if (activeSubscription) {
          // If user has active subscription, extend from current end date
          subscriptionStart = activeSubscription.end_date
          subscriptionEnd = new Date(subscriptionStart)
          subscriptionEnd.setDate(subscriptionEnd.getDate() + (plan.duration_days || 30))
        } else {
          // If no active subscription, start from today
          subscriptionStart = new Date()
          subscriptionEnd = new Date(subscriptionStart)
          subscriptionEnd.setDate(subscriptionEnd.getDate() + (plan.duration_days || 30))
        }

        await tx.user_subscriptions.create({
          data: {
            user_id: userId,
            start_date: subscriptionStart,
            end_date: subscriptionEnd,
            status: 'active' // Payment already confirmed for manual purchases
          }
        })
      }

      // 3. Add credits to user's balance if plan includes credits (user_credits table)
      if (plan.credits_included > 0) {
        // Find or create user credits
        let userCredit = await tx.user_credits.findUnique({
          where: { user_id: userId }
        })

        if (!userCredit) {
          userCredit = await tx.user_credits.create({
            data: {
              user_id: userId,
              balance: 0
            }
          })
        }

        const balanceBefore = userCredit.balance
        const balanceAfter = balanceBefore + plan.credits_included

        // Update balance
        await tx.user_credits.update({
          where: { user_id: userId },
          data: {
            balance: balanceAfter,
            updated_at: new Date()
          }
        })

        // 4. Create credit transaction ledger record (credit_transactions table)
        await tx.credit_transactions.create({
          data: {
            user_id: userId,
            user_credit_id: userCredit.id,
            type: plan.bundle_type === 'credits' ? 'purchase' : 'subscription_bonus',
            amount: plan.credits_included,
            balance_before: balanceBefore,
            balance_after: balanceAfter,
            description: `Credits from ${plan.name}`,
            payment_status: 'completed',
            payment_method: paymentMethod
          }
        })
      }

      return purchase
    })

    return result
  }
}
