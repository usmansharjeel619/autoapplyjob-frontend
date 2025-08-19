import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  Upload,
  FileText,
  CheckCircle,
  X,
  AlertCircle,
  Bot,
} from "lucide-react";
import { useApp } from "../../context/AppContext";
import { apiPost } from "../../services/api";
import aiService from "../../services/ai.service";
import { AI_STATUS } from "../../utils/constants";
import Button from "../ui/Button";
import ProgressBar from "../ui/ProgressBar";

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
  const [uploadProgress, setUploadProgress] = useState(0);
  const [parsing, setParsing] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [aiStatus, setAiStatus] = useState(null);
  const [parsingProgress, setParsingProgress] = useState("");
  const { showError, showSuccess, showWarning } = useApp();

  // Ref for the hidden file input
  const fileInputRef = useRef(null);

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

  // Handle clicking the upload area or button
  const handleUploadClick = () => {
    if (fileInputRef.current && !uploading) {
      fileInputRef.current.click();
    }
  };

  const handleFileUpload = async (file) => {
    // Validate file type
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!allowedTypes.includes(file.type)) {
      showError("Please upload a PDF, DOC, or DOCX file.");
      return;
    }

    // Validate file size (5MB limit)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      showError("File size must be less than 5MB.");
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append("resume", file);

      // First upload the file
      const uploadResponse = await apiPost("/user/resume", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(progress);
        },
      });

      if (uploadResponse.status === 200) {
        showSuccess("Resume uploaded successfully!");
        setUploadedFile(file);

        // Now parse the resume
        await parseResume(file);
      }
    } catch (error) {
      console.error("Upload failed:", error);
      showError("Upload failed. Please try again.");
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const parseResume = async (file) => {
    setParsing(true);
    setParsingProgress("Starting AI analysis...");

    try {
      const formData = new FormData();
      formData.append("resume", file);

      setParsingProgress("Extracting text from resume...");

      const response = await aiService.parseResumeViaBackend(file);

      setParsingProgress("Processing extracted information...");

      const processedData = processAndValidateParsedData(response);

      setParsedData(processedData);
      onDataChange({
        file: file,
        parsedData: processedData,
        uploadStatus: "completed",
        parseStatus: "success",
      });

      setParsingProgress("Resume analysis completed!");
      showSuccess("Resume parsed successfully!");
    } catch (error) {
      console.error("Parsing failed:", error);
      showError("Failed to analyze resume. Please try again.");

      // Update data with error status
      onDataChange({
        file: file,
        parsedData: null,
        uploadStatus: "completed",
        parseStatus: "failed",
        error: error.message,
      });
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
    setUploadProgress(0);
    onDataChange({
      file: null,
      parsedData: null,
      uploadStatus: null,
      parseStatus: null,
    });

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleNext = () => {
    if (!uploadedFile) {
      showError("Please upload your resume before continuing.");
      return;
    }

    if (parsing) {
      showError("Please wait for resume parsing to complete.");
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
      {/* File Upload Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          dragActive
            ? "border-primary-500 bg-primary-50"
            : uploadedFile
            ? "border-green-500 bg-green-50"
            : "border-gray-300 hover:border-gray-400"
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={handleUploadClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={handleFileSelect}
          className="hidden"
          disabled={uploading || parsing}
        />

        {uploading ? (
          <div className="space-y-4">
            <Upload className="w-12 h-12 text-primary-600 mx-auto animate-pulse" />
            <div>
              <p className="text-lg font-medium text-gray-900">
                Uploading Resume...
              </p>
              <ProgressBar
                value={uploadProgress}
                showValue={true}
                className="mt-2"
              />
            </div>
          </div>
        ) : parsing ? (
          <div className="space-y-4">
            <Bot className="w-12 h-12 text-primary-600 mx-auto animate-pulse" />
            <div>
              <p className="text-lg font-medium text-gray-900">
                Analyzing Resume...
              </p>
              <p className="text-sm text-gray-600 mt-1">{parsingProgress}</p>
              <div className="mt-2">
                <ProgressBar
                  value={100}
                  showValue={false}
                  className="animate-pulse"
                />
              </div>
            </div>
          </div>
        ) : uploadedFile ? (
          <div className="space-y-4">
            <CheckCircle className="w-12 h-12 text-green-600 mx-auto" />
            <div>
              <p className="text-lg font-medium text-gray-900">
                Resume Uploaded
              </p>
              <p className="text-sm text-gray-600 mt-1">
                {uploadedFile.name} ({Math.round(uploadedFile.size / 1024)} KB)
              </p>
              {parsedData && (
                <p className="text-sm text-green-600 mt-1">
                  ✓ Parsed successfully
                </p>
              )}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={removeFile}
              icon={<X size={16} />}
            >
              Remove
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <Upload className="w-12 h-12 text-gray-400 mx-auto" />
            <div>
              <p className="text-lg font-medium text-gray-900">
                Upload Your Resume
              </p>
              <p className="text-sm text-gray-600 mt-1">
                Drag and drop your resume here, or click to browse
              </p>
              <p className="text-xs text-gray-500 mt-2">
                Supports PDF, DOC, and DOCX files (max 5MB)
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Parsed Data Preview */}
      {parsedData && (
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Extracted Information
          </h3>

          <div className="grid md:grid-cols-2 gap-4">
            {/* Personal Info */}
            {parsedData.personalInfo && (
              <div>
                <h4 className="font-medium text-gray-900 mb-2">
                  Personal Information
                </h4>
                <div className="space-y-1 text-sm text-gray-600">
                  {parsedData.personalInfo.name && (
                    <p>Name: {parsedData.personalInfo.name}</p>
                  )}
                  {parsedData.personalInfo.email && (
                    <p>Email: {parsedData.personalInfo.email}</p>
                  )}
                  {parsedData.personalInfo.phone && (
                    <p>Phone: {parsedData.personalInfo.phone}</p>
                  )}
                  {parsedData.personalInfo.location && (
                    <p>Location: {parsedData.personalInfo.location}</p>
                  )}
                </div>
              </div>
            )}

            {/* Skills */}
            {parsedData.extractedSkills &&
              parsedData.extractedSkills.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">
                    Skills ({parsedData.extractedSkills.length})
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {parsedData.extractedSkills
                      .slice(0, 10)
                      .map((skill, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded"
                        >
                          {skill}
                        </span>
                      ))}
                    {parsedData.extractedSkills.length > 10 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                        +{parsedData.extractedSkills.length - 10} more
                      </span>
                    )}
                  </div>
                </div>
              )}

            {/* Experience */}
            {parsedData.workExperience &&
              parsedData.workExperience.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">
                    Work Experience ({parsedData.workExperience.length})
                  </h4>
                  <div className="space-y-2">
                    {parsedData.workExperience.slice(0, 3).map((exp, index) => (
                      <div key={index} className="text-sm text-gray-600">
                        <p className="font-medium">{exp.title}</p>
                        <p>{exp.company}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            {/* Education */}
            {parsedData.education && parsedData.education.length > 0 && (
              <div>
                <h4 className="font-medium text-gray-900 mb-2">
                  Education ({parsedData.education.length})
                </h4>
                <div className="space-y-2">
                  {parsedData.education.slice(0, 3).map((edu, index) => (
                    <div key={index} className="text-sm text-gray-600">
                      <p className="font-medium">{edu.degree}</p>
                      <p>{edu.institution}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Retry parsing button if failed */}
          {data.parseStatus === "failed" && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center gap-2 text-amber-600 mb-2">
                <AlertCircle size={16} />
                <span className="text-sm">Resume parsing failed</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={retryParsing}
                disabled={parsing}
              >
                Retry Parsing
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-6">
        <Button
          variant="outline"
          onClick={onBack}
          disabled={uploading || parsing || isFirst}
        >
          Back
        </Button>

        <Button
          onClick={handleNext}
          disabled={uploading || parsing || !uploadedFile}
        >
          {isLast ? "Complete Setup" : "Next"}
        </Button>
      </div>
    </div>
  );
};

export default ResumeUpload;
