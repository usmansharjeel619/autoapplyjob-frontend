import React, { useState, useEffect } from "react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  FileText,
  Edit,
  Save,
  Upload,
  Download,
  X,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useApp } from "../../context/AppContext";
import userService from "../../services/user.service";
import {
  EXPERIENCE_LEVELS,
  EDUCATION_LEVELS,
  COMMON_SKILLS,
} from "../../utils/constants";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import Select from "../../components/ui/Select";

const UserProfile = () => {
  const { user, updateUser } = useAuth();
  const { showSuccess, showError } = useApp();
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [uploadingResume, setUploadingResume] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    currentJobTitle: "",
    experienceLevel: "",
    educationLevel: "",
    skills: [],
    bio: "",
    linkedinUrl: "",
    githubUrl: "",
    portfolioUrl: "",
  });

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        location: user.location || "",
        currentJobTitle: user.currentJobTitle || "",
        experienceLevel: user.experienceLevel || "",
        educationLevel: user.educationLevel || "",
        skills: user.skills || [],
        bio: user.bio || "",
        linkedinUrl: user.linkedinUrl || "",
        githubUrl: user.githubUrl || "",
        portfolioUrl: user.portfolioUrl || "",
      });
    }
  }, [user]);

  const handleInputChange = (field, value) => {
    setProfileData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSkillAdd = (skill) => {
    if (skill && !profileData.skills.includes(skill)) {
      setProfileData((prev) => ({
        ...prev,
        skills: [...prev.skills, skill],
      }));
    }
  };

  const handleSkillRemove = (skillToRemove) => {
    setProfileData((prev) => ({
      ...prev,
      skills: prev.skills.filter((skill) => skill !== skillToRemove),
    }));
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const updatedUser = await userService.updateProfile(profileData);
      updateUser(updatedUser);
      setEditing(false);
      showSuccess("Profile updated successfully");
    } catch (error) {
      showError("Failed to update profile");
      console.error("Profile update error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleResumeUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (!allowedTypes.includes(file.type)) {
      showError("Please upload a PDF, DOC, or DOCX file");
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      showError("File size must be less than 5MB");
      return;
    }

    try {
      setUploadingResume(true);
      setUploadProgress(0);

      await userService.uploadResume(file, (progress) => {
        setUploadProgress(progress);
      });

      showSuccess("Resume uploaded successfully");
      // Refresh user data to get updated resume info
      const updatedProfile = await userService.getProfile();
      updateUser(updatedProfile);
    } catch (error) {
      showError("Failed to upload resume");
      console.error("Resume upload error:", error);
    } finally {
      setUploadingResume(false);
      setUploadProgress(0);
    }
  };

  const handleCancel = () => {
    setEditing(false);
    // Reset to original user data
    if (user) {
      setProfileData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        location: user.location || "",
        currentJobTitle: user.currentJobTitle || "",
        experienceLevel: user.experienceLevel || "",
        educationLevel: user.educationLevel || "",
        skills: user.skills || [],
        bio: user.bio || "",
        linkedinUrl: user.linkedinUrl || "",
        githubUrl: user.githubUrl || "",
        portfolioUrl: user.portfolioUrl || "",
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
          <p className="text-gray-600">
            Manage your personal information and job preferences
          </p>
        </div>

        <div className="flex items-center space-x-3">
          {editing ? (
            <>
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={loading}>
                <Save className="w-4 h-4 mr-2" />
                {loading ? "Saving..." : "Save Changes"}
              </Button>
            </>
          ) : (
            <Button onClick={() => setEditing(true)}>
              <Edit className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Picture and Basic Info */}
        <Card>
          <Card.Body className="text-center">
            <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
              {user?.profilePicture ? (
                <img
                  src={user.profilePicture}
                  alt="Profile"
                  className="w-24 h-24 rounded-full object-cover"
                />
              ) : (
                <User className="w-12 h-12 text-gray-400" />
              )}
            </div>

            <h3 className="text-lg font-semibold text-gray-900">
              {user?.name}
            </h3>
            <p className="text-gray-600">
              {user?.currentJobTitle || "Job Seeker"}
            </p>
            <p className="text-sm text-gray-500 mt-1">{user?.location}</p>

            {/* Profile Completeness */}
            <div className="mt-6">
              <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                <span>Profile Completeness</span>
                <span>{user?.profileCompleteness || 0}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${user?.profileCompleteness || 0}%` }}
                ></div>
              </div>
            </div>
          </Card.Body>
        </Card>

        {/* Main Profile Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information */}
          <Card>
            <Card.Header>
              <h3 className="text-lg font-semibold text-gray-900">
                Personal Information
              </h3>
            </Card.Header>
            <Card.Body>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Full Name"
                  value={profileData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  disabled={!editing}
                  icon={<User className="w-4 h-4" />}
                />

                <Input
                  label="Email Address"
                  type="email"
                  value={profileData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  disabled={!editing}
                  icon={<Mail className="w-4 h-4" />}
                />

                <Input
                  label="Phone Number"
                  type="tel"
                  value={profileData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  disabled={!editing}
                  icon={<Phone className="w-4 h-4" />}
                />

                <Input
                  label="Location"
                  value={profileData.location}
                  onChange={(e) =>
                    handleInputChange("location", e.target.value)
                  }
                  disabled={!editing}
                  icon={<MapPin className="w-4 h-4" />}
                  placeholder="City, State/Country"
                />
              </div>
            </Card.Body>
          </Card>

          {/* Professional Information */}
          <Card>
            <Card.Header>
              <h3 className="text-lg font-semibold text-gray-900">
                Professional Information
              </h3>
            </Card.Header>
            <Card.Body>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Current Job Title"
                  value={profileData.currentJobTitle}
                  onChange={(e) =>
                    handleInputChange("currentJobTitle", e.target.value)
                  }
                  disabled={!editing}
                  icon={<Briefcase className="w-4 h-4" />}
                />

                <Select
                  label="Experience Level"
                  value={profileData.experienceLevel}
                  onChange={(e) =>
                    handleInputChange("experienceLevel", e.target.value)
                  }
                  disabled={!editing}
                  options={[
                    { value: "", label: "Select experience level" },
                    ...EXPERIENCE_LEVELS,
                  ]}
                />

                <Select
                  label="Education Level"
                  value={profileData.educationLevel}
                  onChange={(e) =>
                    handleInputChange("educationLevel", e.target.value)
                  }
                  disabled={!editing}
                  options={[
                    { value: "", label: "Select education level" },
                    ...EDUCATION_LEVELS,
                  ]}
                />
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bio
                </label>
                <textarea
                  value={profileData.bio}
                  onChange={(e) => handleInputChange("bio", e.target.value)}
                  disabled={!editing}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                  placeholder="Tell us about yourself, your experience, and career goals..."
                />
              </div>
            </Card.Body>
          </Card>

          {/* Skills */}
          <Card>
            <Card.Header>
              <h3 className="text-lg font-semibold text-gray-900">Skills</h3>
            </Card.Header>
            <Card.Body>
              {editing && (
                <div className="mb-4">
                  <Select
                    placeholder="Add a skill..."
                    onChange={(e) => {
                      if (e.target.value) {
                        handleSkillAdd(e.target.value);
                        e.target.value = "";
                      }
                    }}
                    options={[
                      { value: "", label: "Select a skill to add" },
                      ...COMMON_SKILLS.map((skill) => ({
                        value: skill,
                        label: skill,
                      })),
                    ]}
                  />
                </div>
              )}

              <div className="flex flex-wrap gap-2">
                {profileData.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                  >
                    {skill}
                    {editing && (
                      <button
                        onClick={() => handleSkillRemove(skill)}
                        className="ml-2 text-blue-600 hover:text-blue-800"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </span>
                ))}
              </div>

              {profileData.skills.length === 0 && (
                <p className="text-gray-500 text-sm">
                  {editing
                    ? "Add skills to improve job matching"
                    : "No skills added yet"}
                </p>
              )}
            </Card.Body>
          </Card>

          {/* Social Links */}
          <Card>
            <Card.Header>
              <h3 className="text-lg font-semibold text-gray-900">
                Social Links
              </h3>
            </Card.Header>
            <Card.Body>
              <div className="space-y-4">
                <Input
                  label="LinkedIn URL"
                  type="url"
                  value={profileData.linkedinUrl}
                  onChange={(e) =>
                    handleInputChange("linkedinUrl", e.target.value)
                  }
                  disabled={!editing}
                  placeholder="https://linkedin.com/in/yourprofile"
                />

                <Input
                  label="GitHub URL"
                  type="url"
                  value={profileData.githubUrl}
                  onChange={(e) =>
                    handleInputChange("githubUrl", e.target.value)
                  }
                  disabled={!editing}
                  placeholder="https://github.com/yourusername"
                />

                <Input
                  label="Portfolio URL"
                  type="url"
                  value={profileData.portfolioUrl}
                  onChange={(e) =>
                    handleInputChange("portfolioUrl", e.target.value)
                  }
                  disabled={!editing}
                  placeholder="https://yourportfolio.com"
                />
              </div>
            </Card.Body>
          </Card>
        </div>
      </div>

      {/* Resume Section */}
      <Card>
        <Card.Header>
          <h3 className="text-lg font-semibold text-gray-900">Resume</h3>
        </Card.Header>
        <Card.Body>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <FileText className="w-8 h-8 text-gray-400" />
              <div>
                {user?.resumeFileName ? (
                  <>
                    <p className="font-medium text-gray-900">
                      {user.resumeFileName}
                    </p>
                    <p className="text-sm text-gray-500">
                      Uploaded on{" "}
                      {new Date(user.resumeUploadedAt).toLocaleDateString()}
                    </p>
                  </>
                ) : (
                  <p className="text-gray-600">No resume uploaded</p>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-3">
              {user?.resumeUrl && (
                <Button
                  variant="outline"
                  size="sm"
                  href={user.resumeUrl}
                  target="_blank"
                  className="flex items-center space-x-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Download</span>
                </Button>
              )}

              <div className="relative">
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleResumeUpload}
                  disabled={uploadingResume}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <Button
                  size="sm"
                  disabled={uploadingResume}
                  className="flex items-center space-x-2"
                >
                  <Upload className="w-4 h-4" />
                  <span>
                    {uploadingResume ? "Uploading..." : "Upload Resume"}
                  </span>
                </Button>
              </div>
            </div>
          </div>

          {uploadingResume && (
            <div className="mt-4">
              <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                <span>Uploading resume...</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            </div>
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

export default UserProfile;
