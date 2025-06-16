// import { apiPost, apiGet, apiPut, apiPatch, apiDelete } from "./api";
// class AuthService {
//   // Login with email and password
//   async login(credentials) {
//     const response = await apiPost("/auth/login", credentials);
//     return response;
//   }

//   // Register new user
//   async register(userData) {
//     const response = await apiPost("/auth/register", userData);
//     return response;
//   }

//   // Logout user
//   async logout() {
//     try {
//       await apiPost("/auth/logout");
//     } catch (error) {
//       // Continue with logout even if API call fails
//       console.error("Logout API call failed:", error);
//     }
//   }

//   // Google OAuth login
//   async googleLogin(googleToken) {
//     const response = await apiPost("/auth/google", { token: googleToken });
//     return response;
//   }

//   // Verify if token is still valid
//   async verifyToken(token) {
//     try {
//       const response = await apiGet("/auth/verify", {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       return response.status === 200;
//     } catch (error) {
//       return false;
//     }
//   }

//   // Refresh access token
//   async refreshToken(refreshToken) {
//     const response = await apiPost("/auth/refresh", { refreshToken });
//     return response;
//   }

//   // Request password reset
//   async requestPasswordReset(email) {
//     const response = await apiPost("/auth/forgot-password", { email });
//     return response;
//   }

//   // Reset password with token
//   async resetPassword(token, newPassword) {
//     const response = await apiPost("/auth/reset-password", {
//       token,
//       password: newPassword,
//     });
//     return response;
//   }

//   // Change password (when logged in)
//   async changePassword(currentPassword, newPassword) {
//     const response = await apiPost("/auth/change-password", {
//       currentPassword,
//       newPassword,
//     });
//     return response;
//   }

//   // Get current user profile
//   async getProfile() {
//     const response = await apiGet("/auth/profile");
//     return response;
//   }

//   // Update user profile
//   async updateProfile(profileData) {
//     const response = await apiPut("/auth/profile", profileData);
//     return response;
//   }

//   // Update specific profile fields
//   async updateProfileField(field, value) {
//     const response = await apiPatch("/auth/profile", { [field]: value });
//     return response;
//   }

//   // Upload profile picture
//   async uploadProfilePicture(file) {
//     const formData = new FormData();
//     formData.append("profilePicture", file);

//     const response = await apiPost("/auth/profile/picture", formData, {
//       headers: {
//         "Content-Type": "multipart/form-data",
//       },
//     });
//     return response;
//   }

//   // Delete profile picture
//   async deleteProfilePicture() {
//     const response = await apiDelete("/auth/profile/picture");
//     return response;
//   }

//   // Update email address (requires verification)
//   async updateEmail(newEmail, password) {
//     const response = await apiPost("/auth/update-email", {
//       newEmail,
//       password,
//     });
//     return response;
//   }

//   // Verify new email address
//   async verifyEmailUpdate(token) {
//     const response = await apiPost("/auth/verify-email-update", { token });
//     return response;
//   }

//   // Enable two-factor authentication
//   async enableTwoFactor() {
//     const response = await apiPost("/auth/2fa/enable");
//     return response;
//   }

//   // Disable two-factor authentication
//   async disableTwoFactor(password) {
//     const response = await apiPost("/auth/2fa/disable", { password });
//     return response;
//   }

//   // Verify two-factor authentication code
//   async verifyTwoFactor(code) {
//     const response = await apiPost("/auth/2fa/verify", { code });
//     return response;
//   }

//   // Get user's active sessions
//   async getActiveSessions() {
//     const response = await apiGet("/auth/sessions");
//     return response;
//   }

//   // Revoke a specific session
//   async revokeSession(sessionId) {
//     const response = await apiDelete(`/auth/sessions/${sessionId}`);
//     return response;
//   }

//   // Revoke all sessions except current
//   async revokeAllSessions() {
//     const response = await apiPost("/auth/sessions/revoke-all");
//     return response;
//   }

//   // Delete user account
//   async deleteAccount(password) {
//     const response = await apiPost("/auth/delete-account", { password });
//     return response;
//   }

//   // Check if email is available
//   async checkEmailAvailability(email) {
//     const response = await apiPost("/auth/check-email", { email });
//     return response;
//   }

//   // Resend email verification
//   async resendEmailVerification() {
//     const response = await apiPost("/auth/resend-verification");
//     return response;
//   }

//   // Verify email address
//   async verifyEmail(token) {
//     const response = await apiPost("/auth/verify-email", { token });
//     return response;
//   }

//   // Get user permissions
//   async getUserPermissions() {
//     const response = await apiGet("/auth/permissions");
//     return response;
//   }

//   // Update user preferences
//   async updatePreferences(preferences) {
//     const response = await apiPut("/auth/preferences", preferences);
//     return response;
//   }

//   // Get user preferences
//   async getPreferences() {
//     const response = await apiGet("/auth/preferences");
//     return response;
//   }

//   // Export user data (GDPR compliance)
//   async exportUserData() {
//     const response = await apiGet("/auth/export-data");
//     return response;
//   }
// }

// // Create and export a singleton instance
// const authService = new AuthService();
// export default authService;

// src/services/auth.service.js
// Mock Authentication Service - No Backend Required

