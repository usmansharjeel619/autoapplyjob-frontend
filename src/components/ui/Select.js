import React, { forwardRef } from "react";
import { ChevronDown } from "lucide-react";

const Select = forwardRef(
  (
    {
      label,
      options = [],
      value,
      onChange,
      onBlur,
      placeholder = "Select an option",
      error,
      disabled = false,
      required = false,
      multiple = false,
      className = "",
      ...props
    },
    ref
  ) => {
    const selectClasses = [
      "block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm transition-colors focus:border-black focus:outline-none focus:ring-1 focus:ring-black disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500",
      error ? "border-red-300 focus:border-red-500 focus:ring-red-500" : "",
      disabled ? "opacity-50 cursor-not-allowed" : "",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    const handleChange = (e) => {
      if (!e || !e.target) return;

      if (multiple) {
        const selectedOptions = Array.from(
          e.target.selectedOptions,
          (option) => option.value
        );
        onChange?.(selectedOptions);
      } else {
        onChange?.(e.target.value);
      }
    };

    return (
      <div className="space-y-1">
        {label && (
          <label className="block text-sm font-medium text-gray-700">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        <div className="relative">
          <select
            ref={ref}
            value={value}
            onChange={handleChange}
            onBlur={onBlur}
            disabled={disabled}
            required={required}
            multiple={multiple}
            className={selectClasses}
            {...props}
          >
            {!multiple && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}

            {options.map((option) => {
              if (typeof option === "string") {
                return (
                  <option key={option} value={option}>
                    {option}
                  </option>
                );
              }

              return (
                <option
                  key={option.value}
                  value={option.value}
                  disabled={option.disabled}
                >
                  {option.label}
                </option>
              );
            })}
          </select>

          {/* {!multiple && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
              <ChevronDown size={16} className="text-gray-400" />
            </div>
          )} */}
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}
      </div>
    );
  }
);

Select.displayName = "Select";

export default Select;
