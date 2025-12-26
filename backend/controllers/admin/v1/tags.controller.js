import { ValidationUtils } from '#utils/validationUtils'
import { GetListTagService } from '#services/tags/getListTagService'
import { CreateTagService } from '#services/tags/createTagService'
import { UpdateTagService } from '#services/tags/updateTagService'
import { TagSerializer } from '#serializers/admin/v1/tagSerializer'
import { TagGroupSerializer } from '#serializers/admin/v1/tagGroupSerializer'

class TagsController {
  async index(req, res) {
    ValidationUtils.validate_fields({
        request: req,
        requiredFields: [],
        optionalFields: [
            "groupName",
        ]
    })
    const tagGroup = await GetListTagService.call(req.query)

    res.status(200).json({
      data: TagGroupSerializer.serialize(tagGroup),
    })
  }

  async create(req, res) {
    ValidationUtils.validate_fields({
        request: req,
        requiredFields: [
            "groupName",
            "name",
        ],
    })
    const tag = await CreateTagService.call(req.body)

    res.status(200).json({
      data: TagSerializer.serialize(tag),
    })
  }

  async update(req, res) {
    const { id } = req.params
    const tag = await UpdateTagService.call(id, req.body)

    res.status(200).json({
      data: TagSerializer.serialize(tag),
    })
  }
}

export default new TagsController()
