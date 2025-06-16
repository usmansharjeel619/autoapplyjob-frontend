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
      "form-input form-select",
      error ? "border-error" : "",
      disabled ? "opacity-50 cursor-not-allowed" : "",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    const handleChange = (e) => {
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
      <div className="form-group">
        {label && (
          <label className="form-label">
            {label}
            {required && <span className="text-error ml-1">*</span>}
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

          {!multiple && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
              <ChevronDown size={16} className="text-gray-400" />
            </div>
          )}
        </div>

        {error && <span className="form-error">{error}</span>}
      </div>
    );
  }
);

Select.displayName = "Select";

export default Select;
