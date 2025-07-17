import React, { useState, useEffect } from "react";
import {
  Users,
  Briefcase,
  TrendingUp,
  Clock,
  Target,
  CheckCircle,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useApp } from "../../context/AppContext";
import userService from "../../services/user.service";
import jobService from "../../services/job.service";
import StatsCard from "../../components/dashboard/StatsCard";
import JobCard from "../../components/dashboard/JobCard";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";

const UserDashboard = () => {
  const { user } = useAuth();
  const { showSuccess, showError } = useApp();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    stats: {
      totalApplications: 0,
      pendingApplications: 0,
      scheduledInterviews: 0,
      jobMatches: 0,
      profileCompleteness: 0,
      responseRate: 0,
    },
    recentApplications: [],
    recommendedJobs: [],
    upcomingInterviews: [],
    activityLog: [],
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const data = await userService.getDashboardStats();
      setDashboardData(data);
    } catch (error) {
      showError("Failed to load dashboard data");
      console.error("Dashboard error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleJobAction = async (jobId, action) => {
    try {
      switch (action) {
        case "save":
          await userService.saveJob(jobId);
          showSuccess("Job saved successfully");
          break;
        case "unsave":
          await userService.unsaveJob(jobId);
          showSuccess("Job removed from saved");
          break;
        case "apply":
          await jobService.applyToJob(jobId);
          showSuccess("Application submitted successfully");
          fetchDashboardData(); // Refresh data
          break;
        default:
          break;
      }
    } catch (error) {
      showError(`Failed to ${action} job`);
      console.error(`Job ${action} error:`, error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const { stats, recentApplications, recommendedJobs, upcomingInterviews } =
    dashboardData;

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">
          Welcome back, {user?.name?.split(" ")[0] || "User"}! 👋
        </h1>
        <p className="text-blue-100">
          {stats.pendingApplications > 0
            ? `You have ${stats.pendingApplications} pending applications`
            : "Keep up the great work on your job search!"}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatsCard
          title="Total Applications"
          value={stats.totalApplications}
          icon={<Briefcase className="w-5 h-5" />}
          color="blue"
          trend={{
            value: stats.applicationsTrend,
            isPositive: stats.applicationsTrend > 0,
          }}
        />
        <StatsCard
          title="Pending"
          value={stats.pendingApplications}
          icon={<Clock className="w-5 h-5" />}
          color="yellow"
        />
        <StatsCard
          title="Interviews"
          value={stats.scheduledInterviews}
          icon={<Users className="w-5 h-5" />}
          color="green"
        />
        <StatsCard
          title="Job Matches"
          value={stats.jobMatches}
          icon={<Target className="w-5 h-5" />}
          color="purple"
        />
        <StatsCard
          title="Profile Complete"
          value={`${stats.profileCompleteness}%`}
          icon={<CheckCircle className="w-5 h-5" />}
          color="emerald"
        />
        <StatsCard
          title="Response Rate"
          value={`${stats.responseRate}%`}
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
              <Button variant="outline" size="sm" href="/applications">
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
                        Applied{" "}
                        {new Date(application.appliedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          application.status === "interview"
                            ? "bg-green-100 text-green-800"
                            : application.status === "applied"
                            ? "bg-blue-100 text-blue-800"
                            : application.status === "rejected"
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {application.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No applications yet</p>
                <Button className="mt-4" href="/jobs">
                  Browse Jobs
                </Button>
              </div>
            )}
          </Card.Body>
        </Card>

        {/* Recommended Jobs */}
        <Card>
          <Card.Header>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                Recommended Jobs
              </h3>
              <Button variant="outline" size="sm" href="/jobs">
                View All
              </Button>
            </div>
          </Card.Header>
          <Card.Body>
            {recommendedJobs.length > 0 ? (
              <div className="space-y-4">
                {recommendedJobs.slice(0, 3).map((job) => (
                  <JobCard
                    key={job.id}
                    job={job}
                    onSave={() => handleJobAction(job.id, "save")}
                    onUnsave={() => handleJobAction(job.id, "unsave")}
                    onApply={() => handleJobAction(job.id, "apply")}
                    compact
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No job recommendations yet</p>
                <p className="text-sm text-gray-500 mt-2">
                  Complete your profile to get better matches
                </p>
              </div>
            )}
          </Card.Body>
        </Card>
      </div>

      {/* Upcoming Interviews */}
      {upcomingInterviews.length > 0 && (
        <Card>
          <Card.Header>
            <h3 className="text-lg font-semibold text-gray-900">
              Upcoming Interviews
            </h3>
          </Card.Header>
          <Card.Body>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {upcomingInterviews.map((interview) => (
                <div
                  key={interview.id}
                  className="p-4 border border-gray-200 rounded-lg"
                >
                  <h4 className="font-medium text-gray-900">
                    {interview.jobTitle}
                  </h4>
                  <p className="text-sm text-gray-600">{interview.company}</p>
                  <p className="text-sm text-gray-500 mt-2">
                    {new Date(interview.scheduledAt).toLocaleDateString()} at{" "}
                    {new Date(interview.scheduledAt).toLocaleTimeString()}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Type: {interview.type}
                  </p>
                  {interview.meetingLink && (
                    <Button
                      size="sm"
                      className="mt-3"
                      href={interview.meetingLink}
                      target="_blank"
                    >
                      Join Meeting
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </Card.Body>
        </Card>
      )}
    </div>
  );
};

export default UserDashboard;
