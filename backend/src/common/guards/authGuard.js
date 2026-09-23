import jwt from 'jsonwebtoken';
import { UnauthorizedException, ForbiddenException } from '../exceptions/HttpException.js';

export const JWT_SECRET = process.env.JWT_SECRET || 'careecho-secure-jwt-secret-key-2026';
export const REFRESH_SECRET = process.env.REFRESH_SECRET || 'careecho-secure-refresh-secret-key-2026';

export function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = (authHeader && authHeader.startsWith('Bearer ')) 
    ? authHeader.split(' ')[1] 
    : (req.cookies && req.cookies.careecho_token);

  if (!token) {
    return next(new UnauthorizedException('Authentication required. Please log in with your phone number and password.'));
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return next(new UnauthorizedException('Authentication token expired. Please log in again.'));
    }
    return next(new UnauthorizedException('Invalid authentication token.'));
  }
}

export function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return next(new UnauthorizedException('Authentication required'));
    }
    if (!allowedRoles.includes(req.user.role)) {
      return next(new ForbiddenException('You are not authorized to perform this administrative action'));
    }
    next();
  };
}
