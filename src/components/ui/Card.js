import React from "react";

const Card = ({
  children,
  className = "",
  hover = false,
  padding = true,
  ...props
}) => {
  const classes = [
    "card",
    hover ? "hover:shadow-md transition-shadow" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={classes} {...props}>
      {padding ? <div className="card-body">{children}</div> : children}
    </div>
  );
};

const CardHeader = ({ children, className = "", ...props }) => {
  return (
    <div className={`card-header ${className}`} {...props}>
      {children}
    </div>
  );
};

const CardBody = ({ children, className = "", ...props }) => {
  return (
    <div className={`card-body ${className}`} {...props}>
      {children}
    </div>
  );
};

const CardFooter = ({ children, className = "", ...props }) => {
  return (
    <div className={`card-footer ${className}`} {...props}>
      {children}
    </div>
  );
};

// Attach sub-components to main Card component
Card.Header = CardHeader;
Card.Body = CardBody;
Card.Footer = CardFooter;

export default Card;
