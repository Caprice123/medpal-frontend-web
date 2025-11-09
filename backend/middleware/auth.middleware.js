import { AuthorizationError } from '../errors/authorizationError.js';
import authService from '../services/auth.service.js';

/**
 * Authentication middleware
 * Verifies JWT token and attaches user to request
 */
export const authenticate = async (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new AuthorizationError("Authorization token is required")
    }

    const token = authHeader.replace('Bearer ', '');

    // Verify token and get user
    const { user, session } = await authService.verifyToken(token);

    // Attach user and session to request
    req.user = user;
    req.session = session;

    next();
  } catch (error) {
    throw new AuthorizationError("Invalid token")
  }
};

/**
 * Role-based authorization middleware
 * @param {Array<String>} roles - Allowed roles
 */
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions'
      });
    }

    next();
  };
};

export default {
  authenticate,
  authorize
};
