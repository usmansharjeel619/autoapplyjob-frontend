import { useState, useEffect, useCallback } from "react";
import { useApp } from "../context/AppContext";

// Custom hook for API calls with loading, error handling, and caching
export const useApi = (apiFunction, dependencies = [], options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { showError } = useApp();

  const {
    immediate = true,
    showErrorNotification = true,
    cacheKey = null,
    cacheDuration = 5 * 60 * 1000, // 5 minutes
  } = options;

  // Simple cache implementation
  const cache = useCallback(() => {
    if (!cacheKey) return { get: () => null, set: () => {}, clear: () => {} };

    const storage = sessionStorage;

    return {
      get: () => {
        try {
          const cached = storage.getItem(cacheKey);
          if (cached) {
            const { data, timestamp } = JSON.parse(cached);
            if (Date.now() - timestamp < cacheDuration) {
              return data;
            }
          }
        } catch (e) {
          console.warn("Cache get error:", e);
        }
        return null;
      },
      set: (data) => {
        try {
          storage.setItem(
            cacheKey,
            JSON.stringify({
              data,
              timestamp: Date.now(),
            })
          );
        } catch (e) {
          console.warn("Cache set error:", e);
        }
      },
      clear: () => {
        try {
          storage.removeItem(cacheKey);
        } catch (e) {
          console.warn("Cache clear error:", e);
        }
      },
    };
  }, [cacheKey, cacheDuration]);

  const execute = useCallback(
    async (...args) => {
      setLoading(true);
      setError(null);

      try {
        // Check cache first
        const cacheManager = cache();
        const cachedData = cacheManager.get();

        if (cachedData) {
          setData(cachedData);
          setLoading(false);
          return { data: cachedData, error: null };
        }

        const result = await apiFunction(...args);

        setData(result);

        // Cache the result
        if (cacheKey) {
          cacheManager.set(result);
        }

        setLoading(false);
        return { data: result, error: null };
      } catch (err) {
        const errorMessage =
          err.response?.data?.message || err.message || "An error occurred";
        setError(errorMessage);
        setLoading(false);

        if (showErrorNotification) {
          showError(errorMessage);
        }

        return { data: null, error: errorMessage };
      }
    },
    [apiFunction, cacheKey, cache, showError, showErrorNotification]
  );

  // Execute immediately if requested
  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, dependencies);

  // Clear cache when dependencies change
  useEffect(() => {
    if (cacheKey) {
      const cacheManager = cache();
      cacheManager.clear();
    }
  }, dependencies);

  const refetch = useCallback(() => {
    // Clear cache and refetch
    if (cacheKey) {
      const cacheManager = cache();
      cacheManager.clear();
    }
    return execute();
  }, [execute, cacheKey, cache]);

  return {
    data,
    loading,
    error,
    execute,
    refetch,
  };
};

// Hook for paginated API calls
export const usePaginatedApi = (
  apiFunction,
  initialParams = {},
  options = {}
) => {
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
    total: 0,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { showError } = useApp();

  const { showErrorNotification = true } = options;

  const fetchData = useCallback(
    async (params = {}) => {
      setLoading(true);
      setError(null);

      try {
        const result = await apiFunction({
          ...initialParams,
          ...params,
          page: params.page || pagination.page,
          pageSize: params.pageSize || pagination.pageSize,
        });

        setData(result.data || []);
        setPagination({
          page: result.page || 1,
          pageSize: result.pageSize || 10,
          total: result.total || 0,
          totalPages: result.totalPages || 0,
        });

        setLoading(false);
        return { data: result, error: null };
      } catch (err) {
        const errorMessage =
          err.response?.data?.message || err.message || "An error occurred";
        setError(errorMessage);
        setLoading(false);

        if (showErrorNotification) {
          showError(errorMessage);
        }

        return { data: null, error: errorMessage };
      }
    },
    [
      apiFunction,
      initialParams,
      pagination.page,
      pagination.pageSize,
      showError,
      showErrorNotification,
    ]
  );

  const nextPage = useCallback(() => {
    if (pagination.page < pagination.totalPages) {
      fetchData({ page: pagination.page + 1 });
    }
  }, [fetchData, pagination.page, pagination.totalPages]);

  const prevPage = useCallback(() => {
    if (pagination.page > 1) {
      fetchData({ page: pagination.page - 1 });
    }
  }, [fetchData, pagination.page]);

  const goToPage = useCallback(
    (page) => {
      if (page >= 1 && page <= pagination.totalPages) {
        fetchData({ page });
      }
    },
    [fetchData, pagination.totalPages]
  );

  const changePageSize = useCallback(
    (pageSize) => {
      fetchData({ page: 1, pageSize });
    },
    [fetchData]
  );

  const refetch = useCallback(() => {
    return fetchData();
  }, [fetchData]);

  // Initial fetch
  useEffect(() => {
    fetchData();
  }, []);

  return {
    data,
    pagination,
    loading,
    error,
    fetchData,
    nextPage,
    prevPage,
    goToPage,
    changePageSize,
    refetch,
  };
};

// Hook for infinite scroll API calls
export const useInfiniteApi = (
  apiFunction,
  initialParams = {},
  options = {}
) => {
  const [data, setData] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const { showError } = useApp();

  const { showErrorNotification = true, pageSize = 10 } = options;

  const fetchMore = useCallback(
    async (reset = false) => {
      if (loading) return;

      setLoading(true);
      setError(null);

      try {
        const currentPage = reset ? 1 : page;
        const result = await apiFunction({
          ...initialParams,
          page: currentPage,
          pageSize,
        });

        const newData = result.data || [];

        if (reset) {
          setData(newData);
          setPage(2);
        } else {
          setData((prev) => [...prev, ...newData]);
          setPage((prev) => prev + 1);
        }

        setHasMore(newData.length === pageSize);
        setLoading(false);

        return { data: result, error: null };
      } catch (err) {
        const errorMessage =
          err.response?.data?.message || err.message || "An error occurred";
        setError(errorMessage);
        setLoading(false);

        if (showErrorNotification) {
          showError(errorMessage);
        }

        return { data: null, error: errorMessage };
      }
    },
    [
      apiFunction,
      initialParams,
      loading,
      page,
      pageSize,
      showError,
      showErrorNotification,
    ]
  );

  const refresh = useCallback(() => {
    return fetchMore(true);
  }, [fetchMore]);

  // Initial fetch
  useEffect(() => {
    fetchMore(true);
  }, []);

  return {
    data,
    hasMore,
    loading,
    error,
    fetchMore: () => fetchMore(false),
    refresh,
  };
};

export default useApi;
