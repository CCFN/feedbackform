import { Router } from 'express';
import { reportsController } from './reports.controller.js';
import { authenticateToken, requireRole } from '../common/guards/authGuard.js';

const router = Router();

router.get('/', authenticateToken, requireRole('ADMIN', 'SUPER_ADMIN'), (req, res, next) => reportsController.getReports(req, res, next));

export default router;
