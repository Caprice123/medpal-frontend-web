import { ValidationError } from "../../errors/validationError.js"
import prisma from "../../prisma/client.js"
import { BaseService } from "../baseService.js"

export class GetFlashcardDecksService extends BaseService {
    static async call(filters = {}) {
        this.validate(filters)

        const where = {
            is_active: true,
            status: 'ready'
        }

        // Build filter conditions for tags
        const tagFilters = []

        if (filters.university) {
            tagFilters.push({
                flashcard_deck_tags: {
                    some: {
                        tag_id: parseInt(filters.university)
                    }
                }
            })
        }

        if (filters.semester) {
            tagFilters.push({
                flashcard_deck_tags: {
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

        const decks = await prisma.flashcard_decks.findMany({
            where,
            include: {
                flashcard_deck_tags: {
                    include: {
                        tags: true
                    }
                },
                flashcard_cards: {
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
        const transformedDecks = decks.map(deck => ({
            id: deck.id,
            title: deck.title,
            description: deck.description,
            content_type: deck.content_type,
            content: deck.content,
            pdf_url: deck.pdf_url,
            tags: deck.flashcard_deck_tags.map(t => ({
                id: t.tags.id,
                name: t.tags.name,
                type: t.tags.type
            })),
            cardCount: deck.flashcard_cards.length,
            createdAt: deck.created_at,
            updatedAt: deck.updated_at
        }))

        return transformedDecks
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
