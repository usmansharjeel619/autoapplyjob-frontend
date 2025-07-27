import React, { useState, useEffect } from "react";
import { useSearchParams, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LoginForm from "../components/auth/LoginForm";
import SignupForm from "../components/auth/SignupForm";

const AuthPage = () => {
  const [searchParams] = useSearchParams();
  const [mode, setMode] = useState("login");
  const { isAuthenticated, isLoading } = useAuth();

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

  // Redirect if already authenticated
  if (isAuthenticated && !isLoading) {
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
