import { PrismaClient } from '@prisma/client'
import geminiService from '../../../services/gemini.service.js'

const prisma = new PrismaClient()

class ExerciseController {
  /**
   * Generate questions from content using Gemini (without saving)
   * POST /api/admin/exercises/generate
   */
  async generateQuestions(req, res) {
    try {
      const { content, type, questionCount = 10 } = req.body

      if (!content) {
        return res.status(400).json({
          error: 'Content is required'
        })
      }

      if (!type || !['text', 'pdf'].includes(type)) {
        return res.status(400).json({
          error: 'Type must be either "text" or "pdf"'
        })
      }

      // Generate questions using Gemini
      let questions
      if (type === 'text') {
        questions = await geminiService.generateQuestionsFromText(content, questionCount)
      } else {
        questions = await geminiService.generateQuestionsFromPDF(content, questionCount)
      }

      // Return generated questions without saving
      return res.status(200).json({
        success: true,
        questions
      })
    } catch (error) {
      console.error('Error generating questions:', error)
      return res.status(500).json({
        error: 'Failed to generate questions',
        message: error.message
      })
    }
  }

  /**
   * Create a new topic with questions
   * POST /api/admin/exercises/topics
   */
  async createTopic(req, res) {
    try {
      const {
        title,
        description,
        content_type,
        content,
        pdf_url,
        tags,
        questions
      } = req.body

      // Validate required fields
      if (!title) {
        return res.status(400).json({ error: 'Title is required' })
      }

      if (!content_type || !['text', 'pdf'].includes(content_type)) {
        return res.status(400).json({ error: 'Content type must be either "text" or "pdf"' })
      }

      if (content_type === 'text' && !content) {
        return res.status(400).json({ error: 'Content is required for text type' })
      }

      if (content_type === 'pdf' && !pdf_url) {
        return res.status(400).json({ error: 'PDF URL is required for pdf type' })
      }

      if (!tags || tags.length === 0) {
        return res.status(400).json({ error: 'At least one tag is required' })
      }

      if (!questions || questions.length === 0) {
        return res.status(400).json({ error: 'At least one question is required' })
      }

      // Validate tags exist
      const tagIds = tags.map(t => t.id)
      const existingTags = await prisma.tag.findMany({
        where: {
          id: { in: tagIds },
          is_active: true
        }
      })

      if (existingTags.length !== tagIds.length) {
        return res.status(400).json({ error: 'Some tags are invalid or inactive' })
      }

      // Create topic with questions and tags
      const topic = await prisma.exerciseTopic.create({
        data: {
          title,
          description,
          content_type,
          content: content_type === 'text' ? content : null,
          pdf_url: content_type === 'pdf' ? pdf_url : null,
          status: 'ready',
          created_by: req.user.id,
          questions: {
            create: questions.map((q, index) => ({
              question: q.question,
              answer: q.answer,
              explanation: q.explanation,
              order: q.order !== undefined ? q.order : index
            }))
          },
          tags: {
            create: tags.map(tag => ({
              tag_id: tag.id
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

      return res.status(201).json({
        success: true,
        topic
      })
    } catch (error) {
      console.error('Error creating topic:', error)
      return res.status(500).json({
        error: 'Failed to create topic',
        message: error.message
      })
    }
  }

  /**
   * Get all topics with optional filters
   * GET /api/admin/exercises/topics
   */
  async getTopics(req, res) {
    try {
      const { university, semester, status } = req.query

      const where = {
        is_active: true
      }

      if (status) {
        where.status = status
      }

      // Build filter for tags
      if (university || semester) {
        where.tags = {
          some: {
            OR: []
          }
        }

        if (university) {
          where.tags.some.OR.push({
            tag: {
              id: parseInt(university),
              type: 'university'
            }
          })
        }

        if (semester) {
          where.tags.some.OR.push({
            tag: {
              id: parseInt(semester),
              type: 'semester'
            }
          })
        }
      }

      const topics = await prisma.exerciseTopic.findMany({
        where,
        include: {
          questions: {
            orderBy: { order: 'asc' }
          },
          tags: {
            include: {
              tag: true
            }
          }
        },
        orderBy: {
          created_at: 'desc'
        }
      })

      // Format response
      const formattedTopics = topics.map(topic => ({
        id: topic.id,
        title: topic.title,
        description: topic.description,
        type: topic.content_type,
        status: topic.status,
        questionCount: topic.questions.length,
        tags: topic.tags.map(t => ({
          id: t.tag.id,
          name: t.tag.name,
          type: t.tag.type
        })),
        createdAt: topic.created_at
      }))

      return res.status(200).json({
        success: true,
        topics: formattedTopics
      })
    } catch (error) {
      console.error('Error fetching topics:', error)
      return res.status(500).json({
        error: 'Failed to fetch topics',
        message: error.message
      })
    }
  }

  /**
   * Get single topic with all questions
   * GET /api/admin/exercises/topics/:id
   */
  async getTopic(req, res) {
    try {
      const { id } = req.params

      const topic = await prisma.exerciseTopic.findUnique({
        where: { id: parseInt(id) },
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

      if (!topic) {
        return res.status(404).json({ error: 'Topic not found' })
      }

      return res.status(200).json({
        success: true,
        topic: {
          ...topic,
          tags: topic.tags.map(t => ({
            id: t.tag.id,
            name: t.tag.name,
            type: t.tag.type
          }))
        }
      })
    } catch (error) {
      console.error('Error fetching topic:', error)
      return res.status(500).json({
        error: 'Failed to fetch topic',
        message: error.message
      })
    }
  }

  /**
   * Update topic questions (replace all)
   * PUT /api/admin/exercises/topics/:id/questions
   */
  async updateQuestions(req, res) {
    try {
      const { id } = req.params
      const { questions } = req.body

      if (!questions || !Array.isArray(questions)) {
        return res.status(400).json({ error: 'Questions array is required' })
      }

      // Check if topic exists
      const topic = await prisma.exerciseTopic.findUnique({
        where: { id: parseInt(id) }
      })

      if (!topic) {
        return res.status(404).json({ error: 'Topic not found' })
      }

      // Delete existing questions and create new ones
      await prisma.$transaction([
        prisma.exerciseQuestion.deleteMany({
          where: { topic_id: parseInt(id) }
        }),
        prisma.exerciseQuestion.createMany({
          data: questions.map((q, index) => ({
            topic_id: parseInt(id),
            question: q.question,
            answer: q.answer,
            explanation: q.explanation,
            order: q.order !== undefined ? q.order : index
          }))
        })
      ])

      // Fetch updated topic
      const updatedTopic = await prisma.exerciseTopic.findUnique({
        where: { id: parseInt(id) },
        include: {
          questions: {
            orderBy: { order: 'asc' }
          }
        }
      })

      return res.status(200).json({
        success: true,
        topic: updatedTopic
      })
    } catch (error) {
      console.error('Error updating questions:', error)
      return res.status(500).json({
        error: 'Failed to update questions',
        message: error.message
      })
    }
  }

  /**
   * Add a single question to a topic
   * POST /api/admin/exercises/topics/:id/questions
   */
  async addQuestion(req, res) {
    try {
      const { id } = req.params
      const { question, answer, explanation, order } = req.body

      if (!question || !answer || !explanation) {
        return res.status(400).json({
          error: 'Question, answer, and explanation are required'
        })
      }

      // Validate question format
      if (!geminiService.validateQuestion({ question, answer, explanation })) {
        return res.status(400).json({
          error: 'Invalid question format. Question must contain exactly one ____'
        })
      }

      // Check if topic exists
      const topic = await prisma.exerciseTopic.findUnique({
        where: { id: parseInt(id) }
      })

      if (!topic) {
        return res.status(404).json({ error: 'Topic not found' })
      }

      // Get current max order
      const maxOrder = await prisma.exerciseQuestion.aggregate({
        where: { topic_id: parseInt(id) },
        _max: { order: true }
      })

      const newOrder = order !== undefined ? order : (maxOrder._max.order || 0) + 1

      // Create question
      const newQuestion = await prisma.exerciseQuestion.create({
        data: {
          topic_id: parseInt(id),
          question,
          answer,
          explanation,
          order: newOrder
        }
      })

      return res.status(201).json({
        success: true,
        question: newQuestion
      })
    } catch (error) {
      console.error('Error adding question:', error)
      return res.status(500).json({
        error: 'Failed to add question',
        message: error.message
      })
    }
  }

  /**
   * Delete a topic
   * DELETE /api/admin/exercises/topics/:id
   */
  async deleteTopic(req, res) {
    try {
      const { id } = req.params

      const topic = await prisma.exerciseTopic.findUnique({
        where: { id: parseInt(id) }
      })

      if (!topic) {
        return res.status(404).json({ error: 'Topic not found' })
      }

      // Soft delete by setting is_active to false
      await prisma.exerciseTopic.update({
        where: { id: parseInt(id) },
        data: { is_active: false }
      })

      return res.status(200).json({
        success: true,
        message: 'Topic deleted successfully'
      })
    } catch (error) {
      console.error('Error deleting topic:', error)
      return res.status(500).json({
        error: 'Failed to delete topic',
        message: error.message
      })
    }
  }

  /**
   * Get all tags
   * GET /api/admin/exercises/tags
   */
  async getTags(req, res) {
    try {
      const { type } = req.query

      const where = {
        is_active: true
      }

      if (type && ['university', 'semester'].includes(type)) {
        where.type = type
      }

      const tags = await prisma.tag.findMany({
        where,
        orderBy: [
          { type: 'asc' },
          { name: 'asc' }
        ]
      })

      return res.status(200).json({
        success: true,
        tags
      })
    } catch (error) {
      console.error('Error fetching tags:', error)
      return res.status(500).json({
        error: 'Failed to fetch tags',
        message: error.message
      })
    }
  }
}

export default new ExerciseController()
