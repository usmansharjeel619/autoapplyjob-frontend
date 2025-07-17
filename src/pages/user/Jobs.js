import React, { useState, useEffect, useCallback } from "react";
import {
  Search,
  Filter,
  MapPin,
  Briefcase,
  Clock,
  DollarSign,
  SlidersHorizontal,
  Grid,
  List,
  RefreshCw,
} from "lucide-react";
import { useApp } from "../../context/AppContext";
import { useAuth } from "../../context/AuthContext";
import { JOB_TYPES, WORK_TYPES, INDUSTRIES } from "../../utils/constants";
import jobService from "../../services/job.service";
import userService from "../../services/user.service";
import JobCard from "../../components/dashboard/JobCard";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Select from "../../components/ui/Select";
import Card from "../../components/ui/Card";

const Jobs = () => {
  const { user } = useAuth();
  const { showSuccess, showError } = useApp();
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState("grid");
  const [sortBy, setSortBy] = useState("relevance");
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 20,
    total: 0,
    totalPages: 0,
  });
  const [filters, setFilters] = useState({
    location: "",
    jobType: "",
    workType: "",
    industry: "",
    minSalary: "",
    maxSalary: "",
    datePosted: "",
    minMatchScore: 70,
  });
  const [savedJobs, setSavedJobs] = useState([]);

  useEffect(() => {
    fetchJobs();
  }, [pagination.page, sortBy]);

  useEffect(() => {
    filterAndSortJobs();
  }, [jobs, searchQuery, filters, sortBy]);

  useEffect(() => {
    fetchSavedJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.page,
        pageSize: pagination.pageSize,
        sortBy,
        userId: user?.id,
      };

      const response = await jobService.searchJobs(params);

      setJobs(response.jobs || []);
      setPagination((prev) => ({
        ...prev,
        total: response.total || 0,
        totalPages: response.totalPages || 0,
      }));
    } catch (error) {
      showError("Failed to load jobs");
      console.error("Jobs fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSavedJobs = async () => {
    try {
      const response = await userService.getSavedJobs();
      setSavedJobs(response.map((job) => job.id));
    } catch (error) {
      console.error("Failed to fetch saved jobs:", error);
    }
  };

  const filterAndSortJobs = useCallback(() => {
    let filtered = [...jobs];

    // Apply search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(
        (job) =>
          job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
          job.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply filters
    filtered = jobService.filterJobs(filtered, filters);

    // Apply sorting
    filtered = jobService.sortJobs(filtered, sortBy);

    setFilteredJobs(filtered);
  }, [jobs, searchQuery, filters, sortBy]);

  const handleSearch = async (e) => {
    e.preventDefault();
    setPagination((prev) => ({ ...prev, page: 1 }));
    await fetchJobs();
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      location: "",
      jobType: "",
      workType: "",
      industry: "",
      minSalary: "",
      maxSalary: "",
      datePosted: "",
      minMatchScore: 70,
    });
    setSearchQuery("");
  };

  const handleJobAction = async (jobId, action) => {
    try {
      switch (action) {
        case "save":
          await userService.saveJob(jobId);
          setSavedJobs((prev) => [...prev, jobId]);
          showSuccess("Job saved successfully");
          break;
        case "unsave":
          await userService.unsaveJob(jobId);
          setSavedJobs((prev) => prev.filter((id) => id !== jobId));
          showSuccess("Job removed from saved");
          break;
        case "apply":
          await jobService.applyToJob(jobId);
          showSuccess("Application submitted successfully");
          // Update job status locally
          setJobs((prev) =>
            prev.map((job) =>
              job.id === jobId ? { ...job, status: "applied" } : job
            )
          );
          break;
        default:
          break;
      }
    } catch (error) {
      showError(`Failed to ${action} job`);
      console.error(`Job ${action} error:`, error);
    }
  };

  const handlePageChange = (newPage) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Job Search</h1>
          <p className="text-gray-600">
            {filteredJobs.length} jobs found
            {searchQuery && ` for "${searchQuery}"`}
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
            className="flex items-center space-x-2"
          >
            {viewMode === "grid" ? (
              <List className="w-4 h-4" />
            ) : (
              <Grid className="w-4 h-4" />
            )}
            <span>{viewMode === "grid" ? "List" : "Grid"}</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={fetchJobs}
            disabled={loading}
            className="flex items-center space-x-2"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <Card.Body>
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <Input
                  type="text"
                  placeholder="Search for jobs, companies, or keywords..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  icon={<Search className="w-5 h-5" />}
                />
              </div>

              <div className="flex items-center space-x-3">
                <Button type="submit" disabled={loading}>
                  Search
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center space-x-2"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  <span>Filters</span>
                </Button>
              </div>
            </div>

            {/* Advanced Filters */}
            {showFilters && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-gray-200">
                <Input
                  placeholder="Location"
                  value={filters.location}
                  onChange={(e) =>
                    handleFilterChange("location", e.target.value)
                  }
                  icon={<MapPin className="w-4 h-4" />}
                />

                <Select
                  value={filters.jobType}
                  onChange={(e) =>
                    handleFilterChange("jobType", e.target.value)
                  }
                  options={[{ value: "", label: "Any Job Type" }, ...JOB_TYPES]}
                />

                <Select
                  value={filters.workType}
                  onChange={(e) =>
                    handleFilterChange("workType", e.target.value)
                  }
                  options={[
                    { value: "", label: "Any Work Type" },
                    ...WORK_TYPES,
                  ]}
                />

                <Select
                  value={filters.industry}
                  onChange={(e) =>
                    handleFilterChange("industry", e.target.value)
                  }
                  options={[
                    { value: "", label: "Any Industry" },
                    ...INDUSTRIES,
                  ]}
                />

                <Input
                  type="number"
                  placeholder="Min Salary"
                  value={filters.minSalary}
                  onChange={(e) =>
                    handleFilterChange("minSalary", e.target.value)
                  }
                  icon={<DollarSign className="w-4 h-4" />}
                />

                <Input
                  type="number"
                  placeholder="Max Salary"
                  value={filters.maxSalary}
                  onChange={(e) =>
                    handleFilterChange("maxSalary", e.target.value)
                  }
                  icon={<DollarSign className="w-4 h-4" />}
                />

                <Select
                  value={filters.datePosted}
                  onChange={(e) =>
                    handleFilterChange("datePosted", e.target.value)
                  }
                  options={[
                    { value: "", label: "Any Time" },
                    { value: "1", label: "Last 24 hours" },
                    { value: "7", label: "Last 7 days" },
                    { value: "14", label: "Last 14 days" },
                    { value: "30", label: "Last 30 days" },
                  ]}
                />

                <div className="flex items-center space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={clearFilters}
                  >
                    Clear All
                  </Button>
                </div>
              </div>
            )}
          </form>
        </Card.Body>
      </Card>

      {/* Sort Options */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-600">Sort by:</span>
          <Select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            options={[
              { value: "relevance", label: "Relevance" },
              { value: "date", label: "Date Posted" },
              { value: "salary", label: "Salary" },
              { value: "company", label: "Company" },
            ]}
            className="w-auto"
          />
        </div>

        <div className="text-sm text-gray-600">
          Showing {(pagination.page - 1) * pagination.pageSize + 1}-
          {Math.min(pagination.page * pagination.pageSize, pagination.total)} of{" "}
          {pagination.total} jobs
        </div>
      </div>

      {/* Jobs Grid/List */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="bg-gray-200 rounded-lg h-64"></div>
            </div>
          ))}
        </div>
      ) : filteredJobs.length > 0 ? (
        <div
          className={
            viewMode === "grid"
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              : "space-y-4"
          }
        >
          {filteredJobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              saved={savedJobs.includes(job.id)}
              onSave={() => handleJobAction(job.id, "save")}
              onUnsave={() => handleJobAction(job.id, "unsave")}
              onApply={() => handleJobAction(job.id, "apply")}
              viewMode={viewMode}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Briefcase className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No jobs found
          </h3>
          <p className="text-gray-600 mb-4">
            Try adjusting your search criteria or filters
          </p>
          <Button onClick={clearFilters}>Clear Filters</Button>
        </div>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-center space-x-2">
          <Button
            variant="outline"
            disabled={pagination.page === 1}
            onClick={() => handlePageChange(pagination.page - 1)}
          >
            Previous
          </Button>

          {[...Array(Math.min(5, pagination.totalPages))].map((_, index) => {
            const pageNumber = index + 1;
            return (
              <Button
                key={pageNumber}
                variant={pagination.page === pageNumber ? "primary" : "outline"}
                onClick={() => handlePageChange(pageNumber)}
              >
                {pageNumber}
              </Button>
            );
          })}

          <Button
            variant="outline"
            disabled={pagination.page === pagination.totalPages}
            onClick={() => handlePageChange(pagination.page + 1)}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
};

export default Jobs;
