import { ValidationError } from "../../errors/validationError.js"
import prisma from "../../prisma/client.js"
import { BaseService } from "../baseService.js"

export class GetExerciseTagsService extends BaseService {
    static async call(filters = {}) {
        this.validate(filters)

        const where = {
            is_active: true
        }

        // Filter by type if provided
        if (filters.type && ['university', 'semester'].includes(filters.type)) {
            where.type = filters.type
        }

        const tags = await prisma.tags.findMany({
            where,
            orderBy: [
                { type: 'asc' },
                { name: 'asc' }
            ]
        })

        return tags
    }

    static validate(filters) {
        if (filters.type && !['university', 'semester'].includes(filters.type)) {
            throw new ValidationError('Type must be either "university" or "semester"')
        }
    }
}
