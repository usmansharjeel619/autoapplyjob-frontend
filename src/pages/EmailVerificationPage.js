// src/pages/EmailVerificationPage.js
import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Mail, CheckCircle, AlertCircle, RefreshCw } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useApp } from "../context/AppContext";
import authService from "../services/auth.service";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";

const EmailVerificationPage = () => {
  const [searchParams] = useSearchParams();
  const [verificationStatus, setVerificationStatus] = useState("pending"); // pending, success, error
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  const { user, logout, updateUser } = useAuth();
  const { showSuccess, showError } = useApp();
  const navigate = useNavigate();

  // Auto-verify if token is in URL
  useEffect(() => {
    const token = searchParams.get("token");
    if (token) {
      handleEmailVerification(token);
    }
  }, [searchParams]);

  // Cooldown timer for resend button
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => {
        setResendCooldown(resendCooldown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleEmailVerification = async (token) => {
    setLoading(true);
    try {
      const response = await authService.verifyEmail(token);

      // Update user context with verified status
      if (response.data && response.data.user) {
        updateUser(response.data.user);
      } else {
        // Fallback: manually update the verification status
        updateUser({ isEmailVerified: true });
      }

      setVerificationStatus("success");
      showSuccess("Email verified successfully!");

      // Redirect to onboarding after a short delay
      setTimeout(() => {
        navigate("/onboarding");
      }, 2000);
    } catch (error) {
      setVerificationStatus("error");
      showError(error.response?.data?.message || "Email verification failed");
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    setResendLoading(true);
    try {
      await authService.resendEmailVerification();
      showSuccess("Verification email sent successfully!");
      setResendCooldown(60); // 60 seconds cooldown
    } catch (error) {
      showError(
        error.response?.data?.message || "Failed to send verification email"
      );
    } finally {
      setResendLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/auth");
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="text-center py-8">
          <RefreshCw className="w-12 h-12 mx-auto text-blue-600 animate-spin mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Verifying your email...
          </h3>
          <p className="text-gray-600">
            Please wait while we verify your email address.
          </p>
        </div>
      );
    }

    if (verificationStatus === "success") {
      return (
        <div className="text-center py-8">
          <CheckCircle className="w-16 h-16 mx-auto text-green-600 mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Email Verified Successfully!
          </h3>
          <p className="text-gray-600 mb-4">
            Your email has been verified. Redirecting you to complete your
            profile...
          </p>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-green-600 h-2 rounded-full animate-pulse"
              style={{ width: "100%" }}
            ></div>
          </div>
        </div>
      );
    }

    if (verificationStatus === "error") {
      return (
        <div className="text-center py-8">
          <AlertCircle className="w-16 h-16 mx-auto text-red-600 mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Verification Failed
          </h3>
          <p className="text-gray-600 mb-6">
            The verification link is invalid or has expired. Please request a
            new verification email.
          </p>
          <Button
            onClick={handleResendVerification}
            loading={resendLoading}
            disabled={resendCooldown > 0}
            className="mb-4"
          >
            {resendCooldown > 0
              ? `Resend in ${resendCooldown}s`
              : "Send New Verification Email"}
          </Button>
        </div>
      );
    }

    // Default pending state
    return (
      <div className="text-center py-8">
        <Mail className="w-16 h-16 mx-auto text-blue-600 mb-6" />
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          Check Your Email
        </h3>
        <p className="text-gray-600 mb-6">
          We've sent a verification link to{" "}
          <span className="font-medium text-gray-900">{user?.email}</span>
        </p>
        <p className="text-sm text-gray-500 mb-8">
          Click the link in the email to verify your account. If you don't see
          it, check your spam folder.
        </p>

        <div className="space-y-4">
          <Button
            onClick={handleResendVerification}
            variant="outline"
            loading={resendLoading}
            disabled={resendCooldown > 0}
            icon={<Mail size={16} />}
          >
            {resendCooldown > 0
              ? `Resend in ${resendCooldown}s`
              : "Resend Verification Email"}
          </Button>

          <div className="text-sm text-gray-500">
            Wrong email?{" "}
            <button
              onClick={handleLogout}
              className="text-primary-600 hover:text-primary-500 font-medium"
            >
              Sign up with a different email
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <Card className="p-8">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">
              Verify Your Email
            </h1>
            <p className="text-gray-600 mt-2">Complete your account setup</p>
          </div>
          {renderContent()}
        </Card>
      </div>
    </div>
  );
};

export default EmailVerificationPage;
