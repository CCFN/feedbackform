import { Router } from 'express';
import { expectationsController } from './expectations.controller.js';
import { authenticateToken, requireRole } from '../common/guards/authGuard.js';

const router = Router();

router.post('/', authenticateToken, (req, res, next) => expectationsController.createExpectation(req, res, next));
router.get('/me', authenticateToken, (req, res, next) => expectationsController.getMyExpectation(req, res, next));
router.get('/admin', authenticateToken, requireRole('ADMIN', 'SUPER_ADMIN'), (req, res, next) => expectationsController.getAllExpectations(req, res, next));

export default router;
