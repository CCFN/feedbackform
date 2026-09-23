import { expectationsService } from './expectations.service.js';
import { logAuditEvent } from '../common/middleware/auditLogger.js';

export class ExpectationsController {
  async createExpectation(req, res, next) {
    try {
      const expectation = await expectationsService.createExpectation(req.user.id, req.body);
      logAuditEvent('EXPECTATION_CREATED', 'Expectation', expectation.id, req, { sessionId: expectation.sessionId });

      res.status(201).json({
        success: true,
        message: 'Expectation submitted successfully. Post-visit Feedback is now unlocked.',
        data: expectation
      });
    } catch (err) {
      next(err);
    }
  }

  async getMyExpectation(req, res, next) {
    try {
      const expectation = await expectationsService.getMyLatestExpectation(req.user.id);
      res.json({
        success: true,
        data: expectation
      });
    } catch (err) {
      next(err);
    }
  }

  async getAllExpectations(req, res, next) {
    try {
      const expectations = await expectationsService.getAllExpectations(req.query);
      res.json({
        success: true,
        message: 'Administrative expectations list retrieved',
        data: expectations
      });
    } catch (err) {
      next(err);
    }
  }
}

export const expectationsController = new ExpectationsController();
