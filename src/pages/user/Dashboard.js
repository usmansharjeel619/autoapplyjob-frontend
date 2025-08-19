import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  User,
  Target,
  Settings,
  AlertCircle,
  Clock,
  CheckCircle,
  TrendingUp,
  Activity,
  FileText,
  Bot,
  Bell,
  Shield,
  Zap,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import userService from "../../services/user.service";

// Circular Progress Component
const CircularProgress = ({
  value,
  size = 120,
  strokeWidth = 8,
  className = "",
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className={`relative ${className}`}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgb(229, 231, 235)" // gray-200
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgb(0, 0, 0)" // black
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-300 ease-in-out"
        />
      </svg>
      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold text-gray-900">{value}%</span>
      </div>
    </div>
  );
};

// Stats Card Component
const StatsCard = ({ icon: Icon, title, value, subtitle, progress }) => (
  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 aspect-square flex flex-col items-center justify-center text-center">
    <Icon className="w-8 h-8 text-gray-600 mb-4" />
    <CircularProgress
      value={progress || value}
      size={100}
      strokeWidth={6}
      className="mb-4"
    />
    <h3 className="text-lg font-semibold text-gray-900 mb-1">{title}</h3>
    {subtitle && <p className="text-sm text-gray-600">{subtitle}</p>}
  </div>
);

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await userService.getDashboardStats();
      setStats(response.data);
    } catch (err) {
      console.error("Dashboard stats error:", err);
      setError(err.message || "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  if (loading && !stats) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Unable to Load Dashboard
            </h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={fetchDashboardStats}
              className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Check if user is new (no automated applications yet)
  const isNewUser =
    !stats ||
    (stats.automatedApplications === 0 && stats.profileCompleteness < 100);

  // Welcome message for new users
  if (isNewUser) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Automation Status Banner */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <div>
                <h3 className="text-lg font-semibold text-green-800">
                  AI Automation System Active
                </h3>
                <p className="text-green-700">
                  Your automated job application system is now running and will
                  start applying to relevant jobs shortly.
                </p>
              </div>
            </div>
          </div>

          <div className="text-center py-12">
            <Bot className="w-16 h-16 text-black mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Welcome to AutoApplyJob, {user?.name}!
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Your AI automation system is setting up your job applications
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-md mx-auto mb-8">
              <StatsCard
                icon={User}
                title="Profile Score"
                value={stats?.profileCompleteness || 85}
                progress={stats?.profileCompleteness || 85}
              />
              <StatsCard
                icon={Bot}
                title="Applications"
                value={0}
                subtitle="Starting soon"
                progress={0}
              />
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                What happens next?
              </h2>
              <div className="grid md:grid-cols-3 gap-6 text-left">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-blue-600 font-bold text-sm">1</span>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 mb-1">
                      AI Analysis
                    </h3>
                    <p className="text-sm text-gray-600">
                      Our AI analyzes your profile and finds matching job
                      opportunities
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-green-600 font-bold text-sm">2</span>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 mb-1">
                      Auto Applications
                    </h3>
                    <p className="text-sm text-gray-600">
                      Automated applications are submitted to relevant positions
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-purple-600 font-bold text-sm">3</span>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 mb-1">
                      Track Progress
                    </h3>
                    <p className="text-sm text-gray-600">
                      Monitor your applications and responses in real-time
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main dashboard for users with data
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.name}
          </h1>
          <p className="text-gray-600">
            Here's your automated job application progress
          </p>
        </div>

        {/* Automation Status Banner */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <div>
              <h3 className="text-lg font-semibold text-green-800">
                AI Automation System Active
              </h3>
              <p className="text-green-700">
                Your automated system is actively scanning and applying to jobs.
                Check back regularly for updates on your applications.
              </p>
            </div>
          </div>
        </div>

        {/* Stats Grid - 2x2 Square Cards */}
        <div className="grid grid-cols-2 gap-6 mb-8 max-w-2xl mx-auto">
          <StatsCard
            icon={Bot}
            title="Applications Sent"
            value={stats?.automatedApplications || 0}
            subtitle={`+${stats?.newApplicationsThisWeek || 0} this week`}
            progress={Math.min((stats?.automatedApplications || 0) * 2, 100)}
          />
          <StatsCard
            icon={CheckCircle}
            title="Response Rate"
            value={stats?.responseRate || 0}
            subtitle="Employer responses"
            progress={stats?.responseRate || 0}
          />
          <StatsCard
            icon={Target}
            title="Profile Score"
            value={stats?.profileCompleteness || 85}
            subtitle="Optimization level"
            progress={stats?.profileCompleteness || 85}
          />
          <StatsCard
            icon={TrendingUp}
            title="Success Rate"
            value={stats?.successRate || 0}
            subtitle="Application to response"
            progress={stats?.successRate || 0}
          />
        </div>

        {/* Recent Applications */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Recent Automated Applications
            </h2>
            {stats?.recentApplications &&
            stats.recentApplications.length > 0 ? (
              <div className="space-y-4">
                {stats.recentApplications.map((application, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Bot className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">
                        {application.jobTitle}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {application.company}
                      </p>
                      <span
                        className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-1 ${
                          application.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : application.status === "submitted"
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {application.status}
                      </span>
                      <p className="text-xs text-gray-500 mt-1">
                        Applied {application.appliedAt}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Bot className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No automated applications yet</p>
                <p className="text-sm text-gray-500 mt-1">
                  Your AI system will start applying soon
                </p>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Quick Actions
            </h2>
            <div className="space-y-3">
              <button
                onClick={() => navigate("/profile")}
                className="w-full text-left p-3 rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="font-medium text-gray-900">Update Profile</p>
                    <p className="text-sm text-gray-600">
                      Improve your profile score
                    </p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => navigate("/tools")}
                className="w-full text-left p-3 rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Zap className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="font-medium text-gray-900">AI Tools</p>
                    <p className="text-sm text-gray-600">
                      Optimize your resume
                    </p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => navigate("/settings")}
                className="w-full text-left p-3 rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Settings className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="font-medium text-gray-900">Settings</p>
                    <p className="text-sm text-gray-600">
                      Configure preferences
                    </p>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
