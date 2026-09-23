import { db } from '../database/db.js';

export class ReportsService {
  async getMetrics(filters = {}) {
    let users = [...db.users];
    let expectations = [...db.expectations];
    let feedback = [...db.feedback];

    if (filters.stateId) {
      const userIdsInState = users.filter(u => u.state_id === filters.stateId).map(u => u.id);
      expectations = expectations.filter(e => userIdsInState.includes(e.user_id));
      feedback = feedback.filter(f => userIdsInState.includes(f.user_id));
    }

    if (filters.facilityId) {
      const userIdsInFacility = users.filter(u => u.facility_id === filters.facilityId).map(u => u.id);
      expectations = expectations.filter(e => userIdsInFacility.includes(e.user_id));
      feedback = feedback.filter(f => userIdsInFacility.includes(f.user_id));
    }

    const totalUsers = users.length;
    const totalExpectations = expectations.length;
    const totalFeedback = feedback.length;

    const metCount = feedback.filter(f => f.expectation_met === true).length;
    const notMetCount = feedback.filter(f => f.expectation_met === false).length;

    const percentageMet = totalFeedback > 0 ? Number(((metCount / totalFeedback) * 100).toFixed(1)) : 0;
    const percentageNotMet = totalFeedback > 0 ? Number(((notMetCount / totalFeedback) * 100).toFixed(1)) : 0;

    return {
      summary: {
        totalUsers,
        totalExpectations,
        totalFeedback,
        expectationsMet: metCount,
        expectationsNotMet: notMetCount,
        percentageMet,
        percentageNotMet
      },
      filtersApplied: {
        stateId: filters.stateId || null,
        facilityId: filters.facilityId || null
      },
      generatedAt: new Date().toISOString()
    };
  }
}

export const reportsService = new ReportsService();
