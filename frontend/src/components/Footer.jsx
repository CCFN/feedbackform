import React from 'react';
import { Lock, ShieldCheck, HelpCircle } from 'lucide-react';

export default function Footer({ onOpenSupport, onOpenStandards, onOpenPrivacy }) {
  return (
    <footer style={{
      backgroundColor: '#FFFFFF',
      borderTop: '1px solid #E2E8F0',
      padding: '24px 2rem',
      fontSize: '13px',
      color: '#64748B',
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '16px',
      marginTop: 'auto'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <span>© 2026 CareEcho Institutional Portal. Civic Accountability Framework.</span>
        <span style={{ color: '#CBD5E1' }}>•</span>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          color: '#0D9488',
          fontWeight: 600
        }}>
          <Lock size={14} />
          <span>Encrypted Civic Data Guarantee</span>
        </div>
      </div>

      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '20px'
      }}>
        <button
          onClick={onOpenPrivacy}
          style={{
            background: 'none',
            border: 'none',
            color: '#475569',
            cursor: 'pointer',
            fontSize: '13px',
            textDecoration: 'none'
          }}
          onMouseEnter={(e) => e.target.style.color = '#1E3A8A'}
          onMouseLeave={(e) => e.target.style.color = '#475569'}
        >
          Privacy Policy
        </button>

        <button
          onClick={onOpenStandards}
          style={{
            background: 'none',
            border: 'none',
            color: '#475569',
            cursor: 'pointer',
            fontSize: '13px',
            textDecoration: 'none'
          }}
          onMouseEnter={(e) => e.target.style.color = '#1E3A8A'}
          onMouseLeave={(e) => e.target.style.color = '#475569'}
        >
          Institutional Standards
        </button>

        <button
          onClick={onOpenSupport}
          style={{
            background: 'none',
            border: 'none',
            color: '#475569',
            cursor: 'pointer',
            fontSize: '13px',
            textDecoration: 'none'
          }}
          onMouseEnter={(e) => e.target.style.color = '#1E3A8A'}
          onMouseLeave={(e) => e.target.style.color = '#475569'}
        >
          Support Desk
        </button>
      </div>
    </footer>
  );
}
