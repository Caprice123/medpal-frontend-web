import { ValidationUtils } from "#utils/validationUtils";
import { AddSubscriptionService } from "#services/users/addSubscriptionService";

class SubscriptionsController {
  /**
   * Add a subscription for a user
   * POST /admin/v1/subscriptions
   */
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

export default new SubscriptionsController();
