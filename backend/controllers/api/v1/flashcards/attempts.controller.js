import { CompleteFlashcardAttemptService } from "../../../../services/flashcard/attempts/completeFlashcardAttemptService.js"
import { GetFlashcardAttemptDetailService } from "../../../../services/flashcard/attempts/getFlashcardAttemptDetailService.js"
import { StartFlashcardWithDeckService } from "../../../../services/flashcard/startFlashcardWithDeckService.js"

class FlashcardAttemptsController {
  async detail(req, res) {
    const { attemptId } = req.params
    const userId = req.user.id

    const attempt = await GetFlashcardAttemptDetailService.call({
      attemptId,
      userId
    })

    return res.status(200).json({
      success: true,
      data: attempt
    })
  }

  async start(req, res) {
    const { attemptId } = req.params
    const { userLearningSessionId, deckId } = req.body
    const userId = req.user.id

    const result = await StartFlashcardWithDeckService.call({
      userLearningSessionId,
      attemptId,
      flashcardDeckId: deckId,
      userId
    })

    return res.status(200).json({
      success: true,
      data: {
        attempt: result.attempt,
        deck_snapshot: result.deckSnapshot
      },
      message: 'Flashcard session started successfully'
    })
  }

  async complete(req, res) {
    const { attemptId } = req.params
    const { answers } = req.body
    const userId = req.user.id

    const result = await CompleteFlashcardAttemptService.call({
      attemptId,
      userId,
      answers
    })

    return res.status(200).json({
      success: true,
      data: result,
      message: 'Flashcard attempt completed successfully'
    })
  }
}

export default new FlashcardAttemptsController()
