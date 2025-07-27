import { isValidEmail, isValidPhone, isValidUrl } from "./helpers";

// Validation Rules
const required = (value) => {
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === "string") return value.trim().length > 0;
  return value !== null && value !== undefined;
};

const minLength = (min) => (value) => {
  if (!value) return true; // Allow empty if not required
  return value.toString().length >= min;
};

const maxLength = (max) => (value) => {
  if (!value) return true;
  return value.toString().length <= max;
};

const email = (value) => {
  if (!value) return true;
  return isValidEmail(value);
};

const phone = (value) => {
  if (!value) return true;
  return isValidPhone(value);
};

const url = (value) => {
  if (!value) return true;
  return isValidUrl(value);
};

const pattern = (regex) => (value) => {
  if (!value) return true;
  return regex.test(value);
};

const numeric = (value) => {
  if (!value) return true;
  return !isNaN(value) && !isNaN(parseFloat(value));
};

const integer = (value) => {
  if (!value) return true;
  return Number.isInteger(Number(value));
};

const min = (minVal) => (value) => {
  if (!value) return true;
  return Number(value) >= minVal;
};

const max = (maxVal) => (value) => {
  if (!value) return true;
  return Number(value) <= maxVal;
};

const oneOf = (options) => (value) => {
  if (!value) return true;
  return options.includes(value);
};

// Validation Schema Builder
class ValidationSchema {
  constructor() {
    this.rules = {};
  }

  field(name) {
    this.currentField = name;
    this.rules[name] = [];
    return this;
  }

  required(message = "This field is required") {
    if (this.currentField) {
      this.rules[this.currentField].push({
        validator: required,
        message,
      });
    }
    return this;
  }

  minLength(min, message = `Must be at least ${min} characters`) {
    if (this.currentField) {
      this.rules[this.currentField].push({
        validator: minLength(min),
        message,
      });
    }
    return this;
  }

  maxLength(max, message = `Must be no more than ${max} characters`) {
    if (this.currentField) {
      this.rules[this.currentField].push({
        validator: maxLength(max),
        message,
      });
    }
    return this;
  }

  email(message = "Must be a valid email address") {
    if (this.currentField) {
      this.rules[this.currentField].push({
        validator: email,
        message,
      });
    }
    return this;
  }

  phone(message = "Must be a valid phone number") {
    if (this.currentField) {
      this.rules[this.currentField].push({
        validator: phone,
        message,
      });
    }
    return this;
  }

  url(message = "Must be a valid URL") {
    if (this.currentField) {
      this.rules[this.currentField].push({
        validator: url,
        message,
      });
    }
    return this;
  }

  pattern(regex, message = "Invalid format") {
    if (this.currentField) {
      this.rules[this.currentField].push({
        validator: pattern(regex),
        message,
      });
    }
    return this;
  }

  numeric(message = "Must be a number") {
    if (this.currentField) {
      this.rules[this.currentField].push({
        validator: numeric,
        message,
      });
    }
    return this;
  }

  integer(message = "Must be an integer") {
    if (this.currentField) {
      this.rules[this.currentField].push({
        validator: integer,
        message,
      });
    }
    return this;
  }

  min(minVal, message = `Must be at least ${minVal}`) {
    if (this.currentField) {
      this.rules[this.currentField].push({
        validator: min(minVal),
        message,
      });
    }
    return this;
  }

  max(maxVal, message = `Must be no more than ${maxVal}`) {
    if (this.currentField) {
      this.rules[this.currentField].push({
        validator: max(maxVal),
        message,
      });
    }
    return this;
  }

  oneOf(options, message = "Invalid selection") {
    if (this.currentField) {
      this.rules[this.currentField].push({
        validator: oneOf(options),
        message,
      });
    }
    return this;
  }

  custom(validator, message = "Invalid value") {
    if (this.currentField) {
      this.rules[this.currentField].push({
        validator: (value, data) => validator(value, data),
        message,
      });
    }
    return this;
  }

