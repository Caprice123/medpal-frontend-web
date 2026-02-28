import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams, useNavigate } from 'react-router-dom'
import { fetchAtlasDetail } from '@store/atlas/userAction'

export const useAtlasDetail = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { id } = useParams()

  const { detail: currentItem, loading } = useSelector(state => state.atlas)

  useEffect(() => {
    dispatch(fetchAtlasDetail(id))
  }, [dispatch, id])

  const handleBack = () => navigate(-1)

  return {
    currentItem,
    loading,
    handleBack,
  }
}
