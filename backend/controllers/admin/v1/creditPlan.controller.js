import { GetDetailCreditPlanService } from '../../../services/creditPlan/getDetailCreditPlanService.js'
import { CreditPlanDetailSerializer } from '../../../serializers/admin/v1/creditPlanDetailSerializer.js'
import { CreditPlanSerializer } from '../../../serializers/admin/v1/creditPlanSerializer.js'
import { GetListCreditsService } from '../../../services/creditPlan/getListCreditsService.js'
import { CreateCreditPlanService } from '../../../services/creditPlan/createCreditPlanService.js'
import { updateCreditPlanService } from '../../../services/creditPlan/updateCreditplanService.js'
import { ToggleCreditPlanService } from '../../../services/creditPlan/toggleCreditPlanService.js'

class CreditPlanController {
    async index(req, res) {
        const plans = await GetListCreditsService.call(req)

        res.status(200).json({
            success: true,
            data: CreditPlanSerializer.serialize(plans)
        })
    }

    async show(req, res) {
        const { id } = req.params
        const plan = await GetDetailCreditPlanService.call(id)

        res.status(200).json({
            data: CreditPlanDetailSerializer.serialize(plan)
        })
    }

    async create(req, res) {
        const plan = await CreateCreditPlanService.call(req)

        res.status(201).json({
            data: CreditPlanDetailSerializer.serialize(plan)
        })
    }

    async update(req, res) {
        const { id } = req.params
        const plan = await updateCreditPlanService.call(id, req)

        res.status(200).json({
            data: CreditPlanDetailSerializer.serialize(plan)
        })
    }
    
    async toggle(req, res) {
        const { id } = req.params
        const plan = await ToggleCreditPlanService.call(id, req)

        res.status(200).json({
            data: CreditPlanDetailSerializer.serialize(plan)
        })
    }
}

export default new CreditPlanController();
