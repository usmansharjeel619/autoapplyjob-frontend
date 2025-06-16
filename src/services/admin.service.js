import { apiGet, apiPost, apiPut, apiPatch, apiDelete } from "./api";

class AdminService {
  // Dashboard & Analytics
  async getDashboardStats() {
    const response = await apiGet("/admin/dashboard/stats");
    return response.data;
  }

  async getAnalytics(period = "30d") {
    const response = await apiGet(`/admin/analytics?period=${period}`);
    return response.data;
  }

  async getRevenueAnalytics(period = "30d") {
    const response = await apiGet(`/admin/analytics/revenue?period=${period}`);
    return response.data;
  }

  async getUserGrowthAnalytics(period = "30d") {
    const response = await apiGet(
      `/admin/analytics/user-growth?period=${period}`
    );
    return response.data;
  }

  // User Management
  async getAllUsers(params = {}) {
    const response = await apiGet("/admin/users", { params });
    return response.data;
  }

  async getUser(userId) {
    const response = await apiGet(`/admin/users/${userId}`);
    return response.data;
  }

  async updateUser(userId, userData) {
    const response = await apiPut(`/admin/users/${userId}`, userData);
    return response.data;
  }

  async deactivateUser(userId) {
    const response = await apiPatch(`/admin/users/${userId}/deactivate`);
    return response.data;
  }

  async reactivateUser(userId) {
    const response = await apiPatch(`/admin/users/${userId}/reactivate`);
    return response.data;
  }

  async deleteUser(userId) {
    const response = await apiDelete(`/admin/users/${userId}`);
    return response.data;
  }

  async getUserStats() {
    const response = await apiGet("/admin/users/stats");
    return response.data;
  }

  async searchUsers(query, filters = {}) {
    const response = await apiGet("/admin/users/search", {
      params: { q: query, ...filters },
    });
    return response.data;
  }

  // Applicant Management
  async getAllApplicants(params = {}) {
    const response = await apiGet("/admin/applicants", { params });
    return response.data;
  }

  async getApplicant(applicantId) {
    const response = await apiGet(`/admin/applicants/${applicantId}`);
    return response.data;
  }

  async getApplicantProfile(applicantId) {
    const response = await apiGet(`/admin/applicants/${applicantId}/profile`);
    return response.data;
  }

  async getApplicantJobs(applicantId, params = {}) {
    const response = await apiGet(`/admin/applicants/${applicantId}/jobs`, {
      params,
    });
    return response.data;
  }

  async updateApplicantStatus(applicantId, status) {
    const response = await apiPatch(`/admin/applicants/${applicantId}/status`, {
      status,
    });
    return response.data;
  }

  async addApplicantNote(applicantId, note) {
    const response = await apiPost(`/admin/applicants/${applicantId}/notes`, {
      note,
    });
    return response.data;
  }

  async getApplicantNotes(applicantId) {
    const response = await apiGet(`/admin/applicants/${applicantId}/notes`);
    return response.data;
  }

  async searchApplicants(query, filters = {}) {
    const response = await apiGet("/admin/applicants/search", {
      params: { q: query, ...filters },
    });
    return response.data;
  }

  // Job Application Management
  async getAllApplications(params = {}) {
    const response = await apiGet("/admin/applications", { params });
    return response.data;
  }

  async getApplication(applicationId) {
    const response = await apiGet(`/admin/applications/${applicationId}`);
    return response.data;
  }

  async updateApplicationStatus(applicationId, status) {
    const response = await apiPatch(
      `/admin/applications/${applicationId}/status`,
      { status }
    );
    return response.data;
  }

  async bulkUpdateApplications(applicationIds, updates) {
    const response = await apiPatch("/admin/applications/bulk-update", {
      applicationIds,
      updates,
    });
    return response.data;
  }

  async applyToJob(applicationData) {
    const response = await apiPost(
      "/admin/applications/apply",
      applicationData
    );
    return response.data;
  }

  async withdrawApplication(applicationId, reason) {
    const response = await apiPost(
      `/admin/applications/${applicationId}/withdraw`,
      { reason }
    );
    return response.data;
  }

  async getApplicationStats() {
    const response = await apiGet("/admin/applications/stats");
    return response.data;
  }

  async exportApplications(params = {}) {
    const response = await apiGet("/admin/applications/export", {
      params,
      responseType: "blob",
    });
    return response.data;
  }

  // Job Management
  async getAllJobs(params = {}) {
    const response = await apiGet("/admin/jobs", { params });
    return response.data;
  }

  async getJob(jobId) {
    const response = await apiGet(`/admin/jobs/${jobId}`);
    return response.data;
  }

  async createJob(jobData) {
    const response = await apiPost("/admin/jobs", jobData);
    return response.data;
  }

  async updateJob(jobId, jobData) {
    const response = await apiPut(`/admin/jobs/${jobId}`, jobData);
    return response.data;
  }

