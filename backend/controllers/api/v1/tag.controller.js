import { GetTagsService } from '../../../services/tag/getTagsService.js'
import { CreateTagService } from '../../../services/tag/createTagService.js'
import { UpdateTagService } from '../../../services/tag/updateTagService.js'
import { DeleteTagService } from '../../../services/tag/deleteTagService.js'

class TagController {
  /**
   * Get all tags with optional type filter
   * GET /api/v1/tags
   */
  async index(req, res) {
    const { type } = req.query

    const tags = await GetTagsService.call({ type })

    return res.status(200).json({
      success: true,
      data: tags
    })
  }

  /**
   * Create new tag
   * POST /api/v1/tags
   */
  async create(req, res) {
    const { name, type } = req.body

    const tag = await CreateTagService.call({ name, type })

    return res.status(201).json({
      success: true,
      data: tag
    })
  }

  /**
   * Update existing tag
   * PUT /api/v1/tags/:id
   */
  async update(req, res) {
    const { id } = req.params
    const { name, type } = req.body

    const tag = await UpdateTagService.call(id, { name, type })

    return res.status(200).json({
      success: true,
      data: tag
    })
  }

  /**
   * Delete tag (soft delete)
   * DELETE /api/v1/tags/:id
   */
  async destroy(req, res) {
    const { id } = req.params

    await DeleteTagService.call(id)

    return res.status(200).json({
      success: true,
      message: 'Tag deleted successfully'
    })
  }
}

export default new TagController()
