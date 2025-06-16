import React from "react";
import { TrendingUp, TrendingDown } from "lucide-react";

const StatsCard = ({
  title,
  value,
  change,
  changeType = "positive",
  icon: Icon,
  color = "primary",
}) => {
  const colorClasses = {
    primary: "from-primary-500 to-primary-600",
    success: "from-green-500 to-green-600",
    warning: "from-yellow-500 to-yellow-600",
    error: "from-red-500 to-red-600",
    info: "from-blue-500 to-blue-600",
  };

  const isPositive = changeType === "positive";

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 relative overflow-hidden">
      {/* Background Decoration */}
      <div
        className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${colorClasses[color]} opacity-10 rounded-full transform translate-x-8 -translate-y-8`}
      />

      <div className="relative">
        <div className="flex items-center justify-between mb-4">
          <div
            className={`p-3 rounded-lg bg-gradient-to-br ${colorClasses[color]}`}
          >
            <Icon className="text-white" size={24} />
          </div>

          {change && (
            <div
              className={`flex items-center gap-1 text-sm font-medium ${
                isPositive ? "text-green-600" : "text-red-600"
              }`}
            >
              {isPositive ? (
                <TrendingUp size={16} />
              ) : (
                <TrendingDown size={16} />
              )}
              <span>{Math.abs(change)}%</span>
            </div>
          )}
        </div>

        <div className="space-y-1">
          <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
          <p className="text-gray-600 text-sm">{title}</p>
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
