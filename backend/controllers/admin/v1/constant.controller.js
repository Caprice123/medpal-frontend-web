import { GetConstantsService } from '#services/constant/getConstantsService'
import { UpdateConstantsService } from '#services/constant/updateConstantsService'

class ConstantController {
  async index(req, res) {
    const { keys } = req.query

    // Parse keys if provided as comma-separated string
    const keyArray = keys ? keys.split(',').map(k => k.trim()) : null

    const constants = await GetConstantsService.call(keyArray)

    return res.status(200).json({
      data: constants
    })
  }

  async update(req, res) {
    const constants = await UpdateConstantsService.call(req.body)

    return res.status(200).json({
        data: {
            success: true,
        }
    })
  }
}

export default new ConstantController()
