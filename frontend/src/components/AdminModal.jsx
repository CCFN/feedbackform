import React, { useState, useEffect } from 'react';
import { 
  X, 
  BarChart3, 
  Building2, 
  MapPin, 
  Users, 
  CheckSquare, 
  MessageSquare, 
  Shield, 
  Plus, 
  Check, 
  RotateCcw,
  Search,
  Filter,
  TrendingUp,
  Percent
} from 'lucide-react';
import { api } from '../api.js';

export default function AdminModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState('reports');
  const [reports, setReports] = useState(null);
  const [states, setStates] = useState([]);
  const [facilities, setFacilities] = useState([]);
  const [users, setUsers] = useState([]);
  const [expectations, setExpectations] = useState([]);
  const [feedbackList, setFeedbackList] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(false);

  // New State form
  const [newStateName, setNewStateName] = useState('');
  const [newStateCode, setNewStateCode] = useState('');

  // New Facility form
  const [newFacName, setNewFacName] = useState('');
  const [newFacCode, setNewFacCode] = useState('');
  const [newFacWard, setNewFacWard] = useState('');
  const [newFacStateId, setNewFacStateId] = useState('');

  // Search
  const [searchQuery, setSearchQuery] = useState('');
  const [statusMessage, setStatusMessage] = useState('');

  useEffect(() => {
    loadAllData();
  }, []);

  async function loadAllData() {
    setLoading(true);
    try {
      const [repRes, stRes, facRes, uRes, expRes, fbRes, audRes] = await Promise.all([
        api.getAdminReports().catch(() => null),
        api.getAdminStates().catch(() => null),
        api.getAdminFacilities().catch(() => null),
        api.getAdminUsers().catch(() => null),
        api.getAdminExpectations().catch(() => null),
        api.getAdminFeedback().catch(() => null),
        api.getAdminAuditLogs().catch(() => null),
      ]);

      if (repRes?.data) setReports(repRes.data);
      if (stRes?.data) setStates(stRes.data);
      if (facRes?.data) setFacilities(facRes.data);
      if (uRes?.data) setUsers(uRes.data);
      if (expRes?.data) setExpectations(expRes.data);
      if (fbRes?.data) setFeedbackList(fbRes.data);
      if (audRes?.data) setAuditLogs(audRes.data);
    } catch (err) {
      console.error('Error loading admin data:', err);
    } finally {
      setLoading(false);
    }
  }

  const handleCreateState = async (e) => {
    e.preventDefault();
    if (!newStateName.trim()) return;
    try {
      await api.createAdminState({ name: newStateName.trim(), code: newStateCode.trim() });
      setNewStateName('');
      setNewStateCode('');
      setStatusMessage('State jurisdiction added successfully');
      loadAllData();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleCreateFacility = async (e) => {
    e.preventDefault();
    if (!newFacName.trim() || !newFacStateId) return;
    try {
      await api.createAdminFacility({
        name: newFacName.trim(),
        code: newFacCode.trim(),
        ward: newFacWard.trim(),
        stateId: newFacStateId
      });
      setNewFacName('');
      setNewFacCode('');
      setNewFacWard('');
      setStatusMessage('Healthcare center created and mapped to state');
      loadAllData();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleToggleState = async (id) => {
    try {
      await api.toggleAdminState(id);
      loadAllData();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleToggleFacility = async (id) => {
    try {
      await api.toggleAdminFacility(id);
      loadAllData();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.65)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 250,
      padding: '24px'
    }}>
      <div 
        className="animate-fade-in"
        style={{
          width: '100%',
          maxWidth: '1100px',
          maxHeight: '90vh',
          backgroundColor: '#FFFFFF',
          borderRadius: '24px',
          boxShadow: '0 25px 50px -12px rgba(15, 23, 42, 0.3)',
          border: '1px solid #E2E8F0',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}
      >
        {/* Modal Header */}
        <div style={{
          padding: '20px 28px',
          borderBottom: '1px solid #E2E8F0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: '#F8FAFC'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              backgroundColor: '#1E3A8A',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Shield size={20} />
            </div>
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A' }}>
                CareEcho Institutional Administration Console
              </h2>
              <p style={{ fontSize: '12.5px', color: '#64748B' }}>
                Civic Quality Metrics, State Jurisdictions, Facilities & Audit Registry
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              onClick={loadAllData}
              style={{
                padding: '6px 12px',
                borderRadius: '8px',
                border: '1px solid #E2E8F0',
                backgroundColor: '#FFFFFF',
                color: '#475569',
                fontSize: '12.5px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <RotateCcw size={13} />
              Refresh
            </button>
            <button
              onClick={onClose}
              style={{
                background: 'none',
                border: 'none',
                color: '#64748B',
                cursor: 'pointer',
                padding: '6px'
              }}
            >
              <X size={22} />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div style={{
          display: 'flex',
          borderBottom: '1px solid #E2E8F0',
          padding: '0 28px',
          gap: '8px',
          backgroundColor: '#FFFFFF'
        }}>
          {[
            { id: 'reports', label: 'Quality Analytics & Reports', icon: BarChart3 },
            { id: 'states', label: 'State Jurisdictions', icon: MapPin },
            { id: 'facilities', label: 'Healthcare Facilities', icon: Building2 },
            { id: 'users', label: 'Registered Patients/Citizens', icon: Users },
            { id: 'expectations', label: 'Expectations Log', icon: CheckSquare },
            { id: 'feedback', label: 'Feedback Reviews', icon: MessageSquare },
            { id: 'audit', label: 'Audit Trail', icon: Shield },
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  padding: '14px 16px',
                  background: 'none',
                  border: 'none',
                  borderBottom: `2.5px solid ${isActive ? '#1E3A8A' : 'transparent'}`,
                  color: isActive ? '#1E3A8A' : '#64748B',
                  fontWeight: isActive ? 700 : 500,
                  fontSize: '13.5px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <Icon size={16} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Body */}
        <div style={{ padding: '28px', overflowY: 'auto', flex: 1, backgroundColor: '#F8FAFC' }}>
          {statusMessage && (
            <div style={{
              padding: '10px 16px',
              backgroundColor: '#DCFCE7',
              color: '#15803D',
              borderRadius: '8px',
              marginBottom: '20px',
              fontSize: '13px'
            }}>
              ✔ {statusMessage}
            </div>
          )}

          {/* TAB 1: REPORTS */}
          {activeTab === 'reports' && (
            <div>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '16px',
                marginBottom: '28px'
              }}>
                <div style={{ backgroundColor: '#FFFFFF', padding: '20px', borderRadius: '14px', border: '1px solid #E2E8F0' }}>
                  <div style={{ fontSize: '12px', color: '#64748B', textTransform: 'uppercase', fontWeight: 700 }}>Total Users</div>
                  <div style={{ fontSize: '28px', fontWeight: 800, color: '#0F172A', marginTop: '4px' }}>
                    {reports?.summary?.totalUsers || users.length}
                  </div>
                </div>

                <div style={{ backgroundColor: '#FFFFFF', padding: '20px', borderRadius: '14px', border: '1px solid #E2E8F0' }}>
                  <div style={{ fontSize: '12px', color: '#64748B', textTransform: 'uppercase', fontWeight: 700 }}>Total Expectations</div>
                  <div style={{ fontSize: '28px', fontWeight: 800, color: '#1E3A8A', marginTop: '4px' }}>
                    {reports?.summary?.totalExpectations || expectations.length}
                  </div>
                </div>

                <div style={{ backgroundColor: '#FFFFFF', padding: '20px', borderRadius: '14px', border: '1px solid #E2E8F0' }}>
                  <div style={{ fontSize: '12px', color: '#64748B', textTransform: 'uppercase', fontWeight: 700 }}>Expectations Met</div>
                  <div style={{ fontSize: '28px', fontWeight: 800, color: '#059669', marginTop: '4px' }}>
                    {reports?.summary?.expectationsMet ?? feedbackList.filter(f => f.expectationMet).length}
                  </div>
                  <div style={{ fontSize: '12px', color: '#059669', fontWeight: 600 }}>
                    {reports?.summary?.percentageMet ?? 0}% satisfaction rate
                  </div>
                </div>

                <div style={{ backgroundColor: '#FFFFFF', padding: '20px', borderRadius: '14px', border: '1px solid #E2E8F0' }}>
                  <div style={{ fontSize: '12px', color: '#64748B', textTransform: 'uppercase', fontWeight: 700 }}>Expectations Not Met</div>
                  <div style={{ fontSize: '28px', fontWeight: 800, color: '#DC2626', marginTop: '4px' }}>
                    {reports?.summary?.expectationsNotMet ?? feedbackList.filter(f => !f.expectationMet).length}
                  </div>
                  <div style={{ fontSize: '12px', color: '#DC2626', fontWeight: 600 }}>
                    {reports?.summary?.percentageNotMet ?? 0}% deficiency rate
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: STATES */}
          {activeTab === 'states' && (
            <div>
              {/* Add State Form */}
              <form onSubmit={handleCreateState} style={{
                backgroundColor: '#FFFFFF',
                padding: '20px',
                borderRadius: '14px',
                border: '1px solid #E2E8F0',
                display: 'flex',
                gap: '12px',
                marginBottom: '24px',
                alignItems: 'flex-end'
              }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                    State Name *
                  </label>
                  <input
                    type="text"
                    value={newStateName}
                    onChange={(e) => setNewStateName(e.target.value)}
                    placeholder="e.g. Kaduna"
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1.5px solid #E2E8F0', fontSize: '13.5px' }}
                  />
                </div>
                <div style={{ width: '140px' }}>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                    Code
                  </label>
                  <input
                    type="text"
                    value={newStateCode}
                    onChange={(e) => setNewStateCode(e.target.value)}
                    placeholder="e.g. KD"
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1.5px solid #E2E8F0', fontSize: '13.5px' }}
                  />
                </div>
                <button type="submit" className="btn-primary" style={{ padding: '10px 18px', fontSize: '13.5px' }}>
                  <Plus size={16} /> Add State
                </button>
              </form>

              {/* States Table */}
              <div style={{ backgroundColor: '#FFFFFF', borderRadius: '14px', border: '1px solid #E2E8F0', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13.5px' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#F1F5F9', textAlign: 'left', color: '#475569' }}>
                      <th style={{ padding: '12px 16px' }}>State Name</th>
                      <th style={{ padding: '12px 16px' }}>Code</th>
                      <th style={{ padding: '12px 16px' }}>Status</th>
                      <th style={{ padding: '12px 16px' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {states.map(st => (
                      <tr key={st.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                        <td style={{ padding: '12px 16px', fontWeight: 700, color: '#0F172A' }}>{st.name}</td>
                        <td style={{ padding: '12px 16px', color: '#64748B' }}>{st.code}</td>
                        <td style={{ padding: '12px 16px' }}>
                          <span style={{
                            padding: '3px 8px',
                            borderRadius: '6px',
                            fontSize: '11px',
                            fontWeight: 700,
                            backgroundColor: st.status === 'ACTIVE' ? '#DCFCE7' : '#FEE2E2',
                            color: st.status === 'ACTIVE' ? '#15803D' : '#B91C1C'
                          }}>
                            {st.status}
                          </span>
                        </td>
                        <td style={{ padding: '12px 16px' }}>
                          <button
                            onClick={() => handleToggleState(st.id)}
                            style={{
                              padding: '4px 10px',
                              borderRadius: '6px',
                              border: '1px solid #E2E8F0',
                              backgroundColor: '#FFFFFF',
                              cursor: 'pointer',
                              fontSize: '12px'
                            }}
                          >
                            Toggle Status
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: FACILITIES */}
          {activeTab === 'facilities' && (
            <div>
              {/* Add Facility Form */}
              <form onSubmit={handleCreateFacility} style={{
                backgroundColor: '#FFFFFF',
                padding: '20px',
                borderRadius: '14px',
                border: '1px solid #E2E8F0',
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr 1fr auto',
                gap: '12px',
                marginBottom: '24px',
                alignItems: 'flex-end'
              }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '4px' }}>State *</label>
                  <select
                    value={newFacStateId}
                    onChange={(e) => setNewFacStateId(e.target.value)}
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1.5px solid #E2E8F0', fontSize: '13px' }}
                  >
                    <option value="">Select State...</option>
                    {states.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '4px' }}>Facility Name *</label>
                  <input
                    type="text"
                    value={newFacName}
                    onChange={(e) => setNewFacName(e.target.value)}
                    placeholder="e.g. General Hospital"
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1.5px solid #E2E8F0', fontSize: '13px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '4px' }}>Ward / Wing</label>
                  <input
                    type="text"
                    value={newFacWard}
                    onChange={(e) => setNewFacWard(e.target.value)}
                    placeholder="e.g. Ward 4B"
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1.5px solid #E2E8F0', fontSize: '13px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '4px' }}>Code</label>
                  <input
                    type="text"
                    value={newFacCode}
                    onChange={(e) => setNewFacCode(e.target.value)}
                    placeholder="e.g. GH-01"
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1.5px solid #E2E8F0', fontSize: '13px' }}
                  />
                </div>
                <button type="submit" className="btn-primary" style={{ padding: '10px 16px', fontSize: '13px' }}>
                  <Plus size={15} /> Add Center
                </button>
              </form>

              {/* Facilities Table */}
              <div style={{ backgroundColor: '#FFFFFF', borderRadius: '14px', border: '1px solid #E2E8F0', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#F1F5F9', textAlign: 'left', color: '#475569' }}>
                      <th style={{ padding: '12px 16px' }}>Center Name</th>
                      <th style={{ padding: '12px 16px' }}>State</th>
                      <th style={{ padding: '12px 16px' }}>Ward / Branch</th>
                      <th style={{ padding: '12px 16px' }}>Status</th>
                      <th style={{ padding: '12px 16px' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {facilities.map(f => (
                      <tr key={f.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                        <td style={{ padding: '12px 16px', fontWeight: 700, color: '#0F172A' }}>{f.name}</td>
                        <td style={{ padding: '12px 16px', color: '#0284C7', fontWeight: 600 }}>{f.state_name}</td>
                        <td style={{ padding: '12px 16px', color: '#64748B' }}>{f.ward || 'General'}</td>
                        <td style={{ padding: '12px 16px' }}>
                          <span style={{
                            padding: '2px 8px',
                            borderRadius: '6px',
                            fontSize: '11px',
                            fontWeight: 700,
                            backgroundColor: f.status === 'ACTIVE' ? '#DCFCE7' : '#FEE2E2',
                            color: f.status === 'ACTIVE' ? '#15803D' : '#B91C1C'
                          }}>
                            {f.status}
                          </span>
                        </td>
                        <td style={{ padding: '12px 16px' }}>
                          <button
                            onClick={() => handleToggleFacility(f.id)}
                            style={{
                              padding: '4px 10px',
                              borderRadius: '6px',
                              border: '1px solid #E2E8F0',
                              backgroundColor: '#FFFFFF',
                              cursor: 'pointer',
                              fontSize: '12px'
                            }}
                          >
                            Toggle Status
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: USERS */}
          {activeTab === 'users' && (
            <div style={{ backgroundColor: '#FFFFFF', borderRadius: '14px', border: '1px solid #E2E8F0', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                <thead>
                  <tr style={{ backgroundColor: '#F1F5F9', textAlign: 'left', color: '#475569' }}>
                    <th style={{ padding: '12px 16px' }}>Citizen / Patient Name</th>
                    <th style={{ padding: '12px 16px' }}>Phone (Intake Key)</th>
                    <th style={{ padding: '12px 16px' }}>State</th>
                    <th style={{ padding: '12px 16px' }}>Facility</th>
                    <th style={{ padding: '12px 16px' }}>Role</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                      <td style={{ padding: '12px 16px', fontWeight: 700 }}>{u.firstName} {u.lastName}</td>
                      <td style={{ padding: '12px 16px', color: '#1E40AF', fontWeight: 600 }}>{u.phoneNumber}</td>
                      <td style={{ padding: '12px 16px' }}>{u.stateName}</td>
                      <td style={{ padding: '12px 16px' }}>{u.facilityName}</td>
                      <td style={{ padding: '12px 16px' }}>
                        <span style={{
                          padding: '2px 8px',
                          borderRadius: '6px',
                          fontSize: '11px',
                          fontWeight: 700,
                          backgroundColor: u.role === 'ADMIN' ? '#FEF3C7' : '#EFF6FF',
                          color: u.role === 'ADMIN' ? '#B45309' : '#1E3A8A'
                        }}>
                          {u.role}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* TAB 5: EXPECTATIONS */}
          {activeTab === 'expectations' && (
            <div style={{ backgroundColor: '#FFFFFF', borderRadius: '14px', border: '1px solid #E2E8F0', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                <thead>
                  <tr style={{ backgroundColor: '#F1F5F9', textAlign: 'left', color: '#475569' }}>
                    <th style={{ padding: '12px 16px' }}>Session Ref</th>
                    <th style={{ padding: '12px 16px' }}>Citizen / Patient</th>
                    <th style={{ padding: '12px 16px' }}>Expectation Record</th>
                    <th style={{ padding: '12px 16px' }}>Facility</th>
                    <th style={{ padding: '12px 16px' }}>Reconciliation</th>
                  </tr>
                </thead>
                <tbody>
                  {expectations.map(exp => (
                    <tr key={exp.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                      <td style={{ padding: '12px 16px', fontWeight: 700, color: '#0284C7' }}>{exp.sessionId}</td>
                      <td style={{ padding: '12px 16px', fontWeight: 600 }}>{exp.userName}</td>
                      <td style={{ padding: '12px 16px', color: '#334155', maxWidth: '300px' }}>"{exp.expectationText}"</td>
                      <td style={{ padding: '12px 16px', fontSize: '12px' }}>{exp.facilityName}</td>
                      <td style={{ padding: '12px 16px' }}>
                        {exp.hasFeedback ? (
                          <span style={{
                            padding: '2px 8px',
                            borderRadius: '6px',
                            fontSize: '11px',
                            fontWeight: 700,
                            backgroundColor: exp.expectationMet ? '#DCFCE7' : '#FEE2E2',
                            color: exp.expectationMet ? '#15803D' : '#B91C1C'
                          }}>
                            {exp.expectationMet ? 'Met ✔' : 'Unmet ✖'}
                          </span>
                        ) : (
                          <span style={{ fontSize: '12px', color: '#94A3B8' }}>Pending Post-Care</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* TAB 6: FEEDBACK */}
          {activeTab === 'feedback' && (
            <div style={{ backgroundColor: '#FFFFFF', borderRadius: '14px', border: '1px solid #E2E8F0', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                <thead>
                  <tr style={{ backgroundColor: '#F1F5F9', textAlign: 'left', color: '#475569' }}>
                    <th style={{ padding: '12px 16px' }}>Patient</th>
                    <th style={{ padding: '12px 16px' }}>Expectation Met?</th>
                    <th style={{ padding: '12px 16px' }}>Submitted Feedback Note</th>
                    <th style={{ padding: '12px 16px' }}>Category Tags</th>
                    <th style={{ padding: '12px 16px' }}>Timestamp</th>
                  </tr>
                </thead>
                <tbody>
                  {feedbackList.map(f => (
                    <tr key={f.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                      <td style={{ padding: '12px 16px', fontWeight: 600 }}>{f.userName}</td>
                      <td style={{ padding: '12px 16px' }}>
                        <span style={{
                          padding: '3px 8px',
                          borderRadius: '6px',
                          fontSize: '11.5px',
                          fontWeight: 700,
                          backgroundColor: f.expectationMet ? '#DCFCE7' : '#FEE2E2',
                          color: f.expectationMet ? '#15803D' : '#B91C1C'
                        }}>
                          {f.expectationMet ? 'Yes (Fulfilled)' : 'No (Unmet Standard)'}
                        </span>
                      </td>
                      <td style={{ padding: '12px 16px', color: '#334155', maxWidth: '300px' }}>
                        {f.feedbackText ? `"${f.feedbackText}"` : <span style={{ color: '#94A3B8', fontStyle: 'italic' }}>Optional (No comment provided)</span>}
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                          {f.tags?.map((t, idx) => (
                            <span key={idx} style={{ fontSize: '10.5px', backgroundColor: '#EFF6FF', color: '#1E40AF', padding: '1px 6px', borderRadius: '4px' }}>
                              {t}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td style={{ padding: '12px 16px', fontSize: '12px', color: '#64748B' }}>
                        {new Date(f.submittedAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* TAB 7: AUDIT */}
          {activeTab === 'audit' && (
            <div style={{ backgroundColor: '#FFFFFF', borderRadius: '14px', border: '1px solid #E2E8F0', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12.5px' }}>
                <thead>
                  <tr style={{ backgroundColor: '#F1F5F9', textAlign: 'left', color: '#475569' }}>
                    <th style={{ padding: '10px 14px' }}>Action</th>
                    <th style={{ padding: '10px 14px' }}>Entity</th>
                    <th style={{ padding: '10px 14px' }}>User / Phone</th>
                    <th style={{ padding: '10px 14px' }}>IP Address</th>
                    <th style={{ padding: '10px 14px' }}>Timestamp</th>
                  </tr>
                </thead>
                <tbody>
                  {auditLogs.map(l => (
                    <tr key={l.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                      <td style={{ padding: '10px 14px', fontWeight: 700, color: '#1E3A8A' }}>{l.action}</td>
                      <td style={{ padding: '10px 14px' }}>{l.entityType}</td>
                      <td style={{ padding: '10px 14px' }}>{l.userName} ({l.userPhone})</td>
                      <td style={{ padding: '10px 14px', fontFamily: 'monospace', color: '#64748B' }}>{l.ipAddress}</td>
                      <td style={{ padding: '10px 14px', color: '#64748B' }}>{new Date(l.createdAt).toLocaleTimeString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
