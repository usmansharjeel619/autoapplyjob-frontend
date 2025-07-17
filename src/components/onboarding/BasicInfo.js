import React, { useState, useEffect, useCallback } from "react";
import { EXPERIENCE_LEVELS, EDUCATION_LEVELS } from "../../utils/constants";
import { basicInfoValidation } from "../../utils/validation";
import userService from "../../services/user.service";
import { useApp } from "../../context/AppContext";
import Button from "../ui/Button";
import Input from "../ui/Input";
import Select from "../ui/Select";

const BasicInfo = ({
  data = {},
  onDataChange,
  onNext,
  onBack,
  isFirst,
  isLast,
}) => {
  const { showError } = useApp();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    currentJobTitle: "",
    experienceLevel: "",
    educationLevel: "",
    ...data,
  });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const memoizedOnDataChange = useCallback(onDataChange, []);

  useEffect(() => {
    memoizedOnDataChange(formData);
  }, [formData, memoizedOnDataChange]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    const validation = basicInfoValidation.validate(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    try {
      setSaving(true);

      // Save to backend
      await userService.completeOnboardingStep("basic_info", formData);

      onNext();
    } catch (error) {
      showError("Failed to save basic information");
      console.error("Basic info save error:", error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Full Name"
          type="text"
          placeholder="Enter your full name"
          value={formData.name}
          onChange={(e) => handleInputChange("name", e.target.value)}
          error={errors.name}
          required
        />

        <Input
          label="Email Address"
          type="email"
          placeholder="Enter your email"
          value={formData.email}
          onChange={(e) => handleInputChange("email", e.target.value)}
          error={errors.email}
          required
        />

        <Input
          label="Phone Number"
          type="tel"
          placeholder="Enter your phone number"
          value={formData.phone}
          onChange={(e) => handleInputChange("phone", e.target.value)}
          error={errors.phone}
          required
        />

        <Input
          label="Current Job Title"
          type="text"
          placeholder="Enter your current or desired job title"
          value={formData.currentJobTitle}
          onChange={(e) => handleInputChange("currentJobTitle", e.target.value)}
          error={errors.currentJobTitle}
          required
        />

        <Select
          label="Experience Level"
          value={formData.experienceLevel}
          onChange={(e) => handleInputChange("experienceLevel", e.target.value)}
          error={errors.experienceLevel}
          required
          options={[
            { value: "", label: "Select your experience level" },
            ...EXPERIENCE_LEVELS,
          ]}
        />

        <Select
          label="Education Level"
          value={formData.educationLevel}
          onChange={(e) => handleInputChange("educationLevel", e.target.value)}
          error={errors.educationLevel}
          required
          options={[
            { value: "", label: "Select your education level" },
            ...EDUCATION_LEVELS,
          ]}
        />
      </div>

      <div className="flex justify-between pt-6">
        {!isFirst && (
          <Button type="button" variant="outline" onClick={onBack}>
            Back
          </Button>
        )}
        <div className={isFirst ? "ml-auto" : ""}>
          <Button type="submit" disabled={saving}>
            {saving ? "Saving..." : isLast ? "Complete" : "Next"}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default BasicInfo;
