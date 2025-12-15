import { actions } from '@store/calculator/reducer'
import Endpoints from '@config/endpoint'
import { handleApiError } from '@utils/errorUtils'
import { getWithToken, postWithToken, putWithToken, deleteWithToken } from '../../utils/requestUtils'

const {
  setLoading,
  setDetail,
  setTopics,
} = actions

// Fetch all calculator topics (admin)
export const fetchAdminCalculatorTopics = () => async (dispatch, getState) => {
  try {
    dispatch(setLoading({ key: 'isGetListCalculatorsLoading', value: true }))
    
    const { filter } = getState().calculator

    const requestQuery = {}
    if (filter.name) requestQuery.name = filter.name
    if (filter.tagName) requestQuery.tagName = filter.tagName
    
    const route = Endpoints.api.calculators + "/topics"
    const response = await getWithToken(route, requestQuery)
    dispatch(setTopics(response.data.data || response.data || []))
  } catch (err) {
    handleApiError(err, dispatch)
  } finally {
    dispatch(setLoading({ key: 'isGetListCalculatorsLoading', value: false }))
  }
}

// Fetch single calculator topic
export const fetchAdminCalculatorTopic = (topicId) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isGetDetailCalculatorLoading', value: true }))
    
    const response = await getWithToken(Endpoints.calculators.admin.detail(topicId))
    const topic = response.data.data || response.data
    dispatch(setDetail(topic))
    return topic
  } catch (err) {
    handleApiError(err, dispatch)
  } finally {
    dispatch(setLoading({ key: 'isGetDetailCalculatorLoading', value: false }))
  }
}

// Create calculator topic
export const createCalculatorTopic = (data, onSuccess) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isCreateCalculatorLoading', value: true }))
    
    await postWithToken(Endpoints.calculators.admin.create, data)
    if (onSuccess) onSuccess()
  } catch (err) {
    handleApiError(err, dispatch)
  } finally {
    dispatch(setLoading({ key: 'isCreateCalculatorLoading', value: false }))
  }
}

// Update calculator topic
export const updateCalculatorTopic = (topicId, data) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isUpdateCalculatorLoading', value: true }))
    
    await putWithToken(Endpoints.calculators.admin.update(topicId), data)
  } catch (err) {
    handleApiError(err, dispatch)
  } finally {
    dispatch(setLoading({ key: 'isUpdateCalculatorLoading', value: false }))
  }
}

// Delete calculator topic
export const deleteCalculatorTopic = (topicId) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isDeleteCalculatorLoading', value: true }))
    
    await deleteWithToken(Endpoints.calculators.admin.delete(topicId))
  } catch (err) {
    handleApiError(err, dispatch)
  } finally {
    dispatch(setLoading({ key: 'isDeleteCalculatorLoading', value: false }))
  }
}

// ============= Constants Actions =============

/**
 * Fetch calculator constants (admin only)
 */
export const fetchCalculatorConstants = (keys = null) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isConstantsLoading', value: true }))
    
    const queryParams = {}
    if (keys && Array.isArray(keys)) {
      queryParams.keys = keys.join(',')
    }

    const response = await getWithToken(Endpoints.calculators.admin.constants, queryParams)

    return response.data.data || {}
  } catch (err) {
    handleApiError(err, dispatch)
  } finally {
    dispatch(setLoading({ key: 'isConstantsLoading', value: false }))
  }
}

/**
 * Update calculator constants (admin only)
 */
export const updateCalculatorConstants = (constants) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isUpdatingConstants', value: true }))
    
    const response = await putWithToken(Endpoints.calculators.admin.constants, constants)

    return response.data.data || {}
  } catch (err) {
    handleApiError(err, dispatch)
  } finally {
    dispatch(setLoading({ key: 'isUpdatingConstants', value: false }))
  }
}


export const getCalculatorTopics = () => async (dispatch, getState) => {
  try {
    dispatch(setLoading({ key: 'isGetListCalculatorsLoading', value: true }))
    
    const { filter } = getState().calculator
    const requestQuery = {
        name: filter.name,
        tagName: filter.tagName,
    }
    const route = Endpoints.api.calculators + "/topics"
    const response = await getWithToken(route, requestQuery)
    dispatch(setTopics(response.data.data || response.data || []))
  } catch (err) {
    handleApiError(err, dispatch)
  } finally {
    dispatch(setLoading({ key: 'isGetListCalculatorsLoading', value: false }))
  }
}

export const getCalculatorTopicDetail = (id) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isGetDetailCalculatorLoading', value: true }))
    
    const route = Endpoints.api.calculators + `/topics/${id}`
    const response = await getWithToken(route)
    dispatch(setDetail(response.data.data || response.data || []))
  } catch (err) {
    handleApiError(err, dispatch)
  } finally {
    dispatch(setLoading({ key: 'isGetDetailCalculatorLoading', value: false }))
  }
}

export const calculateResult = (id, inputs) => async (dispatch) => {
    try {
        dispatch(setLoading({ key: 'isCalculateResultLoading', value: true }))
        
        const subRoute = `/${id}/calculate`
        const route = Endpoints.api.calculators + subRoute
        const response = await postWithToken(route, inputs)
        return response.data.data
    } catch (err) {
        handleApiError(err, dispatch)
    } finally {
        dispatch(setLoading({ key: 'isCalculateResultLoading', value: false }))
    }
}
