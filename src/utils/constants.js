// API Constants
export const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:5000/api";

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: `/auth/login`,
    REGISTER: `/auth/register`,
    LOGOUT: `/auth/logout`,
    REFRESH: `/auth/refresh`,
    VERIFY_EMAIL: `/auth/verify-email`,
    FORGOT_PASSWORD: `/auth/forgot-password`,
    RESET_PASSWORD: `/auth/reset-password`,
    CHANGE_PASSWORD: `/auth/change-password`,
    VERIFY: `/auth/verify`,
    RESEND_VERIFICATION: `/auth/resend-verification`,
  },
  USER: {
    PROFILE: `/user/profile`,
    UPDATE_PROFILE: `/user/profile`,
    UPLOAD_RESUME: `/user/resume`,
    GET_JOBS: `/user/jobs`,
    SAVED_JOBS: `/user/saved-jobs`,
    APPLICATION_HISTORY: `/user/applications`,
    SETTINGS: `/user/settings`,
    DASHBOARD_STATS: `/user/dashboard`,
    ONBOARDING: `/user/onboarding`,
  },
  ADMIN: {
    DASHBOARD: `/admin/dashboard`,
    USERS: `/admin/users`,
    APPLICATIONS: `/admin/applications`,
    JOBS: `/admin/jobs`,
    ANALYTICS: `/admin/analytics`,
    SYSTEM_SETTINGS: `/admin/settings`,
  },
  JOBS: {
    SEARCH: `/jobs/search`,
    DETAILS: `/jobs/:id`,
    APPLY: `/jobs/:id/apply`,
    SCRAPED_JOBS: `/jobs/scraped`,
  },
  APPLICATIONS: {
    CREATE: `/applications`,
    GET_ALL: `/applications`,
    GET_BY_ID: `/applications/:id`,
    UPDATE_STATUS: `/applications/:id/status`,
  },
};

// Application Routes (same as before)
export const ROUTES = {
  HOME: "/",
  AUTH: "/auth",
  ONBOARDING: "/onboarding",
  PAYMENT: "/payment",
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
};

// Experience Levels
export const EXPERIENCE_LEVELS = [
  { value: "0-1", label: "Entry Level (0-1 years)" },
  { value: "1-3", label: "Junior (1-3 years)" },
  { value: "3-5", label: "Mid-level (3-5 years)" },
  { value: "5-10", label: "Senior (5-10 years)" },
  { value: "10+", label: "Expert (10+ years)" },
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

// Job Types
export const JOB_TYPES = [
  { value: "full_time", label: "Full Time" },
  { value: "part_time", label: "Part Time" },
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
  REVIEWING: "reviewing",
  INTERVIEWING: "interviewing",
  REJECTED: "rejected",
  ACCEPTED: "accepted",
  WITHDRAWN: "withdrawn",
};

// Local Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: "auth_token",
  REFRESH_TOKEN: "refresh_token",
  USER_DATA: "user_data",
  THEME: "theme",
  LANGUAGE: "language",
};

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

// Industries
export const INDUSTRIES = [
  { value: "technology", label: "Technology" },
  { value: "healthcare", label: "Healthcare" },
  { value: "finance", label: "Finance" },
  { value: "education", label: "Education" },
  { value: "retail", label: "Retail" },
  { value: "manufacturing", label: "Manufacturing" },
  { value: "consulting", label: "Consulting" },
  { value: "media", label: "Media & Entertainment" },
  { value: "real_estate", label: "Real Estate" },
  { value: "automotive", label: "Automotive" },
  { value: "aerospace", label: "Aerospace" },
  { value: "energy", label: "Energy" },
  { value: "government", label: "Government" },
  { value: "nonprofit", label: "Non-Profit" },
  { value: "other", label: "Other" },
];

// Common Skills
export const COMMON_SKILLS = [
  // Programming Languages
  "JavaScript",
  "Python",
  "Java",
  "C++",
  "C#",
  "PHP",
  "TypeScript",
  "Go",
  "Rust",
  "Swift",
  "Kotlin",

  // Frontend Technologies
  "React",
  "Vue.js",
  "Angular",
  "HTML",
  "CSS",
  "SASS",
  "jQuery",
  "Bootstrap",
  "Tailwind CSS",

  // Backend Technologies
  "Node.js",
  "Express.js",
  "Django",
  "Flask",
  "Spring Boot",
  "Laravel",
  "Ruby on Rails",
  ".NET",

  // Databases
  "MySQL",
  "PostgreSQL",
  "MongoDB",
  "Redis",
  "SQLite",
  "Oracle",
  "SQL Server",

  // Cloud & DevOps
  "AWS",
  "Azure",
  "Google Cloud",
  "Docker",
  "Kubernetes",
  "Jenkins",
  "Git",
  "GitHub",
  "GitLab",

  // Mobile Development
  "React Native",
  "Flutter",
  "iOS Development",
  "Android Development",

  // Data & Analytics
  "SQL",
  "Data Analysis",
  "Machine Learning",
  "AI",
  "TensorFlow",
  "PyTorch",
  "Pandas",
  "NumPy",

  // Design
  "UI/UX Design",
  "Figma",
  "Adobe Creative Suite",
  "Sketch",
  "Photoshop",
  "Illustrator",

  // Project Management
  "Agile",
  "Scrum",
  "Kanban",
  "Jira",
  "Trello",
  "Project Management",

  // Marketing & Sales
  "Digital Marketing",
  "SEO",
  "SEM",
  "Social Media Marketing",
  "Content Marketing",
  "Sales",

  // General Business
  "Communication",
  "Leadership",
  "Problem Solving",
  "Team Work",
  "Critical Thinking",
  "Creativity",
];

// Themes
export const THEMES = {
  LIGHT: "light",
  DARK: "dark",
  SYSTEM: "system",
};

// Notification Types
export const NOTIFICATION_TYPES = {
  SUCCESS: "success",
  ERROR: "error",
  WARNING: "warning",
  INFO: "info",
};
