import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Building, 
  Clock, 
  ArrowRight, 
  Lock, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle,
  FileText
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { api } from '../api.js';

export default function ExpectationView({ 
  user, 
  onSuccess, 
  onOpenGuidelines,
  onBackToPathway 
}) {
  const [expectationText, setExpectationText] = useState('');
  const [sessionId, setSessionId] = useState('#CK-89410');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [submittedExpectation, setSubmittedExpectation] = useState(null);
  const [loading, setLoading] = useState(true);

  const characterLimit = 500;

  // Prompt tags from design
  const promptTags = [
    '+ Wait time <15m',
    '+ Clear diagnostic steps',
    '+ Transparent prescription costs'
  ];

  useEffect(() => {
    loadExistingExpectation();
  }, []);

  async function loadExistingExpectation() {
    try {
      setLoading(true);
      const res = await api.getExpectationForFeedback().catch(() => null);
      if (res && res.data) {
        setSubmittedExpectation(res.data);
        setExpectationText(res.data.expectationText || '');
        if (res.data.sessionId) {
          setSessionId(res.data.sessionId);
        }
      }
    } catch (err) {
      console.log('No previous expectation found');
    } finally {
      setLoading(false);
    }
  }

  const handleTagClick = (tag) => {
    const textToAdd = tag.replace('+', '').trim();
    setExpectationText(prev => {
      if (!prev.trim()) {
        return textToAdd;
      }
      return `${prev}, ${textToAdd}`;
    });
    setErrorMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!expectationText.trim()) {
      setErrorMessage('Please enter your expectation before submitting.');
      return;
    }

    if (expectationText.trim().length < 5) {
      setErrorMessage('Expectation must be at least 5 characters long');
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await api.submitExpectation(expectationText);
      if (res.success) {
        // Trigger celebratory confetti
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
        setSubmittedExpectation(res.data);
        setTimeout(() => {
          onSuccess();
        }, 1200);
      }
    } catch (err) {
      console.error('Failed to submit expectation:', err);
      setErrorMessage(err.message || 'Unable to submit expectation. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const participantName = user ? `${user.firstName} ${user.lastName}` : 'Eleanor Vance';
  const participantRef = user ? `#EV-${user.id ? user.id.slice(0, 3).toUpperCase() : '772'}` : '#EV-772';
  const facilityName = user?.facilityName || 'St. Jude Metropolitan Health';

  return (
    <div className="careecho-background" style={{
      minHeight: 'calc(100vh - 70px)',
      padding: '32px 20px 60px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }}>
      {/* CareEcho Protocol Sub-bar */}
      <div style={{
        width: '100%',
        maxWidth: '780px',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 16px',
        backgroundColor: '#FFFFFF',
        borderRadius: '12px',
        border: '1px solid #E2E8F0',
        marginBottom: '28px',
        fontSize: '13px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#1E293B', fontWeight: 600 }}>
          <Shield size={16} color="#0D9488" />
          <span>CareEcho Intake Protocol</span>
          <span style={{ color: '#94A3B8' }}>/</span>
          <span style={{ color: '#1E3A8A', fontWeight: 700 }}>Stage 01: Pre-Consultation</span>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '4px 12px',
          borderRadius: '999px',
          backgroundColor: '#E0F2FE',
          color: '#0369A1',
          fontSize: '12px',
          fontWeight: 700
        }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#0284C7' }} />
          <span>Session ID: {sessionId}</span>
        </div>
      </div>

      {/* Main Heading & Subtitle */}
      <div style={{ textAlign: 'center', marginBottom: '28px' }}>
        <h1 style={{
          fontSize: '34px',
          fontWeight: 800,
          color: '#1E3A8A',
          letterSpacing: '-0.02em',
          textTransform: 'uppercase',
          marginBottom: '8px'
        }}>
          Expectation Page
        </h1>
        <p style={{
          fontSize: '14.5px',
          color: '#64748B',
          maxWidth: '640px',
          lineHeight: 1.5
        }}>
          Document your standards and desired outcomes prior to consultation. Your feedback audit trail begins here.
        </p>
      </div>

      {/* Expectation Card */}
      <div style={{
        width: '100%',
        maxWidth: '780px',
        backgroundColor: '#FFFFFF',
        borderRadius: '24px',
        padding: '32px 32px',
        boxShadow: '0 20px 40px -15px rgba(15, 23, 42, 0.08), 0 0 1px 1px rgba(226, 232, 240, 0.8)',
        border: '1px solid #E2E8F0',
        marginBottom: '20px'
      }}>
        {/* Hospital & Participant Info Box */}
        <div style={{
          backgroundColor: '#EFF6FF',
          borderRadius: '16px',
          padding: '16px 20px',
          border: '1px solid #DBEAFE',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          marginBottom: '28px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '10px',
              backgroundColor: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#1E3A8A',
              boxShadow: '0 2px 6px rgba(30, 58, 138, 0.1)'
            }}>
              <Building size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: '15.5px', fontWeight: 800, color: '#0F172A' }}>
                {facilityName}
              </h3>
              <p style={{ fontSize: '13px', color: '#475569' }}>
                Participant: <strong style={{ color: '#0F172A' }}>{participantName}</strong> (Ref: {participantRef})
              </p>
            </div>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '12.5px',
            color: '#64748B',
            fontWeight: 500
          }}>
            <Clock size={15} color="#0284C7" />
            <span>Date Recorded: <strong>Oct 24, 2026</strong> (Auto)</span>
          </div>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div style={{
            padding: '12px 16px',
            backgroundColor: '#FEE2E2',
            border: '1px solid #FCA5A5',
            borderRadius: '10px',
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

        {/* Form Body */}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '16px' }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '8px'
            }}>
              <label style={{
                fontSize: '15px',
                fontWeight: 700,
                color: '#0F172A'
              }}>
                Write your expectation
              </label>
              <span style={{
                fontSize: '12.5px',
                color: expectationText.length > characterLimit ? '#DC2626' : '#64748B',
                fontWeight: 600
              }}>
                {expectationText.length} / {characterLimit} characters
              </span>
            </div>

            <textarea
              rows={6}
              value={expectationText}
              onChange={(e) => {
                setExpectationText(e.target.value);
                if (errorMessage) setErrorMessage('');
              }}
              placeholder="Describe what you expect from your visit, treatment, or facility service today..."
              maxLength={characterLimit}
              style={{
                width: '100%',
                padding: '16px',
                borderRadius: '12px',
                border: '1.5px solid #E2E8F0',
                fontSize: '14.5px',
                color: '#0F172A',
                lineHeight: 1.6,
                fontFamily: 'inherit',
                resize: 'vertical',
                backgroundColor: '#FFFFFF'
              }}
            />
          </div>

          {/* Prompt Tags from Screenshot 3 */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            gap: '10px',
            marginBottom: '28px'
          }}>
            <span style={{ fontSize: '12.5px', color: '#64748B', fontWeight: 600 }}>Prompt tags:</span>
            {promptTags.map((tag, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleTagClick(tag)}
                style={{
                  padding: '6px 14px',
                  borderRadius: '999px',
                  border: '1px solid #DBEAFE',
                  backgroundColor: '#EFF6FF',
                  color: '#1E40AF',
                  fontSize: '12.5px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#DBEAFE';
                  e.currentTarget.style.borderColor = '#93C5FD';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#EFF6FF';
                  e.currentTarget.style.borderColor = '#DBEAFE';
                }}
              >
                <span>{tag}</span>
              </button>
            ))}
          </div>

          {/* Submit Action Button */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary"
              style={{
                padding: '14px 44px',
                fontSize: '15.5px',
                fontWeight: 800,
                letterSpacing: '0.04em',
                minWidth: '220px'
              }}
            >
              {isSubmitting ? 'Recording...' : (
                <>
                  <span>SUBMIT</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </div>

          {/* Security & Lock Disclaimer from Screenshot 3 */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            fontSize: '12.5px',
            color: '#64748B',
            textAlign: 'center',
            lineHeight: 1.45,
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            <Lock size={15} color="#0D9488" style={{ flexShrink: 0 }} />
            <span>
              Once submitted, your expectation will be locked and stored, and your post-visit <strong style={{ color: '#0F172A' }}>Feedback form</strong> will be unlocked on your dashboard.
            </span>
          </div>
        </form>
      </div>

      {/* Guidelines Bottom Notice from Screenshot 3 */}
      <div style={{
        width: '100%',
        maxWidth: '780px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 20px',
        backgroundColor: '#EFF6FF',
        borderRadius: '12px',
        border: '1px solid #DBEAFE',
        fontSize: '13px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#1E40AF', fontWeight: 600 }}>
          <Shield size={16} color="#2563EB" />
          <span>Protected under Patient Charter • Standard Operating Record v4.2</span>
        </div>

        <button
          onClick={onOpenGuidelines}
          style={{
            background: 'none',
            border: 'none',
            color: '#1E3A8A',
            fontWeight: 700,
            fontSize: '13px',
            cursor: 'pointer',
            textDecoration: 'none'
          }}
          onMouseEnter={(e) => e.target.style.textDecoration = 'underline'}
          onMouseLeave={(e) => e.target.style.textDecoration = 'none'}
        >
          Guidelines
        </button>
      </div>
    </div>
  );
}
