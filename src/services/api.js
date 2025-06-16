import axios from "axios";
import { API_BASE_URL, STORAGE_KEYS } from "../utils/constants";
import { getStorageItem, removeStorageItem } from "../utils/helpers";

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
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
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle common errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle common HTTP errors
    if (error.response) {
      const { status, data } = error.response;

      switch (status) {
        case 401:
          // Unauthorized - clear auth data and redirect to login
          removeStorageItem(STORAGE_KEYS.AUTH_TOKEN);
          removeStorageItem(STORAGE_KEYS.USER_DATA);
          window.location.href = "/auth";
          break;

        case 403:
          // Forbidden - show access denied message
          console.error("Access denied");
          break;

        case 404:
          // Not found
          console.error("Resource not found");
          break;

        case 422:
          // Validation error - handled by individual components
          break;

        case 500:
          // Server error
          console.error("Server error occurred");
          break;

        default:
          console.error(
            `HTTP ${status}: ${data?.message || "An error occurred"}`
          );
      }
    } else if (error.request) {
      // Network error
      console.error("Network error - please check your connection");
    } else {
      // Other error
      console.error("An unexpected error occurred");
    }

    return Promise.reject(error);
  }
);

// API helper functions
export const apiGet = (url, config = {}) => {
  return api.get(url, config);
};

export const apiPost = (url, data = {}, config = {}) => {
  return api.post(url, data, config);
};

export const apiPut = (url, data = {}, config = {}) => {
  return api.put(url, data, config);
};

export const apiPatch = (url, data = {}, config = {}) => {
  return api.patch(url, data, config);
};

export const apiDelete = (url, config = {}) => {
  return api.delete(url, config);
};

// File upload helper
export const apiPostFile = (url, file, data = {}, onUploadProgress = null) => {
  const formData = new FormData();
  formData.append("file", file);

  // Append additional data
  Object.keys(data).forEach((key) => {
    formData.append(key, data[key]);
  });

  return api.post(url, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
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
