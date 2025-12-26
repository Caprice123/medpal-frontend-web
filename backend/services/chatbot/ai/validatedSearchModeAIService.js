import { GoogleGenerativeAI } from '@google/generative-ai'
import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'
import RAGService from '#services/rag/ragService'
import { ValidationError } from '#errors/validationError'


export class ValidatedSearchModeAIService extends BaseService {
  /**
   * Generate AI response using Validated Search Mode (RAG + Gemini)
   * Retrieves relevant context from summary notes, then generates response
   * @param {Object} params - Parameters
   * @param {number} params.userId - User ID
   * @param {number} params.conversationId - Conversation ID
   * @param {string} params.message - User's message
   * @returns {Promise<Object>} AI response with sources and credits used
   */
  static async call({ userId, conversationId, message }) {
    try {
      // Get chatbot constants for configuration
      const constants = await prisma.constants.findMany({
        where: {
          key: {
            in: [
              'chatbot_validated_enabled',
              'chatbot_validated_model',
              'chatbot_validated_last_message_count',
              'chatbot_validated_system_prompt',
              'chatbot_validated_search_count',
              'chatbot_validated_threshold',
            ]
          }
        }
      })

      const constantsMap = {}
      constants.forEach(c => { constantsMap[c.key] = c.value })

      const modeActive = constantsMap.chatbot_validated_enabled === 'true'
      if (!modeActive) {
          throw new ValidationError("Validated mode sedang tidak aktif. Silakan pilih mode lain")
      }

      const modelName = constantsMap.chatbot_validated_model || 'gemini-2.5-flash'
      const lastMessageCount = parseInt(constantsMap.chatbot_validated_last_message_count) || 10
      const systemPrompt = constantsMap.chatbot_validated_system_prompt || this.getDefaultSystemPrompt()
      const searchCount = parseInt(constantsMap.chatbot_validated_search_count) || 5
      const threshold = parseFloat(constantsMap.chatbot_validated_threshold) || 0.3
      const creditsPerMessage = parseFloat(constantsMap.chatbot_validated_cost) || 10

      // Step 1: Retrieve relevant context using RAG
      console.log(`Searching for relevant context (limit: ${searchCount})...`)
      const { context, sources, hasContext } = await RAGService.getRelevantContext(message, {
        limit: searchCount,
        threshold: threshold // Lower threshold to get more results
      })

      // Step 2: Get conversation history
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

      const conversationHistory = messages.reverse()

      // Build Gemini chat history
      const history = conversationHistory
        .map(msg => ({
          role: msg.sender_type === 'user' ? 'user' : 'model',
          parts: [{ text: msg.content }]
        }))

      // Step 3: Build enhanced prompt with context
      const enhancedPrompt = this.buildEnhancedPrompt(message, context, hasContext)

      // Add enhanced prompt to history
      history.push({
        role: 'user',
        parts: [{ text: enhancedPrompt }]
      })

      // Step 4: Generate streaming response with Gemini and RAG context
      console.log('Generating AI response with RAG context (streaming)...')
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
        sources: sources
      }
    } catch (error) {
      console.error('Error in Validated Search Mode AI Service:', error)
      throw new Error('Failed to generate AI response with RAG: ' + error.message)
    }
  }

  /**
   * Build enhanced prompt with RAG context
   * @param {string} userMessage - User's original message
   * @param {string} context - Retrieved context from summary notes
   * @param {boolean} hasContext - Whether relevant context was found
   * @returns {string} Enhanced prompt
   */
  static buildEnhancedPrompt(userMessage, context, hasContext) {
    if (!hasContext) {
      return `${userMessage}

(Catatan: Tidak ada informasi spesifik yang ditemukan dari catatan ringkasan untuk pertanyaan ini. Berikan jawaban berdasarkan pengetahuan umum medis.)`
    }

    return `Berdasarkan catatan ringkasan berikut, jawab pertanyaan pengguna dengan akurat.

KONTEKS DARI CATATAN RINGKASAN:
${context}

---

PERTANYAAN PENGGUNA:
${userMessage}

INSTRUKSI:
1. Gunakan informasi dari catatan ringkasan di atas sebagai referensi utama
2. Berikan jawaban yang akurat dan berdasarkan konteks yang diberikan
3. Jika informasi dari catatan ringkasan tidak cukup, kamu boleh menambahkan penjelasan dari pengetahuan umum medis
4. Sebutkan jika jawaban kamu merujuk pada sumber tertentu dari catatan ringkasan
5. Jika pertanyaan tidak relevan dengan konteks yang diberikan, tetap jawab dengan baik namun sebutkan bahwa informasi spesifik tidak tersedia dalam catatan`
  }

  /**
   * Get default system prompt for Validated Search Mode
   * @returns {string} Default system prompt
   */
  static getDefaultSystemPrompt() {
    return `Kamu adalah asisten medis AI yang membantu mahasiswa kedokteran dengan menggunakan catatan ringkasan yang tersedia.

Peran dan Tanggung Jawab:
- Kamu adalah asisten pembelajaran yang menggunakan Retrieval-Augmented Generation (RAG)
- Berikan jawaban yang AKURAT berdasarkan catatan ringkasan yang diberikan
- Prioritaskan informasi dari catatan ringkasan sebagai sumber utama
- Gunakan bahasa Indonesia yang jelas dan mudah dipahami
- Jelaskan konsep medis dengan cara yang edukatif

Cara Kerja RAG:
- Kamu akan diberikan konteks dari catatan ringkasan yang relevan dengan pertanyaan
- SELALU gunakan konteks ini sebagai sumber informasi utama
- Jika konteks tidak cukup, tambahkan dari pengetahuan umum medis, namun SEBUTKAN hal ini
- Jangan membuat asumsi yang tidak didukung oleh konteks atau bukti ilmiah

Gaya Komunikasi:
- Gunakan bahasa formal namun tetap hangat dan approachable
- Struktur jawaban dengan jelas: mulai dengan informasi dari sumber, lalu elaborasi
- Sebutkan sumber informasi (misal: "Berdasarkan catatan ringkasan tentang [topik]...")
- Jika konteks tidak relevan atau tidak cukup, akui dengan jujur

Batasan:
- Jangan memberikan diagnosis atau rekomendasi pengobatan personal
- Fokus pada pendidikan berbasis sumber yang tersedia
- Jika ada pertanyaan sensitif atau emergency, sarankan konsultasi profesional
- Jangan membuat klaim yang tidak didukung konteks atau bukti ilmiah

Tujuan Utama:
Memberikan jawaban yang akurat dan terverifikasi berdasarkan catatan ringkasan yang tersedia, membantu mahasiswa kedokteran belajar dengan sumber yang terpercaya.`
  }
}
