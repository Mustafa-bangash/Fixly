import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import socket from './services/socket';
import PublicLayout from './layouts/PublicLayout.jsx';

// Public & Landing Pages
import LandingPage from './pages/LandingPage.jsx';
import HowItWorksPage from './pages/HowItWorksPage.jsx';
import TermsAndConditionsPage from './pages/TermsAndConditionsPage.jsx';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage.jsx';

// Authentication Pages
import SignUpPage from './pages/auth/SignUpPage.jsx';
import VerifyEmailPage from './pages/auth/VerifyEmailPage.jsx';
import SignInPage from './pages/auth/SignInPage.jsx';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage.jsx';

// Customer Portal Pages
import CustomerDashboardPage from './pages/customer/CustomerDashboardPage.jsx';
import CustomerRequestsPage from './pages/customer/CustomerRequestsPage.jsx';
import CustomerMessagesPage from './pages/customer/CustomerMessagesPage.jsx';
import CustomerHistoryPage from './pages/customer/CustomerHistoryPage.jsx';
import EmergencyPage from './pages/customer/EmergencyPage.jsx';
import CustomerProfilePage from './pages/customer/CustomerProfilePage.jsx';

import { ROUTES } from './utils/routes.js';
import { useDispatch } from 'react-redux';
import {
  setUser,
  clearUser,
  setAuthInitialized,
} from './store/authSlice.js';
import { getCurrentUser } from './api/authApi.js';
import CustomerOnlyRoute from './components/common/CustomerOnlyRoute.jsx';
import CreateRepairRequestPage from './pages/repair-requests/CreateRepairRequestPage.jsx';

export default function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    let cancelled = false;

    async function restoreAuthentication() {
      try {
        const result = await getCurrentUser();

        if (!cancelled) {
          dispatch(setUser(result.user));
        }
      } catch {
        if (!cancelled) {
          dispatch(clearUser());
        }
      } finally {
        if (!cancelled) {
          dispatch(setAuthInitialized(true));
        }
      }
    }

    restoreAuthentication();

    return () => {
      cancelled = true;
    };
  }, [dispatch]);

  useEffect(() => {
    const handleConnect = () => {
      console.log('Socket connected:', socket.id);
    };

    const handleDisconnect = () => {
      console.log('Socket disconnected');
    };

    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);

    return () => {
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
    };
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicLayout />}>
          {/* Public Pages */}
          <Route path={ROUTES.home} element={<LandingPage />} />
          <Route path={ROUTES.how} element={<HowItWorksPage />} />
          <Route path={ROUTES.terms} element={<TermsAndConditionsPage />} />
          <Route path="/info/terms-and-conditions" element={<TermsAndConditionsPage />} />
          <Route path={ROUTES.privacy} element={<PrivacyPolicyPage />} />
          <Route path="/info/privacy-policy" element={<PrivacyPolicyPage />} />

          {/* Customer Portal Pages */}
          <Route path={ROUTES.dashboard} element={<CustomerDashboardPage />} />
          <Route path={ROUTES.requests} element={<CustomerRequestsPage />} />
          <Route path={ROUTES.messages} element={<CustomerMessagesPage />} />
          <Route path={ROUTES.history} element={<CustomerHistoryPage />} />
          <Route path={ROUTES.emergency} element={<EmergencyPage />} />
          <Route path={ROUTES.profile} element={<CustomerProfilePage />} />

          {/* Customer Authentication Routes */}
          <Route path={ROUTES.signup} element={<SignUpPage role="customer" />} />
          <Route path={ROUTES.login} element={<SignInPage role="customer" />} />

          {/* Provider Authentication Routes */}
          <Route path={ROUTES.providerSignup} element={<SignUpPage role="provider" />} />
          <Route path={ROUTES.providerLogin} element={<SignInPage role="provider" />} />

          {/* Shared Verification & Password Reset */}
          <Route path={ROUTES.verifyEmail} element={<VerifyEmailPage />} />
          <Route path={ROUTES.forgotPassword} element={<ForgotPasswordPage />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to={ROUTES.home} replace />} />

          <Route element={<CustomerOnlyRoute />}>
            <Route
              path={ROUTES.createRepairRequest}
              element={<CreateRepairRequestPage />}
            />
          </Route>

        </Route>
      </Routes>
    </BrowserRouter>
  );
}