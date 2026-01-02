import { actions } from '@store/user/reducer'
import Endpoints from '@config/endpoint'
import { handleApiError } from '@utils/errorUtils'
import { getWithToken, putWithToken } from '../../utils/requestUtils'

const {
  setLoading,
  setUsers,
  setDetail,
  setSubscriptions,
  setSubscriptionPagination,
} = actions

// ============= Users Actions =============
export const fetchUsers = () => async (dispatch, getState) => {
  try {
    dispatch(setLoading({ key: 'isGetUsersLoading', value: true }))

    const { email, name, status } = getState().user.filter
    const { page, perPage } = getState().user.pagination
    const queryParams = {
        email,
        name,
        status: status?.value,
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

export const adjustCredit = (userId, credit, onSuccess) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isAdjustCreditLoading', value: true }))

    const subRoute = "/credits"
    const route = Endpoints.users + subRoute
    const requestBody = {
        userId,
        credit,
    }
    await putWithToken(route, requestBody)
    if (onSuccess) onSuccess()
    // Fetch updated user details
    await dispatch(fetchUserDetail(userId))
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
        durationDays: form.durationDays,
    }
    await putWithToken(route, requestBody)
    if (onSuccess) onSuccess()
  } catch (err) {
    handleApiError(err, dispatch)
  } finally {
    dispatch(setLoading({ key: 'isAdjustSubscriptionLoading', value: false }))
  }
}

export const addSubscription = (userId, startDate, endDate, onSuccess) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isAddSubscriptionLoading', value: true }))

    const route = Endpoints.subscriptions
    const requestBody = {
        userId,
        startDate,
        endDate,
    }
    await putWithToken(route, requestBody)
    if (onSuccess) onSuccess()
    // Fetch updated user details and subscriptions
    await dispatch(fetchUserDetail(userId))
    await dispatch(fetchUserSubscriptions(userId))
  } catch (err) {
    handleApiError(err, dispatch)
  } finally {
    dispatch(setLoading({ key: 'isAddSubscriptionLoading', value: false }))
  }
}

export const fetchUserDetail = (userId) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isFetchUserDetailLoading', value: true }))

    const route = `${Endpoints.users}/${userId}`
    const response = await getWithToken(route)
    const userData = response.data.data

    // Set user detail in state and update user in list
    dispatch(setDetail(userData))

    return userData
  } catch (err) {
    handleApiError(err, dispatch)
  } finally {
    dispatch(setLoading({ key: 'isFetchUserDetailLoading', value: false }))
  }
}

export const fetchUserSubscriptions = (userId) => async (dispatch, getState) => {
  try {
    dispatch(setLoading({ key: 'isFetchUserSubscriptionsLoading', value: true }))

    const { page, perPage } = getState().user.subscriptionPagination
    const { subscriptionFilter } = getState().user
    const queryParams = {
      page: page || 1,
      perPage: perPage || 20,
      status: subscriptionFilter || 'all',
    }

    const route = `${Endpoints.users}/${userId}/subscriptions`
    const response = await getWithToken(route, queryParams)
    const { data, pagination } = response.data

    dispatch(setSubscriptions(data))
    dispatch(setSubscriptionPagination(pagination))
  } catch (err) {
    handleApiError(err, dispatch)
  } finally {
    dispatch(setLoading({ key: 'isFetchUserSubscriptionsLoading', value: false }))
  }
}
