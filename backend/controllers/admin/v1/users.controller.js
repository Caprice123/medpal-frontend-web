import { ValidationUtils } from "#utils/validationUtils";
import { GetListUsersService } from "#services/users/getListUsersService";
import { AddCreditService } from "#services/users/addCreditService";
import { AddSubscriptionService } from "#services/users/addSubscriptionService";
import { UserSerializer } from "#serializers/admin/v1/userSerializer";

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

  async addSubscription(req, res) {
    ValidationUtils.validate_fields({
      request: req,
      requiredFields: ["userId", "startDate", "endDate"],
      optionalFields: [],
    });
    await AddSubscriptionService.call(
      req.body.userId,
      req.body.startDate,
      req.body.endDate
    );

    res.status(200).json({
      data: {
        success: true,
      },
    });
  }
}

export default new UsersController();
