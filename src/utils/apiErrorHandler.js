export class ApiError extends Error {
  constructor(message, status, data = null) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

export const handleApiError = (error) => {
  if (error.response) {
    const { status, data } = error.response;

    switch (status) {
      case 400:
        return new ApiError(data?.message || "Bad request", status, data);
      case 401:
        return new ApiError("Authentication required", status, data);
      case 403:
        return new ApiError("Access denied", status, data);
      case 404:
        return new ApiError("Resource not found", status, data);
      case 422:
        return new ApiError("Validation failed", status, data);
      case 429:
        return new ApiError(
          "Too many requests. Please try again later.",
          status,
          data
        );
      case 500:
        return new ApiError(
          "Server error. Please try again later.",
          status,
          data
        );
      default:
        return new ApiError(
          data?.message || "An unexpected error occurred",
          status,
          data
        );
    }
  } else if (error.request) {
    return new ApiError("Network error. Please check your connection.", 0);
  } else {
    return new ApiError(error.message || "An unexpected error occurred", 0);
  }
};

export const getErrorMessage = (error) => {
  if (error instanceof ApiError) {
    return error.message;
  }

  if (error.response?.data?.message) {
    return error.response.data.message;
  }

  return error.message || "An unexpected error occurred";
};
