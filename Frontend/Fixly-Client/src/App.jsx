import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import socket from './services/socket';
import PublicLayout from './layouts/PublicLayout.jsx';
import LandingPage from './pages/LandingPage.jsx';
import SignUpPage from './pages/auth/SignUpPage.jsx';
import VerifyEmailPage from './pages/auth/VerifyEmailPage.jsx';
import SignInPage from './pages/auth/SignInPage.jsx';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage.jsx';
import HowItWorksPage from './pages/HowItWorksPage.jsx';
import { ROUTES } from './utils/routes.js';

export default function App() {
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
          {/* Landing and Public Pages */}
          <Route path={ROUTES.home} element={<LandingPage />} />
          <Route path={ROUTES.how} element={<HowItWorksPage />} />

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
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
