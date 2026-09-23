import React, { useState } from 'react';
import { 
  Calendar, 
  User, 
  LogOut, 
  Shield, 
  Building2, 
  BarChart3, 
  MessageSquareCheck,
  ChevronDown
} from 'lucide-react';

export default function Navbar({ 
  activeView, 
  onNavigate, 
  user, 
  onLogout, 
  onOpenLogin, 
  onOpenAdmin,
  onOpenStatusInquiry,
  onOpenServiceCharter 
}) {
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  return (
    <header style={{
      backgroundColor: '#FFFFFF',
      borderBottom: '1px solid #E2E8F0',
      padding: '0 2rem',
      height: '70px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.03)'
    }}>
      {/* Brand Logo */}
      <div 
        onClick={() => onNavigate(user ? 'pathway' : 'register')}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          cursor: 'pointer',
          userSelect: 'none'
        }}
      >
        <div style={{
          width: '38px',
          height: '38px',
          backgroundColor: '#1E3A8A',
          borderRadius: '10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#FFFFFF',
          boxShadow: '0 2px 8px rgba(30, 58, 138, 0.25)'
        }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            <path d="M9 10h.01"></path>
            <path d="M15 10h.01"></path>
          </svg>
        </div>
        <div>
          <div style={{
            fontSize: '18px',
            fontWeight: 800,
            color: '#0F172A',
            letterSpacing: '-0.02em',
            lineHeight: 1.1
          }}>
            CareEcho
          </div>
          <div style={{
            fontSize: '9.5px',
            fontWeight: 700,
            color: '#64748B',
            letterSpacing: '0.08em',
            textTransform: 'uppercase'
          }}>
            Feedback Portal
          </div>
        </div>
      </div>

      {/* Primary Navigation Links */}
      <nav style={{
        display: 'flex',
        alignItems: 'center',
        gap: '24px'
      }}>
        <button
          onClick={() => onNavigate('expectation')}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '14.5px',
            fontWeight: activeView === 'expectation' || activeView === 'pathway' ? 700 : 500,
            color: activeView === 'expectation' || activeView === 'pathway' ? '#1E3A8A' : '#475569',
            cursor: 'pointer',
            padding: '8px 12px',
            borderRadius: '8px',
            position: 'relative'
          }}
        >
          Register Expectations
          {(activeView === 'expectation' || activeView === 'pathway') && (
            <span style={{
              position: 'absolute',
              bottom: '-12px',
              left: '12px',
              right: '12px',
              height: '2.5px',
              backgroundColor: '#1E3A8A',
              borderRadius: '2px'
            }} />
          )}
        </button>

        <button
          onClick={() => onNavigate('feedback')}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '14.5px',
            fontWeight: activeView === 'feedback' ? 700 : 500,
            color: activeView === 'feedback' ? '#1E3A8A' : '#475569',
            cursor: 'pointer',
            padding: '8px 12px',
            borderRadius: '8px',
            position: 'relative'
          }}
        >
          Share Feedback
          {activeView === 'feedback' && (
            <span style={{
              position: 'absolute',
              bottom: '-12px',
              left: '12px',
              right: '12px',
              height: '2.5px',
              backgroundColor: '#1E3A8A',
              borderRadius: '2px'
            }} />
          )}
        </button>

        <button
          onClick={onOpenStatusInquiry}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '14.5px',
            fontWeight: 500,
            color: '#475569',
            cursor: 'pointer',
            padding: '8px 12px',
            borderRadius: '8px'
          }}
        >
          Status Inquiry
        </button>

        <button
          onClick={onOpenServiceCharter}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '14.5px',
            fontWeight: 500,
            color: '#475569',
            cursor: 'pointer',
            padding: '8px 12px',
            borderRadius: '8px'
          }}
        >
          Service Charter
        </button>
      </nav>

      {/* Right Side Widgets: Date & User Profile */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '18px'
      }}>
        {/* System Date Badge */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '7px',
          padding: '6px 14px',
          backgroundColor: '#F1F5F9',
          borderRadius: '999px',
          fontSize: '12.5px',
          fontWeight: 600,
          color: '#475569',
          border: '1px solid #E2E8F0'
        }}>
          <Calendar size={14} color="#64748B" />
          <span>System Date: Oct 24, 2026</span>
        </div>

        {/* User Profile Avatar / Action */}
        {user ? (
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: '#1E3A8A',
                color: '#FFFFFF',
                border: '2px solid #E2E8F0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 2px 6px rgba(0, 0, 0, 0.08)'
              }}
              title={`${user.firstName} ${user.lastName}`}
            >
              <User size={20} />
            </button>

            {showProfileMenu && (
              <div 
                style={{
                  position: 'absolute',
                  right: 0,
                  top: '48px',
                  width: '260px',
                  backgroundColor: '#FFFFFF',
                  borderRadius: '14px',
                  boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.05)',
                  border: '1px solid #E2E8F0',
                  padding: '12px',
                  zIndex: 100
                }}
                onMouseLeave={() => setShowProfileMenu(false)}
              >
                <div style={{
                  paddingBottom: '10px',
                  borderBottom: '1px solid #F1F5F9',
                  marginBottom: '8px'
                }}>
                  <div style={{ fontWeight: 700, fontSize: '14.5px', color: '#0F172A' }}>
                    {user.firstName} {user.lastName}
                  </div>
                  <div style={{ fontSize: '12px', color: '#64748B' }}>
                    {user.phoneNumber}
                  </div>
                  <div style={{
                    marginTop: '6px',
                    display: 'inline-block',
                    padding: '2px 8px',
                    borderRadius: '6px',
                    fontSize: '11px',
                    fontWeight: 700,
                    backgroundColor: user.role === 'ADMIN' ? '#FEF3C7' : '#EFF6FF',
                    color: user.role === 'ADMIN' ? '#B45309' : '#1E3A8A'
                  }}>
                    {user.role === 'ADMIN' ? 'DIRECTORATE / ADMIN' : 'PATIENT REGISTRY'}
                  </div>
                </div>

                {user.role === 'ADMIN' && (
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      onOpenAdmin();
                    }}
                    style={{
                      width: '100%',
                      textAlign: 'left',
                      padding: '9px 10px',
                      borderRadius: '8px',
                      background: 'none',
                      border: 'none',
                      fontSize: '13.5px',
                      fontWeight: 600,
                      color: '#0F172A',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F8FAFC'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <BarChart3 size={16} color="#2563EB" />
                    Admin Management
                  </button>
                )}

                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    onNavigate('pathway');
                  }}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    padding: '9px 10px',
                    borderRadius: '8px',
                    background: 'none',
                    border: 'none',
                    fontSize: '13.5px',
                    fontWeight: 500,
                    color: '#0F172A',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F8FAFC'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <MessageSquareCheck size={16} color="#64748B" />
                  Action Pathway
                </button>

                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    onLogout();
                  }}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    padding: '9px 10px',
                    borderRadius: '8px',
                    background: 'none',
                    border: 'none',
                    fontSize: '13.5px',
                    fontWeight: 500,
                    color: '#DC2626',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginTop: '4px'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FEE2E2'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <LogOut size={16} color="#DC2626" />
                  Sign Out
                </button>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={onOpenLogin}
            style={{
              backgroundColor: '#1E3A8A',
              color: '#FFFFFF',
              border: 'none',
              padding: '8px 18px',
              borderRadius: '999px',
              fontSize: '13.5px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 2px 6px rgba(30, 58, 138, 0.2)'
            }}
          >
            <User size={15} />
            Quick Login
          </button>
        )}
      </div>
    </header>
  );
}
