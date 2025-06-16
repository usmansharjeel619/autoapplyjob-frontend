import React, { useState } from "react";
import {
  Zap,
  FileText,
  Target,
  MessageSquare,
  TrendingUp,
  Download,
  Upload,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Star,
  Award,
  Lightbulb,
} from "lucide-react";
import { useApp } from "../../context/AppContext";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import ProgressBar from "../../components/ui/ProgressBar";

const Tools = () => {
  const { showSuccess, showError } = useApp();
  const [activeTab, setActiveTab] = useState("resume-optimizer");
  const [loading, setLoading] = useState(false);
  const [resumeScore, setResumeScore] = useState(78);
  const [optimizing, setOptimizing] = useState(false);

  const tabs = [
    { id: "resume-optimizer", label: "Resume Optimizer", icon: FileText },
    { id: "cover-letter", label: "Cover Letter AI", icon: MessageSquare },
    { id: "interview-prep", label: "Interview Prep", icon: Target },
    { id: "skill-gap", label: "Skill Gap Analysis", icon: TrendingUp },
  ];

  const handleOptimizeResume = async () => {
    setOptimizing(true);
    try {
      // Simulate AI optimization
      await new Promise((resolve) => setTimeout(resolve, 3000));
      setResumeScore(
        Math.min(resumeScore + Math.floor(Math.random() * 15) + 5, 100)
      );
      showSuccess("Resume optimized successfully!");
    } catch (error) {
      showError("Failed to optimize resume");
    } finally {
      setOptimizing(false);
    }
  };

  const handleGenerateCoverLetter = async () => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      showSuccess("Cover letter generated successfully!");
    } catch (error) {
      showError("Failed to generate cover letter");
    } finally {
      setLoading(false);
    }
  };

  const resumeOptimizations = [
    {
      type: "error",
      title: "Missing Keywords",
      description:
        'Add "Machine Learning" and "Python" to match job requirements',
      impact: "High",
    },
    {
      type: "warning",
      title: "Weak Action Verbs",
      description: 'Replace "Worked on" with "Developed" or "Implemented"',
      impact: "Medium",
    },
    {
      type: "info",
      title: "Add Metrics",
      description:
        'Include quantifiable achievements (e.g., "Increased performance by 30%")',
      impact: "High",
    },
    {
      type: "success",
      title: "Good Format",
      description: "Your resume format is ATS-friendly",
      impact: "Low",
    },
  ];

  const interviewQuestions = [
    {
      category: "Technical",
      questions: [
        "Explain the difference between SQL and NoSQL databases",
        "How would you optimize a slow-running query?",
        "Describe your experience with cloud platforms",
      ],
    },
    {
      category: "Behavioral",
      questions: [
        "Tell me about a challenging project you worked on",
        "How do you handle tight deadlines?",
        "Describe a time when you had to learn a new technology quickly",
      ],
    },
    {
      category: "Company-Specific",
      questions: [
        "Why do you want to work at this company?",
        "How would you contribute to our team?",
        "What interests you about this role?",
      ],
    },
  ];

  const skillGaps = [
    {
      skill: "Machine Learning",
      current: 40,
      target: 80,
      priority: "High",
      resources: ["Coursera ML Course", "Kaggle Learn", "Fast.ai"],
    },
    {
      skill: "Docker",
      current: 60,
      target: 85,
      priority: "Medium",
      resources: ["Docker Documentation", "Pluralsight Course"],
    },
    {
      skill: "System Design",
      current: 30,
      target: 75,
      priority: "High",
      resources: ["System Design Primer", "High Scalability Blog"],
    },
  ];

  const renderResumeOptimizer = () => (
    <div className="space-y-6">
      {/* Resume Score */}
      <Card>
        <Card.Header>
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              Resume Score
            </h3>
            <span
              className={`text-2xl font-bold ${
                resumeScore >= 80
                  ? "text-green-600"
                  : resumeScore >= 60
                  ? "text-yellow-600"
                  : "text-red-600"
              }`}
            >
              {resumeScore}/100
            </span>
          </div>
        </Card.Header>
        <Card.Body>
          <ProgressBar
            value={resumeScore}
            variant={
              resumeScore >= 80
                ? "success"
                : resumeScore >= 60
                ? "warning"
                : "error"
            }
            showValue={false}
          />
          <p className="text-sm text-gray-600 mt-2">
            {resumeScore >= 80
              ? "Excellent! Your resume is well-optimized for ATS systems."
              : resumeScore >= 60
              ? "Good start! A few improvements could boost your score."
              : "Your resume needs optimization to pass ATS filters."}
          </p>

          <div className="flex gap-3 mt-4">
            <Button
              onClick={handleOptimizeResume}
              loading={optimizing}
              icon={<Zap size={16} />}
            >
              {optimizing ? "Optimizing..." : "Optimize Resume"}
            </Button>
            <Button variant="outline" icon={<Download size={16} />}>
              Download Report
            </Button>
          </div>
        </Card.Body>
      </Card>

      {/* Optimization Suggestions */}
      <Card>
        <Card.Header>
          <h3 className="text-lg font-semibold text-gray-900">
            Optimization Suggestions
          </h3>
        </Card.Header>
        <Card.Body>
          <div className="space-y-4">
            {resumeOptimizations.map((item, index) => {
              const getIcon = () => {
                switch (item.type) {
                  case "error":
                    return <AlertCircle className="text-red-500" size={20} />;
                  case "warning":
                    return (
                      <AlertCircle className="text-yellow-500" size={20} />
                    );
                  case "info":
                    return <Lightbulb className="text-blue-500" size={20} />;
                  case "success":
                    return <CheckCircle className="text-green-500" size={20} />;
                  default:
                    return <AlertCircle className="text-gray-500" size={20} />;
                }
              };

              const getBadgeColor = () => {
                switch (item.impact) {
                  case "High":
                    return "bg-red-100 text-red-800";
                  case "Medium":
                    return "bg-yellow-100 text-yellow-800";
                  case "Low":
                    return "bg-green-100 text-green-800";
                  default:
                    return "bg-gray-100 text-gray-800";
                }
              };

              return (
                <div
                  key={index}
                  className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg"
                >
                  {getIcon()}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-gray-900">
                        {item.title}
                      </h4>
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${getBadgeColor()}`}
                      >
                        {item.impact} Impact
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{item.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </Card.Body>
      </Card>

      {/* Quick Actions */}
      <Card>
        <Card.Header>
          <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
        </Card.Header>
        <Card.Body>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              variant="outline"
              className="h-auto p-4 flex-col items-start"
              icon={<Upload size={20} />}
            >
              <div className="text-left">
                <div className="font-medium">Upload New Resume</div>
                <div className="text-sm text-gray-500">
                  Replace current version
                </div>
              </div>
            </Button>

            <Button
              variant="outline"
              className="h-auto p-4 flex-col items-start"
              icon={<Target size={20} />}
            >
              <div className="text-left">
                <div className="font-medium">Optimize for Job</div>
                <div className="text-sm text-gray-500">
                  Tailor to specific role
                </div>
              </div>
            </Button>

            <Button
              variant="outline"
              className="h-auto p-4 flex-col items-start"
              icon={<RefreshCw size={20} />}
            >
              <div className="text-left">
                <div className="font-medium">Re-scan Resume</div>
                <div className="text-sm text-gray-500">Update analysis</div>
              </div>
            </Button>
          </div>
        </Card.Body>
      </Card>
    </div>
  );

  const renderCoverLetterAI = () => (
    <div className="space-y-6">
      <Card>
        <Card.Header>
          <h3 className="text-lg font-semibold text-gray-900">
            AI Cover Letter Generator
          </h3>
          <p className="text-sm text-gray-600">
            Create personalized cover letters for specific jobs
          </p>
        </Card.Header>
        <Card.Body>
          <div className="space-y-4">
            <div>
              <label className="form-label">Job Title</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g., Senior Software Engineer"
              />
            </div>

            <div>
              <label className="form-label">Company Name</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g., Google"
              />
            </div>

            <div>
              <label className="form-label">Job Description (Optional)</label>
              <textarea
                className="form-input form-textarea"
                placeholder="Paste the job description here for better personalization..."
                rows={4}
              />
            </div>

            <div>
              <label className="form-label">Tone</label>
              <select className="form-input form-select">
                <option>Professional</option>
                <option>Conversational</option>
                <option>Confident</option>
                <option>Creative</option>
              </select>
            </div>

            <Button
              onClick={handleGenerateCoverLetter}
              loading={loading}
              icon={<Zap size={16} />}
              className="w-full"
            >
              {loading ? "Generating..." : "Generate Cover Letter"}
            </Button>
          </div>
        </Card.Body>
      </Card>

      {/* Templates */}
      <Card>
        <Card.Header>
          <h3 className="text-lg font-semibold text-gray-900">
            Cover Letter Templates
          </h3>
        </Card.Header>
        <Card.Body>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {["Professional", "Creative", "Technical", "Executive"].map(
              (template) => (
                <div
                  key={template}
                  className="p-4 border border-gray-200 rounded-lg hover:border-primary-300 cursor-pointer"
                >
                  <h4 className="font-medium text-gray-900 mb-2">
                    {template} Template
                  </h4>
                  <p className="text-sm text-gray-600 mb-3">
                    Perfect for {template.toLowerCase()} roles and traditional
                    companies.
                  </p>
                  <Button size="sm" variant="outline">
                    Use Template
                  </Button>
                </div>
              )
            )}
          </div>
        </Card.Body>
      </Card>
    </div>
  );

  const renderInterviewPrep = () => (
    <div className="space-y-6">
      {interviewQuestions.map((category) => (
        <Card key={category.category}>
          <Card.Header>
            <h3 className="text-lg font-semibold text-gray-900">
              {category.category} Questions
            </h3>
          </Card.Header>
          <Card.Body>
            <div className="space-y-3">
              {category.questions.map((question, index) => (
                <div key={index} className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-gray-900 mb-2">{question}</p>
                  <Button size="sm" variant="outline">
                    Practice Answer
                  </Button>
                </div>
              ))}
            </div>
          </Card.Body>
        </Card>
      ))}
    </div>
  );

  const renderSkillGap = () => (
    <div className="space-y-6">
      <Card>
        <Card.Header>
          <h3 className="text-lg font-semibold text-gray-900">
            Skill Gap Analysis
          </h3>
          <p className="text-sm text-gray-600">
            Based on your target jobs and current profile
          </p>
        </Card.Header>
        <Card.Body>
          <div className="space-y-6">
            {skillGaps.map((skill, index) => (
              <div key={index} className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-gray-900">{skill.skill}</h4>
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${
                      skill.priority === "High"
                        ? "bg-red-100 text-red-800"
                        : skill.priority === "Medium"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {skill.priority} Priority
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Current Level</span>
                    <span>{skill.current}%</span>
                  </div>
                  <ProgressBar value={skill.current} variant="warning" />

                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Target Level</span>
                    <span>{skill.target}%</span>
                  </div>
                  <ProgressBar value={skill.target} variant="success" />
                </div>

                <div>
                  <h5 className="text-sm font-medium text-gray-900 mb-2">
                    Recommended Resources:
                  </h5>
                  <div className="flex flex-wrap gap-2">
                    {skill.resources.map((resource, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-md"
                      >
                        {resource}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card.Body>
      </Card>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case "resume-optimizer":
        return renderResumeOptimizer();
      case "cover-letter":
        return renderCoverLetterAI();
      case "interview-prep":
        return renderInterviewPrep();
      case "skill-gap":
        return renderSkillGap();
      default:
        return renderResumeOptimizer();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">AI Tools</h1>
        <p className="text-gray-600 mt-1">
          Optimize your job search with our AI-powered tools
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? "border-primary-500 text-primary-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <Icon size={16} />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      {renderTabContent()}
    </div>
  );
};

export default Tools;
