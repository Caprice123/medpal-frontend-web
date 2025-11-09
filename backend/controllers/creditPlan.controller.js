import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Admin: Get all credit plans
export const getAllCreditPlans = async (req, res) => {
  try {
    const plans = await prisma.creditPlan.findMany({
      orderBy: [
        { order: 'asc' },
        { createdAt: 'desc' }
      ]
    })

    res.status(200).json({
      success: true,
      data: plans
    })
  } catch (error) {
    console.error('Error fetching credit plans:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch credit plans',
      error: error.message
    })
  }
}

// Admin: Get active credit plans (for users)
export const getActiveCreditPlans = async (req, res) => {
  try {
    const plans = await prisma.creditPlan.findMany({
      where: {
        isActive: true
      },
      orderBy: [
        { order: 'asc' },
        { createdAt: 'desc' }
      ]
    })

    res.status(200).json({
      success: true,
      data: plans
    })
  } catch (error) {
    console.error('Error fetching active credit plans:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch credit plans',
      error: error.message
    })
  }
}

// Admin: Get credit plan by ID
export const getCreditPlanById = async (req, res) => {
  try {
    const { id } = req.params

    const plan = await prisma.creditPlan.findUnique({
      where: { id: parseInt(id) }
    })

    if (!plan) {
      return res.status(404).json({
        success: false,
        message: 'Credit plan not found'
      })
    }

    res.status(200).json({
      success: true,
      data: plan
    })
  } catch (error) {
    console.error('Error fetching credit plan:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch credit plan',
      error: error.message
    })
  }
}

// Admin: Create new credit plan
export const createCreditPlan = async (req, res) => {
  try {
    const { name, description, credits, price, isActive, isPopular, discount, order } = req.body

    // Validation
    if (!name || !credits || !price) {
      return res.status(400).json({
        success: false,
        message: 'Name, credits, and price are required'
      })
    }

    if (credits <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Credits must be greater than 0'
      })
    }

    if (price <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Price must be greater than 0'
      })
    }

    if (discount && (discount < 0 || discount > 100)) {
      return res.status(400).json({
        success: false,
        message: 'Discount must be between 0 and 100'
      })
    }

    const plan = await prisma.creditPlan.create({
      data: {
        name,
        description: description || null,
        credits: parseInt(credits),
        price: parseFloat(price),
        isActive: isActive !== undefined ? isActive : true,
        isPopular: isPopular !== undefined ? isPopular : false,
        discount: discount ? parseInt(discount) : 0,
        order: order ? parseInt(order) : 0
      }
    })

    res.status(201).json({
      success: true,
      message: 'Credit plan created successfully',
      data: plan
    })
  } catch (error) {
    console.error('Error creating credit plan:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to create credit plan',
      error: error.message
    })
  }
}

// Admin: Update credit plan
export const updateCreditPlan = async (req, res) => {
  try {
    const { id } = req.params
    const { name, description, credits, price, isActive, isPopular, discount, order } = req.body

    // Check if plan exists
    const existingPlan = await prisma.creditPlan.findUnique({
      where: { id: parseInt(id) }
    })

    if (!existingPlan) {
      return res.status(404).json({
        success: false,
        message: 'Credit plan not found'
      })
    }

    // Validation
    if (credits !== undefined && credits <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Credits must be greater than 0'
      })
    }

    if (price !== undefined && price <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Price must be greater than 0'
      })
    }

    if (discount !== undefined && (discount < 0 || discount > 100)) {
      return res.status(400).json({
        success: false,
        message: 'Discount must be between 0 and 100'
      })
    }

    // Prepare update data
    const updateData = {}
    if (name !== undefined) updateData.name = name
    if (description !== undefined) updateData.description = description
    if (credits !== undefined) updateData.credits = parseInt(credits)
    if (price !== undefined) updateData.price = parseFloat(price)
    if (isActive !== undefined) updateData.isActive = isActive
    if (isPopular !== undefined) updateData.isPopular = isPopular
    if (discount !== undefined) updateData.discount = parseInt(discount)
    if (order !== undefined) updateData.order = parseInt(order)

    const plan = await prisma.creditPlan.update({
      where: { id: parseInt(id) },
      data: updateData
    })

    res.status(200).json({
      success: true,
      message: 'Credit plan updated successfully',
      data: plan
    })
  } catch (error) {
    console.error('Error updating credit plan:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to update credit plan',
      error: error.message
    })
  }
}

// Admin: Delete credit plan
export const deleteCreditPlan = async (req, res) => {
  try {
    const { id } = req.params

    // Check if plan exists
    const existingPlan = await prisma.creditPlan.findUnique({
      where: { id: parseInt(id) }
    })

    if (!existingPlan) {
      return res.status(404).json({
        success: false,
        message: 'Credit plan not found'
      })
    }

    // Check if there are any transactions using this plan
    const transactionCount = await prisma.creditTransaction.count({
      where: { creditPlanId: parseInt(id) }
    })

    if (transactionCount > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete credit plan with existing transactions. Consider deactivating it instead.'
      })
    }

    await prisma.creditPlan.delete({
      where: { id: parseInt(id) }
    })

    res.status(200).json({
      success: true,
      message: 'Credit plan deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting credit plan:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to delete credit plan',
      error: error.message
    })
  }
}

// Admin: Toggle credit plan status
export const toggleCreditPlanStatus = async (req, res) => {
  try {
    const { id } = req.params

    const plan = await prisma.creditPlan.findUnique({
      where: { id: parseInt(id) }
    })

    if (!plan) {
      return res.status(404).json({
        success: false,
        message: 'Credit plan not found'
      })
    }

    const updatedPlan = await prisma.creditPlan.update({
      where: { id: parseInt(id) },
      data: { isActive: !plan.isActive }
    })

    res.status(200).json({
      success: true,
      message: `Credit plan ${updatedPlan.isActive ? 'activated' : 'deactivated'} successfully`,
      data: updatedPlan
    })
  } catch (error) {
    console.error('Error toggling credit plan status:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to toggle credit plan status',
      error: error.message
    })
  }
}
