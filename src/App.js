import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { AppProvider } from "./context/AppContext";
import AuthGuard from "./components/auth/AuthGuard";
import LandingPage from "./pages/LandingPage";
import AuthPage from "./pages/AuthPage";
import EmailVerificationPage from "./pages/EmailVerificationPage";
import OnboardingPage from "./pages/OnboardingPage";
import UserDashboard from "./pages/user/Dashboard";
import UserProfile from "./pages/user/Profile";
import UserJobs from "./pages/user/Jobs";
import UserTools from "./pages/user/Tools";
import UserSettings from "./pages/user/Settings";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminApplicants from "./pages/admin/Applicants";
import AdminApplications from "./pages/admin/Applications";
import AdminAnalytics from "./pages/admin/Analytics";
import Layout from "./components/layout/Layout";
import PaymentPage from "./pages/PaymentPage";

import "./App.css";

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppProvider>
          <div className="App">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/auth" element={<AuthPage />} />

              {/* Email Verification Route - requires auth but not email verification */}
              <Route
                path="/verify-email"
                element={
                  <AuthGuard requireEmailVerification={false}>
                    <EmailVerificationPage />
                  </AuthGuard>
                }
              />

              {/* Protected User Routes - require email verification */}
              <Route
                path="/onboarding"
                element={
                  <AuthGuard>
                    <OnboardingPage />
                  </AuthGuard>
                }
              />
              <Route
                path="/payment"
                element={
                  <AuthGuard>
                    <PaymentPage />
                  </AuthGuard>
                }
              />

              <Route
                path="/dashboard"
                element={
                  <AuthGuard>
                    <Layout>
                      <UserDashboard />
                    </Layout>
                  </AuthGuard>
                }
              />

              <Route
                path="/profile"
                element={
                  <AuthGuard>
                    <Layout>
                      <UserProfile />
                    </Layout>
                  </AuthGuard>
                }
              />

              <Route
                path="/jobs"
                element={
                  <AuthGuard>
                    <Layout>
                      <UserJobs />
                    </Layout>
                  </AuthGuard>
                }
              />

              <Route
                path="/tools"
                element={
                  <AuthGuard>
                    <Layout>
                      <UserTools />
                    </Layout>
                  </AuthGuard>
                }
              />

              <Route
                path="/settings"
                element={
                  <AuthGuard>
                    <Layout>
                      <UserSettings />
                    </Layout>
                  </AuthGuard>
                }
              />

              {/* Admin Routes - don't require email verification for admin users */}
              <Route
                path="/admin/dashboard"
                element={
                  <AuthGuard adminOnly requireEmailVerification={false}>
                    <Layout isAdmin>
                      <AdminDashboard />
                    </Layout>
                  </AuthGuard>
                }
              />

              <Route
                path="/admin/applicants"
                element={
                  <AuthGuard adminOnly requireEmailVerification={false}>
                    <Layout isAdmin>
                      <AdminApplicants />
                    </Layout>
                  </AuthGuard>
                }
              />

              <Route
                path="/admin/applications"
                element={
                  <AuthGuard adminOnly requireEmailVerification={false}>
                    <Layout isAdmin>
                      <AdminApplications />
                    </Layout>
                  </AuthGuard>
                }
              />

              <Route
                path="/admin/analytics"
                element={
                  <AuthGuard adminOnly requireEmailVerification={false}>
                    <Layout isAdmin>
                      <AdminAnalytics />
                    </Layout>
                  </AuthGuard>
                }
              />

              {/* 404 Route */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </AppProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
