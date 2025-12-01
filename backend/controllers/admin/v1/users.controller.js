import { ValidationUtils } from "../../../utils/validationUtils.js";
import { GetListUsersService } from "../../../services/users/getListUsersService.js";
import { AddCreditService } from "../../../services/users/addCreditService.js";
import { UserSerializer } from "../../../serializers/admin/v1/userSerializer.js";

class UsersController {
  async index(req, res) {
    ValidationUtils.validate_fields({
      request: req,
      requiredFields: [],
      optionalFields: ["email", "page", "perPage"],
    });
    const { users, isLastPage } = await GetListUsersService.call(req.query);

    res.status(200).json({
      data: UserSerializer.serialize(users),
      pagination: {
        page: req.query.page || 1,
        perPage: req.query.perPage || 50,
        isLastPage: isLastPage,
      },
    });
  }

  async addCredit(req, res) {
    ValidationUtils.validate_fields({
      request: req,
      requiredFields: ["userId", "credit"],
      optionalFields: [],
    });
    await AddCreditService.call(req.body.userId, req.body.credit);

    res.status(200).json({
      data: {
        success: true,
      },
    });
  }
}

export default new UsersController();
