import { authService } from './auth.service.js';
import { logAuditEvent } from '../common/middleware/auditLogger.js';

export class AuthController {
  async register(req, res, next) {
    try {
      const result = await authService.register(req.body);
      logAuditEvent('USER_REGISTERED', 'User', result.id, req, { phoneNumber: result.phoneNumber });

      res.status(201).json({
        success: true,
        message: 'Registration successful. You can now log in.',
        data: result
      });
    } catch (err) {
      next(err);
    }
  }

  async login(req, res, next) {
    try {
      const { phoneNumber, password } = req.body;
      const result = await authService.login(phoneNumber, password);
      
      // Set secure HTTP-only cookie
      res.cookie('careecho_token', result.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 8 * 60 * 60 * 1000 // 8 hours
      });

      logAuditEvent('USER_LOGIN', 'User', result.user.id, req, { phoneNumber: result.user.phoneNumber });

      res.json({
        success: true,
        message: 'Login successful',
        data: result
      });
    } catch (err) {
      next(err);
    }
  }

  async logout(req, res, next) {
    try {
      if (req.user) {
        logAuditEvent('USER_LOGOUT', 'User', req.user.id, req);
      }
      res.clearCookie('careecho_token');
      res.json({
        success: true,
        message: 'Logged out successfully'
      });
    } catch (err) {
      next(err);
    }
  }

  async refreshToken(req, res, next) {
    try {
      const { refreshToken } = req.body;
      const result = await authService.refreshToken(refreshToken);
      res.json({
        success: true,
        data: result
      });
    } catch (err) {
      next(err);
    }
  }
}

export const authController = new AuthController();
