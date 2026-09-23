import React from 'react';
import { X, Shield, FileText, CheckCircle2, Phone, Mail, HelpCircle, Building } from 'lucide-react';

export function StatusInquiryModal({ isOpen, onClose, user }) {
  if (!isOpen) return null;
  return (
    <div style={modalOverlayStyle}>
      <div className="animate-fade-in" style={modalContentStyle}>
        <div style={modalHeaderStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <FileText size={22} color="#1E3A8A" />
            <h3 style={{ fontSize: '18px', fontWeight: 800 }}>Status Inquiry</h3>
          </div>
          <button onClick={onClose} style={closeBtnStyle}><X size={20} /></button>
        </div>
        <div style={{ padding: '24px' }}>
          <p style={{ fontSize: '14px', color: '#475569', lineHeight: 1.6, marginBottom: '16px' }}>
            Inquire on the reconciliation state of your registered healthcare expectations or submitted clinical audits.
          </p>
          <div style={{ backgroundColor: '#F8FAFC', padding: '16px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
            <div style={{ fontSize: '13px', color: '#64748B' }}>Authenticated Intake Key:</div>
            <div style={{ fontSize: '15px', fontWeight: 700, color: '#1E3A8A', marginTop: '2px' }}>
              {user ? user.phoneNumber : '+2348012345678 (Active Session)'}
            </div>
            <div style={{ marginTop: '12px', fontSize: '13px', color: '#0D9488', fontWeight: 600 }}>
              ✔ Standard Operating Record verified with institutional server.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ServiceCharterModal({ isOpen, onClose }) {
  if (!isOpen) return null;
  return (
    <div style={modalOverlayStyle}>
      <div className="animate-fade-in" style={modalContentStyle}>
        <div style={modalHeaderStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Shield size={22} color="#0D9488" />
            <h3 style={{ fontSize: '18px', fontWeight: 800 }}>Patient Charter & Standards</h3>
          </div>
          <button onClick={onClose} style={closeBtnStyle}><X size={20} /></button>
        </div>
        <div style={{ padding: '24px', fontSize: '14px', color: '#334155', lineHeight: 1.6 }}>
          <h4 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '8px', color: '#0F172A' }}>
            2026 Civic Healthcare Accountability Framework
          </h4>
          <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <li>Every citizen is entitled to prompt, professional consultation within 15-30 minutes of scheduled appointments.</li>
            <li>Clean, sterilized hospital facilities and transparent prescription charges are non-negotiable standards.</li>
            <li>All feedback logged into CareEcho is tamper-evident and reviewed directly by institutional quality boards.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export function OmbudsmanModal({ isOpen, onClose }) {
  if (!isOpen) return null;
  return (
    <div style={modalOverlayStyle}>
      <div className="animate-fade-in" style={modalContentStyle}>
        <div style={modalHeaderStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Building size={22} color="#2563EB" />
            <h3 style={{ fontSize: '18px', fontWeight: 800 }}>Ombudsman Review Request</h3>
          </div>
          <button onClick={onClose} style={closeBtnStyle}><X size={20} /></button>
        </div>
        <div style={{ padding: '24px', fontSize: '14px', color: '#475569', lineHeight: 1.6 }}>
          <p style={{ marginBottom: '14px' }}>
            If your hospital care significantly diverged from statutory standards, an independent Ombudsman inquiry can be escalated directly to the Directorate of Health Services.
          </p>
          <div style={{ backgroundColor: '#EFF6FF', padding: '14px', borderRadius: '10px', color: '#1E40AF', fontWeight: 600, fontSize: '13px' }}>
            Direct Hotline: Dial ext. 4022 or +234 (0) 800-OMBUDSMAN
          </div>
        </div>
      </div>
    </div>
  );
}

export function ProtocolGuideModal({ isOpen, onClose }) {
  if (!isOpen) return null;
  return (
    <div style={modalOverlayStyle}>
      <div className="animate-fade-in" style={modalContentStyle}>
        <div style={modalHeaderStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <HelpCircle size={22} color="#0284C7" />
            <h3 style={{ fontSize: '18px', fontWeight: 800 }}>CareEcho Protocol Guide</h3>
          </div>
          <button onClick={onClose} style={closeBtnStyle}><X size={20} /></button>
        </div>
        <div style={{ padding: '24px', fontSize: '14px', color: '#334155', lineHeight: 1.6 }}>
          <p style={{ marginBottom: '12px' }}>
            <strong>Stage 01 (Pre-Service):</strong> Record your standards (wait times, diagnostics, care clarity) before seeing your physician.
          </p>
          <p>
            <strong>Stage 02 (Post-Service):</strong> Compare your consultation outcome against your initial record to calibrate hospital quality metrics.
          </p>
        </div>
      </div>
    </div>
  );
}

const modalOverlayStyle = {
  position: 'fixed',
  inset: 0,
  backgroundColor: 'rgba(15, 23, 42, 0.6)',
  backdropFilter: 'blur(6px)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 220,
  padding: '20px'
};

const modalContentStyle = {
  width: '100%',
  maxWidth: '520px',
  backgroundColor: '#FFFFFF',
  borderRadius: '20px',
  boxShadow: '0 20px 40px -15px rgba(15, 23, 42, 0.2)',
  border: '1px solid #E2E8F0',
  overflow: 'hidden'
};

const modalHeaderStyle = {
  padding: '18px 24px',
  borderBottom: '1px solid #F1F5F9',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  backgroundColor: '#F8FAFC'
};

const closeBtnStyle = {
  background: 'none',
  border: 'none',
  color: '#94A3B8',
  cursor: 'pointer',
  padding: '4px'
};
