import { describe, it } from 'node:test';
import assert from 'node:assert';
import { normalizePhoneNumber, isValidPhoneNumber, validatePasswordStrength } from '../src/common/validators/validate.js';
import { authService } from '../src/auth/auth.service.js';
import { expectationsService } from '../src/expectations/expectations.service.js';
import { feedbackService } from '../src/feedback/feedback.service.js';
import { db } from '../src/database/db.js';

describe('Authentication & Validation Test Suite', () => {

  it('Normalizes Nigerian phone numbers across various input formats to consistent +234 standard', () => {
    assert.strictEqual(normalizePhoneNumber('08012345678'), '+2348012345678');
    assert.strictEqual(normalizePhoneNumber('+2348012345678'), '+2348012345678');
    assert.strictEqual(normalizePhoneNumber('2348012345678'), '+2348012345678');
    assert.strictEqual(normalizePhoneNumber('09087654321'), '+2349087654321');
    assert.strictEqual(normalizePhoneNumber('07011223344'), '+2347011223344');
    assert.strictEqual(normalizePhoneNumber('+1 (555) 019-2834'), '+15550192834');
  });

  it('Validates password strength (min 8 chars, uppercase, lowercase, number, special char)', () => {
    assert.strictEqual(validatePasswordStrength('weak').isValid, false);
    assert.strictEqual(validatePasswordStrength('Alllowercase1!').isValid, true);
    assert.strictEqual(validatePasswordStrength('NoSpecialChar123').isValid, false);
    assert.strictEqual(validatePasswordStrength('NoNumber!@#').isValid, false);
    assert.strictEqual(validatePasswordStrength('Password@123').isValid, true);
  });

  it('Rejects registration if facility does not belong to selected state (Server-side validation)', async () => {
    const anambraStateId = '22222222-2222-4222-8222-222222222222';
    const lagosFacilityId = '5a222222-2222-4222-8222-222222222222'; // Belong to Lagos, not Anambra

    await assert.rejects(
      async () => {
        await authService.register({
          firstName: 'Security',
          lastName: 'Tester',
          phoneNumber: '08123456789',
          stateId: anambraStateId,
          facilityId: lagosFacilityId,
          password: 'Password@123',
          confirmPassword: 'Password@123'
        });
      },
      (err) => {
        assert.strictEqual(err.status, 400);
        assert.strictEqual(err.message, 'The selected facility does not belong to the selected state.');
        return true;
      }
    );
  });

  it('Rejects duplicate phone number registrations', async () => {
    const anambraStateId = '22222222-2222-4222-8222-222222222222';
    const anambraFacilityId = '2a111111-1111-4111-8111-111111111111';

    // Register user first
    const uniquePhone = '08098765432';
    await authService.register({
      firstName: 'First',
      lastName: 'User',
      phoneNumber: uniquePhone,
      stateId: anambraStateId,
      facilityId: anambraFacilityId,
      password: 'Password@123',
      confirmPassword: 'Password@123'
    });

    // Attempt second registration with same normalized phone number in different format (+2348098765432)
    await assert.rejects(
      async () => {
        await authService.register({
          firstName: 'Second',
          lastName: 'User',
          phoneNumber: '+2348098765432',
          stateId: anambraStateId,
          facilityId: anambraFacilityId,
          password: 'Password@123',
          confirmPassword: 'Password@123'
        });
      },
      (err) => {
        assert.strictEqual(err.status, 400);
        assert.ok(err.message.includes('already registered'));
        return true;
      }
    );
  });

  it('Enforces IDOR Protection: User cannot access or submit feedback for another user expectation', async () => {
    const userA = 'user-a-id-1111';
    const userB = 'user-b-id-2222';

    db.users.push(
      { id: userA, first_name: 'UserA', last_name: 'Test', phone_number: '+2348111111111', status: 'ACTIVE' },
      { id: userB, first_name: 'UserB', last_name: 'Test', phone_number: '+2348222222222', status: 'ACTIVE' }
    );

    // User A submits expectation
    await expectationsService.createExpectation(userA, {
      expectationText: 'User A personal expectation'
    });

    // User B checks eligibility before submitting any expectation
    const eligibilityB = await feedbackService.getEligibility(userB);
    assert.strictEqual(eligibilityB.isEligible, false);

    // User B attempts to submit feedback without having an expectation
    await assert.rejects(
      async () => {
        await feedbackService.submitFeedback(userB, {
          expectationMet: true,
          feedbackText: 'Trying to forge feedback'
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
