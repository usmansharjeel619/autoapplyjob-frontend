import React from "react";
import {
  MapPin,
  Calendar,
  DollarSign,
  Building,
  Clock,
  ExternalLink,
  Bookmark,
  Check, // Use Check instead of BookmarkCheck
} from "lucide-react";
import { formatDate, formatCurrency } from "../../utils/helpers";
import Button from "../ui/Button";
import Card from "../ui/Card";

const JobCard = ({
  job,
  onSave,
  onUnsave,
  onViewDetails,
  isSaved = false,
  showSaveButton = true,
  showApplyButton = false,
  onApply,
}) => {
  const handleSaveToggle = () => {
    if (isSaved) {
      onUnsave?.(job.id);
    } else {
      onSave?.(job.id);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: {
        color: "bg-yellow-100 text-yellow-800",
        label: "Pending Review",
      },
      approved: { color: "bg-green-100 text-green-800", label: "Approved" },
      applied: { color: "bg-blue-100 text-blue-800", label: "Applied" },
      rejected: { color: "bg-red-100 text-red-800", label: "Not Selected" },
    };

    const config = statusConfig[status] || statusConfig.pending;

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}
      >
        {config.label}
      </span>
    );
  };

  // Custom BookmarkCheck component using Bookmark + Check
  const BookmarkCheckIcon = ({ size = 16 }) => (
    <div className="relative">
      <Bookmark size={size} className="fill-current" />
      <Check size={size * 0.6} className="absolute top-0.5 left-0.5" />
    </div>
  );

  return (
    <Card className="job-card hover:shadow-md transition-all duration-200">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                {job.companyLogo ? (
                  <img
                    src={job.companyLogo}
                    alt={job.company}
                    className="w-10 h-10 rounded-lg object-cover"
                  />
                ) : (
                  <Building className="text-gray-400" size={20} />
                )}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 text-lg leading-tight">
                  {job.title}
                </h3>
                <p className="text-gray-600">{job.company}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {job.status && getStatusBadge(job.status)}

            {showSaveButton && (
              <Button
                variant="ghost"
                size="sm"
                icon={
                  isSaved ? (
                    <BookmarkCheckIcon size={16} />
                  ) : (
                    <Bookmark size={16} />
                  )
                }
                onClick={handleSaveToggle}
                className={isSaved ? "text-primary-600" : "text-gray-400"}
              />
            )}
          </div>
        </div>

        <div className="space-y-3 mb-4">
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <MapPin size={14} />
              <span>{job.location}</span>
            </div>

            {job.workType && (
              <div className="flex items-center gap-1">
                <Clock size={14} />
                <span>{job.workType}</span>
              </div>
            )}

            {job.salary && (
              <div className="flex items-center gap-1">
                <DollarSign size={14} />
                <span>{formatCurrency(job.salary)}</span>
              </div>
            )}
          </div>

          <p className="text-gray-700 text-sm line-clamp-3">
            {job.description}
          </p>

          {job.skills && job.skills.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {job.skills.slice(0, 4).map((skill, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-primary-50 text-primary-700 rounded-md text-xs font-medium"
                >
                  {skill}
                </span>
              ))}
              {job.skills.length > 4 && (
                <span className="text-xs text-gray-500">
                  +{job.skills.length - 4} more
                </span>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Calendar size={12} />
            <span>Posted {formatDate(job.postedDate, "relative")}</span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              icon={<ExternalLink size={14} />}
              onClick={() => onViewDetails?.(job)}
            >
              View Details
            </Button>

            {showApplyButton && (
              <Button
                size="sm"
                onClick={() => onApply?.(job)}
                disabled={job.status === "applied"}
              >
                {job.status === "applied" ? "Applied" : "Apply Now"}
              </Button>
            )}
          </div>
        </div>

        {job.matchScore && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Match Score</span>
              <div className="flex items-center gap-2">
                <div className="w-20 h-2 bg-gray-200 rounded-full">
                  <div
                    className="h-2 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full transition-all duration-300"
                    style={{ width: `${job.matchScore}%` }}
                  />
                </div>
                <span className="font-medium text-primary-600">
                  {job.matchScore}%
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default JobCard;
