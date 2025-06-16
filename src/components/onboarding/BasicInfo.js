import React, { useState, useEffect } from "react";
import { EXPERIENCE_LEVELS, EDUCATION_LEVELS } from "../../utils/constants";
import { basicInfoValidation } from "../../utils/validation";
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

  useEffect(() => {
    onDataChange(formData);
  }, [formData, onDataChange]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate form
    const validation = basicInfoValidation.validate(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    onNext();
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
          placeholder="e.g., Software Developer"
          value={formData.currentJobTitle}
          onChange={(e) => handleInputChange("currentJobTitle", e.target.value)}
          error={errors.currentJobTitle}
          required
        />

        <Select
          label="Years of Experience"
          options={EXPERIENCE_LEVELS}
          value={formData.experienceLevel}
          onChange={(value) => handleInputChange("experienceLevel", value)}
          error={errors.experienceLevel}
          required
        />

        <Select
          label="Highest Education Level"
          options={EDUCATION_LEVELS}
          value={formData.educationLevel}
          onChange={(value) => handleInputChange("educationLevel", value)}
          error={errors.educationLevel}
          required
        />
      </div>

      <div className="flex justify-between pt-6">
        <div>
          {!isFirst && (
            <Button type="button" variant="outline" onClick={onBack}>
              Back
            </Button>
          )}
        </div>

        <Button type="submit">{isLast ? "Complete Setup" : "Next Step"}</Button>
      </div>
    </form>
  );
};

export default BasicInfo;
