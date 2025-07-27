// src/utils/helpers.js
import { STORAGE_KEYS } from "./constants";

// Local Storage Helpers - FIXED VERSION
export const getStorageItem = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key);

    // Check if item exists and is not null/undefined
    if (item === null || item === undefined || item === "undefined") {
      return defaultValue;
    }

    return JSON.parse(item);
  } catch (error) {
    console.error(`Error getting item from localStorage: ${error}`);
    return defaultValue;
  }
};

export const setStorageItem = (key, value) => {
  try {
    // Don't store null or undefined values
    if (value === null || value === undefined) {
      removeStorageItem(key);
      return;
    }

    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error setting item in localStorage: ${error}`);
  }
};

export const removeStorageItem = (key) => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing item from localStorage: ${error}`);
  }
};

// Format currency
export const formatCurrency = (amount, currency = "USD") => {
  if (!amount) return "Not specified";

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

// Format date
export const formatDate = (date, options = {}) => {
  if (!date) return "";

  const defaultOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
    ...options,
  };

  return new Date(date).toLocaleDateString("en-US", defaultOptions);
};

// Format time ago
export const formatTimeAgo = (date) => {
  if (!date) return "";

  const now = new Date();
  const diffInMs = now - new Date(date);
  const diffInSecs = Math.floor(diffInMs / 1000);
  const diffInMins = Math.floor(diffInSecs / 60);
  const diffInHours = Math.floor(diffInMins / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInDays > 0) {
    return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;
  } else if (diffInHours > 0) {
    return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;
  } else if (diffInMins > 0) {
    return `${diffInMins} minute${diffInMins > 1 ? "s" : ""} ago`;
  } else {
    return "Just now";
  }
};

// Truncate text
export const truncateText = (text, maxLength = 100) => {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
};

// Validate email
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate phone
export const isValidPhone = (phone) => {
  const phoneRegex = /^[\+]?[\d\s\-\(\)]+$/;
  return phoneRegex.test(phone) && phone.replace(/\D/g, "").length >= 10;
};

// Validate URL
export const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// Get user initials
export const getInitials = (name) => {
  if (!name) return "";
  return name
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase())
    .slice(0, 2)
    .join("");
};

// Generate random ID
export const generateId = () => {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
};

// Debounce function
export const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(null, args), delay);
  };
};

// Array helpers
export const sortBy = (array, key, direction = "asc") => {
  return [...array].sort((a, b) => {
    const aVal = a[key];
    const bVal = b[key];
    if (aVal < bVal) return direction === "asc" ? -1 : 1;
    if (aVal > bVal) return direction === "asc" ? 1 : -1;
    return 0;
  });
};

export const filterBy = (array, filters) => {
  return array.filter((item) => {
    return Object.entries(filters).every(([key, value]) => {
      if (!value) return true;

      if (Array.isArray(value)) {
        return value.includes(item[key]);
      }

      if (typeof value === "string") {
        return item[key]?.toLowerCase().includes(value.toLowerCase());
      }

      return item[key] === value;
    });
  });
};

// Object helpers
export const omit = (obj, keys) => {
  const result = { ...obj };
  keys.forEach((key) => delete result[key]);
  return result;
};

export const pick = (obj, keys) => {
  const result = {};
  keys.forEach((key) => {
    if (key in obj) {
      result[key] = obj[key];
    }
  });
  return result;
};

export const deepClone = (obj) => {
  return JSON.parse(JSON.stringify(obj));
};

// File helpers
export const getFileExtension = (filename) => {
  return filename.slice(((filename.lastIndexOf(".") - 1) >>> 0) + 2);
};

export const formatFileSize = (bytes) => {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

export const isValidFileType = (file, allowedTypes) => {
  return allowedTypes.includes(file.type);
};

export const isValidFileSize = (file, maxSize) => {
  return file.size <= maxSize;
};

// URL helpers
export const buildQueryString = (params) => {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== "") {
      if (Array.isArray(value)) {
        value.forEach((v) => searchParams.append(key, v));
      } else {
        searchParams.append(key, value);
      }
    }
  });

  return searchParams.toString();
};

export const parseQueryString = (queryString) => {
  const params = new URLSearchParams(queryString);
  const result = {};

  for (const [key, value] of params) {
    if (result[key]) {
      if (Array.isArray(result[key])) {
        result[key].push(value);
      } else {
        result[key] = [result[key], value];
      }
    } else {
      result[key] = value;
    }
  }

  return result;
};
