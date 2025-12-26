import { Perplexity } from '@perplexity-ai/perplexity_ai'
import prisma from '#prisma/client'
import { BaseService } from '#baseService.js'
import { ValidationError } from '#errors/validationError'

export class ResearchModeAIService extends BaseService {
  /**
   * Generate AI response using Research Mode (Perplexity API for web search)
   * @param {Object} params - Parameters
   * @param {number} params.userId - User ID
   * @param {number} params.conversationId - Conversation ID
   * @param {string} params.message - User's message
   * @returns {Promise<Object>} AI response with web sources and credits used
   */
  static async call({ userId, conversationId, message }) {
    try {
      // Get chatbot constants for configuration
      const constants = await prisma.constants.findMany({
        where: {
          key: {
            in: [
              'chatbot_research_enabled',
              'chatbot_research_model',
              'chatbot_research_last_message_count',
              'chatbot_research_system_prompt',
              'chatbot_research_citations_count',
            ]
          }
        }
      })

      const constantsMap = {}
      constants.forEach(c => { constantsMap[c.key] = c.value })
      
      const modeActive = constantsMap.chatbot_research_enabled === 'true'
      if (!modeActive) {
        throw new ValidationError("Research mode sedang tidak aktif. Silakan pilih mode lain")
      }

      const model = constantsMap.chatbot_research_model
      const lastMessageCount = parseInt(constantsMap.chatbot_research_last_message_count) || 10
      const systemPrompt = constantsMap.chatbot_research_system_prompt || this.getDefaultSystemPrompt()
      const citationsCount = parseInt(constantsMap.chatbot_research_citations_count) || 5

      // Get conversation history for context
      const messages = await prisma.chatbot_messages.findMany({
        where: {
          conversation_id: conversationId,
          is_deleted: false
        },
        orderBy: { created_at: 'desc' },
        take: lastMessageCount, // Fewer messages for research mode to keep context focused
        select: {
          sender_type: true,
          content: true
        }
      })

      const conversationHistory = messages.reverse()

      // Call appropriate research API
      const result = await this.callPerplexityAPI(model, message, conversationHistory, systemPrompt, citationsCount)

      return {
        stream: result.stream,
        sources: result.sources
      }
    } catch (error) {
      console.error('Error in Research Mode AI Service:', error)
      throw new Error('Failed to generate research response: ' + error.message)
    }
  }

  /**
   * Call Perplexity API for research with web search (streaming)
   * @param {string} query - User's query
   * @param {Array} conversationHistory - Previous messages
   * @param {string} systemPrompt - System instructions
   * @param {number} citationsCount - Number of sources to cite
   * @returns {Promise<Object>} Stream generator and sources
   */
  static async callPerplexityAPI(model, query, conversationHistory, systemPrompt, citationsCount) {
    try {
      const perplexity = new Perplexity({
        apiKey: process.env.PERPLEXITY_API_KEY
      })

      if (!process.env.PERPLEXITY_API_KEY) {
        throw new Error('api key not configured')
      }

      // Build messages array with history
      const messages = [
        { role: 'system', content: systemPrompt }
      ]

      // Add conversation history
      conversationHistory
        .forEach(msg => {
          messages.push({
            role: msg.sender_type === 'user' ? 'user' : 'assistant',
            content: msg.content
          })
        })

      // Add current query
      messages.push({ role: 'user', content: query })

      // Create streaming chat completion
      const stream = await perplexity.chat.completions.create({
        model: model || 'sonar-deep-research',
        messages: messages,
        // max_tokens: 2048,
        temperature: 0.7,
        return_citations: true,
        return_images: false,
        search_recency_filter: 'month', // Focus on recent medical information
        stream: true
      })

      return {
        stream: stream,
        sources: [] // Citations will be extracted from the stream
      }
    } catch (error) {
      console.error('Error calling Perplexity API:', error)

      // Fallback response if API fails
      throw error
    }
  }

  /**
   * Get default system prompt for Research Mode
   * @returns {string} Default system prompt
   */
  static getDefaultSystemPrompt() {
    return `Kamu adalah asisten riset medis yang memberikan jawaban berdasarkan pencarian web.

ATURAN PENTING:
1. Berikan jawaban langsung tanpa preamble atau summary instruksi
2. Gunakan format Markdown untuk semua jawaban
3. Gunakan bullet points (-), **bold**, dan \`code\` untuk formatting
4. WAJIB cantumkan sitasi inline dengan format [1], [2], dst
5. JANGAN gunakan tag <think> atau HTML
6. JANGAN tampilkan proses berpikir internal
7. Batasi jumlah sumber sesuai konfigurasi citations_count

Format Jawaban:
- Mulai langsung dengan informasi yang diminta
- Sisipkan sitasi inline: "menurut WHO [1], glaukoma adalah..."
- Gunakan semua sitasi yang tersedia
- Jika informasi terbatas, akui secara jelas

Kredibilitas Sumber:
- Prioritaskan: jurnal peer-reviewed, WHO, CDC, institusi medis
- Jika ada informasi bertentangan, sebutkan kedua perspektif
- Fokus pada informasi terkini dan relevan

Batasan:
- Jangan diagnosis atau rekomendasi pengobatan personal
- Sarankan konsultasi profesional untuk keputusan klinis
- Akui jika informasi terbatas atau tidak kredibel`
  }
}
