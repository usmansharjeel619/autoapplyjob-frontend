import React, { useState, useEffect } from "react";
import {
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  FileText,
  Download,
  AlertCircle,
} from "lucide-react";
import { useApp } from "../../context/AppContext";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import Select from "../../components/ui/Select";

const Applications = () => {
  const { showSuccess, showError } = useApp();
  const [applications, setApplications] = useState([]);
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [processingIds, setProcessingIds] = useState(new Set());

  useEffect(() => {
    fetchApplications();
  }, []);

  useEffect(() => {
    filterApplications();
  }, [applications, searchQuery, statusFilter]);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      // Mock data
      const mockApplications = [
        {
          id: 1,
          applicantName: "John Smith",
          applicantEmail: "john.smith@email.com",
          jobTitle: "Senior Frontend Developer",
          company: "TechCorp Inc.",
          matchScore: 92,
          status: "pending_review",
          submittedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
          reviewedAt: null,
          appliedAt: null,
          salary: "$120,000",
          location: "San Francisco, CA",
        },
        {
          id: 2,
          applicantName: "Sarah Johnson",
          applicantEmail: "sarah.j@email.com",
          jobTitle: "Product Manager",
          company: "StartupXYZ",
          matchScore: 88,
          status: "applied",
          submittedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
          reviewedAt: new Date(Date.now() - 20 * 60 * 60 * 1000),
          appliedAt: new Date(Date.now() - 18 * 60 * 60 * 1000),
          salary: "$95,000",
          location: "New York, NY",
        },
        {
          id: 3,
          applicantName: "Mike Chen",
          applicantEmail: "mike.chen@email.com",
          jobTitle: "Data Scientist",
          company: "AI Solutions",
          matchScore: 95,
          status: "interview_scheduled",
          submittedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          reviewedAt: new Date(Date.now() - 1.5 * 24 * 60 * 60 * 1000),
          appliedAt: new Date(Date.now() - 1.2 * 24 * 60 * 60 * 1000),
          salary: "$130,000",
          location: "Seattle, WA",
        },
      ];
      setApplications(mockApplications);
    } catch (error) {
      showError("Failed to load applications");
    } finally {
      setLoading(false);
    }
  };

  const filterApplications = () => {
    let filtered = [...applications];

    if (searchQuery.trim()) {
      filtered = filtered.filter(
        (app) =>
          app.applicantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          app.jobTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
          app.company.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (statusFilter) {
      filtered = filtered.filter((app) => app.status === statusFilter);
    }

    setFilteredApplications(filtered);
  };

  const handleApprove = async (applicationId) => {
    setProcessingIds((prev) => new Set(prev).add(applicationId));
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setApplications((prev) =>
        prev.map((app) =>
          app.id === applicationId
            ? { ...app, status: "applied", appliedAt: new Date() }
            : app
        )
      );
      showSuccess("Application approved and submitted!");
    } catch (error) {
      showError("Failed to approve application");
    } finally {
      setProcessingIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(applicationId);
        return newSet;
      });
    }
  };

  const handleReject = async (applicationId) => {
    setProcessingIds((prev) => new Set(prev).add(applicationId));
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setApplications((prev) =>
        prev.map((app) =>
          app.id === applicationId ? { ...app, status: "rejected" } : app
        )
      );
      showSuccess("Application rejected");
    } catch (error) {
      showError("Failed to reject application");
    } finally {
      setProcessingIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(applicationId);
        return newSet;
      });
    }
  };

  const getStatusBadge = (status) => {
    const configs = {
      pending_review: {
        color: "bg-yellow-100 text-yellow-800",
        label: "Pending Review",
        icon: Clock,
      },
      applied: {
        color: "bg-blue-100 text-blue-800",
        label: "Applied",
        icon: CheckCircle,
      },
      interview_scheduled: {
        color: "bg-green-100 text-green-800",
        label: "Interview Scheduled",
        icon: CheckCircle,
      },
      rejected: {
        color: "bg-red-100 text-red-800",
        label: "Rejected",
        icon: XCircle,
      },
    };

    const config = configs[status] || configs.pending_review;
    const Icon = config.icon;

    return (
      <span
        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}
      >
        <Icon size={12} />
        {config.label}
      </span>
    );
  };

  const statusOptions = [
    { value: "", label: "All Status" },
    { value: "pending_review", label: "Pending Review" },
    { value: "applied", label: "Applied" },
    { value: "interview_scheduled", label: "Interview Scheduled" },
    { value: "rejected", label: "Rejected" },
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
          <h1 className="text-3xl font-bold text-gray-900">Applications</h1>
          <p className="text-gray-600 mt-1">
            {filteredApplications.length} applications to review
          </p>
        </div>
        <Button icon={<Download size={16} />} variant="outline">
          Export Report
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          {
            label: "Pending Review",
            count: applications.filter((a) => a.status === "pending_review")
              .length,
            color: "text-yellow-600",
          },
          {
            label: "Applied Today",
            count: applications.filter((a) => a.status === "applied").length,
            color: "text-blue-600",
          },
          {
            label: "Interviews Scheduled",
            count: applications.filter(
              (a) => a.status === "interview_scheduled"
            ).length,
            color: "text-green-600",
          },
          {
            label: "Rejected",
            count: applications.filter((a) => a.status === "rejected").length,
            color: "text-red-600",
          },
        ].map((stat, index) => (
          <div
            key={index}
            className="bg-white p-4 rounded-lg border border-gray-200"
          >
            <div className={`text-2xl font-bold ${stat.color}`}>
              {stat.count}
            </div>
            <div className="text-sm text-gray-600">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <Card>
        <Card.Body>
          <div className="flex gap-4">
            <Input
              placeholder="Search applications..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              icon={<Search size={16} />}
              className="flex-1"
            />
            <Select
              options={statusOptions}
              value={statusFilter}
              onChange={setStatusFilter}
              className="w-48"
            />
          </div>
        </Card.Body>
      </Card>

      {/* Applications List */}
      <div className="space-y-4">
        {filteredApplications.map((application) => (
          <Card
            key={application.id}
            className="hover:shadow-md transition-shadow"
          >
            <Card.Body>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {application.jobTitle}
                    </h3>
                    {getStatusBadge(application.status)}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Applicant:</span>
                      <p className="font-medium text-gray-900">
                        {application.applicantName}
                      </p>
                      <p className="text-gray-600">
                        {application.applicantEmail}
                      </p>
                    </div>

                    <div>
                      <span className="text-gray-500">Company:</span>
                      <p className="font-medium text-gray-900">
                        {application.company}
                      </p>
                      <p className="text-gray-600">{application.location}</p>
                    </div>

                    <div>
                      <span className="text-gray-500">Match Score:</span>
                      <p className="font-medium text-primary-600">
                        {application.matchScore}%
                      </p>
                      <p className="text-gray-600">{application.salary}</p>
                    </div>

                    <div>
                      <span className="text-gray-500">Submitted:</span>
                      <p className="font-medium text-gray-900">
                        {application.submittedAt.toLocaleDateString()}
                      </p>
                      <p className="text-gray-600">
                        {application.submittedAt.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 ml-4">
                  <Button size="sm" variant="ghost" icon={<Eye size={16} />}>
                    View Details
                  </Button>

                  {application.status === "pending_review" && (
                    <>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleReject(application.id)}
                        loading={processingIds.has(application.id)}
                        className="text-red-600 border-red-300 hover:bg-red-50"
                      >
                        Reject
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleApprove(application.id)}
                        loading={processingIds.has(application.id)}
                      >
                        Approve & Apply
                      </Button>
                    </>
                  )}
                </div>
              </div>

              {application.status === "pending_review" && (
                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="text-yellow-600" size={16} />
                    <span className="text-sm font-medium text-yellow-800">
                      Action Required
                    </span>
                  </div>
                  <p className="text-sm text-yellow-700 mt-1">
                    This application needs your review before it can be
                    submitted to the employer.
                  </p>
                </div>
              )}
            </Card.Body>
          </Card>
        ))}
      </div>

      {filteredApplications.length === 0 && (
        <Card>
          <Card.Body className="text-center py-12">
            <FileText className="mx-auto text-gray-400 mb-4" size={48} />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No applications found
            </h3>
            <p className="text-gray-600">
              Try adjusting your search criteria or filters.
            </p>
          </Card.Body>
        </Card>
      )}
    </div>
  );
};

export default Applications;