  validate(data) {
    const errors = {};

    Object.entries(this.rules).forEach(([fieldName, fieldRules]) => {
      const value = data[fieldName];

      for (const rule of fieldRules) {
        // Pass both value and data to validator for custom validators
        if (!rule.validator(value, data)) {
          errors[fieldName] = rule.message;
          break; // Stop at first error for this field
        }
      }
    });

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  }
}

// Pre-defined validation schemas
export const authValidation = new ValidationSchema()
  .field("email")
  .required()
  .email()
  .field("password")
  .required()
  .minLength(8);

export const signupValidation = new ValidationSchema()
  .field("name")
  .required()
  .minLength(2)
  .maxLength(100) // Changed to match backend (100 characters max)
  .field("email")
  .required()
  .email()
  .field("password")
  .required()
  .minLength(6) // Changed to match backend (6 characters min)
  .pattern(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
    "Password must contain at least one uppercase letter, one lowercase letter, and one number"
  )
  .field("confirmPassword")
  .required()
  .custom((value, data) => value === data.password, "Passwords do not match");

export const basicInfoValidation = new ValidationSchema()
  .field("name")
  .required()
  .minLength(2)
  .maxLength(50)
  .field("email")
  .required()
  .email()
  .field("phone")
  .required()
  .phone()
  .field("currentJobTitle")
  .required()
  .maxLength(100)
  .field("experienceLevel")
  .required()
  .field("educationLevel")
  .required();

export const jobPreferencesValidation = new ValidationSchema()
  .field("desiredJobTitle")
  .required()
  .maxLength(100)
  .field("industry")
  .required()
  .field("jobTypes")
  .required()
  .field("workTypes")
  .required()
  .field("minSalary")
  .numeric()
  .min(0)
  .field("maxSalary")
  .numeric()
  .custom(
    (value, data) => !data.minSalary || Number(value) >= Number(data.minSalary),
    "Max salary must be greater than min salary"
  );

export const skillsValidation = new ValidationSchema()
  .field("primarySkills")
  .required()
  .custom(
    (value) => Array.isArray(value) && value.length > 0,
    "Please select at least one primary skill"
  );

// File validation
export const validateFile = (file, options = {}) => {
  const {
    maxSize = 5 * 1024 * 1024, // 5MB
    allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ],
    allowedExtensions = [".pdf", ".doc", ".docx"],
  } = options;

  const errors = [];

  if (!file) {
    errors.push("File is required");
    return { isValid: false, errors };
  }

  if (file.size > maxSize) {
    errors.push(
      `File size must be less than ${Math.round(maxSize / (1024 * 1024))}MB`
    );
  }

  if (!allowedTypes.includes(file.type)) {
    errors.push(
      `File type not allowed. Please upload: ${allowedExtensions.join(", ")}`
    );
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

// Form validation hook helper
export const useFormValidation = (schema) => {
  const validateField = (name, value, data = {}) => {
    const fieldRules = schema.rules[name];
    if (!fieldRules) return null;

    for (const rule of fieldRules) {
      if (!rule.validator(value, data)) {
        return rule.message;
      }
    }
    return null;
  };

  const validateForm = (data) => {
    return schema.validate(data);
  };

  const validateFields = (data, fieldsToValidate = null) => {
    const errors = {};
    const fields = fieldsToValidate || Object.keys(schema.rules);

    fields.forEach((fieldName) => {
      const error = validateField(fieldName, data[fieldName], data);
      if (error) {
        errors[fieldName] = error;
      }
    });

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  };

  return {
    validateField,
    validateForm,
    validateFields,
  };
};

// Export the ValidationSchema class
export { ValidationSchema };

// Export individual validators for custom use
export const validators = {
  required,
  minLength,
  maxLength,
  email,
  phone,
  url,
  pattern,
  numeric,
  integer,
  min,
  max,
  oneOf,
};
