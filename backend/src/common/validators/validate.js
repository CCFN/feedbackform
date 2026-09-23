import { BadRequestException } from '../exceptions/HttpException.js';

/**
 * Normalizes phone numbers to standard format (e.g. +234XXXXXXXXXX for Nigerian numbers or standard international format)
 * Prevents multiple registrations of the same number in different formats (08012345678, 2348012345678, +2348012345678)
 */
export function normalizePhoneNumber(phone) {
  if (!phone || typeof phone !== 'string') {
    return '';
  }

  // Remove spaces, hyphens, parentheses, and dots
  let cleaned = phone.trim().replace(/[\s\-\(\)\.]/g, '');

  // Nigerian phone number patterns:
  // Starts with '0' followed by 10 digits (e.g. 08012345678 or 070..., 090..., 081...)
  if (/^0[789][01]\d{8}$/.test(cleaned)) {
    return '+234' + cleaned.substring(1);
  }

  // Starts with '234' followed by 10 digits without '+' (e.g. 2348012345678)
  if (/^234[789][01]\d{8}$/.test(cleaned)) {
    return '+' + cleaned;
  }

  // Starts with '+234' followed by 10 digits
  if (/^\+234[789][01]\d{8}$/.test(cleaned)) {
    return cleaned;
  }

  // General 10-11 digit local numbers starting with 0
  if (/^0\d{10}$/.test(cleaned)) {
    return '+234' + cleaned.substring(1);
  }

  // If already starts with '+', keep format after cleaning
  if (cleaned.startsWith('+') && cleaned.length >= 8 && cleaned.length <= 16) {
    return cleaned;
  }

  // Fallback for standard 10 digit number
  if (/^\d{10}$/.test(cleaned)) {
    return '+234' + cleaned;
  }

  // Fallback for international without leading plus
  if (/^\d{11,15}$/.test(cleaned)) {
    return '+' + cleaned;
  }

  return cleaned;
}

/**
 * Validates phone number format
 */
export function isValidPhoneNumber(phone) {
  const normalized = normalizePhoneNumber(phone);
  // Valid international E.164-like phone number (+ followed by 7 to 15 digits)
  return /^\+[1-9]\d{6,14}$/.test(normalized);
}

/**
 * Validates password strength:
 * - Minimum 8 characters
 * - At least one uppercase letter
 * - At least one lowercase letter
 * - At least one number
 * - At least one special character
 */
export function validatePasswordStrength(password) {
  if (!password || typeof password !== 'string') {
    return {
      isValid: false,
      message: 'Password is required'
    };
  }

  if (password.length < 8) {
    return {
      isValid: false,
      message: 'Password must be at least 8 characters long'
    };
  }

  if (!/[A-Z]/.test(password)) {
    return {
      isValid: false,
      message: 'Password must contain at least one uppercase letter'
    };
  }

  if (!/[a-z]/.test(password)) {
    return {
      isValid: false,
      message: 'Password must contain at least one lowercase letter'
    };
  }

  if (!/[0-9]/.test(password)) {
    return {
      isValid: false,
      message: 'Password must contain at least one number'
    };
  }

  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    return {
      isValid: false,
      message: 'Password must contain at least one special character'
    };
  }

  return { isValid: true, message: '' };
}

/**
 * Validates Registration payload
 */
export function validateRegistration(data) {
  const errors = {};

  // First Name: required, 2-100 chars, trimmed
  if (!data.firstName || typeof data.firstName !== 'string' || data.firstName.trim().length < 2) {
    errors.firstName = 'First Name is required and must be at least 2 characters';
  } else if (data.firstName.trim().length > 100) {
    errors.firstName = 'First Name cannot exceed 100 characters';
  }

  // Last Name: required, 2-100 chars, trimmed
  if (!data.lastName || typeof data.lastName !== 'string' || data.lastName.trim().length < 2) {
    errors.lastName = 'Last Name is required and must be at least 2 characters';
  } else if (data.lastName.trim().length > 100) {
    errors.lastName = 'Last Name cannot exceed 100 characters';
  }

  // Phone Number: required, valid format
  if (!data.phoneNumber) {
    errors.phoneNumber = 'Phone number is required';
  } else if (!isValidPhoneNumber(data.phoneNumber)) {
    errors.phoneNumber = 'Please provide a valid phone number (e.g. 08012345678 or +2348012345678)';
  }

  // State: required
  if (!data.stateId) {
    errors.stateId = 'State of residence is required';
  }

  // Facility: required
  if (!data.facilityId) {
    errors.facilityId = 'Primary healthcare facility is required';
  }

  // Password: required, strength check
  const passwordCheck = validatePasswordStrength(data.password);
  if (!passwordCheck.isValid) {
    errors.password = passwordCheck.message;
  }

  // Confirm Password: required, must match
  if (!data.confirmPassword) {
    errors.confirmPassword = 'Password confirmation is required';
  } else if (data.password !== data.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match';
  }

  if (Object.keys(errors).length > 0) {
    throw new BadRequestException('Validation failed', errors);
  }

  return {
    firstName: data.firstName.trim(),
    lastName: data.lastName.trim(),
    phoneNumber: normalizePhoneNumber(data.phoneNumber),
    stateId: data.stateId,
    facilityId: data.facilityId,
    password: data.password
  };
}

/**
 * Validates Expectation payload
 */
export function validateExpectation(data) {
  const errors = {};

  if (!data.expectationText || typeof data.expectationText !== 'string' || data.expectationText.trim().length === 0) {
    errors.expectationText = 'Please enter your expectation before submitting.';
  } else if (data.expectationText.trim().length < 5) {
    errors.expectationText = 'Expectation must be at least 5 characters long';
  } else if (data.expectationText.trim().length > 2000) {
    errors.expectationText = 'Expectation cannot exceed 2,000 characters';
  }

  if (Object.keys(errors).length > 0) {
    throw new BadRequestException('Validation failed', errors);
  }

  return {
    expectationText: data.expectationText.trim()
  };
}

/**
 * Validates Feedback payload based on the mandatory conditional business rule:
 * - expectationMet is REQUIRED (must be boolean true or false)
 * - If expectationMet === TRUE: feedbackText is OPTIONAL (can be null or empty)
 * - If expectationMet === FALSE: feedbackText is REQUIRED (must not be empty or only whitespace)
 */
export function validateFeedback(data) {
  const errors = {};

  if (data.expectationMet === undefined || data.expectationMet === null || typeof data.expectationMet !== 'boolean') {
    errors.expectationMet = 'Please indicate whether your expectation was met (Yes or No).';
  }

  // Conditional feedback validation rule
  if (data.expectationMet === false) {
    if (!data.feedbackText || typeof data.feedbackText !== 'string' || data.feedbackText.trim().length === 0) {
      errors.feedbackText = 'Please provide feedback explaining why your expectation was not met.';
    } else if (data.feedbackText.trim().length > 2000) {
      errors.feedbackText = 'Feedback cannot exceed 2,000 characters';
    }
  } else if (data.expectationMet === true && data.feedbackText && typeof data.feedbackText === 'string') {
    if (data.feedbackText.trim().length > 2000) {
      errors.feedbackText = 'Feedback cannot exceed 2,000 characters';
    }
  }

  if (Object.keys(errors).length > 0) {
    throw new BadRequestException('Validation failed', errors);
  }

  return {
    expectationMet: data.expectationMet,
    feedbackText: (data.feedbackText && data.feedbackText.trim().length > 0) ? data.feedbackText.trim() : null
  };
}
