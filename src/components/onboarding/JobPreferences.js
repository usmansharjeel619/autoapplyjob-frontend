import React, { useState, useEffect, useCallback, useRef } from "react";
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

  // Use a ref to track if we've already initialized from props
  const initializedRef = useRef(false);

  // Initialize form data from props only once
  useEffect(() => {
    if (!initializedRef.current && Object.keys(data).length > 0) {
      initializedRef.current = true;
      setFormData((prevFormData) => ({
        ...prevFormData,
        ...data,
      }));
    }
  }, [data]);

  // Memoize onDataChange to prevent infinite re-renders
  const memoizedOnDataChange = useCallback(onDataChange, []);

  // Only call onDataChange when formData actually changes
  useEffect(() => {
    if (initializedRef.current) {
      memoizedOnDataChange(formData);
    }
  }, [formData, memoizedOnDataChange]);

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
      showError("Please fill in all required fields");
      return;
    }

    onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Job Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Desired Job Title"
          placeholder="e.g., Software Engineer"
          value={formData.desiredJobTitle}
          onChange={(e) => handleInputChange("desiredJobTitle", e.target.value)}
          error={errors.desiredJobTitle}
          required
        />

        <Select
          label="Industry"
          value={formData.industry}
          onChange={(value) => handleInputChange("industry", value)}
          error={errors.industry}
          required
          options={[{ value: "", label: "Select industry" }, ...INDUSTRIES]}
        />
      </div>

      {/* Job & Work Types */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Job Types (Select all that apply)
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {JOB_TYPES.map((type) => (
              <button
                key={type.value}
                type="button"
                onClick={() => handleMultiSelect("jobTypes", type.value)}
                className={`p-3 rounded-lg border text-sm font-medium transition-colors ${
                  formData.jobTypes.includes(type.value)
                    ? "bg-black text-white border-black"
                    : "bg-white text-gray-700 border-gray-300 hover:border-gray-400"
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>
          {errors.jobTypes && (
            <p className="mt-1 text-sm text-red-600">{errors.jobTypes}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Work Arrangement (Select all that apply)
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {WORK_TYPES.map((type) => (
              <button
                key={type.value}
                type="button"
                onClick={() => handleMultiSelect("workTypes", type.value)}
                className={`p-3 rounded-lg border text-sm font-medium transition-colors ${
                  formData.workTypes.includes(type.value)
                    ? "bg-black text-white border-black"
                    : "bg-white text-gray-700 border-gray-300 hover:border-gray-400"
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>
          {errors.workTypes && (
            <p className="mt-1 text-sm text-red-600">{errors.workTypes}</p>
          )}
        </div>
      </div>

      {/* Location & Salary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Input
          label="Preferred Location"
          placeholder="e.g., New York, NY"
          value={formData.location}
          onChange={(e) => handleInputChange("location", e.target.value)}
          icon={<MapPin size={16} />}
        />

        <Input
          label="Minimum Salary"
          type="number"
          placeholder="50000"
          value={formData.minSalary}
          onChange={(e) => handleInputChange("minSalary", e.target.value)}
          icon={<DollarSign size={16} />}
        />

        <Input
          label="Maximum Salary"
          type="number"
          placeholder="120000"
          value={formData.maxSalary}
          onChange={(e) => handleInputChange("maxSalary", e.target.value)}
          icon={<DollarSign size={16} />}
        />
      </div>

      {/* Remote Work Preference */}
      <div className="flex items-center">
        <input
          type="checkbox"
          id="remoteOk"
          checked={formData.remoteOk}
          onChange={(e) => handleInputChange("remoteOk", e.target.checked)}
          className="h-4 w-4 text-black focus:ring-black border-gray-300 rounded"
        />
        <label htmlFor="remoteOk" className="ml-2 text-sm text-gray-700">
          I'm open to remote work opportunities
        </label>
      </div>
      {/* Navigation */}
      <div className="flex justify-between pt-6">
        {!isFirst && (
          <Button type="button" variant="outline" onClick={onBack}>
            Back
          </Button>
        )}
        <div className={isFirst ? "ml-auto" : ""}>
          <Button type="submit">{isLast ? "Complete Setup" : "Next"}</Button>
        </div>
      </div>
    </form>
  );
};

export default JobPreferences;
