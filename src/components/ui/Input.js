import React from "react";

const Input = ({
  label,
  type = "text",
  value,
  onChange,
  error,
  placeholder,
  icon,
  rightIcon,
  disabled = false,
  required = false,
  className = "",
  ...props
}) => {
  const handleChange = (e) => {
    if (onChange) {
      onChange(e);
    }
  };

  return (
    <div className={`space-y-1 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <div className="text-gray-400">{icon}</div>
          </div>
        )}

        <input
          type={type}
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          disabled={disabled}
          className={`
            block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm
            placeholder-gray-400 shadow-sm transition-colors
            focus:border-black focus:outline-none focus:ring-1 focus:ring-black
            disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500
            ${icon ? "pl-10" : ""}
            ${rightIcon ? "pr-10" : ""}
            ${
              error
                ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                : ""
            }
          `}
          {...props}
        />

        {rightIcon && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            {rightIcon}
          </div>
        )}
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default Input;
