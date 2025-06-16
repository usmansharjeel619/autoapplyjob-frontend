import React, { useState, useEffect } from "react";
import { Plus, X, Search, Zap, Code, Briefcase } from "lucide-react";
import { COMMON_SKILLS } from "../../utils/constants";
import { skillsValidation } from "../../utils/validation";
import { useApp } from "../../context/AppContext";
import Button from "../ui/Button";
import Input from "../ui/Input";
import Card from "../ui/Card";

const SkillsSetup = ({
  data = {},
  onDataChange,
  onNext,
  onBack,
  isFirst,
  isLast,
}) => {
  const [formData, setFormData] = useState({
    primarySkills: [],
    secondarySkills: [],
    keywordsToAvoid: [],
    experienceLevel: {},
    certifications: [],
    ...data,
  });
  const [errors, setErrors] = useState({});
  const [skillInput, setSkillInput] = useState("");
  const [secondarySkillInput, setSecondarySkillInput] = useState("");
  const [avoidKeywordInput, setAvoidKeywordInput] = useState("");
  const [certificationInput, setCertificationInput] = useState("");
  const [skillSuggestions, setSkillSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const { showError } = useApp();

  useEffect(() => {
    onDataChange(formData);
  }, [formData, onDataChange]);

  // Filter skill suggestions based on input
  useEffect(() => {
    if (skillInput.length > 1) {
      const filtered = COMMON_SKILLS.filter(
        (skill) =>
          skill.toLowerCase().includes(skillInput.toLowerCase()) &&
          !formData.primarySkills.includes(skill) &&
          !formData.secondarySkills.includes(skill)
      );
      setSkillSuggestions(filtered.slice(0, 8));
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  }, [skillInput, formData.primarySkills, formData.secondarySkills]);

  const addPrimarySkill = (skill = skillInput.trim()) => {
    if (skill && !formData.primarySkills.includes(skill)) {
      setFormData((prev) => ({
        ...prev,
        primarySkills: [...prev.primarySkills, skill],
      }));
      setSkillInput("");
      setShowSuggestions(false);

      // Clear error when user adds skill
      if (errors.primarySkills) {
        setErrors((prev) => ({ ...prev, primarySkills: "" }));
      }
    }
  };

  const removePrimarySkill = (skill) => {
    setFormData((prev) => ({
      ...prev,
      primarySkills: prev.primarySkills.filter((s) => s !== skill),
    }));
  };

  const addSecondarySkill = () => {
    const skill = secondarySkillInput.trim();
    if (
      skill &&
      !formData.secondarySkills.includes(skill) &&
      !formData.primarySkills.includes(skill)
    ) {
      setFormData((prev) => ({
        ...prev,
        secondarySkills: [...prev.secondarySkills, skill],
      }));
      setSecondarySkillInput("");
    }
  };

  const removeSecondarySkill = (skill) => {
    setFormData((prev) => ({
      ...prev,
      secondarySkills: prev.secondarySkills.filter((s) => s !== skill),
    }));
  };

  const addAvoidKeyword = () => {
    const keyword = avoidKeywordInput.trim();
    if (keyword && !formData.keywordsToAvoid.includes(keyword)) {
      setFormData((prev) => ({
        ...prev,
        keywordsToAvoid: [...prev.keywordsToAvoid, keyword],
      }));
      setAvoidKeywordInput("");
    }
  };

  const removeAvoidKeyword = (keyword) => {
    setFormData((prev) => ({
      ...prev,
      keywordsToAvoid: prev.keywordsToAvoid.filter((k) => k !== keyword),
    }));
  };

  const addCertification = () => {
    const cert = certificationInput.trim();
    if (cert && !formData.certifications.includes(cert)) {
      setFormData((prev) => ({
        ...prev,
        certifications: [...prev.certifications, cert],
      }));
      setCertificationInput("");
    }
  };

  const removeCertification = (cert) => {
    setFormData((prev) => ({
      ...prev,
      certifications: prev.certifications.filter((c) => c !== cert),
    }));
  };

  const setExperienceLevel = (skill, level) => {
    setFormData((prev) => ({
      ...prev,
      experienceLevel: {
        ...prev.experienceLevel,
        [skill]: level,
      },
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate form
    const validation = skillsValidation.validate(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    if (formData.primarySkills.length === 0) {
      showError("Please add at least one primary skill");
      setErrors({ primarySkills: "Please add at least one primary skill" });
      return;
    }

    onNext();
  };

  const skillCategories = [
    {
      name: "Programming Languages",
      skills: [
        "JavaScript",
        "Python",
        "Java",
        "C++",
        "TypeScript",
        "Go",
        "Rust",
        "PHP",
      ],
      icon: <Code size={16} />,
    },
    {
      name: "Frameworks & Libraries",
      skills: [
        "React",
        "Angular",
        "Vue.js",
        "Node.js",
        "Django",
        "Spring",
        "Laravel",
        "Express",
      ],
      icon: <Zap size={16} />,
    },
    {
      name: "Business Skills",
      skills: [
        "Project Management",
        "Leadership",
        "Communication",
        "Analysis",
        "Strategy",
      ],
      icon: <Briefcase size={16} />,
    },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Primary Skills */}
      <Card>
        <Card.Header>
          <h3 className="text-lg font-medium text-gray-900">
            Primary Skills <span className="text-error">*</span>
          </h3>
          <p className="text-sm text-gray-600">
            Your core competencies and strongest skills
          </p>
        </Card.Header>
        <Card.Body>
          <div className="space-y-4">
            <div className="relative">
              <Input
                placeholder="Type a skill and press Enter"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addPrimarySkill();
                  }
                }}
                icon={<Search size={16} />}
              />

              {/* Skill Suggestions */}
              {showSuggestions && skillSuggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 z-10 bg-white border border-gray-200 rounded-md shadow-lg mt-1">
                  {skillSuggestions.map((skill, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => addPrimarySkill(skill)}
                      className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm"
                    >
                      {skill}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Added Primary Skills */}
            {formData.primarySkills.length > 0 && (
              <div className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  {formData.primarySkills.map((skill, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-2 px-3 py-2 bg-primary-100 text-primary-800 rounded-lg text-sm font-medium"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => removePrimarySkill(skill)}
                        className="text-primary-600 hover:text-primary-800"
                      >
                        <X size={14} />
                      </button>
                    </span>
                  ))}
                </div>

                {/* Experience Level for Primary Skills */}
                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-gray-900">
                    Experience Level
                  </h4>
                  {formData.primarySkills.map((skill) => (
                    <div
                      key={skill}
                      className="flex items-center justify-between"
                    >
                      <span className="text-sm text-gray-700">{skill}</span>
                      <div className="flex gap-1">
                        {["Beginner", "Intermediate", "Advanced", "Expert"].map(
                          (level) => (
                            <button
                              key={level}
                              type="button"
                              onClick={() => setExperienceLevel(skill, level)}
                              className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                                formData.experienceLevel[skill] === level
                                  ? "bg-primary-600 text-white"
                                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                              }`}
                            >
                              {level}
                            </button>
                          )
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {errors.primarySkills && (
              <span className="form-error">{errors.primarySkills}</span>
            )}
          </div>
        </Card.Body>
      </Card>

      {/* Quick Add from Categories */}
      <Card>
        <Card.Header>
          <h3 className="text-lg font-medium text-gray-900">
            Popular Skills by Category
          </h3>
          <p className="text-sm text-gray-600">
            Click to quickly add relevant skills
          </p>
        </Card.Header>
        <Card.Body>
          <div className="space-y-4">
            {skillCategories.map((category) => (
              <div key={category.name}>
                <div className="flex items-center gap-2 mb-3">
                  {category.icon}
                  <h4 className="font-medium text-gray-900">{category.name}</h4>
                </div>
                <div className="flex flex-wrap gap-2">
                  {category.skills.map((skill) => (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => addPrimarySkill(skill)}
                      disabled={
                        formData.primarySkills.includes(skill) ||
                        formData.secondarySkills.includes(skill)
                      }
                      className={`px-3 py-1 rounded-md text-sm transition-colors ${
                        formData.primarySkills.includes(skill) ||
                        formData.secondarySkills.includes(skill)
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "bg-gray-100 text-gray-700 hover:bg-primary-100 hover:text-primary-700"
                      }`}
                    >
                      {skill}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Card.Body>
      </Card>

      {/* Secondary Skills */}
      <Card>
        <Card.Header>
          <h3 className="text-lg font-medium text-gray-900">
            Secondary Skills
          </h3>
          <p className="text-sm text-gray-600">
            Additional skills you have experience with
          </p>
        </Card.Header>
        <Card.Body>
          <div className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Add secondary skills"
                value={secondarySkillInput}
                onChange={(e) => setSecondarySkillInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addSecondarySkill();
                  }
                }}
              />
              <Button
                type="button"
                variant="outline"
                icon={<Plus size={16} />}
                onClick={addSecondarySkill}
              >
                Add
              </Button>
            </div>

            {formData.secondarySkills.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.secondarySkills.map((skill, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-md text-sm"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => removeSecondarySkill(skill)}
                      className="text-blue-600 hover:text-blue-800"
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

      {/* Keywords to Avoid */}
      <Card>
        <Card.Header>
          <h3 className="text-lg font-medium text-gray-900">
            Keywords to Avoid
          </h3>
          <p className="text-sm text-gray-600">
            Job requirements or keywords you want to avoid (e.g., "sales",
            "travel required")
          </p>
        </Card.Header>
        <Card.Body>
          <div className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="e.g., sales, cold calling, extensive travel"
                value={avoidKeywordInput}
                onChange={(e) => setAvoidKeywordInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addAvoidKeyword();
                  }
                }}
              />
              <Button
                type="button"
                variant="outline"
                icon={<Plus size={16} />}
                onClick={addAvoidKeyword}
              >
                Add
              </Button>
            </div>

            {formData.keywordsToAvoid.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.keywordsToAvoid.map((keyword, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-red-100 text-red-800 rounded-md text-sm"
                  >
                    {keyword}
                    <button
                      type="button"
                      onClick={() => removeAvoidKeyword(keyword)}
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

      {/* Certifications */}
      <Card>
        <Card.Header>
          <h3 className="text-lg font-medium text-gray-900">
            Certifications (Optional)
          </h3>
          <p className="text-sm text-gray-600">
            Professional certifications and credentials
          </p>
        </Card.Header>
        <Card.Body>
          <div className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="e.g., AWS Certified Developer, PMP, Google Analytics"
                value={certificationInput}
                onChange={(e) => setCertificationInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addCertification();
                  }
                }}
              />
              <Button
                type="button"
                variant="outline"
                icon={<Plus size={16} />}
                onClick={addCertification}
              >
                Add
              </Button>
            </div>

            {formData.certifications.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.certifications.map((cert, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 rounded-md text-sm"
                  >
                    {cert}
                    <button
                      type="button"
                      onClick={() => removeCertification(cert)}
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

      {/* Summary */}
      {formData.primarySkills.length > 0 && (
        <Card className="bg-primary-50 border-primary-200">
          <Card.Body>
            <h3 className="text-lg font-medium text-primary-900 mb-2">
              Skills Summary
            </h3>
            <div className="text-sm text-primary-800">
              <p>
                <strong>Primary Skills:</strong> {formData.primarySkills.length}{" "}
                skills added
              </p>
              {formData.secondarySkills.length > 0 && (
                <p>
                  <strong>Secondary Skills:</strong>{" "}
                  {formData.secondarySkills.length} skills added
                </p>
              )}
              {formData.certifications.length > 0 && (
                <p>
                  <strong>Certifications:</strong>{" "}
                  {formData.certifications.length} added
                </p>
              )}
            </div>
          </Card.Body>
        </Card>
      )}

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

export default SkillsSetup;
