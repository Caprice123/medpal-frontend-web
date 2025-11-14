import prisma from '../../prisma/client.js'
import { BaseService } from '../baseService.js'
import { ValidationError } from '../../errors/validationError.js'

export class CompleteSessionService extends BaseService {
  static async call({ exerciseSessionId, userId, answers = null }) {
    // Validate inputs
    if (!exerciseSessionId) {
      throw new ValidationError('Exercise session ID is required')
    }

    const result = await prisma.$transaction(async (tx) => {
      // Fetch the session with questions
      const session = await tx.exercise_sessions.findUnique({
        where: { id: parseInt(exerciseSessionId) },
        include: {
          exercise_session_questions: {
            orderBy: { order: 'asc' }
          },
          exercise_session_answers: true
        }
      })

      if (!session) {
        throw new ValidationError('Exercise session not found')
      }

      if (userId && session.user_id !== parseInt(userId)) {
        throw new ValidationError('Unauthorized to complete this session')
      }

      if (session.status !== 'active') {
        throw new ValidationError(`Exercise session is not active. Current status: ${session.status}`)
      }

      let correctCount = session.score || 0
      let answerResults = []

      // Process answers if provided
      if (answers && answers.length > 0) {
        // Create a map of question_id to session question for quick lookup
        const sessionQuestionsMap = {}
        session.exercise_session_questions.forEach(q => {
          sessionQuestionsMap[q.question_id] = q
        })

        // Process each answer
        for (const answer of answers) {
          const sessionQuestion = sessionQuestionsMap[answer.questionId]

          if (!sessionQuestion) {
            throw new ValidationError(`Question ${answer.questionId} not found in this session`)
          }

          // Check if answer is correct (case-insensitive comparison)
          const isCorrect = answer.userAnswer.trim().toLowerCase() === sessionQuestion.answer_text.trim().toLowerCase()

          if (isCorrect) {
            correctCount++
          }

          // Create answer record
          const answerRecord = await tx.exercise_session_answers.create({
            data: {
              exercise_session_id: session.id,
              exercise_session_question_id: sessionQuestion.id,
              user_answer: answer.userAnswer,
              is_correct: isCorrect,
              time_taken_seconds: answer.timeTakenSeconds || 0
            }
          })

          answerResults.push({
            questionId: answer.questionId,
            userAnswer: answer.userAnswer,
            correctAnswer: sessionQuestion.answer_text,
            explanation: sessionQuestion.explanation,
            isCorrect,
            answerId: answerRecord.id
          })
        }
      }

      // Update exercise session with score and completed status
      const exerciseSession = await tx.exercise_sessions.update({
        where: { id: parseInt(exerciseSessionId) },
        data: {
          score: correctCount,
          status: 'completed',
          completed_at: new Date()
        }
      })

      // Update parent learning session
      await tx.user_learning_sessions.update({
        where: { id: session.user_learning_session_id },
        data: {
          status: 'completed',
          ended_at: new Date()
        }
      })

      // Calculate statistics
      const totalAnswered = session.exercise_session_answers.length + (answers?.length || 0)
      const percentage = session.total_questions > 0 ? Math.round((correctCount / session.total_questions) * 100) : 0

      return {
        session: exerciseSession,
        answers: answerResults,
        statistics: {
          totalQuestions: session.total_questions,
          correctAnswers: correctCount,
          incorrectAnswers: session.total_questions - correctCount,
          totalAnswered,
          percentage,
          creditsUsed: session.credits_used
        }
      }
    })

    return result
  }
}
