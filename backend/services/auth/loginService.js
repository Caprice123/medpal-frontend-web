import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '#prisma/client';
import { ValidationError } from '#errors/validationError';
import { AuthorizationError } from '#errors/authorizationError';
import { verifyGoogleToken } from '#utils/googleAuth';
import { UpdateStatisticService, STAT_KEYS } from '#services/statistic/updateStatisticService';




const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '15m'; // Access token: 15 minutes
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '30d'; // Refresh token: 30 days
const SALT_ROUNDS = 10;

class AuthService {
  async login(googleToken, sessionData = {}) {
    const { userAgent, ipAddress } = sessionData;

    // Verify Google token and get user info
    const googleUserInfo = await verifyGoogleToken(googleToken);

    if (!googleUserInfo.emailVerified) {
      throw new ValidationError('Email not verified with Google');
    }

    // Check if user exists by email or googleId
    let user = await prisma.users.findFirst({
      where: {
        OR: [
          { email: googleUserInfo.email },
          { googleId: googleUserInfo.googleId }
        ]
      }
    });

    if (!user) {
      // Create new user
      user = await prisma.users.create({
        data: {
          email: googleUserInfo.email,
          name: googleUserInfo.name,
          picture: googleUserInfo.picture,
          googleId: googleUserInfo.googleId,
          role: 'user',
          isActive: true
        }
      });

      // Increment total users statistic
      await UpdateStatisticService.increment(STAT_KEYS.TOTAL_USERS);
    } else {
      // Update user info from Google if changed
      user = await prisma.users.update({
        where: { id: user.id },
        data: {
          name: googleUserInfo.name,
          picture: googleUserInfo.picture,
          googleId: googleUserInfo.googleId
        }
      });

      if (!user.isActive) {
        throw new AuthorizationError('User account is inactive');
      }
    }

    // Deactivate all old sessions for this user
    await this.deactivateUserSessions(user.id);

    // Generate access token (short-lived)
    const accessToken = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    // Generate refresh token (long-lived)
    const refreshToken = jwt.sign(
      {
        userId: user.id,
        type: 'refresh'
      },
      JWT_SECRET,
      { expiresIn: JWT_REFRESH_EXPIRES_IN }
    );

    // Calculate expiration dates
    const accessTokenExpiresAt = new Date();
    accessTokenExpiresAt.setMinutes(accessTokenExpiresAt.getMinutes() + 15); // 15 minutes from now

    const refreshTokenExpiresAt = new Date();
    refreshTokenExpiresAt.setDate(refreshTokenExpiresAt.getDate() + 30); // 30 days from now

    // Create new session with both tokens
    await prisma.user_sessions.create({
      data: {
        userId: user.id,
        token: accessToken,
        refreshToken: refreshToken,
        refreshTokenExpiresAt: refreshTokenExpiresAt,
        userAgent: userAgent || null,
        ipAddress: ipAddress || null,
        expiresAt: accessTokenExpiresAt,
        isActive: true
      }
    });

    return {
        user,
        accessToken,
        refreshToken,
        accessTokenExpiresAt: accessTokenExpiresAt.toISOString(),
        refreshTokenExpiresAt: refreshTokenExpiresAt.toISOString(),
    };
  }

  /**
   * Deactivate all sessions for a user
   * @param {String} userId
   */
  async deactivateUserSessions(userId) {
    await prisma.user_sessions.updateMany({
      where: {
        userId,
        isActive: true
      },
      data: {
        isActive: false
      }
    });
  }

