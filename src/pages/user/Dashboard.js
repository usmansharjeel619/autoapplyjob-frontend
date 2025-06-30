import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FileText,
  Settings,
  User,
  TrendingUp,
  Calendar,
  Clock,
  CheckCircle,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useApp } from "../../context/AppContext";
import { StatsCard, ActivityTimeline } from "../../components/dashboard";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";

const Dashboard = () => {
  const { user } = useAuth();
  const { showSuccess } = useApp();
  const [stats, setStats] = useState({
    profileViews: 0,
    appliedJobs: 0,
    interviews: 0,
    cvUpdates: 0,
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Mock data - replace with actual API calls
      const mockStats = {
        profileViews: 127,
        appliedJobs: 45,
        interviews: 8,
        cvUpdates: 12,
      };

      const mockActivity = [
        {
          id: 1,
          type: "application",
          title: "Applied to Senior Developer at TechCorp",
          time: "2 hours ago",
          status: "success",
        },
        {
          id: 2,
          type: "profile_update",
          title: "CV updated with AI optimization",
          time: "1 day ago",
          status: "success",
        },
        {
          id: 3,
          type: "interview",
          title: "Interview scheduled with DataSoft",
          time: "2 days ago",
          status: "pending",
        },
        {
          id: 4,
          type: "application",
          title: "Applied to Frontend Role at StartupX",
          time: "3 days ago",
          status: "success",
        },
      ];

      setStats(mockStats);
      setRecentActivity(mockActivity);
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-black to-gray-800 rounded-xl p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">
          Welcome back, {user?.name || "Job Seeker"}!
        </h1>
        <p className="text-gray-300 mb-6">
          Our team is actively working on finding and applying to jobs for you.
        </p>
        <div className="flex gap-4">
          <Link to="/profile">
            <Button
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-black"
            >
              Update Profile
            </Button>
          </Link>
          <Link to="/tools">
            <Button className="bg-white text-black hover:bg-gray-100">
              AI CV Update
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Profile Views"
          value={stats.profileViews}
          icon={User}
          change={12}
          trend="up"
        />
        <StatsCard
          title="Jobs Applied"
          value={stats.appliedJobs}
          icon={FileText}
          change={8}
          trend="up"
        />
        <StatsCard
          title="Interviews"
          value={stats.interviews}
          icon={Calendar}
          change={2}
          trend="up"
        />
        <StatsCard
          title="CV Updates"
          value={stats.cvUpdates}
          icon={TrendingUp}
          change={4}
          trend="up"
        />
      </div>

      {/* Main Content */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <Card>
            <Card.Header>
              <h2 className="text-xl font-semibold text-gray-900">
                Recent Activity
              </h2>
              <p className="text-gray-600 text-sm">
                Latest updates on your job applications
              </p>
            </Card.Header>
            <Card.Body>
              <ActivityTimeline activities={recentActivity} />
            </Card.Body>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="space-y-6">
          <Card>
            <Card.Header>
              <h3 className="text-lg font-semibold text-gray-900">
                Quick Actions
              </h3>
            </Card.Header>
            <Card.Body>
              <div className="space-y-3">
                <Link
                  to="/profile"
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <User className="text-black" size={20} />
                  <span className="font-medium text-gray-900">
                    Edit Profile
                  </span>
                </Link>
                <Link
                  to="/tools"
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <FileText className="text-black" size={20} />
                  <span className="font-medium text-gray-900">Update CV</span>
                </Link>
                <Link
                  to="/settings"
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <Settings className="text-black" size={20} />
                  <span className="font-medium text-gray-900">Settings</span>
                </Link>
              </div>
            </Card.Body>
          </Card>

          {/* Application Status */}
          <Card>
            <Card.Header>
              <h3 className="text-lg font-semibold text-gray-900">
                Application Status
              </h3>
            </Card.Header>
            <Card.Body>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Pending Review</span>
                  <span className="text-yellow-600 font-medium">12</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Applied</span>
                  <span className="text-blue-600 font-medium">33</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Interview Scheduled</span>
                  <span className="text-green-600 font-medium">8</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Offers Received</span>
                  <span className="text-purple-600 font-medium">2</span>
                </div>
              </div>
            </Card.Body>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
