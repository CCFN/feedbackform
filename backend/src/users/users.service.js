import { db } from '../database/db.js';
import { NotFoundException } from '../common/exceptions/HttpException.js';

export class UsersService {
  async getUserById(id) {
    const user = db.users.find(u => u.id === id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    const state = db.states.find(s => s.id === user.state_id);
    const facility = db.facilities.find(f => f.id === user.facility_id);

    return {
      id: user.id,
      firstName: user.first_name,
      lastName: user.last_name,
      phoneNumber: user.phone_number,
      role: user.role,
      status: user.status,
      avatar: user.avatar,
      stateId: user.state_id,
      stateName: state ? state.name : 'Unknown State',
      facilityId: user.facility_id,
      facilityName: facility ? facility.name : 'Unknown Facility',
      facilityWard: facility ? facility.ward : 'General Ward',
      createdAt: user.created_at
    };
  }

  async getAllUsers(filters = {}) {
    let results = [...db.users];

    if (filters.stateId) {
      results = results.filter(u => u.state_id === filters.stateId);
    }
    if (filters.facilityId) {
      results = results.filter(u => u.facility_id === filters.facilityId);
    }
    if (filters.role) {
      results = results.filter(u => u.role === filters.role);
    }
    if (filters.search) {
      const q = filters.search.toLowerCase();
      results = results.filter(u => 
        u.first_name.toLowerCase().includes(q) ||
        u.last_name.toLowerCase().includes(q) ||
        u.phone_number.includes(q)
      );
    }

    return results.map(user => {
      const state = db.states.find(s => s.id === user.state_id);
      const facility = db.facilities.find(f => f.id === user.facility_id);
      return {
        id: user.id,
        firstName: user.first_name,
        lastName: user.last_name,
        phoneNumber: user.phone_number,
        role: user.role,
        status: user.status,
        stateName: state ? state.name : 'N/A',
        facilityName: facility ? facility.name : 'N/A',
        createdAt: user.created_at
      };
    });
  }

  async toggleUserStatus(id) {
    const user = db.users.find(u => u.id === id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    user.status = user.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
    user.updated_at = new Date();
    return {
      id: user.id,
      status: user.status
    };
  }
}

export const usersService = new UsersService();
