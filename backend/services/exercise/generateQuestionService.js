import { ValidationError } from "../../errors/validationError.js"
import prisma from "../../prisma/client.js"
import { BaseService } from "../baseService.js"
import geminiService from "../gemini.service.js"

export class GenerateQuestionService extends BaseService {
    static async call({ content, type, questionCount = 10 }) {
        this.validate({ content, type, questionCount })

        // Generate questions using Gemini
        let questions
        if (type === 'text') {
            questions = await geminiService.generateQuestionsFromText(content, questionCount)
        } else {
            questions = await geminiService.generateQuestionsFromPDF(content, questionCount)
        }

        return questions
    }

    static validate({ content, type, questionCount }) {
        if (!content) {
            throw new ValidationError('Content is required')
        }

        if (!type || !['text', 'pdf'].includes(type)) {
            throw new ValidationError('Type must be either "text" or "pdf"')
        }
    }
}
