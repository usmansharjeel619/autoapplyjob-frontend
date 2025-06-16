import React, { useState, useEffect } from "react";
import {
  Search,
  Filter,
  MapPin,
  Briefcase,
  Clock,
  DollarSign,
  Bookmark,
  BookmarkCheck,
  SlidersHorizontal,
  Grid,
  List,
  RefreshCw,
} from "lucide-react";
import { useApp } from "../../context/AppContext";
import { JOB_TYPES, WORK_TYPES, INDUSTRIES } from "../../utils/constants";
import JobCard from "../../components/dashboard/JobCard";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Select from "../../components/ui/Select";
import Card from "../../components/ui/Card";

const Jobs = () => {
  const { showSuccess, showError } = useApp();
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState("grid"); // 'grid' or 'list'
  const [sortBy, setSortBy] = useState("relevance");
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

  // Mock data - replace with actual API calls
  useEffect(() => {
    fetchJobs();
  }, []);

  useEffect(() => {
    filterJobs();
  }, [jobs, searchQuery, filters, sortBy]);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const mockJobs = [
        {
          id: 1,
          title: "Senior Frontend Developer",
          company: "TechCorp Inc.",
          location: "San Francisco, CA",
          workType: "Remote",
          jobType: "Full-time",
          salary: 120000,
          description:
            "We are looking for a senior frontend developer with expertise in React and TypeScript. You will be responsible for building user-facing applications and working closely with our design team.",
          skills: ["React", "TypeScript", "Node.js", "AWS"],
          postedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          matchScore: 92,
          status: "pending",
          industry: "technology",
        },
        {
          id: 2,
          title: "Full Stack Engineer",
          company: "StartupXYZ",
          location: "New York, NY",
          workType: "Hybrid",
          jobType: "Full-time",
          salary: 95000,
          description:
            "Join our fast-growing startup as a full stack engineer working on cutting-edge products. Experience with modern web technologies required.",
          skills: ["JavaScript", "Python", "React", "Django"],
          postedDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
          matchScore: 88,
          status: "approved",
          industry: "technology",
        },
        {
          id: 3,
          title: "React Developer",
          company: "Digital Solutions",
          location: "Austin, TX",
          workType: "On-site",
          jobType: "Full-time",
          salary: 85000,
          description:
            "Looking for a passionate React developer to join our development team. Great opportunity for growth and learning.",
          skills: ["React", "JavaScript", "CSS", "Redux"],
          postedDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
          matchScore: 85,
          status: "applied",
          industry: "technology",
        },
        {
          id: 4,
          title: "Product Manager",
          company: "Innovation Labs",
          location: "Seattle, WA",
          workType: "Remote",
          jobType: "Full-time",
          salary: 110000,
          description:
            "Lead product development for our flagship products. Experience in agile methodology and user research required.",
          skills: ["Product Strategy", "Agile", "User Research", "Analytics"],
          postedDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
          matchScore: 78,
          status: "pending",
          industry: "technology",
        },
      ];

      setJobs(mockJobs);
    } catch (error) {
      showError("Failed to load jobs");
    } finally {
      setLoading(false);
    }
  };

  const filterJobs = () => {
    let filtered = [...jobs];

    // Search query filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(
        (job) =>
          job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
          job.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          job.skills.some((skill) =>
            skill.toLowerCase().includes(searchQuery.toLowerCase())
          )
      );
    }

    // Location filter
    if (filters.location) {
      filtered = filtered.filter((job) =>
        job.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    // Job type filter
    if (filters.jobType) {
      filtered = filtered.filter((job) => job.jobType === filters.jobType);
    }

    // Work type filter
    if (filters.workType) {
      filtered = filtered.filter((job) => job.workType === filters.workType);
    }

    // Industry filter
    if (filters.industry) {
      filtered = filtered.filter((job) => job.industry === filters.industry);
    }

    // Salary filter
    if (filters.minSalary) {
      filtered = filtered.filter(
        (job) => job.salary >= parseInt(filters.minSalary)
      );
    }

    if (filters.maxSalary) {
      filtered = filtered.filter(
        (job) => job.salary <= parseInt(filters.maxSalary)
      );
    }

    // Match score filter
    if (filters.minMatchScore) {
      filtered = filtered.filter(
        (job) => job.matchScore >= filters.minMatchScore
      );
    }

    // Date posted filter
    if (filters.datePosted) {
      const days = parseInt(filters.datePosted);
      const cutoffDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
      filtered = filtered.filter((job) => job.postedDate >= cutoffDate);
    }

    // Sort jobs
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "relevance":
          return b.matchScore - a.matchScore;
        case "date":
          return b.postedDate - a.postedDate;
        case "salary":
          return b.salary - a.salary;
        case "company":
          return a.company.localeCompare(b.company);
        default:
          return 0;
      }
    });

    setFilteredJobs(filtered);
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

  const handleSaveJob = (jobId) => {
    setSavedJobs((prev) => [...prev, jobId]);
    showSuccess("Job saved successfully!");
  };

  const handleUnsaveJob = (jobId) => {
    setSavedJobs((prev) => prev.filter((id) => id !== jobId));
    showSuccess("Job removed from saved list");
  };

  const handleViewJobDetails = (job) => {
    // TODO: Navigate to job details page or open modal
    console.log("View job details:", job);
  };

  const sortOptions = [
    { value: "relevance", label: "Best Match" },
    { value: "date", label: "Most Recent" },
    { value: "salary", label: "Highest Salary" },
    { value: "company", label: "Company A-Z" },
  ];

  const datePostedOptions = [
    { value: "", label: "Any time" },
    { value: "1", label: "Last 24 hours" },
    { value: "7", label: "Last week" },
    { value: "30", label: "Last month" },
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
          <h1 className="text-3xl font-bold text-gray-900">Job Search</h1>
          <p className="text-gray-600 mt-1">
            {filteredJobs.length} jobs found{" "}
            {searchQuery && `for "${searchQuery}"`}
          </p>
        </div>

        <Button
          onClick={fetchJobs}
          icon={<RefreshCw size={16} />}
          variant="outline"
        >
          Refresh
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <Card.Body>
          <div className="space-y-4">
            {/* Search Bar */}
            <div className="flex gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Search jobs, companies, skills..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  icon={<Search size={16} />}
                />
              </div>
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                icon={<SlidersHorizontal size={16} />}
              >
                Filters
              </Button>
            </div>

            {/* Filters */}
            {showFilters && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-gray-200">
                <Input
                  label="Location"
                  placeholder="City, State"
                  value={filters.location}
                  onChange={(e) =>
                    handleFilterChange("location", e.target.value)
                  }
                  icon={<MapPin size={16} />}
                />

                <Select
                  label="Job Type"
                  options={[{ value: "", label: "All Types" }, ...JOB_TYPES]}
                  value={filters.jobType}
                  onChange={(value) => handleFilterChange("jobType", value)}
                />

                <Select
                  label="Work Type"
                  options={[
                    { value: "", label: "All Arrangements" },
                    ...WORK_TYPES,
                  ]}
                  value={filters.workType}
                  onChange={(value) => handleFilterChange("workType", value)}
                />

                <Select
                  label="Industry"
                  options={[
                    { value: "", label: "All Industries" },
                    ...INDUSTRIES,
                  ]}
                  value={filters.industry}
                  onChange={(value) => handleFilterChange("industry", value)}
                />

                <Input
                  label="Min Salary"
                  type="number"
                  placeholder="e.g., 80000"
                  value={filters.minSalary}
                  onChange={(e) =>
                    handleFilterChange("minSalary", e.target.value)
                  }
                  icon={<DollarSign size={16} />}
                />

                <Input
                  label="Max Salary"
                  type="number"
                  placeholder="e.g., 120000"
                  value={filters.maxSalary}
                  onChange={(e) =>
                    handleFilterChange("maxSalary", e.target.value)
                  }
                  icon={<DollarSign size={16} />}
                />

                <Select
                  label="Date Posted"
                  options={datePostedOptions}
                  value={filters.datePosted}
                  onChange={(value) => handleFilterChange("datePosted", value)}
                />

                <div>
                  <label className="form-label">
                    Min Match Score: {filters.minMatchScore}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={filters.minMatchScore}
                    onChange={(e) =>
                      handleFilterChange(
                        "minMatchScore",
                        parseInt(e.target.value)
                      )
                    }
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                <div className="col-span-full flex justify-end gap-2">
                  <Button variant="outline" onClick={clearFilters}>
                    Clear All
                  </Button>
                </div>
              </div>
            )}
          </div>
        </Card.Body>
      </Card>

      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Select
            options={sortOptions}
            value={sortBy}
            onChange={setSortBy}
            className="w-40"
          />
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === "grid" ? "primary" : "ghost"}
            size="sm"
            icon={<Grid size={16} />}
            onClick={() => setViewMode("grid")}
          />
          <Button
            variant={viewMode === "list" ? "primary" : "ghost"}
            size="sm"
            icon={<List size={16} />}
            onClick={() => setViewMode("list")}
          />
        </div>
      </div>

      {/* Job Results */}
      {filteredJobs.length === 0 ? (
        <Card>
          <Card.Body className="text-center py-12">
            <Briefcase className="mx-auto text-gray-400 mb-4" size={48} />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No jobs found
            </h3>
            <p className="text-gray-600 mb-6">
              Try adjusting your search criteria or filters to find more
              opportunities.
            </p>
            <Button onClick={clearFilters}>Clear Filters</Button>
          </Card.Body>
        </Card>
      ) : (
        <div
          className={`grid gap-6 ${
            viewMode === "grid" ? "grid-cols-1 lg:grid-cols-2" : "grid-cols-1"
          }`}
        >
          {filteredJobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              onSave={handleSaveJob}
              onUnsave={handleUnsaveJob}
              onViewDetails={handleViewJobDetails}
              isSaved={savedJobs.includes(job.id)}
              showSaveButton={true}
              showApplyButton={false}
            />
          ))}
        </div>
      )}

      {/* Load More */}
      {filteredJobs.length > 0 && (
        <div className="text-center pt-6">
          <Button variant="outline" size="lg">
            Load More Jobs
          </Button>
        </div>
      )}
    </div>
  );
};

export default Jobs;
