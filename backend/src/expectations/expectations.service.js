import crypto from 'crypto';
import { db } from '../database/db.js';
import { NotFoundException, BadRequestException, ForbiddenException } from '../common/exceptions/HttpException.js';
import { validateExpectation } from '../common/validators/validate.js';

export class ExpectationsService {
  /**
   * Records a new pre-service expectation.
   * Derives user ID strictly from authenticated session (IDOR protection).
   * Generates authoritative server timestamp.
   */
  async createExpectation(authenticatedUserId, rawData) {
    // 1. Validate payload
    const validData = validateExpectation(rawData);

    // 2. Verify user exists
    const user = db.users.find(u => u.id === authenticatedUserId);
    if (!user) {
      throw new NotFoundException('Authenticated user not found');
    }

    // Generate session ID
    const randomDigits = Math.floor(10000 + Math.random() * 90000);
    const sessionId = `#CK-${randomDigits}`;

    const newExpectation = {
      id: crypto.randomUUID(),
      user_id: authenticatedUserId,
      session_id: sessionId,
      expectation_text: validData.expectationText,
      status: 'RECORDED',
      submitted_at: new Date(),
      created_at: new Date(),
      updated_at: new Date()
    };

    db.expectations.unshift(newExpectation);

    const facility = db.facilities.find(f => f.id === user.facility_id);
    const state = db.states.find(s => s.id === user.state_id);

    return {
      id: newExpectation.id,
      sessionId: newExpectation.session_id,
      expectationText: newExpectation.expectation_text,
      status: newExpectation.status,
      submittedAt: newExpectation.submitted_at,
      facilityName: facility ? facility.name : 'Unknown Facility',
      facilityWard: facility ? facility.ward : 'General Ward',
      stateName: state ? state.name : 'Unknown State'
    };
  }

  async getMyLatestExpectation(authenticatedUserId) {
    const expectation = db.expectations.find(e => e.user_id === authenticatedUserId);
    if (!expectation) {
      return null;
    }

    const user = db.users.find(u => u.id === authenticatedUserId);
    const facility = user ? db.facilities.find(f => f.id === user.facility_id) : null;

    // Check if feedback already submitted for this expectation
    const feedback = db.feedback.find(f => f.expectation_id === expectation.id);

    return {
      id: expectation.id,
      sessionId: expectation.session_id,
      expectationText: expectation.expectation_text,
      status: expectation.status,
      submittedAt: expectation.submitted_at,
      facilityName: facility ? facility.name : 'Unknown Facility',
      facilityWard: facility ? facility.ward : 'General Ward',
      hasFeedback: Boolean(feedback),
      feedback: feedback ? {
        id: feedback.id,
        expectationMet: feedback.expectation_met,
        feedbackText: feedback.feedback_text,
        submittedAt: feedback.submitted_at
      } : null
    };
  }

  async getAllExpectations(filters = {}) {
    let results = [...db.expectations];

    return results.map(exp => {
      const user = db.users.find(u => u.id === exp.user_id);
      const state = user ? db.states.find(s => s.id === user.state_id) : null;
      const facility = user ? db.facilities.find(f => f.id === user.facility_id) : null;
      const feedback = db.feedback.find(f => f.expectation_id === exp.id);

      return {
        id: exp.id,
        sessionId: exp.session_id,
        expectationText: exp.expectation_text,
        submittedAt: exp.submitted_at,
        userName: user ? `${user.first_name} ${user.last_name}` : 'Unknown',
        userPhone: user ? user.phone_number : 'N/A',
        stateId: user ? user.state_id : null,
        stateName: state ? state.name : 'N/A',
        facilityId: user ? user.facility_id : null,
        facilityName: facility ? facility.name : 'N/A',
        hasFeedback: Boolean(feedback),
        expectationMet: feedback ? feedback.expectation_met : null
      };
    });
  }
}

export const expectationsService = new ExpectationsService();