// Mock users database
const MOCK_USERS = {
  // Admin User
  "admin@example.com": {
    id: "admin-001",
    email: "admin@example.com",
    password: "admin123456", // In real app, this would be hashed
    name: "Admin User",
    userType: "admin",
    onboardingCompleted: true,
    profilePicture: null,
    createdAt: "2024-01-01T00:00:00Z",
    lastLogin: new Date().toISOString(),
  },

  // Regular User
  "user@example.com": {
    id: "user-001",
    email: "user@example.com",
    password: "user123456", // In real app, this would be hashed
    name: "John Doe",
    userType: "user",
    onboardingCompleted: true,
    profilePicture: null,
    phone: "+1234567890",
    skills: ["JavaScript", "React", "Node.js"],
    experience: "3 years",
    location: "New York, NY",
    createdAt: "2024-01-01T00:00:00Z",
    lastLogin: new Date().toISOString(),
  },
};

// Generate mock JWT token
const generateMockToken = (user) => {
  const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const payload = btoa(
    JSON.stringify({
      userId: user.id,
      email: user.email,
      userType: user.userType,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60, // 24 hours
    })
  );
  const signature = btoa("mock-signature");
  return `${header}.${payload}.${signature}`;
};

// Simulate API delay
const mockDelay = (ms = 1000) =>
  new Promise((resolve) => setTimeout(resolve, ms));

// Mock API responses
const mockResponse = (data, success = true) => {
  if (success) {
    return Promise.resolve({ data });
  } else {
    return Promise.reject({
      response: {
        data: { message: data.message || "An error occurred" },
      },
    });
  }
};

// Auth Service
const authService = {
  // Login
  async login(credentials) {
    await mockDelay(800); // Simulate network delay

    const { email, password } = credentials;
    const user = MOCK_USERS[email.toLowerCase()];

    if (!user) {
      return mockResponse({ message: "User not found" }, false);
    }

    if (user.password !== password) {
      return mockResponse({ message: "Invalid password" }, false);
    }

    // Update last login
    user.lastLogin = new Date().toISOString();

    // Generate token
    const token = generateMockToken(user);

    // Return user data without password
    const { password: _, ...userWithoutPassword } = user;

    return mockResponse({
      user: userWithoutPassword,
      token,
      message: "Login successful",
    });
  },

  // Register
  async register(userData) {
    await mockDelay(1000);

    const { email, password, name } = userData;

    // Check if user already exists
    if (MOCK_USERS[email.toLowerCase()]) {
      return mockResponse({ message: "User already exists" }, false);
    }

    // Create new user
    const newUser = {
      id: `user-${Date.now()}`,
      email: email.toLowerCase(),
      password, // In real app, this would be hashed
      name,
      userType: "user",
      onboardingCompleted: false,
      profilePicture: null,
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
    };

    // Add to mock database
    MOCK_USERS[email.toLowerCase()] = newUser;

    // Generate token
    const token = generateMockToken(newUser);

    // Return user data without password
    const { password: _, ...userWithoutPassword } = newUser;

    return mockResponse({
      user: userWithoutPassword,
      token,
      message: "Registration successful",
    });
  },

  // Verify Token
  async verifyToken(token) {
    await mockDelay(200);

    try {
      // Simple token validation (in real app, use proper JWT verification)
      const parts = token.split(".");
      if (parts.length !== 3) return false;

      const payload = JSON.parse(atob(parts[1]));
      const currentTime = Math.floor(Date.now() / 1000);

      // Check if token is expired
      if (payload.exp < currentTime) return false;

      // Check if user still exists
      const user = Object.values(MOCK_USERS).find(
        (u) => u.id === payload.userId
      );
      return !!user;
    } catch {
      return false;
    }
  },

  // Update Profile
  async updateProfile(userData) {
    await mockDelay(800);

    const token = localStorage.getItem("auth_token");
    if (!token) {
      return mockResponse({ message: "Not authenticated" }, false);
    }

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const user = Object.values(MOCK_USERS).find(
        (u) => u.id === payload.userId
      );

      if (!user) {
        return mockResponse({ message: "User not found" }, false);
      }

      // Update user data
      Object.assign(user, userData);

      // Return updated user without password
      const { password: _, ...userWithoutPassword } = user;

      // Update localStorage
      MOCK_USERS[user.email] = user;

      return mockResponse({
        user: userWithoutPassword,
        message: "Profile updated successfully",
      });
    } catch {
      return mockResponse({ message: "Invalid token" }, false);
    }
  },

  // Logout
  async logout() {
    await mockDelay(300);
    // In a real app, you might invalidate the token on the server
    return mockResponse({ message: "Logged out successfully" });
  },

  // Change Password
  async changePassword(passwordData) {
    await mockDelay(800);

    const { currentPassword, newPassword } = passwordData;
    const token = localStorage.getItem("auth_token");

    if (!token) {
      return mockResponse({ message: "Not authenticated" }, false);
    }

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const user = Object.values(MOCK_USERS).find(
        (u) => u.id === payload.userId
      );

      if (!user) {
        return mockResponse({ message: "User not found" }, false);
      }

      if (user.password !== currentPassword) {
        return mockResponse(
          { message: "Current password is incorrect" },
          false
        );
      }

      // Update password
      user.password = newPassword;
      MOCK_USERS[user.email] = user;

      return mockResponse({ message: "Password changed successfully" });
    } catch {
      return mockResponse({ message: "Invalid token" }, false);
    }
  },

  // Get Mock Users (for demo purposes)
  getMockUsers() {
    return Object.values(MOCK_USERS).map((user) => {
      const { password: _, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });
  },
};

export default authService;
