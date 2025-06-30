import React, { useState } from "react";
import { Upload, FileText, Download, Zap, CheckCircle } from "lucide-react";
import { useApp } from "../../context/AppContext";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";

const Tools = () => {
  const { showSuccess, showError } = useApp();
  const [uploading, setUploading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [optimizedCV, setOptimizedCV] = useState(null);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type !== "application/pdf" && !file.name.endsWith(".docx")) {
      showError("Please upload a PDF or DOCX file");
      return;
    }

    setUploading(true);
    try {
      // Simulate file upload
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setUploadedFile(file);
      showSuccess("CV uploaded successfully!");
    } catch (error) {
      showError("Failed to upload CV");
    } finally {
      setUploading(false);
    }
  };

  const handleOptimizeCV = async () => {
    if (!uploadedFile) return;

    setProcessing(true);
    try {
      // Simulate AI processing
      await new Promise((resolve) => setTimeout(resolve, 4000));

      setOptimizedCV({
        filename: `optimized_${uploadedFile.name}`,
        improvements: [
          "Enhanced skill descriptions",
          "Improved formatting and layout",
          "Added relevant keywords",
          "Optimized for ATS systems",
          "Strengthened achievement statements",
        ],
        score: 95,
      });

      showSuccess("CV optimization completed!");
    } catch (error) {
      showError("Failed to optimize CV");
    } finally {
      setProcessing(false);
    }
  };

  const handleDownload = () => {
    // Simulate download
    showSuccess("Optimized CV downloaded successfully!");
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Tools</h1>
        <p className="text-gray-600">
          Use our AI-powered tool to optimize your CV for better job matching
        </p>
      </div>

      {/* CV Optimizer */}
      <Card>
        <Card.Header>
          <div className="flex items-center gap-3">
            <Zap className="text-black" size={24} />
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                AI CV Optimizer
              </h2>
              <p className="text-gray-600 text-sm">
                Upload your CV and let our AI enhance it for maximum impact
              </p>
            </div>
          </div>
        </Card.Header>
        <Card.Body>
          <div className="space-y-6">
            {/* Upload Section */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                1. Upload Your CV
              </h3>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <Upload className="mx-auto text-gray-400 mb-4" size={48} />
                <p className="text-gray-600 mb-4">
                  Drag and drop your CV here, or click to browse
                </p>
                <input
                  type="file"
                  accept=".pdf,.docx"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="cv-upload"
                />
                <label htmlFor="cv-upload">
                  <Button
                    as="span"
                    variant="outline"
                    loading={uploading}
                    className="cursor-pointer"
                  >
                    {uploading ? "Uploading..." : "Choose File"}
                  </Button>
                </label>
                <p className="text-sm text-gray-500 mt-2">
                  Supports PDF and DOCX files up to 10MB
                </p>
              </div>

              {uploadedFile && (
                <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <FileText className="text-green-600" size={20} />
                    <span className="text-green-800 font-medium">
                      {uploadedFile.name}
                    </span>
                    <CheckCircle className="text-green-600" size={16} />
                  </div>
                </div>
              )}
            </div>

            {/* Optimize Section */}
            {uploadedFile && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  2. AI Optimization
                </h3>
                <div className="text-center">
                  <Button
                    size="lg"
                    onClick={handleOptimizeCV}
                    loading={processing}
                    className="bg-black hover:bg-gray-800 text-white"
                  >
                    {processing ? "Optimizing CV..." : "Optimize with AI"}
                  </Button>
                  <p className="text-sm text-gray-600 mt-2">
                    Our AI will analyze and enhance your CV for better results
                  </p>
                </div>
              </div>
            )}

            {/* Results Section */}
            {optimizedCV && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  3. Download Optimized CV
                </h3>
                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <FileText className="text-black" size={24} />
                      <div>
                        <p className="font-medium text-gray-900">
                          {optimizedCV.filename}
                        </p>
                        <p className="text-sm text-gray-600">
                          Optimization Score: {optimizedCV.score}%
                        </p>
                      </div>
                    </div>
                    <Button
                      onClick={handleDownload}
                      icon={<Download size={16} />}
                      className="bg-black hover:bg-gray-800 text-white"
                    >
                      Download
                    </Button>
                  </div>

                  <div>
                    <p className="font-medium text-gray-900 mb-2">
                      AI Improvements Made:
                    </p>
                    <ul className="space-y-1">
                      {optimizedCV.improvements.map((improvement, index) => (
                        <li
                          key={index}
                          className="flex items-center gap-2 text-sm text-gray-700"
                        >
                          <CheckCircle
                            className="text-green-600 flex-shrink-0"
                            size={14}
                          />
                          {improvement}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        </Card.Body>
      </Card>

      {/* Tips */}
      <Card>
        <Card.Header>
          <h3 className="text-lg font-semibold text-gray-900">
            CV Optimization Tips
          </h3>
        </Card.Header>
        <Card.Body>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">Best Practices:</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Use clear, professional formatting</li>
                <li>• Include relevant keywords for your industry</li>
                <li>• Quantify achievements with numbers</li>
                <li>• Keep it concise (1-2 pages)</li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">Our AI Enhancement:</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Optimizes for Applicant Tracking Systems</li>
                <li>• Enhances skill descriptions</li>
                <li>• Improves overall readability</li>
                <li>• Adds industry-specific keywords</li>
              </ul>
            </div>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Tools;
