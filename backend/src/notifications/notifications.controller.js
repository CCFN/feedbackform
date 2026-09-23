import { notificationsService } from './notifications.service.js';

export class NotificationsController {
  async getAlerts(req, res, next) {
    try {
      const alerts = await notificationsService.getRecentAlerts(req.user.id);
      res.json({
        success: true,
        data: alerts
      });
    } catch (err) {
      next(err);
    }
  }
}

export const notificationsController = new NotificationsController();
