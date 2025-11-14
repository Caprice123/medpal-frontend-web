import prisma from '../../prisma/client.js'
import { BaseService } from '../baseService.js'
import { GetConstantsService } from '../constant/getConstantsService.js'

export class GetActiveFeaturesService extends BaseService {
  static async call() {
    
    const featureConstants = await GetConstantsService.call([
        "exercise_feature_title",
        "exercise_feature_description",
        "exercise_credit_cost",
        "exercise_session_type",
    ])

    return [{
        name: featureConstants.exercise_feature_title,
        description: featureConstants.exercise_feature_description,
        cost: parseInt(featureConstants.exercise_credit_cost),
        icon: '🎓',
        sessionType: featureConstants.exercise_session_type
    }]
  }
}
