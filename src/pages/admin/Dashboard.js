import React, { useState, useEffect } from "react";
import {
  Users,
  FileText,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  Eye,
  Phone,
  Filter,
  Download,
} from "lucide-react";
import { useApp } from "../../context/AppContext";
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
    },
    recentApplications: [],
    topPerformingJobs: [],
    userActivity: [],
  });

  useEffect(() => {
    fetchDashboardData();
  }, [timeframe]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setDashboardData({
        stats: {
          totalUsers: 1247,
          activeApplications: 89,
          pendingReviews: 23,
          successRate: 68,
        },
        recentApplications: [
          {
            id: 1,
            applicantName: "John Smith",
            jobTitle: "Senior Frontend Developer",
            company: "TechCorp Inc.",
            status: "pending_review",
            submittedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
            matchScore: 92,
          },
          {
            id: 2,
            applicantName: "Sarah Johnson",
            jobTitle: "Product Manager",
            company: "StartupXYZ",
            status: "applied",
            submittedAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
            matchScore: 88,
          },
          {
            id: 3,
            applicantName: "Mike Chen",
            jobTitle: "Data Scientist",
            company: "AI Solutions",
            status: "interview_scheduled",
            submittedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
            matchScore: 95,
          },
        ],
        topPerformingJobs: [
          {
            jobTitle: "Senior Frontend Developer",
            company: "TechCorp Inc.",
            applications: 15,
            interviews: 8,
            successRate: 53,
          },
          {
            jobTitle: "Product Manager",
            company: "Growth Co.",
            applications: 12,
            interviews: 6,
            successRate: 50,
          },
          {
            jobTitle: "Full Stack Engineer",
            company: "DevStudio",
            applications: 18,
            interviews: 7,
            successRate: 39,
          },
        ],
      });
    } catch (error) {
      showError("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const handleApproveApplication = async (applicationId) => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      showSuccess("Application approved and submitted!");
      fetchDashboardData(); // Refresh data
    } catch (error) {
      showError("Failed to approve application");
    }
  };

  const handleRejectApplication = async (applicationId) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      showSuccess("Application rejected");
      fetchDashboardData();
    } catch (error) {
      showError("Failed to reject application");
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending_review: {
        color: "bg-yellow-100 text-yellow-800",
        label: "Pending Review",
      },
      applied: { color: "bg-blue-100 text-blue-800", label: "Applied" },
      interview_scheduled: {
        color: "bg-green-100 text-green-800",
        label: "Interview Scheduled",
      },
      rejected: { color: "bg-red-100 text-red-800", label: "Rejected" },
    };

    const config = statusConfig[status] || statusConfig.pending_review;

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}
      >
        {config.label}
      </span>
    );
  };

  const timeframeOptions = [
    { value: "7", label: "Last 7 days" },
    { value: "30", label: "Last 30 days" },
    { value: "90", label: "Last 3 months" },
    { value: "365", label: "Last year" },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="spinner" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Monitor and manage job applications
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Select
            options={timeframeOptions}
            value={timeframe}
            onChange={setTimeframe}
            className="w-40"
          />
          <Button variant="outline" icon={<Download size={16} />}>
            Export Report
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Users"
          value={dashboardData.stats.totalUsers.toLocaleString()}
          change={12}
          changeType="positive"
          icon={Users}
          color="primary"
        />
        <StatsCard
          title="Active Applications"
          value={dashboardData.stats.activeApplications}
          change={8}
          changeType="positive"
          icon={FileText}
          color="success"
        />
        <StatsCard
          title="Pending Reviews"
          value={dashboardData.stats.pendingReviews}
          change={-15}
          changeType="negative"
          icon={Clock}
          color="warning"
        />
        <StatsCard
          title="Success Rate"
          value={`${dashboardData.stats.successRate}%`}
          change={5}
          changeType="positive"
          icon={TrendingUp}
          color="info"
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Applications */}
        <Card>
          <Card.Header>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                Recent Applications
              </h3>
              <Button variant="ghost" size="sm">
                View All
              </Button>
            </div>
          </Card.Header>
          <Card.Body>
            <div className="space-y-4">
              {dashboardData.recentApplications.map((application) => (
                <div
                  key={application.id}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-medium text-gray-900">
                        {application.applicantName}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {application.jobTitle}
                      </p>
                      <p className="text-sm text-gray-500">
                        at {application.company}
                      </p>
                    </div>
                    <div className="text-right">
                      {getStatusBadge(application.status)}
                      <div className="text-xs text-gray-500 mt-1">
                        Match: {application.matchScore}%
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">
                      {new Date(application.submittedAt).toLocaleString()}
                    </span>

                    {application.status === "pending_review" && (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            handleRejectApplication(application.id)
                          }
                          className="text-red-600 border-red-300 hover:bg-red-50"
                        >
                          Reject
                        </Button>
                        <Button
                          size="sm"
                          onClick={() =>
                            handleApproveApplication(application.id)
                          }
                        >
                          Approve & Apply
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card.Body>
        </Card>

        {/* Top Performing Jobs */}
        <Card>
          <Card.Header>
            <h3 className="text-lg font-semibold text-gray-900">
              Top Performing Jobs
            </h3>
            <p className="text-sm text-gray-600">
              Jobs with highest success rates
            </p>
          </Card.Header>
          <Card.Body>
            <div className="space-y-4">
              {dashboardData.topPerformingJobs.map((job, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">
                      {job.jobTitle}
                    </h4>
                    <p className="text-sm text-gray-600">{job.company}</p>
                    <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                      <span>{job.applications} applications</span>
                      <span>{job.interviews} interviews</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div
                      className={`text-lg font-bold ${
                        job.successRate >= 50
                          ? "text-green-600"
                          : job.successRate >= 30
                          ? "text-yellow-600"
                          : "text-red-600"
                      }`}
                    >
                      {job.successRate}%
                    </div>
                    <div className="text-xs text-gray-500">success rate</div>
                  </div>
                </div>
              ))}
            </div>
          </Card.Body>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <Card.Header>
          <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
        </Card.Header>
        <Card.Body>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Button
              variant="outline"
              className="h-auto p-4 flex-col items-start"
              icon={<Clock size={24} />}
            >
              <div className="text-left">
                <div className="font-medium">Review Applications</div>
                <div className="text-sm text-gray-500">
                  {dashboardData.stats.pendingReviews} pending
                </div>
              </div>
            </Button>

            <Button
              variant="outline"
              className="h-auto p-4 flex-col items-start"
              icon={<Users size={24} />}
            >
              <div className="text-left">
                <div className="font-medium">Manage Applicants</div>
                <div className="text-sm text-gray-500">View all users</div>
              </div>
            </Button>

            <Button
              variant="outline"
              className="h-auto p-4 flex-col items-start"
              icon={<FileText size={24} />}
            >
              <div className="text-left">
                <div className="font-medium">View Analytics</div>
                <div className="text-sm text-gray-500">Performance reports</div>
              </div>
            </Button>

            <Button
              variant="outline"
              className="h-auto p-4 flex-col items-start"
              icon={<Filter size={24} />}
            >
              <div className="text-left">
                <div className="font-medium">Job Management</div>
                <div className="text-sm text-gray-500">
                  Configure job sources
                </div>
              </div>
            </Button>
          </div>
        </Card.Body>
      </Card>

      {/* System Health */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <Card.Header>
            <h3 className="text-lg font-semibold text-gray-900">
              System Status
            </h3>
          </Card.Header>
          <Card.Body>
            <div className="space-y-3">
              {[
                {
                  service: "Job Scraping",
                  status: "operational",
                  uptime: "99.9%",
                },
                {
                  service: "AI Matching",
                  status: "operational",
                  uptime: "99.7%",
                },
                {
                  service: "Email Service",
                  status: "degraded",
                  uptime: "98.2%",
                },
                { service: "Database", status: "operational", uptime: "100%" },
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        item.status === "operational"
                          ? "bg-green-500"
                          : item.status === "degraded"
                          ? "bg-yellow-500"
                          : "bg-red-500"
                      }`}
                    />
                    <span className="text-sm text-gray-700">
                      {item.service}
                    </span>
                  </div>
                  <span className="text-xs text-gray-500">{item.uptime}</span>
                </div>
              ))}
            </div>
          </Card.Body>
        </Card>

        <Card>
          <Card.Header>
            <h3 className="text-lg font-semibold text-gray-900">
              Today's Activity
            </h3>
          </Card.Header>
          <Card.Body>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">New Registrations</span>
                <span className="text-sm font-medium">23</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Jobs Scraped</span>
                <span className="text-sm font-medium">1,247</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">
                  Applications Submitted
                </span>
                <span className="text-sm font-medium">89</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">
                  Interviews Scheduled
                </span>
                <span className="text-sm font-medium">12</span>
              </div>
            </div>
          </Card.Body>
        </Card>

        <Card>
          <Card.Header>
            <h3 className="text-lg font-semibold text-gray-900">Alerts</h3>
          </Card.Header>
          <Card.Body>
            <div className="space-y-3">
              <div className="flex items-start gap-2 p-2 bg-yellow-50 rounded">
                <AlertCircle className="text-yellow-600 mt-0.5" size={16} />
                <div>
                  <p className="text-sm font-medium text-yellow-800">
                    High Queue Volume
                  </p>
                  <p className="text-xs text-yellow-600">
                    23 applications pending review
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2 p-2 bg-blue-50 rounded">
                <CheckCircle className="text-blue-600 mt-0.5" size={16} />
                <div>
                  <p className="text-sm font-medium text-blue-800">
                    System Updated
                  </p>
                  <p className="text-xs text-blue-600">AI matching improved</p>
                </div>
              </div>
            </div>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
