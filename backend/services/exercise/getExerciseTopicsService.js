import { ValidationError } from "../../errors/validationError.js"
import prisma from "../../prisma/client.js"
import { BaseService } from "../baseService.js"

export class GetExerciseTopicsService extends BaseService {
    static async call(filters = {}) {
        this.validate(filters)

        const where = {}

        // Build filter conditions for tags
        const tagFilters = []

        if (filters.university) {
            tagFilters.push({
                tags: {
                    some: {
                        tag_id: parseInt(filters.university)
                    }
                }
            })
        }

        if (filters.semester) {
            tagFilters.push({
                tags: {
                    some: {
                        tag_id: parseInt(filters.semester)
                    }
                }
            })
        }

        // Apply tag filters with AND logic
        if (tagFilters.length > 0) {
            where.AND = tagFilters
        }

        const topics = await prisma.exercise_topics.findMany({
            where,
            include: {
                tags: {
                    include: {
                        tag: true
                    }
                },
                questions: {
                    select: {
                        id: true
                    }
                }
            },
            orderBy: {
                created_at: 'desc'
            }
        })

        // Transform the response to match frontend expectations
        const transformedTopics = topics.map(topic => ({
            id: topic.id,
            title: topic.title,
            description: topic.description,
            content_type: topic.content_type,
            content: topic.content,
            pdf_url: topic.pdf_url,
            tags: topic.tags.map(t => ({
                id: t.tag.id,
                name: t.tag.name,
                type: t.tag.type
            })),
            questionCount: topic.questions.length,
            createdAt: topic.created_at,
            updatedAt: topic.updated_at
        }))

        return transformedTopics
    }

    static validate(filters) {
        // Validate university filter if provided
        if (filters.university) {
            const universityId = parseInt(filters.university)
            if (isNaN(universityId) || universityId <= 0) {
                throw new ValidationError('Invalid university filter')
            }
        }

        // Validate semester filter if provided
        if (filters.semester) {
            const semesterId = parseInt(filters.semester)
            if (isNaN(semesterId) || semesterId <= 0) {
                throw new ValidationError('Invalid semester filter')
            }
        }
    }
}
