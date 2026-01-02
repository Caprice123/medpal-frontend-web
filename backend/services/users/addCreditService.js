import { ValidationError } from '#errors/validationError';
import prisma from '#prisma/client';
import { BaseService } from "../baseService.js";

export class AddCreditService extends BaseService {
    static async call(userId, credit) {
        // Validate user exists
        const user = await prisma.users.findUnique({
            where: { id: userId }
        });

        if (!user) {
            throw new ValidationError("User not found");
        }

        // Validate credit amount
        const creditAmount = parseFloat(credit);
        if (isNaN(creditAmount) || creditAmount === 0) {
            throw new ValidationError("Credit must be a non-zero number");
        }

        // Perform credit adjustment in a transaction
        await prisma.$transaction(async (tx) => {
            // Find or create user credits
            let userCredit = await tx.user_credits.findUnique({
                where: { user_id: userId }
            });

            if (!userCredit) {
                userCredit = await tx.user_credits.create({
                    data: {
                        user_id: userId,
                        balance: 0
                    }
                });
            }

            const balanceBefore = userCredit.balance;
            const balanceAfter = Number(balanceBefore) + Number(creditAmount);

            // Update balance
            await tx.user_credits.update({
                where: { user_id: userId },
                data: {
                    balance: balanceAfter,
                    updated_at: new Date()
                }
            });

            // Create credit transaction ledger record
            await tx.credit_transactions.create({
                data: {
                    user_id: userId,
                    user_credit_id: userCredit.id,
                    type: creditAmount > 0 ? 'admin_bonus' : 'admin_deduction',
                    amount: creditAmount,
                    balance_before: balanceBefore,
                    balance_after: balanceAfter,
                    description: creditAmount > 0
                        ? `Admin added ${creditAmount} credits`
                        : `Admin deducted ${Math.abs(creditAmount)} credits`,
                    payment_status: 'completed',
                    payment_method: 'manual_admin'
                }
            });
        });
    }
}