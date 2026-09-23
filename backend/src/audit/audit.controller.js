import { auditService } from './audit.service.js';

export class AuditController {
  async getLogs(req, res, next) {
    try {
      const logs = await auditService.getAuditLogs(req.query);
      res.json({
        success: true,
        data: logs
      });
    } catch (err) {
      next(err);
    }
  }
}

export const auditController = new AuditController();
