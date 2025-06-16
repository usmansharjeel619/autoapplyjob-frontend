import React from "react";
import { Loader2 } from "lucide-react";

const Button = ({
  children,
  variant = "primary",
  size = "md",
  disabled = false,
  loading = false,
  icon = null,
  iconPosition = "left",
  onClick,
  type = "button",
  className = "",
  ...props
}) => {
  const baseClasses = "btn";

  const variantClasses = {
    primary: "btn-primary",
    secondary: "btn-secondary",
    outline: "btn-outline",
    ghost: "btn-ghost",
  };

  const sizeClasses = {
    sm: "btn-sm",
    md: "",
    lg: "btn-lg",
  };

  const classes = [
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const handleClick = (e) => {
    if (disabled || loading) return;
    onClick?.(e);
  };

  const renderIcon = () => {
    if (loading) {
      return <Loader2 className="animate-spin" size={16} />;
    }
    return icon;
  };

  return (
    <button
      type={type}
      className={classes}
      disabled={disabled || loading}
      onClick={handleClick}
      {...props}
    >
      {iconPosition === "left" && renderIcon()}
      {children}
      {iconPosition === "right" && renderIcon()}
    </button>
  );
};

export default Button;
