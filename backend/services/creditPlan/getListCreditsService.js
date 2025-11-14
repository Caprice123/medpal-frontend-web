import { BaseService } from "../baseService.js";
import prisma from '../../prisma/client.js';

export class GetListCreditsService extends BaseService {
    static async call(req) {
        const where = {}


        const plans = await prisma.credit_plans.findMany({
            where: where,
            orderBy: [
                { order: 'asc' },
                { createdAt: 'desc' }
            ]
        })
    }
}