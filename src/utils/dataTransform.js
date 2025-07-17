// Transform user data from API response
export const transformUserData = (apiUser) => {
  return {
    id: apiUser._id || apiUser.id,
    name: apiUser.name,
    email: apiUser.email,
    phone: apiUser.phone,
    userType: apiUser.userType || "user",
    onboardingCompleted: apiUser.onboardingCompleted || false,
    profileCompleteness: apiUser.profileCompleteness || 0,
    currentJobTitle: apiUser.currentJobTitle,
    experienceLevel: apiUser.experienceLevel,
    educationLevel: apiUser.educationLevel,
    skills: apiUser.skills || [],
    location: apiUser.location,
    bio: apiUser.bio,
    linkedinUrl: apiUser.linkedinUrl,
    githubUrl: apiUser.githubUrl,
    portfolioUrl: apiUser.portfolioUrl,
    resumeFileName: apiUser.resume?.fileName,
    resumeUrl: apiUser.resume?.url,
    resumeUploadedAt: apiUser.resume?.uploadedAt,
    createdAt: apiUser.createdAt,
    lastLogin: apiUser.lastLogin,
  };
};

// Transform job data from API response
export const transformJobData = (apiJob) => {
  return {
    id: apiJob._id || apiJob.id,
    title: apiJob.title,
    company: apiJob.company,
    location: apiJob.location,
    workType: apiJob.workType,
    jobType: apiJob.jobType,
    salary: apiJob.salary,
    description: apiJob.description,
    requirements: apiJob.requirements || [],
    skills: apiJob.skills || [],
    benefits: apiJob.benefits || [],
    postedDate: apiJob.postedDate,
    expiryDate: apiJob.expiryDate,
    matchScore: apiJob.matchScore || 0,
    status: apiJob.status || "active",
    industry: apiJob.industry,
    companySize: apiJob.companySize,
    applyUrl: apiJob.applyUrl,
    scrapedFrom: apiJob.scrapedFrom,
    isActive: apiJob.isActive !== false,
    createdAt: apiJob.createdAt,
    updatedAt: apiJob.updatedAt,
  };
};

// Transform application data from API response
export const transformApplicationData = (apiApplication) => {
  return {
    id: apiApplication._id || apiApplication.id,
    jobId: apiApplication.job?._id || apiApplication.jobId,
    jobTitle: apiApplication.job?.title || apiApplication.jobTitle,
    company: apiApplication.job?.company || apiApplication.company,
    location: apiApplication.job?.location || apiApplication.location,
    applicantId: apiApplication.user?._id || apiApplication.applicantId,
    applicantName: apiApplication.user?.name || apiApplication.applicantName,
    applicantEmail: apiApplication.user?.email || apiApplication.applicantEmail,
    status: apiApplication.status,
    matchScore: apiApplication.matchScore || 0,
    appliedAt: apiApplication.appliedAt || apiApplication.createdAt,
    submittedAt: apiApplication.submittedAt || apiApplication.createdAt,
    coverLetter: apiApplication.coverLetter,
    notes: apiApplication.notes,
    interviewDate: apiApplication.interviewDate,
    interviewType: apiApplication.interviewType,
    meetingLink: apiApplication.meetingLink,
    createdAt: apiApplication.createdAt,
    updatedAt: apiApplication.updatedAt,
  };
};

// Transform pagination data
export const transformPaginationData = (apiResponse) => {
  return {
    data: apiResponse.data || [],
    page: apiResponse.page || 1,
    pageSize: apiResponse.pageSize || 10,
    total: apiResponse.total || 0,
    totalPages: apiResponse.totalPages || 0,
    hasNext: apiResponse.hasNext || false,
    hasPrev: apiResponse.hasPrev || false,
  };
};
