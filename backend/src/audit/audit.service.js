import { db } from '../database/db.js';

export class AuditService {
  async getAuditLogs(filters = {}) {
    let logs = [...db.audit_logs];

    if (filters.action) {
      logs = logs.filter(l => l.action === filters.action);
    }
    if (filters.entityType) {
      logs = logs.filter(l => l.entity_type === filters.entityType);
    }

    return logs.map(l => {
      const user = l.user_id ? db.users.find(u => u.id === l.user_id) : null;
      return {
        id: l.id,
        action: l.action,
        entityType: l.entity_type,
        entityId: l.entity_id,
        details: l.details,
        userName: user ? `${user.first_name} ${user.last_name}` : 'System / Guest',
        userPhone: user ? user.phone_number : 'N/A',
        ipAddress: l.ip_address,
        createdAt: l.created_at
      };
    });
  }
}

export const auditService = new AuditService();
