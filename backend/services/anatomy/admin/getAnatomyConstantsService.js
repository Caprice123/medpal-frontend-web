import prisma from '#prisma/client'
import { BaseService } from '#baseService.js'

export class GetAnatomyConstantsService extends BaseService {
  static async call({ keys = null }) {
    // Ensure keys have anatomy_ prefix if needed
    const ensurePrefix = (key) => key.startsWith('anatomy_') ? key : `anatomy_${key}`

    // Fetch constants based on keys or all anatomy constants
    const where = keys
      ? {
          key: {
            in: keys.map(k => ensurePrefix(k))
          }
        }
      : {
          key: {
            startsWith: 'anatomy_'
          }
        }

    const constants = await prisma.constants.findMany({
      where
    })

    // Transform to key-value object, keeping original key structure
    const result = {}
    constants.forEach(constant => {
      // Keep the full key structure as stored
      result[constant.key] = constant.value
    })

    // Set defaults if not found
    if (!result.anatomy_feature_title) {
      result.anatomy_feature_title = 'Quiz Anatomi'
    }
    if (!result.anatomy_feature_description) {
      result.anatomy_feature_description = 'Quiz interaktif untuk mengidentifikasi bagian anatomi'
    }
    if (!result.anatomy_access_type) {
      result.anatomy_access_type = 'subscription'
    }
    if (!result.anatomy_credit_cost) {
      result.anatomy_credit_cost = '0'
    }
    if (!result.anatomy_is_active) {
      result.anatomy_is_active = 'true'
    }
    if (!result.anatomy_section_title) {
      result.anatomy_section_title = 'Identifikasi Bagian Anatomi'
    }

    return result
  }

  static validate({ keys }) {
    if (keys && !Array.isArray(keys)) {
      throw new Error('Keys must be an array')
    }
  }
}
