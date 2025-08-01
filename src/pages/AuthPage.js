// src/pages/AuthPage.js
import React, { useState, useEffect } from "react";
import { useSearchParams, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LoginForm from "../components/auth/LoginForm";
import SignupForm from "../components/auth/SignupForm";

const AuthPage = () => {
  const [searchParams] = useSearchParams();
  const [mode, setMode] = useState("login");
  const { isAuthenticated, isLoading, user } = useAuth();

  useEffect(() => {
    const modeParam = searchParams.get("mode");

    // Support multiple mode parameters
    if (modeParam === "signup" || modeParam === "register") {
      setMode("signup");
    } else if (modeParam === "forgot" || modeParam === "forgot-password") {
      setMode("forgot");
    } else {
      setMode("login");
    }
  }, [searchParams]);

  // Wait for loading to complete
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  // Redirect if already authenticated - but check email verification first
  if (isAuthenticated && user) {
    console.log("AuthPage - User is authenticated:", user); // Debug log

    // If user is not email verified, redirect to email verification
    if (!user.isEmailVerified) {
      console.log("AuthPage - Redirecting to verify-email"); // Debug log
      return <Navigate to="/verify-email" replace />;
    }

    // If user is verified but hasn't completed onboarding, redirect to onboarding
    if (!user.onboardingCompleted) {
      console.log("AuthPage - Redirecting to onboarding"); // Debug log
      return <Navigate to="/onboarding" replace />;
    }

    // If user is admin, redirect to admin dashboard
    if (user.userType === "admin") {
      console.log("AuthPage - Redirecting to admin dashboard"); // Debug log
      return <Navigate to="/admin/dashboard" replace />;
    }

    // Otherwise, redirect to user dashboard
    console.log("AuthPage - Redirecting to user dashboard"); // Debug log
    return <Navigate to="/dashboard" replace />;
  }

  const renderAuthForm = () => {
    switch (mode) {
      case "signup":
        return <SignupForm />;
      case "forgot":
        return <LoginForm />;
      default:
        return <LoginForm />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">{renderAuthForm()}</div>
    </div>
  );
};

export default AuthPage;
