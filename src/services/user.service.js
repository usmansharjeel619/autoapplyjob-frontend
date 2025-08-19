import {
  apiGet,
  apiPost,
  apiPut,
  apiPatch,
  apiDelete,
  apiPostFile,
} from "./api";
import { API_ENDPOINTS } from "../utils/constants";

class UserService {
  // Profile Management
  async getProfile() {
    try {
      const response = await apiGet(API_ENDPOINTS.USER.PROFILE);
      console.log("📋 UserService - Profile response:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ UserService - Get profile failed:", error);

      // If unauthorized, the API interceptor will handle token refresh
      // If refresh fails, user will be logged out automatically
      throw error;
    }
  }

  async updateProfile(profileData) {
    try {
      console.log("📝 UserService - Updating profile:", profileData);
      const response = await apiPut(API_ENDPOINTS.USER.PROFILE, profileData);
      return response.data;
    } catch (error) {
      console.error("❌ UserService - Update profile failed:", error);
      throw error;
    }
  }

  async uploadResume(file, onProgress = null) {
    try {
      const response = await apiPostFile(
        API_ENDPOINTS.USER.UPLOAD_RESUME,
        file,
        {},
        onProgress
      );
      return response.data;
    } catch (error) {
      console.error("❌ UserService - Upload resume failed:", error);
      throw error;
    }
  }

  // Dashboard
  async getDashboardStats() {
    try {
      const response = await apiGet(API_ENDPOINTS.USER.DASHBOARD_STATS);
      return response.data;
    } catch (error) {
      console.error("❌ UserService - Get dashboard stats failed:", error);
      throw error;
    }
  }

  // Job Management
  async getJobs(params = {}) {
    try {
      const response = await apiGet(API_ENDPOINTS.USER.GET_JOBS, { params });
      return response.data;
    } catch (error) {
      console.error("❌ UserService - Get jobs failed:", error);
      throw error;
    }
  }

  async getSavedJobs(params = {}) {
    const response = await apiGet(API_ENDPOINTS.USER.SAVED_JOBS, { params });
    return response.data;
  }

  async saveJob(jobId) {
    const response = await apiPost(`${API_ENDPOINTS.USER.SAVED_JOBS}/${jobId}`);
    return response.data;
  }

  async unsaveJob(jobId) {
    const response = await apiDelete(
      `${API_ENDPOINTS.USER.SAVED_JOBS}/${jobId}`
    );
    return response.data;
  }

  // Application History
  async getApplicationHistory(params = {}) {
    try {
      const response = await apiGet(API_ENDPOINTS.USER.APPLICATION_HISTORY, {
        params,
      });
      return response.data;
    } catch (error) {
      console.error("❌ UserService - Get application history failed:", error);
      throw error;
    }
  }

  // Settings
  async getSettings() {
    try {
      const response = await apiGet(API_ENDPOINTS.USER.SETTINGS);
      return response.data;
    } catch (error) {
      console.error("❌ UserService - Get settings failed:", error);
      throw error;
    }
  }

  async updateSettings(settings) {
    try {
      const response = await apiPut(API_ENDPOINTS.USER.SETTINGS, settings);
      return response.data;
    } catch (error) {
      console.error("❌ UserService - Update settings failed:", error);
      throw error;
    }
  }

  // Onboarding
  async completeOnboardingStep(step, data) {
    try {
      const response = await apiPost(
        `${API_ENDPOINTS.USER.ONBOARDING}/${step}`,
        data
      );
      return response.data;
    } catch (error) {
      console.error("❌ UserService - Complete onboarding step failed:", error);
      throw error;
    }
  }

  async getOnboardingProgress() {
    try {
      const response = await apiGet(
        `${API_ENDPOINTS.USER.ONBOARDING}/progress`
      );
      return response.data;
    } catch (error) {
      console.error("❌ UserService - Get onboarding progress failed:", error);
      throw error;
    }
  }
}

export default new UserService();
