import React, { useState, useEffect } from "react";
import { Plus, X, MapPin, DollarSign } from "lucide-react";
import { INDUSTRIES, JOB_TYPES, WORK_TYPES } from "../../utils/constants";
import { jobPreferencesValidation } from "../../utils/validation";
import { useApp } from "../../context/AppContext";
import Button from "../ui/Button";
import Input from "../ui/Input";
import Select from "../ui/Select";
import Card from "../ui/Card";

const JobPreferences = ({
  data = {},
  onDataChange,
  onNext,
  onBack,
  isFirst,
  isLast,
}) => {
  const [formData, setFormData] = useState({
    desiredJobTitle: "",
    industry: "",
    jobTypes: [],
    workTypes: [],
    location: "",
    remoteOk: false,
    minSalary: "",
    maxSalary: "",
    targetCompanies: [],
    avoidCompanies: [],
    ...data,
  });
  const [errors, setErrors] = useState({});
  const [newCompany, setNewCompany] = useState("");
  const [newAvoidCompany, setNewAvoidCompany] = useState("");
  const { showError } = useApp();

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

  const handleMultiSelect = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter((item) => item !== value)
        : [...prev[field], value],
    }));
  };

  const addTargetCompany = () => {
    if (
      newCompany.trim() &&
      !formData.targetCompanies.includes(newCompany.trim())
    ) {
      setFormData((prev) => ({
        ...prev,
        targetCompanies: [...prev.targetCompanies, newCompany.trim()],
      }));
      setNewCompany("");
    }
  };

  const removeTargetCompany = (company) => {
    setFormData((prev) => ({
      ...prev,
      targetCompanies: prev.targetCompanies.filter((c) => c !== company),
    }));
  };

  const addAvoidCompany = () => {
    if (
      newAvoidCompany.trim() &&
      !formData.avoidCompanies.includes(newAvoidCompany.trim())
    ) {
      setFormData((prev) => ({
        ...prev,
        avoidCompanies: [...prev.avoidCompanies, newAvoidCompany.trim()],
      }));
      setNewAvoidCompany("");
    }
  };

  const removeAvoidCompany = (company) => {
    setFormData((prev) => ({
      ...prev,
      avoidCompanies: prev.avoidCompanies.filter((c) => c !== company),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate form
    const validation = jobPreferencesValidation.validate(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    // Additional validation
    if (
      formData.minSalary &&
      formData.maxSalary &&
      parseInt(formData.minSalary) >= parseInt(formData.maxSalary)
    ) {
      showError("Maximum salary must be greater than minimum salary");
      return;
    }

    if (formData.jobTypes.length === 0) {
      setErrors((prev) => ({
        ...prev,
        jobTypes: "Please select at least one job type",
      }));
      return;
    }

    if (formData.workTypes.length === 0) {
      setErrors((prev) => ({
        ...prev,
        workTypes: "Please select at least one work type",
      }));
      return;
    }

    onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Job Preferences */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Desired Job Title"
          type="text"
          placeholder="e.g., Senior Software Engineer"
          value={formData.desiredJobTitle}
          onChange={(e) => handleInputChange("desiredJobTitle", e.target.value)}
          error={errors.desiredJobTitle}
          required
        />

        <Select
          label="Industry"
          options={INDUSTRIES}
          value={formData.industry}
          onChange={(value) => handleInputChange("industry", value)}
          error={errors.industry}
          required
        />
      </div>

      {/* Job Types */}
      <div>
        <label className="form-label">
          Job Types <span className="text-error ml-1">*</span>
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
          {JOB_TYPES.map((type) => (
            <button
              key={type.value}
              type="button"
              onClick={() => handleMultiSelect("jobTypes", type.value)}
              className={`p-3 rounded-lg border-2 text-left transition-colors ${
                formData.jobTypes.includes(type.value)
                  ? "border-primary-500 bg-primary-50 text-primary-700"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="font-medium">{type.label}</div>
            </button>
          ))}
        </div>
        {errors.jobTypes && (
          <span className="form-error">{errors.jobTypes}</span>
        )}
      </div>

      {/* Work Types */}
      <div>
        <label className="form-label">
          Work Arrangement <span className="text-error ml-1">*</span>
        </label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-2">
          {WORK_TYPES.map((type) => (
            <button
              key={type.value}
              type="button"
              onClick={() => handleMultiSelect("workTypes", type.value)}
              className={`p-4 rounded-lg border-2 text-center transition-colors ${
                formData.workTypes.includes(type.value)
                  ? "border-primary-500 bg-primary-50 text-primary-700"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="font-medium">{type.label}</div>
            </button>
          ))}
        </div>
        {errors.workTypes && (
          <span className="form-error">{errors.workTypes}</span>
        )}
      </div>

      {/* Location & Remote */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Preferred Location"
          type="text"
          placeholder="e.g., New York, NY"
          value={formData.location}
          onChange={(e) => handleInputChange("location", e.target.value)}
          icon={<MapPin size={16} />}
        />

        <div className="flex items-center pt-8">
          <input
            type="checkbox"
            id="remoteOk"
            checked={formData.remoteOk}
            onChange={(e) => handleInputChange("remoteOk", e.target.checked)}
            className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
          />
          <label htmlFor="remoteOk" className="ml-2 text-sm text-gray-700">
            Open to remote opportunities
          </label>
        </div>
      </div>

      {/* Salary Range */}
      <div>
        <label className="form-label mb-3 block">Salary Range (Optional)</label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Minimum Salary"
            type="number"
            placeholder="e.g., 80000"
            value={formData.minSalary}
            onChange={(e) => handleInputChange("minSalary", e.target.value)}
            icon={<DollarSign size={16} />}
          />

          <Input
            label="Maximum Salary"
            type="number"
            placeholder="e.g., 120000"
            value={formData.maxSalary}
            onChange={(e) => handleInputChange("maxSalary", e.target.value)}
            icon={<DollarSign size={16} />}
          />
        </div>
      </div>

      {/* Target Companies */}
      <Card>
        <Card.Header>
          <h3 className="text-lg font-medium text-gray-900">
            Target Companies (Optional)
          </h3>
          <p className="text-sm text-gray-600">
            Companies you'd love to work for
          </p>
        </Card.Header>
        <Card.Body>
          <div className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Add a company name"
                value={newCompany}
                onChange={(e) => setNewCompany(e.target.value)}
                onKeyPress={(e) =>
                  e.key === "Enter" && (e.preventDefault(), addTargetCompany())
                }
              />
              <Button
                type="button"
                variant="outline"
                icon={<Plus size={16} />}
                onClick={addTargetCompany}
              >
                Add
              </Button>
            </div>

            {formData.targetCompanies.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.targetCompanies.map((company, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                  >
                    {company}
                    <button
                      type="button"
                      onClick={() => removeTargetCompany(company)}
                      className="text-green-600 hover:text-green-800"
                    >
                      <X size={14} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </Card.Body>
      </Card>

      {/* Companies to Avoid */}
      <Card>
        <Card.Header>
          <h3 className="text-lg font-medium text-gray-900">
            Companies to Avoid (Optional)
          </h3>
          <p className="text-sm text-gray-600">
            Companies you don't want to apply to
          </p>
        </Card.Header>
        <Card.Body>
          <div className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Add a company to avoid"
                value={newAvoidCompany}
                onChange={(e) => setNewAvoidCompany(e.target.value)}
                onKeyPress={(e) =>
                  e.key === "Enter" && (e.preventDefault(), addAvoidCompany())
                }
              />
              <Button
                type="button"
                variant="outline"
                icon={<Plus size={16} />}
                onClick={addAvoidCompany}
              >
                Add
              </Button>
            </div>

            {formData.avoidCompanies.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.avoidCompanies.map((company, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm"
                  >
                    {company}
                    <button
                      type="button"
                      onClick={() => removeAvoidCompany(company)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <X size={14} />
                    </button>
                  </span>
                ))}
              </div>
            )}
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

        <Button type="submit">{isLast ? "Complete Setup" : "Next Step"}</Button>
      </div>
    </form>
  );
};

export default JobPreferences;
