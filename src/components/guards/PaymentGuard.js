import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { AlertCircle, CreditCard, Lock } from "lucide-react";

const PaymentGuard = ({ children, requiresPremium = false }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 border-2 border-gray-300 border-t-black rounded-full animate-spin"></div>
          <span className="text-gray-600">Loading...</span>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // Redirect to email verification if not verified
  if (!user.isEmailVerified) {
    return <Navigate to="/verify-email" replace />;
  }

  // Redirect to onboarding if not completed
  if (!user.onboardingCompleted) {
    return <Navigate to="/onboarding" replace />;
  }

  // Check payment completion
  if (!user.paymentCompleted) {
    return <Navigate to="/payment" replace />;
  }

  // Check if premium features are required
  if (requiresPremium) {
    const planHierarchy = {
      basic: 1,
      premium: 2,
      enterprise: 3,
    };

    const userPlanLevel = planHierarchy[user.selectedPlan] || 0;
    const requiredLevel = planHierarchy.premium;

    if (userPlanLevel < requiredLevel) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-orange-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Premium Feature Required
            </h2>
            <p className="text-gray-600 mb-6">
              This feature requires a Premium or Enterprise plan. Upgrade your
              plan to access this functionality.
            </p>
            <div className="space-y-3">
              <button
                onClick={() => (window.location.href = "/payment")}
                className="w-full bg-black text-white py-2 px-4 rounded-lg hover:bg-gray-800 transition-colors"
              >
                Upgrade Plan
              </button>
              <button
                onClick={() => window.history.back()}
                className="w-full bg-gray-100 text-gray-900 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      );
    }
  }

  // All checks passed, render the protected component
  return children;
};

// Higher-order component for easier usage
export const withPaymentGuard = (Component, options = {}) => {
  return function ProtectedComponent(props) {
    return (
      <PaymentGuard requiresPremium={options.requiresPremium}>
        <Component {...props} />
      </PaymentGuard>
    );
  };
};

// Hook for checking payment status in components
export const usePaymentStatus = () => {
  const { user } = useAuth();

  return {
    hasPayment: user?.paymentCompleted || false,
    plan: user?.selectedPlan || "basic",
    isBasic: user?.selectedPlan === "basic",
    isPremium: user?.selectedPlan === "premium",
    isEnterprise: user?.selectedPlan === "enterprise",
    canAccessPremiumFeatures: ["premium", "enterprise"].includes(
      user?.selectedPlan
    ),
    canAccessEnterpriseFeatures: user?.selectedPlan === "enterprise",
  };
};

export default PaymentGuard;
