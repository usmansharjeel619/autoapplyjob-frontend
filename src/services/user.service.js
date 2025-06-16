import {
  apiGet,
  apiPost,
  apiPut,
  apiPatch,
  apiDelete,
  apiPostFile,
} from "./api";

class UserService {
  // Profile Management
  async getProfile() {
    const response = await apiGet("/user/profile");
    return response.data;
  }

  async updateProfile(profileData) {
    const response = await apiPut("/user/profile", profileData);
    return response.data;
  }

  async updateBasicInfo(basicInfo) {
    const response = await apiPatch("/user/profile/basic", basicInfo);
    return response.data;
  }

  // Resume Management
  async uploadResume(file, onUploadProgress = null) {
    const response = await apiPostFile(
      "/user/resume/upload",
      file,
      {},
      onUploadProgress
    );
    return response.data;
  }

  async getResume() {
    const response = await apiGet("/user/resume");
    return response.data;
  }

  async updateResume(resumeData) {
    const response = await apiPut("/user/resume", resumeData);
    return response.data;
  }

  async deleteResume() {
    const response = await apiDelete("/user/resume");
    return response.data;
  }

  async parseResume(file) {
    const response = await apiPostFile("/user/resume/parse", file);
    return response.data;
  }

  async downloadResume(format = "pdf") {
    const response = await apiGet(`/user/resume/download?format=${format}`, {
      responseType: "blob",
    });
    return response.data;
  }

  // Job Preferences
  async getJobPreferences() {
    const response = await apiGet("/user/preferences/job");
    return response.data;
  }

  async updateJobPreferences(preferences) {
    const response = await apiPut("/user/preferences/job", preferences);
    return response.data;
  }

  // Skills Management
  async getSkills() {
    const response = await apiGet("/user/skills");
    return response.data;
  }

  async updateSkills(skills) {
    const response = await apiPut("/user/skills", skills);
    return response.data;
  }

  async addSkill(skill) {
    const response = await apiPost("/user/skills", skill);
    return response.data;
  }

  async removeSkill(skillId) {
    const response = await apiDelete(`/user/skills/${skillId}`);
    return response.data;
  }

  async getSkillSuggestions(query) {
    const response = await apiGet(`/user/skills/suggestions?q=${query}`);
    return response.data;
  }

  // Cover Letter Management
  async getCoverLetterTemplates() {
    const response = await apiGet("/user/cover-letter/templates");
    return response.data;
  }

  async createCoverLetterTemplate(template) {
    const response = await apiPost("/user/cover-letter/templates", template);
    return response.data;
  }

  async updateCoverLetterTemplate(templateId, template) {
    const response = await apiPut(
      `/user/cover-letter/templates/${templateId}`,
      template
    );
    return response.data;
  }

  async deleteCoverLetterTemplate(templateId) {
    const response = await apiDelete(
      `/user/cover-letter/templates/${templateId}`
    );
    return response.data;
  }

  async generateCoverLetter(jobId, templateId = null) {
    const response = await apiPost("/user/cover-letter/generate", {
      jobId,
      templateId,
    });
    return response.data;
  }

  // Job Applications
  async getJobApplications(params = {}) {
    const response = await apiGet("/user/applications", { params });
    return response.data;
  }

  async getJobApplication(applicationId) {
    const response = await apiGet(`/user/applications/${applicationId}`);
    return response.data;
  }

  async updateApplicationStatus(applicationId, status) {
    const response = await apiPatch(`/user/applications/${applicationId}`, {
      status,
    });
    return response.data;
  }

  async withdrawApplication(applicationId) {
    const response = await apiDelete(`/user/applications/${applicationId}`);
    return response.data;
  }

  async addApplicationNote(applicationId, note) {
    const response = await apiPost(
      `/user/applications/${applicationId}/notes`,
      { note }
    );
    return response.data;
  }

  // Job Search & Matching
  async getMatchedJobs(params = {}) {
    const response = await apiGet("/user/jobs/matched", { params });
    return response.data;
  }

