import { ValidationError } from "../../errors/validationError.js"
import prisma from "../../prisma/client.js"
import { BaseService } from "../baseService.js"

export class UpdateTagService extends BaseService {
    static async call(tagId, { name, type }) {
        this.validate(tagId, { name, type })

        // Check if tag exists
        const existingTag = await prisma.tags.findUnique({
            where: { id: parseInt(tagId) }
        })

        if (!existingTag) {
            throw new ValidationError('Tag not found')
        }

        // Check if another tag with same name and type exists (excluding current tag)
        const duplicateTag = await prisma.tags.findFirst({
            where: {
                name,
                type,
                id: {
                    not: parseInt(tagId)
                }
            }
        })

        if (duplicateTag) {
            throw new ValidationError(`Tag "${name}" already exists for type "${type}"`)
        }

        const updatedTag = await prisma.tags.update({
            where: { id: parseInt(tagId) },
            data: {
                name,
                type
            }
        })

        return updatedTag
    }

    static validate(tagId, { name, type }) {
        if (!tagId) {
            throw new ValidationError('Tag ID is required')
        }

        const id = parseInt(tagId)
        if (isNaN(id) || id <= 0) {
            throw new ValidationError('Invalid tag ID')
        }

        if (!name || typeof name !== 'string' || name.trim().length === 0) {
            throw new ValidationError('Tag name is required')
        }

        if (!type || !['university', 'semester'].includes(type)) {
            throw new ValidationError('Type must be either "university" or "semester"')
        }
    }
}
