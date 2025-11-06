import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../prisma/client.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';
const SALT_ROUNDS = 10;

class AuthService {
  /**
   * Login or create user
   * @param {Object} userData - { email, password, name }
   * @param {Object} sessionData - { userAgent, ipAddress }
   * @returns {Object} { user, token, session }
   */
  async loginOrCreateUser(userData, sessionData = {}) {
    const { email, password, name } = userData;
    const { userAgent, ipAddress } = sessionData;

    // Check if user exists
    let user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        name: true,
        password: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true
      }
    });

    let isNewUser = false;

    if (!user) {
      // Create new user
      const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
      user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          name: name || null,
          role: 'user'
        }
      });
      isNewUser = true;
    } else {
      // Verify password for existing user
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new Error('Invalid credentials');
      }

      if (!user.isActive) {
        throw new Error('User account is inactive');
      }
    }

    // Deactivate all old sessions for this user
    await this.deactivateUserSessions(user.id);

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    // Create new session
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days from now

    const session = await prisma.userSession.create({
      data: {
        userId: user.id,
        token,
        userAgent: userAgent || null,
        ipAddress: ipAddress || null,
        expiresAt,
        isActive: true
      }
    });

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      token,
      session,
      isNewUser
    };
  }

  /**
   * Deactivate all sessions for a user
   * @param {String} userId
   */
  async deactivateUserSessions(userId) {
    await prisma.userSession.updateMany({
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
      const decoded = jwt.verify(token, JWT_SECRET);

      // Check if session exists and is active
      const session = await prisma.userSession.findUnique({
        where: { token }
      });

      if (!session || !session.isActive) {
        throw new Error('Session is invalid or expired');
      }

      // Check if session has expired
      if (new Date() > session.expiresAt) {
        await prisma.userSession.update({
          where: { id: session.id },
          data: { isActive: false }
        });
        throw new Error('Session has expired');
      }

      // Get user
      const user = await prisma.user.findUnique({
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
      await prisma.userSession.update({
        where: { id: session.id },
        data: { lastActiveAt: new Date() }
      });

      return { user, session };
    } catch (error) {
      throw new Error('Invalid or expired token');
    }
  }

  /**
   * Logout - deactivate session
   * @param {String} token
   */
  async logout(token) {
    const session = await prisma.userSession.findUnique({
      where: { token }
    });

    if (session) {
      await prisma.userSession.update({
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
    return await prisma.userSession.findMany({
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
