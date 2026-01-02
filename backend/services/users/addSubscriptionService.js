import { ValidationError } from '#errors/validationError';
import prisma from '#prisma/client';
import { BaseService } from "../baseService.js";

export class AddSubscriptionService extends BaseService {
    /**
     * Add a subscription for a user
     * @param {number} userId - User ID
     * @param {string|Date} startDate - Start date of the subscription
     * @param {string|Date} endDate - End date of the subscription
     */
    static async call(userId, startDate, endDate) {
        // Validate user exists
        const user = await prisma.users.findUnique({
            where: { id: userId }
        });

        if (!user) {
            throw new ValidationError("User not found");
        }

        // Parse and validate dates
        const start = new Date(startDate);
        const end = new Date(endDate);

        if (isNaN(start.getTime())) {
            throw new ValidationError("Invalid start date");
        }

        if (isNaN(end.getTime())) {
            throw new ValidationError("Invalid end date");
        }

        if (end <= start) {
            throw new ValidationError("End date must be after start date");
        }

        // Create new subscription with 'active' status
        await prisma.user_subscriptions.create({
            data: {
                user_id: userId,
                start_date: start,
                end_date: end,
                status: 'active'
            }
        });
    }
}
