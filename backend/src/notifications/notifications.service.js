export class NotificationsService {
  async getRecentAlerts(userId) {
    return [
      {
        id: 'notif_1',
        title: 'Stage 01 Protocol Initialized',
        message: 'Your baseline expectation record is ready for consultation entry.',
        type: 'INFO',
        timestamp: new Date().toISOString()
      },
      {
        id: 'notif_2',
        title: 'Civic Data Protection Guarantee',
        message: 'Your responses are safeguarded under the 2026 Civic Accountability Framework.',
        type: 'SECURITY',
        timestamp: new Date().toISOString()
      }
    ];
  }
}

export const notificationsService = new NotificationsService();
