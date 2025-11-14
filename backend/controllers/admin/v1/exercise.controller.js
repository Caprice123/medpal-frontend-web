import { GenerateQuestionService } from '../../../services/exercise/generateQuestionService.js'
import { QuestionSerializer } from '../../../serializers/admin/v1/questionSerializer.js'
import { CreateExerciseTopicService } from '../../../services/exercise/createExerciseTopicService.js'
import { ExerciseTopicSerializer } from '../../../serializers/admin/v1/exerciseTopicSerializer.js'
import { GetExerciseTopicsService } from '../../../services/exercise/getExerciseTopicsService.js'
import { GetExerciseTopicDetailService } from '../../../services/exercise/getExerciseTopicDetailService.js'
import { UpdateExerciseQuestionsService } from '../../../services/exercise/updateExerciseQuestionsService.js'

class ExerciseController {
  async generateQuestions(req, res) {
    const { content, type, questionCount = 10 } = req.body

    const questions = await GenerateQuestionService.call({ content, type, questionCount })

    return res.status(200).json({
      data: QuestionSerializer.serialize(questions)
    })
  }

  async create(req, res) {
    const {
      title,
      description,
      content_type,
      content,
      pdf_url,
      tags,
      questions
    } = req.body

    const topic = await CreateExerciseTopicService.call({
      title,
      description,
      content_type,
      content,
      pdf_url,
      tags,
      questions,
      created_by: req.user.id
    })

    return res.status(201).json({
      success: true,
      data: ExerciseTopicSerializer.serialize(topic),
      message: 'Topic created successfully'
    })
  }

  /**
   * Get all topics with optional filters
   * GET /admin/v1/exercises/topics
   */
  async index(req, res) {
    const { university, semester } = req.query

    const topics = await GetExerciseTopicsService.call({ university, semester })

    return res.status(200).json({
      success: true,
      data: topics
    })
  }

  /**
   * Get single topic detail with questions
   * GET /admin/v1/exercises/topics/:id
   */
  async show(req, res) {
    const { id } = req.params

    const topic = await GetExerciseTopicDetailService.call(id)

    return res.status(200).json({
      success: true,
      data: ExerciseTopicSerializer.serialize(topic)
    })
  }

  async update(req, res) {
    const { id } = req.params
    const { questions } = req.body

    const updatedTopic = await UpdateExerciseQuestionsService.call(id, questions)

    return res.status(200).json({
      success: true,
      data: ExerciseTopicSerializer.serialize(updatedTopic)
    })
  }
}

export default new ExerciseController()
