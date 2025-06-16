import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Mail, Lock } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useApp } from "../../context/AppContext";
import { signupValidation } from "../../utils/validation";
import Button from "../ui/Button";
import Input from "../ui/Input";

const SignupForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const { showError, showSuccess } = useApp();
  const navigate = useNavigate();

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    const validation = signupValidation.validate(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    // Check if passwords match
    if (formData.password !== formData.confirmPassword) {
      setErrors({ confirmPassword: "Passwords do not match" });
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const result = await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        userType: "job_seeker",
      });

      if (result.success) {
        showSuccess("Account created successfully! Welcome to AutoApplyJob.");
        navigate("/onboarding");
      } else {
        showError(result.error || "Registration failed. Please try again.");
      }
    } catch (error) {
      showError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = () => {
    // TODO: Implement Google OAuth signup
    showError("Google signup coming soon!");
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-lg">AA</span>
          </div>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Create your account
        </h1>
        <p className="text-gray-600">Start your automated job search journey</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          label="Full Name"
          type="text"
          placeholder="Enter your full name"
          value={formData.name}
          onChange={(e) => handleInputChange("name", e.target.value)}
          error={errors.name}
          icon={<User size={16} />}
          required
        />

        <Input
          label="Email Address"
          type="email"
          placeholder="Enter your email"
          value={formData.email}
          onChange={(e) => handleInputChange("email", e.target.value)}
          error={errors.email}
          icon={<Mail size={16} />}
          required
        />

        <Input
          label="Password"
          type="password"
          placeholder="Create a strong password"
          value={formData.password}
          onChange={(e) => handleInputChange("password", e.target.value)}
          error={errors.password}
          icon={<Lock size={16} />}
          required
        />

        <Input
          label="Confirm Password"
          type="password"
          placeholder="Confirm your password"
          value={formData.confirmPassword}
          onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
          error={errors.confirmPassword}
          icon={<Lock size={16} />}
          required
        />

        <div className="flex items-start">
          <input
            type="checkbox"
            required
            className="mt-1 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
          />
          <label className="ml-2 text-sm text-gray-600">
            I agree to the{" "}
            <Link
              to="/terms"
              className="text-primary-600 hover:text-primary-700"
            >
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link
              to="/privacy"
              className="text-primary-600 hover:text-primary-700"
            >
              Privacy Policy
            </Link>
          </label>
        </div>

        <Button type="submit" className="w-full" loading={loading}>
          Create Account
        </Button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">
              Or continue with
            </span>
          </div>
        </div>

        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={handleGoogleSignup}
          icon={
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
          }
        >
          Google
        </Button>
      </form>

      <div className="mt-8 text-center">
        <p className="text-gray-600">
          Already have an account?{" "}
          <Link
            to="/auth?mode=login"
            className="text-primary-600 hover:text-primary-700 font-medium"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignupForm;
