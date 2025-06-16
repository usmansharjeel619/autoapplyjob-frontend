import React, { useState, useEffect } from "react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  GraduationCap,
  Upload,
  Download,
  Edit3,
  Save,
  X,
  FileText,
  Award,
  Target,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useApp } from "../../context/AppContext";
import { EXPERIENCE_LEVELS, EDUCATION_LEVELS } from "../../utils/constants";
import { basicInfoValidation } from "../../utils/validation";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Select from "../../components/ui/Select";
import Card from "../../components/ui/Card";
import ProgressBar from "../../components/ui/ProgressBar";

const Profile = () => {
  const { user, updateUser } = useAuth();
  const { showSuccess, showError } = useApp();
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    currentJobTitle: "",
    experienceLevel: "",
    educationLevel: "",
    bio: "",
    skills: [],
    certifications: [],
    ...user,
  });
  const [errors, setErrors] = useState({});
  const [completionScore, setCompletionScore] = useState(0);

  useEffect(() => {
    calculateCompletionScore();
  }, [profileData]);

  const calculateCompletionScore = () => {
    const fields = [
      "name",
      "email",
      "phone",
      "location",
      "currentJobTitle",
      "experienceLevel",
      "educationLevel",
      "bio",
    ];
    const filledFields = fields.filter((field) => profileData[field]?.trim());
    const skillsScore = profileData.skills?.length > 0 ? 1 : 0;
    const certScore = profileData.certifications?.length > 0 ? 1 : 0;

    const totalScore =
      ((filledFields.length + skillsScore + certScore) / (fields.length + 2)) *
      100;
    setCompletionScore(Math.round(totalScore));
  };

  const handleInputChange = (field, value) => {
    setProfileData((prev) => ({ ...prev, [field]: value }));

    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleSave = async () => {
    // Validate form
    const validation = basicInfoValidation.validate(profileData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setLoading(true);
    try {
      await updateUser(profileData);
      showSuccess("Profile updated successfully!");
      setEditMode(false);
    } catch (error) {
      showError("Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setProfileData({ ...user });
    setEditMode(false);
    setErrors({});
  };

  const handleResumeUpload = () => {
    // TODO: Implement resume upload
    showSuccess("Resume upload feature coming soon!");
  };

  const handleResumeDownload = () => {
    // TODO: Implement resume download
    showSuccess("Resume download feature coming soon!");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
          <p className="text-gray-600 mt-1">
            Manage your personal information and preferences
          </p>
        </div>

        <div className="flex items-center gap-3">
          {editMode ? (
            <>
              <Button
                variant="outline"
                onClick={handleCancel}
                icon={<X size={16} />}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                loading={loading}
                icon={<Save size={16} />}
              >
                Save Changes
              </Button>
            </>
          ) : (
            <Button
              onClick={() => setEditMode(true)}
              icon={<Edit3 size={16} />}
            >
              Edit Profile
            </Button>
          )}
        </div>
      </div>

      {/* Profile Completion */}
      <Card>
        <Card.Body>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Profile Completion
            </h3>
            <span className="text-sm font-medium text-primary-600">
              {completionScore}%
            </span>
          </div>
          <ProgressBar
            value={completionScore}
            variant={
              completionScore >= 80
                ? "success"
                : completionScore >= 50
                ? "warning"
                : "error"
            }
          />
          <p className="text-sm text-gray-600 mt-2">
            {completionScore >= 80
              ? "Great! Your profile is well-optimized for job matching."
              : completionScore >= 50
              ? "Good start! Add more details to improve your job matches."
              : "Complete your profile to get better job recommendations."}
          </p>
        </Card.Body>
      </Card>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Profile Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <Card>
            <Card.Header>
              <div className="flex items-center gap-2">
                <User className="text-primary-600" size={20} />
                <h3 className="text-lg font-semibold text-gray-900">
                  Basic Information
                </h3>
              </div>
            </Card.Header>
            <Card.Body>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Full Name"
                  value={profileData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  error={errors.name}
                  disabled={!editMode}
                  required
                />

                <Input
                  label="Email Address"
                  type="email"
                  value={profileData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  error={errors.email}
                  disabled={!editMode}
                  icon={<Mail size={16} />}
                  required
                />

                <Input
                  label="Phone Number"
                  type="tel"
                  value={profileData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  error={errors.phone}
                  disabled={!editMode}
                  icon={<Phone size={16} />}
                  required
                />

                <Input
                  label="Location"
                  value={profileData.location}
                  onChange={(e) =>
                    handleInputChange("location", e.target.value)
                  }
                  disabled={!editMode}
                  icon={<MapPin size={16} />}
                  placeholder="City, State/Country"
                />
              </div>
            </Card.Body>
          </Card>

          {/* Professional Information */}
          <Card>
            <Card.Header>
              <div className="flex items-center gap-2">
                <Briefcase className="text-primary-600" size={20} />
                <h3 className="text-lg font-semibold text-gray-900">
                  Professional Information
                </h3>
              </div>
            </Card.Header>
            <Card.Body>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <Input
                  label="Current Job Title"
                  value={profileData.currentJobTitle}
                  onChange={(e) =>
                    handleInputChange("currentJobTitle", e.target.value)
                  }
                  error={errors.currentJobTitle}
                  disabled={!editMode}
                  placeholder="e.g., Senior Software Engineer"
                  required
                />

                <Select
                  label="Years of Experience"
                  options={EXPERIENCE_LEVELS}
                  value={profileData.experienceLevel}
                  onChange={(value) =>
                    handleInputChange("experienceLevel", value)
                  }
                  error={errors.experienceLevel}
                  disabled={!editMode}
                  required
                />
              </div>

              <div className="mb-6">
                <Select
                  label="Education Level"
                  options={EDUCATION_LEVELS}
                  value={profileData.educationLevel}
                  onChange={(value) =>
                    handleInputChange("educationLevel", value)
                  }
                  error={errors.educationLevel}
                  disabled={!editMode}
                  required
                />
              </div>

              <div>
                <label className="form-label">Professional Bio</label>
                <textarea
                  className="form-input form-textarea"
                  placeholder="Tell us about your professional background, achievements, and career goals..."
                  value={profileData.bio || ""}
                  onChange={(e) => handleInputChange("bio", e.target.value)}
                  disabled={!editMode}
                  rows={4}
                />
              </div>
            </Card.Body>
          </Card>

          {/* Skills */}
          <Card>
            <Card.Header>
              <div className="flex items-center gap-2">
                <Target className="text-primary-600" size={20} />
                <h3 className="text-lg font-semibold text-gray-900">Skills</h3>
              </div>
            </Card.Header>
            <Card.Body>
              {profileData.skills && profileData.skills.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {profileData.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-primary-100 text-primary-800 rounded-md text-sm font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Target className="mx-auto text-gray-400 mb-4" size={48} />
                  <h4 className="text-lg font-medium text-gray-900 mb-2">
                    No skills added
                  </h4>
                  <p className="text-gray-600 mb-4">
                    Add your skills to improve job matching
                  </p>
                  <Button variant="outline">Add Skills</Button>
                </div>
              )}
            </Card.Body>
          </Card>

          {/* Certifications */}
          <Card>
            <Card.Header>
              <div className="flex items-center gap-2">
                <Award className="text-primary-600" size={20} />
                <h3 className="text-lg font-semibold text-gray-900">
                  Certifications
                </h3>
              </div>
            </Card.Header>
            <Card.Body>
              {profileData.certifications &&
              profileData.certifications.length > 0 ? (
                <div className="space-y-3">
                  {profileData.certifications.map((cert, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                    >
                      <Award className="text-green-600" size={20} />
                      <span className="font-medium text-gray-900">{cert}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Award className="mx-auto text-gray-400 mb-4" size={48} />
                  <h4 className="text-lg font-medium text-gray-900 mb-2">
                    No certifications added
                  </h4>
                  <p className="text-gray-600 mb-4">
                    Add your professional certifications
                  </p>
                  <Button variant="outline">Add Certifications</Button>
                </div>
              )}
            </Card.Body>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Profile Picture */}
          <Card>
            <Card.Header>
              <h3 className="text-lg font-semibold text-gray-900">
                Profile Picture
              </h3>
            </Card.Header>
            <Card.Body>
              <div className="text-center">
                <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-primary-800 font-bold text-2xl">
                    {profileData.name
                      ? profileData.name.charAt(0).toUpperCase()
                      : "U"}
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  icon={<Upload size={16} />}
                  disabled={!editMode}
                >
                  Upload Photo
                </Button>
              </div>
            </Card.Body>
          </Card>

          {/* Resume */}
          <Card>
            <Card.Header>
              <h3 className="text-lg font-semibold text-gray-900">Resume</h3>
            </Card.Header>
            <Card.Body>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <FileText className="text-blue-600" size={20} />
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">
                      Current Resume
                    </h4>
                    <p className="text-sm text-gray-600">
                      Last updated 2 days ago
                    </p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    icon={<Upload size={16} />}
                    onClick={handleResumeUpload}
                    className="flex-1"
                  >
                    Update
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    icon={<Download size={16} />}
                    onClick={handleResumeDownload}
                    className="flex-1"
                  >
                    Download
                  </Button>
                </div>
              </div>
            </Card.Body>
          </Card>

          {/* Account Settings */}
          <Card>
            <Card.Header>
              <h3 className="text-lg font-semibold text-gray-900">
                Account Settings
              </h3>
            </Card.Header>
            <Card.Body>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">
                    Email Notifications
                  </span>
                  <input type="checkbox" defaultChecked className="rounded" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">
                    SMS Notifications
                  </span>
                  <input type="checkbox" className="rounded" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">
                    Profile Visibility
                  </span>
                  <select className="text-sm border rounded px-2 py-1">
                    <option>Public</option>
                    <option>Private</option>
                  </select>
                </div>
              </div>
            </Card.Body>
          </Card>

          {/* Quick Stats */}
          <Card>
            <Card.Header>
              <h3 className="text-lg font-semibold text-gray-900">
                Profile Stats
              </h3>
            </Card.Header>
            <Card.Body>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Profile Views</span>
                  <span className="text-sm font-medium">47</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Job Matches</span>
                  <span className="text-sm font-medium">156</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Applications</span>
                  <span className="text-sm font-medium">23</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Response Rate</span>
                  <span className="text-sm font-medium text-green-600">
                    68%
                  </span>
                </div>
              </div>
            </Card.Body>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;
