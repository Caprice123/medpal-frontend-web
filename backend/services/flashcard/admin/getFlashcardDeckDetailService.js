import { ValidationError } from "../../../errors/validationError.js"
import prisma from "../../../prisma/client.js"
import { BaseService } from "../../baseService.js"

export class GetFlashcardDeckDetailService extends BaseService {
    static async call(deckId) {
        this.validate(deckId)

        const deck = await prisma.flashcard_decks.findUnique({
            where: { id: parseInt(deckId) },
            include: {
                flashcard_cards: {
                    orderBy: { order: 'asc' }
                },
                flashcard_deck_tags: {
                    include: {
                        tags: true
                    }
                }
            }
        })

        if (!deck) {
            throw new ValidationError('Deck not found')
        }

        // Transform tags to simpler format
        const transformedDeck = {
            ...deck,
            tags: deck.flashcard_deck_tags.map(t => ({
                id: t.tags.id,
                name: t.tags.name,
                type: t.tags.type
            }))
        }

        return transformedDeck
    }

    static validate(deckId) {
        if (!deckId) {
            throw new ValidationError('Deck ID is required')
        }

        const id = parseInt(deckId)
        if (isNaN(id) || id <= 0) {
            throw new ValidationError('Invalid deck ID')
        }
    }
}
