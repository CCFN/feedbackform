import { HttpException } from '../exceptions/HttpException.js';

export function errorHandler(err, req, res, next) {
  console.error('[Error Logger]:', err);

  if (err instanceof HttpException) {
    return res.status(err.status).json({
      success: false,
      statusCode: err.status,
      message: err.message,
      errors: err.errors || null,
      timestamp: new Date().toISOString(),
      path: req.originalUrl,
    });
  }

  return res.status(500).json({
    success: false,
    statusCode: 500,
    message: err.message || 'Internal Server Error',
    timestamp: new Date().toISOString(),
    path: req.originalUrl,
  });
}
