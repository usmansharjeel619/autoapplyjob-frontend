import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const AuthGuard = ({ children, adminOnly = false }) => {
  const { isAuthenticated, isLoading, user, isAdmin } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner" />
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // Check admin access
  if (adminOnly && !isAdmin()) {
    return <Navigate to="/dashboard" replace />;
  }

  // Check if user needs to complete onboarding
  if (
    !adminOnly &&
    !user?.onboardingCompleted &&
    location.pathname !== "/onboarding"
  ) {
    return <Navigate to="/onboarding" replace />;
  }

  return children;
};

export default AuthGuard;
