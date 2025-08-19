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

  console.log(
    "🛡️ AuthGuard - Current location:",
    location.pathname + location.search
  ); // Debug log
  console.log("🛡️ AuthGuard - User auth status:", {
    isAuthenticated,
    isEmailVerified: user?.isEmailVerified,
  }); // Debug log

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
    console.log("🛡️ AuthGuard - Not authenticated, redirecting to auth"); // Debug log
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // Check admin access
  if (adminOnly && !isAdmin()) {
    console.log("🛡️ AuthGuard - Not admin, redirecting to dashboard"); // Debug log
    return <Navigate to="/dashboard" replace />;
  }

  // ✅ IMPORTANT: If we're already on verify-email page, don't redirect again!
  if (location.pathname === "/verify-email") {
    console.log(
      "🛡️ AuthGuard - On verify-email page, allowing access with params:",
      location.search
    ); // Debug log
    return children;
  }

  // Check email verification (skip for admin users)
  if (requireEmailVerification && !adminOnly && user && !user.isEmailVerified) {
    console.log(
      "🛡️ AuthGuard - Email not verified, redirecting to verify-email"
    ); // Debug log
    return <Navigate to="/verify-email" replace />;
  }

  // ✅ FIX: Only check onboarding if we're NOT on the payment page
  // This prevents redirecting from payment back to onboarding
  if (
    !adminOnly &&
    user?.isEmailVerified &&
    !user?.onboardingCompleted &&
    location.pathname !== "/onboarding" &&
    location.pathname !== "/payment" // ✅ Add this condition
  ) {
    console.log(
      "🛡️ AuthGuard - Onboarding not complete, redirecting to onboarding"
    ); // Debug log
    return <Navigate to="/onboarding" replace />;
  }

  console.log("🛡️ AuthGuard - All checks passed, rendering children");
  return children;
};

export default AuthGuard;
