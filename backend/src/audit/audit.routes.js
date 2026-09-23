import { Router } from 'express';
import { auditController } from './audit.controller.js';
import { authenticateToken, requireRole } from '../common/guards/authGuard.js';

const router = Router();

router.get('/', authenticateToken, requireRole('ADMIN', 'SUPER_ADMIN'), (req, res, next) => auditController.getLogs(req, res, next));

export default router;
