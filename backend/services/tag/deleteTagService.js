import { ValidationError } from "../../errors/validationError.js"
import prisma from "../../prisma/client.js"
import { BaseService } from "../baseService.js"

export class DeleteTagService extends BaseService {
    static async call(tagId) {
        this.validate(tagId)

        // Check if tag exists
        const existingTag = await prisma.tags.findUnique({
            where: { id: parseInt(tagId) }
        })

        if (!existingTag) {
            throw new ValidationError('Tag not found')
        }

        // Soft delete by setting is_active to false
        const deletedTag = await prisma.tags.update({
            where: { id: parseInt(tagId) },
            data: {
                is_active: false
            }
        })

        return deletedTag
    }

    static validate(tagId) {
        if (!tagId) {
            throw new ValidationError('Tag ID is required')
        }

        const id = parseInt(tagId)
        if (isNaN(id) || id <= 0) {
            throw new ValidationError('Invalid tag ID')
        }
    }
}
