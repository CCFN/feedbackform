import { Router } from 'express';
import { authController } from './auth.controller.js';
import { authenticateToken } from '../common/guards/authGuard.js';

const router = Router();

router.post('/register', (req, res, next) => authController.register(req, res, next));
router.post('/login', (req, res, next) => authController.login(req, res, next));
router.post('/logout', (req, res, next) => authController.logout(req, res, next));
router.post('/refresh-token', (req, res, next) => authController.refreshToken(req, res, next));

export default router;
