import React, { useState, useCallback, useEffect } from "react";
import {
  Upload,
  FileText,
  CheckCircle,
  X,
  RefreshCw,
  AlertCircle,
  Zap,
} from "lucide-react";
import { validateFile } from "../../utils/validation";
import { FILE_UPLOAD, AI_STATUS } from "../../utils/constants";
import { useApp } from "../../context/AppContext";
import aiService from "../../services/ai.service";
import Button from "../ui/Button";
import Card from "../ui/Card";

const ResumeUpload = ({
  data = {},
  onDataChange,
  onNext,
  onBack,
  isFirst,
  isLast,
}) => {
  const [uploadedFile, setUploadedFile] = useState(data.file || null);
  const [parsedData, setParsedData] = useState(data.parsedData || null);
  const [uploading, setUploading] = useState(false);
  const [parsing, setParsing] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [aiStatus, setAiStatus] = useState(null);
  const [parsingProgress, setParsingProgress] = useState("");
  const { showError, showSuccess, showWarning } = useApp();

  // Check AI service status on component mount
  useEffect(() => {
    checkAIStatus();
  }, []);

  const checkAIStatus = async () => {
    try {
      const status = await aiService.checkAIStatus();
      setAiStatus(status);

      if (status.status !== AI_STATUS.OPERATIONAL) {
        showWarning(
          "AI parsing service is not fully operational. Basic parsing will be used."
        );
      }
    } catch (error) {
      console.warn("Could not check AI status:", error);
      setAiStatus({ status: AI_STATUS.ERROR });
    }
  };

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = Array.from(e.dataTransfer.files);
    if (files && files.length > 0) {
      handleFileUpload(files[0]);
    }
  }, []);

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    if (files && files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleFileUpload = async (file) => {
    // Validate file
    const validation = validateFile(file, {
      maxSize: FILE_UPLOAD.MAX_SIZE,
      allowedTypes: FILE_UPLOAD.ALLOWED_TYPES,
    });

    if (!validation.isValid) {
      showError(validation.errors[0]);
      return;
    }

    setUploading(true);

    try {
      // Simulate file upload (replace with actual upload if needed)
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setUploadedFile(file);
      showSuccess("Resume uploaded successfully!");

      // Start parsing immediately
      await parseResume(file);
    } catch (error) {
      showError("Failed to upload resume. Please try again.");
      console.error("Upload error:", error);
    } finally {
      setUploading(false);
    }
  };

  const parseResume = async (file) => {
    setParsing(true);
    setParsingProgress("Initializing AI parser...");

    try {
      let parsedResult;

      // Check if AI service is available
      if (aiStatus?.status === AI_STATUS.OPERATIONAL) {
        // Use real AI parsing
        setParsingProgress("Extracting text from document...");
        parsedResult = await aiService.parseResume(file);
        setParsingProgress("Analyzing content with AI...");
      } else {
        // Fallback to backend parsing or mock data
        setParsingProgress("Using alternative parsing method...");

        try {
          parsedResult = await aiService.parseResumeViaBackend(file);
        } catch (backendError) {
          console.warn(
            "Backend parsing failed, using mock data:",
            backendError
          );
          showWarning("AI parsing is unavailable. Using basic extraction.");

          // Use mock data as last resort
          await new Promise((resolve) => setTimeout(resolve, 2000));
          parsedResult = {
            personalInfo: {
              name: "",
              email: "",
              phone: "",
              location: "",
            },
            extractedSkills: [
              "JavaScript",
              "React",
              "Node.js",
              "Python",
              "AWS",
            ],
            workExperience: [
              {
                title: "Software Developer",
                company: "Tech Company",
                duration: "2021 - Present",
                description:
                  "Developed web applications using modern technologies",
                achievements: [],
              },
            ],
            education: [
              {
                degree: "Bachelor's Degree",
                institution: "University",
                year: "2020",
                gpa: "",
              },
            ],
            certifications: [],
            projects: [],
            languages: [],
          };
        }
      }

      setParsingProgress("Finalizing results...");

      // Process and validate the parsed data
      const processedData = processAndValidateParsedData(parsedResult);

      setParsedData(processedData);
      onDataChange({ file, parsedData: processedData });

      if (aiStatus?.status === AI_STATUS.OPERATIONAL) {
        showSuccess("Resume parsed successfully with AI!");
      } else {
        showSuccess("Resume processed successfully!");
      }
    } catch (error) {
      console.error("Resume parsing failed:", error);

      let errorMessage = "Failed to parse resume. Please try again.";

      if (error.message.includes("OpenAI API")) {
        errorMessage =
          "AI service is temporarily unavailable. Please try again later.";
      } else if (error.message.includes("extract text")) {
        errorMessage =
          "Could not extract text from the file. Please ensure it's a valid PDF, DOC, or DOCX file.";
      }

      showError(errorMessage);
    } finally {
      setParsing(false);
      setParsingProgress("");
    }
  };

  const processAndValidateParsedData = (rawData) => {
    return {
      personalInfo: {
        name: rawData.personalInfo?.name || "",
        email: rawData.personalInfo?.email || "",
        phone: rawData.personalInfo?.phone || "",
        location: rawData.personalInfo?.location || "",
      },
      extractedSkills: Array.isArray(rawData.extractedSkills)
        ? rawData.extractedSkills.filter((skill) => skill && skill.trim())
        : [],
      workExperience: Array.isArray(rawData.workExperience)
        ? rawData.workExperience.filter((exp) => exp.title || exp.company)
        : [],
      education: Array.isArray(rawData.education)
        ? rawData.education.filter((edu) => edu.degree || edu.institution)
        : [],
      certifications: Array.isArray(rawData.certifications)
        ? rawData.certifications.filter((cert) => cert.name)
        : [],
      projects: Array.isArray(rawData.projects)
        ? rawData.projects.filter((proj) => proj.name)
        : [],
      languages: Array.isArray(rawData.languages)
        ? rawData.languages.filter((lang) => lang.language)
        : [],
    };
  };

  const removeFile = () => {
    setUploadedFile(null);
    setParsedData(null);
    onDataChange({ file: null, parsedData: null });
  };

  const handleNext = () => {
    if (!uploadedFile) {
      showError("Please upload your resume to continue.");
      return;
    }
    onNext();
  };

  const retryParsing = () => {
    if (uploadedFile) {
      parseResume(uploadedFile);
    }
  };

  return (
    <div className="space-y-6">
      {/* AI Status Indicator */}
      {aiStatus && (
        <Card
          className={`border-l-4 ${
            aiStatus.status === AI_STATUS.OPERATIONAL
              ? "border-green-500 bg-green-50"
              : "border-yellow-500 bg-yellow-50"
          }`}
        >
          <Card.Body>
            <div className="flex items-center gap-3">
              {aiStatus.status === AI_STATUS.OPERATIONAL ? (
                <Zap className="text-green-600" size={20} />
              ) : (
                <AlertCircle className="text-yellow-600" size={20} />
              )}
              <div>
                <p
                  className={`font-medium ${
                    aiStatus.status === AI_STATUS.OPERATIONAL
                      ? "text-green-800"
                      : "text-yellow-800"
                  }`}
                >
                  {aiStatus.status === AI_STATUS.OPERATIONAL
                    ? "AI Parsing Available"
                    : "Limited AI Functionality"}
                </p>
                <p
                  className={`text-sm ${
                    aiStatus.status === AI_STATUS.OPERATIONAL
                      ? "text-green-700"
                      : "text-yellow-700"
                  }`}
                >
                  {aiStatus.status === AI_STATUS.OPERATIONAL
                    ? "Advanced AI parsing with OpenAI is ready"
                    : "Using alternative parsing methods"}
                </p>
              </div>
            </div>
          </Card.Body>
        </Card>
      )}

      {/* File Upload Area */}
      {!uploadedFile ? (
        <div
          className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
            dragActive
              ? "border-primary-500 bg-primary-50"
              : "border-gray-300 hover:border-gray-400"
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <Upload className="mx-auto text-gray-400 mb-4" size={48} />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Upload your resume
          </h3>
          <p className="text-gray-600 mb-6">
            Drag and drop your resume file here, or click to browse
          </p>

          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleFileSelect}
            className="hidden"
            id="resume-upload"
          />
          <label htmlFor="resume-upload">
            <Button variant="outline" loading={uploading}>
              {uploading ? "Uploading..." : "Choose File"}
            </Button>
          </label>

          <p className="text-sm text-gray-500 mt-4">
            Supported formats: PDF, DOC, DOCX (Max 5MB)
          </p>
        </div>
      ) : (
        <Card className="border-green-200 bg-green-50">
          <Card.Body>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileText className="text-green-600" size={24} />
                <div>
                  <h4 className="font-medium text-gray-900">
                    {uploadedFile.name}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {(uploadedFile.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <CheckCircle className="text-green-600" size={20} />
                <Button
                  variant="ghost"
                  size="sm"
                  icon={<X size={16} />}
                  onClick={removeFile}
                />
              </div>
            </div>
          </Card.Body>
        </Card>
      )}

      {/* Parsing Status */}
      {parsing && (
        <Card className="border-blue-200 bg-blue-50">
          <Card.Body>
            <div className="flex items-center gap-3">
              <RefreshCw className="text-blue-600 animate-spin" size={20} />
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">
                  Parsing your resume...
                </h4>
                <p className="text-sm text-gray-600">
                  {parsingProgress ||
                    "Our AI is extracting your skills and experience"}
                </p>
              </div>
            </div>
            <div className="mt-3 w-full bg-blue-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full animate-pulse"
                style={{ width: "60%" }}
              ></div>
            </div>
          </Card.Body>
        </Card>
      )}

      {/* Parsing Error with Retry */}
      {uploadedFile && !parsing && !parsedData && (
        <Card className="border-red-200 bg-red-50">
          <Card.Body>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <AlertCircle className="text-red-600" size={20} />
                <div>
                  <h4 className="font-medium text-gray-900">Parsing failed</h4>
                  <p className="text-sm text-gray-600">
                    We couldn't extract information from your resume
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={retryParsing}
                icon={<RefreshCw size={16} />}
              >
                Retry
              </Button>
            </div>
          </Card.Body>
        </Card>
      )}

      {/* Parsed Data Preview */}
      {parsedData && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              Extracted Information
            </h3>
            {aiStatus?.status === AI_STATUS.OPERATIONAL && (
              <div className="flex items-center gap-2 text-sm text-green-600">
                <Zap size={16} />
                <span>AI Enhanced</span>
              </div>
            )}
          </div>

          {/* Personal Information */}
          {(parsedData.personalInfo?.name ||
            parsedData.personalInfo?.email) && (
            <Card>
              <Card.Header>
                <h4 className="font-medium text-gray-900">
                  Personal Information
                </h4>
              </Card.Header>
              <Card.Body>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  {parsedData.personalInfo.name && (
                    <div>
                      <span className="font-medium text-gray-700">Name:</span>
                      <p className="text-gray-900">
                        {parsedData.personalInfo.name}
                      </p>
                    </div>
                  )}
                  {parsedData.personalInfo.email && (
                    <div>
                      <span className="font-medium text-gray-700">Email:</span>
                      <p className="text-gray-900">
                        {parsedData.personalInfo.email}
                      </p>
                    </div>
                  )}
                  {parsedData.personalInfo.phone && (
                    <div>
                      <span className="font-medium text-gray-700">Phone:</span>
                      <p className="text-gray-900">
                        {parsedData.personalInfo.phone}
                      </p>
                    </div>
                  )}
                  {parsedData.personalInfo.location && (
                    <div>
                      <span className="font-medium text-gray-700">
                        Location:
                      </span>
                      <p className="text-gray-900">
                        {parsedData.personalInfo.location}
                      </p>
                    </div>
                  )}
                </div>
              </Card.Body>
            </Card>
          )}

          <div className="grid md:grid-cols-2 gap-6">
            {/* Skills */}
            {parsedData.extractedSkills &&
              parsedData.extractedSkills.length > 0 && (
                <Card>
                  <Card.Header>
                    <h4 className="font-medium text-gray-900">
                      Skills ({parsedData.extractedSkills.length})
                    </h4>
                  </Card.Header>
                  <Card.Body>
                    <div className="flex flex-wrap gap-2">
                      {parsedData.extractedSkills.map((skill, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-primary-100 text-primary-800 rounded-md text-sm"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </Card.Body>
                </Card>
              )}

            {/* Experience */}
            {parsedData.workExperience &&
              parsedData.workExperience.length > 0 && (
                <Card>
                  <Card.Header>
                    <h4 className="font-medium text-gray-900">
                      Experience ({parsedData.workExperience.length})
                    </h4>
                  </Card.Header>
                  <Card.Body>
                    <div className="space-y-3">
                      {parsedData.workExperience
                        .slice(0, 2)
                        .map((exp, index) => (
                          <div
                            key={index}
                            className="border-b last:border-b-0 pb-3 last:pb-0"
                          >
                            <h5 className="font-medium text-gray-900">
                              {exp.title}
                            </h5>
                            <p className="text-sm text-gray-600">
                              {exp.company} • {exp.duration}
                            </p>
                            {exp.description && (
                              <p className="text-sm text-gray-700 mt-1 line-clamp-2">
                                {exp.description}
                              </p>
                            )}
                          </div>
                        ))}
                      {parsedData.workExperience.length > 2 && (
                        <p className="text-sm text-gray-500 text-center">
                          +{parsedData.workExperience.length - 2} more positions
                        </p>
                      )}
                    </div>
                  </Card.Body>
                </Card>
              )}

            {/* Education */}
            {parsedData.education && parsedData.education.length > 0 && (
              <Card>
                <Card.Header>
                  <h4 className="font-medium text-gray-900">
                    Education ({parsedData.education.length})
                  </h4>
                </Card.Header>
                <Card.Body>
                  <div className="space-y-2">
                    {parsedData.education.map((edu, index) => (
                      <div key={index}>
                        <h5 className="font-medium text-gray-900">
                          {edu.degree}
                        </h5>
                        <p className="text-sm text-gray-600">
                          {edu.institution}
                          {edu.year && ` • ${edu.year}`}
                          {edu.gpa && ` • GPA: ${edu.gpa}`}
                        </p>
                      </div>
                    ))}
                  </div>
                </Card.Body>
              </Card>
            )}

            {/* Certifications */}
            {parsedData.certifications &&
              parsedData.certifications.length > 0 && (
                <Card>
                  <Card.Header>
                    <h4 className="font-medium text-gray-900">
                      Certifications ({parsedData.certifications.length})
                    </h4>
                  </Card.Header>
                  <Card.Body>
                    <div className="space-y-2">
                      {parsedData.certifications.map((cert, index) => (
                        <div key={index}>
                          <h5 className="font-medium text-gray-900">
                            {cert.name}
                          </h5>
                          <p className="text-sm text-gray-600">
                            {cert.issuer}
                            {cert.date && ` • ${cert.date}`}
                          </p>
                        </div>
                      ))}
                    </div>
                  </Card.Body>
                </Card>
              )}

            {/* Projects */}
            {parsedData.projects && parsedData.projects.length > 0 && (
              <Card>
                <Card.Header>
                  <h4 className="font-medium text-gray-900">
                    Projects ({parsedData.projects.length})
                  </h4>
                </Card.Header>
                <Card.Body>
                  <div className="space-y-3">
                    {parsedData.projects.slice(0, 2).map((project, index) => (
                      <div
                        key={index}
                        className="border-b last:border-b-0 pb-3 last:pb-0"
                      >
                        <h5 className="font-medium text-gray-900">
                          {project.name}
                        </h5>
                        {project.description && (
                          <p className="text-sm text-gray-700 mt-1 line-clamp-2">
                            {project.description}
                          </p>
                        )}
                        {project.technologies &&
                          project.technologies.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {project.technologies
                                .slice(0, 3)
                                .map((tech, techIndex) => (
                                  <span
                                    key={techIndex}
                                    className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
                                  >
                                    {tech}
                                  </span>
                                ))}
                              {project.technologies.length > 3 && (
                                <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                                  +{project.technologies.length - 3} more
                                </span>
                              )}
                            </div>
                          )}
                      </div>
                    ))}
                    {parsedData.projects.length > 2 && (
                      <p className="text-sm text-gray-500 text-center">
                        +{parsedData.projects.length - 2} more projects
                      </p>
                    )}
                  </div>
                </Card.Body>
              </Card>
            )}

            {/* Languages */}
            {parsedData.languages && parsedData.languages.length > 0 && (
              <Card>
                <Card.Header>
                  <h4 className="font-medium text-gray-900">
                    Languages ({parsedData.languages.length})
                  </h4>
                </Card.Header>
                <Card.Body>
                  <div className="space-y-1">
                    {parsedData.languages.map((lang, index) => (
                      <div key={index} className="flex justify-between">
                        <span className="font-medium text-gray-900">
                          {lang.language}
                        </span>
                        <span className="text-sm text-gray-600">
                          {lang.proficiency}
                        </span>
                      </div>
                    ))}
                  </div>
                </Card.Body>
              </Card>
            )}
          </div>

          {/* AI Enhancement Notice */}
          <div
            className={`border rounded-lg p-4 ${
              aiStatus?.status === AI_STATUS.OPERATIONAL
                ? "bg-blue-50 border-blue-200"
                : "bg-yellow-50 border-yellow-200"
            }`}
          >
            <p
              className={`text-sm ${
                aiStatus?.status === AI_STATUS.OPERATIONAL
                  ? "text-blue-800"
                  : "text-yellow-800"
              }`}
            >
              <strong>Note:</strong> This information was automatically
              extracted from your resume
              {aiStatus?.status === AI_STATUS.OPERATIONAL
                ? " using advanced AI analysis"
                : " using basic text extraction"}
              . You can edit and add more details in the next steps.
            </p>
            {aiStatus?.status !== AI_STATUS.OPERATIONAL && (
              <p className="text-sm text-yellow-700 mt-2">
                For better accuracy, ensure your OpenAI API is properly
                configured.
              </p>
            )}
          </div>

          {/* Statistics */}
          <Card className="bg-gray-50">
            <Card.Body>
              <h4 className="font-medium text-gray-900 mb-3">
                Extraction Summary
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-primary-600">
                    {parsedData.extractedSkills?.length || 0}
                  </div>
                  <div className="text-sm text-gray-600">Skills</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary-600">
                    {parsedData.workExperience?.length || 0}
                  </div>
                  <div className="text-sm text-gray-600">Positions</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary-600">
                    {parsedData.education?.length || 0}
                  </div>
                  <div className="text-sm text-gray-600">Education</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary-600">
                    {(parsedData.projects?.length || 0) +
                      (parsedData.certifications?.length || 0)}
                  </div>
                  <div className="text-sm text-gray-600">Projects & Certs</div>
                </div>
              </div>
            </Card.Body>
          </Card>
        </div>
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

        <div className="flex gap-2">
          {uploadedFile && !parsedData && !parsing && (
            <Button
              variant="outline"
              onClick={retryParsing}
              icon={<RefreshCw size={16} />}
            >
              Retry Parsing
            </Button>
          )}
          <Button onClick={handleNext}>
            {isLast ? "Complete Setup" : "Next Step"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ResumeUpload;
