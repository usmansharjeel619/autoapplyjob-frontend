import React, { useState, useEffect } from "react";
import {
  Activity,
  Users,
  Briefcase,
  Target,
  Download,
  Calendar,
  TrendingUp,
  TrendingDown,
  Building,
  MapPin,
  Clock,
  DollarSign,
  Star,
  Filter,
  RefreshCw,
  Eye,
  CheckCircle,
  XCircle,
  AlertTriangle,
} from "lucide-react";
import { useApp } from "../../context/AppContext";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import Select from "../../components/ui/Select";
import ProgressBar from "../../components/ui/ProgressBar";

const Analytics = () => {
  const { showSuccess, showError } = useApp();
  const [timeframe, setTimeframe] = useState("30");
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [analyticsData, setAnalyticsData] = useState({
    kpis: {
      totalUsers: 2847,
      totalApplications: 3421,
      successRate: 72.4,
      avgResponseTime: 2.8,
      platformGrowth: 18.5,
      revenueGrowth: 24.3,
    },
    realTimeData: {
      activeUsers: 156,
      pendingApplications: 23,
      todayApplications: 89,
      systemLoad: 67,
    },
    performanceMetrics: [],
    userSegments: [],
    geographicData: [],
    industryBreakdown: [],
    conversionFunnel: [],
  });

  const tabs = [
    { id: "overview", label: "Overview", icon: Activity },
    { id: "performance", label: "Performance", icon: TrendingUp },
    { id: "users", label: "User Analytics", icon: Users },
    { id: "geography", label: "Geographic", icon: MapPin },
    { id: "revenue", label: "Revenue", icon: DollarSign },
  ];

  useEffect(() => {
    fetchAnalyticsData();
  }, [timeframe, activeTab]);

  const fetchAnalyticsData = async () => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1200));

      setAnalyticsData({
        kpis: {
          totalUsers: 2847,
          totalApplications: 3421,
          successRate: 72.4,
          avgResponseTime: 2.8,
          platformGrowth: 18.5,
          revenueGrowth: 24.3,
        },
        realTimeData: {
          activeUsers: 156,
          pendingApplications: 23,
          todayApplications: 89,
          systemLoad: 67,
        },
        performanceMetrics: [
          {
            metric: "Application Success Rate",
            current: 72.4,
            target: 75,
            trend: "up",
            change: 2.3,
          },
          {
            metric: "User Engagement",
            current: 84.2,
            target: 80,
            trend: "up",
            change: 5.1,
          },
          {
            metric: "Platform Uptime",
            current: 99.8,
            target: 99.5,
            trend: "stable",
            change: 0.1,
          },
          {
            metric: "Response Time",
            current: 2.8,
            target: 3.0,
            trend: "down",
            change: -0.4,
          },
          {
            metric: "User Satisfaction",
            current: 4.7,
            target: 4.5,
            trend: "up",
            change: 0.2,
          },
        ],
        userSegments: [
          {
            segment: "Entry Level (0-2 years)",
            users: 1240,
            percentage: 43.5,
            growth: 12.3,
          },
          {
            segment: "Mid Level (3-5 years)",
            users: 894,
            percentage: 31.4,
            growth: 8.7,
          },
          {
            segment: "Senior Level (6-10 years)",
            users: 567,
            percentage: 19.9,
            growth: 15.2,
          },
          {
            segment: "Executive Level (10+ years)",
            users: 146,
            percentage: 5.2,
            growth: 22.1,
          },
        ],
        geographicData: [
          {
            region: "North America",
            users: 1423,
            applications: 1876,
            successRate: 74.2,
          },
          {
            region: "Europe",
            users: 689,
            applications: 892,
            successRate: 71.8,
          },
          {
            region: "Asia Pacific",
            users: 512,
            applications: 634,
            successRate: 68.9,
          },
          {
            region: "Latin America",
            users: 223,
            applications: 298,
            successRate: 69.3,
          },
        ],
        industryBreakdown: [
          {
            industry: "Technology",
            applications: 1245,
            avgSalary: 125000,
            growth: 23.4,
          },
          {
            industry: "Finance",
            applications: 678,
            avgSalary: 115000,
            growth: 12.1,
          },
          {
            industry: "Healthcare",
            applications: 456,
            avgSalary: 95000,
            growth: 18.7,
          },
          {
            industry: "Marketing",
            applications: 334,
            avgSalary: 85000,
            growth: 15.3,
          },
          {
            industry: "Education",
            applications: 289,
            avgSalary: 65000,
            growth: 8.9,
          },
        ],
        conversionFunnel: [
          { stage: "Visitors", count: 12540, percentage: 100, dropOff: 0 },
          { stage: "Sign Ups", count: 3847, percentage: 30.7, dropOff: 69.3 },
          {
            stage: "Profile Completed",
            count: 2984,
            percentage: 77.6,
            dropOff: 22.4,
          },
          {
            stage: "First Application",
            count: 2156,
            percentage: 72.3,
            dropOff: 27.7,
          },
          {
            stage: "Interview Scheduled",
            count: 743,
            percentage: 34.5,
            dropOff: 65.5,
          },
          { stage: "Job Offer", count: 312, percentage: 42.0, dropOff: 58.0 },
        ],
      });
    } catch (error) {
      showError("Failed to fetch analytics data");
    } finally {
      setLoading(false);
    }
  };

  const handleExportData = () => {
    showSuccess("Analytics report exported successfully!");
  };

  const handleRefreshData = () => {
    fetchAnalyticsData();
    showSuccess("Data refreshed successfully!");
  };

  const timeframeOptions = [
    { value: "7", label: "Last 7 days" },
    { value: "30", label: "Last 30 days" },
    { value: "90", label: "Last 3 months" },
    { value: "180", label: "Last 6 months" },
    { value: "365", label: "Last year" },
  ];

  const KPICard = ({
    title,
    value,
    change,
    icon: Icon,
    trend,
    format = "number",
  }) => {
    const isPositive = change > 0;
    const formattedValue =
      format === "percentage"
        ? `${value}%`
        : format === "currency"
        ? `$${value.toLocaleString()}`
        : format === "decimal"
        ? value.toFixed(1)
        : value.toLocaleString();

    return (
      <Card className="relative overflow-hidden">
        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-primary-500/10 to-primary-600/5 rounded-full transform translate-x-8 -translate-y-8" />
        <Card.Body>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{title}</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {formattedValue}
              </p>
              <div
                className={`flex items-center gap-1 mt-2 text-sm ${
                  isPositive ? "text-green-600" : "text-red-600"
                }`}
              >
                {isPositive ? (
                  <TrendingUp size={16} />
                ) : (
                  <TrendingDown size={16} />
                )}
                <span>{Math.abs(change)}% vs last period</span>
              </div>
            </div>
            <div className="p-3 bg-primary-100 rounded-lg">
              <Icon className="text-primary-600" size={24} />
            </div>
          </div>
        </Card.Body>
      </Card>
    );
  };

  const renderOverviewTab = () => (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <KPICard
          title="Total Users"
          value={analyticsData.kpis.totalUsers}
          change={18.5}
          icon={Users}
          trend="up"
        />
        <KPICard
          title="Total Applications"
          value={analyticsData.kpis.totalApplications}
          change={12.3}
          icon={Briefcase}
          trend="up"
        />
        <KPICard
          title="Success Rate"
          value={analyticsData.kpis.successRate}
          change={2.4}
          icon={Target}
          trend="up"
          format="percentage"
        />
        <KPICard
          title="Avg Response Time"
          value={analyticsData.kpis.avgResponseTime}
          change={-8.2}
          icon={Clock}
          trend="down"
          format="decimal"
        />
        <KPICard
          title="Platform Growth"
          value={analyticsData.kpis.platformGrowth}
          change={5.7}
          icon={TrendingUp}
          trend="up"
          format="percentage"
        />
        <KPICard
          title="Revenue Growth"
          value={analyticsData.kpis.revenueGrowth}
          change={8.9}
          icon={DollarSign}
          trend="up"
          format="percentage"
        />
      </div>

      {/* Real-time Dashboard */}
      <Card>
        <Card.Header>
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              Real-time Dashboard
            </h3>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-sm text-gray-600">Live</span>
            </div>
          </div>
        </Card.Header>
        <Card.Body>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {analyticsData.realTimeData.activeUsers}
              </div>
              <div className="text-sm text-gray-600">Active Users</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {analyticsData.realTimeData.pendingApplications}
              </div>
              <div className="text-sm text-gray-600">Pending Reviews</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {analyticsData.realTimeData.todayApplications}
              </div>
              <div className="text-sm text-gray-600">Today's Applications</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {analyticsData.realTimeData.systemLoad}%
              </div>
              <div className="text-sm text-gray-600">System Load</div>
            </div>
          </div>
        </Card.Body>
      </Card>

      {/* Conversion Funnel */}
      <Card>
        <Card.Header>
          <h3 className="text-lg font-semibold text-gray-900">
            Conversion Funnel
          </h3>
          <p className="text-sm text-gray-600">
            User journey from visit to job offer
          </p>
        </Card.Header>
        <Card.Body>
          <div className="space-y-4">
            {analyticsData.conversionFunnel.map((stage, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-900">
                    {stage.stage}
                  </span>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-600">
                      {stage.count.toLocaleString()}
                    </span>
                    <span className="text-sm font-medium text-primary-600">
                      {stage.percentage}%
                    </span>
                    {stage.dropOff > 0 && (
                      <span className="text-xs text-red-600">
                        -{stage.dropOff}%
                      </span>
                    )}
                  </div>
                </div>
                <ProgressBar
                  value={stage.percentage}
                  variant={
                    stage.percentage > 50
                      ? "success"
                      : stage.percentage > 25
                      ? "warning"
                      : "error"
                  }
                />
              </div>
            ))}
          </div>
        </Card.Body>
      </Card>
    </div>
  );

  const renderPerformanceTab = () => (
    <div className="space-y-6">
      <Card>
        <Card.Header>
          <h3 className="text-lg font-semibold text-gray-900">
            Performance Metrics
          </h3>
          <p className="text-sm text-gray-600">
            Key performance indicators and targets
          </p>
        </Card.Header>
        <Card.Body>
          <div className="space-y-6">
            {analyticsData.performanceMetrics.map((metric, index) => (
              <div key={index} className="space-y-3">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium text-gray-900">{metric.metric}</h4>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-600">
                      Target: {metric.target}%
                    </span>
                    <div
                      className={`flex items-center gap-1 text-sm ${
                        metric.trend === "up"
                          ? "text-green-600"
                          : metric.trend === "down"
                          ? "text-red-600"
                          : "text-gray-600"
                      }`}
                    >
                      {metric.trend === "up" ? (
                        <TrendingUp size={14} />
                      ) : metric.trend === "down" ? (
                        <TrendingDown size={14} />
                      ) : null}
                      <span>{Math.abs(metric.change)}%</span>
                    </div>
                  </div>
                </div>
                <div className="relative">
                  <ProgressBar
                    value={(metric.current / metric.target) * 100}
                    variant={
                      metric.current >= metric.target ? "success" : "warning"
                    }
                  />
                  <div className="flex justify-between text-xs text-gray-600 mt-1">
                    <span>Current: {metric.current}%</span>
                    <span>Target: {metric.target}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card.Body>
      </Card>

      {/* Industry Performance */}
      <Card>
        <Card.Header>
          <h3 className="text-lg font-semibold text-gray-900">
            Industry Performance
          </h3>
        </Card.Header>
        <Card.Body>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-900">
                    Industry
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">
                    Applications
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">
                    Avg. Salary
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">
                    Growth
                  </th>
                </tr>
              </thead>
              <tbody>
                {analyticsData.industryBreakdown.map((industry, index) => (
                  <tr
                    key={index}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="py-3 px-4 font-medium text-gray-900">
                      {industry.industry}
                    </td>
                    <td className="py-3 px-4 text-gray-600">
                      {industry.applications.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-gray-600">
                      ${industry.avgSalary.toLocaleString()}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1 text-green-600">
                        <TrendingUp size={14} />
                        <span className="text-sm">+{industry.growth}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card.Body>
      </Card>
    </div>
  );

  const renderUsersTab = () => (
    <div className="space-y-6">
      <Card>
        <Card.Header>
          <h3 className="text-lg font-semibold text-gray-900">
            User Segments by Experience
          </h3>
        </Card.Header>
        <Card.Body>
          <div className="space-y-4">
            {analyticsData.userSegments.map((segment, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-900">
                    {segment.segment}
                  </span>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-600">
                      {segment.users.toLocaleString()} users
                    </span>
                    <span className="text-sm font-medium text-primary-600">
                      {segment.percentage}%
                    </span>
                    <span className="text-xs text-green-600">
                      +{segment.growth}%
                    </span>
                  </div>
                </div>
                <ProgressBar value={segment.percentage} variant="primary" />
              </div>
            ))}
          </div>
        </Card.Body>
      </Card>
    </div>
  );

  const renderGeographyTab = () => (
    <div className="space-y-6">
      <Card>
        <Card.Header>
          <h3 className="text-lg font-semibold text-gray-900">
            Geographic Distribution
          </h3>
        </Card.Header>
        <Card.Body>
          <div className="grid gap-4">
            {analyticsData.geographicData.map((region, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div>
                  <h4 className="font-medium text-gray-900">{region.region}</h4>
                  <p className="text-sm text-gray-600">
                    {region.users.toLocaleString()} users
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-gray-900">
                    {region.applications.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600">applications</div>
                  <div
                    className={`text-sm font-medium ${
                      region.successRate >= 70
                        ? "text-green-600"
                        : "text-yellow-600"
                    }`}
                  >
                    {region.successRate}% success
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card.Body>
      </Card>
    </div>
  );

  const renderRevenueTab = () => (
    <div className="space-y-6">
      <Card>
        <Card.Header>
          <h3 className="text-lg font-semibold text-gray-900">
            Revenue Analytics
          </h3>
          <p className="text-sm text-gray-600">
            Financial performance and projections
          </p>
        </Card.Header>
        <Card.Body>
          <div className="text-center py-12">
            <DollarSign className="mx-auto text-gray-400 mb-4" size={48} />
            <h4 className="text-lg font-medium text-gray-900 mb-2">
              Revenue Analytics
            </h4>
            <p className="text-gray-600">
              Detailed revenue analytics will be available in the next update.
            </p>
          </div>
        </Card.Body>
      </Card>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return renderOverviewTab();
      case "performance":
        return renderPerformanceTab();
      case "users":
        return renderUsersTab();
      case "geography":
        return renderGeographyTab();
      case "revenue":
        return renderRevenueTab();
      default:
        return renderOverviewTab();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="spinner mb-4" />
          <p className="text-gray-600">Loading analytics data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Advanced Analytics
          </h1>
          <p className="text-gray-600 mt-1">
            Comprehensive insights and performance metrics
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Select
            options={timeframeOptions}
            value={timeframe}
            onChange={setTimeframe}
            className="w-40"
          />
          <Button
            onClick={handleRefreshData}
            icon={<RefreshCw size={16} />}
            variant="outline"
          >
            Refresh
          </Button>
          <Button onClick={handleExportData} icon={<Download size={16} />}>
            Export Data
          </Button>
        </div>
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
      <div className="fade-in">{renderTabContent()}</div>
    </div>
  );
};

export default Analytics;
