import React from "react";

const ProgressBar = ({
  value = 0,
  max = 100,
  size = "md",
  variant = "primary",
  showValue = false,
  label = "",
  className = "",
  ...props
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  const sizeClasses = {
    sm: "h-2",
    md: "h-3",
    lg: "h-4",
  };

  const variantClasses = {
    primary: "bg-primary-500",
    success: "bg-green-500",
    warning: "bg-yellow-500",
    error: "bg-red-500",
    info: "bg-blue-500",
  };

  const containerClasses = ["progress-bar", sizeClasses[size], className]
    .filter(Boolean)
    .join(" ");

  const fillClasses = ["progress-fill", variantClasses[variant]]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="w-full">
      {(label || showValue) && (
        <div className="flex justify-between items-center mb-2">
          {label && (
            <span className="text-sm font-medium text-gray-700">{label}</span>
          )}
          {showValue && (
            <span className="text-sm text-gray-500">
              {Math.round(percentage)}%
            </span>
          )}
        </div>
      )}

      <div className={containerClasses} {...props}>
        <div
          className={fillClasses}
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={max}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
