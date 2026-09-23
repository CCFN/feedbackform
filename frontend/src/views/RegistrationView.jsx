import React, { useState, useEffect } from 'react';
import { 
  Phone, 
  Shield, 
  ShieldCheck, 
  Info, 
  Camera, 
  User, 
  Building2, 
  PlusSquare, 
  ChevronDown, 
  ArrowRight, 
  Key, 
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  Briefcase
} from 'lucide-react';
import { api } from '../api.js';

export default function RegistrationView({ onRegisterSuccess, onOpenLogin, onOpenSupport }) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    stateId: '',
    facilityId: '',
    password: '',
    confirmPassword: '',
    avatar: 'avatar_1'
  });

  const [states, setStates] = useState([]);
  const [facilities, setFacilities] = useState([]);
  const [loadingStates, setLoadingStates] = useState(true);
  const [loadingFacilities, setLoadingFacilities] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  // Load States from Database on Mount
  useEffect(() => {
    async function loadStates() {
      try {
        setLoadingStates(true);
        const res = await api.getStates();
        if (res.data) {
          setStates(res.data);
        }
      } catch (err) {
        console.error('Failed to load states:', err);
        setErrorMessage('Unable to load state jurisdictions from the database.');
      } finally {
        setLoadingStates(false);
      }
    }
    loadStates();
  }, []);

  // Cascading Dropdown: Load Facilities whenever State changes
  const handleStateChange = async (e) => {
    const selectedStateId = e.target.value;
    setFormData(prev => ({ ...prev, stateId: selectedStateId, facilityId: '' }));
    setFieldErrors(prev => ({ ...prev, stateId: undefined, facilityId: undefined }));

    if (!selectedStateId) {
      setFacilities([]);
      return;
    }

    try {
      setLoadingFacilities(true);
      const res = await api.getFacilitiesByState(selectedStateId);
      if (res.data) {
        setFacilities(res.data);
      }
    } catch (err) {
      console.error('Failed to load facilities:', err);
      setErrorMessage('Failed to load healthcare facilities for the selected state.');
    } finally {
      setLoadingFacilities(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (fieldErrors[field]) {
      setFieldErrors(prev => ({ ...prev, [field]: undefined }));
    }
    if (errorMessage) {
      setErrorMessage('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setFieldErrors({});

    // Client-side quick checks
    const errors = {};
    if (!formData.firstName.trim()) errors.firstName = 'First name is required';
    if (!formData.lastName.trim()) errors.lastName = 'Last name is required';
    if (!formData.phoneNumber.trim()) errors.phoneNumber = 'Phone number is required';
    if (!formData.stateId) errors.stateId = 'State jurisdiction is required';
    if (!formData.facilityId) errors.facilityId = 'Assigned facility is required';
    if (!formData.password) errors.password = 'Password is required';
    if (formData.password !== formData.confirmPassword) errors.confirmPassword = 'Passwords do not match';

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await api.register(formData);
      if (res.success) {
        // Auto-login after successful registration
        const loginRes = await api.login(formData.phoneNumber, formData.password);
        onRegisterSuccess(loginRes.data.user);
      }
    } catch (err) {
      console.error('Registration failed:', err);
      if (err.errors) {
        setFieldErrors(err.errors);
      }
      setErrorMessage(err.message || 'Registration failed. Please check your inputs.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="careecho-background" style={{
      minHeight: 'calc(100vh - 70px)',
      padding: '40px 20px 60px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      {/* Top Tag Pill */}
      <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        padding: '6px 16px',
        backgroundColor: '#E6FFFA',
        borderRadius: '999px',
        marginBottom: '16px',
        border: '1px solid #CCFBF1'
      }}>
        <span style={{
          width: '8px',
          height: '8px',
          backgroundColor: '#0D9488',
          borderRadius: '50%',
          display: 'inline-block'
        }} />
        <span style={{
          fontSize: '12.5px',
          fontWeight: 700,
          color: '#0D9488',
          letterSpacing: '0.02em'
        }}>
          Facility Staff & Training Registry
        </span>
      </div>

      {/* Main Heading & Subtitle */}
      <h1 style={{
        fontSize: '36px',
        fontWeight: 800,
        color: '#0F172A',
        letterSpacing: '-0.03em',
        textAlign: 'center',
        marginBottom: '8px'
      }}>
        Registration Page
      </h1>

      <p style={{
        fontSize: '15px',
        color: '#64748B',
        textAlign: 'center',
        maxWidth: '560px',
        lineHeight: 1.5,
        marginBottom: '32px'
      }}>
        Provide your verified staff details and institutional facility anchor to begin your training workflow.
      </p>

      {/* Registration Card Form */}
      <div style={{
        width: '100%',
        maxWidth: '560px',
        backgroundColor: '#FFFFFF',
        borderRadius: '24px',
        padding: '36px 32px',
        boxShadow: '0 20px 40px -15px rgba(15, 23, 42, 0.08), 0 0 1px 1px rgba(226, 232, 240, 0.8)',
        border: '1px solid #E2E8F0'
      }}>
        {/* Staff Avatar Selector */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          marginBottom: '28px'
        }}>
          <div style={{
            position: 'relative',
            width: '84px',
            height: '84px',
            borderRadius: '50%',
            backgroundColor: '#E0F2FE',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#0369A1',
            boxShadow: '0 4px 12px rgba(3, 105, 161, 0.12)'
          }}>
            <User size={46} />
            <div style={{
              position: 'absolute',
              bottom: '0px',
              right: '0px',
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              backgroundColor: '#0D9488',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '2.5px solid #FFFFFF',
              boxShadow: '0 2px 5px rgba(0, 0, 0, 0.15)'
            }}>
              <Camera size={14} />
            </div>
          </div>
          <span style={{
            marginTop: '10px',
            fontSize: '11px',
            fontWeight: 800,
            color: '#64748B',
            letterSpacing: '0.08em',
            textTransform: 'uppercase'
          }}>
            Facility Staff / Trainee Avatar
          </span>
        </div>

        {/* Global Error Alert */}
        {errorMessage && (
          <div style={{
            padding: '12px 16px',
            backgroundColor: '#FEE2E2',
            border: '1px solid #FCA5A5',
            borderRadius: '12px',
            color: '#B91C1C',
            fontSize: '13.5px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            marginBottom: '20px'
          }}>
            <AlertCircle size={18} />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Row 1: First Name & Last Name */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{
                display: 'block',
                fontSize: '13.5px',
                fontWeight: 700,
                color: '#1E293B',
                marginBottom: '6px'
              }}>
                First Name <span style={{ color: '#DC2626' }}>*</span>
              </label>
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                placeholder="e.g. Eleanor"
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  borderRadius: '10px',
                  border: `1.5px solid ${fieldErrors.firstName ? '#EF4444' : '#E2E8F0'}`,
                  backgroundColor: '#FFFFFF',
                  fontSize: '14.5px',
                  color: '#0F172A',
                  fontFamily: 'inherit'
                }}
              />
              {fieldErrors.firstName && (
                <span style={{ fontSize: '12px', color: '#DC2626', marginTop: '4px', display: 'block' }}>
                  {fieldErrors.firstName}
                </span>
              )}
            </div>

            <div>
              <label style={{
                display: 'block',
                fontSize: '13.5px',
                fontWeight: 700,
                color: '#1E293B',
                marginBottom: '6px'
              }}>
                Last Name <span style={{ color: '#DC2626' }}>*</span>
              </label>
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                placeholder="e.g. Vance"
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  borderRadius: '10px',
                  border: `1.5px solid ${fieldErrors.lastName ? '#EF4444' : '#E2E8F0'}`,
                  backgroundColor: '#FFFFFF',
                  fontSize: '14.5px',
                  color: '#0F172A',
                  fontFamily: 'inherit'
                }}
              />
              {fieldErrors.lastName && (
                <span style={{ fontSize: '12px', color: '#DC2626', marginTop: '4px', display: 'block' }}>
                  {fieldErrors.lastName}
                </span>
              )}
            </div>
          </div>

          {/* Row 2: Phone Number with Phone icon & Shield Icon */}
          <div>
            <label style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '13.5px',
              fontWeight: 700,
              color: '#1E293B',
              marginBottom: '6px'
            }}>
              <Phone size={14} color="#1E3A8A" />
              <span>Phone Number</span>
              <span style={{ color: '#DC2626' }}>*</span>
            </label>

            <div style={{ position: 'relative' }}>
              <input
                type="tel"
                value={formData.phoneNumber}
                onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                placeholder="+234 801 234 5678 or 08012345678"
                style={{
                  width: '100%',
                  padding: '12px 40px 12px 14px',
                  borderRadius: '10px',
                  border: `1.5px solid ${fieldErrors.phoneNumber ? '#EF4444' : '#E2E8F0'}`,
                  backgroundColor: '#FFFFFF',
                  fontSize: '14.5px',
                  color: '#0F172A',
                  fontFamily: 'inherit'
                }}
              />
              <div style={{
                position: 'absolute',
                right: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#94A3B8'
              }}>
                <ShieldCheck size={18} />
              </div>
            </div>
            {fieldErrors.phoneNumber && (
              <span style={{ fontSize: '12px', color: '#DC2626', marginTop: '4px', display: 'block' }}>
                {fieldErrors.phoneNumber}
              </span>
            )}
          </div>

          {/* Phone Number Info Box */}
          <div style={{
            backgroundColor: '#EFF6FF',
            border: '1px solid #DBEAFE',
            borderRadius: '10px',
            padding: '10px 14px',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '10px',
            fontSize: '12.5px',
            color: '#1E40AF',
            lineHeight: 1.45
          }}>
            <Info size={16} color="#2563EB" style={{ flexShrink: 0, marginTop: '2px' }} />
            <span>Your phone number serves as your unique staff login identifier and training intake key.</span>
          </div>

          {/* Row 3: State of Residence / Duty State */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <label style={{
                fontSize: '13.5px',
                fontWeight: 700,
                color: '#1E293B'
              }}>
                State Jurisdiction / Deployment State
              </label>
              <span style={{
                fontSize: '11px',
                fontWeight: 600,
                padding: '2px 8px',
                backgroundColor: '#EFF6FF',
                color: '#2563EB',
                borderRadius: '6px'
              }}>
                Configured by Admin
              </span>
            </div>

            <div style={{ position: 'relative' }}>
              <select
                value={formData.stateId}
                onChange={handleStateChange}
                disabled={loadingStates}
                style={{
                  width: '100%',
                  padding: '12px 36px 12px 14px',
                  borderRadius: '10px',
                  border: `1.5px solid ${fieldErrors.stateId ? '#EF4444' : '#E2E8F0'}`,
                  backgroundColor: '#FFFFFF',
                  fontSize: '14px',
                  color: formData.stateId ? '#0F172A' : '#94A3B8',
                  appearance: 'none',
                  cursor: 'pointer',
                  fontFamily: 'inherit'
                }}
              >
                <option value="">Select assigned state jurisdiction...</option>
                {states.map(state => (
                  <option key={state.id} value={state.id}>
                    {state.name} ({state.code})
                  </option>
                ))}
              </select>
              <div style={{
                position: 'absolute',
                right: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                pointerEvents: 'none',
                color: '#64748B'
              }}>
                <ChevronDown size={18} />
              </div>
            </div>
            {fieldErrors.stateId && (
              <span style={{ fontSize: '12px', color: '#DC2626', marginTop: '4px', display: 'block' }}>
                {fieldErrors.stateId}
              </span>
            )}
          </div>

          {/* Row 4: Primary Healthcare Facility */}
          <div>
            <label style={{
              display: 'block',
              fontSize: '13.5px',
              fontWeight: 700,
              color: '#1E293B',
              marginBottom: '6px'
            }}>
              Assigned Healthcare Facility / Duty Station <span style={{ color: '#DC2626' }}>*</span>
            </label>

            <div style={{ position: 'relative' }}>
              <select
                value={formData.facilityId}
                onChange={(e) => handleInputChange('facilityId', e.target.value)}
                disabled={!formData.stateId || loadingFacilities}
                style={{
                  width: '100%',
                  padding: '12px 36px 12px 14px',
                  borderRadius: '10px',
                  border: `1.5px solid ${fieldErrors.facilityId ? '#EF4444' : '#E2E8F0'}`,
                  backgroundColor: !formData.stateId ? '#F8FAFC' : '#FFFFFF',
                  fontSize: '14px',
                  color: formData.facilityId ? '#0F172A' : '#94A3B8',
                  appearance: 'none',
                  cursor: formData.stateId ? 'pointer' : 'not-allowed',
                  fontFamily: 'inherit'
                }}
              >
                <option value="">
                  {!formData.stateId 
                    ? 'Choose a state first to view linked centers...' 
                    : (loadingFacilities ? 'Loading facility registry...' : 'Select assigned facility branch...')}
                </option>
                {facilities.map(facility => (
                  <option key={facility.id} value={facility.id}>
                    {facility.name} — {facility.ward || 'Main Station'}
                  </option>
                ))}
              </select>
              <div style={{
                position: 'absolute',
                right: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                pointerEvents: 'none',
                color: '#64748B'
              }}>
                <PlusSquare size={18} />
              </div>
            </div>

            <p style={{
              fontSize: '11.5px',
              color: '#64748B',
              marginTop: '5px'
            }}>
              Facilities update automatically based on administrative network access.
            </p>
            {fieldErrors.facilityId && (
              <span style={{ fontSize: '12px', color: '#DC2626', marginTop: '4px', display: 'block' }}>
                {fieldErrors.facilityId}
              </span>
            )}
          </div>

          {/* Row 5: Password & Confirm Password */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{
                display: 'block',
                fontSize: '13.5px',
                fontWeight: 700,
                color: '#1E293B',
                marginBottom: '6px'
              }}>
                Password <span style={{ color: '#DC2626' }}>*</span>
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  placeholder="Min 8 chars (e.g. Pass@123)"
                  style={{
                    width: '100%',
                    padding: '12px 36px 12px 14px',
                    borderRadius: '10px',
                    border: `1.5px solid ${fieldErrors.password ? '#EF4444' : '#E2E8F0'}`,
                    backgroundColor: '#FFFFFF',
                    fontSize: '14px',
                    color: '#0F172A',
                    fontFamily: 'inherit'
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '10px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#94A3B8'
                  }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {fieldErrors.password && (
                <span style={{ fontSize: '11.5px', color: '#DC2626', marginTop: '4px', display: 'block' }}>
                  {fieldErrors.password}
                </span>
              )}
            </div>

            <div>
              <label style={{
                display: 'block',
                fontSize: '13.5px',
                fontWeight: 700,
                color: '#1E293B',
                marginBottom: '6px'
              }}>
                Confirm Password <span style={{ color: '#DC2626' }}>*</span>
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                placeholder="Re-type password"
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  borderRadius: '10px',
                  border: `1.5px solid ${fieldErrors.confirmPassword ? '#EF4444' : '#E2E8F0'}`,
                  backgroundColor: '#FFFFFF',
                  fontSize: '14px',
                  color: '#0F172A',
                  fontFamily: 'inherit'
                }}
              />
              {fieldErrors.confirmPassword && (
                <span style={{ fontSize: '11.5px', color: '#DC2626', marginTop: '4px', display: 'block' }}>
                  {fieldErrors.confirmPassword}
                </span>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary"
            style={{
              width: '100%',
              padding: '14px 20px',
              fontSize: '15.5px',
              fontWeight: 700,
              marginTop: '8px'
            }}
          >
            {isSubmitting ? 'Verifying & Registering...' : (
              <>
                <span>Create Account & Continue</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>

          {/* Already submitted before? Quick Login */}
          <div style={{
            backgroundColor: '#F1F5F9',
            borderRadius: '12px',
            padding: '12px 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '13.5px',
            color: '#475569'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Key size={16} color="#0284C7" />
              <span>Already submitted expectations before?</span>
            </div>
            <button
              type="button"
              onClick={onOpenLogin}
              style={{
                background: 'none',
                border: 'none',
                color: '#1E3A8A',
                fontWeight: 700,
                fontSize: '13.5px',
                cursor: 'pointer',
                textDecoration: 'none'
              }}
              onMouseEnter={(e) => e.target.style.textDecoration = 'underline'}
              onMouseLeave={(e) => e.target.style.textDecoration = 'none'}
            >
              Quick Login
            </button>
          </div>
        </form>
      </div>

      {/* Footer Safeguard & Support Links */}
      <div style={{
        marginTop: '32px',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '24px',
        fontSize: '13px',
        color: '#475569'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Shield size={16} color="#0D9488" />
          <span>Facility Staff Data Safeguards Compliant</span>
        </div>
        <button
          onClick={onOpenSupport}
          style={{ background: 'none', border: 'none', color: '#475569', cursor: 'pointer', fontSize: '13px' }}
        >
          Training Help Desk
        </button>
        <span style={{ color: '#CBD5E1' }}>•</span>
        <span style={{ color: '#475569' }}>Facility Directory</span>
      </div>
    </div>
  );
}
