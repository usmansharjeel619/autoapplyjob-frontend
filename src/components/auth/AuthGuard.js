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

  console.log("🛡️ AuthGuard - Current location:", location.pathname);
  console.log("🛡️ AuthGuard - User auth status:", {
    isAuthenticated,
    isEmailVerified: user?.isEmailVerified,
    onboardingCompleted: user?.onboardingCompleted,
    userType: user?.userType,
  });

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
    console.log("🛡️ AuthGuard - Not authenticated, redirecting to auth");
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // Check admin access first (before other checks)
  if (adminOnly && !isAdmin()) {
    console.log("🛡️ AuthGuard - Not admin, redirecting to dashboard");
    return <Navigate to="/dashboard" replace />;
  }

  // ✅ IMPORTANT: If we're already on verify-email page, don't redirect again!
  if (location.pathname === "/verify-email") {
    console.log("🛡️ AuthGuard - On verify-email page, allowing access");
    return children;
  }

  // ✅ FIX: For admin users, skip all other checks
  if (user?.userType === "admin") {
    console.log("🛡️ AuthGuard - Admin user, allowing access");
    return children;
  }

  // Check email verification (skip for admin users)
  if (requireEmailVerification && user && !user.isEmailVerified) {
    console.log(
      "🛡️ AuthGuard - Email not verified, redirecting to verify-email"
    );
    return <Navigate to="/verify-email" replace />;
  }

  // ✅ FIX: Only check onboarding for verified users (and NOT for certain protected pages)
  const skipOnboardingCheckForPages = [
    "/payment",
    "/profile",
    "/settings",
    "/tools",
  ];
  if (
    user?.isEmailVerified &&
    !user?.onboardingCompleted &&
    !skipOnboardingCheckForPages.includes(location.pathname) &&
    location.pathname !== "/onboarding"
  ) {
    console.log(
      "🛡️ AuthGuard - Onboarding not complete, redirecting to onboarding"
    );
    return <Navigate to="/onboarding" replace />;
  }

  console.log("🛡️ AuthGuard - All checks passed, rendering children");
  return children;
};

export default AuthGuard;
