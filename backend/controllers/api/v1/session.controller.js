import { CreateExerciseSessionService } from '../../../services/session/createExerciseSessionService.js'
import { SubmitAnswerService } from '../../../services/session/submitAnswerService.js'
import { CompleteSessionService } from '../../../services/session/completeSessionService.js'
import { GetUserSessionsService } from '../../../services/session/getUserSessionsService.js'
import { GetSessionDetailService } from '../../../services/session/getSessionDetailService.js'
import { CreateSessionService } from '../../../services/session/createSessionService.js'
import { StartExerciseWithTopicService } from '../../../services/session/startExerciseWithTopicService.js'

class SessionController {
  // Create a new learning session
  async create(req, res) {
    const { sessionType } = req.body
    const userId = req.user.id

    const result = await CreateSessionService.call({ userId, sessionType })

    return res.status(201).json({
      success: true,
      data: {
        user_learning_session_id: result.userLearningSession.id,
        exercise_session_id: result.exerciseSession?.id,
        session_type: result.userLearningSession.type,
        status: result.exerciseSession?.status || 'not_started'
      },
      message: 'Session created successfully'
    })
  }

  // Start exercise with topic selection
  async startExerciseWithTopic(req, res) {
    const { sessionId } = req.params
    const { topicId } = req.body
    const userId = req.user.id

    const result = await StartExerciseWithTopicService.call({
      exerciseSessionId: sessionId,
      exerciseTopicId: topicId,
      userId
    })

    return res.status(200).json({
      success: true,
      data: {
        session: result.session,
        topic_snapshot: result.topicSnapshot
      },
      message: 'Exercise started successfully'
    })
  }
  // Create a new exercise session
  async createExerciseSession(req, res) {
    const { exerciseTopicId } = req.body
    const userId = req.user.id

    const result = await CreateExerciseSessionService.call({
      userId,
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

  // Submit an answer for a question
  async submitAnswer(req, res) {
    const { sessionId } = req.params
    const { questionId, userAnswer, timeTakenSeconds } = req.body

    const result = await SubmitAnswerService.call({
      exerciseSessionId: sessionId,
      questionId,
      userAnswer,
      timeTakenSeconds
    })

    return res.status(200).json({
      success: true,
      data: {
        is_correct: result.isCorrect,
        correct_answer: result.correctAnswer,
        explanation: result.explanation,
        answer_id: result.answer.id
      }
    })
  }

  // Complete a session
  async completeSession(req, res) {
    const { sessionId } = req.params
    const { answers } = req.body
    const userId = req.user.id

    const result = await CompleteSessionService.call({
      exerciseSessionId: sessionId,
      userId,
      answers
    })

    return res.status(200).json({
      success: true,
      data: result,
      message: 'Session completed successfully'
    })
  }

  // Get user's session history
  async getUserSessions(req, res) {
    const userId = req.user.id
    const { status, limit, offset } = req.query

    const result = await GetUserSessionsService.call({
      userId,
      status,
      limit: limit ? parseInt(limit) : 20,
      offset: offset ? parseInt(offset) : 0
    })

    return res.status(200).json({
      success: true,
      data: result
    })
  }

  // Get session detail
  async getSessionDetail(req, res) {
    const { sessionId } = req.params
    const userId = req.user.id

    const session = await GetSessionDetailService.call({
      sessionId,
      userId
    })

    return res.status(200).json({
      success: true,
      data: session
    })
  }
}

export default new SessionController()
