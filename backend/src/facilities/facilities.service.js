import crypto from 'crypto';
import { db } from '../database/db.js';
import { NotFoundException, BadRequestException } from '../common/exceptions/HttpException.js';
import { statesService } from '../states/states.service.js';

export class FacilitiesService {
  async getFacilitiesByState(stateId, onlyActive = true) {
    // Validate state exists
    await statesService.getStateById(stateId);

    return db.facilities.filter(f => {
      const matchesState = f.state_id === stateId;
      return onlyActive ? (matchesState && f.status === 'ACTIVE') : matchesState;
    });
  }

  async getAllFacilities() {
    return db.facilities.map(f => {
      const state = db.states.find(s => s.id === f.state_id);
      return {
        ...f,
        state_name: state ? state.name : 'Unknown State'
      };
    });
  }

  async getFacilityById(id) {
    const facility = db.facilities.find(f => f.id === id);
    if (!facility) {
      throw new NotFoundException(`Healthcare facility with ID ${id} not found`);
    }
    const state = db.states.find(s => s.id === facility.state_id);
    return {
      ...facility,
      state_name: state ? state.name : 'Unknown State'
    };
  }

  /**
   * Critical backend verification: validates that a facility exists, is active, AND strictly belongs to the specified state!
   */
  async validateFacilityBelongsToState(facilityId, stateId) {
    const facility = db.facilities.find(f => f.id === facilityId);
    if (!facility) {
      throw new BadRequestException('The selected primary healthcare facility does not exist');
    }
    if (facility.status !== 'ACTIVE') {
      throw new BadRequestException('The selected healthcare facility is currently inactive');
    }
    if (facility.state_id !== stateId) {
      throw new BadRequestException('The selected facility does not belong to the selected state.');
    }
    return facility;
  }

  async createFacility(data) {
    if (!data.name || typeof data.name !== 'string' || data.name.trim().length < 2) {
      throw new BadRequestException('Facility name is required (min 2 chars)');
    }
    if (!data.stateId) {
      throw new BadRequestException('State ID is required to assign facility');
    }

    // Verify state exists
    const state = await statesService.getStateById(data.stateId);

    const trimmedName = data.name.trim();
    const newFacility = {
      id: crypto.randomUUID(),
      state_id: state.id,
      name: trimmedName,
      code: data.code ? data.code.trim().toUpperCase() : `FAC-${Date.now().toString().slice(-4)}`,
      ward: data.ward ? data.ward.trim() : 'General Ward / OPD',
      status: data.status === 'INACTIVE' ? 'INACTIVE' : 'ACTIVE',
      created_at: new Date(),
      updated_at: new Date()
    };

    db.facilities.push(newFacility);
    return {
      ...newFacility,
      state_name: state.name
    };
  }

  async updateFacility(id, data) {
    const facility = db.facilities.find(f => f.id === id);
    if (!facility) {
      throw new NotFoundException(`Facility with ID ${id} not found`);
    }

    if (data.stateId) {
      const state = await statesService.getStateById(data.stateId);
      facility.state_id = state.id;
    }

    if (data.name) {
      facility.name = data.name.trim();
    }
    if (data.code) {
      facility.code = data.code.trim().toUpperCase();
    }
    if (data.ward) {
      facility.ward = data.ward.trim();
    }
    if (data.status) {
      facility.status = data.status === 'INACTIVE' ? 'INACTIVE' : 'ACTIVE';
    }

    facility.updated_at = new Date();
    const state = db.states.find(s => s.id === facility.state_id);
    return {
      ...facility,
      state_name: state ? state.name : 'Unknown State'
    };
  }

  async toggleFacilityStatus(id) {
    const facility = db.facilities.find(f => f.id === id);
    if (!facility) {
      throw new NotFoundException(`Facility with ID ${id} not found`);
    }
    facility.status = facility.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    facility.updated_at = new Date();
    return facility;
  }
}

export const facilitiesService = new FacilitiesService();
