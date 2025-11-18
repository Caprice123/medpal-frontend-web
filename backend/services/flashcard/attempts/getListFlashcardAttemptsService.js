import prisma from '../../../prisma/client.js'
import { BaseService } from '../../baseService.js'
import { ValidationError } from '../../../errors/validationError.js'

export class GetListFlashcardAttemptsService extends BaseService {
  static async call({ userLearningSessionId, userId, page = 1, perPage = 30 }) {
    // Validate inputs
    if (!userLearningSessionId) {
      throw new ValidationError('User learning session ID is required')
    }

    // Calculate limit and offset from page and perPage
    const limit = parseInt(perPage)
    const offset = (parseInt(page) - 1) * limit

    // Get the learning session with flashcard session and paginated attempts
    const userLearningSession = await prisma.user_learning_sessions.findUnique({
      where: { id: parseInt(userLearningSessionId), user_id: userId },
      include: {
        flashcard_session: {
          include: {
            flashcard_deck: {
              select: {
                id: true,
                title: true,
                description: true
              }
            },
            flashcard_session_attempts: {
              select: {
                id: true,
                attempt_number: true,
                started_at: true,
                completed_at: true
              },
              orderBy: {
                id: 'desc'
              },
              take: limit + 1, // Fetch one extra to check if there's more
              skip: offset
            }
          }
        }
      }
    })

    if (!userLearningSession) {
      throw new ValidationError('Learning session not found')
    }

    // Get flashcard session
    const flashcardSession = userLearningSession.flashcard_session

    if (!flashcardSession) {
      throw new ValidationError('No flashcard session found')
    }

    // Check if there are more results
    const allAttempts = flashcardSession.flashcard_session_attempts
    const hasMore = allAttempts.length > limit
    const isLastPage = !hasMore

    // Get only the requested number of attempts (exclude the extra one)
    const attemptsToReturn = hasMore ? allAttempts.slice(0, limit) : allAttempts

    // Transform attempts with metadata only (no cards/answers)
    const attempts = attemptsToReturn.map(attempt => {
      return {
        id: attempt.id,
        attemptNumber: attempt.attempt_number,
        started_at: attempt.started_at,
        completed_at: attempt.completed_at,
        total_cards: flashcardSession.total_cards,
        credits_used: flashcardSession.credits_used,
        deck_id: flashcardSession.flashcard_deck_id,
        deck_title: flashcardSession.flashcard_deck?.title,
        deck_description: flashcardSession.flashcard_deck?.description
      }
    })

    return {
      data: attempts,
      pagination: {
        page: parseInt(page),
        perPage: limit,
        isLastPage: isLastPage
      }
    }
  }
}
