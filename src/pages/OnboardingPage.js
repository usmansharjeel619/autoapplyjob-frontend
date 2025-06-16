import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useApp } from "../context/AppContext";
import { ONBOARDING_STEPS } from "../utils/constants";
import ProgressBar from "../components/ui/ProgressBar";
import BasicInfo from "../components/onboarding/BasicInfo";
import ResumeUpload from "../components/onboarding/ResumeUpload";
import JobPreferences from "../components/onboarding/JobPreferences";
import SkillsSetup from "../components/onboarding/SkillsSetup";
import AITools from "../components/onboarding/AITools";

const OnboardingPage = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [stepData, setStepData] = useState({
    [ONBOARDING_STEPS.BASIC_INFO]: {},
    [ONBOARDING_STEPS.RESUME_UPLOAD]: {},
    [ONBOARDING_STEPS.JOB_PREFERENCES]: {},
    [ONBOARDING_STEPS.SKILLS_SETUP]: {},
    [ONBOARDING_STEPS.AI_TOOLS]: {},
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
    {
      key: ONBOARDING_STEPS.SKILLS_SETUP,
      title: "Skills & Keywords",
      description: "Add your skills and expertise",
      component: SkillsSetup,
    },
    {
      key: ONBOARDING_STEPS.AI_TOOLS,
      title: "AI Tools Setup",
      description: "Configure your AI preferences",
      component: AITools,
    },
  ];

  // Load saved progress on mount
  useEffect(() => {
    if (onboardingProgress) {
      setCurrentStep(onboardingProgress.currentStep || 0);
      setStepData(onboardingProgress.stepData || stepData);
    }
  }, [onboardingProgress]);

  // Save progress whenever step or data changes
  useEffect(() => {
    setOnboardingProgress({
      currentStep,
      stepData,
    });
  }, [currentStep, stepData, setOnboardingProgress]);

  const updateStepData = (stepKey, data) => {
    setStepData((prev) => ({
      ...prev,
      [stepKey]: { ...prev[stepKey], ...data },
    }));
  };

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
      // Update user profile with onboarding data
      const profileUpdates = {
        ...stepData[ONBOARDING_STEPS.BASIC_INFO],
        jobPreferences: stepData[ONBOARDING_STEPS.JOB_PREFERENCES],
        skills: stepData[ONBOARDING_STEPS.SKILLS_SETUP],
        aiPreferences: stepData[ONBOARDING_STEPS.AI_TOOLS],
        onboardingCompleted: true,
      };

      await updateUser(profileUpdates);

      // Clear onboarding progress
      clearOnboardingProgress();

      showSuccess("Profile setup completed! Welcome to AutoApplyJob.");
      navigate("/dashboard");
    } catch (error) {
      console.error("Failed to complete onboarding:", error);
    }
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
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
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
                  index <= currentStep ? "bg-primary-600" : "bg-gray-300"
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
