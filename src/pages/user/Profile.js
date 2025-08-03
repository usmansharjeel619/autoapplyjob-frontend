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
  Eye,
  RefreshCw,
  Star,
  Award,
  Calendar,
  Building,
  GraduationCap,
  Zap,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useApp } from "../../context/AppContext";
import userService from "../../services/user.service";
import { EXPERIENCE_LEVELS, EDUCATION_LEVELS } from "../../utils/constants";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import Select from "../../components/ui/Select";

const UserProfile = () => {
  const { user, updateUser } = useAuth();
  const { showSuccess, showError } = useApp();

  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

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
    // Resume data
    resume: null,
    // Parsed data from CV
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

      await userService.uploadResume(file, (progress) => {
        setUploadProgress(progress);
      });

      showSuccess("Resume uploaded and parsed successfully!");

      // Refresh profile to get updated resume data and extracted skills
      await fetchProfileData();
    } catch (error) {
      showError("Failed to upload resume");
      console.error("Resume upload error:", error);
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleDownloadResume = () => {
    if (profileData.resume?.url) {
      window.open(profileData.resume.url, "_blank");
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

    let completed = 0;
    fields.forEach((field) => {
      if (profileData[field] && profileData[field].toString().trim()) {
        completed++;
      }
    });

    if (profileData.skills.length > 0) completed++;
    if (profileData.resume) completed++;

    return Math.round((completed / (fields.length + 2)) * 100);
  };

  if (loading && !profileData.name) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
              <p className="text-gray-600">Loading your profile...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const completeness = getProfileCompleteness();

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
            <p className="text-gray-600">
              Manage your information for better job matching
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              onClick={handleRefreshProfile}
              disabled={refreshing}
              icon={
                <RefreshCw
                  className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`}
                />
              }
            >
              Refresh
            </Button>
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

        {/* Profile Completeness */}
        <Card>
          <Card.Body className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Profile Completeness
              </h3>
              <span className="text-2xl font-bold text-blue-600">
                {completeness}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${completeness}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              Complete your profile for better job matching
            </p>
          </Card.Body>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Basic Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information */}
            <Card>
              <Card.Header>
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Personal Information
                </h3>
              </Card.Header>
              <Card.Body className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Full Name"
                    value={profileData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    disabled={!editing}
                    required
                  />
                  <Input
                    label="Email"
                    type="email"
                    value={profileData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    disabled={true} // Email usually shouldn't be editable
                  />
                  <Input
                    label="Phone"
                    value={profileData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    disabled={!editing}
                  />
                  <Input
                    label="Location"
                    value={profileData.location}
                    onChange={(e) =>
                      handleInputChange("location", e.target.value)
                    }
                    disabled={!editing}
                    placeholder="City, Country"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    onChange={(e) =>
                      handleInputChange("experienceLevel", e.target.value)
                    }
                    disabled={!editing}
                    options={[
                      { value: "", label: "Select experience level" },
                      ...EXPERIENCE_LEVELS,
                    ]}
                  />
                </div>

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

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bio
                  </label>
                  <textarea
                    value={profileData.bio}
                    onChange={(e) => handleInputChange("bio", e.target.value)}
                    disabled={!editing}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                    placeholder="Tell us about yourself..."
                  />
                </div>
              </Card.Body>
            </Card>

            {/* Work Experience from CV */}
            {profileData.workExperience.length > 0 && (
              <Card>
                <Card.Header>
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <Briefcase className="w-5 h-5" />
                    Work Experience (from CV)
                  </h3>
                </Card.Header>
                <Card.Body>
                  <div className="space-y-4">
                    {profileData.workExperience.map((exp, index) => (
                      <div
                        key={index}
                        className="border-l-4 border-blue-200 pl-4 py-2"
                      >
                        <h4 className="font-semibold text-gray-900">
                          {exp.title}
                        </h4>
                        <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                          <Building className="w-4 h-4" />
                          <span>{exp.company}</span>
                          <Calendar className="w-4 h-4 ml-2" />
                          <span>{exp.duration}</span>
                        </div>
                        {exp.description && (
                          <p className="text-sm text-gray-700">
                            {exp.description}
                          </p>
                        )}
                        {exp.achievements && exp.achievements.length > 0 && (
                          <ul className="list-disc list-inside text-sm text-gray-600 mt-2">
                            {exp.achievements.map((achievement, i) => (
                              <li key={i}>{achievement}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                </Card.Body>
              </Card>
            )}

            {/* Education from CV */}
            {profileData.education.length > 0 && (
              <Card>
                <Card.Header>
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <GraduationCap className="w-5 h-5" />
                    Education (from CV)
                  </h3>
                </Card.Header>
                <Card.Body>
                  <div className="space-y-4">
                    {profileData.education.map((edu, index) => (
                      <div
                        key={index}
                        className="border-l-4 border-green-200 pl-4 py-2"
                      >
                        <h4 className="font-semibold text-gray-900">
                          {edu.degree}
                        </h4>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Building className="w-4 h-4" />
                          <span>{edu.institution}</span>
                          {edu.year && (
                            <>
                              <Calendar className="w-4 h-4 ml-2" />
                              <span>{edu.year}</span>
                            </>
                          )}
                          {edu.gpa && (
                            <span className="ml-2 text-blue-600 font-medium">
                              GPA: {edu.gpa}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </Card.Body>
              </Card>
            )}

            {/* Projects from CV */}
            {profileData.projects.length > 0 && (
              <Card>
                <Card.Header>
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <Zap className="w-5 h-5" />
                    Projects (from CV)
                  </h3>
                </Card.Header>
                <Card.Body>
                  <div className="space-y-4">
                    {profileData.projects.map((project, index) => (
                      <div
                        key={index}
                        className="border-l-4 border-purple-200 pl-4 py-2"
                      >
                        <h4 className="font-semibold text-gray-900">
                          {project.name}
                        </h4>
                        {project.description && (
                          <p className="text-sm text-gray-700 mt-1">
                            {project.description}
                          </p>
                        )}
                        {project.technologies &&
                          project.technologies.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-2">
                              {project.technologies.map((tech, i) => (
                                <span
                                  key={i}
                                  className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs"
                                >
                                  {tech}
                                </span>
                              ))}
                            </div>
                          )}
                        {project.duration && (
                          <p className="text-sm text-gray-500 mt-1">
                            {project.duration}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </Card.Body>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Resume Section */}
            <Card>
              <Card.Header>
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Resume
                </h3>
              </Card.Header>
              <Card.Body>
                {profileData.resume ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-green-900">
                          {profileData.resume.originalName || "Resume uploaded"}
                        </p>
                        <p className="text-xs text-green-600">
                          Uploaded:{" "}
                          {new Date(
                            profileData.resume.uploadedAt || Date.now()
                          ).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleDownloadResume}
                        icon={<Download className="w-4 h-4" />}
                        className="flex-1"
                      >
                        Download
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          window.open(profileData.resume.url, "_blank")
                        }
                        icon={<Eye className="w-4 h-4" />}
                        className="flex-1"
                      >
                        View
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600 mb-3">No resume uploaded</p>
                  </div>
                )}

                {/* Upload Section */}
                <div className="mt-4">
                  {uploading ? (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Uploading and parsing...</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${uploadProgress}%` }}
                        ></div>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <label className="block">
                        <input
                          type="file"
                          accept=".pdf,.doc,.docx"
                          onChange={handleResumeUpload}
                          className="hidden"
                        />
                        <Button
                          variant={profileData.resume ? "outline" : "primary"}
                          size="sm"
                          icon={<Upload className="w-4 h-4" />}
                          className="w-full"
                          as="span"
                        >
                          {profileData.resume
                            ? "Replace Resume"
                            : "Upload Resume"}
                        </Button>
                      </label>
                      <p className="text-xs text-gray-500 mt-2 text-center">
                        PDF, DOC, or DOCX (Max 5MB)
                      </p>
                    </div>
                  )}
                </div>
              </Card.Body>
            </Card>

            {/* Skills Section */}
            <Card>
              <Card.Header>
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Star className="w-5 h-5" />
                  Skills
                </h3>
              </Card.Header>
              <Card.Body>
                {/* Extracted Skills from CV */}
                {profileData.extractedSkills.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                      <Zap className="w-4 h-4 text-blue-600" />
                      From your CV
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {profileData.extractedSkills.map((skill, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Manual Skills */}
                {profileData.skills.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">
                      Added Skills
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {profileData.skills.map((skill, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium flex items-center gap-1"
                        >
                          {skill}
                          {editing && (
                            <button
                              onClick={() => handleSkillRemove(skill)}
                              className="hover:text-red-600"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          )}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {editing && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Add Skills
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Enter a skill"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            handleSkillAdd(e.target.value.trim());
                            e.target.value = "";
                          }
                        }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Press Enter to add a skill
                    </p>
                  </div>
                )}

                {profileData.skills.length === 0 &&
                  profileData.extractedSkills.length === 0 && (
                    <div className="text-center py-4">
                      <Star className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">
                        {editing
                          ? "Add skills to improve job matching"
                          : "No skills added yet"}
                      </p>
                    </div>
                  )}
              </Card.Body>
            </Card>

            {/* Certifications */}
            {profileData.certifications.length > 0 && (
              <Card>
                <Card.Header>
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <Award className="w-5 h-5" />
                    Certifications
                  </h3>
                </Card.Header>
                <Card.Body>
                  <div className="space-y-3">
                    {profileData.certifications.map((cert, index) => (
                      <div
                        key={index}
                        className="border-l-4 border-yellow-200 pl-3 py-2"
                      >
                        <h4 className="font-medium text-gray-900">
                          {cert.name}
                        </h4>
                        {cert.organization && (
                          <p className="text-sm text-gray-600">
                            {cert.organization}
                          </p>
                        )}
                        {cert.date && (
                          <p className="text-xs text-gray-500">{cert.date}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </Card.Body>
              </Card>
            )}

            {/* Languages */}
            {profileData.languages.length > 0 && (
              <Card>
                <Card.Header>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Languages
                  </h3>
                </Card.Header>
                <Card.Body>
                  <div className="space-y-2">
                    {profileData.languages.map((lang, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center"
                      >
                        <span className="text-sm font-medium text-gray-900">
                          {lang.language}
                        </span>
                        <span className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded">
                          {lang.proficiency}
                        </span>
                      </div>
                    ))}
                  </div>
                </Card.Body>
              </Card>
            )}

            {/* Social Links */}
            <Card>
              <Card.Header>
                <h3 className="text-lg font-semibold text-gray-900">
                  Social Links
                </h3>
              </Card.Header>
              <Card.Body className="space-y-4">
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
              </Card.Body>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
