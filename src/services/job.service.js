import { apiGet, apiPost, apiPut, apiDelete } from "./api";

class JobService {
  // Job Search & Discovery
  async searchJobs(params = {}) {
    const response = await apiGet("/jobs/search", { params });
    return response.data;
  }

  async getJob(jobId) {
    const response = await apiGet(`/jobs/${jobId}`);
    return response.data;
  }

  async getFeaturedJobs(params = {}) {
    const response = await apiGet("/jobs/featured", { params });
    return response.data;
  }

  async getRecentJobs(params = {}) {
    const response = await apiGet("/jobs/recent", { params });
    return response.data;
  }

  async getJobsByCompany(companyId, params = {}) {
    const response = await apiGet(`/jobs/company/${companyId}`, { params });
    return response.data;
  }

  async getJobsByLocation(location, params = {}) {
    const response = await apiGet(
      `/jobs/location/${encodeURIComponent(location)}`,
      { params }
    );
    return response.data;
  }

  async getJobsByCategory(category, params = {}) {
    const response = await apiGet(`/jobs/category/${category}`, { params });
    return response.data;
  }

  // Job Recommendations
  async getRecommendedJobs(userId, params = {}) {
    const response = await apiGet(`/jobs/recommendations/${userId}`, {
      params,
    });
    return response.data;
  }

  async getSimilarJobs(jobId, params = {}) {
    const response = await apiGet(`/jobs/${jobId}/similar`, { params });
    return response.data;
  }

  // Job Filters & Categories
  async getJobCategories() {
    const response = await apiGet("/jobs/categories");
    return response.data;
  }

  async getJobTypes() {
    const response = await apiGet("/jobs/types");
    return response.data;
  }

  async getExperienceLevels() {
    const response = await apiGet("/jobs/experience-levels");
    return response.data;
  }

  async getJobLocations() {
    const response = await apiGet("/jobs/locations");
    return response.data;
  }

  async getCompanies(params = {}) {
    const response = await apiGet("/jobs/companies", { params });
    return response.data;
  }

  async getCompanyDetails(companyId) {
    const response = await apiGet(`/jobs/companies/${companyId}`);
    return response.data;
  }

  // Job Scraping & Sources
  async getJobSources() {
    const response = await apiGet("/jobs/sources");
    return response.data;
  }

  async getJobsBySource(source, params = {}) {
    const response = await apiGet(`/jobs/source/${source}`, { params });
    return response.data;
  }

  // Job Statistics
  async getJobStats(params = {}) {
    const response = await apiGet("/jobs/stats", { params });
    return response.data;
  }

  async getJobTrends(params = {}) {
    const response = await apiGet("/jobs/trends", { params });
    return response.data;
  }

  async getSalaryInsights(params = {}) {
    const response = await apiGet("/jobs/salary-insights", { params });
    return response.data;
  }

  // Job Alerts & Notifications
  async createJobAlert(alertData) {
    const response = await apiPost("/jobs/alerts", alertData);
    return response.data;
  }

  async getJobAlerts(userId) {
    const response = await apiGet(`/jobs/alerts/user/${userId}`);
    return response.data;
  }

  async updateJobAlert(alertId, alertData) {
    const response = await apiPut(`/jobs/alerts/${alertId}`, alertData);
    return response.data;
  }

  async deleteJobAlert(alertId) {
    const response = await apiDelete(`/jobs/alerts/${alertId}`);
    return response.data;
  }

  async getAlertMatches(alertId, params = {}) {
    const response = await apiGet(`/jobs/alerts/${alertId}/matches`, {
      params,
    });
    return response.data;
  }

  // Job Import & Export
  async importJobs(source, params = {}) {
    const response = await apiPost("/jobs/import", { source, ...params });
    return response.data;
  }

  async exportJobs(params = {}) {
    const response = await apiGet("/jobs/export", {
      params,
      responseType: "blob",
    });
    return response.data;
  }

  // Job Validation & Quality
  async validateJob(jobData) {
    const response = await apiPost("/jobs/validate", jobData);
    return response.data;
  }

  async reportJob(jobId, reason) {
    const response = await apiPost(`/jobs/${jobId}/report`, { reason });
    return response.data;
  }

  async getJobQualityScore(jobId) {
    const response = await apiGet(`/jobs/${jobId}/quality-score`);
    return response.data;
  }

  // Job Matching Algorithm
  async calculateJobMatch(userId, jobId) {
    const response = await apiPost("/jobs/calculate-match", { userId, jobId });
    return response.data;
  }

  async getMatchingCriteria() {
    const response = await apiGet("/jobs/matching-criteria");
    return response.data;
  }

  async updateMatchingWeights(weights) {
    const response = await apiPut("/jobs/matching-weights", weights);
    return response.data;
  }

  // Advanced Search
  async advancedSearch(searchParams) {
    const response = await apiPost("/jobs/advanced-search", searchParams);
    return response.data;
  }

  async saveSearch(searchParams, name) {
    const response = await apiPost("/jobs/saved-searches", {
      searchParams,
      name,
    });
    return response.data;
  }

  async getSavedSearches(userId) {
    const response = await apiGet(`/jobs/saved-searches/user/${userId}`);
    return response.data;
  }

  async deleteSavedSearch(searchId) {
    const response = await apiDelete(`/jobs/saved-searches/${searchId}`);
    return response.data;
  }

  // Job Insights & Analytics
  async getJobInsights(jobId) {
    const response = await apiGet(`/jobs/${jobId}/insights`);
    return response.data;
  }

  async getMarketAnalysis(params = {}) {
    const response = await apiGet("/jobs/market-analysis", { params });
    return response.data;
  }

  async getSkillDemand(params = {}) {
    const response = await apiGet("/jobs/skill-demand", { params });
    return response.data;
  }

  async getLocationInsights(location) {
    const response = await apiGet(
      `/jobs/location-insights/${encodeURIComponent(location)}`
    );
    return response.data;
  }

  // Job Application Management (for Admin)
  async getJobApplications(jobId, params = {}) {
    const response = await apiGet(`/jobs/${jobId}/applications`, { params });
    return response.data;
  }

  async getApplicationStats(jobId) {
    const response = await apiGet(`/jobs/${jobId}/application-stats`);
    return response.data;
  }
}

// Create and export a singleton instance
const jobService = new JobService();
export default jobService;
