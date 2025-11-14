import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

class GeminiService {
  /**
   * Generate fill-in-the-blank questions from text content
   * @param {string} content - The text content to generate questions from
   * @param {number} questionCount - Number of questions to generate (default: 10)
   * @returns {Promise<Array>} Array of generated questions
   */
  async generateQuestionsFromText(content, questionCount = 10) {
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

      const prompt = `
Kamu adalah seorang dosen medis yang ahli dalam membuat soal latihan untuk mahasiswa kedokteran.

Tugas: Buatlah ${questionCount} soal fill-in-the-blank berkualitas tinggi berdasarkan materi berikut.

Materi:
${content}

Format Output (JSON):
[
  {
    "question": "Pertanyaan dengan ____ sebagai tempat kosong yang harus diisi",
    "answer": "jawaban yang benar",
    "explanation": "Penjelasan lengkap mengapa ini jawaban yang benar"
  }
]

Aturan:
1. Setiap pertanyaan harus menggunakan TEPAT SATU ____ (empat underscore) sebagai tempat kosong
2. Fokus pada konsep medis penting dari materi
3. Jawaban harus SATU KATA atau FRASA PENDEK (maksimal 3 kata)
4. Penjelasan harus jelas dan edukatif (2-3 kalimat)
5. Gunakan bahasa Indonesia yang formal dan medis
6. Pastikan pertanyaan bervariasi dan mencakup berbagai aspek materi
7. Output harus berupa valid JSON array

Hasilkan HANYA JSON array tanpa teks tambahan apapun.
`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      // Parse JSON response
      const cleanedText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      const questions = JSON.parse(cleanedText);

      // Validate and clean questions
      return questions.map((q, index) => ({
        question: q.question || '',
        answer: q.answer || '',
        explanation: q.explanation || '',
        order: index
      }));
    } catch (error) {
      console.error('Error generating questions from text:', error);
      throw new Error('Failed to generate questions: ' + error.message);
    }
  }

  /**
   * Generate fill-in-the-blank questions from PDF content
   * @param {string} pdfText - Extracted text from PDF
   * @param {number} questionCount - Number of questions to generate
   * @returns {Promise<Array>} Array of generated questions
   */
  async generateQuestionsFromPDF(pdfText, questionCount = 10) {
    // For now, use the same method as text generation
    // In future, can add PDF-specific processing
    return this.generateQuestionsFromText(pdfText, questionCount);
  }

  /**
   * Validate a question format
   * @param {Object} question - Question object to validate
   * @returns {boolean} True if valid
   */
  validateQuestion(question) {
    if (!question.question || !question.answer || !question.explanation) {
      return false;
    }

    // Check if question has exactly one ____
    const blankCount = (question.question.match(/____/g) || []).length;
    if (blankCount !== 1) {
      return false;
    }

    return true;
  }
}

export default new GeminiService();
