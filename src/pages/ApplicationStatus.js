import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bot,
  Clock,
  CheckCircle,
  XCircle,
  Calendar,
  Building,
  MapPin,
  DollarSign,
  Filter,
  Search,
  Eye,
  MailIcon,
  AlertCircle,
  TrendingUp,
} from "lucide-react";
import userService from "../../services/user.service";
import { useNotification } from "../../context/NotificationContext";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";

const ApplicationStatus = () => {
  const navigate = useNavigate();
  const { showError, showSuccess } = useNotification();

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
    total: 0,
    totalPages: 0,
  });

  useEffect(() => {
    fetchApplications();
  }, [pagination.page, statusFilter, dateFilter]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const response = await userService.getApplicationHistory({
        page: pagination.page,
        pageSize: pagination.pageSize,
        status: statusFilter === "all" ? "" : statusFilter,
        dateFilter,
        searchQuery,
      });

      setApplications(response.data.applications || []);
      setPagination((prev) => ({
        ...prev,
        total: response.data.pagination?.total || 0,
        totalPages: response.data.pagination?.totalPages || 0,
      }));
    } catch (error) {
      console.error("Failed to fetch applications:", error);
      showError("Failed to load application history");
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "submitted":
      case "applied":
        return <Bot className="w-5 h-5 text-blue-600" />;
      case "pending":
        return <Clock className="w-5 h-5 text-yellow-600" />;
      case "interview_scheduled":
        return <Calendar className="w-5 h-5 text-purple-600" />;
      case "approved":
      case "offer_received":
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case "rejected":
      case "rejected_by_employer":
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return <Clock className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "submitted":
      case "applied":
        return "bg-blue-100 text-blue-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "interview_scheduled":
        return "bg-purple-100 text-purple-800";
      case "approved":
      case "offer_received":
        return "bg-green-100 text-green-800";
      case "rejected":
      case "rejected_by_employer":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatStatus = (status) => {
    const statusMap = {
      submitted: "Auto-Applied",
      applied: "Auto-Applied",
      pending: "Under Review",
      interview_scheduled: "Interview Scheduled",
      approved: "Approved",
      offer_received: "Offer Received",
      rejected: "Not Selected",
      rejected_by_employer: "Not Selected",
    };
    return statusMap[status] || status.replace("_", " ");
  };

  const filteredApplications = applications.filter(
    (app) =>
      searchQuery === "" ||
      app.job?.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.job?.company?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const statusCounts = applications.reduce((acc, app) => {
    acc[app.status] = (acc[app.status] || 0) + 1;
    return acc;
  }, {});

  if (loading && applications.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
              <p className="text-gray-600">
                Loading your application status...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Application Status
          </h1>
          <p className="text-gray-600">
            Track all automated job applications submitted on your behalf
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <Card.Body className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Applications</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {applications.length}
                  </p>
                </div>
                <Bot className="w-8 h-8 text-blue-600" />
              </div>
            </Card.Body>
          </Card>

          <Card>
            <Card.Body className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Pending Review</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {statusCounts.pending || 0}
                  </p>
                </div>
                <Clock className="w-8 h-8 text-yellow-600" />
              </div>
            </Card.Body>
          </Card>

          <Card>
            <Card.Body className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Interviews</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {statusCounts.interview_scheduled || 0}
                  </p>
                </div>
                <Calendar className="w-8 h-8 text-purple-600" />
              </div>
            </Card.Body>
          </Card>

          <Card>
            <Card.Body className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Success Rate</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {applications.length > 0
                      ? Math.round(
                          (((statusCounts.approved || 0) +
                            (statusCounts.offer_received || 0)) /
                            applications.length) *
                            100
                        )
                      : 0}
                    %
                  </p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-600" />
              </div>
            </Card.Body>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="mb-6">
          <Card.Body className="p-6">
            <div className="flex flex-col lg:flex-row lg:items-center gap-4">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <Search
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={20}
                  />
                  <input
                    type="text"
                    placeholder="Search by job title or company..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>

              {/* Filters */}
              <div className="flex items-center gap-4">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="all">All Statuses</option>
                  <option value="submitted">Auto-Applied</option>
                  <option value="pending">Under Review</option>
                  <option value="interview_scheduled">
                    Interview Scheduled
                  </option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Not Selected</option>
                </select>

                <select
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="all">All Time</option>
                  <option value="today">Today</option>
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                </select>
              </div>
            </div>
          </Card.Body>
        </Card>

        {/* Applications List */}
        {filteredApplications.length === 0 ? (
          <Card>
            <Card.Body className="p-12 text-center">
              <Bot className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No Applications Yet
              </h3>
              <p className="text-gray-600 mb-6">
                Our automation system is preparing to submit applications on
                your behalf. Applications will appear here once they're
                submitted.
              </p>
              <Button onClick={() => navigate("/profile")} className="mx-auto">
                Complete Your Profile
              </Button>
            </Card.Body>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredApplications.map((application) => (
              <Card key={application.id}>
                <Card.Body className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                        {getStatusIcon(application.status)}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-1">
                              {application.job?.title || "Job Title"}
                            </h3>
                            <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                              <div className="flex items-center gap-1">
                                <Building size={14} />
                                <span>
                                  {application.job?.company || "Company"}
                                </span>
                              </div>
                              {application.job?.location && (
                                <div className="flex items-center gap-1">
                                  <MapPin size={14} />
                                  <span>{application.job.location}</span>
                                </div>
                              )}
                              {application.job?.salary && (
                                <div className="flex items-center gap-1">
                                  <DollarSign size={14} />
                                  <span>{application.job.salary}</span>
                                </div>
                              )}
                            </div>
                          </div>

                          <span
                            className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                              application.status
                            )}`}
                          >
                            {formatStatus(application.status)}
                          </span>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="text-sm text-gray-500">
                            Applied on{" "}
                            {new Date(
                              application.appliedAt || application.createdAt
                            ).toLocaleDateString()}
                            {application.matchScore && (
                              <span className="ml-2 text-blue-600 font-medium">
                                {application.matchScore}% match
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              icon={<Eye size={16} />}
                              onClick={() =>
                                console.log("View details", application.id)
                              }
                            >
                              View Details
                            </Button>
                            {application.status === "interview_scheduled" && (
                              <Button
                                variant="ghost"
                                size="sm"
                                icon={<MailIcon size={16} />}
                                onClick={() =>
                                  console.log("Send email", application.id)
                                }
                              >
                                Contact
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="mt-8 flex justify-center">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={pagination.page === 1}
                onClick={() =>
                  setPagination((prev) => ({ ...prev, page: prev.page - 1 }))
                }
              >
                Previous
              </Button>

              <span className="px-4 py-2 text-sm text-gray-600">
                Page {pagination.page} of {pagination.totalPages}
              </span>

              <Button
                variant="outline"
                size="sm"
                disabled={pagination.page === pagination.totalPages}
                onClick={() =>
                  setPagination((prev) => ({ ...prev, page: prev.page + 1 }))
                }
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApplicationStatus;
