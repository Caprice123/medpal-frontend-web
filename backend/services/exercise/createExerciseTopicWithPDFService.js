import { ValidationError } from "../../errors/validationError.js"
import prisma from "../../prisma/client.js"
import { BaseService } from "../baseService.js"
import geminiService from "../gemini.service.js"
import idriveService from "../idrive.service.js"
import fs from 'fs'

export class CreateExerciseTopicWithPDFService extends BaseService {
    /**
     * Create an exercise topic with PDF upload
     * This service handles:
     * 1. Uploading PDF to iDrive e2 cloud storage (for admin review)
     * 2. Sending PDF to Gemini for question generation
     * Both operations happen in parallel for better performance
     *
     * @param {Object} params
     * @param {string} params.title - Topic title
     * @param {string} params.description - Topic description
     * @param {string} params.pdfFilePath - Local path to uploaded PDF file
     * @param {Array} params.tags - Array of tag IDs
     * @param {number} params.questionCount - Number of questions to generate (default: 10)
     * @param {number} params.created_by - User ID who created the topic
     * @returns {Promise<Object>} Created topic with questions
     */
    static async call({ title, description, pdfFilePath, tags, questionCount = 10, created_by }) {
        // Validate inputs
        await this.validate({ title, pdfFilePath, tags })

        try {
            // Execute PDF upload to iDrive and question generation in parallel
            console.log('Starting parallel: PDF upload to iDrive and question generation...')
            const [uploadResult, generatedQuestions] = await Promise.all([
                // Upload PDF to iDrive e2
                idriveService.uploadExercisePDF(pdfFilePath, title),
                // Generate questions from PDF using Gemini
                geminiService.generateQuestionsFromPDF(pdfFilePath, questionCount)
            ])

            console.log('Parallel operations completed successfully')
            console.log(`PDF uploaded to: ${uploadResult.url}`)
            console.log(`Generated ${generatedQuestions.length} questions`)

            // Create topic with generated questions and tags
            const topic = await prisma.exercise_topics.create({
                data: {
                    title,
                    description: description || '',
                    content_type: 'pdf',
                    pdf_url: uploadResult.url,
                    pdf_key: uploadResult.key,
                    pdf_filename: uploadResult.fileName,
                    status: 'ready',
                    created_by: created_by,
                    questions: {
                        create: generatedQuestions.map((q, index) => ({
                            question: q.question,
                            answer: q.answer,
                            explanation: q.explanation || '',
                            order: q.order !== undefined ? q.order : index
                        }))
                    },
                    tags: {
                        create: tags.map(tag => ({
                            tag_id: typeof tag === 'object' ? tag.id : tag
                        }))
                    }
                },
                include: {
                    questions: {
                        orderBy: { order: 'asc' }
                    },
                    tags: {
                        include: {
                            tag: true
                        }
                    }
                }
            })

            // Clean up temporary PDF file
            try {
                if (fs.existsSync(pdfFilePath)) {
                    fs.unlinkSync(pdfFilePath)
                    console.log('Temporary PDF file deleted')
                }
            } catch (cleanupError) {
                console.error('Error deleting temporary file:', cleanupError)
            }

            return topic
        } catch (error) {
            // Clean up temporary file on error
            try {
                if (fs.existsSync(pdfFilePath)) {
                    fs.unlinkSync(pdfFilePath)
                }
            } catch (cleanupError) {
                console.error('Error deleting temporary file:', cleanupError)
            }

            throw error
        }
    }

    static async validate({ title, pdfFilePath, tags }) {
        // Validate required fields
        if (!title) {
            throw new ValidationError('Title is required')
        }

        if (!pdfFilePath) {
            throw new ValidationError('PDF file is required')
        }

        // Check if file exists and is a PDF
        if (!fs.existsSync(pdfFilePath)) {
            throw new ValidationError('PDF file not found')
        }

        const fileExtension = pdfFilePath.toLowerCase().split('.').pop()
        if (fileExtension !== 'pdf') {
            throw new ValidationError('File must be a PDF')
        }

        if (!tags || tags.length === 0) {
            throw new ValidationError('At least one tag is required')
        }

        // Validate tags exist
        const tagIds = tags.map(t => typeof t === 'object' ? t.id : t)
        const existingTags = await prisma.tags.findMany({
            where: {
                id: { in: tagIds },
                is_active: true
            }
        })

        if (existingTags.length !== tagIds.length) {
            throw new ValidationError('Some tags are invalid or inactive')
        }
    }
}
