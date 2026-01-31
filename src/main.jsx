import React from 'react';
import { Route, Routes, BrowserRouter as Router, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/contexts/SupabaseAuthContext';
import ScrollToTop from '@/components/ScrollToTop';
import PrivateRoute from '@/components/PrivateRoute';
import LandingPageV4 from '@/pages/LandingPageV4';
import Dashboard from '@/pages/Dashboard';
import AgendaInteligente from '@/pages/AgendaInteligente';
import GestaoLeads from '@/pages/GestaoLeads';
import ConfiguracoesAgente from '@/pages/ConfiguracoesAgente';
import WebhookIntegration from '@/pages/WebhookIntegration';

// Auth Pages
import LoginPage from '@/pages/LoginPage';
import SignupPage from '@/pages/SignupPage';
import ForgotPasswordPage from '@/pages/ForgotPasswordPage';
import ResetPasswordPage from '@/pages/ResetPasswordPage';

function AppRoutes() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        {/* Public Routes - Main Landing Page is now V4 */}
        <Route path="/" element={<LandingPageV4 />} />
        
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        
        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/agenda"
          element={
            <PrivateRoute>
              <AgendaInteligente />
            </PrivateRoute>
          }
        />
        <Route
          path="/leads"
          element={
            <PrivateRoute>
              <GestaoLeads />
            </PrivateRoute>
          }
        />
        <Route
          path="/configuracoes"
          element={
            <PrivateRoute>
              <ConfiguracoesAgente />
            </PrivateRoute>
          }
        />
        <Route
          path="/webhook"
          element={
            <PrivateRoute>
              <WebhookIntegration />
            </PrivateRoute>
          }
        />
        
        {/* Catch all redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;
