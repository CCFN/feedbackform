import { Router } from 'express';
import { dashboardController } from './dashboard.controller.js';
import { authenticateToken } from '../common/guards/authGuard.js';

const router = Router();

router.get('/', authenticateToken, (req, res, next) => dashboardController.getDashboard(req, res, next));

export default router;
