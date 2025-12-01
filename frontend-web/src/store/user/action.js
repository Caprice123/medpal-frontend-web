import { actions } from '@store/user/reducer'
import Endpoints from '@config/endpoint'
import { handleApiError } from '@utils/errorUtils'
import { getWithToken, putWithToken } from '../../utils/requestUtils'

const {
  setLoading,
  setUsers,
} = actions

// ============= Users Actions =============
export const fetchUsers = () => async (dispatch, getState) => {
  try {
    dispatch(setLoading({ key: 'isGetUsersLoading', value: true }))

    const { email } = getState().user.filter
    const { page, perPage } = getState().user.pagination
    const queryParams = {
        email,
        page: page || 1,
        perPage: perPage || 50,
    }

    const route = Endpoints.users
    const response = await getWithToken(route, queryParams)
    const { data } = response.data
    dispatch(setUsers(data))
  } catch (err) {
    handleApiError(err, dispatch)
  } finally {
    dispatch(setLoading({ key: 'isGetUsersLoading', value: false }))
  }
}

export const adjustCredit = (form, onSuccess) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isAdjustCreditLoading', value: true }))

    const subRoute = "/credits"
    const route = Endpoints.users + subRoute
    const requestBody = {
        userId: form.userId,
        credit: form.credit,
    }
    await putWithToken(route, requestBody)
    if (onSuccess) onSuccess()
  } catch (err) {
    handleApiError(err, dispatch)
  } finally {
    dispatch(setLoading({ key: 'isAdjustCreditLoading', value: false }))
  }
}

export const adjustSubscription = (form, onSuccess) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isAdjustSubscriptionLoading', value: true }))

    const subRoute = "/subscriptions"
    const route = Endpoints.users + subRoute
    const requestBody = {
        userId: form.userId,
        startDate: form.startDate,
        endDate: form.endDate,
    }
    await putWithToken(route, requestBody)
    if (onSuccess) onSuccess()
  } catch (err) {
    handleApiError(err, dispatch)
  } finally {
    dispatch(setLoading({ key: 'isUpdateTagLoading', value: false }))
  }
}
