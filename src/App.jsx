import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { WellnessProvider, useWellness } from './context/WellnessContext';
import { MealProvider } from './context/MealContext';
import { NotificationProvider } from './context/NotificationContext';

// Layout & Common
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { PageContainer } from './components/layout/PageContainer';
import { SafetyBanner } from './components/common/SafetyBanner';
import { ExplainModal } from './components/explainability/ExplainModal';

// Features
import { LandingPage } from './features/landing/LandingPage';
import { SignIn } from './features/auth/SignIn';
import { SignUp, ForgotPassword } from './features/auth/SignUp';
import { OnboardingFlow } from './features/onboarding/OnboardingFlow';
import { Dashboard } from './features/dashboard/Dashboard';
import { DailyAssessmentModal } from './features/assessments/DailyAssessmentModal';
import { MealPlannerPage } from './features/meals/MealPlannerPage';
import { SmartGroceryPage } from './features/grocery/SmartGroceryPage';
import { AIAssistantPage } from './features/assistant/AIAssistantPage';
import { WellnessAnalyticsPage } from './features/analytics/WellnessAnalyticsPage';
import { WeeklySummaryPage } from './features/summary/WeeklySummaryPage';
import { TrustedContactsPage } from './features/contacts/TrustedContactsPage';
import { NotificationsPage } from './features/notifications/NotificationsPage';
import { HistoryPage } from './features/history/HistoryPage';
import { ProfilePage } from './features/profile/ProfilePage';

function AppContent() {
  const { currentUser, userProfile, loading } = useAuth();
  const { explainItem, setExplainItem } = useWellness();

  const [activePage, setActivePage] = useState('dashboard');
  const [showAssessmentModal, setShowAssessmentModal] = useState(false);
  const [emergencyAlert, setEmergencyAlert] = useState(null);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white font-extrabold text-xl flex items-center justify-center shadow-lg shadow-emerald-600/30 mx-auto animate-pulse">
            IW
          </div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest">
            Loading IntelWell...
          </p>
        </div>
      </div>
    );
  }

  // Not logged in routing
  if (!currentUser) {
    if (activePage === 'signin') {
      return (
        <div className="min-h-screen flex flex-col bg-slate-50">
          <SafetyBanner emergencyAlert={emergencyAlert} onDismissEmergency={() => setEmergencyAlert(null)} />
          <SignIn
            onNavigateToSignUp={() => setActivePage('signup')}
            onNavigateToForgot={() => setActivePage('forgot')}
            onLoginSuccess={() => setActivePage('dashboard')}
          />
          <Footer onNavigate={(page) => setActivePage(page)} />
        </div>
      );
    }
    if (activePage === 'signup') {
      return (
        <div className="min-h-screen flex flex-col bg-slate-50">
          <SafetyBanner emergencyAlert={emergencyAlert} onDismissEmergency={() => setEmergencyAlert(null)} />
          <SignUp
            onNavigateToSignIn={() => setActivePage('signin')}
            onSignUpSuccess={() => setActivePage('onboarding')}
          />
          <Footer onNavigate={(page) => setActivePage(page)} />
        </div>
      );
    }
    if (activePage === 'forgot') {
      return (
        <div className="min-h-screen flex flex-col bg-slate-50">
          <SafetyBanner emergencyAlert={emergencyAlert} onDismissEmergency={() => setEmergencyAlert(null)} />
          <ForgotPassword onNavigateToSignIn={() => setActivePage('signin')} />
          <Footer onNavigate={(page) => setActivePage(page)} />
        </div>
      );
    }

    // Default: Landing Page
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <SafetyBanner emergencyAlert={emergencyAlert} onDismissEmergency={() => setEmergencyAlert(null)} />
        <LandingPage
          onGetStarted={() => setActivePage('signup')}
          onSignIn={() => setActivePage('signin')}
        />
        <Footer onNavigate={(page) => setActivePage(page)} />
      </div>
    );
  }

  // Onboarding flow if user profile is not completed
  if (activePage === 'onboarding' || !userProfile?.onboardingCompleted) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <SafetyBanner emergencyAlert={emergencyAlert} onDismissEmergency={() => setEmergencyAlert(null)} />
        <OnboardingFlow onComplete={() => setActivePage('dashboard')} />
        <Footer onNavigate={(page) => setActivePage(page)} />
      </div>
    );
  }

  // Authenticated Portal
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <SafetyBanner emergencyAlert={emergencyAlert} onDismissEmergency={() => setEmergencyAlert(null)} />
      <Navbar
        activePage={activePage}
        onNavigate={(page) => setActivePage(page)}
        onOpenDailyAssessment={() => setShowAssessmentModal(true)}
      />

      <PageContainer maxWidth="max-w-7xl">
        {activePage === 'dashboard' && (
          <Dashboard
            onOpenAssessment={() => setShowAssessmentModal(true)}
            onNavigate={(page) => setActivePage(page)}
          />
        )}
        {activePage === 'meals' && <MealPlannerPage />}
        {activePage === 'grocery' && (
          <SmartGroceryPage onNavigateToMeals={() => setActivePage('meals')} />
        )}
        {activePage === 'assistant' && <AIAssistantPage />}
        {activePage === 'analytics' && <WellnessAnalyticsPage />}
        {activePage === 'summary' && <WeeklySummaryPage />}
        {activePage === 'contacts' && <TrustedContactsPage />}
        {activePage === 'notifications' && <NotificationsPage />}
        {activePage === 'history' && <HistoryPage />}
        {activePage === 'profile' && (
          <ProfilePage onSignOut={() => setActivePage('landing')} />
        )}
      </PageContainer>

      <Footer onNavigate={(page) => setActivePage(page)} />

      {/* Global "Why am I seeing this?" Explainability Modal */}
      <ExplainModal
        isOpen={Boolean(explainItem)}
        onClose={() => setExplainItem(null)}
        item={explainItem}
      />

      {/* Global Daily Wellness Assessment Modal */}
      <DailyAssessmentModal
        isOpen={showAssessmentModal}
        onClose={() => setShowAssessmentModal(false)}
        onAssessmentSaved={() => setShowAssessmentModal(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <WellnessProvider>
        <MealProvider>
          <NotificationProvider>
            <AppContent />
          </NotificationProvider>
        </MealProvider>
      </WellnessProvider>
    </AuthProvider>
  );
}
