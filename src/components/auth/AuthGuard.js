import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const AuthGuard = ({
  children,
  adminOnly = false,
  requireEmailVerification = true,
}) => {
  const { isAuthenticated, isLoading, user, isAdmin } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
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

  // Check email verification (skip for admin users and email verification page)
  if (
    requireEmailVerification &&
    !adminOnly &&
    user &&
    !user.isEmailVerified &&
    location.pathname !== "/verify-email"
  ) {
    return <Navigate to="/verify-email" replace />;
  }

  // Check if user needs to complete onboarding
  if (
    !adminOnly &&
    user?.isEmailVerified &&
    !user?.onboardingCompleted &&
    location.pathname !== "/onboarding" &&
    location.pathname !== "/verify-email"
  ) {
    return <Navigate to="/onboarding" replace />;
  }

  return children;
};

export default AuthGuard;
