import { actions } from '@store/session/reducer'
import Endpoints from '@config/endpoint'
import { handleApiError } from '@utils/errorUtils'
import { getWithToken, postWithToken } from '../../utils/requestUtils'

const {
  setCurrentSession,
  setTopicSnapshot,
  setCurrentQuestionIndex,
  addAnswer,
  clearCurrentSession,
  setSessions,
  setSessionDetail,
  setPagination,
  setLoading,
  setError,
  clearError
} = actions

// ============= Session Management Actions =============


export const createSession = (sessionType, onSuccess) => async (dispatch) => {
    try {
        dispatch(setLoading({ key: 'isCreatingSession', value: true }))
        dispatch(clearError())

        const response = await postWithToken(Endpoints.sessions.create, {
            sessionType
        })

        const { data } = response.data

        dispatch(setCurrentSession({
          id: data.exercise_session_id,
          userLearningSessionId: data.user_learning_session_id,
          status: data.status
        }))

        if (onSuccess) onSuccess(data)
        return data
    } catch (err) {
        handleApiError(err, dispatch)
        throw err
    } finally {
        dispatch(setLoading({ key: 'isCreatingSession', value: false }))
    }
}

/**
 * Start exercise with topic selection
 */
export const startExerciseWithTopic = (sessionId, topicId) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isCreatingSession', value: true }))
    dispatch(clearError())

    const response = await postWithToken(Endpoints.sessions.startExercise(sessionId), {
      topicId
    })

    const data = response.data.data

    dispatch(setTopicSnapshot(data.topic_snapshot))
    dispatch(setCurrentSession({
      id: data.session.id,
      status: data.session.status,
      creditsUsed: data.session.credits_used,
      totalQuestions: data.session.total_questions,
      score: data.session.score
    }))
    dispatch(setCurrentQuestionIndex(0))

    return data
  } catch (err) {
    handleApiError(err, dispatch)
    throw err
  } finally {
    dispatch(setLoading({ key: 'isCreatingSession', value: false }))
  }
}

/**
 * Create a new exercise session (old flow - direct with topic)
 */
export const createExerciseSession = (exerciseTopicId) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isCreatingSession', value: true }))
    dispatch(clearError())

    const response = await postWithToken(Endpoints.sessions.createExercise, {
      exerciseTopicId
    })

    const data = response.data.data

    dispatch(setCurrentSession({
      id: data.session_id,
      userLearningSessionId: data.user_learning_session_id,
      creditsUsed: data.credits_used,
      totalQuestions: data.total_questions
    }))
    dispatch(setTopicSnapshot(data.topic_snapshot))
    dispatch(setCurrentQuestionIndex(0))

    return data
  } catch (err) {
    handleApiError(err, dispatch)
    throw err
  } finally {
    dispatch(setLoading({ key: 'isCreatingSession', value: false }))
  }
}

/**
 * Submit an answer for the current question
 */
export const submitAnswer = (sessionId, questionId, userAnswer, timeTakenSeconds) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isSubmittingAnswer', value: true }))
    dispatch(clearError())

    const response = await postWithToken(
      Endpoints.sessions.submitAnswer(sessionId),
      {
        questionId,
        userAnswer,
        timeTakenSeconds
      }
    )

    const data = response.data.data

    dispatch(addAnswer({
      questionId,
      userAnswer,
      isCorrect: data.is_correct,
      correctAnswer: data.correct_answer,
      explanation: data.explanation,
      answerId: data.answer_id
    }))

    return data
  } catch (err) {
    handleApiError(err, dispatch)
    throw err
  } finally {
    dispatch(setLoading({ key: 'isSubmittingAnswer', value: false }))
  }
}

/**
 * Move to next question
 */
export const nextQuestion = () => (dispatch, getState) => {
  const { session } = getState()
  const nextIndex = session.currentQuestionIndex + 1
  dispatch(setCurrentQuestionIndex(nextIndex))
}

/**
 * Complete the current session
 */
export const completeSession = (sessionId) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isCompletingSession', value: true }))
    dispatch(clearError())

    const response = await postWithToken(
      Endpoints.sessions.complete(sessionId)
    )

    const data = response.data.data

    return data
  } catch (err) {
    handleApiError(err, dispatch)
    throw err
  } finally {
    dispatch(setLoading({ key: 'isCompletingSession', value: false }))
  }
}

/**
 * Clear current session
 */
export const clearSession = () => (dispatch) => {
  dispatch(clearCurrentSession())
}

// ============= Session History Actions =============

/**
 * Fetch user's session history
 */
export const fetchSessions = (status = null, limit = 20, offset = 0) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isLoadingSessions', value: true }))
    dispatch(clearError())

    const queryParams = { limit, offset }
    if (status) queryParams.status = status

    const response = await getWithToken(Endpoints.sessions.list, queryParams)

    const data = response.data.data

    dispatch(setSessions(data.sessions))
    dispatch(setPagination({
      total: data.total,
      limit: data.limit,
      offset: data.offset
    }))
  } catch (err) {
    handleApiError(err, dispatch)
  } finally {
    dispatch(setLoading({ key: 'isLoadingSessions', value: false }))
  }
}

/**
 * Fetch session detail
 */
export const fetchSessionDetail = (sessionId) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isLoadingDetail', value: true }))
    dispatch(clearError())

    const response = await getWithToken(Endpoints.sessions.detail(sessionId))

    const data = response.data.data

    dispatch(setSessionDetail(data))

    // Also set currentSession and topicSnapshot for ExercisePlayer
    if (data.topic_snapshot) {
      // Backend already parses topic_snapshot, so it's an object
      dispatch(setTopicSnapshot(data.topic_snapshot))
      dispatch(setCurrentSession({
        id: data.id,
        status: data.status,
        creditsUsed: data.credits_used,
        totalQuestions: data.total_questions,
        score: data.score
      }))

      // Set current question index based on answers
      const answeredCount = data.answers ? data.answers.length : 0
      dispatch(setCurrentQuestionIndex(answeredCount))

      // Also store the answers in Redux for the player
      if (data.answers && data.answers.length > 0) {
        // Note: We're not storing full answer history in this flow
        // The ExercisePlayer will work with current state
      }
    }

    return data
  } catch (err) {
    handleApiError(err, dispatch)
    throw err
  } finally {
    dispatch(setLoading({ key: 'isLoadingDetail', value: false }))
  }
}
