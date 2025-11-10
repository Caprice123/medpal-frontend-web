import { actions } from '@store/exercise/reducer'
import Endpoints from '@config/endpoint'
import { handleApiError } from '@utils/errorUtils'
import { getWithToken, postWithToken, putWithToken, deleteWithToken } from '../../utils/requestUtils'

const {
  setLoading,
  setTopics,
  setTags,
  setSelectedTopic,
  setQuestions,
  setGeneratedQuestions,
  setFilters,
  clearFilters,
  clearError,
  addTopic,
  updateTopic,
  removeTopic,
  addQuestion,
  updateQuestion,
  removeQuestion,
  clearGeneratedQuestions,
  clearSelectedTopic
} = actions

// ============= Topics Actions =============

/**
 * Fetch all exercise topics
 */
export const fetchExerciseTopics = (filters = {}) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isTopicsLoading', value: true }))
    dispatch(clearError())

    const queryParams = {}
    if (filters.university) queryParams.university = filters.university
    if (filters.semester) queryParams.semester = filters.semester
    if (filters.status) queryParams.status = filters.status

    const response = await getWithToken(Endpoints.exercises.topics, queryParams)

    dispatch(setTopics(response.data.topics))
  } catch (err) {
    handleApiError(err, dispatch)
  } finally {
    dispatch(setLoading({ key: 'isTopicsLoading', value: false }))
  }
}

/**
 * Fetch single topic with questions
 */
export const fetchExerciseTopic = (topicId) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isQuestionsLoading', value: true }))
    dispatch(clearError())

    const response = await getWithToken(Endpoints.exercises.topic(topicId))

    dispatch(setSelectedTopic(response.data.topic))
    dispatch(setQuestions(response.data.topic.questions || []))
  } catch (err) {
    handleApiError(err, dispatch)
  } finally {
    dispatch(setLoading({ key: 'isQuestionsLoading', value: false }))
  }
}

/**
 * Generate questions using Gemini
 */
export const generateQuestions = (content, type, questionCount = 10) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isGeneratingQuestions', value: true }))
    dispatch(clearError())

    const requestBody = {
      content,
      type,
      questionCount
    }

    const response = await postWithToken(Endpoints.exercises.generate, requestBody)

    dispatch(setGeneratedQuestions(response.data.questions))
    return response.data.questions
  } catch (err) {
    handleApiError(err, dispatch)
    throw err
  } finally {
    dispatch(setLoading({ key: 'isGeneratingQuestions', value: false }))
  }
}

/**
 * Create new topic with questions
 */
export const createExerciseTopic = (topicData) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isCreatingTopic', value: true }))
    dispatch(clearError())

    const response = await postWithToken(Endpoints.exercises.topics, topicData)

    dispatch(addTopic(response.data.topic))
    dispatch(clearGeneratedQuestions())
    return response.data.topic
  } catch (err) {
    handleApiError(err, dispatch)
    throw err
  } finally {
    dispatch(setLoading({ key: 'isCreatingTopic', value: false }))
  }
}

/**
 * Update topic questions
 */
export const updateTopicQuestions = (topicId, questions) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isUpdatingTopic', value: true }))
    dispatch(clearError())

    const response = await putWithToken(
      Endpoints.exercises.questions(topicId),
      { questions }
    )

    dispatch(updateTopic(response.data.topic))
    return response.data.topic
  } catch (err) {
    handleApiError(err, dispatch)
    throw err
  } finally {
    dispatch(setLoading({ key: 'isUpdatingTopic', value: false }))
  }
}

/**
 * Add manual question to topic
 */
export const addManualQuestion = (topicId, questionData) => async (dispatch) => {
  try {
    dispatch(clearError())

    const response = await postWithToken(
      Endpoints.exercises.questions(topicId),
      questionData
    )

    dispatch(addQuestion(response.data.question))
    return response.data.question
  } catch (err) {
    handleApiError(err, dispatch)
    throw err
  }
}

/**
 * Delete topic
 */
export const deleteExerciseTopic = (topicId) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isDeletingTopic', value: true }))
    dispatch(clearError())

    await deleteWithToken(Endpoints.exercises.topic(topicId))

    dispatch(removeTopic(topicId))
  } catch (err) {
    handleApiError(err, dispatch)
    throw err
  } finally {
    dispatch(setLoading({ key: 'isDeletingTopic', value: false }))
  }
}

// ============= Tags Actions =============

/**
 * Fetch all tags
 */
export const fetchExerciseTags = (type = null) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isTagsLoading', value: true }))
    dispatch(clearError())

    const queryParams = {}
    if (type) queryParams.type = type

    const response = await getWithToken(Endpoints.exercises.tags, queryParams)

    dispatch(setTags(response.data.tags))
  } catch (err) {
    handleApiError(err, dispatch)
  } finally {
    dispatch(setLoading({ key: 'isTagsLoading', value: false }))
  }
}

// ============= Filter Actions =============

/**
 * Update filters
 */
export const updateExerciseFilters = (filters) => (dispatch) => {
  dispatch(setFilters(filters))
}

/**
 * Clear all filters
 */
export const clearExerciseFilters = () => (dispatch) => {
  dispatch(clearFilters())
}

/**
 * Clear selected topic and questions
 */
export const clearExerciseSelection = () => (dispatch) => {
  dispatch(clearSelectedTopic())
}
