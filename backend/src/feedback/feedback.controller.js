import { feedbackService } from './feedback.service.js';
import { logAuditEvent } from '../common/middleware/auditLogger.js';

export class FeedbackController {
  async getEligibility(req, res, next) {
    try {
      const result = await feedbackService.getEligibility(req.user.id);
      res.json({
        success: true,
        data: result
      });
    } catch (err) {
      next(err);
    }
  }

  async getExpectationForFeedback(req, res, next) {
    try {
      const result = await feedbackService.getExpectationForFeedback(req.user.id);
      res.json({
        success: true,
        data: result
      });
    } catch (err) {
      next(err);
    }
  }

  async submitFeedback(req, res, next) {
    try {
      const result = await feedbackService.submitFeedback(req.user.id, req.body);
      logAuditEvent('FEEDBACK_CREATED', 'Feedback', result.id, req, {
        expectationMet: result.expectationMet,
        hasText: Boolean(result.feedbackText)
      });

      res.status(201).json({
        success: true,
        message: 'Feedback submitted successfully',
        data: result
      });
    } catch (err) {
      next(err);
    }
  }

  async getAllFeedback(req, res, next) {
    try {
      const results = await feedbackService.getAllFeedback(req.query);
      res.json({
        success: true,
        message: 'Feedback records retrieved',
        data: results
      });
    } catch (err) {
      next(err);
    }
  }
}

export const feedbackController = new FeedbackController();
