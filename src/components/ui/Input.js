import React, { forwardRef } from "react";
import { Eye, EyeOff } from "lucide-react";

const Input = forwardRef(
  (
    {
      label,
      type = "text",
      placeholder,
      value,
      onChange,
      onBlur,
      error,
      disabled = false,
      required = false,
      icon = null,
      iconPosition = "left",
      className = "",
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = React.useState(false);
    const [isFocused, setIsFocused] = React.useState(false);

    const inputType = type === "password" && showPassword ? "text" : type;

    const inputClasses = [
      "form-input",
      error ? "border-error" : "",
      disabled ? "opacity-50 cursor-not-allowed" : "",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    const togglePasswordVisibility = () => {
      setShowPassword(!showPassword);
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
          {icon && iconPosition === "left" && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              {icon}
            </div>
          )}

          <input
            ref={ref}
            type={inputType}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            onBlur={(e) => {
              setIsFocused(false);
              onBlur?.(e);
            }}
            onFocus={() => setIsFocused(true)}
            disabled={disabled}
            required={required}
            className={`${inputClasses} ${
              icon && iconPosition === "left" ? "pl-10" : ""
            } ${
              type === "password"
                ? "pr-10"
                : icon && iconPosition === "right"
                ? "pr-10"
                : ""
            }`}
            {...props}
          />

          {icon && iconPosition === "right" && !type === "password" && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              {icon}
            </div>
          )}

          {type === "password" && (
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              onClick={togglePasswordVisibility}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          )}
        </div>

        {error && <span className="form-error">{error}</span>}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
