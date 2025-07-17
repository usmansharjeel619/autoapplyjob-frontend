import axios from "axios";
import { API_BASE_URL, STORAGE_KEYS } from "../utils/constants";
import {
  getStorageItem,
  removeStorageItem,
  setStorageItem,
} from "../utils/helpers";

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});
// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = getStorageItem(STORAGE_KEYS.AUTH_TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Add request timestamp for debugging
    config.metadata = { startTime: new Date() };

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle common errors
api.interceptors.response.use(
  (response) => {
    // Calculate request duration
    response.config.metadata.endTime = new Date();
    response.duration =
      response.config.metadata.endTime - response.config.metadata.startTime;

    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response) {
      const { status, data } = error.response;

      switch (status) {
        case 401:
          // Try to refresh token first
          if (!originalRequest._retry) {
            originalRequest._retry = true;

            try {
              const refreshToken = getStorageItem(STORAGE_KEYS.REFRESH_TOKEN);
              if (refreshToken) {
                const response = await api.post("/auth/refresh", {
                  refreshToken,
                });
                const { token } = response.data;

                setStorageItem(STORAGE_KEYS.AUTH_TOKEN, token);
                originalRequest.headers.Authorization = `Bearer ${token}`;

                return api(originalRequest);
              }
            } catch (refreshError) {
              // Refresh failed, logout user
              removeStorageItem(STORAGE_KEYS.AUTH_TOKEN);
              removeStorageItem(STORAGE_KEYS.REFRESH_TOKEN);
              removeStorageItem(STORAGE_KEYS.USER_DATA);
              window.location.href = "/auth";
              return Promise.reject(refreshError);
            }
          }

          // If refresh also failed or no refresh token
          removeStorageItem(STORAGE_KEYS.AUTH_TOKEN);
          removeStorageItem(STORAGE_KEYS.REFRESH_TOKEN);
          removeStorageItem(STORAGE_KEYS.USER_DATA);
          window.location.href = "/auth";
          break;

        case 403:
          console.error("Access denied");
          break;

        case 422:
          // Validation errors - let components handle
          break;

        case 429:
          console.error("Rate limit exceeded");
          break;

        case 500:
        case 502:
        case 503:
        case 504:
          console.error("Server error occurred");
          break;

        default:
          console.error(
            `HTTP ${status}: ${data?.message || "An error occurred"}`
          );
      }
    } else if (error.request) {
      console.error("Network error - please check your connection");
    }

    return Promise.reject(error);
  }
);

// API helper functions
export const apiGet = (url, config = {}) => api.get(url, config);
export const apiPost = (url, data = {}, config = {}) =>
  api.post(url, data, config);
export const apiPut = (url, data = {}, config = {}) =>
  api.put(url, data, config);
export const apiPatch = (url, data = {}, config = {}) =>
  api.patch(url, data, config);
export const apiDelete = (url, config = {}) => api.delete(url, config);

// File upload helper
export const apiPostFile = (url, file, data = {}, onUploadProgress = null) => {
  const formData = new FormData();
  formData.append("file", file);

  Object.keys(data).forEach((key) => {
    formData.append(key, data[key]);
  });

  return api.post(url, formData, {
    headers: { "Content-Type": "multipart/form-data" },
    onUploadProgress: onUploadProgress
      ? (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          onUploadProgress(percentCompleted);
        }
      : undefined,
  });
};

// Batch requests helper
export const apiBatch = (requests) => {
  return Promise.allSettled(
    requests.map((request) => {
      const { method, url, data, config } = request;

      switch (method.toLowerCase()) {
        case "get":
          return apiGet(url, config);
        case "post":
          return apiPost(url, data, config);
        case "put":
          return apiPut(url, data, config);
        case "patch":
          return apiPatch(url, data, config);
        case "delete":
          return apiDelete(url, config);
        default:
          throw new Error(`Unsupported method: ${method}`);
      }
    })
  );
};

// Retry helper for failed requests
export const apiRetry = async (apiCall, maxRetries = 3, delay = 1000) => {
  let lastError;

  for (let i = 0; i <= maxRetries; i++) {
    try {
      return await apiCall();
    } catch (error) {
      lastError = error;

      // Don't retry on 4xx errors (client errors)
      if (
        error.response &&
        error.response.status >= 400 &&
        error.response.status < 500
      ) {
        throw error;
      }

      // Wait before retrying (exponential backoff)
      if (i < maxRetries) {
        await new Promise((resolve) =>
          setTimeout(resolve, delay * Math.pow(2, i))
        );
      }
    }
  }

  throw lastError;
};

// Cancel token helper for request cancellation
export const createCancelToken = () => {
  return axios.CancelToken.source();
};

// Check if error is due to request cancellation
export const isRequestCancelled = (error) => {
  return axios.isCancel(error);
};

// Health check endpoint
export const healthCheck = () => {
  return apiGet("/health");
};

// Generic CRUD operations
export const createResource = (resource, data) => {
  return apiPost(`/${resource}`, data);
};

export const getResource = (resource, id = null, params = {}) => {
  const url = id ? `/${resource}/${id}` : `/${resource}`;
  return apiGet(url, { params });
};

export const updateResource = (resource, id, data) => {
  return apiPut(`/${resource}/${id}`, data);
};

export const patchResource = (resource, id, data) => {
  return apiPatch(`/${resource}/${id}`, data);
};

export const deleteResource = (resource, id) => {
  return apiDelete(`/${resource}/${id}`);
};

// Pagination helper
export const getPaginatedResource = (
  resource,
  page = 1,
  pageSize = 10,
  filters = {}
) => {
  const params = {
    page,
    pageSize,
    ...filters,
  };
  return apiGet(`/${resource}`, { params });
};

// Search helper
export const searchResource = (resource, query, filters = {}) => {
  const params = {
    q: query,
    ...filters,
  };
  return apiGet(`/${resource}/search`, { params });
};

export default api;
