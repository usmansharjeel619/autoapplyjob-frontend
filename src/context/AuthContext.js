import React, { createContext, useContext, useReducer, useEffect } from "react";
import {
  getStorageItem,
  setStorageItem,
  removeStorageItem,
} from "../utils/helpers";
import { STORAGE_KEYS, USER_TYPES } from "../utils/constants";
import authService from "../services/auth.service";

// Initial state
const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

// Action types
const AUTH_ACTIONS = {
  LOGIN_START: "LOGIN_START",
  LOGIN_SUCCESS: "LOGIN_SUCCESS",
  LOGIN_FAILURE: "LOGIN_FAILURE",
  LOGOUT: "LOGOUT",
  REGISTER_START: "REGISTER_START",
  REGISTER_SUCCESS: "REGISTER_SUCCESS",
  REGISTER_FAILURE: "REGISTER_FAILURE",
  UPDATE_USER: "UPDATE_USER",
  SET_LOADING: "SET_LOADING",
  CLEAR_ERROR: "CLEAR_ERROR",
};

// Reducer
const authReducer = (state, action) => {
  switch (action.type) {
    case AUTH_ACTIONS.LOGIN_START:
    case AUTH_ACTIONS.REGISTER_START:
      return {
        ...state,
        isLoading: true,
        error: null,
      };

    case AUTH_ACTIONS.LOGIN_SUCCESS:
    case AUTH_ACTIONS.REGISTER_SUCCESS:
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };

    case AUTH_ACTIONS.LOGIN_FAILURE:
    case AUTH_ACTIONS.REGISTER_FAILURE:
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload,
      };

    case AUTH_ACTIONS.LOGOUT:
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      };

    case AUTH_ACTIONS.UPDATE_USER:
      return {
        ...state,
        user: { ...state.user, ...action.payload },
      };

    case AUTH_ACTIONS.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload,
      };

    case AUTH_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null,
      };

    default:
      return state;
  }
};

// Create context
const AuthContext = createContext();

// Provider component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Initialize auth state from localStorage
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = getStorageItem(STORAGE_KEYS.AUTH_TOKEN);
        const userData = getStorageItem(STORAGE_KEYS.USER_DATA);

        if (token && userData) {
          // Verify token is still valid
          const isValid = await authService.verifyToken(token);

          if (isValid) {
            dispatch({
              type: AUTH_ACTIONS.LOGIN_SUCCESS,
              payload: { user: userData, token },
            });
          } else {
            // Token is invalid, clear storage
            removeStorageItem(STORAGE_KEYS.AUTH_TOKEN);
            removeStorageItem(STORAGE_KEYS.USER_DATA);
          }
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
        removeStorageItem(STORAGE_KEYS.AUTH_TOKEN);
        removeStorageItem(STORAGE_KEYS.USER_DATA);
      } finally {
        dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
      }
    };

    initializeAuth();
  }, []);

  // Login function
  const login = async (credentials) => {
    dispatch({ type: AUTH_ACTIONS.LOGIN_START });

    try {
      const response = await authService.login(credentials);
      const { user, token } = response.data;

      // Store in localStorage
      setStorageItem(STORAGE_KEYS.AUTH_TOKEN, token);
      setStorageItem(STORAGE_KEYS.USER_DATA, user);

      dispatch({
        type: AUTH_ACTIONS.LOGIN_SUCCESS,
        payload: { user, token },
      });

      return { success: true, user };
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Login failed";
      dispatch({
        type: AUTH_ACTIONS.LOGIN_FAILURE,
        payload: errorMessage,
      });
      return { success: false, error: errorMessage };
    }
  };

  // Register function
  const register = async (userData) => {
    dispatch({ type: AUTH_ACTIONS.REGISTER_START });

    try {
      const response = await authService.register(userData);
      const { user, token } = response.data;

      // Store in localStorage
      setStorageItem(STORAGE_KEYS.AUTH_TOKEN, token);
      setStorageItem(STORAGE_KEYS.USER_DATA, user);

      dispatch({
        type: AUTH_ACTIONS.REGISTER_SUCCESS,
        payload: { user, token },
      });

      return { success: true, user };
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Registration failed";
      dispatch({
        type: AUTH_ACTIONS.REGISTER_FAILURE,
        payload: errorMessage,
      });
      return { success: false, error: errorMessage };
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Clear storage regardless of API call result
      removeStorageItem(STORAGE_KEYS.AUTH_TOKEN);
      removeStorageItem(STORAGE_KEYS.USER_DATA);
      removeStorageItem(STORAGE_KEYS.ONBOARDING_PROGRESS);

      dispatch({ type: AUTH_ACTIONS.LOGOUT });
    }
  };

  // Update user function
  const updateUser = async (userData) => {
    try {
      const response = await authService.updateProfile(userData);
      const updatedUser = response.data;

      // Update localStorage
      setStorageItem(STORAGE_KEYS.USER_DATA, updatedUser);

      dispatch({
        type: AUTH_ACTIONS.UPDATE_USER,
        payload: updatedUser,
      });

      return { success: true, user: updatedUser };
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Update failed";
      return { success: false, error: errorMessage };
    }
  };

  // Clear error function
  const clearError = () => {
    dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });
  };

  // Check if user is admin
  const isAdmin = () => {
    return state.user?.userType === USER_TYPES.ADMIN;
  };

  // Check if user has completed onboarding
  const hasCompletedOnboarding = () => {
    return state.user?.onboardingCompleted || false;
  };

  // Get user's full name
  const getUserDisplayName = () => {
    if (!state.user) return "";
    return state.user.name || state.user.email || "User";
  };

  const value = {
    // State
    ...state,

    // Actions
    login,
    register,
    logout,
    updateUser,
    clearError,

    // Helpers
    isAdmin,
    hasCompletedOnboarding,
    getUserDisplayName,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};

export default AuthContext;
