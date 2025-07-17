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
  Users,
} from "lucide-react";
import { useApp } from "../../context/AppContext";
import adminService from "../../services/admin.service";
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
  const [selectedApplications, setSelectedApplications] = useState(new Set());
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 20,
    total: 0,
    totalPages: 0,
  });

  useEffect(() => {
    fetchApplications();
  }, [pagination.page, statusFilter]);

  useEffect(() => {
    filterApplications();
  }, [applications, searchQuery]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.page,
        pageSize: pagination.pageSize,
        status: statusFilter,
      };

      const response = await adminService.getAllApplications(params);

      setApplications(response.applications || []);
      setPagination((prev) => ({
        ...prev,
        total: response.total || 0,
        totalPages: response.totalPages || 0,
      }));
    } catch (error) {
      showError("Failed to load applications");
      console.error("Applications fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterApplications = () => {
    if (!searchQuery.trim()) {
      setFilteredApplications(applications);
      return;
    }

    const filtered = applications.filter(
      (app) =>
        app.applicantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.jobTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.company.toLowerCase().includes(searchQuery.toLowerCase())
    );

    setFilteredApplications(filtered);
  };

  const handleStatusUpdate = async (applicationId, newStatus) => {
    try {
      setProcessingIds((prev) => new Set([...prev, applicationId]));

      await adminService.updateApplicationStatus(applicationId, newStatus);

      setApplications((prev) =>
        prev.map((app) =>
          app.id === applicationId ? { ...app, status: newStatus } : app
        )
      );

      showSuccess(`Application ${newStatus.replace("_", " ")} successfully`);
    } catch (error) {
      showError(`Failed to ${newStatus.replace("_", " ")} application`);
      console.error("Status update error:", error);
    } finally {
      setProcessingIds((prev) => {
        const next = new Set(prev);
        next.delete(applicationId);
        return next;
      });
    }
  };

  const handleBulkAction = async (action) => {
    if (selectedApplications.size === 0) {
      showError("Please select applications first");
      return;
    }

    try {
      const applicationIds = Array.from(selectedApplications);

      switch (action) {
        case "approve":
          for (const id of applicationIds) {
            await adminService.updateApplicationStatus(id, "approved");
          }
          showSuccess(`${applicationIds.length} applications approved`);
          break;
        case "reject":
          for (const id of applicationIds) {
            await adminService.updateApplicationStatus(id, "rejected");
          }
          showSuccess(`${applicationIds.length} applications rejected`);
          break;
        case "export":
          // Implement export functionality
          showSuccess("Export started");
          break;
      }

      setSelectedApplications(new Set());
      fetchApplications();
    } catch (error) {
      showError(`Failed to ${action} applications`);
    }
  };

  const toggleSelection = (applicationId) => {
    setSelectedApplications((prev) => {
      const next = new Set(prev);
      if (next.has(applicationId)) {
        next.delete(applicationId);
      } else {
        next.add(applicationId);
      }
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedApplications.size === filteredApplications.length) {
      setSelectedApplications(new Set());
    } else {
      setSelectedApplications(
        new Set(filteredApplications.map((app) => app.id))
      );
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending_review":
        return "bg-yellow-100 text-yellow-800";
      case "approved":
      case "applied":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "interview_scheduled":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Applications Management
          </h1>
          <p className="text-gray-600">
            Review and manage job applications from users
          </p>
        </div>

        <div className="flex items-center space-x-3">
          {selectedApplications.size > 0 && (
            <>
              <Button
                variant="outline"
                onClick={() => handleBulkAction("approve")}
                className="flex items-center space-x-2"
              >
                <CheckCircle className="w-4 h-4" />
                <span>Approve ({selectedApplications.size})</span>
              </Button>
              <Button
                variant="outline"
                onClick={() => handleBulkAction("reject")}
                className="flex items-center space-x-2"
              >
                <XCircle className="w-4 h-4" />
                <span>Reject ({selectedApplications.size})</span>
              </Button>
            </>
          )}

          <Button
            variant="outline"
            onClick={() => handleBulkAction("export")}
            className="flex items-center space-x-2"
          >
            <Download className="w-4 h-4" />
            <span>Export</span>
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <Card.Body>
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <Input
                type="text"
                placeholder="Search applications..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                icon={<Search className="w-5 h-5" />}
              />
            </div>

            <div className="flex items-center space-x-3">
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                options={[
                  { value: "", label: "All Statuses" },
                  { value: "pending_review", label: "Pending Review" },
                  { value: "approved", label: "Approved" },
                  { value: "applied", label: "Applied" },
                  { value: "rejected", label: "Rejected" },
                  {
                    value: "interview_scheduled",
                    label: "Interview Scheduled",
                  },
                ]}
              />

              <Button onClick={fetchApplications} disabled={loading}>
                Refresh
              </Button>
            </div>
          </div>
        </Card.Body>
      </Card>

      {/* Applications Table */}
      <Card>
        <Card.Body className="p-0">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading applications...</p>
            </div>
          ) : filteredApplications.length > 0 ? (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left">
                        <input
                          type="checkbox"
                          checked={
                            selectedApplications.size ===
                              filteredApplications.length &&
                            filteredApplications.length > 0
                          }
                          onChange={toggleSelectAll}
                          className="rounded border-gray-300"
                        />
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Applicant
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Job Details
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Match Score
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Submitted
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredApplications.map((application) => (
                      <tr key={application.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <input
                            type="checkbox"
                            checked={selectedApplications.has(application.id)}
                            onChange={() => toggleSelection(application.id)}
                            className="rounded border-gray-300"
                          />
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <div className="font-medium text-gray-900">
                              {application.applicantName}
                            </div>
                            <div className="text-sm text-gray-500">
                              {application.applicantEmail}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <div className="font-medium text-gray-900">
                              {application.jobTitle}
                            </div>
                            <div className="text-sm text-gray-500">
                              {application.company}
                            </div>
                            <div className="text-xs text-gray-400">
                              {application.location}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                              application.status
                            )}`}
                          >
                            {application.status.replace("_", " ")}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                              <div
                                className="bg-blue-600 h-2 rounded-full"
                                style={{ width: `${application.matchScore}%` }}
                              ></div>
                            </div>
                            <span className="text-sm font-medium text-gray-900">
                              {application.matchScore}%
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {new Date(
                            application.submittedAt
                          ).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              href={`/admin/applications/${application.id}`}
                            >
                              <Eye className="w-3 h-3" />
                            </Button>

                            {application.status === "pending_review" && (
                              <>
                                <Button
                                  size="sm"
                                  onClick={() =>
                                    handleStatusUpdate(
                                      application.id,
                                      "approved"
                                    )
                                  }
                                  disabled={processingIds.has(application.id)}
                                  className="bg-green-600 hover:bg-green-700 text-white"
                                >
                                  <CheckCircle className="w-3 h-3" />
                                </Button>
                                <Button
                                  size="sm"
                                  onClick={() =>
                                    handleStatusUpdate(
                                      application.id,
                                      "rejected"
                                    )
                                  }
                                  disabled={processingIds.has(application.id)}
                                  className="bg-red-600 hover:bg-red-700 text-white"
                                >
                                  <XCircle className="w-3 h-3" />
                                </Button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
                  <div className="text-sm text-gray-600">
                    Showing {(pagination.page - 1) * pagination.pageSize + 1}-
                    {Math.min(
                      pagination.page * pagination.pageSize,
                      pagination.total
                    )}{" "}
                    of {pagination.total} applications
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={pagination.page === 1}
                      onClick={() =>
                        setPagination((prev) => ({
                          ...prev,
                          page: prev.page - 1,
                        }))
                      }
                    >
                      Previous
                    </Button>

                    <span className="text-sm text-gray-600">
                      Page {pagination.page} of {pagination.totalPages}
                    </span>

                    <Button
                      variant="outline"
                      size="sm"
                      disabled={pagination.page === pagination.totalPages}
                      onClick={() =>
                        setPagination((prev) => ({
                          ...prev,
                          page: prev.page + 1,
                        }))
                      }
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No applications found
              </h3>
              <p className="text-gray-600">
                {searchQuery || statusFilter
                  ? "Try adjusting your search or filter criteria"
                  : "Applications will appear here when users start applying for jobs"}
              </p>
            </div>
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

export default Applications;
