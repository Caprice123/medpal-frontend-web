import { actions } from '@store/feature/reducer'
import Endpoints from '@config/endpoint'
import { handleApiError } from '@utils/errorUtils'
import { getWithToken } from '../../utils/requestUtils'

const {
  setFeatures,
  setLoading,
  setError,
  clearError
} = actions

/**
 * Fetch all active features
 */
export const fetchFeatures = () => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isLoadingFeatures', value: true }))
    dispatch(clearError())

    const response = await getWithToken(Endpoints.features.list)

    const data = response.data.data

    dispatch(setFeatures(data))
  } catch (err) {
    handleApiError(err, dispatch)
  } finally {
    dispatch(setLoading({ key: 'isLoadingFeatures', value: false }))
  }
}
