import crypto from 'crypto';
import { db } from '../database/db.js';
import { NotFoundException, BadRequestException, ForbiddenException } from '../common/exceptions/HttpException.js';
import { validateFeedback } from '../common/validators/validate.js';

export class FeedbackService {
  /**
   * Checks if user is eligible to submit feedback (Must have registered expectation first)
   */
  async getEligibility(authenticatedUserId) {
    const expectation = db.expectations.find(e => e.user_id === authenticatedUserId);

    if (!expectation) {
      return {
        isEligible: false,
        reason: 'Please submit an expectation before providing feedback.',
        hasExpectation: false,
        feedbackSubmitted: false
      };
    }

    const feedback = db.feedback.find(f => f.expectation_id === expectation.id);

    return {
      isEligible: true,
      hasExpectation: true,
      expectationId: expectation.id,
      sessionId: expectation.session_id,
      feedbackSubmitted: Boolean(feedback),
      feedbackId: feedback ? feedback.id : null
    };
  }

  /**
   * Retrieves read-only baseline expectation for the Feedback reconciliation page
   */
  async getExpectationForFeedback(authenticatedUserId) {
    const expectation = db.expectations.find(e => e.user_id === authenticatedUserId);
    if (!expectation) {
      throw new BadRequestException('Please submit an expectation before providing feedback.');
    }

    const user = db.users.find(u => u.id === authenticatedUserId);
    const facility = user ? db.facilities.find(f => f.id === user.facility_id) : null;
    const existingFeedback = db.feedback.find(f => f.expectation_id === expectation.id);

    return {
      expectationId: expectation.id,
      sessionId: expectation.session_id,
      expectationText: expectation.expectation_text,
      submittedAt: expectation.submitted_at,
      facilityName: facility ? facility.name : 'Unknown Facility',
      facilityWard: facility ? facility.ward : 'General Ward',
      existingFeedback: existingFeedback ? {
        id: existingFeedback.id,
        expectationMet: existingFeedback.expectation_met,
        feedbackText: existingFeedback.feedback_text,
        tags: existingFeedback.tags || [],
        submittedAt: existingFeedback.submitted_at
      } : null
    };
  }

  /**
   * Submits post-service quality feedback.
   * STRICT CONDITIONAL BUSINESS RULE:
   * - IF expectation_met == TRUE: feedback_text is OPTIONAL
   * - IF expectation_met == FALSE: feedback_text is REQUIRED (non-empty)
   * - BACKEND OWNDERSHIP: User can ONLY submit feedback for their own expectation.
   */
  async submitFeedback(authenticatedUserId, rawData) {
    // 1. Retrieve the authenticated user's expectation
    const expectation = db.expectations.find(e => e.user_id === authenticatedUserId);
    if (!expectation) {
      throw new BadRequestException('Please submit an expectation before providing feedback.');
    }

    // 2. IDOR / Ownership Protection: verify expectation belongs to authenticated user
    if (expectation.user_id !== authenticatedUserId) {
      throw new ForbiddenException('You are not authorized to submit feedback for this expectation.');
    }

    // 3. Conditional business logic validation
    const validData = validateFeedback(rawData);

    // 4. Check if feedback already submitted - allow update or create new
    let feedback = db.feedback.find(f => f.expectation_id === expectation.id);

    const now = new Date();

    if (feedback) {
      feedback.expectation_met = validData.expectationMet;
      feedback.feedback_text = validData.feedbackText;
      feedback.tags = Array.isArray(rawData.tags) ? rawData.tags : [];
      feedback.updated_at = now;
      feedback.submitted_at = now;
    } else {
      feedback = {
        id: crypto.randomUUID(),
        expectation_id: expectation.id,
        user_id: authenticatedUserId,
        expectation_met: validData.expectationMet,
        feedback_text: validData.feedbackText,
        tags: Array.isArray(rawData.tags) ? rawData.tags : [],
        submitted_at: now,
        created_at: now,
        updated_at: now
      };
      db.feedback.unshift(feedback);
    }

    // Update expectation status to reconciled
    expectation.status = 'RECONCILED';
    expectation.updated_at = now;

    return {
      id: feedback.id,
      expectationId: feedback.expectation_id,
      expectationMet: feedback.expectation_met,
      feedbackText: feedback.feedback_text,
      tags: feedback.tags,
      submittedAt: feedback.submitted_at,
      message: 'Feedback submitted successfully'
    };
  }

  async getAllFeedback(filters = {}) {
    let results = [...db.feedback];

    if (filters.expectationMet !== undefined && filters.expectationMet !== '') {
      const isMet = filters.expectationMet === 'true' || filters.expectationMet === true;
      results = results.filter(f => f.expectation_met === isMet);
    }

    return results.map(f => {
      const user = db.users.find(u => u.id === f.user_id);
      const expectation = db.expectations.find(e => e.id === f.expectation_id);
      const state = user ? db.states.find(s => s.id === user.state_id) : null;
      const facility = user ? db.facilities.find(f => f.id === user.facility_id) : null;

      return {
        id: f.id,
        expectationId: f.expectation_id,
        expectationText: expectation ? expectation.expectation_text : 'N/A',
        sessionId: expectation ? expectation.session_id : 'N/A',
        expectationMet: f.expectation_met,
        feedbackText: f.feedback_text,
        tags: f.tags || [],
        submittedAt: f.submitted_at,
        userName: user ? `${user.first_name} ${user.last_name}` : 'Anonymous',
        userPhone: user ? user.phone_number : 'N/A',
        stateId: user ? user.state_id : null,
        stateName: state ? state.name : 'N/A',
        facilityId: user ? user.facility_id : null,
        facilityName: facility ? facility.name : 'N/A'
      };
    });
  }
}

export const feedbackService = new FeedbackService();
