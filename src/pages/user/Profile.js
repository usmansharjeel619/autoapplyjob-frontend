import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  MapPin,
  Phone,
  Mail,
  Linkedin,
  Github,
  Globe,
  Edit3,
  Save,
  X,
  Plus,
  Download,
  Upload,
  FileText,
  Eye,
  Trash2,
  RefreshCw,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useApp } from "../../context/AppContext";
import userService from "../../services/user.service";
import { EXPERIENCE_LEVELS, EDUCATION_LEVELS } from "../../utils/constants";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Select from "../../components/ui/Select";
import Card from "../../components/ui/Card";
import ProgressBar from "../../components/ui/ProgressBar";
import ResumeDataModal from "../../components/ui/ResumeDataModal"; // Import the new modal

const UserProfile = () => {
  const { user, updateUser } = useAuth();
  const { showSuccess, showError } = useApp();

  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [downloadingResume, setDownloadingResume] = useState(false);
  const [deletingResume, setDeletingResume] = useState(false);

  // NEW: State for the resume data modal
  const [showResumeDataModal, setShowResumeDataModal] = useState(false);

  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    currentJobTitle: "",
    experienceLevel: "",
    educationLevel: "",
    skills: [],
    extractedSkills: [],
    bio: "",
    linkedinUrl: "",
    githubUrl: "",
    portfolioUrl: "",
    resume: null,
    workExperience: [],
    education: [],
    certifications: [],
    projects: [],
    languages: [],
  });

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      console.log("Fetching profile data...");

      const response = await userService.getProfile();
      console.log("Profile response:", response);

      // Handle different response structures
      const userData = response.user || response.data || response;
      console.log("User data:", userData);

      // Set all profile data from database
      setProfileData({
        name: userData.user.name || "",
        email: userData.user.email || "",
        phone: userData.user.phone || "",
        location: userData.user.location || "",
        currentJobTitle: userData.user.currentJobTitle || "",
        experienceLevel: userData.user.experienceLevel || "",
        educationLevel: userData.user.educationLevel || "",
        skills: userData.user.skills || [],
        extractedSkills: userData.user.extractedSkills || [],
        bio: userData.user.bio || "",
        linkedinUrl: userData.user.linkedinUrl || "",
        githubUrl: userData.user.githubUrl || "",
        portfolioUrl: userData.user.portfolioUrl || "",
        // Resume information
        resume: userData.user.resume || null,
        // Parsed CV data
        workExperience: userData.user.workExperience || [],
        education: userData.user.education || [],
        certifications: userData.user.certifications || [],
        projects: userData.user.projects || [],
        languages: userData.user.languages || [],
      });

      // Update auth context with fresh data
      updateUser(userData);
    } catch (error) {
      console.error("Failed to fetch profile:", error);
      showError("Failed to load profile data");
    } finally {
      setLoading(false);
    }
  };

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
      setUploading(true);
      setUploadProgress(0);

      const response = await userService.uploadResume(file, (progressEvent) => {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        setUploadProgress(percentCompleted);
      });

      // Update profile data with new resume info
      setProfileData((prev) => ({
        ...prev,
        resume: response.data.resume,
      }));

      showSuccess("Resume uploaded successfully!");

      // Refresh profile to get updated data
      setTimeout(() => {
        fetchProfileData();
      }, 1000);
    } catch (error) {
      showError("Failed to upload resume");
      console.error("Resume upload error:", error);
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  // Handle resume download
  const handleDownloadResume = async () => {
    if (!profileData.resume?.originalName) {
      showError("No resume available for download");
      return;
    }

    try {
      setDownloadingResume(true);

      // Use the userService method instead of direct fetch
      const response = await userService.downloadResume();

      // Create blob and download
      const blob = new Blob([response.data], {
        type: profileData.resume.mimeType || "application/octet-stream",
      });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = profileData.resume.originalName;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      showSuccess("Resume downloaded successfully!");
    } catch (error) {
      console.error("Resume download error:", error);
      showError("Failed to download resume");
    } finally {
      setDownloadingResume(false);
    }
  };

  // NEW: Handle viewing resume details in modal
  const handleViewResumeDetails = () => {
    if (profileData.resume?.parsedData) {
      setShowResumeDataModal(true);
    } else {
      showError("No parsed resume data available");
    }
  };

  // Handle resume deletion
  const handleDeleteResume = async () => {
    if (
      !window.confirm(
        "Are you sure you want to delete your resume? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      setDeletingResume(true);

      await userService.deleteResume();

      setProfileData((prev) => ({
        ...prev,
        resume: null,
      }));

      showSuccess("Resume deleted successfully");
    } catch (error) {
      console.error("Resume deletion error:", error);
      showError("Failed to delete resume");
    } finally {
      setDeletingResume(false);
    }
  };

  const handleRefreshProfile = async () => {
    setRefreshing(true);
    await fetchProfileData();
    setRefreshing(false);
    showSuccess("Profile refreshed successfully");
  };

  const handleCancel = () => {
    setEditing(false);
    // Reset to original data
    fetchProfileData();
  };

  const getProfileCompleteness = () => {
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

    const completedFields = fields.filter((field) => {
      const value = profileData[field];
      return value && value.toString().trim().length > 0;
    });

    let percentage = (completedFields.length / fields.length) * 80; // 80% for basic fields

    // Add bonus for additional fields
    if (profileData.skills.length > 0) percentage += 10;
    if (profileData.resume) percentage += 10;

    return Math.min(Math.round(percentage), 100);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Unknown";
    return new Date(dateString).toLocaleDateString();
  };

  if (loading && !profileData.name) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  const completeness = getProfileCompleteness();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
          <p className="text-gray-600 mt-1">
            Manage your personal information and preferences
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={handleRefreshProfile}
            loading={refreshing}
            icon={<RefreshCw size={16} />}
          >
            Refresh
          </Button>
          {editing ? (
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button onClick={handleSave} loading={loading}>
                Save Changes
              </Button>
            </div>
          ) : (
            <Button onClick={() => setEditing(true)} icon={<Edit3 size={16} />}>
              Edit Profile
            </Button>
          )}
        </div>
      </div>

      {/* Profile Completeness */}
      <Card>
        <Card.Body>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Profile Completeness</h3>
            <span className="text-sm font-medium text-gray-600">
              {completeness}%
            </span>
          </div>
          <ProgressBar
            value={completeness}
            variant={completeness >= 80 ? "success" : "warning"}
            size="lg"
          />
          {completeness < 100 && (
            <p className="text-sm text-gray-600 mt-2">
              Complete your profile to improve job matching accuracy
            </p>
          )}
        </Card.Body>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Profile Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <Card>
            <Card.Header>
              <h3 className="text-lg font-semibold">Basic Information</h3>
            </Card.Header>
            <Card.Body>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Full Name"
                  value={profileData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  disabled={!editing}
                  icon={<User size={16} />}
                  required
                />
                <Input
                  label="Email"
                  type="email"
                  value={profileData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  disabled={true} // Email should not be editable
                  icon={<Mail size={16} />}
                />
                <Input
                  label="Phone"
                  value={profileData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  disabled={!editing}
                  icon={<Phone size={16} />}
                />
                <Input
                  label="Location"
                  value={profileData.location}
                  onChange={(e) =>
                    handleInputChange("location", e.target.value)
                  }
                  disabled={!editing}
                  icon={<MapPin size={16} />}
                />
                <Input
                  label="Current Job Title"
                  value={profileData.currentJobTitle}
                  onChange={(e) =>
                    handleInputChange("currentJobTitle", e.target.value)
                  }
                  disabled={!editing}
                />
                <Select
                  label="Experience Level"
                  value={profileData.experienceLevel}
                  onChange={(value) =>
                    handleInputChange("experienceLevel", value)
                  }
                  disabled={!editing}
                  options={[
                    { value: "", label: "Select experience level" },
                    ...EXPERIENCE_LEVELS,
                  ]}
                />
                <div className="md:col-span-2">
                  <Select
                    label="Education Level"
                    value={profileData.educationLevel}
                    onChange={(value) =>
                      handleInputChange("educationLevel", value)
                    }
                    disabled={!editing}
                    options={[
                      { value: "", label: "Select education level" },
                      ...EDUCATION_LEVELS,
                    ]}
                  />
                </div>
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
                  className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm placeholder-gray-400 shadow-sm transition-colors focus:border-black focus:outline-none focus:ring-1 focus:ring-black disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500"
                  placeholder="Tell us about yourself..."
                />
              </div>
            </Card.Body>
          </Card>

          {/* Professional Links */}
          <Card>
            <Card.Header>
              <h3 className="text-lg font-semibold">Professional Links</h3>
            </Card.Header>
            <Card.Body>
              <div className="space-y-4">
                <Input
                  label="LinkedIn URL"
                  value={profileData.linkedinUrl}
                  onChange={(e) =>
                    handleInputChange("linkedinUrl", e.target.value)
                  }
                  disabled={!editing}
                  icon={<Linkedin size={16} />}
                  placeholder="https://linkedin.com/in/yourprofile"
                />
                <Input
                  label="GitHub URL"
                  value={profileData.githubUrl}
                  onChange={(e) =>
                    handleInputChange("githubUrl", e.target.value)
                  }
                  disabled={!editing}
                  icon={<Github size={16} />}
                  placeholder="https://github.com/yourusername"
                />
                <Input
                  label="Portfolio URL"
                  value={profileData.portfolioUrl}
                  onChange={(e) =>
                    handleInputChange("portfolioUrl", e.target.value)
                  }
                  disabled={!editing}
                  icon={<Globe size={16} />}
                  placeholder="https://yourportfolio.com"
                />
              </div>
            </Card.Body>
          </Card>

          {/* Skills */}
          <Card>
            <Card.Header>
              <h3 className="text-lg font-semibold">Skills</h3>
            </Card.Header>
            <Card.Body>
              <div className="space-y-4">
                {editing && (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Add a skill..."
                      className="flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          handleSkillAdd(e.target.value);
                          e.target.value = "";
                        }
                      }}
                    />
                    <Button
                      variant="outline"
                      icon={<Plus size={16} />}
                      onClick={() => {
                        const input = document.querySelector(
                          'input[placeholder="Add a skill..."]'
                        );
                        if (input.value) {
                          handleSkillAdd(input.value);
                          input.value = "";
                        }
                      }}
                    >
                      Add
                    </Button>
                  </div>
                )}

                <div className="flex flex-wrap gap-2">
                  {profileData.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-800"
                    >
                      {skill}
                      {editing && (
                        <button
                          onClick={() => handleSkillRemove(skill)}
                          className="ml-1 text-gray-500 hover:text-red-500"
                        >
                          <X size={12} />
                        </button>
                      )}
                    </span>
                  ))}
                </div>

                {profileData.skills.length === 0 && (
                  <p className="text-gray-500 text-sm">No skills added yet</p>
                )}
              </div>
            </Card.Body>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Resume/CV Section - ENHANCED */}
          <Card>
            <Card.Header>
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <FileText size={20} />
                Resume/CV
              </h3>
            </Card.Header>
            <Card.Body>
              {profileData.resume ? (
                <div className="space-y-4">
                  {/* Resume Info */}
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-start gap-3">
                      <FileText className="w-8 h-8 text-green-600 flex-shrink-0 mt-1" />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-green-800 truncate">
                          {profileData.resume.originalName}
                        </h4>
                        <div className="mt-1 space-y-1">
                          <p className="text-xs text-green-600">
                            Size: {formatFileSize(profileData.resume.fileSize)}
                          </p>
                          <p className="text-xs text-green-600">
                            Uploaded:{" "}
                            {formatDate(profileData.resume.uploadedAt)}
                          </p>
                          {profileData.resume.parsedAt && (
                            <p className="text-xs text-green-600">
                              Parsed: {formatDate(profileData.resume.parsedAt)}
                            </p>
                          )}
                          <div className="flex items-center gap-1 mt-2">
                            {profileData.resume.parseStatus === "success" ? (
                              <>
                                <CheckCircle
                                  size={12}
                                  className="text-green-600"
                                />
                                <span className="text-xs text-green-600">
                                  Successfully parsed
                                </span>
                              </>
                            ) : profileData.resume.parseStatus === "failed" ? (
                              <>
                                <AlertCircle
                                  size={12}
                                  className="text-red-500"
                                />
                                <span className="text-xs text-red-500">
                                  Parsing failed
                                </span>
                              </>
                            ) : (
                              <>
                                <div className="w-3 h-3 border border-yellow-500 border-t-transparent rounded-full animate-spin" />
                                <span className="text-xs text-yellow-600">
                                  Processing...
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Resume Actions */}
                  <div className="flex flex-col gap-2">
                    <Button
                      variant="outline"
                      onClick={handleDownloadResume}
                      loading={downloadingResume}
                      icon={<Download size={16} />}
                      className="w-full justify-center"
                    >
                      Download Resume
                    </Button>

                    {profileData.resume.parsedData && (
                      <Button
                        variant="outline"
                        onClick={handleViewResumeDetails}
                        icon={<Eye size={16} />}
                        className="w-full justify-center"
                      >
                        View Parsed Data
                      </Button>
                    )}
                     </div>

                  {/* Upload New Resume */}
                  <div className="pt-4 border-t border-gray-200">
                    <label htmlFor="resume-upload" className="block">
                      <input
                        id="resume-upload"
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={handleResumeUpload}
                        className="hidden"
                        disabled={uploading}
                      />
                      <Button
                        as="span"
                        variant="outline"
                        loading={uploading}
                        icon={<Upload size={16} />}
                        className="w-full justify-center cursor-pointer"
                      >
                        {uploading ? "Uploading..." : "Upload New Resume"}
                      </Button>
                    </label>

                    {uploading && (
                      <div className="mt-3">
                        <ProgressBar
                          value={uploadProgress}
                          showValue={true}
                          size="sm"
                          label="Upload Progress"
                        />
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center py-6">
                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h4 className="text-sm font-medium text-gray-900 mb-2">
                    No Resume Uploaded
                  </h4>
                  <p className="text-sm text-gray-600 mb-4">
                    Upload your resume to improve job matching
                  </p>

                  <label htmlFor="resume-upload-new">
                    <input
                      id="resume-upload-new"
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleResumeUpload}
                      className="hidden"
                      disabled={uploading}
                    />
                    <Button
                      as="span"
                      loading={uploading}
                      icon={<Upload size={16} />}
                      className="cursor-pointer"
                    >
                      {uploading ? "Uploading..." : "Upload Resume"}
                    </Button>
                  </label>

                  {uploading && (
                    <div className="mt-4">
                      <ProgressBar
                        value={uploadProgress}
                        showValue={true}
                        size="sm"
                        label="Upload Progress"
                      />
                    </div>
                  )}

                  <p className="text-xs text-gray-500 mt-3">
                    Supported formats: PDF, DOC, DOCX (Max 5MB)
                  </p>
                </div>
              )}
            </Card.Body>
          </Card>

          {/* Account Status */}
          <Card>
            <Card.Header>
              <h3 className="text-lg font-semibold">Account Status</h3>
            </Card.Header>
            <Card.Body>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Email Verified</span>
                  <span className="flex items-center gap-1">
                    <CheckCircle size={16} className="text-green-600" />
                    <span className="text-sm text-green-600">Verified</span>
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Profile Status</span>
                  <span className="text-sm text-gray-900">Active</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Member Since</span>
                  <span className="text-sm text-gray-900">
                    {formatDate(user?.createdAt)}
                  </span>
                </div>
              </div>
            </Card.Body>
          </Card>
        </div>
      </div>

      {/* Resume Data Modal */}
      <ResumeDataModal
        isOpen={showResumeDataModal}
        onClose={() => setShowResumeDataModal(false)}
        resumeData={profileData.resume}
      />
    </div>
  );
};

export default UserProfile;
