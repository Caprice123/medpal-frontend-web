import { GetExerciseTopicsService } from '../../../services/exercise/getExerciseTopicsService.js'
import { CreateExerciseTopicService } from '../../../services/exercise/createExerciseTopicService.js'
import { ExerciseTopicSerializer } from '../../../serializers/admin/v1/exerciseTopicSerializer.js'
import { CreateExerciseSessionService } from '../../../services/session/createExerciseSessionService.js'

class ExerciseController {
  /**
   * Get all topics with optional filters (for regular users)
   * GET /api/v1/exercises/topics
   */
  async getTopics(req, res) {
    const { university, semester } = req.query

    const topics = await GetExerciseTopicsService.call({ university, semester })

    return res.status(200).json({
      success: true,
      data: topics
    })
  }

  async create(req, res) {
    const { sessionId, exerciseTopicId } = req.body
    const userId = req.user.id

    const result = await CreateExerciseSessionService.call({
        userId,
        sessionId, 
        exerciseTopicId
    })

    return res.status(201).json({
        success: true,
        data: {
        session_id: result.exerciseSession.id,
        user_learning_session_id: result.userLearningSession.id,
        topic_snapshot: result.topicSnapshot,
        credits_used: result.exerciseSession.credits_used,
        total_questions: result.exerciseSession.total_questions
        },
        message: 'Exercise session created successfully'
    })
  }
}

export default new ExerciseController()
