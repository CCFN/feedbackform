import crypto from 'crypto';
import { db } from '../../database/db.js';

export function logAuditEvent(action, entityType, entityId, req, details = null) {
  try {
    const userId = req.user ? req.user.id : null;
    const ipAddress = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';
    const userAgent = req.headers['user-agent'] || 'CareEcho Client';

    const logEntry = {
      id: crypto.randomUUID(),
      user_id: userId,
      action,
      entity_type: entityType,
      entity_id: entityId,
      details,
      ip_address: ipAddress,
      user_agent: userAgent,
      created_at: new Date()
    };

    db.audit_logs.unshift(logEntry);
  } catch (err) {
    console.error('[Audit Logger Error]:', err.message);
  }
}
