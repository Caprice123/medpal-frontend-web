import { useState } from 'react'

export const usePlanModal = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingPlan, setEditingPlan] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    credits: '',
    price: '',
    isActive: true,
    isPopular: false,
    discount: 0,
    order: 0
  })

  const openModal = (plan = null) => {
    if (plan) {
      setEditingPlan(plan)
      setFormData({
        name: plan.name,
        description: plan.description || '',
        credits: plan.credits,
        price: plan.price,
        isActive: plan.isActive,
        isPopular: plan.isPopular,
        discount: plan.discount,
        order: plan.order
      })
    } else {
      setEditingPlan(null)
      setFormData({
        name: '',
        description: '',
        credits: '',
        price: '',
        isActive: true,
        isPopular: false,
        discount: 0,
        order: 0
      })
    }
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setEditingPlan(null)
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  return {
    isModalOpen,
    editingPlan,
    formData,
    openModal,
    closeModal,
    handleChange
  }
}
