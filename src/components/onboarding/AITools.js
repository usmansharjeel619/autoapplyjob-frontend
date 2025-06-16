import React, { useState, useEffect } from "react";
import {
  Zap,
  Target,
  FileText,
  Settings,
  Clock,
  CheckCircle,
  AlertCircle,
  Info,
} from "lucide-react";
import Button from "../ui/Button";
import Card from "../ui/Card";
import Select from "../ui/Select";

const AITools = ({
  data = {},
  onDataChange,
  onNext,
  onBack,
  isFirst,
  isLast,
}) => {
  const [formData, setFormData] = useState({
    matchThreshold: 85,
    dailyApplicationLimit: 5,
    autoApprovalThreshold: 95,
    coverLetterStyle: "professional",
    jobSearchFrequency: "daily",
    enableEmailNotifications: true,
    enableSMSNotifications: false,
    customInstructions: "",
    excludeKeywords: [],
    priorityIndustries: [],
    ...data,
  });

  useEffect(() => {
    onDataChange(formData);
  }, [formData, onDataChange]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSliderChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: parseInt(value) }));
  };

  const coverLetterStyles = [
    { value: "professional", label: "Professional & Formal" },
    { value: "conversational", label: "Conversational & Friendly" },
    { value: "confident", label: "Confident & Bold" },
    { value: "creative", label: "Creative & Unique" },
  ];

  const searchFrequencies = [
    { value: "hourly", label: "Every Hour" },
    { value: "daily", label: "Once Daily" },
    { value: "twice_daily", label: "Twice Daily" },
    { value: "weekly", label: "Weekly" },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* AI Job Matching Settings */}
      <Card>
        <Card.Header>
          <div className="flex items-center gap-2">
            <Target className="text-primary-600" size={20} />
            <h3 className="text-lg font-medium text-gray-900">
              Job Matching Settings
            </h3>
          </div>
          <p className="text-sm text-gray-600">
            Configure how our AI matches jobs to your profile
          </p>
        </Card.Header>
        <Card.Body>
          <div className="space-y-6">
            {/* Match Threshold */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium text-gray-700">
                  Minimum Match Score
                </label>
                <span className="text-sm text-primary-600 font-medium">
                  {formData.matchThreshold}%
                </span>
              </div>
              <input
                type="range"
                min="60"
                max="100"
                value={formData.matchThreshold}
                onChange={(e) =>
                  handleSliderChange("matchThreshold", e.target.value)
                }
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>60% (More opportunities)</span>
                <span>100% (Perfect matches only)</span>
              </div>
              <p className="text-xs text-gray-600 mt-2">
                Only jobs with a match score above this threshold will be
                considered
              </p>
            </div>

            {/* Daily Application Limit */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium text-gray-700">
                  Daily Application Limit
                </label>
                <span className="text-sm text-primary-600 font-medium">
                  {formData.dailyApplicationLimit} applications/day
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="20"
                value={formData.dailyApplicationLimit}
                onChange={(e) =>
                  handleSliderChange("dailyApplicationLimit", e.target.value)
                }
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>1 (Conservative)</span>
                <span>20 (Aggressive)</span>
              </div>
              <p className="text-xs text-gray-600 mt-2">
                Maximum number of job applications to submit per day
              </p>
            </div>

            {/* Search Frequency */}
            <Select
              label="Job Search Frequency"
              options={searchFrequencies}
              value={formData.jobSearchFrequency}
              onChange={(value) =>
                handleInputChange("jobSearchFrequency", value)
              }
            />
          </div>
        </Card.Body>
      </Card>

      {/* Cover Letter AI Settings */}
      <Card>
        <Card.Header>
          <div className="flex items-center gap-2">
            <FileText className="text-primary-600" size={20} />
            <h3 className="text-lg font-medium text-gray-900">
              Cover Letter AI
            </h3>
          </div>
          <p className="text-sm text-gray-600">
            Customize how AI generates your cover letters
          </p>
        </Card.Header>
        <Card.Body>
          <div className="space-y-4">
            <Select
              label="Writing Style"
              options={coverLetterStyles}
              value={formData.coverLetterStyle}
              onChange={(value) => handleInputChange("coverLetterStyle", value)}
            />

            <div>
              <label className="form-label">
                Custom Instructions (Optional)
              </label>
              <textarea
                className="form-input form-textarea"
                placeholder="e.g., Always mention my passion for sustainability, Don't mention salary expectations..."
                value={formData.customInstructions}
                onChange={(e) =>
                  handleInputChange("customInstructions", e.target.value)
                }
                rows={3}
              />
              <p className="text-xs text-gray-600 mt-1">
                Special instructions for the AI when writing your cover letters
              </p>
            </div>
          </div>
        </Card.Body>
      </Card>

      {/* Admin Review Settings */}
      <Card>
        <Card.Header>
          <div className="flex items-center gap-2">
            <Settings className="text-primary-600" size={20} />
            <h3 className="text-lg font-medium text-gray-900">
              Admin Review Process
            </h3>
          </div>
          <p className="text-sm text-gray-600">
            Configure when applications need manual review
          </p>
        </Card.Header>
        <Card.Body>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium text-gray-700">
                  Auto-Approval Threshold
                </label>
                <span className="text-sm text-primary-600 font-medium">
                  {formData.autoApprovalThreshold}%
                </span>
              </div>
              <input
                type="range"
                min="85"
                max="100"
                value={formData.autoApprovalThreshold}
                onChange={(e) =>
                  handleSliderChange("autoApprovalThreshold", e.target.value)
                }
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>85% (More auto-approvals)</span>
                <span>100% (Manual review required)</span>
              </div>
              <p className="text-xs text-gray-600 mt-2">
                Jobs with match scores above this threshold will be
                automatically approved for application
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <Info className="text-blue-600 mt-0.5" size={16} />
                <div className="text-sm text-blue-800">
                  <strong>How it works:</strong> Our admin team reviews all
                  applications before submission to ensure quality and
                  relevance. Higher thresholds mean more automated approvals.
                </div>
              </div>
            </div>
          </div>
        </Card.Body>
      </Card>

      {/* Notification Preferences */}
      <Card>
        <Card.Header>
          <div className="flex items-center gap-2">
            <Zap className="text-primary-600" size={20} />
            <h3 className="text-lg font-medium text-gray-900">
              Notification Settings
            </h3>
          </div>
          <p className="text-sm text-gray-600">
            Choose how you want to be notified about job activities
          </p>
        </Card.Header>
        <Card.Body>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-gray-900">
                  Email Notifications
                </h4>
                <p className="text-xs text-gray-600">
                  Get updates about new job matches and applications
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.enableEmailNotifications}
                  onChange={(e) =>
                    handleInputChange(
                      "enableEmailNotifications",
                      e.target.checked
                    )
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-gray-900">
                  SMS Notifications
                </h4>
                <p className="text-xs text-gray-600">
                  Get text alerts for urgent updates
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.enableSMSNotifications}
                  onChange={(e) =>
                    handleInputChange(
                      "enableSMSNotifications",
                      e.target.checked
                    )
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
            </div>
          </div>
        </Card.Body>
      </Card>

      {/* Summary */}
      <Card className="bg-green-50 border-green-200">
        <Card.Body>
          <div className="flex items-start gap-3">
            <CheckCircle className="text-green-600 mt-1" size={20} />
            <div>
              <h3 className="text-lg font-medium text-green-900 mb-2">
                AI Setup Complete!
              </h3>
              <div className="text-sm text-green-800 space-y-1">
                <p>
                  • Minimum match score:{" "}
                  <strong>{formData.matchThreshold}%</strong>
                </p>
                <p>
                  • Daily application limit:{" "}
                  <strong>{formData.dailyApplicationLimit} applications</strong>
                </p>
                <p>
                  • Cover letter style:{" "}
                  <strong>
                    {
                      coverLetterStyles.find(
                        (s) => s.value === formData.coverLetterStyle
                      )?.label
                    }
                  </strong>
                </p>
                <p>
                  • Search frequency:{" "}
                  <strong>
                    {
                      searchFrequencies.find(
                        (f) => f.value === formData.jobSearchFrequency
                      )?.label
                    }
                  </strong>
                </p>
              </div>
              <div className="mt-3 p-3 bg-green-100 rounded-lg">
                <p className="text-sm text-green-800">
                  <strong>Next steps:</strong> Our AI will start hunting for
                  jobs immediately. All applications will be reviewed by our
                  admin team before submission.
                </p>
              </div>
            </div>
          </div>
        </Card.Body>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between pt-6">
        <div>
          {!isFirst && (
            <Button type="button" variant="outline" onClick={onBack}>
              Back
            </Button>
          )}
        </div>

        <Button type="submit">
          {isLast ? "Complete Setup & Start Job Hunt" : "Next Step"}
        </Button>
      </div>
    </form>
  );
};

export default AITools;
