// src/pages/admin/Dashboard.js
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
// Fixed import - import directly from the file, not from index
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
          <p className="text-gray-600 mt-1">
            Monitor and manage your application platform
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Select
            value={timeframe}
            onChange={setTimeframe}
            options={[
              { value: "7", label: "Last 7 days" },
              { value: "30", label: "Last 30 days" },
              { value: "90", label: "Last 3 months" },
            ]}
            className="w-40"
          />
          <Button onClick={fetchDashboardData} variant="outline" icon={<Eye />}>
            Refresh
          </Button>
          <Button icon={<Download />}>Export Data</Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        <StatsCard
          title="Total Users"
          value={stats.totalUsers}
          icon={Users}
          color="primary"
          change={12}
        />
        <StatsCard
          title="Active Applications"
          value={stats.activeApplications}
          icon={FileText}
          color="success"
          change={8}
        />
        <StatsCard
          title="Pending Reviews"
          value={stats.pendingReviews}
          icon={Clock}
          color="warning"
          change={-3}
          changeType="negative"
        />
        <StatsCard
          title="Success Rate"
          value={`${stats.successRate}%`}
          icon={CheckCircle}
          color="success"
          change={5}
        />
        <StatsCard
          title="Jobs Scraped"
          value={stats.jobsScraped}
          icon={TrendingUp}
          color="info"
          change={15}
        />
        <StatsCard
          title="Avg Match Score"
          value={`${stats.averageMatchScore}%`}
          icon={TrendingUp}
          color="info"
          change={2}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Applications */}
        <Card>
          <Card.Header>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Recent Applications
                </h3>
                <p className="text-sm text-gray-600">
                  Latest application submissions requiring review
                </p>
              </div>
              <Button variant="outline" size="sm" icon={<Filter />}>
                Filter
              </Button>
            </div>
          </Card.Header>
          <Card.Body>
            <div className="space-y-4">
              {recentApplications.map((application, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                      <Users className="text-primary-600" size={20} />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">
                        {application.userName || "User"}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {application.jobTitle || "Job Title"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
                      Pending
                    </span>
                    <Button size="sm" variant="outline">
                      Review
                    </Button>
                  </div>
                </div>
              ))}
              {recentApplications.length === 0 && (
                <div className="text-center py-8">
                  <FileText className="mx-auto text-gray-400 mb-4" size={48} />
                  <h4 className="text-lg font-medium text-gray-900 mb-2">
                    No Recent Applications
                  </h4>
                  <p className="text-gray-600">
                    New applications will appear here for review.
                  </p>
                </div>
              )}
            </div>
          </Card.Body>
        </Card>

        {/* System Health */}
        <Card>
          <Card.Header>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                System Health
              </h3>
              <p className="text-sm text-gray-600">
                Current status of system components
              </p>
            </div>
          </Card.Header>
          <Card.Body>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <CheckCircle className="text-green-600" size={24} />
                  <div>
                    <h4 className="font-medium text-gray-900">
                      Job Scraping Service
                    </h4>
                    <p className="text-sm text-gray-600">
                      Last run: {systemHealth.lastScrapingRun || "Never"}
                    </p>
                  </div>
                </div>
                <span className="px-3 py-1 text-sm font-medium bg-green-100 text-green-800 rounded-full">
                  Active
                </span>
              </div>

              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <TrendingUp className="text-blue-600" size={24} />
                  <div>
                    <h4 className="font-medium text-gray-900">
                      Total Jobs Scraped
                    </h4>
                    <p className="text-sm text-gray-600">
                      {systemHealth.totalJobsScraped} jobs in database
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <AlertCircle className="text-gray-600" size={24} />
                  <div>
                    <h4 className="font-medium text-gray-900">
                      Application Queue
                    </h4>
                    <p className="text-sm text-gray-600">
                      {stats.pendingReviews} applications pending review
                    </p>
                  </div>
                </div>
                <Button size="sm">Process Queue</Button>
              </div>
            </div>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
