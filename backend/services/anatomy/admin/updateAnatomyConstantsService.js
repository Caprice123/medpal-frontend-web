import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'
import { ValidationError } from '#errors/validationError'

export class UpdateAnatomyConstantsService extends BaseService {
  static async call(constants) {
    const updates = []

    // Update or create each constant
    for (const [key, value] of Object.entries(constants)) {
      // Ensure key has anatomy_ prefix if needed
      const fullKey = key.startsWith('anatomy_') ? key : `anatomy_${key}`

      const update = prisma.constants.upsert({
        where: { key: fullKey },
        update: {
          value: value.toString(),
          updated_at: new Date()
        },
        create: {
          key: fullKey,
          value: value.toString()
        }
      })

      updates.push(update)
    }

    await prisma.$transaction(updates)

    // Return updated constants with their full keys
    const updatedConstants = {}
    for (const [key, value] of Object.entries(constants)) {
      const fullKey = key.startsWith('anatomy_') ? key : `anatomy_${key}`
      updatedConstants[fullKey] = value.toString()
    }

    return updatedConstants
  }

  static validate({ constants }) {
    if (!constants || typeof constants !== 'object') {
      throw new ValidationError('Constants must be an object')
    }

    if (Object.keys(constants).length === 0) {
      throw new ValidationError('At least one constant must be provided')
    }
  }
}
