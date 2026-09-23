import crypto from 'crypto';
import { db } from '../database/db.js';
import { NotFoundException, BadRequestException } from '../common/exceptions/HttpException.js';

export class StatesService {
  async getActiveStates() {
    return db.states.filter(s => s.status === 'ACTIVE');
  }

  async getAllStates() {
    return db.states;
  }

  async getStateById(id) {
    const state = db.states.find(s => s.id === id);
    if (!state) {
      throw new NotFoundException(`State with ID ${id} not found`);
    }
    return state;
  }

  async createState(data) {
    if (!data.name || typeof data.name !== 'string' || data.name.trim().length < 2) {
      throw new BadRequestException('State name is required (min 2 chars)');
    }

    const trimmedName = data.name.trim();
    const existing = db.states.find(s => s.name.toLowerCase() === trimmedName.toLowerCase());
    if (existing) {
      throw new BadRequestException(`A state with the name "${trimmedName}" already exists`);
    }

    const newState = {
      id: crypto.randomUUID(),
      name: trimmedName,
      code: data.code ? data.code.trim().toUpperCase() : trimmedName.substring(0, 3).toUpperCase(),
      status: data.status === 'INACTIVE' ? 'INACTIVE' : 'ACTIVE',
      created_at: new Date(),
      updated_at: new Date()
    };

    db.states.push(newState);
    return newState;
  }

  async updateState(id, data) {
    const state = await this.getStateById(id);

    if (data.name) {
      const trimmedName = data.name.trim();
      const existing = db.states.find(s => s.id !== id && s.name.toLowerCase() === trimmedName.toLowerCase());
      if (existing) {
        throw new BadRequestException(`A state with the name "${trimmedName}" already exists`);
      }
      state.name = trimmedName;
    }

    if (data.code) {
      state.code = data.code.trim().toUpperCase();
    }

    if (data.status) {
      state.status = data.status === 'INACTIVE' ? 'INACTIVE' : 'ACTIVE';
    }

    state.updated_at = new Date();
    return state;
  }

  async toggleStateStatus(id) {
    const state = await this.getStateById(id);
    state.status = state.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    state.updated_at = new Date();
    return state;
  }
}

export const statesService = new StatesService();