  async getJobDetails(jobId) {
    const response = await apiGet(`/user/jobs/${jobId}`);
    return response.data;
  }

  async saveJob(jobId) {
    const response = await apiPost(`/user/jobs/${jobId}/save`);
    return response.data;
  }

  async unsaveJob(jobId) {
    const response = await apiDelete(`/user/jobs/${jobId}/save`);
    return response.data;
  }

  async getSavedJobs(params = {}) {
    const response = await apiGet("/user/jobs/saved", { params });
    return response.data;
  }

  async getJobMatchScore(jobId) {
    const response = await apiGet(`/user/jobs/${jobId}/match-score`);
    return response.data;
  }

  // Search Filters
  async getSearchFilters() {
    const response = await apiGet("/user/search/filters");
    return response.data;
  }

  async updateSearchFilters(filters) {
    const response = await apiPut("/user/search/filters", filters);
    return response.data;
  }

  async createSearchAlert(alertData) {
    const response = await apiPost("/user/search/alerts", alertData);
    return response.data;
  }

  async getSearchAlerts() {
    const response = await apiGet("/user/search/alerts");
    return response.data;
  }

  async updateSearchAlert(alertId, alertData) {
    const response = await apiPut(`/user/search/alerts/${alertId}`, alertData);
    return response.data;
  }

  async deleteSearchAlert(alertId) {
    const response = await apiDelete(`/user/search/alerts/${alertId}`);
    return response.data;
  }

  // Dashboard & Analytics
  async getDashboardStats() {
    const response = await apiGet("/user/dashboard/stats");
    return response.data;
  }

  async getActivityTimeline(params = {}) {
    const response = await apiGet("/user/dashboard/activity", { params });
    return response.data;
  }

  async getApplicationAnalytics(period = "30d") {
    const response = await apiGet(
      `/user/analytics/applications?period=${period}`
    );
    return response.data;
  }

  // AI Tools
  async getResumeScore() {
    const response = await apiGet("/user/ai/resume-score");
    return response.data;
  }

  async getResumeOptimizationSuggestions() {
    const response = await apiGet("/user/ai/resume-optimization");
    return response.data;
  }

  async getInterviewQuestions(jobId) {
    const response = await apiGet(
      `/user/ai/interview-questions?jobId=${jobId}`
    );
    return response.data;
  }

  async optimizeResumeForJob(jobId) {
    const response = await apiPost("/user/ai/optimize-resume", { jobId });
    return response.data;
  }

  async generateJobSearchKeywords() {
    const response = await apiGet("/user/ai/keywords");
    return response.data;
  }

  // Settings
  async getNotificationSettings() {
    const response = await apiGet("/user/settings/notifications");
    return response.data;
  }

  async updateNotificationSettings(settings) {
    const response = await apiPut("/user/settings/notifications", settings);
    return response.data;
  }

  async getPrivacySettings() {
    const response = await apiGet("/user/settings/privacy");
    return response.data;
  }

  async updatePrivacySettings(settings) {
    const response = await apiPut("/user/settings/privacy", settings);
    return response.data;
  }

  async getApplicationSettings() {
    const response = await apiGet("/user/settings/application");
    return response.data;
  }

  async updateApplicationSettings(settings) {
    const response = await apiPut("/user/settings/application", settings);
    return response.data;
  }

  // Onboarding
  async getOnboardingProgress() {
    const response = await apiGet("/user/onboarding/progress");
    return response.data;
  }

  async updateOnboardingProgress(step, data) {
    const response = await apiPut("/user/onboarding/progress", { step, data });
    return response.data;
  }

  async completeOnboarding() {
    const response = await apiPost("/user/onboarding/complete");
    return response.data;
  }

  // Profile Completion
  async getProfileCompletionScore() {
    const response = await apiGet("/user/profile/completion-score");
    return response.data;
  }

  async getProfileCompletionSuggestions() {
    const response = await apiGet("/user/profile/completion-suggestions");
    return response.data;
  }
}

// Create and export a singleton instance
const userService = new UserService();
export default userService;
