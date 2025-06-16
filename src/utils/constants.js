// API Constants
export const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:5000/api";

// Application Routes
export const ROUTES = {
  HOME: "/",
  AUTH: "/auth",
  ONBOARDING: "/onboarding",
  DASHBOARD: "/dashboard",
  PROFILE: "/profile",
  JOBS: "/jobs",
  TOOLS: "/tools",
  SETTINGS: "/settings",
  ADMIN: {
    DASHBOARD: "/admin/dashboard",
    APPLICANTS: "/admin/applicants",
    APPLICATIONS: "/admin/applications",
    ANALYTICS: "/admin/analytics",
  },
};

// User Types
export const USER_TYPES = {
  JOB_SEEKER: "job_seeker",
  ADMIN: "admin",
};

// Onboarding Steps
export const ONBOARDING_STEPS = {
  BASIC_INFO: "basic_info",
  RESUME_UPLOAD: "resume_upload",
  JOB_PREFERENCES: "job_preferences",
  SKILLS_SETUP: "skills_setup",
  AI_TOOLS: "ai_tools",
};

// Experience Levels
export const EXPERIENCE_LEVELS = [
  { value: "0-1", label: "0-1 years" },
  { value: "1-3", label: "1-3 years" },
  { value: "3-5", label: "3-5 years" },
  { value: "5-10", label: "5-10 years" },
  { value: "10+", label: "10+ years" },
];

// Education Levels
export const EDUCATION_LEVELS = [
  { value: "high_school", label: "High School" },
  { value: "associate", label: "Associate Degree" },
  { value: "bachelor", label: "Bachelor's Degree" },
  { value: "master", label: "Master's Degree" },
  { value: "phd", label: "PhD" },
  { value: "other", label: "Other" },
];

// Industries
export const INDUSTRIES = [
  { value: "technology", label: "Technology" },
  { value: "finance", label: "Finance" },
  { value: "healthcare", label: "Healthcare" },
  { value: "education", label: "Education" },
  { value: "retail", label: "Retail" },
  { value: "manufacturing", label: "Manufacturing" },
  { value: "consulting", label: "Consulting" },
  { value: "marketing", label: "Marketing" },
  { value: "real_estate", label: "Real Estate" },
  { value: "other", label: "Other" },
];

// Job Types
export const JOB_TYPES = [
  { value: "full_time", label: "Full-time" },
  { value: "part_time", label: "Part-time" },
  { value: "contract", label: "Contract" },
  { value: "freelance", label: "Freelance" },
  { value: "internship", label: "Internship" },
];

// Work Types
export const WORK_TYPES = [
  { value: "remote", label: "Remote" },
  { value: "hybrid", label: "Hybrid" },
  { value: "onsite", label: "On-site" },
];

// Application Status
export const APPLICATION_STATUS = {
  PENDING: "pending",
  APPLIED: "applied",
  VIEWED: "viewed",
  INTERVIEW: "interview",
  REJECTED: "rejected",
  ACCEPTED: "accepted",
};

// Application Status Labels
export const APPLICATION_STATUS_LABELS = {
  [APPLICATION_STATUS.PENDING]: "Pending",
  [APPLICATION_STATUS.APPLIED]: "Applied",
  [APPLICATION_STATUS.VIEWED]: "Viewed",
  [APPLICATION_STATUS.INTERVIEW]: "Interview",
  [APPLICATION_STATUS.REJECTED]: "Rejected",
  [APPLICATION_STATUS.ACCEPTED]: "Accepted",
};

// Job Platforms
export const JOB_PLATFORMS = [
  { value: "linkedin", label: "LinkedIn" },
  { value: "indeed", label: "Indeed" },
  { value: "glassdoor", label: "Glassdoor" },
  { value: "monster", label: "Monster" },
  { value: "ziprecruiter", label: "ZipRecruiter" },
  { value: "careerbuilder", label: "CareerBuilder" },
];

// Common Skills (for autocomplete)
export const COMMON_SKILLS = [
  "JavaScript",
  "Python",
  "Java",
  "React",
  "Node.js",
  "HTML/CSS",
  "SQL",
  "MongoDB",
  "PostgreSQL",
  "AWS",
  "Docker",
  "Git",
  "Project Management",
  "Data Analysis",
  "Machine Learning",
  "Digital Marketing",
  "Sales",
  "Customer Service",
  "Leadership",
  "Communication",
  "Problem Solving",
  "Team Management",
];

// File Upload Constants
export const FILE_UPLOAD = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_TYPES: [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ],
  ALLOWED_EXTENSIONS: [".pdf", ".doc", ".docx"],
};

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [10, 25, 50, 100],
};

// Local Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: "auth_token",
  USER_DATA: "user_data",
  ONBOARDING_PROGRESS: "onboarding_progress",
  THEME: "theme",
};

// Theme Options
export const THEMES = {
  LIGHT: "light",
  DARK: "dark",
};

// Notification Types
export const NOTIFICATION_TYPES = {
  SUCCESS: "success",
  ERROR: "error",
  WARNING: "warning",
  INFO: "info",
};
