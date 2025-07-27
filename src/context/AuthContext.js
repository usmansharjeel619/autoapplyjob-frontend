import React, { createContext, useContext, useReducer, useEffect } from "react";
import authService from "../services/auth.service";
import userService from "../services/user.service";
import { STORAGE_KEYS } from "../utils/constants";
import {
  getStorageItem,
  setStorageItem,
  removeStorageItem,
} from "../utils/helpers";

const AuthContext = createContext();

const authReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN_START":
      return { ...state, loading: true, error: null };

    case "LOGIN_SUCCESS":
      return {
        ...state,
        loading: false,
        isAuthenticated: true,
        user: action.payload.user,
        token: action.payload.token,
        error: null,
      };

    case "LOGIN_FAILURE":
      return {
        ...state,
        loading: false,
        isAuthenticated: false,
        user: null,
        token: null,
        error: action.payload,
      };

    case "LOGOUT":
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        token: null,
        loading: false,
        error: null,
      };

    case "UPDATE_USER":
      return {
        ...state,
        user: { ...state.user, ...action.payload },
      };

    case "SET_LOADING":
      return { ...state, loading: action.payload };

    default:
      return state;
  }
};

const initialState = {
  isAuthenticated: false,
  user: null,
  token: null,
  loading: true,
  error: null,
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Initialize auth state from storage
  useEffect(() => {
    const initializeAuth = async () => {
      const token = getStorageItem(STORAGE_KEYS.AUTH_TOKEN);
      const userData = getStorageItem(STORAGE_KEYS.USER_DATA);

      if (token && userData) {
        try {
          // Verify token is still valid
          const isValid = await authService.verifyToken(token);

          if (isValid) {
            // Get fresh user data
            const freshUserData = await userService.getProfile();

            dispatch({
              type: "LOGIN_SUCCESS",
              payload: {
                user: freshUserData,
                token,
              },
            });
          } else {
            // Token expired, clear storage
            clearAuthData();
          }
        } catch (error) {
          console.error("Auth initialization error:", error);
          clearAuthData();
        }
      }

      dispatch({ type: "SET_LOADING", payload: false });
    };

    initializeAuth();
  }, []);

  const clearAuthData = () => {
    removeStorageItem(STORAGE_KEYS.AUTH_TOKEN);
    removeStorageItem(STORAGE_KEYS.REFRESH_TOKEN);
    removeStorageItem(STORAGE_KEYS.USER_DATA);
    dispatch({ type: "LOGOUT" });
  };

  const login = async (credentials) => {
    dispatch({ type: "LOGIN_START" });

    try {
      const response = await authService.login(credentials);
      const { user, token, refreshToken } = response;

      // Store auth data
      setStorageItem(STORAGE_KEYS.AUTH_TOKEN, token);
      setStorageItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
      setStorageItem(STORAGE_KEYS.USER_DATA, user);

      dispatch({
        type: "LOGIN_SUCCESS",
        payload: { user, token },
      });

      return response;
    } catch (error) {
      dispatch({
        type: "LOGIN_FAILURE",
        payload: error.response?.data?.message || "Login failed",
      });
      throw error;
    }
  };

  const register = async (userData) => {
    dispatch({ type: "LOGIN_START" });

    try {
      const response = await authService.register(userData);
      const { user, token, refreshToken } = response;

      // Store auth data
      setStorageItem(STORAGE_KEYS.AUTH_TOKEN, token);
      setStorageItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
      setStorageItem(STORAGE_KEYS.USER_DATA, user);

      dispatch({
        type: "LOGIN_SUCCESS",
        payload: { user, token },
      });

      return response;
    } catch (error) {
      dispatch({
        type: "LOGIN_FAILURE",
        payload: error.response?.data?.message || "Registration failed",
      });
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      clearAuthData();
    }
  };

  const updateUser = (userData) => {
    dispatch({ type: "UPDATE_USER", payload: userData });

    // Update storage
    const updatedUser = { ...state.user, ...userData };
    setStorageItem(STORAGE_KEYS.USER_DATA, updatedUser);
  };

  // Helper function to get user display name
  const getUserDisplayName = () => {
    if (!state.user) return "Guest";

    // Try name first, then email username, then fallback
    if (state.user.name) {
      return state.user.name;
    }

    if (state.user.email) {
      // Extract username from email (part before @)
      return state.user.email.split("@")[0];
    }

    return "User";
  };

  // Helper function to check if user is admin
  const isAdmin = () => {
    return state.user?.userType === "admin";
  };

  const value = {
    ...state,
    login,
    register,
    logout,
    updateUser,
    getUserDisplayName,
    isAdmin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
