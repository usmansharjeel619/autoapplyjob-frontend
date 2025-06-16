import React, { useState, useCallback } from "react";
import { Upload, FileText, CheckCircle, X, RefreshCw } from "lucide-react";
import { validateFile } from "../../utils/validation";
import { FILE_UPLOAD } from "../../utils/constants";
import { useApp } from "../../context/AppContext";
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
  const { showError, showSuccess } = useApp();

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
      // Simulate file upload
      await new Promise((resolve) => setTimeout(resolve, 2000));

      setUploadedFile(file);
      showSuccess("Resume uploaded successfully!");

      // Parse resume
      await parseResume(file);
    } catch (error) {
      showError("Failed to upload resume. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const parseResume = async (file) => {
    setParsing(true);

    try {
      // Simulate AI parsing
      await new Promise((resolve) => setTimeout(resolve, 3000));

      const mockParsedData = {
        extractedSkills: ["JavaScript", "React", "Node.js", "Python", "AWS"],
        workExperience: [
          {
            title: "Senior Software Developer",
            company: "Tech Solutions Inc.",
            duration: "2021 - Present",
            description:
              "Led development of web applications using React and Node.js",
          },
        ],
        education: [
          {
            degree: "Bachelor of Science in Computer Science",
            institution: "University of Technology",
            year: "2019",
          },
        ],
        certifications: [
          "AWS Certified Developer",
          "React Professional Certificate",
        ],
      };

      setParsedData(mockParsedData);
      onDataChange({ file, parsedData: mockParsedData });
      showSuccess("Resume parsed successfully!");
    } catch (error) {
      showError("Failed to parse resume. Please try again.");
    } finally {
      setParsing(false);
    }
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

  return (
    <div className="space-y-6">
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
              <div>
                <h4 className="font-medium text-gray-900">
                  Parsing your resume...
                </h4>
                <p className="text-sm text-gray-600">
                  Our AI is extracting your skills and experience
                </p>
              </div>
            </div>
          </Card.Body>
        </Card>
      )}

      {/* Parsed Data Preview */}
      {parsedData && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Extracted Information
          </h3>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Skills */}
            <Card>
              <Card.Header>
                <h4 className="font-medium text-gray-900">Skills</h4>
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

            {/* Experience */}
            <Card>
              <Card.Header>
                <h4 className="font-medium text-gray-900">Experience</h4>
              </Card.Header>
              <Card.Body>
                <div className="space-y-3">
                  {parsedData.workExperience.map((exp, index) => (
                    <div key={index}>
                      <h5 className="font-medium text-gray-900">{exp.title}</h5>
                      <p className="text-sm text-gray-600">
                        {exp.company} • {exp.duration}
                      </p>
                    </div>
                  ))}
                </div>
              </Card.Body>
            </Card>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> This information was automatically
              extracted from your resume. You can edit and add more details in
              the next steps.
            </p>
          </div>
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

        <Button onClick={handleNext}>
          {isLast ? "Complete Setup" : "Next Step"}
        </Button>
      </div>
    </div>
  );
};

export default ResumeUpload;
