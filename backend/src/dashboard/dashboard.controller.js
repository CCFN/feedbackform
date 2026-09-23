import { dashboardService } from './dashboard.service.js';

export class DashboardController {
  async getDashboard(req, res, next) {
    try {
      const data = await dashboardService.getDashboardData(req.user.id);
      res.json({
        success: true,
        data
      });
    } catch (err) {
      next(err);
    }
  }
}

export const dashboardController = new DashboardController();
