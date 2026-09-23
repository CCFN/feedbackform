import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../database/db.js';
import { BadRequestException, UnauthorizedException } from '../common/exceptions/HttpException.js';
import { validateRegistration, normalizePhoneNumber } from '../common/validators/validate.js';
import { facilitiesService } from '../facilities/facilities.service.js';
import { JWT_SECRET, REFRESH_SECRET } from '../common/guards/authGuard.js';

export class AuthService {
  async register(rawData) {
    // 1. Validate fields (first name, last name, phone, state, facility, password, confirmPassword)
    const validData = validateRegistration(rawData);

    // 2. Check phone uniqueness
    const existingUser = db.users.find(u => u.phone_number === validData.phoneNumber);
    if (existingUser) {
      throw new BadRequestException('This phone number is already registered.', {
        phoneNumber: 'This phone number is already registered.'
      });
    }

    // 3. Strict backend validation: facility MUST belong to the selected state!
    await facilitiesService.validateFacilityBelongsToState(validData.facilityId, validData.stateId);

    // 4. Hash password securely
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(validData.password, saltRounds);

    // 5. Create user record
    const newUser = {
      id: crypto.randomUUID(),
      first_name: validData.firstName,
      last_name: validData.lastName,
      phone_number: validData.phoneNumber,
      password_hash: passwordHash,
      state_id: validData.stateId,
      facility_id: validData.facilityId,
      role: 'USER',
      status: 'ACTIVE',
      avatar: rawData.avatar || 'avatar_1',
      created_at: new Date(),
      updated_at: new Date()
    };

    db.users.push(newUser);

    const state = db.states.find(s => s.id === newUser.state_id);
    const facility = db.facilities.find(f => f.id === newUser.facility_id);

    return {
      id: newUser.id,
      firstName: newUser.first_name,
      lastName: newUser.last_name,
      phoneNumber: newUser.phone_number,
      role: newUser.role,
      stateName: state ? state.name : 'N/A',
      facilityName: facility ? facility.name : 'N/A'
    };
  }

  async login(phone, password) {
    if (!phone || typeof phone !== 'string' || !password || typeof password !== 'string') {
      throw new BadRequestException('Phone number and password are required');
    }

    const normalizedPhone = normalizePhoneNumber(phone);
    const user = db.users.find(u => u.phone_number === normalizedPhone);

    if (!user) {
      throw new UnauthorizedException('Invalid phone number or password.');
    }

    if (user.status !== 'ACTIVE') {
      throw new UnauthorizedException('Account is suspended or inactive. Please contact administration.');
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid phone number or password.');
    }

    // Generate JWT access token (1h expiry) and refresh token (7d expiry)
    const payload = {
      id: user.id,
      phoneNumber: user.phone_number,
      role: user.role
    };

    const accessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: '8h' });
    const refreshToken = jwt.sign(payload, REFRESH_SECRET, { expiresIn: '7d' });

    const state = db.states.find(s => s.id === user.state_id);
    const facility = db.facilities.find(f => f.id === user.facility_id);

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        firstName: user.first_name,
        lastName: user.last_name,
        phoneNumber: user.phone_number,
        role: user.role,
        avatar: user.avatar,
        stateId: user.state_id,
        stateName: state ? state.name : 'N/A',
        facilityId: user.facility_id,
        facilityName: facility ? facility.name : 'N/A',
        facilityWard: facility ? facility.ward : 'General Ward'
      }
    };
  }

  async refreshToken(refreshToken) {
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token is required');
    }

    try {
      const decoded = jwt.verify(refreshToken, REFRESH_SECRET);
      const user = db.users.find(u => u.id === decoded.id);
      if (!user || user.status !== 'ACTIVE') {
        throw new UnauthorizedException('Invalid refresh session');
      }

      const payload = {
        id: user.id,
        phoneNumber: user.phone_number,
        role: user.role
      };

      const newAccessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: '8h' });
      return { accessToken: newAccessToken };
    } catch (err) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }
}

export const authService = new AuthService();
