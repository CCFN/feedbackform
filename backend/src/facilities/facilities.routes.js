import { Router } from 'express';
import { facilitiesController } from './facilities.controller.js';
import { authenticateToken, requireRole } from '../common/guards/authGuard.js';

const router = Router();

// Public routes for state-cascading dropdown on registration
router.get('/by-state/:stateId', (req, res, next) => facilitiesController.getFacilitiesByState(req, res, next));
router.get('/:id', (req, res, next) => facilitiesController.getFacilityById(req, res, next));

// Administrative routes
router.get('/', authenticateToken, requireRole('ADMIN', 'SUPER_ADMIN'), (req, res, next) => facilitiesController.getAllFacilities(req, res, next));
router.post('/admin', authenticateToken, requireRole('ADMIN', 'SUPER_ADMIN'), (req, res, next) => facilitiesController.createFacility(req, res, next));
router.put('/admin/:id', authenticateToken, requireRole('ADMIN', 'SUPER_ADMIN'), (req, res, next) => facilitiesController.updateFacility(req, res, next));
router.patch('/admin/:id/status', authenticateToken, requireRole('ADMIN', 'SUPER_ADMIN'), (req, res, next) => facilitiesController.toggleFacilityStatus(req, res, next));

export default router;
