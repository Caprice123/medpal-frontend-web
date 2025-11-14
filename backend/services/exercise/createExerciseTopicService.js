import { ValidationError } from "../../errors/validationError.js"
import prisma from "../../prisma/client.js"
import { BaseService } from "../baseService.js"

export class CreateExerciseTopicService extends BaseService {
    static async call({ title, description, content_type, content, pdf_url, tags, questions, created_by }) {
        // Validate inputs
        await this.validate({ title, description, content_type, content, pdf_url, tags, questions })

        // Create topic with questions and tags
        const topic = await prisma.exercise_topics.create({
            data: {
                title,
                description: description || '',
                content_type,
                content: content_type === 'text' ? content : null,
                pdf_url: content_type === 'pdf' ? pdf_url : null,
                status: 'ready',
                created_by: created_by,
                questions: {
                    create: questions.map((q, index) => ({
                        question: q.question,
                        answer: q.answer,
                        explanation: q.explanation || '',
                        order: q.order !== undefined ? q.order : index
                    }))
                },
                tags: {
                    create: tags.map(tag => ({
                        tag_id: typeof tag === 'object' ? tag.id : tag
                    }))
                }
            },
            include: {
                questions: {
                    orderBy: { order: 'asc' }
                },
                tags: {
                    include: {
                        tag: true
                    }
                }
            }
        })

        return topic
    }

    static async validate({ title, content_type, content, pdf_url, tags, questions }) {
        // Validate required fields
        if (!title) {
            throw new ValidationError('Title is required')
        }

        if (!content_type || !['text', 'pdf'].includes(content_type)) {
            throw new ValidationError('Content type must be either "text" or "pdf"')
        }

        if (content_type === 'text' && !content) {
            throw new ValidationError('Content is required for text type')
        }

        if (content_type === 'pdf' && !pdf_url) {
            throw new ValidationError('PDF URL is required for pdf type')
        }

        if (!tags || tags.length === 0) {
            throw new ValidationError('At least one tag is required')
        }

        if (!questions || questions.length === 0) {
            throw new ValidationError('At least one question is required')
        }

        // Validate tags exist
        const tagIds = tags.map(t => typeof t === 'object' ? t.id : t)
        const existingTags = await prisma.tags.findMany({
            where: {
                id: { in: tagIds },
                is_active: true
            }
        })

        if (existingTags.length !== tagIds.length) {
            throw new ValidationError('Some tags are invalid or inactive')
        }
    }
}