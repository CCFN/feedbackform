import { db } from '../database/db.js';
import { NotFoundException } from '../common/exceptions/HttpException.js';

export class DashboardService {
  async getDashboardData(authenticatedUserId) {
    const user = db.users.find(u => u.id === authenticatedUserId);
    if (!user) {
      throw new NotFoundException('User account not found');
    }

    const state = db.states.find(s => s.id === user.state_id);
    const facility = db.facilities.find(f => f.id === user.facility_id);

    // Get expectation
    const expectation = db.expectations.find(e => e.user_id === authenticatedUserId);
    const hasExpectation = Boolean(expectation);

    // Get feedback
    const feedback = hasExpectation ? db.feedback.find(f => f.expectation_id === expectation.id) : null;
    const hasFeedback = Boolean(feedback);

    return {
      user: {
        id: user.id,
        firstName: user.first_name,
        lastName: user.last_name,
        phoneNumber: user.phone_number,
        role: user.role,
        avatar: user.avatar || 'avatar_1',
        stateId: user.state_id,
        stateName: state ? state.name : 'Unknown State',
        facilityId: user.facility_id,
        facilityName: facility ? facility.name : 'Primary Care Facility',
        facilityWard: facility ? facility.ward : 'West Campus (Ward 4B)'
      },
      careWorkflow: {
        currentStage: hasFeedback ? 2 : (hasExpectation ? 2 : 1),
        stage1Status: hasExpectation ? 'COMPLETED' : 'AWAITING_INPUT',
        stage2Status: hasFeedback ? 'COMPLETED' : (hasExpectation ? 'AVAILABLE' : 'LOCKED')
      },
      expectation: {
        exists: hasExpectation,
        id: expectation ? expectation.id : null,
        sessionId: expectation ? expectation.session_id : null,
        text: expectation ? expectation.expectation_text : null,
        submittedAt: expectation ? expectation.submitted_at : null
      },
      feedback: {
        enabled: hasExpectation,
        submitted: hasFeedback,
        id: feedback ? feedback.id : null,
        expectationMet: feedback ? feedback.expectation_met : null,
        feedbackText: feedback ? feedback.feedback_text : null
      },
      system: {
        date: 'Oct 24, 2026',
        timestamp: new Date().toISOString(),
        framework: 'CareEcho Civic Accountability Framework'
      }
    };
  }
}

export const dashboardService = new DashboardService();
