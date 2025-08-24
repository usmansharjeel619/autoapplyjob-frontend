// src/context/AuthContext.js
import React, { createContext, useContext, useEffect, useReducer } from "react";
import authService from "../services/auth.service";
import userService from "../services/user.service";
import { STORAGE_KEYS } from "../utils/constants";
import {
  getStorageItem,
  setStorageItem,
  removeStorageItem,
} from "../utils/helpers";

const AuthContext = createContext();

const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

const authReducer = (state, action) => {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    case "SET_USER":
      return {
        ...state,
        user: action.payload,
        isAuthenticated: !!action.payload,
        isLoading: false,
        error: null,
      };
    case "SET_ERROR":
      return { ...state, error: action.payload, isLoading: false };
    case "LOGOUT":
      return { ...initialState, isLoading: false };
    case "UPDATE_USER":
      return { ...state, user: { ...state.user, ...action.payload } };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Initialize authentication state
  useEffect(() => {
    const initializeAuth = async () => {
      console.log("🔄 AuthProvider - Initializing authentication...");

      try {
        const token = getStorageItem(STORAGE_KEYS.AUTH_TOKEN);
        console.log("🔑 AuthProvider - Token found:", !!token);

        if (!token) {
          console.log(
            "❌ AuthProvider - No token found, user not authenticated"
          );
          dispatch({ type: "SET_LOADING", payload: false });
          return;
        }

        // Verify token and get user data
        console.log("🔍 AuthProvider - Verifying token...");
        const isValidToken = await authService.verifyToken(token);

        if (!isValidToken) {
          console.log("❌ AuthProvider - Token invalid, clearing auth data");
          clearAuthData();
          dispatch({ type: "LOGOUT" });
          return;
        }

        console.log("✅ AuthProvider - Token valid, fetching user profile...");

        // Fetch fresh user data from server
        const userResponse = await userService.getProfile();
        const userData = userResponse.data.user;

        console.log("👤 AuthProvider - User data loaded:", {
          id: userData._id,
          email: userData.email,
          isEmailVerified: userData.isEmailVerified,
          onboardingCompleted: userData.onboardingCompleted,
          userType: userData.userType,
        });

        // Save user data to localStorage
        setStorageItem(STORAGE_KEYS.USER_DATA, userData);

        // Update context state
        dispatch({ type: "SET_USER", payload: userData });
      } catch (error) {
        console.error("❌ AuthProvider - Initialization failed:", error);

        // If we get a 401, clear everything
        if (error.response?.status === 401) {
          console.log("🔄 AuthProvider - 401 error, clearing auth data");
          clearAuthData();
        }

        dispatch({ type: "SET_ERROR", payload: error.message });
        dispatch({ type: "LOGOUT" });
      }
    };

    initializeAuth();
  }, []);

  const clearAuthData = () => {
    removeStorageItem(STORAGE_KEYS.AUTH_TOKEN);
    removeStorageItem(STORAGE_KEYS.REFRESH_TOKEN);
    removeStorageItem(STORAGE_KEYS.USER_DATA);
    localStorage.removeItem("onboarding_progress");
    sessionStorage.clear();
  };

  const login = async (credentials) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      console.log("🔐 AuthProvider - Attempting login...");

      const response = await authService.login(credentials);
      const { user, token, refreshToken } = response;

      clearAuthData();
      console.log("✅ AuthProvider - Login successful:", {
        id: user._id,
        email: user.email,
        isEmailVerified: user.isEmailVerified,
      });

      // Store tokens and user data
      setStorageItem(STORAGE_KEYS.AUTH_TOKEN, token);
      setStorageItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
      setStorageItem(STORAGE_KEYS.USER_DATA, user);

      dispatch({ type: "SET_USER", payload: user });
      return { user, token };
    } catch (error) {
      console.error("❌ AuthProvider - Login failed:", error);
      dispatch({ type: "SET_ERROR", payload: error.message });
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      console.log("📝 AuthProvider - Attempting registration...");

      const response = await authService.register(userData);
      const { user, token, refreshToken } = response;

      console.log("✅ AuthProvider - Registration successful:", {
        id: user._id,
        email: user.email,
        isEmailVerified: user.isEmailVerified,
      });

      clearAuthData();
      // Store tokens and user data
      setStorageItem(STORAGE_KEYS.AUTH_TOKEN, token);
      setStorageItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
      setStorageItem(STORAGE_KEYS.USER_DATA, user);

      dispatch({ type: "SET_USER", payload: user });
      return { user, token };
    } catch (error) {
      console.error("❌ AuthProvider - Registration failed:", error);
      dispatch({ type: "SET_ERROR", payload: error.message });
      throw error;
    }
  };

  const logout = async () => {
    try {
      console.log("🔐 AuthProvider - Logging out...");
      await authService.logout();

      // Clear ALL auth data including onboarding progress
      clearAuthData();

      // Also clear any onboarding progress
      localStorage.removeItem("onboardingProgress"); // if you're storing it
      sessionStorage.clear(); // Clear everything in session storage

      dispatch({ type: "LOGOUT" });
      console.log("✅ AuthProvider - Logout successful");
    } catch (error) {
      console.error("❌ AuthProvider - Logout error:", error);
      clearAuthData();
      sessionStorage.clear(); // Clear even on error
      dispatch({ type: "LOGOUT" });
    }
  };

  const updateUser = async (userData) => {
    try {
      console.log("👤 AuthProvider - Updating user data:", userData);

      // Update local state immediately for better UX
      const updatedUser = { ...state.user, ...userData };
      dispatch({ type: "UPDATE_USER", payload: userData });

      // Update localStorage
      setStorageItem(STORAGE_KEYS.USER_DATA, updatedUser);

      // If this is a significant update, sync with server
      if (userData.onboardingCompleted || userData.isEmailVerified) {
        try {
          const response = await userService.updateProfile(userData);
          const serverUser = response.data.user;

          console.log("✅ AuthProvider - User updated on server:", serverUser);

          // Update with server response
          dispatch({ type: "SET_USER", payload: serverUser });
          setStorageItem(STORAGE_KEYS.USER_DATA, serverUser);
        } catch (error) {
          console.warn(
            "⚠️ AuthProvider - Server update failed, keeping local changes:",
            error
          );
        }
      }

      return updatedUser;
    } catch (error) {
      console.error("❌ AuthProvider - Update user failed:", error);
      throw error;
    }
  };

  const refreshUserData = async () => {
    try {
      console.log("🔄 AuthProvider - Refreshing user data...");

      const response = await userService.getProfile();
      const userData = response.data.user;

      console.log("✅ AuthProvider - User data refreshed:", userData);

      setStorageItem(STORAGE_KEYS.USER_DATA, userData);
      dispatch({ type: "SET_USER", payload: userData });

      return userData;
    } catch (error) {
      console.error("❌ AuthProvider - Refresh user data failed:", error);
      throw error;
    }
  };

  const isAdmin = () => {
    return state.user?.userType === "admin";
  };

  const getUserDisplayName = () => {
    return state.user?.name || state.user?.email || "User";
  };

  const value = {
    ...state,
    login,
    register,
    logout,
    updateUser,
    refreshUserData,
    isAdmin,
    getUserDisplayName,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