  async deleteJob(jobId) {
    const response = await apiDelete(`/admin/jobs/${jobId}`);
    return response.data;
  }

  async activateJob(jobId) {
    const response = await apiPatch(`/admin/jobs/${jobId}/activate`);
    return response.data;
  }

  async deactivateJob(jobId) {
    const response = await apiPatch(`/admin/jobs/${jobId}/deactivate`);
    return response.data;
  }

  async getJobStats() {
    const response = await apiGet("/admin/jobs/stats");
    return response.data;
  }

  async bulkImportJobs(source, params = {}) {
    const response = await apiPost("/admin/jobs/bulk-import", {
      source,
      ...params,
    });
    return response.data;
  }

  // Company Management
  async getAllCompanies(params = {}) {
    const response = await apiGet("/admin/companies", { params });
    return response.data;
  }

  async getCompany(companyId) {
    const response = await apiGet(`/admin/companies/${companyId}`);
    return response.data;
  }

  async createCompany(companyData) {
    const response = await apiPost("/admin/companies", companyData);
    return response.data;
  }

  async updateCompany(companyId, companyData) {
    const response = await apiPut(`/admin/companies/${companyId}`, companyData);
    return response.data;
  }

  async deleteCompany(companyId) {
    const response = await apiDelete(`/admin/companies/${companyId}`);
    return response.data;
  }

  // System Settings
  async getSystemSettings() {
    const response = await apiGet("/admin/settings/system");
    return response.data;
  }

  async updateSystemSettings(settings) {
    const response = await apiPut("/admin/settings/system", settings);
    return response.data;
  }

  async getEmailSettings() {
    const response = await apiGet("/admin/settings/email");
    return response.data;
  }

  async updateEmailSettings(settings) {
    const response = await apiPut("/admin/settings/email", settings);
    return response.data;
  }

  async getNotificationSettings() {
    const response = await apiGet("/admin/settings/notifications");
    return response.data;
  }

  async updateNotificationSettings(settings) {
    const response = await apiPut("/admin/settings/notifications", settings);
    return response.data;
  }

  // Audit Logs
  async getAuditLogs(params = {}) {
    const response = await apiGet("/admin/audit-logs", { params });
    return response.data;
  }

  async getAuditLog(logId) {
    const response = await apiGet(`/admin/audit-logs/${logId}`);
    return response.data;
  }

  // Reports
  async generateReport(reportType, params = {}) {
    const response = await apiPost("/admin/reports/generate", {
      reportType,
      ...params,
    });
    return response.data;
  }

  async getReports(params = {}) {
    const response = await apiGet("/admin/reports", { params });
    return response.data;
  }

  async downloadReport(reportId) {
    const response = await apiGet(`/admin/reports/${reportId}/download`, {
      responseType: "blob",
    });
    return response.data;
  }

  async deleteReport(reportId) {
    const response = await apiDelete(`/admin/reports/${reportId}`);
    return response.data;
  }

  // Notifications
  async sendNotification(notificationData) {
    const response = await apiPost(
      "/admin/notifications/send",
      notificationData
    );
    return response.data;
  }

  async sendBulkNotification(recipients, message) {
    const response = await apiPost("/admin/notifications/bulk-send", {
      recipients,
      message,
    });
    return response.data;
  }

  async getNotificationTemplates() {
    const response = await apiGet("/admin/notifications/templates");
    return response.data;
  }

  async createNotificationTemplate(template) {
    const response = await apiPost("/admin/notifications/templates", template);
    return response.data;
  }

  async updateNotificationTemplate(templateId, template) {
    const response = await apiPut(
      `/admin/notifications/templates/${templateId}`,
      template
    );
    return response.data;
  }

  async deleteNotificationTemplate(templateId) {
    const response = await apiDelete(
      `/admin/notifications/templates/${templateId}`
    );
    return response.data;
  }

  // System Health
  async getSystemHealth() {
    const response = await apiGet("/admin/system/health");
    return response.data;
  }

  async getSystemMetrics() {
    const response = await apiGet("/admin/system/metrics");
    return response.data;
  }

  async getErrorLogs(params = {}) {
    const response = await apiGet("/admin/system/error-logs", { params });
    return response.data;
  }

  // Backup & Restore
  async createBackup() {
    const response = await apiPost("/admin/system/backup");
    return response.data;
  }

  async getBackups() {
    const response = await apiGet("/admin/system/backups");
    return response.data;
  }

  async downloadBackup(backupId) {
    const response = await apiGet(
      `/admin/system/backups/${backupId}/download`,
      {
        responseType: "blob",
      }
    );
    return response.data;
  }

  async restoreBackup(backupId) {
    const response = await apiPost(`/admin/system/backups/${backupId}/restore`);
    return response.data;
  }

  async deleteBackup(backupId) {
    const response = await apiDelete(`/admin/system/backups/${backupId}`);
    return response.data;
  }
}

// Create and export a singleton instance
const adminService = new AdminService();
export default adminService;
