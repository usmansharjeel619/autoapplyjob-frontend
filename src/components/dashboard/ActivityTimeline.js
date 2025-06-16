import React from "react";
import {
  Briefcase,
  Eye,
  Phone,
  Mail,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp,
  User,
  FileText,
} from "lucide-react";
import { formatDate } from "../../utils/helpers";

const ActivityTimeline = ({ activities = [], showAll = false }) => {
  const getActivityIcon = (type) => {
    const iconMap = {
      application: Briefcase,
      viewed: Eye,
      interview: Phone,
      email: Mail,
      accepted: CheckCircle,
      rejected: XCircle,
      profile_update: User,
      resume_update: FileText,
      job_match: TrendingUp,
      follow_up: Clock,
    };

    return iconMap[type] || Briefcase;
  };

  const getActivityColor = (type) => {
    const colorMap = {
      application: "text-blue-600 bg-blue-100",
      viewed: "text-green-600 bg-green-100",
      interview: "text-purple-600 bg-purple-100",
      email: "text-yellow-600 bg-yellow-100",
      accepted: "text-green-600 bg-green-100",
      rejected: "text-red-600 bg-red-100",
      profile_update: "text-indigo-600 bg-indigo-100",
      resume_update: "text-teal-600 bg-teal-100",
      job_match: "text-orange-600 bg-orange-100",
      follow_up: "text-gray-600 bg-gray-100",
    };

    return colorMap[type] || "text-blue-600 bg-blue-100";
  };

  const displayActivities = showAll ? activities : activities.slice(0, 5);

  if (activities.length === 0) {
    return (
      <div className="text-center py-8">
        <Clock className="mx-auto text-gray-400 mb-4" size={48} />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No recent activity
        </h3>
        <p className="text-gray-600">
          Your activity will appear here as you start applying to jobs.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {displayActivities.map((activity, index) => {
        const Icon = getActivityIcon(activity.type);
        const colorClasses = getActivityColor(activity.type);

        return (
          <div key={activity.id || index} className="flex items-start gap-4">
            {/* Timeline dot */}
            <div className="relative">
              <div className={`p-2 rounded-full ${colorClasses}`}>
                <Icon size={16} />
              </div>
              {index < displayActivities.length - 1 && (
                <div className="absolute top-10 left-1/2 transform -translate-x-1/2 w-0.5 h-8 bg-gray-200" />
              )}
            </div>

            {/* Activity content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    {activity.title}
                  </p>
                  {activity.description && (
                    <p className="text-sm text-gray-600 mt-1">
                      {activity.description}
                    </p>
                  )}
                  {activity.company && (
                    <p className="text-xs text-gray-500 mt-1">
                      at {activity.company}
                    </p>
                  )}
                </div>

                <div className="text-xs text-gray-500 whitespace-nowrap ml-4">
                  {formatDate(activity.timestamp, "relative")}
                </div>
              </div>

              {/* Additional details */}
              {activity.metadata && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {activity.metadata.jobTitle && (
                    <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800">
                      {activity.metadata.jobTitle}
                    </span>
                  )}
                  {activity.metadata.status && (
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${
                        activity.metadata.status === "success"
                          ? "bg-green-100 text-green-800"
                          : activity.metadata.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {activity.metadata.status}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        );
      })}

      {!showAll && activities.length > 5 && (
        <div className="text-center pt-4">
          <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
            View all activity ({activities.length - 5} more)
          </button>
        </div>
      )}
    </div>
  );
};

export default ActivityTimeline;
