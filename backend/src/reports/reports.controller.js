import { reportsService } from './reports.service.js';

export class ReportsController {
  async getReports(req, res, next) {
    try {
      const metrics = await reportsService.getMetrics(req.query);
      res.json({
        success: true,
        message: 'Administrative reports generated',
        data: metrics
      });
    } catch (err) {
      next(err);
    }
  }
}

export const reportsController = new ReportsController();
