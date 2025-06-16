import React, { createContext, useContext, useReducer, useEffect } from "react";
import { getStorageItem, setStorageItem } from "../utils/helpers";
import { STORAGE_KEYS, THEMES, NOTIFICATION_TYPES } from "../utils/constants";

// Initial state
const initialState = {
  theme: THEMES.LIGHT,
  sidebarOpen: true,
  notifications: [],
  onboardingProgress: null,
  loading: false,
  error: null,
};

// Action types
const APP_ACTIONS = {
  SET_THEME: "SET_THEME",
  TOGGLE_SIDEBAR: "TOGGLE_SIDEBAR",
  SET_SIDEBAR_OPEN: "SET_SIDEBAR_OPEN",
  ADD_NOTIFICATION: "ADD_NOTIFICATION",
  REMOVE_NOTIFICATION: "REMOVE_NOTIFICATION",
  CLEAR_NOTIFICATIONS: "CLEAR_NOTIFICATIONS",
  SET_ONBOARDING_PROGRESS: "SET_ONBOARDING_PROGRESS",
  SET_LOADING: "SET_LOADING",
  SET_ERROR: "SET_ERROR",
  CLEAR_ERROR: "CLEAR_ERROR",
};

// Reducer
const appReducer = (state, action) => {
  switch (action.type) {
    case APP_ACTIONS.SET_THEME:
      return {
        ...state,
        theme: action.payload,
      };

    case APP_ACTIONS.TOGGLE_SIDEBAR:
      return {
        ...state,
        sidebarOpen: !state.sidebarOpen,
      };

    case APP_ACTIONS.SET_SIDEBAR_OPEN:
      return {
        ...state,
        sidebarOpen: action.payload,
      };

    case APP_ACTIONS.ADD_NOTIFICATION:
      return {
        ...state,
        notifications: [...state.notifications, action.payload],
      };

    case APP_ACTIONS.REMOVE_NOTIFICATION:
      return {
        ...state,
        notifications: state.notifications.filter(
          (n) => n.id !== action.payload
        ),
      };

    case APP_ACTIONS.CLEAR_NOTIFICATIONS:
      return {
        ...state,
        notifications: [],
      };

    case APP_ACTIONS.SET_ONBOARDING_PROGRESS:
      return {
        ...state,
        onboardingProgress: action.payload,
      };

    case APP_ACTIONS.SET_LOADING:
      return {
        ...state,
        loading: action.payload,
      };

    case APP_ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload,
      };

    case APP_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null,
      };

    default:
      return state;
  }
};

// Create context
const AppContext = createContext();

// Provider component
export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Initialize app state from localStorage
  useEffect(() => {
    const savedTheme = getStorageItem(STORAGE_KEYS.THEME, THEMES.LIGHT);
    const savedOnboardingProgress = getStorageItem(
      STORAGE_KEYS.ONBOARDING_PROGRESS
    );

    dispatch({ type: APP_ACTIONS.SET_THEME, payload: savedTheme });
    if (savedOnboardingProgress) {
      dispatch({
        type: APP_ACTIONS.SET_ONBOARDING_PROGRESS,
        payload: savedOnboardingProgress,
      });
    }
  }, []);

  // Theme functions
  const setTheme = (theme) => {
    setStorageItem(STORAGE_KEYS.THEME, theme);
    dispatch({ type: APP_ACTIONS.SET_THEME, payload: theme });

    // Apply theme to document
    document.documentElement.setAttribute("data-theme", theme);
  };

  const toggleTheme = () => {
    const newTheme = state.theme === THEMES.LIGHT ? THEMES.DARK : THEMES.LIGHT;
    setTheme(newTheme);
  };

  // Sidebar functions
  const toggleSidebar = () => {
    dispatch({ type: APP_ACTIONS.TOGGLE_SIDEBAR });
  };

  const setSidebarOpen = (open) => {
    dispatch({ type: APP_ACTIONS.SET_SIDEBAR_OPEN, payload: open });
  };

  // Notification functions
  const addNotification = (notification) => {
    const id = Date.now().toString();
    const newNotification = {
      id,
      type: NOTIFICATION_TYPES.INFO,
      autoClose: true,
      duration: 5000,
      ...notification,
    };

    dispatch({ type: APP_ACTIONS.ADD_NOTIFICATION, payload: newNotification });

    // Auto-remove notification
    if (newNotification.autoClose) {
      setTimeout(() => {
        removeNotification(id);
      }, newNotification.duration);
    }

    return id;
  };

  const removeNotification = (id) => {
    dispatch({ type: APP_ACTIONS.REMOVE_NOTIFICATION, payload: id });
  };

  const clearNotifications = () => {
    dispatch({ type: APP_ACTIONS.CLEAR_NOTIFICATIONS });
  };

  // Shorthand notification methods
  const showSuccess = (message, options = {}) => {
    return addNotification({
      type: NOTIFICATION_TYPES.SUCCESS,
      message,
      ...options,
    });
  };

  const showError = (message, options = {}) => {
    return addNotification({
      type: NOTIFICATION_TYPES.ERROR,
      message,
      autoClose: false, // Errors should be manually dismissed
      ...options,
    });
  };

  const showWarning = (message, options = {}) => {
    return addNotification({
      type: NOTIFICATION_TYPES.WARNING,
      message,
      ...options,
    });
  };

  const showInfo = (message, options = {}) => {
    return addNotification({
      type: NOTIFICATION_TYPES.INFO,
      message,
      ...options,
    });
  };

  // Onboarding functions
  const setOnboardingProgress = (progress) => {
    setStorageItem(STORAGE_KEYS.ONBOARDING_PROGRESS, progress);
    dispatch({ type: APP_ACTIONS.SET_ONBOARDING_PROGRESS, payload: progress });
  };

  const clearOnboardingProgress = () => {
    removeStorageItem(STORAGE_KEYS.ONBOARDING_PROGRESS);
    dispatch({ type: APP_ACTIONS.SET_ONBOARDING_PROGRESS, payload: null });
  };

  // Loading functions
  const setLoading = (loading) => {
    dispatch({ type: APP_ACTIONS.SET_LOADING, payload: loading });
  };

  // Error functions
  const setError = (error) => {
    dispatch({ type: APP_ACTIONS.SET_ERROR, payload: error });
  };

  const clearError = () => {
    dispatch({ type: APP_ACTIONS.CLEAR_ERROR });
  };

  // Window size and mobile detection
  const [windowSize, setWindowSize] = React.useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isMobile = windowSize.width < 768;
  const isTablet = windowSize.width >= 768 && windowSize.width < 1024;
  const isDesktop = windowSize.width >= 1024;

  // Auto-close sidebar on mobile
  useEffect(() => {
    if (isMobile && state.sidebarOpen) {
      setSidebarOpen(false);
    }
  }, [isMobile]);

  const value = {
    // State
    ...state,
    windowSize,
    isMobile,
    isTablet,
    isDesktop,

    // Theme actions
    setTheme,
    toggleTheme,

    // Sidebar actions
    toggleSidebar,
    setSidebarOpen,

    // Notification actions
    addNotification,
    removeNotification,
    clearNotifications,
    showSuccess,
    showError,
    showWarning,
    showInfo,

    // Onboarding actions
    setOnboardingProgress,
    clearOnboardingProgress,

    // Loading actions
    setLoading,

    // Error actions
    setError,
    clearError,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

// Custom hook to use app context
export const useApp = () => {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }

  return context;
};

export default AppContext;
