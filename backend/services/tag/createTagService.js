import { ValidationError } from "../../errors/validationError.js"
import prisma from "../../prisma/client.js"
import { BaseService } from "../baseService.js"

export class CreateTagService extends BaseService {
    static async call({ name, type }) {
        this.validate({ name, type })

        // Check if tag with same name and type already exists
        const existingTag = await prisma.tags.findFirst({
            where: {
                name,
                type
            }
        })

        if (existingTag) {
            throw new ValidationError(`Tag "${name}" already exists for type "${type}"`)
        }

        const tag = await prisma.tags.create({
            data: {
                name,
                type,
                is_active: true
            }
        })

        return tag
    }

    static validate({ name, type }) {
        if (!name || typeof name !== 'string' || name.trim().length === 0) {
            throw new ValidationError('Tag name is required')
        }

        if (!type || !['university', 'semester'].includes(type)) {
            throw new ValidationError('Type must be either "university" or "semester"')
        }
    }
}
