import React, { useState, useEffect } from 'react';
import { 
  Building, 
  Calendar, 
  CheckSquare, 
  Lock, 
  Unlock,
  Clock, 
  AlertCircle, 
  ArrowRight, 
  HelpCircle, 
  Shield, 
  CheckCircle2, 
  FileText,
  RotateCcw,
  Sparkles,
  RefreshCw,
  GraduationCap
} from 'lucide-react';
import { api } from '../api.js';

export default function ActionPathwayView({ 
  user, 
  onNavigateToExpectation, 
  onNavigateToFeedback, 
  onOpenProtocolGuide, 
  onOpenAssistance,
  onRefreshDashboard 
}) {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [simulatedCompleted, setSimulatedCompleted] = useState(false);

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    try {
      setLoading(true);
      const res = await api.getDashboard();
      if (res.data) {
        setDashboardData(res.data);
      }
    } catch (err) {
      console.error('Failed to load dashboard:', err);
    } finally {
      setLoading(false);
    }
  }

  // Check if expectation has been submitted
  const hasRealExpectation = Boolean(dashboardData?.expectation?.exists);
  const hasCompletedExpectation = hasRealExpectation || simulatedCompleted;
  const hasFeedback = Boolean(dashboardData?.feedback?.submitted);

  const toggleSimulation = () => {
    setSimulatedCompleted(!simulatedCompleted);
  };

  const userName = dashboardData?.user 
    ? `${dashboardData.user.firstName} ${dashboardData.user.lastName}` 
    : (user ? `${user.firstName} ${user.lastName}` : 'Alex Morgan');

  const userPhone = dashboardData?.user?.phoneNumber || user?.phoneNumber || '+1 555-019-2834';
  const facilityName = dashboardData?.user?.facilityName || user?.facilityName || 'Metro General Hospital — West Campus';
  const facilityWard = dashboardData?.user?.facilityWard || 'Clinical Training Wing';

  return (
    <div className="careecho-background" style={{
      minHeight: 'calc(100vh - 70px)',
      padding: '32px 24px 60px',
      maxWidth: '1200px',
      margin: '0 auto'
    }}>
      {/* Top Staff Training Console Card */}
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '20px',
        padding: '24px 28px',
        boxShadow: '0 4px 20px -2px rgba(15, 23, 42, 0.05), 0 0 1px 1px rgba(226, 232, 240, 0.8)',
        border: '1px solid #E2E8F0',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '20px',
        marginBottom: '24px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
          {/* Training / Staff Icon */}
          <div style={{
            width: '54px',
            height: '54px',
            borderRadius: '16px',
            backgroundColor: '#EFF6FF',
            border: '1.5px solid #DBEAFE',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#1E40AF',
            boxShadow: '0 2px 8px rgba(30, 64, 175, 0.1)'
          }}>
            <GraduationCap size={28} />
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.02em' }}>
                Staff Training Console
              </h2>
              <span style={{
                padding: '3px 10px',
                borderRadius: '6px',
                backgroundColor: '#EFF6FF',
                color: '#1E40AF',
                fontSize: '12px',
                fontWeight: 700
              }}>
                Facility Staff Registry
              </span>
            </div>

            <div style={{ fontSize: '14.5px', color: '#334155', marginTop: '2px', fontWeight: 500 }}>
              Welcome, <strong style={{ color: '#0F172A' }}>{userName}</strong> • Staff Tel: {userPhone}
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '13px',
              color: '#0D9488',
              fontWeight: 600,
              marginTop: '4px'
            }}>
              <Building size={14} />
              <span>{facilityName} ({facilityWard})</span>
            </div>
          </div>
        </div>

        {/* Right Console Actions: Timestamp & Simulation Switch */}
        <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: '#F8FAFC',
            border: '1px solid #E2E8F0',
            padding: '10px 16px',
            borderRadius: '12px',
            fontSize: '13px',
            color: '#475569',
            fontWeight: 600
          }}>
            <Calendar size={16} color="#0284C7" />
            <div>
              <div style={{ fontSize: '10.5px', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Training Date</div>
              <div style={{ color: '#0F172A', fontWeight: 700 }}>October 24, 2026</div>
            </div>
          </div>

          {/* Simulate Button */}
          <button
            onClick={toggleSimulation}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 18px',
              borderRadius: '12px',
              border: '1px solid #BAE6FD',
              backgroundColor: hasCompletedExpectation ? '#EFF6FF' : '#E0F2FE',
              color: '#0369A1',
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: '0 2px 6px rgba(2, 132, 199, 0.12)'
            }}
            title="Toggle simulation mode for rapid demonstration"
          >
            <RotateCcw size={15} />
            <span>{hasCompletedExpectation ? 'Simulation: Expectation Done ✔' : 'Simulate: Expectation Completed'}</span>
          </button>
        </div>
      </div>

      {/* Training Workflow Status Subheader */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 18px',
        backgroundColor: '#FFFFFF',
        borderRadius: '12px',
        border: '1px solid #E2E8F0',
        marginBottom: '40px',
        fontSize: '13px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#475569' }}>
          <span style={{ fontWeight: 700, letterSpacing: '0.04em', color: '#64748B', textTransform: 'uppercase', fontSize: '11.5px' }}>
            Training Workflow:
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{
              width: '20px',
              height: '20px',
              borderRadius: '50%',
              backgroundColor: '#1E3A8A',
              color: '#FFFFFF',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '11px',
              fontWeight: 700
            }}>1</span>
            <span style={{ fontWeight: 600, color: '#0F172A' }}>Pre-Training Expectations</span>
          </div>
          <span style={{ color: '#CBD5E1' }}>&gt;</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{
              width: '20px',
              height: '20px',
              borderRadius: '50%',
              backgroundColor: hasCompletedExpectation ? '#1E3A8A' : '#E2E8F0',
              color: hasCompletedExpectation ? '#FFFFFF' : '#64748B',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '11px',
              fontWeight: 700
            }}>2</span>
            <span style={{ fontWeight: hasCompletedExpectation ? 600 : 500, color: hasCompletedExpectation ? '#0F172A' : '#64748B' }}>
              Post-Training Feedback
            </span>
          </div>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          color: '#0D9488',
          fontWeight: 600,
          fontSize: '12.5px'
        }}>
          <Shield size={15} />
          <span>Staff Capacity Building Quality Framework</span>
        </div>
      </div>

      {/* Center Section Heading */}
      <div style={{ textAlign: 'center', marginBottom: '36px' }}>
        <h2 style={{
          fontSize: '32px',
          fontWeight: 800,
          color: '#1E3A8A',
          letterSpacing: '-0.02em',
          marginBottom: '8px'
        }}>
          Select Action Pathway
        </h2>
        <p style={{
          fontSize: '15px',
          color: '#64748B',
          maxWidth: '640px',
          margin: '0 auto',
          lineHeight: 1.5
        }}>
          Please register your personal learning objectives and training expectations prior to filing post-training evaluation feedback.
        </p>
      </div>

      {/* Two Action Pathway Cards Side-by-Side */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
        gap: '24px',
        marginBottom: '40px'
      }}>
        {/* CARD 1: STAGE 01 Expectation */}
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '20px',
          padding: '32px 28px',
          border: '1.5px solid #1E3A8A',
          boxShadow: '0 12px 30px -5px rgba(30, 58, 138, 0.08), 0 0 0 1px #1E3A8A',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Top Blue Accent Stripe */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            backgroundColor: '#1E3A8A'
          }} />

          {/* Header Row */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '20px'
          }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              backgroundColor: '#EFF6FF',
              color: '#1E3A8A',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid #DBEAFE'
            }}>
              <CheckSquare size={24} />
            </div>

            <div style={{
              padding: '4px 12px',
              borderRadius: '999px',
              backgroundColor: '#EFF6FF',
              color: '#1E40AF',
              fontSize: '12px',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#2563EB' }} />
              <span>{hasCompletedExpectation ? 'Completed' : 'Action Required'}</span>
            </div>
          </div>

          <div style={{
            fontSize: '11px',
            fontWeight: 800,
            color: '#64748B',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            marginBottom: '4px'
          }}>
            Stage 01
          </div>

          <h3 style={{
            fontSize: '24px',
            fontWeight: 800,
            color: '#0F172A',
            letterSpacing: '-0.02em',
            marginBottom: '10px'
          }}>
            Expectation
          </h3>

          <p style={{
            fontSize: '14.5px',
            color: '#475569',
            lineHeight: 1.5,
            marginBottom: '24px',
            flexGrow: 1
          }}>
            Document your initial training expectations, skills development needs, and learning benchmarks prior to the workshop or training session.
          </p>

          {/* Meta Box */}
          <div style={{
            backgroundColor: '#F8FAFC',
            borderRadius: '12px',
            padding: '14px 16px',
            border: '1px solid #E2E8F0',
            marginBottom: '24px'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '13px',
              marginBottom: '8px'
            }}>
              <span style={{ color: '#64748B' }}>Estimated Time:</span>
              <span style={{ fontWeight: 700, color: '#0F172A' }}>2 – 4 Minutes</span>
            </div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: '13px'
            }}>
              <span style={{ color: '#64748B' }}>Intake Status:</span>
              <span style={{
                color: hasCompletedExpectation ? '#059669' : '#DC2626',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                {hasCompletedExpectation ? '✔ Recorded & Verified' : '💬 Awaiting Input'}
              </span>
            </div>
          </div>

          {/* Enter Expectation Button */}
          <button
            onClick={onNavigateToExpectation}
            className="btn-primary"
            style={{
              width: '100%',
              padding: '14px',
              fontSize: '15px'
            }}
          >
            <span>{hasCompletedExpectation ? 'View / Update Expectation' : 'Enter Expectation'}</span>
            <ArrowRight size={18} />
          </button>
        </div>

        {/* CARD 2: STAGE 02 Feedback */}
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '20px',
          padding: '32px 28px',
          border: `1.5px solid ${hasCompletedExpectation ? '#2563EB' : '#E2E8F0'}`,
          boxShadow: hasCompletedExpectation 
            ? '0 12px 30px -5px rgba(37, 99, 235, 0.12)' 
            : '0 4px 20px -2px rgba(15, 23, 42, 0.03)',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          opacity: hasCompletedExpectation ? 1 : 0.85
        }}>
          {/* Header Row */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '20px'
          }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              backgroundColor: hasCompletedExpectation ? '#EFF6FF' : '#F1F5F9',
              color: hasCompletedExpectation ? '#2563EB' : '#94A3B8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid #E2E8F0'
            }}>
              {hasCompletedExpectation ? <Unlock size={24} /> : <Lock size={24} />}
            </div>

            <div style={{
              padding: '4px 12px',
              borderRadius: '999px',
              backgroundColor: hasCompletedExpectation ? '#DCFCE7' : '#F1F5F9',
              color: hasCompletedExpectation ? '#15803D' : '#64748B',
              fontSize: '12px',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              {hasCompletedExpectation ? (
                <>
                  <CheckCircle2 size={13} color="#15803D" />
                  <span>Module Unlocked</span>
                </>
              ) : (
                <>
                  <Lock size={13} color="#64748B" />
                  <span>Access Restricted</span>
                </>
              )}
            </div>
          </div>

          <div style={{
            fontSize: '11px',
            fontWeight: 800,
            color: '#64748B',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            marginBottom: '4px'
          }}>
            Stage 02
          </div>

          <h3 style={{
            fontSize: '24px',
            fontWeight: 800,
            color: hasCompletedExpectation ? '#0F172A' : '#94A3B8',
            letterSpacing: '-0.02em',
            marginBottom: '10px'
          }}>
            Feedback
          </h3>

          <p style={{
            fontSize: '14.5px',
            color: '#64748B',
            lineHeight: 1.5,
            marginBottom: '24px',
            flexGrow: 1
          }}>
            Evaluate training quality, facilitation effectiveness, and submit post-training accountability and learning outcome feedback.
          </p>

          {/* Callout Notice */}
          <div style={{
            backgroundColor: hasCompletedExpectation ? '#F0FDF4' : '#EFF6FF',
            borderRadius: '12px',
            padding: '14px 16px',
            border: `1px solid ${hasCompletedExpectation ? '#BBF7D0' : '#DBEAFE'}`,
            marginBottom: '24px',
            fontSize: '12.5px',
            color: hasCompletedExpectation ? '#166534' : '#1E40AF',
            lineHeight: 1.45,
            display: 'flex',
            alignItems: 'flex-start',
            gap: '10px'
          }}>
            {hasCompletedExpectation ? (
              <CheckCircle2 size={16} color="#16a34a" style={{ flexShrink: 0, marginTop: '2px' }} />
            ) : (
              <AlertCircle size={16} color="#2563EB" style={{ flexShrink: 0, marginTop: '2px' }} />
            )}
            <span>
              {hasCompletedExpectation 
                ? 'Your training expectation is registered. You can now submit your post-training evaluation feedback.'
                : 'Locked — You must complete and submit your personal expectation record first to unlock this post-training evaluation module.'}
            </span>
          </div>

          {/* Feedback Button */}
          {hasCompletedExpectation ? (
            <button
              onClick={onNavigateToFeedback}
              className="btn-primary"
              style={{
                width: '100%',
                padding: '14px',
                fontSize: '15px'
              }}
            >
              <span>{hasFeedback ? 'View / Update Feedback' : 'Enter Feedback'}</span>
              <ArrowRight size={18} />
            </button>
          ) : (
            <button
              disabled={true}
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: '12px',
                backgroundColor: '#CBD5E1',
                color: '#64748B',
                border: 'none',
                fontWeight: 600,
                fontSize: '14.5px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                cursor: 'not-allowed'
              }}
            >
              <Lock size={16} />
              <span>Share Feedback (Locked)</span>
            </button>
          )}
        </div>
      </div>

      {/* Bottom Need Assistance Card */}
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '16px',
        padding: '20px 24px',
        border: '1px solid #E2E8F0',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '20px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.02)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '10px',
            backgroundColor: '#CCFBF1',
            color: '#0D9488',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <HelpCircle size={22} />
          </div>
          <div>
            <h4 style={{ fontSize: '15px', fontWeight: 700, color: '#0F172A' }}>
              Need Assistance With Your Training Registration?
            </h4>
            <p style={{ fontSize: '13px', color: '#64748B' }}>
              The Training Coordinator liaison desk is available at Station B or dial ext. 4022.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={onOpenProtocolGuide}
            style={{
              padding: '9px 16px',
              borderRadius: '8px',
              border: '1px solid #E2E8F0',
              backgroundColor: '#FFFFFF',
              color: '#1E3A8A',
              fontWeight: 600,
              fontSize: '13.5px',
              cursor: 'pointer'
            }}
          >
            View Training Guide
          </button>
          <button
            onClick={onOpenAssistance}
            style={{
              padding: '9px 16px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: '#EFF6FF',
              color: '#1E40AF',
              fontWeight: 600,
              fontSize: '13.5px',
              cursor: 'pointer'
            }}
          >
            Inquire Assistance
          </button>
        </div>
      </div>
    </div>
  );
}
