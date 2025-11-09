import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  fetchAllCreditPlans,
  createCreditPlan,
  updateCreditPlan,
  toggleCreditPlanStatus,
} from '@store/credit/action'

export const useCreditPlans = () => {
  const dispatch = useDispatch()
  const plans = useSelector(state => state.credit.plans)
  const loading = useSelector(state => state.credit.loading.isPlansLoading)
  const error = useSelector(state => state.credit.error)

  useEffect(() => {
    dispatch(fetchAllCreditPlans())
  }, [dispatch])

  const createPlan = async (formData) => {
    await dispatch(createCreditPlan(formData))
  }

  const updatePlan = async (id, formData) => {
    await  dispatch(updateCreditPlan(id, formData))
  }

  const toggleStatus = async (plan) => {
    await dispatch(toggleCreditPlanStatus(plan.id))
  }

  const fetchPlans = () => {
    dispatch(fetchAllCreditPlans())
  }

  return {
    plans,
    loading,
    error,
    fetchPlans,
    createPlan,
    updatePlan,
    toggleStatus,
  }
}
