import React, { useState, useEffect } from "react";
import {
  Search,
  Filter,
  Eye,
  Mail,
  Download,
  Users,
  MoreVertical,
} from "lucide-react";
import { useApp } from "../../context/AppContext";
import adminService from "../../services/admin.service";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import Select from "../../components/ui/Select";

const Applicants = () => {
  const { showSuccess, showError } = useApp();
  const [applicants, setApplicants] = useState([]);
  const [filteredApplicants, setFilteredApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 20,
    total: 0,
    totalPages: 0,
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    userType: "",
    isActive: "",
    experienceLevel: "",
  });

  useEffect(() => {
    fetchApplicants();
  }, [pagination.page, filters, searchQuery]);

  useEffect(() => {
    filterApplicants();
  }, [applicants, searchQuery, filters]);

  const fetchApplicants = async () => {
    setLoading(true);
    try {
      const params = {
        page: pagination.page,
        pageSize: pagination.pageSize,
        search: searchQuery,
        ...filters,
      };

      const response = await adminService.getAllUsers(params);
      setApplicants(response.users || []);
      setPagination(response.pagination || pagination);
    } catch (error) {
      showError("Failed to load applicants");
      console.error("Error fetching applicants:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterApplicants = () => {
    let filtered = [...applicants];

    // Apply local search filter if no API search is being used
    if (searchQuery && !filters.search) {
      filtered = filtered.filter(
        (applicant) =>
          applicant.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          applicant.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          applicant.currentJobTitle
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase())
      );
    }

    setFilteredApplicants(filtered);
  };

  const handleSearch = (value) => {
    setSearchQuery(value);
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handlePageChange = (newPage) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
  };

  const handleViewProfile = (applicantId) => {
    // Navigate to applicant profile or open modal
    console.log("View profile:", applicantId);
  };

  const handleSendEmail = (email) => {
    window.location.href = `mailto:${email}`;
  };

  const handleExportData = () => {
    // Implement export functionality
    showSuccess("Export functionality coming soon!");
  };

  const experienceLevelOptions = [
    { value: "", label: "All Experience Levels" },
    { value: "0-1", label: "Entry Level (0-1 years)" },
    { value: "1-3", label: "Junior (1-3 years)" },
    { value: "3-5", label: "Mid-level (3-5 years)" },
    { value: "5-10", label: "Senior (5-10 years)" },
    { value: "10+", label: "Expert (10+ years)" },
  ];

  const statusOptions = [
    { value: "", label: "All Statuses" },
    { value: "true", label: "Active" },
    { value: "false", label: "Inactive" },
  ];

  const userTypeOptions = [
    { value: "", label: "All User Types" },
    { value: "jobseeker", label: "Job Seeker" },
    { value: "employer", label: "Employer" },
  ];

  if (loading && applicants.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Applicants</h1>
          <p className="text-gray-600">
            Manage and review all registered users and applicants
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={handleExportData}
            icon={<Download size={20} />}
          >
            Export Data
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <Card.Body className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Applicants</p>
                <p className="text-2xl font-bold text-gray-900">
                  {pagination.total}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </Card.Body>
        </Card>

        <Card>
          <Card.Body className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Users</p>
                <p className="text-2xl font-bold text-gray-900">
                  {applicants.filter((a) => a.isActive).length}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </Card.Body>
        </Card>

        <Card>
          <Card.Body className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Applications</p>
                <p className="text-2xl font-bold text-gray-900">
                  {applicants.reduce(
                    (sum, a) => sum + (a.applicationCount || 0),
                    0
                  )}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </Card.Body>
        </Card>

        <Card>
          <Card.Body className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">New This Month</p>
                <p className="text-2xl font-bold text-gray-900">
                  {
                    applicants.filter((a) => {
                      const created = new Date(a.createdAt);
                      const now = new Date();
                      return (
                        created.getMonth() === now.getMonth() &&
                        created.getFullYear() === now.getFullYear()
                      );
                    }).length
                  }
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </Card.Body>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <Card.Body className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Input
              placeholder="Search applicants..."
              value={searchQuery}
              onChange={handleSearch}
              icon={<Search size={20} />}
            />

            <Select
              options={statusOptions}
              value={filters.isActive}
              onChange={(value) => handleFilterChange("isActive", value)}
              placeholder="Filter by status"
            />

            <Select
              options={userTypeOptions}
              value={filters.userType}
              onChange={(value) => handleFilterChange("userType", value)}
              placeholder="Filter by user type"
            />

            <Select
              options={experienceLevelOptions}
              value={filters.experienceLevel}
              onChange={(value) => handleFilterChange("experienceLevel", value)}
              placeholder="Filter by experience"
            />
          </div>
        </Card.Body>
      </Card>

      {/* Applicants Table */}
      <Card>
        <Card.Body className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Applicant
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Experience
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Applications
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredApplicants.map((applicant) => (
                  <tr key={applicant._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                          <span className="text-white font-medium text-sm">
                            {applicant.name?.charAt(0) || "U"}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {applicant.name || "Unknown"}
                          </div>
                          <div className="text-sm text-gray-500">
                            {applicant.currentJobTitle || "No job title"}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {applicant.email}
                      </div>
                      <div className="text-sm text-gray-500">
                        {applicant.phone || "No phone"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {applicant.experienceLevel || "Not specified"}
                      </div>
                      <div className="text-sm text-gray-500">
                        {applicant.skills?.slice(0, 3).join(", ") ||
                          "No skills listed"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {applicant.applicationCount || 0} applications
                      </div>
                      <div className="text-sm text-gray-500">
                        Joined{" "}
                        {new Date(applicant.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          applicant.isActive
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {applicant.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewProfile(applicant._id)}
                          icon={<Eye size={16} />}
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleSendEmail(applicant.email)}
                          icon={<Mail size={16} />}
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          icon={<MoreVertical size={16} />}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredApplicants.length === 0 && !loading && (
            <div className="text-center py-12">
              <Users className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No applicants found
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchQuery || Object.values(filters).some((f) => f)
                  ? "Try adjusting your search or filters."
                  : "No applicants have registered yet."}
              </p>
            </div>
          )}

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="px-6 py-3 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Showing {(pagination.page - 1) * pagination.pageSize + 1} to{" "}
                  {Math.min(
                    pagination.page * pagination.pageSize,
                    pagination.total
                  )}{" "}
                  of {pagination.total} results
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page === 1}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page === pagination.totalPages}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </div>
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

export default Applicants;
