import { Router } from 'express';
import { usersController } from './users.controller.js';
import { authenticateToken, requireRole } from '../common/guards/authGuard.js';

const router = Router();

router.get('/me', authenticateToken, (req, res, next) => usersController.getProfile(req, res, next));
router.get('/admin', authenticateToken, requireRole('ADMIN', 'SUPER_ADMIN'), (req, res, next) => usersController.getAllUsers(req, res, next));
router.patch('/admin/:id/status', authenticateToken, requireRole('ADMIN', 'SUPER_ADMIN'), (req, res, next) => usersController.toggleUserStatus(req, res, next));

export default router;
