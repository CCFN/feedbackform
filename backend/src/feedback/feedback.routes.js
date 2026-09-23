import { Router } from 'express';
import { feedbackController } from './feedback.controller.js';
import { authenticateToken, requireRole } from '../common/guards/authGuard.js';

const router = Router();

router.get('/eligibility', authenticateToken, (req, res, next) => feedbackController.getEligibility(req, res, next));
router.get('/expectation', authenticateToken, (req, res, next) => feedbackController.getExpectationForFeedback(req, res, next));
router.post('/', authenticateToken, (req, res, next) => feedbackController.submitFeedback(req, res, next));
router.get('/admin', authenticateToken, requireRole('ADMIN', 'SUPER_ADMIN'), (req, res, next) => feedbackController.getAllFeedback(req, res, next));

export default router;
