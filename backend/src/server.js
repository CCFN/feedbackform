import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';

import authRoutes from './auth/auth.routes.js';
import statesRoutes from './states/states.routes.js';
import facilitiesRoutes from './facilities/facilities.routes.js';
import usersRoutes from './users/users.routes.js';
import expectationsRoutes from './expectations/expectations.routes.js';
import feedbackRoutes from './feedback/feedback.routes.js';
import dashboardRoutes from './dashboard/dashboard.routes.js';
import reportsRoutes from './reports/reports.routes.js';
import auditRoutes from './audit/audit.routes.js';
import notificationsRoutes from './notifications/notifications.routes.js';

import { errorHandler } from './common/middleware/errorHandler.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5050;

// Security & Parsing Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

// Login Rate Limiter (Brute-force protection)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // max 100 requests per IP in 15 mins
  message: {
    success: false,
    message: 'Too many authentication attempts from this IP, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'UP',
    framework: 'CareEcho Civic Accountability Framework v4.2',
    timestamp: new Date().toISOString()
  });
});

// Modular Application Routes
app.use('/api/auth', authRoutes);
app.use('/api/states', statesRoutes);
app.use('/api/facilities', facilitiesRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/expectations', expectationsRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/reports', reportsRoutes);
app.use('/api/audit', auditRoutes);
app.use('/api/notifications', notificationsRoutes);

// Global Error Handler
app.use(errorHandler);

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`\n======================================================`);
    console.log(` CareEcho Feedback Management API Server Online`);
    console.log(` URL: http://localhost:${PORT}`);
    console.log(` Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(` System Date: Oct 24, 2026 Authoritative`);
    console.log(` Zero Email Architecture Active`);
    console.log(`======================================================\n`);
  });
}

export default app;
