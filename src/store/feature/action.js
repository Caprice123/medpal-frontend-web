import { actions } from '@store/feature/reducer'
import Endpoints from '@config/endpoint'
import { handleApiError } from '@utils/errorUtils'
import { getPublic } from '@utils/requestUtils'

const {
  setFeatures,
  setLoading,
} = actions

/**
 * Fetch all active features (public endpoint)
 */
export const fetchFeatures = () => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isLoadingFeatures', value: true }))
    
    const route = Endpoints.api.features
    const response = await getPublic(route)

    const data = response.data.data

    dispatch(setFeatures(data))
  } catch (err) {
    handleApiError(err, dispatch)
  } finally {
    dispatch(setLoading({ key: 'isLoadingFeatures', value: false }))
  }
}
