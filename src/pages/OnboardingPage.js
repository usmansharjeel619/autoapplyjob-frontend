// src/pages/OnboardingPage.js
import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useApp } from "../context/AppContext";
import { ONBOARDING_STEPS } from "../utils/constants";
import ProgressBar from "../components/ui/ProgressBar";
import BasicInfo from "../components/onboarding/BasicInfo";
import ResumeUpload from "../components/onboarding/ResumeUpload";
import JobPreferences from "../components/onboarding/JobPreferences";

const OnboardingPage = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [stepData, setStepData] = useState({
    [ONBOARDING_STEPS.BASIC_INFO]: {},
    [ONBOARDING_STEPS.RESUME_UPLOAD]: {},
    [ONBOARDING_STEPS.JOB_PREFERENCES]: {},
  });

  const { user, updateUser } = useAuth();
  const {
    onboardingProgress,
    setOnboardingProgress,
    clearOnboardingProgress,
    showSuccess,
  } = useApp();
  const navigate = useNavigate();

  // Use refs to track if we've already initialized to prevent multiple loads
  const initializedRef = useRef(false);
  const isUpdatingProgressRef = useRef(false);

  const steps = [
    {
      key: ONBOARDING_STEPS.BASIC_INFO,
      title: "Basic Information",
      description: "Tell us about yourself",
      component: BasicInfo,
    },
    {
      key: ONBOARDING_STEPS.RESUME_UPLOAD,
      title: "Upload Resume",
      description: "Upload and optimize your resume",
      component: ResumeUpload,
    },
    {
      key: ONBOARDING_STEPS.JOB_PREFERENCES,
      title: "Job Preferences",
      description: "What kind of job are you looking for?",
      component: JobPreferences,
    },
  ];

  // Helper function to convert backend step to frontend step index
  const getStepIndexFromBackendStep = (backendStep) => {
    const stepMap = {
      [ONBOARDING_STEPS.BASIC_INFO]: 0,
      [ONBOARDING_STEPS.RESUME_UPLOAD]: 1,
      [ONBOARDING_STEPS.JOB_PREFERENCES]: 2,
      completed: 2, // If completed, show last step
    };
    return stepMap[backendStep] || 0; // Default to first step
  };

  //useeffect to check current step
  useEffect(() => {
    console.log("Current step:", currentStep);
  }, [currentStep]);

  // Initialize onboarding step based on user data and saved progress
  useEffect(() => {
    if (!initializedRef.current) {
      initializedRef.current = true;

      let initialStep = 0;

      // First, check if user has already completed onboarding
      if (user?.onboardingCompleted) {
        navigate("/payment");
        return;
      }

      // Then check user's backend step
      if (user?.onboardingStep) {
        initialStep = getStepIndexFromBackendStep(user.onboardingStep);
      }

      // Finally, check saved progress (but validate it)
      if (onboardingProgress?.currentStep !== undefined) {
        const savedStep = onboardingProgress.currentStep;
        // Only use saved step if it's valid and not beyond current backend step
        if (
          savedStep >= 0 &&
          savedStep < steps.length &&
          savedStep >= initialStep
        ) {
          initialStep = savedStep;
        }
      }

      // Ensure we never start beyond the available steps
      initialStep = Math.min(initialStep, steps.length - 1);

      setCurrentStep(initialStep);

      // Load saved step data if available
      if (onboardingProgress?.stepData) {
        setStepData((prevStepData) => ({
          ...prevStepData,
          ...onboardingProgress.stepData,
        }));
      }
    }
  }, [user, onboardingProgress, navigate, steps.length]);

  // Memoized function to update step data to prevent infinite loops
  const updateStepData = useCallback(
    (stepKey, data) => {
      setStepData((prev) => {
        const newStepData = {
          ...prev,
          [stepKey]: { ...prev[stepKey], ...data },
        };

        // Prevent circular updates
        if (!isUpdatingProgressRef.current) {
          isUpdatingProgressRef.current = true;
          // Save progress immediately when data changes
          setOnboardingProgress({
            currentStep,
            stepData: newStepData,
          });
          // Reset flag after a short delay
          setTimeout(() => {
            isUpdatingProgressRef.current = false;
          }, 100);
        }

        return newStepData;
      });
    },
    [currentStep, setOnboardingProgress]
  );

  // Save progress when step changes - but avoid circular dependencies
  useEffect(() => {
    if (initializedRef.current && !isUpdatingProgressRef.current) {
      isUpdatingProgressRef.current = true;
      setOnboardingProgress({
        currentStep,
        stepData,
      });
      // Reset flag after a short delay
      setTimeout(() => {
        isUpdatingProgressRef.current = false;
      }, 100);
    }
  }, [currentStep, setOnboardingProgress]);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleComplete = async () => {
    try {
      // Update user state to mark onboarding as completed
      await updateUser({ onboardingCompleted: true });

      // Clear onboarding progress since we're done
      clearOnboardingProgress();

      // Redirect to payment screen
      navigate("/payment");
    } catch (error) {
      console.error("Failed to complete onboarding:", error);
      // Handle error appropriately
    }
  };

  // Prevent rendering if still initializing or if user should be redirected
  if (!initializedRef.current || user?.onboardingCompleted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const progress = ((currentStep + 1) / steps.length) * 100;
  const currentStepConfig = steps[currentStep];
  const StepComponent = currentStepConfig.component;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <div className="flex items-center gap-4 mb-6">
            <img
              src="images/logo.png"
              alt="AutoApplyJob"
              className="w-40 h-40"
            />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Welcome to AutoApplyJob
              </h1>
              <p className="text-gray-600">
                Let's set up your profile to find the perfect jobs
              </p>
            </div>
          </div>

          <ProgressBar
            value={progress}
            showValue={true}
            label={`Step ${currentStep + 1} of ${steps.length}`}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          {/* Step Header */}
          <div className="px-8 py-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {currentStepConfig.title}
                </h2>
                <p className="text-gray-600 mt-1">
                  {currentStepConfig.description}
                </p>
              </div>

              <div className="text-sm text-gray-500">
                Step {currentStep + 1} of {steps.length}
              </div>
            </div>
          </div>

          {/* Step Content */}
          <div className="p-8">
            <StepComponent
              data={stepData[currentStepConfig.key]}
              onDataChange={(data) =>
                updateStepData(currentStepConfig.key, data)
              }
              onNext={handleNext}
              onBack={handleBack}
              isFirst={currentStep === 0}
              isLast={currentStep === steps.length - 1}
            />
          </div>
        </div>

        {/* Step Navigation */}
        <div className="flex justify-center mt-8">
          <div className="flex items-center gap-2">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index <= currentStep ? "bg-black" : "bg-gray-300"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;
