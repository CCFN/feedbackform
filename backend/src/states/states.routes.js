import { Router } from 'express';
import { statesController } from './states.controller.js';
import { authenticateToken, requireRole } from '../common/guards/authGuard.js';

const router = Router();

// Public route for registration dropdown
router.get('/', (req, res, next) => statesController.getPublicStates(req, res, next));

// Administrative routes
router.get('/all', authenticateToken, requireRole('ADMIN', 'SUPER_ADMIN'), (req, res, next) => statesController.getAllStates(req, res, next));
router.get('/:id', (req, res, next) => statesController.getStateById(req, res, next));
router.post('/admin', authenticateToken, requireRole('ADMIN', 'SUPER_ADMIN'), (req, res, next) => statesController.createState(req, res, next));
router.put('/admin/:id', authenticateToken, requireRole('ADMIN', 'SUPER_ADMIN'), (req, res, next) => statesController.updateState(req, res, next));
router.patch('/admin/:id/status', authenticateToken, requireRole('ADMIN', 'SUPER_ADMIN'), (req, res, next) => statesController.toggleStateStatus(req, res, next));

export default router;
