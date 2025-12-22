import { ValidationError } from "../../errors/validationError.js"
import prisma from "../../prisma/client.js"
import { BaseService } from "../baseService.js"
import { GetConstantsService } from "../constant/getConstantsService.js"

export class GetExerciseTopicsService extends BaseService {
    static async call(filters = {}) {
        this.validate(filters)

        const where = {}

        // Build filter conditions for tags
        const tagFilters = []

        if (filters.university) {
            tagFilters.push({
                exercise_topic_tags: {
                    some: {
                        tag_id: parseInt(filters.university)
                    }
                }
            })
        }

        if (filters.semester) {
            tagFilters.push({
                exercise_topic_tags: {
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
                exercise_topic_tags: {
                    include: {
                        tags: true
                    }
                },
                exercise_questions: {
                    select: {
                        id: true
                    }
                }
            },
            orderBy: {
                created_at: 'desc'
            }
        })

        const exerciseConstant = await GetConstantsService.call([
            "exercise_credit_cost",
        ])
        const cost = exerciseConstant.exercise_credit_cost

        // Transform the response to match frontend expectations
        const transformedTopics = topics.map(topic => ({
            id: topic.id,
            title: topic.title,
            description: topic.description,
            content_type: topic.content_type,
            content: topic.content,
            pdf_url: topic.pdf_url,
            cost: parseFloat(cost),
            tags: topic.exercise_topic_tags.map(t => ({
                id: t.tags.id,
                name: t.tags.name,
                tagGroupId: t.tags.tag_group_id
            })),
            questionCount: topic.exercise_questions.length,
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
