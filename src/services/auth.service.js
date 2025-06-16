import { apiPost, apiGet, apiPut, apiPatch, apiDelete } from "./api";
class AuthService {
  // Login with email and password
  async login(credentials) {
    const response = await apiPost("/auth/login", credentials);
    return response;
  }

  // Register new user
  async register(userData) {
    const response = await apiPost("/auth/register", userData);
    return response;
  }

  // Logout user
  async logout() {
    try {
      await apiPost("/auth/logout");
    } catch (error) {
      // Continue with logout even if API call fails
      console.error("Logout API call failed:", error);
    }
  }

  // Google OAuth login
  async googleLogin(googleToken) {
    const response = await apiPost("/auth/google", { token: googleToken });
    return response;
  }

  // Verify if token is still valid
  async verifyToken(token) {
    try {
      const response = await apiGet("/auth/verify", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.status === 200;
    } catch (error) {
      return false;
    }
  }

  // Refresh access token
  async refreshToken(refreshToken) {
    const response = await apiPost("/auth/refresh", { refreshToken });
    return response;
  }

  // Request password reset
  async requestPasswordReset(email) {
    const response = await apiPost("/auth/forgot-password", { email });
    return response;
  }

  // Reset password with token
  async resetPassword(token, newPassword) {
    const response = await apiPost("/auth/reset-password", {
      token,
      password: newPassword,
    });
    return response;
  }

  // Change password (when logged in)
  async changePassword(currentPassword, newPassword) {
    const response = await apiPost("/auth/change-password", {
      currentPassword,
      newPassword,
    });
    return response;
  }

  // Get current user profile
  async getProfile() {
    const response = await apiGet("/auth/profile");
    return response;
  }

  // Update user profile
  async updateProfile(profileData) {
    const response = await apiPut("/auth/profile", profileData);
    return response;
  }

  // Update specific profile fields
  async updateProfileField(field, value) {
    const response = await apiPatch("/auth/profile", { [field]: value });
    return response;
  }

  // Upload profile picture
  async uploadProfilePicture(file) {
    const formData = new FormData();
    formData.append("profilePicture", file);

    const response = await apiPost("/auth/profile/picture", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response;
  }

  // Delete profile picture
  async deleteProfilePicture() {
    const response = await apiDelete("/auth/profile/picture");
    return response;
  }

  // Update email address (requires verification)
  async updateEmail(newEmail, password) {
    const response = await apiPost("/auth/update-email", {
      newEmail,
      password,
    });
    return response;
  }

  // Verify new email address
  async verifyEmailUpdate(token) {
    const response = await apiPost("/auth/verify-email-update", { token });
    return response;
  }

  // Enable two-factor authentication
  async enableTwoFactor() {
    const response = await apiPost("/auth/2fa/enable");
    return response;
  }

  // Disable two-factor authentication
  async disableTwoFactor(password) {
    const response = await apiPost("/auth/2fa/disable", { password });
    return response;
  }

  // Verify two-factor authentication code
  async verifyTwoFactor(code) {
    const response = await apiPost("/auth/2fa/verify", { code });
    return response;
  }

  // Get user's active sessions
  async getActiveSessions() {
    const response = await apiGet("/auth/sessions");
    return response;
  }

  // Revoke a specific session
  async revokeSession(sessionId) {
    const response = await apiDelete(`/auth/sessions/${sessionId}`);
    return response;
  }

  // Revoke all sessions except current
  async revokeAllSessions() {
    const response = await apiPost("/auth/sessions/revoke-all");
    return response;
  }

  // Delete user account
  async deleteAccount(password) {
    const response = await apiPost("/auth/delete-account", { password });
    return response;
  }

  // Check if email is available
  async checkEmailAvailability(email) {
    const response = await apiPost("/auth/check-email", { email });
    return response;
  }

  // Resend email verification
  async resendEmailVerification() {
    const response = await apiPost("/auth/resend-verification");
    return response;
  }

  // Verify email address
  async verifyEmail(token) {
    const response = await apiPost("/auth/verify-email", { token });
    return response;
  }

  // Get user permissions
  async getUserPermissions() {
    const response = await apiGet("/auth/permissions");
    return response;
  }

  // Update user preferences
  async updatePreferences(preferences) {
    const response = await apiPut("/auth/preferences", preferences);
    return response;
  }

  // Get user preferences
  async getPreferences() {
    const response = await apiGet("/auth/preferences");
    return response;
  }

  // Export user data (GDPR compliance)
  async exportUserData() {
    const response = await apiGet("/auth/export-data");
    return response;
  }
}

// Create and export a singleton instance
const authService = new AuthService();
export default authService;
