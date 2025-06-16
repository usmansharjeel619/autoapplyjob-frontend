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
    if (modeParam === "signup") {
      setMode("signup");
    } else {
      setMode("login");
    }
  }, [searchParams]);

  // Redirect if already authenticated
  if (isAuthenticated && !isLoading) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {mode === "login" ? <LoginForm /> : <SignupForm />}
      </div>
    </div>
  );
};

export default AuthPage;
