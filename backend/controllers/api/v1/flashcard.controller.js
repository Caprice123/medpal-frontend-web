import { GetFlashcardDecksService } from '../../../services/flashcard/getFlashcardDecksService.js'
import { GetListFlashcardAttemptsService } from '../../../services/flashcard/attempts/getListFlashcardAttemptsService.js'
import { CreateNewFlashcardAttemptService } from '../../../services/flashcard/attempts/createNewFlashcardAttemptService.js'

class FlashcardController {
  async getDecks(req, res) {
    const { university, semester } = req.query

    const decks = await GetFlashcardDecksService.call({ university, semester })

    return res.status(200).json({
      success: true,
      data: decks
    })
  }

  async attempts(req, res) {
    const { userLearningSessionId } = req.params
    const { limit, offset } = req.query
    const userId = req.user.id

    const result = await GetListFlashcardAttemptsService.call({
      userLearningSessionId,
      userId,
      limit,
      offset
    })

    return res.status(200).json({
      success: true,
      data: result.data,
      pagination: result.pagination
    })
  }

  async createAttempt(req, res) {
    const { userLearningSessionId } = req.params
    const userId = req.user.id

    const result = await CreateNewFlashcardAttemptService.call({
      userLearningSessionId,
      userId
    })

    return res.status(201).json({
      success: true,
      data: result,
      message: 'New attempt created successfully'
    })
  }
}

export default new FlashcardController()
