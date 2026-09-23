import React, { useState } from 'react';
import { X, Phone, Lock, Eye, EyeOff, AlertCircle, ArrowRight, ShieldCheck, UserCheck } from 'lucide-react';
import { api } from '../api.js';

export default function LoginModal({ isOpen, onClose, onLoginSuccess }) {
  if (!isOpen) return null;

  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!phoneNumber.trim() || !password) {
      setErrorMessage('Please enter both your phone number and password.');
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await api.login(phoneNumber, password);
      if (res.success) {
        onLoginSuccess(res.data.user);
        onClose();
      }
    } catch (err) {
      console.error('Login failed:', err);
      setErrorMessage(err.message || 'Invalid phone number or password.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Quick Demo Accounts Fill
  const fillDemoAccount = (phone, pass) => {
    setPhoneNumber(phone);
    setPassword(pass);
    setErrorMessage('');
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.6)',
      backdropFilter: 'blur(6px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 200,
      padding: '20px'
    }}>
      <div 
        className="animate-fade-in"
        style={{
          width: '100%',
          maxWidth: '460px',
          backgroundColor: '#FFFFFF',
          borderRadius: '24px',
          padding: '32px',
          boxShadow: '0 25px 50px -12px rgba(15, 23, 42, 0.25)',
          border: '1px solid #E2E8F0',
          position: 'relative'
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'none',
            border: 'none',
            color: '#94A3B8',
            cursor: 'pointer',
            padding: '4px',
            borderRadius: '6px'
          }}
        >
          <X size={20} />
        </button>

        {/* Title */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            backgroundColor: '#EFF6FF',
            color: '#1E3A8A',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '12px'
          }}>
            <ShieldCheck size={26} />
          </div>
          <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.02em' }}>
            CareEcho Sign In
          </h2>
          <p style={{ fontSize: '13.5px', color: '#64748B', marginTop: '4px' }}>
            Enter your verified intake phone number and secure password.
          </p>
        </div>

        {errorMessage && (
          <div style={{
            padding: '10px 14px',
            backgroundColor: '#FEE2E2',
            border: '1px solid #FCA5A5',
            borderRadius: '10px',
            color: '#B91C1C',
            fontSize: '13px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '18px'
          }}>
            <AlertCircle size={16} />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#1E293B', marginBottom: '6px' }}>
              Phone Number
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="+2348012345678 or 08012345678"
                style={{
                  width: '100%',
                  padding: '12px 14px 12px 38px',
                  borderRadius: '10px',
                  border: '1.5px solid #E2E8F0',
                  fontSize: '14px',
                  fontFamily: 'inherit'
                }}
              />
              <Phone size={16} color="#64748B" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#1E293B', marginBottom: '6px' }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                style={{
                  width: '100%',
                  padding: '12px 38px 12px 38px',
                  borderRadius: '10px',
                  border: '1.5px solid #E2E8F0',
                  fontSize: '14px',
                  fontFamily: 'inherit'
                }}
              />
              <Lock size={16} color="#64748B" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
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
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary"
            style={{ width: '100%', padding: '13px', fontSize: '15px', marginTop: '6px' }}
          >
            {isSubmitting ? 'Authenticating...' : (
              <>
                <span>Sign In to Dashboard</span>
                <ArrowRight size={17} />
              </>
            )}
          </button>
        </form>

        {/* Demo Fast Logins for Testing */}
        <div style={{
          marginTop: '24px',
          paddingTop: '16px',
          borderTop: '1px solid #F1F5F9',
          fontSize: '12px'
        }}>
          <div style={{ fontWeight: 700, color: '#64748B', marginBottom: '8px' }}>
            Quick Demo Credentials:
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <button
              type="button"
              onClick={() => fillDemoAccount('+2348012345678', 'Password@123')}
              style={{
                textAlign: 'left',
                padding: '6px 10px',
                borderRadius: '6px',
                backgroundColor: '#F8FAFC',
                border: '1px solid #E2E8F0',
                cursor: 'pointer',
                color: '#334155'
              }}
            >
              👤 <strong>Eleanor Vance (Patient)</strong>: 08012345678 / Password@123
            </button>
            <button
              type="button"
              onClick={() => fillDemoAccount('+2348000000001', 'Admin@CareEcho2026!')}
              style={{
                textAlign: 'left',
                padding: '6px 10px',
                borderRadius: '6px',
                backgroundColor: '#FEF3C7',
                border: '1px solid #FDE68A',
                cursor: 'pointer',
                color: '#92400E'
              }}
            >
              🛡 <strong>System Administrator</strong>: +2348000000001 / Admin@CareEcho2026!
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
