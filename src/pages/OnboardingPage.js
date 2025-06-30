import React, { useState, useEffect, useCallback } from "react";
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

  // Load saved progress on mount - only run once
  useEffect(() => {
    if (onboardingProgress) {
      setCurrentStep(onboardingProgress.currentStep || 0);
      setStepData(onboardingProgress.stepData || stepData);
    }
  }, []); // Empty dependency array - only run once on mount

  // Memoized function to update step data to prevent infinite loops
  const updateStepData = useCallback(
    (stepKey, data) => {
      setStepData((prev) => {
        const newStepData = {
          ...prev,
          [stepKey]: { ...prev[stepKey], ...data },
        };

        // Save progress immediately when data changes
        setOnboardingProgress({
          currentStep,
          stepData: newStepData,
        });

        return newStepData;
      });
    },
    [currentStep, setOnboardingProgress]
  );

  // Save progress when step changes
  useEffect(() => {
    setOnboardingProgress({
      currentStep,
      stepData,
    });
  }, [currentStep]); // Only depend on currentStep

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
    // Redirect to payment screen instead of dashboard
    navigate("/payment");
  };

  const progress = ((currentStep + 1) / steps.length) * 100;
  const currentStepConfig = steps[currentStep];
  const StepComponent = currentStepConfig.component;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">AA</span>
            </div>
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
