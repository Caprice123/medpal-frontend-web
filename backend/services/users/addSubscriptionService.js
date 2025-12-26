import { ValidationError } from '#errors/validationError';
import prisma from '#prisma/client';
import { parseDateAsGMT7 } from '#utils/dateUtils';
import { BaseService } from "../baseService.js";
import moment from "moment-timezone";

export class AddSubscriptionService extends BaseService {
    static async call(userId, startDate, endDate) {
        // Validate user exists
        const user = await prisma.users.findUnique({
            where: { id: userId }
        });

        if (!user) {
            throw new ValidationError("User not found");
        }

        // Parse dates in GMT+7 using moment-timezone
        const start = parseDateAsGMT7(startDate);
        const end = parseDateAsGMT7(endDate);

        if (!start || !end || isNaN(start.getTime()) || isNaN(end.getTime())) {
            throw new ValidationError("Invalid date format");
        }

        if (end <= start) {
            throw new ValidationError("End date must be after start date");
        }

        // Current Date (GMT+7)
        const now = moment().tz("Asia/Jakarta").toDate();

        // Check if user has an active subscription
        const activeSub = await prisma.user_subscriptions.findFirst({
            where: {
                user_id: userId,
                start_date: { lte: now },
                end_date: { gte: now }
            }
        });

        // If active subscription exists -> update end_date
        if (activeSub) {
            await prisma.user_subscriptions.update({
                where: { id: activeSub.id },
                data: {
                    end_date: end
                }
            });

            return;
        }

        // If no active subscription -> create new one
        await prisma.user_subscriptions.create({
            data: {
                user_id: userId,
                start_date: start,
                end_date: end,
            },
        })
    }
}
