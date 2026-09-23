import { statesService } from './states.service.js';
import { logAuditEvent } from '../common/middleware/auditLogger.js';

export class StatesController {
  async getPublicStates(req, res, next) {
    try {
      const states = await statesService.getActiveStates();
      res.json({
        success: true,
        message: 'States retrieved successfully',
        data: states
      });
    } catch (err) {
      next(err);
    }
  }

  async getAllStates(req, res, next) {
    try {
      const states = await statesService.getAllStates();
      res.json({
        success: true,
        message: 'All administrative states retrieved',
        data: states
      });
    } catch (err) {
      next(err);
    }
  }

  async getStateById(req, res, next) {
    try {
      const state = await statesService.getStateById(req.params.id);
      res.json({
        success: true,
        data: state
      });
    } catch (err) {
      next(err);
    }
  }

  async createState(req, res, next) {
    try {
      const newState = await statesService.createState(req.body);
      logAuditEvent('STATE_CREATED', 'State', newState.id, req, { name: newState.name });
      res.status(201).json({
        success: true,
        message: 'State created successfully',
        data: newState
      });
    } catch (err) {
      next(err);
    }
  }

  async updateState(req, res, next) {
    try {
      const updated = await statesService.updateState(req.params.id, req.body);
      logAuditEvent('STATE_UPDATED', 'State', updated.id, req, { name: updated.name });
      res.json({
        success: true,
        message: 'State updated successfully',
        data: updated
      });
    } catch (err) {
      next(err);
    }
  }

  async toggleStateStatus(req, res, next) {
    try {
      const updated = await statesService.toggleStateStatus(req.params.id);
      logAuditEvent('STATE_STATUS_TOGGLED', 'State', updated.id, req, { status: updated.status });
      res.json({
        success: true,
        message: `State status changed to ${updated.status}`,
        data: updated
      });
    } catch (err) {
      next(err);
    }
  }
}

export const statesController = new StatesController();
