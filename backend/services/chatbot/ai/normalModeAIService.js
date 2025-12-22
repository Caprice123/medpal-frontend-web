import { GoogleGenerativeAI } from '@google/generative-ai'
import prisma from '../../../prisma/client.js'
import { BaseService } from '../../baseService.js'
import { ValidationError } from '../../../errors/validationError.js'


export class NormalModeAIService extends BaseService {
  /**
   * Generate AI response using Normal Mode (Gemini only, no RAG)
   * @param {Object} params - Parameters
   * @param {number} params.userId - User ID
   * @param {number} params.conversationId - Conversation ID
   * @param {string} params.message - User's message
   * @returns {Promise<Object>} AI response with credits used
   */
  static async call({ userId, conversationId, message }) {
    try {
      // Get chatbot constants for configuration
      const constants = await prisma.constants.findMany({
        where: {
          key: {
            in: [
              'chatbot_normal_enabled',
              'chatbot_normal_model',
              'chatbot_normal_last_message_count',
              'chatbot_normal_system_prompt',
            ]
          }
        }
      })

      const constantsMap = {}
      constants.forEach(c => { constantsMap[c.key] = c.value })

      const modeActive = constantsMap.chatbot_normal_enabled === 'true'
      if (!modeActive) {
        throw new ValidationError("Normal mode sedang tidak aktif. Silakan pilih mode lain")
      }

      const modelName = constantsMap.chatbot_normal_model || 'gemini-2.5-flash'
      const lastMessageCount = parseInt(constantsMap.chatbot_normal_last_message_count) || 10
      const systemPrompt = constantsMap.chatbot_normal_system_prompt || this.getDefaultSystemPrompt()
      const creditsPerMessage = parseFloat(constantsMap.chatbot_normal_cost) || 5

      // Get conversation history (last 10 messages for context)
      const messages = await prisma.chatbot_messages.findMany({
        where: {
          conversation_id: conversationId,
          is_deleted: false
        },
        orderBy: { created_at: 'desc' },
        take: lastMessageCount,
        select: {
          sender_type: true,
          content: true
        }
      })

      // Reverse to get chronological order
      const conversationHistory = messages.reverse()

      // Build conversation context with history
      const history = conversationHistory
        .map(msg => ({
          role: msg.sender_type === 'user' ? 'user' : 'model',
          parts: [{ text: msg.content }]
        }))

      // Add current message
      history.push({
        role: 'user',
        parts: [{ text: message }]
      })

      // Generate response using generateContentStream for streaming
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

      const model = genAI.getGenerativeModel({
        model: modelName,
        systemInstruction: systemPrompt
      })

      const result = await model.generateContentStream({
        contents: history,
        generationConfig: {
          maxOutputTokens: 2048,
          temperature: 0.7,
          topP: 0.9,
          topK: 40
        }
      })

      return {
        stream: result.stream,
        creditsUsed: creditsPerMessage,
        sources: []
      }
    } catch (error) {
      console.error('Error in Normal Mode AI Service:', error)
      throw new Error('Failed to generate AI response: ' + error.message)
    }
  }

  /**
   * Get default system prompt for Normal Mode
   * @returns {string} Default system prompt
   */
  static getDefaultSystemPrompt() {
    return `Kamu adalah asisten medis AI yang membantu mahasiswa kedokteran di Indonesia.

Peran dan Tanggung Jawab:
- Kamu adalah asisten pembelajaran yang ramah, sabar, dan supportif
- Berikan jawaban yang akurat dan berbasis bukti medis
- Gunakan bahasa Indonesia yang jelas dan mudah dipahami
- Jelaskan konsep medis dengan cara yang edukatif

Gaya Komunikasi:
- Gunakan bahasa formal namun tetap hangat dan approachable
- Berikan penjelasan yang terstruktur dengan poin-poin jelas
- Jika ditanya tentang diagnosis atau pengobatan, selalu tekankan bahwa ini untuk pembelajaran dan bukan pengganti konsultasi medis profesional
- Jika tidak yakin atau pertanyaan di luar keahlian, akui dengan jujur

Batasan:
- Jangan memberikan diagnosis atau rekomendasi pengobatan personal
- Fokus pada pendidikan dan pemahaman konsep medis
- Jika ada pertanyaan sensitif atau emergency, sarankan untuk berkonsultasi dengan profesional medis
- Jangan membuat klaim yang tidak didukung bukti ilmiah

Tujuan Utama:
Membantu mahasiswa kedokteran memahami materi pembelajaran dengan lebih baik melalui penjelasan yang jelas, contoh yang relevan, dan dukungan pembelajaran yang konstruktif.`
  }
}
