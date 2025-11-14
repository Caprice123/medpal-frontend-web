import { actions } from '@store/tags/reducer'
import Endpoints from '@config/endpoint'
import { handleApiError } from '@utils/errorUtils'
import { getWithToken, postWithToken, putWithToken, deleteWithToken } from '../../utils/requestUtils'

const {
  setLoading,
  setTags,
  addTag,
  updateTag,
  removeTag,
  setError,
  clearError
} = actions

// ============= Tags Actions =============

/**
 * Fetch all tags
 */
export const fetchTags = (type = null) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isTagsLoading', value: true }))
    dispatch(clearError())

    const queryParams = {}
    if (type) queryParams.type = type

    const response = await getWithToken(Endpoints.tags.list, queryParams)

    dispatch(setTags(response.data.data || response.data.tags || []))
  } catch (err) {
    handleApiError(err, dispatch)
  } finally {
    dispatch(setLoading({ key: 'isTagsLoading', value: false }))
  }
}

/**
 * Create new tag (admin only)
 */
export const createTag = (tagData) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isCreating', value: true }))
    dispatch(clearError())

    const response = await postWithToken(Endpoints.tags.create, tagData)

    const tag = response.data.data || response.data.tag
    dispatch(addTag(tag))
    return tag
  } catch (err) {
    handleApiError(err, dispatch)
    throw err
  } finally {
    dispatch(setLoading({ key: 'isCreating', value: false }))
  }
}

/**
 * Update existing tag (admin only)
 */
export const updateTagAction = (tagId, tagData) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isUpdating', value: true }))
    dispatch(clearError())

    const response = await putWithToken(Endpoints.tags.update(tagId), tagData)

    const tag = response.data.data || response.data.tag
    dispatch(updateTag(tag))
    return tag
  } catch (err) {
    handleApiError(err, dispatch)
    throw err
  } finally {
    dispatch(setLoading({ key: 'isUpdating', value: false }))
  }
}

/**
 * Delete tag (admin only)
 */
export const deleteTag = (tagId) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isDeleting', value: true }))
    dispatch(clearError())

    await deleteWithToken(Endpoints.tags.delete(tagId))

    dispatch(removeTag(tagId))
  } catch (err) {
    handleApiError(err, dispatch)
    throw err
  } finally {
    dispatch(setLoading({ key: 'isDeleting', value: false }))
  }
}
