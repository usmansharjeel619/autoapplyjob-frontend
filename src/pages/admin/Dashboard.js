import React, { useState, useEffect } from "react";
import {
  Users,
  FileText,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  Eye,
  Filter,
  Download,
} from "lucide-react";
import { useApp } from "../../context/AppContext";
import adminService from "../../services/admin.service";
import StatsCard from "../../components/dashboard/StatsCard";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import Select from "../../components/ui/Select";

const AdminDashboard = () => {
  const { showSuccess, showError } = useApp();
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState("30");
  const [dashboardData, setDashboardData] = useState({
    stats: {
      totalUsers: 0,
      activeApplications: 0,
      pendingReviews: 0,
      successRate: 0,
      jobsScraped: 0,
      averageMatchScore: 0,
    },
    recentApplications: [],
    topPerformingJobs: [],
    userActivity: [],
    systemHealth: {
      scrapingStatus: "active",
      lastScrapingRun: null,
      totalJobsScraped: 0,
    },
  });

  useEffect(() => {
    fetchDashboardData();
  }, [timeframe]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const data = await adminService.getDashboardStats();
      setDashboardData(data);
    } catch (error) {
      showError("Failed to load dashboard data");
      console.error("Admin dashboard error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleBulkAction = async (action, applicationIds) => {
    try {
      switch (action) {
        case "approve":
          // Implement bulk approve
          break;
        case "reject":
          // Implement bulk reject
          break;
        case "export":
          // Implement export functionality
          break;
        default:
          break;
      }
      showSuccess(`${action} completed successfully`);
      fetchDashboardData();
    } catch (error) {
      showError(`Failed to ${action} applications`);
    }
  };

  const handleManualApplication = async (userId, jobId) => {
    try {
      await adminService.applyToJobOnBehalf(userId, jobId);
      showSuccess("Application submitted successfully");
      fetchDashboardData();
    } catch (error) {
      showError("Failed to submit application");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const { stats, recentApplications, topPerformingJobs, systemHealth } =
    dashboardData;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600">
            Overview of system activity and job applications
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
            options={[
              { value: "7", label: "Last 7 days" },
              { value: "30", label: "Last 30 days" },
              { value: "90", label: "Last 90 days" },
            ]}
          />

          <Button
            variant="outline"
            onClick={() => handleBulkAction("export", [])}
            className="flex items-center space-x-2"
          >
            <Download className="w-4 h-4" />
            <span>Export Data</span>
          </Button>
        </div>
      </div>

      {/* System Health Alert */}
      {systemHealth.scrapingStatus !== "active" && (
        <Card className="border-orange-200 bg-orange-50">
          <Card.Body>
            <div className="flex items-center space-x-3">
              <AlertCircle className="w-5 h-5 text-orange-600" />
              <div>
                <h4 className="font-medium text-orange-800">
                  Job Scraping System Alert
                </h4>
                <p className="text-sm text-orange-700">
                  The job scraping system is currently{" "}
                  {systemHealth.scrapingStatus}. Last successful run:{" "}
                  {systemHealth.lastScrapingRun
                    ? new Date(systemHealth.lastScrapingRun).toLocaleString()
                    : "Never"}
                </p>
              </div>
            </div>
          </Card.Body>
        </Card>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatsCard
          title="Total Users"
          value={stats.totalUsers}
          icon={<Users className="w-5 h-5" />}
          color="blue"
          trend={{ value: stats.usersTrend, isPositive: stats.usersTrend > 0 }}
        />
        <StatsCard
          title="Active Applications"
          value={stats.activeApplications}
          icon={<FileText className="w-5 h-5" />}
          color="green"
          trend={{
            value: stats.applicationsTrend,
            isPositive: stats.applicationsTrend > 0,
          }}
        />
        <StatsCard
          title="Pending Reviews"
          value={stats.pendingReviews}
          icon={<Clock className="w-5 h-5" />}
          color="yellow"
        />
        <StatsCard
          title="Success Rate"
          value={`${stats.successRate}%`}
          icon={<TrendingUp className="w-5 h-5" />}
          color="emerald"
          trend={{
            value: stats.successRateTrend,
            isPositive: stats.successRateTrend > 0,
          }}
        />
        <StatsCard
          title="Jobs Scraped"
          value={stats.jobsScraped}
          icon={<CheckCircle className="w-5 h-5" />}
          color="purple"
        />
        <StatsCard
          title="Avg Match Score"
          value={`${stats.averageMatchScore}%`}
          icon={<TrendingUp className="w-5 h-5" />}
          color="indigo"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Applications */}
        <Card>
          <Card.Header>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                Recent Applications
              </h3>
              <Button variant="outline" size="sm" href="/admin/applications">
                View All
              </Button>
            </div>
          </Card.Header>
          <Card.Body>
            {recentApplications.length > 0 ? (
              <div className="space-y-4">
                {recentApplications.slice(0, 5).map((application) => (
                  <div
                    key={application.id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">
                        {application.jobTitle}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {application.company}
                      </p>
                      <p className="text-xs text-gray-500">
                        {application.applicantName} •{" "}
                        {new Date(application.submittedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          application.status === "pending_review"
                            ? "bg-yellow-100 text-yellow-800"
                            : application.status === "applied"
                            ? "bg-blue-100 text-blue-800"
                            : application.status === "interview_scheduled"
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {application.status.replace("_", " ")}
                      </span>
                      <Button
                        size="sm"
                        variant="outline"
                        href={`/admin/applications/${application.id}`}
                      >
                        <Eye className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No recent applications</p>
              </div>
            )}
          </Card.Body>
        </Card>

        {/* Top Performing Jobs */}
        <Card>
          <Card.Header>
            <h3 className="text-lg font-semibold text-gray-900">
              Top Performing Jobs
            </h3>
          </Card.Header>
          <Card.Body>
            {topPerformingJobs.length > 0 ? (
              <div className="space-y-4">
                {topPerformingJobs.map((job, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                  >
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">
                        {job.jobTitle}
                      </h4>
                      <p className="text-sm text-gray-600">{job.company}</p>
                      <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                        <span>{job.applications} applications</span>
                        <span>{job.interviews} interviews</span>
                        <span className="font-medium text-green-600">
                          {job.successRate}% success
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-900">
                        Match: {job.averageMatchScore}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No performance data yet</p>
              </div>
            )}
          </Card.Body>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <Card.Header>
          <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
        </Card.Header>
        <Card.Body>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              className="h-20 flex flex-col items-center justify-center space-y-2"
              href="/admin/applications"
            >
              <FileText className="w-6 h-6" />
              <span>Review Applications</span>
            </Button>
            <Button
              className="h-20 flex flex-col items-center justify-center space-y-2"
              href="/admin/users"
            >
              <Users className="w-6 h-6" />
              <span>Manage Users</span>
            </Button>
            <Button
              className="h-20 flex flex-col items-center justify-center space-y-2"
              href="/admin/analytics"
            >
              <TrendingUp className="w-6 h-6" />
              <span>View Analytics</span>
            </Button>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default AdminDashboard;
