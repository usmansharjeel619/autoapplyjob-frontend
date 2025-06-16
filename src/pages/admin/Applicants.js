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
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import Select from "../../components/ui/Select";

const Applicants = () => {
  const { showSuccess, showError } = useApp();
  const [applicants, setApplicants] = useState([]);
  const [filteredApplicants, setFilteredApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    status: "",
    experienceLevel: "",
    industry: "",
  });

  useEffect(() => {
    fetchApplicants();
  }, []);

  useEffect(() => {
    filterApplicants();
  }, [applicants, searchQuery, filters]);

  const fetchApplicants = async () => {
    setLoading(true);
    try {
      // Mock data
      const mockApplicants = [
        {
          id: 1,
          name: "John Smith",
          email: "john.smith@email.com",
          phone: "+1 (555) 123-4567",
          currentJobTitle: "Senior Frontend Developer",
          experienceLevel: "5-10",
          skills: ["React", "TypeScript", "Node.js"],
          applicationCount: 23,
          interviewCount: 8,
          status: "active",
          joinedDate: "2024-01-15",
          lastActive: "2 hours ago",
        },
        {
          id: 2,
          name: "Sarah Johnson",
          email: "sarah.j@email.com",
          phone: "+1 (555) 987-6543",
          currentJobTitle: "Product Manager",
          experienceLevel: "3-5",
          skills: ["Product Strategy", "Agile", "Analytics"],
          applicationCount: 15,
          interviewCount: 6,
          status: "active",
          joinedDate: "2024-02-01",
          lastActive: "1 day ago",
        },
      ];
      setApplicants(mockApplicants);
    } catch (error) {
      showError("Failed to load applicants");
    } finally {
      setLoading(false);
    }
  };

  const filterApplicants = () => {
    let filtered = [...applicants];

    if (searchQuery.trim()) {
      filtered = filtered.filter(
        (applicant) =>
          applicant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          applicant.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          applicant.currentJobTitle
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
      );
    }

    if (filters.status) {
      filtered = filtered.filter(
        (applicant) => applicant.status === filters.status
      );
    }

    if (filters.experienceLevel) {
      filtered = filtered.filter(
        (applicant) => applicant.experienceLevel === filters.experienceLevel
      );
    }

    setFilteredApplicants(filtered);
  };

  const handleViewProfile = (applicant) => {
    showSuccess(`Viewing profile for ${applicant.name}`);
  };

  const handleSendEmail = (applicant) => {
    showSuccess(`Email sent to ${applicant.name}`);
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Applicants</h1>
          <p className="text-gray-600 mt-1">
            {filteredApplicants.length} total applicants
          </p>
        </div>
        <Button icon={<Download size={16} />} variant="outline">
          Export Data
        </Button>
      </div>

      <Card>
        <Card.Body>
          <div className="flex gap-4 mb-4">
            <Input
              placeholder="Search applicants..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              icon={<Search size={16} />}
              className="flex-1"
            />
            <Select
              options={[
                { value: "", label: "All Status" },
                { value: "active", label: "Active" },
                { value: "inactive", label: "Inactive" },
              ]}
              value={filters.status}
              onChange={(value) =>
                setFilters((prev) => ({ ...prev, status: value }))
              }
            />
          </div>
        </Card.Body>
      </Card>

      <Card>
        <Card.Body>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-900">
                    Applicant
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">
                    Contact
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">
                    Experience
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">
                    Applications
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">
                    Status
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredApplicants.map((applicant) => (
                  <tr
                    key={applicant.id}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="py-4 px-4">
                      <div>
                        <h4 className="font-medium text-gray-900">
                          {applicant.name}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {applicant.currentJobTitle}
                        </p>
                        <p className="text-xs text-gray-500">
                          Joined {applicant.joinedDate}
                        </p>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="text-sm">
                        <p className="text-gray-900">{applicant.email}</p>
                        <p className="text-gray-600">{applicant.phone}</p>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {applicant.experienceLevel} years
                        </p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {applicant.skills.slice(0, 2).map((skill, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded"
                            >
                              {skill}
                            </span>
                          ))}
                          {applicant.skills.length > 2 && (
                            <span className="text-xs text-gray-500">
                              +{applicant.skills.length - 2}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="text-sm">
                        <p className="font-medium text-gray-900">
                          {applicant.applicationCount} applied
                        </p>
                        <p className="text-gray-600">
                          {applicant.interviewCount} interviews
                        </p>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          applicant.status === "active"
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {applicant.status}
                      </span>
                      <p className="text-xs text-gray-500 mt-1">
                        Last active: {applicant.lastActive}
                      </p>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          icon={<Eye size={14} />}
                          onClick={() => handleViewProfile(applicant)}
                        />
                        <Button
                          size="sm"
                          variant="ghost"
                          icon={<Mail size={14} />}
                          onClick={() => handleSendEmail(applicant)}
                        />
                        <Button
                          size="sm"
                          variant="ghost"
                          icon={<MoreVertical size={14} />}
                        />
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
};

export default Applicants;
