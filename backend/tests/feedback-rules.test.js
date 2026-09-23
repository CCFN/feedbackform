import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert';
import { feedbackService } from '../src/feedback/feedback.service.js';
import { expectationsService } from '../src/expectations/expectations.service.js';
import { authService } from '../src/auth/auth.service.js';
import { db } from '../src/database/db.js';

describe('Mandatory Feedback Rule Validation (Tests 1-6)', () => {
  let testUserId = 'test-user-uuid-1234';

  beforeEach(() => {
    // Reset test user and expectations
    db.users = db.users.filter(u => u.id !== testUserId && u.id !== 'other-user-uuid-5678');
    db.expectations = db.expectations.filter(e => e.user_id !== testUserId && e.user_id !== 'other-user-uuid-5678');
    db.feedback = db.feedback.filter(f => f.user_id !== testUserId && f.user_id !== 'other-user-uuid-5678');

    // Create active test user
    db.users.push({
      id: testUserId,
      first_name: 'Test',
      last_name: 'Patient',
      phone_number: '+2348099999999',
      password_hash: 'hashed',
      state_id: '22222222-2222-4222-8222-222222222222',
      facility_id: '2a111111-1111-4111-8111-111111111111',
      role: 'USER',
      status: 'ACTIVE',
      created_at: new Date()
    });
  });

  // TEST 1: Expectation exists, expectation_met = YES, feedback = empty -> SUCCESS
  it('Test 1: Expectation exists, expectation_met = YES, feedback = empty -> SUCCESS', async () => {
    // 1. Submit expectation
    await expectationsService.createExpectation(testUserId, {
      expectationText: 'I expect timely consultation within 15 minutes.'
    });

    // 2. Submit feedback with Yes and empty feedback text
    const result = await feedbackService.submitFeedback(testUserId, {
      expectationMet: true,
      feedbackText: ''
    });

    assert.strictEqual(result.expectationMet, true);
    assert.strictEqual(result.feedbackText, null);
    assert.ok(result.id, 'Feedback record should be created');
  });

  // TEST 2: Expectation exists, expectation_met = YES, feedback = "Good experience" -> SUCCESS
  it('Test 2: Expectation exists, expectation_met = YES, feedback = "Good experience" -> SUCCESS', async () => {
    await expectationsService.createExpectation(testUserId, {
      expectationText: 'I expect clean facilities and clear explanations.'
    });

    const result = await feedbackService.submitFeedback(testUserId, {
      expectationMet: true,
      feedbackText: 'Good experience'
    });

    assert.strictEqual(result.expectationMet, true);
    assert.strictEqual(result.feedbackText, 'Good experience');
    assert.ok(result.id);
  });

  // TEST 3: Expectation exists, expectation_met = NO, feedback = "The training was too short" -> SUCCESS
  it('Test 3: Expectation exists, expectation_met = NO, feedback = "The training was too short" -> SUCCESS', async () => {
    await expectationsService.createExpectation(testUserId, {
      expectationText: 'I expect prompt service and clear communication.'
    });

    const result = await feedbackService.submitFeedback(testUserId, {
      expectationMet: false,
      feedbackText: 'The training was too short'
    });

    assert.strictEqual(result.expectationMet, false);
    assert.strictEqual(result.feedbackText, 'The training was too short');
    assert.ok(result.id);
  });

  // TEST 4: Expectation exists, expectation_met = NO, feedback = empty -> FAILURE
  it('Test 4: Expectation exists, expectation_met = NO, feedback = empty -> FAILURE', async () => {
    await expectationsService.createExpectation(testUserId, {
      expectationText: 'I expect standard doctor consultation.'
    });

    await assert.rejects(
      async () => {
        await feedbackService.submitFeedback(testUserId, {
          expectationMet: false,
          feedbackText: ''
        });
      },
      (err) => {
        assert.strictEqual(err.status, 400);
        assert.ok(err.errors.feedbackText.includes('explaining why your expectation was not met'));
        return true;
      }
    );
  });

  // TEST 5: Expectation exists, expectation_met = NULL, feedback = empty -> FAILURE
  it('Test 5: Expectation exists, expectation_met = NULL, feedback = empty -> FAILURE', async () => {
    await expectationsService.createExpectation(testUserId, {
      expectationText: 'I expect standard consultation.'
    });

    await assert.rejects(
      async () => {
        await feedbackService.submitFeedback(testUserId, {
          expectationMet: null,
          feedbackText: ''
        });
      },
      (err) => {
        assert.strictEqual(err.status, 400);
        assert.ok(err.errors.expectationMet.includes('indicate whether your expectation was met'));
        return true;
      }
    );
  });

  // TEST 6: No expectation, expectation_met = YES -> FAILURE
  it('Test 6: No expectation, expectation_met = YES -> FAILURE', async () => {
    // User has NO expectation in database
    await assert.rejects(
      async () => {
        await feedbackService.submitFeedback(testUserId, {
          expectationMet: true,
          feedbackText: 'No expectation existed before this'
        });
      },
      (err) => {
        assert.strictEqual(err.status, 400);
        assert.strictEqual(err.message, 'Please submit an expectation before providing feedback.');
        return true;
      }
    );
  });
});
