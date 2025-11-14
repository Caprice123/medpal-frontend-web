import prisma from '../../prisma/client.js'
import { BaseService } from '../baseService.js'
import { ValidationError } from '../../errors/validationError.js'

export class CompleteSessionService extends BaseService {
  static async call({ attemptId, userId, answers = null }) {
    // Validate inputs
    if (!attemptId) {
      throw new ValidationError('Attempt ID is required')
    }

    const result = await prisma.$transaction(async (tx) => {
      // Fetch the attempt with questions
      const attempt = await tx.exercise_session_attempts.findUnique({
        where: { id: parseInt(attemptId) },
        include: {
          exercise_session_questions: {
            orderBy: { order: 'asc' }
          },
          exercise_session_answers: true,
          exercise_session: {
            include: {
              user_learning_sessions: true
            }
          }
        }
      })

      if (!attempt) {
        throw new ValidationError('Attempt not found')
      }

      if (userId && attempt.exercise_session.user_learning_session.user_id !== parseInt(userId)) {
        throw new ValidationError('Unauthorized to complete this attempt')
      }

      if (attempt.status !== 'active') {
        throw new ValidationError(`Attempt is not active. Current status: ${attempt.status}`)
      }

      let correctCount = attempt.score || 0
      let answerResults = []

      // Process answers if provided
      if (answers && answers.length > 0) {
        // Create a map of question_id to session question for quick lookup
        const sessionQuestionsMap = {}
        attempt.exercise_session_questions.forEach(q => {
          sessionQuestionsMap[q.question_id] = q
        })

        // Process each answer
        for (const answer of answers) {
          const sessionQuestion = sessionQuestionsMap[answer.questionId]

          if (!sessionQuestion) {
            throw new ValidationError(`Question ${answer.questionId} not found in this attempt`)
          }

          // Check if answer is correct (case-insensitive comparison)
          const isCorrect = answer.userAnswer.trim().toLowerCase() === sessionQuestion.answer_text.trim().toLowerCase()

          if (isCorrect) {
            correctCount++
          }

          // Create answer record
          const answerRecord = await tx.exercise_session_answers.create({
            data: {
              exercise_session_attempt_id: attempt.id,
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

      // Update attempt with score and completed status
      const updatedAttempt = await tx.exercise_session_attempts.update({
        where: { id: parseInt(attemptId) },
        data: {
          score: correctCount,
          status: 'completed',
          completed_at: new Date()
        }
      })
    })

    return result
  }
}
