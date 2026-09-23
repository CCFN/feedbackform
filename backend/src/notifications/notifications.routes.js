import { Router } from 'express';
import { notificationsController } from './notifications.controller.js';
import { authenticateToken } from '../common/guards/authGuard.js';

const router = Router();

router.get('/', authenticateToken, (req, res, next) => notificationsController.getAlerts(req, res, next));

export default router;
