import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Lock, 
  Building, 
  ArrowRight, 
  FileDown, 
  AlertCircle,
  HelpCircle,
  Sparkles,
  ScrollText,
  Download,
  GraduationCap
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { api } from '../api.js';

export default function FeedbackView({ 
  user, 
  onSuccess, 
  onOpenOmbudsman, 
  onBackToPathway,
  onOpenExpectation 
}) {
  const [expectationData, setExpectationData] = useState(null);
  const [expectationMet, setExpectationMet] = useState(false); // Default 'No' selected as in screenshot 4 or null
  const [hasSelectedOption, setHasSelectedOption] = useState(true);
  const [feedbackText, setFeedbackText] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [submittedFeedback, setSubmittedFeedback] = useState(null);
  const [loading, setLoading] = useState(true);

  const characterLimit = 800;

  // Training common topics
  const commonTopics = [
    'Training duration too short',
    'Facilitation pacing',
    'Practical hands-on gaps',
    'Training materials & logistics'
  ];

  useEffect(() => {
    loadExpectationForFeedback();
  }, []);

  async function loadExpectationForFeedback() {
    try {
      setLoading(true);
      const res = await api.getExpectationForFeedback();
      if (res && res.data) {
        setExpectationData(res.data);
        if (res.data.existingFeedback) {
          setExpectationMet(res.data.existingFeedback.expectationMet);
          setFeedbackText(res.data.existingFeedback.feedbackText || '');
          setSelectedTags(res.data.existingFeedback.tags || []);
          setSubmittedFeedback(res.data.existingFeedback);
        }
      }
    } catch (err) {
      console.error('Failed to load expectation for feedback:', err);
      // Fallback baseline training expectation
      setExpectationData({
        sessionId: '#TR-9842',
        expectationText: 'I expect the training to improve my understanding of digital health tools, clear clinical protocols, and hands-on case management.',
        submittedAt: new Date().toISOString(),
        facilityWard: 'Clinical Training Division'
      });
    } finally {
      setLoading(false);
    }
  }

  const handleToggleTag = (topic) => {
    if (selectedTags.includes(topic)) {
      setSelectedTags(selectedTags.filter(t => t !== topic));
    } else {
      setSelectedTags([...selectedTags, topic]);
      if (!feedbackText.includes(topic)) {
        setFeedbackText(prev => prev ? `${prev} Issue observed: ${topic}.` : `Issue observed: ${topic}.`);
      }
    }
    setErrorMessage('');
  };

  const handleSelectOption = (isMet) => {
    setExpectationMet(isMet);
    setHasSelectedOption(true);
    setErrorMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (expectationMet === null || expectationMet === undefined) {
      setErrorMessage('Please indicate whether your expectation was met.');
      return;
    }

    // Strict Conditional Business Rule check:
    // If expectationMet === false, feedbackText is REQUIRED!
    if (expectationMet === false && (!feedbackText || !feedbackText.trim())) {
      setErrorMessage('Please provide feedback explaining why your expectation was not met.');
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await api.submitFeedback({
        expectationMet,
        feedbackText: feedbackText.trim() || null,
        tags: selectedTags
      });

      if (res.success) {
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.6 }
        });
        setSubmittedFeedback(res.data);
        setTimeout(() => {
          onSuccess();
        }, 1200);
      }
    } catch (err) {
      console.error('Failed to submit feedback:', err);
      setErrorMessage(err.message || 'Failed to submit feedback. Please check your inputs.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDownloadPDF = () => {
    window.print();
  };

  const baselineText = expectationData?.expectationText || 
    'I expect the training to improve my understanding of digital health tools, clear clinical protocols, and hands-on case management.';

  const visitId = expectationData?.sessionId || '#TR-9842';
  const wardName = expectationData?.facilityWard || 'Clinical Training Division';

  return (
    <div className="careecho-background" style={{
      minHeight: 'calc(100vh - 70px)',
      padding: '32px 20px 60px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }}>
      {/* Top Protocol Status Pill */}
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#0D9488', fontWeight: 700 }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#0D9488', display: 'inline-block' }} />
          <span>TRAINING QUALITY ASSESSMENT</span>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '4px 12px',
          borderRadius: '999px',
          backgroundColor: '#F1F5F9',
          color: '#334155',
          fontSize: '12px',
          fontWeight: 700,
          border: '1px solid #E2E8F0'
        }}>
          <Shield size={14} color="#0284C7" />
          <span>Verified Training ID • {visitId}</span>
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
          Institutional training feedback reconciliation. Compare your initial baseline expectation against the training received today.
        </p>
      </div>

      {/* Center Feedback Card */}
      <div style={{
        width: '100%',
        maxWidth: '780px',
        backgroundColor: '#FFFFFF',
        borderRadius: '24px',
        padding: '32px 32px',
        boxShadow: '0 20px 40px -15px rgba(15, 23, 42, 0.08), 0 0 1px 1px rgba(226, 232, 240, 0.8)',
        border: '1px solid #E2E8F0',
        marginBottom: '24px'
      }}>
        {/* Top Submitted Expectation Box */}
        <div style={{
          backgroundColor: '#F0F7FF',
          borderRadius: '16px',
          padding: '20px 24px',
          border: '1.5px solid #BFDBFE',
          borderLeft: '5px solid #2563EB',
          marginBottom: '32px'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '10px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '15px', fontWeight: 800, color: '#0F172A' }}>
                Submitted Expectation
              </span>
              <ScrollText size={16} color="#1E3A8A" />
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '12px',
              color: '#64748B',
              fontWeight: 500
            }}>
              <Clock size={13} color="#2563EB" />
              <span>Documented on Oct 24, 2026 at 09:30 AM</span>
            </div>
          </div>

          <p style={{
            fontSize: '14.5px',
            color: '#1E293B',
            fontStyle: 'italic',
            lineHeight: 1.55,
            marginBottom: '14px'
          }}>
            "{baselineText}"
          </p>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderTop: '1px solid #DBEAFE',
            paddingTop: '10px',
            fontSize: '12px'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              color: '#0D9488',
              fontWeight: 700
            }}>
              <Lock size={13} />
              <span>Intake Encrypted • Tamper-Evident Record</span>
            </div>

            <span style={{
              color: '#1E40AF',
              fontWeight: 700,
              backgroundColor: '#EFF6FF',
              padding: '2px 8px',
              borderRadius: '6px'
            }}>
              {wardName}
            </span>
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
            marginBottom: '24px'
          }}>
            <AlertCircle size={18} />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Question 1: Was all your expectation(s) met? */}
        <div style={{ marginBottom: '32px' }}>
          <h3 style={{
            fontSize: '17px',
            fontWeight: 800,
            color: '#0F172A',
            marginBottom: '4px'
          }}>
            Was all your expectation(s) met?
          </h3>
          <p style={{
            fontSize: '13px',
            color: '#64748B',
            marginBottom: '16px'
          }}>
            Select an assessment to calibrate institutional training metrics.
          </p>

          {/* Two Large Radio Option Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '16px'
          }}>
            {/* YES Option */}
            <div
              onClick={() => handleSelectOption(true)}
              style={{
                borderRadius: '14px',
                padding: '18px 20px',
                border: `2px solid ${expectationMet === true ? '#2563EB' : '#E2E8F0'}`,
                backgroundColor: expectationMet === true ? '#EFF6FF' : '#FFFFFF',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                transition: 'all 0.2s ease',
                boxShadow: expectationMet === true ? '0 4px 12px rgba(37, 99, 235, 0.12)' : 'none'
              }}
            >
              <div style={{
                width: '22px',
                height: '22px',
                borderRadius: '50%',
                border: `2px solid ${expectationMet === true ? '#2563EB' : '#CBD5E1'}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#FFFFFF',
                flexShrink: 0
              }}>
                {expectationMet === true && (
                  <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#2563EB' }} />
                )}
              </div>
              <div>
                <div style={{ fontSize: '16px', fontWeight: 800, color: '#0F172A' }}>
                  Yes
                </div>
                <div style={{ fontSize: '12.5px', color: '#64748B' }}>
                  Fulfilled or exceeded
                </div>
              </div>
            </div>

            {/* NO Option */}
            <div
              onClick={() => handleSelectOption(false)}
              style={{
                borderRadius: '14px',
                padding: '18px 20px',
                border: `2px solid ${expectationMet === false ? '#1E3A8A' : '#E2E8F0'}`,
                backgroundColor: expectationMet === false ? '#EFF6FF' : '#FFFFFF',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                transition: 'all 0.2s ease',
                boxShadow: expectationMet === false ? '0 4px 12px rgba(30, 58, 138, 0.15)' : 'none'
              }}
            >
              <div style={{
                width: '22px',
                height: '22px',
                borderRadius: '50%',
                border: `2px solid ${expectationMet === false ? '#1E3A8A' : '#CBD5E1'}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#FFFFFF',
                flexShrink: 0
              }}>
                {expectationMet === false && (
                  <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#1E3A8A' }} />
                )}
              </div>
              <div>
                <div style={{ fontSize: '16px', fontWeight: 800, color: '#0F172A' }}>
                  No
                </div>
                <div style={{ fontSize: '12.5px', color: '#64748B' }}>
                  Unmet standards or delays
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Question 2: Conditional Feedback Field */}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '6px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <label style={{
                  fontSize: '15px',
                  fontWeight: 800,
                  color: '#0F172A'
                }}>
                  {expectationMet === false 
                    ? 'What went wrong or could be improved? *' 
                    : 'Additional Comments / Positive Remarks'}
                </label>
                {expectationMet === false ? (
                  <span style={{
                    fontSize: '11px',
                    fontWeight: 800,
                    padding: '2px 8px',
                    borderRadius: '6px',
                    backgroundColor: '#FEE2E2',
                    color: '#DC2626'
                  }}>
                    REQUIRED
                  </span>
                ) : (
                  <span style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: '6px',
                    backgroundColor: '#F1F5F9',
                    color: '#64748B'
                  }}>
                    OPTIONAL
                  </span>
                )}
              </div>

              <span style={{
                fontSize: '12px',
                color: feedbackText.length > characterLimit ? '#DC2626' : '#64748B',
                fontWeight: 600
              }}>
                {feedbackText.length} / {characterLimit} characters
              </span>
            </div>

            <p style={{
              fontSize: '13px',
              color: '#64748B',
              marginBottom: '12px'
            }}>
              {expectationMet === false 
                ? 'Please let us know what happened so we can address your concerns.' 
                : 'Share any standout facilitation or areas of excellence (optional).'}
            </p>

            <textarea
              rows={5}
              value={feedbackText}
              onChange={(e) => {
                setFeedbackText(e.target.value);
                if (errorMessage) setErrorMessage('');
              }}
              placeholder={expectationMet === false 
                ? 'Please describe specifically what went wrong or how your service experience diverged from expectations...' 
                : 'Share your remarks or leave blank to complete...'}
              maxLength={characterLimit}
              style={{
                width: '100%',
                padding: '16px',
                borderRadius: '12px',
                border: `1.5px solid ${expectationMet === false && !feedbackText.trim() && errorMessage ? '#EF4444' : '#E2E8F0'}`,
                fontSize: '14.5px',
                color: '#0F172A',
                lineHeight: 1.6,
                fontFamily: 'inherit',
                resize: 'vertical',
                backgroundColor: '#FFFFFF'
              }}
            />
          </div>

          {/* Common Topics Chips */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            gap: '10px',
            marginBottom: '32px'
          }}>
            <span style={{ fontSize: '12.5px', color: '#64748B', fontWeight: 600 }}>Common topics:</span>
            {commonTopics.map((topic, idx) => {
              const isSelected = selectedTags.includes(topic);
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleToggleTag(topic)}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '999px',
                    border: `1px solid ${isSelected ? '#2563EB' : '#DBEAFE'}`,
                    backgroundColor: isSelected ? '#EFF6FF' : '#F8FAFC',
                    color: isSelected ? '#1E3A8A' : '#334155',
                    fontSize: '12.5px',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  {isSelected ? `✔ ${topic}` : topic}
                </button>
              );
            })}
          </div>

          {/* Action Submit Button */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '28px' }}>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary"
              style={{
                padding: '14px 48px',
                fontSize: '15.5px',
                fontWeight: 800,
                letterSpacing: '0.04em',
                minWidth: '220px'
              }}
            >
              {isSubmitting ? 'Transmitting...' : (
                <>
                  <span>SUBMIT</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
            <span style={{
              fontSize: '12px',
              color: '#64748B',
              marginTop: '8px',
              fontWeight: 500
            }}>
              Step 2 of 2 • Direct Executive Routing
            </span>
          </div>

          {/* Institutional Safeguard Notice */}
          <div style={{
            backgroundColor: '#EFF6FF',
            borderRadius: '14px',
            padding: '16px 20px',
            border: '1px solid #DBEAFE',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '12px',
            fontSize: '12.5px',
            color: '#1E40AF',
            lineHeight: 1.5
          }}>
            <Shield size={18} color="#2563EB" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <strong style={{ display: 'block', marginBottom: '2px', color: '#1E3A8A' }}>
                Institutional Safeguard Notice
              </strong>
              Your feedback is securely routed to facility administrators for continuous service improvement under the 2026 Civic Accountability Framework. Submissions cannot be altered after transmission.
            </div>
          </div>
        </form>
      </div>

      {/* Network & PDF Actions Bar */}
      <div style={{
        width: '100%',
        maxWidth: '780px',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 18px',
        backgroundColor: '#FFFFFF',
        borderRadius: '12px',
        border: '1px solid #E2E8F0',
        fontSize: '13px',
        color: '#475569'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Building size={16} color="#0D9488" />
          <span style={{ fontWeight: 600 }}>CareEcho Civic Hospital Network • Branch #104 (Metropolitan West)</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <button
            onClick={onOpenOmbudsman}
            style={{
              background: 'none',
              border: 'none',
              color: '#1E3A8A',
              fontWeight: 600,
              fontSize: '13px',
              cursor: 'pointer'
            }}
          >
            Request Ombudsman Review
          </button>
          <span style={{ color: '#CBD5E1' }}>•</span>
          <button
            onClick={handleDownloadPDF}
            style={{
              background: 'none',
              border: 'none',
              color: '#0D9488',
              fontWeight: 700,
              fontSize: '13px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <Download size={14} />
            <span>Download Intake PDF</span>
          </button>
        </div>
      </div>
    </div>
  );
}
