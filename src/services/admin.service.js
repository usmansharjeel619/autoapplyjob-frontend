// src/services/admin.service.js
import { apiGet, apiPost, apiPut, apiPatch, apiDelete } from "./api";
import { API_ENDPOINTS } from "../utils/constants";

class AdminService {
  // Dashboard & Analytics
  async getDashboardStats() {
    try {
      const response = await apiGet(API_ENDPOINTS.ADMIN.DASHBOARD);
      return response.data;
    } catch (error) {
      console.warn(
        "Failed to fetch dashboard stats, using fallback data:",
        error
      );
      // Return fallback data to prevent UI crashes
      return {
        stats: {
          totalUsers: 0,
          activeApplications: 0,
          pendingReviews: 0,
          successRate: 0,
          jobsScraped: 0,
          averageMatchScore: 0,
        },
        recentApplications: [],
        topPerformingJobs: [],
        userActivity: [],
        systemHealth: {
          scrapingStatus: "inactive",
          lastScrapingRun: null,
          totalJobsScraped: 0,
        },
      };
    }
  }

  async getAnalytics(period = "30d") {
    try {
      const response = await apiGet(
        `${API_ENDPOINTS.ADMIN.ANALYTICS}?period=${period}`
      );
      return response.data;
    } catch (error) {
      console.warn("Failed to fetch analytics, using fallback data:", error);
      return {
        kpis: [],
        userGrowth: [],
        applicationTrends: [],
        conversionFunnel: [],
      };
    }
  }

  // User Management
  async getAllUsers(params = {}) {
    try {
      const response = await apiGet(API_ENDPOINTS.ADMIN.USERS, { params });
      return response.data;
    } catch (error) {
      console.warn("Failed to fetch users, using fallback data:", error);
      return {
        users: [],
        pagination: {
          page: 1,
          pageSize: 20,
          total: 0,
          totalPages: 0,
        },
      };
    }
  }

  async getUser(userId) {
    const response = await apiGet(`${API_ENDPOINTS.ADMIN.USERS}/${userId}`);
    return response.data;
  }

  async updateUser(userId, userData) {
    const response = await apiPut(
      `${API_ENDPOINTS.ADMIN.USERS}/${userId}`,
      userData
    );
    return response.data;
  }

  async deactivateUser(userId) {
    const response = await apiPatch(
      `${API_ENDPOINTS.ADMIN.USERS}/${userId}/deactivate`
    );
    return response.data;
  }

  async deleteUser(userId) {
    const response = await apiDelete(`${API_ENDPOINTS.ADMIN.USERS}/${userId}`);
    return response.data;
  }

  // Application Management
  async getAllApplications(params = {}) {
    try {
      const response = await apiGet(API_ENDPOINTS.ADMIN.APPLICATIONS, {
        params,
      });
      return response.data;
    } catch (error) {
      console.warn("Failed to fetch applications, using fallback data:", error);
      return {
        applications: [],
        pagination: {
          page: 1,
          pageSize: 20,
          total: 0,
          totalPages: 0,
        },
      };
    }
  }

  async getApplication(applicationId) {
    const response = await apiGet(
      `${API_ENDPOINTS.ADMIN.APPLICATIONS}/${applicationId}`
    );
    return response.data;
  }

  async updateApplicationStatus(applicationId, status) {
    const response = await apiPatch(
      `${API_ENDPOINTS.ADMIN.APPLICATIONS}/${applicationId}/status`,
      { status }
    );
    return response.data;
  }

  async applyToJobOnBehalf(userId, jobId) {
    const response = await apiPost(
      `${API_ENDPOINTS.ADMIN.APPLICATIONS}/apply`,
      {
        userId,
        jobId,
      }
    );
    return response.data;
  }

  // Job Management (Scraped Jobs)
  async getScrapedJobs(params = {}) {
    try {
      const response = await apiGet(API_ENDPOINTS.ADMIN.JOBS, { params });
      return response.data;
    } catch (error) {
      console.warn("Failed to fetch jobs, using fallback data:", error);
      return {
        jobs: [],
        pagination: {
          page: 1,
          pageSize: 20,
          total: 0,
          totalPages: 0,
        },
      };
    }
  }

  async approveJob(jobId) {
    const response = await apiPatch(
      `${API_ENDPOINTS.ADMIN.JOBS}/${jobId}/approve`
    );
    return response.data;
  }

  async rejectJob(jobId) {
    const response = await apiPatch(
      `${API_ENDPOINTS.ADMIN.JOBS}/${jobId}/reject`
    );
    return response.data;
  }

  // System Settings
  async getSystemSettings() {
    try {
      const response = await apiGet(API_ENDPOINTS.ADMIN.SYSTEM_SETTINGS);
      return response.data;
    } catch (error) {
      console.warn("Failed to fetch system settings, using defaults:", error);
      return {
        settings: {
          scraping: {
            maxJobsPerUser: 100,
            scrapingInterval: 24,
            enabledPlatforms: ["linkedin", "indeed", "glassdoor"],
            autoApproveJobs: false,
          },
          applications: {
            maxApplicationsPerDay: 10,
            autoApplyEnabled: false,
            requireAdminReview: true,
          },
          email: {
            notifications: true,
            dailyDigest: true,
            applicationUpdates: true,
          },
          system: {
            maintenanceMode: false,
            registrationEnabled: true,
            debugMode: false,
          },
        },
      };
    }
  }

  async updateSystemSettings(settings) {
    const response = await apiPut(
      API_ENDPOINTS.ADMIN.SYSTEM_SETTINGS,
      settings
    );
    return response.data;
  }
}

export default new AdminService();