  /**
   * Verify token and get session
   * @param {String} token
   * @returns {Object} { user, session }
   */
  async verifyToken(token) {
    try {
      // Verify JWT
      console.log(token)
      const decoded = jwt.verify(token, JWT_SECRET);
      console.log(decoded)

      // Check if session exists and is active
      const session = await prisma.user_sessions.findUnique({
        where: { token }
      });

      if (!session || !session.isActive) {
        throw new Error('Session is invalid or expired');
      }

      // Check if session has expired
      if (new Date() > session.expiresAt) {
        await prisma.user_sessions.update({
          where: { id: session.id },
          data: { isActive: false }
        });
        throw new AuthorizationError('Session has expired');
      }

      // Get user
      const user = await prisma.users.findUnique({
        where: { id: decoded.userId },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          isActive: true,
          createdAt: true,
          updatedAt: true
        }
      });

      if (!user || !user.isActive) {
        throw new Error('User not found or inactive');
      }

      // Update last active time
      await prisma.user_sessions.update({
        where: { id: session.id },
        data: { lastActiveAt: new Date() }
      });

      return { user, session };
    } catch (error) {
      console.error('Auth verifyToken error:', error)
      throw new AuthorizationError('Invalid or expired token');
    }
  }

  /**
   * Refresh access token using refresh token
   * @param {String} refreshToken
   * @returns {Object} { accessToken, refreshToken, accessTokenExpiresAt, refreshTokenExpiresAt }
   */
  async refreshToken(refreshToken) {
    try {
      // Verify refresh token
      const decoded = jwt.verify(refreshToken, JWT_SECRET);

      // Check if this is a refresh token
      if (decoded.type !== 'refresh') {
        throw new AuthorizationError('Invalid token type');
      }

      // Find session with this refresh token
      const session = await prisma.user_sessions.findUnique({
        where: { refreshToken }
      });

      if (!session || !session.isActive) {
        throw new AuthorizationError('Invalid or expired refresh token');
      }

      // Check if refresh token has expired
      if (new Date() > session.refreshTokenExpiresAt) {
        await prisma.user_sessions.update({
          where: { id: session.id },
          data: { isActive: false }
        });
        throw new AuthorizationError('Refresh token has expired');
      }

      // Get user
      const user = await prisma.users.findUnique({
        where: { id: decoded.userId }
      });

      if (!user || !user.isActive) {
        throw new AuthorizationError('User not found or inactive');
      }

      // Generate new access token
      const newAccessToken = jwt.sign(
        {
          userId: user.id,
          email: user.email,
          role: user.role
        },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
      );

      // Generate new refresh token (token rotation for security)
      const newRefreshToken = jwt.sign(
        {
          userId: user.id,
          type: 'refresh'
        },
        JWT_SECRET,
        { expiresIn: JWT_REFRESH_EXPIRES_IN }
      );

      // Calculate new expiration dates
      const accessTokenExpiresAt = new Date();
      accessTokenExpiresAt.setMinutes(accessTokenExpiresAt.getMinutes() + 15);

      const refreshTokenExpiresAt = new Date();
      refreshTokenExpiresAt.setDate(refreshTokenExpiresAt.getDate() + 30);

      // Update session with new tokens
      await prisma.user_sessions.update({
        where: { id: session.id },
        data: {
          token: newAccessToken,
          refreshToken: newRefreshToken,
          refreshTokenExpiresAt: refreshTokenExpiresAt,
          expiresAt: accessTokenExpiresAt,
          lastActiveAt: new Date()
        }
      });

      return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
        accessTokenExpiresAt: accessTokenExpiresAt.toISOString(),
        refreshTokenExpiresAt: refreshTokenExpiresAt.toISOString()
      };
    } catch (error) {
      if (error instanceof AuthorizationError) {
        throw error;
      }
      throw new AuthorizationError('Invalid or expired refresh token');
    }
  }

  /**
   * Logout - deactivate session
   * @param {String} token
   */
  async logout(token) {
    const session = await prisma.user_sessions.findUnique({
      where: { token }
    });

    if (session) {
      await prisma.user_sessions.update({
        where: { id: session.id },
        data: { isActive: false }
      });
    }

    return { success: true };
  }

  /**
   * Get all active sessions for a user
   * @param {String} userId
   */
  async getUserSessions(userId) {
    return await prisma.user_sessions.findMany({
      where: {
        userId,
        isActive: true
      },
      orderBy: {
        lastActiveAt: 'desc'
      }
    });
  }
}

export default new AuthService();



