import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import RegistrationView from './views/RegistrationView.jsx';
import ActionPathwayView from './views/ActionPathwayView.jsx';
import ExpectationView from './views/ExpectationView.jsx';
import FeedbackView from './views/FeedbackView.jsx';
import LoginModal from './components/LoginModal.jsx';
import AdminModal from './components/AdminModal.jsx';
import { 
  StatusInquiryModal, 
  ServiceCharterModal, 
  OmbudsmanModal, 
  ProtocolGuideModal 
} from './components/InfoModals.jsx';
import { api } from './api.js';

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [activeView, setActiveView] = useState('register'); // 'register' | 'pathway' | 'expectation' | 'feedback'
  const [loadingInitial, setLoadingInitial] = useState(true);

  // Modal States
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isStatusInquiryOpen, setIsStatusInquiryOpen] = useState(false);
  const [isServiceCharterOpen, setIsServiceCharterOpen] = useState(false);
  const [isOmbudsmanOpen, setIsOmbudsmanOpen] = useState(false);
  const [isProtocolGuideOpen, setIsProtocolGuideOpen] = useState(false);

  // On initial mount, check if token exists and fetch user profile
  useEffect(() => {
    async function checkAuth() {
      const token = api.getToken();
      if (token) {
        try {
          const res = await api.getProfile();
          if (res.data) {
            setCurrentUser(res.data);
            setActiveView('pathway');
          }
        } catch (err) {
          console.warn('Session expired or invalid:', err.message);
          api.setToken(null);
        }
      }
      setLoadingInitial(false);
    }
    checkAuth();
  }, []);

  const handleRegisterSuccess = (user) => {
    setCurrentUser(user);
    setActiveView('pathway');
  };

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    setActiveView('pathway');
  };

  const handleLogout = async () => {
    await api.logout();
    setCurrentUser(null);
    setActiveView('register');
  };

  const handleNavigate = (view) => {
    // If not logged in and attempting to navigate to expectation or feedback, prompt quick login or registration
    if (!currentUser && (view === 'expectation' || view === 'feedback' || view === 'pathway')) {
      setActiveView(view);
      return;
    }
    setActiveView(view);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Top Navbar */}
      <Navbar
        activeView={activeView}
        onNavigate={handleNavigate}
        user={currentUser}
        onLogout={handleLogout}
        onOpenLogin={() => setIsLoginOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenStatusInquiry={() => setIsStatusInquiryOpen(true)}
        onOpenServiceCharter={() => setIsServiceCharterOpen(true)}
      />

      {/* Main View Container */}
      <main style={{ flex: 1 }}>
        {activeView === 'register' && (
          <RegistrationView
            onRegisterSuccess={handleRegisterSuccess}
            onOpenLogin={() => setIsLoginOpen(true)}
            onOpenSupport={() => setIsServiceCharterOpen(true)}
          />
        )}

        {activeView === 'pathway' && (
          <ActionPathwayView
            user={currentUser}
            onNavigateToExpectation={() => setActiveView('expectation')}
            onNavigateToFeedback={() => setActiveView('feedback')}
            onOpenProtocolGuide={() => setIsProtocolGuideOpen(true)}
            onOpenAssistance={() => setIsOmbudsmanOpen(true)}
          />
        )}

        {activeView === 'expectation' && (
          <ExpectationView
            user={currentUser}
            onSuccess={() => setActiveView('pathway')}
            onOpenGuidelines={() => setIsServiceCharterOpen(true)}
            onBackToPathway={() => setActiveView('pathway')}
          />
        )}

        {activeView === 'feedback' && (
          <FeedbackView
            user={currentUser}
            onSuccess={() => setActiveView('pathway')}
            onOpenOmbudsman={() => setIsOmbudsmanOpen(true)}
            onBackToPathway={() => setActiveView('pathway')}
            onOpenExpectation={() => setActiveView('expectation')}
          />
        )}
      </main>

      {/* Global Institutional Footer */}
      <Footer
        onOpenPrivacy={() => setIsServiceCharterOpen(true)}
        onOpenStandards={() => setIsServiceCharterOpen(true)}
        onOpenSupport={() => setIsOmbudsmanOpen(true)}
      />

      {/* Modals */}
      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      <AdminModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
      />

      <StatusInquiryModal
        isOpen={isStatusInquiryOpen}
        onClose={() => setIsStatusInquiryOpen(false)}
        user={currentUser}
      />

      <ServiceCharterModal
        isOpen={isServiceCharterOpen}
        onClose={() => setIsServiceCharterOpen(false)}
      />

      <OmbudsmanModal
        isOpen={isOmbudsmanOpen}
        onClose={() => setIsOmbudsmanOpen(false)}
      />

      <ProtocolGuideModal
        isOpen={isProtocolGuideOpen}
        onClose={() => setIsProtocolGuideOpen(false)}
      />
    </div>
  );
}
