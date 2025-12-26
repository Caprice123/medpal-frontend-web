import { BaseService } from '#baseService.js'
import { GetConstantsService } from '#constant/getConstantsService.js'

export class GetChatbotConfigService extends BaseService {
  static async call() {
    const constantKeys = [
      'chatbot_is_active',
      'chatbot_normal_enabled',
      'chatbot_validated_enabled',
      'chatbot_research_enabled',
      'chatbot_normal_cost',
      'chatbot_validated_cost',
      'chatbot_research_cost'
    ]

    const constantsMap = await GetConstantsService.call({ keys: constantKeys })

    console.log(parseFloat(constantsMap.chatbot_research_cost))
    return {
      isActive: constantsMap.chatbot_is_active === 'true',
      availableModes: {
        normal: constantsMap.chatbot_normal_enabled === 'true',
        validated: constantsMap.chatbot_validated_enabled === 'true',
        research: constantsMap.chatbot_research_enabled === 'true'
      },
      costs: {
        normal: parseFloat(constantsMap.chatbot_normal_cost),
        validated: parseFloat(constantsMap.chatbot_validated_cost),
        research: parseFloat(constantsMap.chatbot_research_cost)
      }
    }
  }
}
