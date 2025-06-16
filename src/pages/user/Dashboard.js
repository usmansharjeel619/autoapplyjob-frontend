import React, { useState, useEffect } from "react";
import {
  Briefcase,
  Eye,
  Phone,
  X,
  TrendingUp,
  Search,
  Filter,
  Plus,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useApp } from "../../context/AppContext";
import StatsCard from "../../components/dashboard/StatsCard";
import JobCard from "../../components/dashboard/JobCard";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";

const Dashboard = () => {
  const { user, getUserDisplayName } = useAuth();
  const { showSuccess, showError } = useApp();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    stats: {
      totalApplications: 0,
      viewedByRecruiter: 0,
      interviewCalls: 0,
      rejections: 0,
    },
    recentJobs: [],
    savedJobs: [],
  });

  // Mock data - replace with actual API calls
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));

        setDashboardData({
          stats: {
            totalApplications: 47,
            viewedByRecruiter: 23,
            interviewCalls: 8,
            rejections: 12,
          },
          recentJobs: [
            {
              id: 1,
              title: "Senior Frontend Developer",
              company: "TechCorp Inc.",
              location: "San Francisco, CA",
              workType: "Remote",
              salary: 120000,
              description:
                "We are looking for a senior frontend developer with expertise in React and TypeScript...",
              skills: ["React", "TypeScript", "Node.js", "AWS"],
              postedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
              matchScore: 92,
              status: "pending",
            },
            {
              id: 2,
              title: "Full Stack Engineer",
              company: "StartupXYZ",
              location: "New York, NY",
              workType: "Hybrid",
              salary: 95000,
              description:
                "Join our fast-growing startup as a full stack engineer working on cutting-edge products...",
              skills: ["JavaScript", "Python", "React", "Django"],
              postedDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
              matchScore: 88,
              status: "approved",
            },
            {
              id: 3,
              title: "React Developer",
              company: "Digital Solutions",
              location: "Austin, TX",
              workType: "On-site",
              salary: 85000,
              description:
                "Looking for a passionate React developer to join our development team...",
              skills: ["React", "JavaScript", "CSS", "Redux"],
              postedDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
              matchScore: 85,
              status: "applied",
            },
          ],
        });
      } catch (error) {
        showError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [showError]);

  const handleSaveJob = (jobId) => {
    showSuccess("Job saved successfully!");
  };

  const handleUnsaveJob = (jobId) => {
    showSuccess("Job removed from saved list");
  };

  const handleViewJobDetails = (job) => {
    // Navigate to job details or open modal
    console.log("View job details:", job);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="spinner" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl text-white p-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              Welcome back, {getUserDisplayName()}! 👋
            </h1>
            <p className="text-primary-100 text-lg">
              Your AI job hunter has been working around the clock. Here's what
              we found for you.
            </p>
          </div>

          <div className="hidden md:block">
            <div className="bg-white/10 rounded-lg p-6 backdrop-blur-sm">
              <div className="text-center">
                <div className="text-2xl font-bold mb-1">24/7</div>
                <div className="text-sm text-primary-100">AI Job Hunting</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Applications"
          value={dashboardData.stats.totalApplications}
          change={15}
          changeType="positive"
          icon={Briefcase}
          color="primary"
        />
        <StatsCard
          title="Viewed by Recruiter"
          value={dashboardData.stats.viewedByRecruiter}
          change={8}
          changeType="positive"
          icon={Eye}
          color="success"
        />
        <StatsCard
          title="Interview Calls"
          value={dashboardData.stats.interviewCalls}
          change={25}
          changeType="positive"
          icon={Phone}
          color="info"
        />
        <StatsCard
          title="Response Rate"
          value={`${Math.round(
            (dashboardData.stats.viewedByRecruiter /
              dashboardData.stats.totalApplications) *
              100
          )}%`}
          change={5}
          changeType="positive"
          icon={TrendingUp}
          color="warning"
        />
      </div>

      {/* Quick Actions */}
      <Card>
        <Card.Header>
          <h2 className="text-xl font-semibold text-gray-900">Quick Actions</h2>
        </Card.Header>
        <Card.Body>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              className="justify-start h-auto p-4 flex-col items-start"
              variant="outline"
            >
              <Search className="mb-2" size={24} />
              <div className="text-left">
                <div className="font-medium">Browse Jobs</div>
                <div className="text-sm text-gray-500">
                  Explore new opportunities
                </div>
              </div>
            </Button>

            <Button
              className="justify-start h-auto p-4 flex-col items-start"
              variant="outline"
            >
              <Plus className="mb-2" size={24} />
              <div className="text-left">
                <div className="font-medium">Update Profile</div>
                <div className="text-sm text-gray-500">
                  Improve your matches
                </div>
              </div>
            </Button>

            <Button
              className="justify-start h-auto p-4 flex-col items-start"
              variant="outline"
            >
              <Filter className="mb-2" size={24} />
              <div className="text-left">
                <div className="font-medium">AI Tools</div>
                <div className="text-sm text-gray-500">
                  Optimize your resume
                </div>
              </div>
            </Button>
          </div>
        </Card.Body>
      </Card>

      {/* Recent Job Matches */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            Latest Job Matches
          </h2>
          <Button variant="outline">View All Jobs</Button>
        </div>

        {dashboardData.recentJobs.length === 0 ? (
          <Card>
            <Card.Body className="text-center py-12">
              <Briefcase className="mx-auto text-gray-400 mb-4" size={48} />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No job matches yet
              </h3>
              <p className="text-gray-600 mb-6">
                Complete your profile to help our AI find better matches for
                you.
              </p>
              <Button>Complete Profile</Button>
            </Card.Body>
          </Card>
        ) : (
          <div className="grid gap-6">
            {dashboardData.recentJobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                onSave={handleSaveJob}
                onUnsave={handleUnsaveJob}
                onViewDetails={handleViewJobDetails}
                showSaveButton={true}
                showApplyButton={false}
              />
            ))}
          </div>
        )}
      </div>

      {/* Activity Timeline */}
      <Card>
        <Card.Header>
          <h2 className="text-xl font-semibold text-gray-900">
            Recent Activity
          </h2>
        </Card.Header>
        <Card.Body>
          <div className="space-y-4">
            {[
              {
                type: "application",
                message:
                  "Applied to Senior Frontend Developer at TechCorp Inc.",
                time: "2 hours ago",
                icon: Briefcase,
                color: "text-blue-600",
              },
              {
                type: "view",
                message: "Your application was viewed by StartupXYZ recruiter",
                time: "5 hours ago",
                icon: Eye,
                color: "text-green-600",
              },
              {
                type: "match",
                message: "3 new job matches found in your area",
                time: "1 day ago",
                icon: TrendingUp,
                color: "text-purple-600",
              },
            ].map((activity, index) => {
              const Icon = activity.icon;
              return (
                <div key={index} className="flex items-start gap-3">
                  <div
                    className={`p-2 rounded-lg bg-gray-100 ${activity.color}`}
                  >
                    <Icon size={16} />
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-900">{activity.message}</p>
                    <p className="text-sm text-gray-500">{activity.time}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Dashboard;
