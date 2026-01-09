import { BaseService } from '#services/baseService'
import { GetConstantsService } from '#services/constant/getConstantsService'

export class GetTrustedDomainsService extends BaseService {
  /**
   * Get trusted domains configuration for research mode
   * @returns {Promise<{enabled: boolean, domains: string[]}>}
   */
  static async call() {
    const constants = await GetConstantsService.call([
      'chatbot_research_trusted_domains',
      'chatbot_research_domain_filter_enabled',
      'chatbot_research_recency_filter',
      'chatbot_research_time_filter_type',
      'chatbot_research_published_after',
      'chatbot_research_published_before',
      'chatbot_research_updated_after',
      'chatbot_research_updated_before'
    ])

    const enabled = constants.chatbot_research_domain_filter_enabled === 'true'
    const domainsString = constants.chatbot_research_trusted_domains || ''
    const timeFilterType = constants.chatbot_research_time_filter_type || 'recency'
    const recencyFilter = constants.chatbot_research_recency_filter || 'month'

    // Date range filters
    const publishedAfter = constants.chatbot_research_published_after || ''
    const publishedBefore = constants.chatbot_research_published_before || ''
    const updatedAfter = constants.chatbot_research_updated_after || ''
    const updatedBefore = constants.chatbot_research_updated_before || ''

    // Parse comma-separated domains
    const domains = domainsString
      .split(',')
      .map(d => d.trim())
      .filter(d => d.length > 0)

    // Perplexity API allows max 20 domains
    const limitedDomains = domains.slice(0, 20)

    return {
      enabled: enabled,
      domains: limitedDomains,
      count: limitedDomains.length,
      timeFilterType: timeFilterType,
      recencyFilter: recencyFilter,
      publishedAfter: publishedAfter,
      publishedBefore: publishedBefore,
      updatedAfter: updatedAfter,
      updatedBefore: updatedBefore
    }
  }
}
