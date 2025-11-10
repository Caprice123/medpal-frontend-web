import { ValidationError } from '../../../errors/validationError.js';
import authService from '../../../services/auth.service.js';

class AuthController {
  /**
   * Login user with Google OAuth
   * POST /api/auth/login
   */
  async login(req, res) {
    try {
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
    } catch (error) {
      console.error('Login error:', error);
      return res.status(401).json({
        success: false,
        message: error.message || 'Authentication failed'
      });
    }
  }

  /**
   * Logout user
   * POST /api/auth/logout
   */
  async logout(req, res) {
    try {
      const token = req.headers.authorization?.replace('Bearer ', '');

      if (!token) {
        return res.status(400).json({
          success: false,
          message: 'Token is required'
        });
      }

      await authService.logout(token);

      return res.status(200).json({
        success: true,
        message: 'Logout successful'
      });
    } catch (error) {
      console.error('Logout error:', error);
      return res.status(500).json({
        success: false,
        message: 'Logout failed'
      });
    }
  }
}

export default new AuthController();
