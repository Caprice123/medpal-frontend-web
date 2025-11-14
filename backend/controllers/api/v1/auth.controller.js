import { ValidationError } from '../../../errors/validationError.js';
import authService from '../../../services/auth.service.js';

class AuthController {
  /**
   * Login user with Google OAuth
   * POST /api/auth/login
   */
  async login(req, res) {
    const { googleToken } = req.body;

    // Validate input
    if (!googleToken) {
      throw new ValidationError("Google token is required");
    }

    // Get session data from request
    const sessionData = {
      userAgent: req.headers['user-agent'],
      ipAddress: req.ip || req.connection.remoteAddress
    };

    // Call service method
    const result = await authService.login(
      googleToken,
      sessionData
    );

    return res.status(200).json({
      data: {
        user: result.user,
        token: result.token,
        expiredAt: result.expiredAt,
      }
    });
  }

  /**
   * Logout user
   * POST /api/auth/logout
   */
  async logout(req, res) {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      throw new ValidationError('Token is required');
    }

    await authService.logout(token);

    return res.status(200).json({
      success: true,
      message: 'Logout successful'
    });
  }
}

export default new AuthController();
