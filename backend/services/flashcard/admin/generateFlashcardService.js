import { ValidationError } from "../../../errors/validationError.js"
import prisma from "../../../prisma/client.js"
import { BaseService } from "../../baseService.js"
import geminiService from "../../gemini.service.js"
import fs from 'fs'

export class GenerateFlashcardService extends BaseService {
    static async call({ content, pdfFilePath, type, cardCount = 10 }) {
        this.validate({ content, pdfFilePath, type, cardCount })

        try {
            // Generate flashcards using Gemini
            let flashcards
            if (type === 'text') {
                flashcards = await geminiService.generateFlashcardsFromText(content, cardCount)
            } else if (type === 'pdf') {
                flashcards = await geminiService.generateFlashcardsFromPDF(pdfFilePath, cardCount)
            }

            return flashcards
        } finally {
            // Clean up temporary PDF file if it exists
            if (pdfFilePath && fs.existsSync(pdfFilePath)) {
                try {
                    fs.unlinkSync(pdfFilePath)
                    console.log('Temporary PDF file deleted after flashcard preview generation')
                } catch (cleanupError) {
                    console.error('Error deleting temporary PDF:', cleanupError)
                }
            }
        }
    }

    static validate({ content, pdfFilePath, type, cardCount }) {
        if (!type || !['text', 'pdf'].includes(type)) {
            throw new ValidationError('Type must be either "text" or "pdf"')
        }

        if (type === 'text' && !content) {
            throw new ValidationError('Content is required for text type')
        }

        if (type === 'pdf' && !pdfFilePath) {
            throw new ValidationError('PDF file path is required for pdf type')
        }
    }
}
