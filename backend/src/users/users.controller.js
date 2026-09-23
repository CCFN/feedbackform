import { usersService } from './users.service.js';
import { logAuditEvent } from '../common/middleware/auditLogger.js';

export class UsersController {
  async getProfile(req, res, next) {
    try {
      const user = await usersService.getUserById(req.user.id);
      res.json({
        success: true,
        data: user
      });
    } catch (err) {
      next(err);
    }
  }

  async getAllUsers(req, res, next) {
    try {
      const users = await usersService.getAllUsers(req.query);
      res.json({
        success: true,
        message: 'Users list retrieved',
        data: users
      });
    } catch (err) {
      next(err);
    }
  }

  async toggleUserStatus(req, res, next) {
    try {
      const updated = await usersService.toggleUserStatus(req.params.id);
      logAuditEvent('USER_STATUS_TOGGLED', 'User', updated.id, req, { status: updated.status });
      res.json({
        success: true,
        message: `User status changed to ${updated.status}`,
        data: updated
      });
    } catch (err) {
      next(err);
    }
  }
}

export const usersController = new UsersController();
