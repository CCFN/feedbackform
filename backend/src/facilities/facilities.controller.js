import { facilitiesService } from './facilities.service.js';
import { logAuditEvent } from '../common/middleware/auditLogger.js';

export class FacilitiesController {
  async getFacilitiesByState(req, res, next) {
    try {
      const facilities = await facilitiesService.getFacilitiesByState(req.params.stateId);
      res.json({
        success: true,
        message: 'Facilities retrieved for state',
        data: facilities
      });
    } catch (err) {
      next(err);
    }
  }

  async getAllFacilities(req, res, next) {
    try {
      const facilities = await facilitiesService.getAllFacilities();
      res.json({
        success: true,
        message: 'All healthcare facilities retrieved',
        data: facilities
      });
    } catch (err) {
      next(err);
    }
  }

  async getFacilityById(req, res, next) {
    try {
      const facility = await facilitiesService.getFacilityById(req.params.id);
      res.json({
        success: true,
        data: facility
      });
    } catch (err) {
      next(err);
    }
  }

  async createFacility(req, res, next) {
    try {
      const newFacility = await facilitiesService.createFacility(req.body);
      logAuditEvent('FACILITY_CREATED', 'Facility', newFacility.id, req, { name: newFacility.name });
      res.status(201).json({
        success: true,
        message: 'Healthcare facility created successfully',
        data: newFacility
      });
    } catch (err) {
      next(err);
    }
  }

  async updateFacility(req, res, next) {
    try {
      const updated = await facilitiesService.updateFacility(req.params.id, req.body);
      logAuditEvent('FACILITY_UPDATED', 'Facility', updated.id, req, { name: updated.name });
      res.json({
        success: true,
        message: 'Facility updated successfully',
        data: updated
      });
    } catch (err) {
      next(err);
    }
  }

  async toggleFacilityStatus(req, res, next) {
    try {
      const updated = await facilitiesService.toggleFacilityStatus(req.params.id);
      logAuditEvent('FACILITY_STATUS_TOGGLED', 'Facility', updated.id, req, { status: updated.status });
      res.json({
        success: true,
        message: `Facility status changed to ${updated.status}`,
        data: updated
      });
    } catch (err) {
      next(err);
    }
  }
}

export const facilitiesController = new FacilitiesController();
