import { GetExerciseTopicsService } from '../../../services/exercise/getExerciseTopicsService.js'
import { CreateExerciseSessionService } from '../../../services/session/createExerciseSessionService.js'
import { GetListAttemptsService } from '../../../services/exercise/getListAttemptsService.js'
import { CreateNewAttemptService } from '../../../services/session/createNewAttemptService.js'
import { AttemptSerializer } from '../../../serializers/api/v1/exercise/attemptSerializer.js'
import { CompleteSessionService } from '../../../services/session/completeSessionService.js'
import { StartExerciseWithTopicService } from '../../../services/exercise/startExerciseWithTopicService.js'

class ExerciseController {
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

  async start(req, res) {
      const { userLearningSessionId, topicId } = req.body
      const userId = req.user.id
  
      const result = await StartExerciseWithTopicService.call({
        userLearningSessionId,
        exerciseTopicId: topicId,
        userId
      })
  
      return res.status(200).json({
        success: true,
        data: {
          attempt: result.attempt,
          topic_snapshot: result.topicSnapshot
        },
        message: 'Exercise started successfully'
      })
  }

  async attempts(req, res) {
    const { userLearningSessionId } = req.params
    const userId = req.user.id

    const attempts = await GetListAttemptsService.call({
        userLearningSessionId,
        userId
    })

    return res.status(200).json({
        success: true,
        data: AttemptSerializer.serialize(attempts)
    })
  }

  async createNewAttempt(req, res) {
    const { userLearningSessionId } = req.params
    const userId = req.user.id

    const result = await CreateNewAttemptService.call({
        userLearningSessionId,
        userId
    })

    return res.status(201).json({
        success: true,
        data: result,
        message: 'New attempt created successfully'
    })
  }

  async completeAttempt(req, res) {
    const { attemptId, answers } = req.body
    const userId = req.user.id

    const result = await CompleteSessionService.call({
        attemptId,
        userId,
        answers
    })

    return res.status(200).json({
        success: true,
        data: result,
        message: 'Attempt completed successfully'
    })
  }
}

export default new ExerciseController()
