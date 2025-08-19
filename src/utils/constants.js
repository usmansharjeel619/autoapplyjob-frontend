// API Constants
export const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:5000/api/v1";

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
  AI: {
    EXTRACT_TEXT: `/ai/extract-text`,
    PARSE_RESUME: `/ai/parse-resume`,
    ENHANCE_RESUME: `/ai/enhance-resume`,
    ANALYZE_JOB_MATCH: `/ai/analyze-job-match`,
    STATUS: `/ai/status`,
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

// Application Routes (same as API endpoints structure for frontend routing)
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

// AI Status Constants - ADDED THIS!
export const AI_STATUS = {
  NOT_CONFIGURED: "not_configured",
  OPERATIONAL: "operational",
  INVALID_KEY: "invalid_key",
  ERROR: "error",
  UNAVAILABLE: "unavailable",
};

// Local Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: "auth_token",
  REFRESH_TOKEN: "refresh_token",
  USER_DATA: "user_data",
  THEME: "theme",
  LANGUAGE: "language",
  ONBOARDING_PROGRESS: "onboarding_progress",
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

// Common Job Titles for suggestions
export const JOB_TITLES = [
  // Technology
  "Software Engineer",
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "Mobile App Developer",
  "DevOps Engineer",
  "Data Scientist",
  "Data Analyst",
  "Machine Learning Engineer",
  "AI Engineer",
  "Cloud Engineer",
  "Cybersecurity Specialist",
  "Database Administrator",
  "System Administrator",
  "Network Engineer",
  "Product Manager",
  "Technical Product Manager",
  "QA Engineer",
  "Test Automation Engineer",
  "UI/UX Designer",
  "Web Designer",
  "Graphic Designer",
  "Technical Writer",
  "Solutions Architect",
  "Engineering Manager",
  "Tech Lead",
  "Senior Software Engineer",
  "Junior Developer",
  "Intern Developer",

  // Business & Management
  "Business Analyst",
  "Project Manager",
  "Scrum Master",
  "Operations Manager",
  "General Manager",
  "Account Manager",
  "Sales Manager",
  "Marketing Manager",
  "Digital Marketing Specialist",
  "Content Marketing Manager",
  "Social Media Manager",
  "SEO Specialist",
  "Growth Hacker",
  "Customer Success Manager",
  "HR Manager",
  "Recruiter",
  "Training Specialist",
  "Business Development Manager",
  "Strategy Consultant",
  "Management Consultant",

  // Finance & Accounting
  "Financial Analyst",
  "Accountant",
  "Senior Accountant",
  "Bookkeeper",
  "Tax Specialist",
  "Auditor",
  "Investment Analyst",
  "Risk Analyst",
  "Credit Analyst",
  "Treasury Analyst",
  "Controller",
  "CFO",
  "Finance Manager",

  // Healthcare
  "Registered Nurse",
  "Physician",
  "Medical Assistant",
  "Physical Therapist",
  "Pharmacist",
  "Medical Technician",
  "Healthcare Administrator",
  "Dentist",
  "Veterinarian",

  // Education
  "Teacher",
  "Professor",
  "Teaching Assistant",
  "Curriculum Developer",
  "Education Coordinator",
  "School Administrator",
  "Librarian",
  "Research Assistant",

  // Sales & Customer Service
  "Sales Representative",
  "Account Executive",
  "Business Development Representative",
  "Customer Service Representative",
  "Call Center Agent",
  "Technical Support Specialist",
  "Sales Engineer",

  // Creative & Design
  "Graphic Designer",
  "Web Designer",
  "UI Designer",
  "UX Designer",
  "Creative Director",
  "Art Director",
  "Copywriter",
  "Content Creator",
  "Video Editor",
  "Photographer",
  "Interior Designer",

  // Manufacturing & Operations
  "Production Manager",
  "Quality Control Inspector",
  "Manufacturing Engineer",
  "Supply Chain Manager",
  "Logistics Coordinator",
  "Warehouse Manager",
  "Maintenance Technician",

  // Legal
  "Lawyer",
  "Paralegal",
  "Legal Assistant",
  "Contract Manager",
  "Compliance Officer",

  // Other
  "Administrative Assistant",
  "Executive Assistant",
  "Office Manager",
  "Receptionist",
  "Security Guard",
  "Driver",
  "Chef",
  "Server",
  "Retail Associate",
  "Store Manager",
];

// Predefined Locations (Major cities worldwide)
export const LOCATIONS = [
  // United States
  { value: "new-york-ny-usa", label: "New York, NY, USA" },
  { value: "los-angeles-ca-usa", label: "Los Angeles, CA, USA" },
  { value: "chicago-il-usa", label: "Chicago, IL, USA" },
  { value: "houston-tx-usa", label: "Houston, TX, USA" },
  { value: "phoenix-az-usa", label: "Phoenix, AZ, USA" },
  { value: "philadelphia-pa-usa", label: "Philadelphia, PA, USA" },
  { value: "san-antonio-tx-usa", label: "San Antonio, TX, USA" },
  { value: "san-diego-ca-usa", label: "San Diego, CA, USA" },
  { value: "dallas-tx-usa", label: "Dallas, TX, USA" },
  { value: "san-jose-ca-usa", label: "San Jose, CA, USA" },
  { value: "austin-tx-usa", label: "Austin, TX, USA" },
  { value: "jacksonville-fl-usa", label: "Jacksonville, FL, USA" },
  { value: "san-francisco-ca-usa", label: "San Francisco, CA, USA" },
  { value: "indianapolis-in-usa", label: "Indianapolis, IN, USA" },
  { value: "columbus-oh-usa", label: "Columbus, OH, USA" },
  { value: "fort-worth-tx-usa", label: "Fort Worth, TX, USA" },
  { value: "charlotte-nc-usa", label: "Charlotte, NC, USA" },
  { value: "seattle-wa-usa", label: "Seattle, WA, USA" },
  { value: "denver-co-usa", label: "Denver, CO, USA" },
  { value: "boston-ma-usa", label: "Boston, MA, USA" },

  // Canada
  { value: "toronto-on-canada", label: "Toronto, ON, Canada" },
  { value: "vancouver-bc-canada", label: "Vancouver, BC, Canada" },
  { value: "montreal-qc-canada", label: "Montreal, QC, Canada" },
  { value: "calgary-ab-canada", label: "Calgary, AB, Canada" },
  { value: "ottawa-on-canada", label: "Ottawa, ON, Canada" },
  { value: "edmonton-ab-canada", label: "Edmonton, AB, Canada" },

  // United Kingdom
  { value: "london-uk", label: "London, UK" },
  { value: "manchester-uk", label: "Manchester, UK" },
  { value: "birmingham-uk", label: "Birmingham, UK" },
  { value: "glasgow-uk", label: "Glasgow, UK" },
  { value: "liverpool-uk", label: "Liverpool, UK" },
  { value: "edinburgh-uk", label: "Edinburgh, UK" },

  // Australia
  { value: "sydney-australia", label: "Sydney, Australia" },
  { value: "melbourne-australia", label: "Melbourne, Australia" },
  { value: "brisbane-australia", label: "Brisbane, Australia" },
  { value: "perth-australia", label: "Perth, Australia" },
  { value: "adelaide-australia", label: "Adelaide, Australia" },

  // Germany
  { value: "berlin-germany", label: "Berlin, Germany" },
  { value: "munich-germany", label: "Munich, Germany" },
  { value: "hamburg-germany", label: "Hamburg, Germany" },
  { value: "cologne-germany", label: "Cologne, Germany" },
  { value: "frankfurt-germany", label: "Frankfurt, Germany" },

  // France
  { value: "paris-france", label: "Paris, France" },
  { value: "lyon-france", label: "Lyon, France" },
  { value: "marseille-france", label: "Marseille, France" },
  { value: "toulouse-france", label: "Toulouse, France" },

  // Netherlands
  { value: "amsterdam-netherlands", label: "Amsterdam, Netherlands" },
  { value: "rotterdam-netherlands", label: "Rotterdam, Netherlands" },
  { value: "the-hague-netherlands", label: "The Hague, Netherlands" },

  // India
  { value: "mumbai-india", label: "Mumbai, India" },
  { value: "delhi-india", label: "Delhi, India" },
  { value: "bangalore-india", label: "Bangalore, India" },
  { value: "hyderabad-india", label: "Hyderabad, India" },
  { value: "chennai-india", label: "Chennai, India" },
  { value: "kolkata-india", label: "Kolkata, India" },
  { value: "pune-india", label: "Pune, India" },

  // Pakistan
  { value: "karachi-pakistan", label: "Karachi, Pakistan" },
  { value: "lahore-pakistan", label: "Lahore, Pakistan" },
  { value: "islamabad-pakistan", label: "Islamabad, Pakistan" },
  { value: "rawalpindi-pakistan", label: "Rawalpindi, Pakistan" },
  { value: "faisalabad-pakistan", label: "Faisalabad, Pakistan" },

  // Japan
  { value: "tokyo-japan", label: "Tokyo, Japan" },
  { value: "osaka-japan", label: "Osaka, Japan" },
  { value: "kyoto-japan", label: "Kyoto, Japan" },
  { value: "yokohama-japan", label: "Yokohama, Japan" },

  // Singapore
  { value: "singapore", label: "Singapore" },

  // UAE
  { value: "dubai-uae", label: "Dubai, UAE" },
  { value: "abu-dhabi-uae", label: "Abu Dhabi, UAE" },

  // Brazil
  { value: "sao-paulo-brazil", label: "São Paulo, Brazil" },
  { value: "rio-de-janeiro-brazil", label: "Rio de Janeiro, Brazil" },

  // Mexico
  { value: "mexico-city-mexico", label: "Mexico City, Mexico" },
  { value: "guadalajara-mexico", label: "Guadalajara, Mexico" },

  // Special options
  { value: "remote-worldwide", label: "Remote - Worldwide" },
  { value: "remote-usa", label: "Remote - USA" },
  { value: "remote-europe", label: "Remote - Europe" },
  { value: "remote-asia", label: "Remote - Asia" },
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
