import { useState, useEffect, useCallback } from "react";
import { useApp } from "../context/AppContext";

export const useApi = (apiCall, dependencies = [], options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { showError } = useApp();

  const {
    immediate = true,
    showErrorNotification = true,
    onSuccess,
    onError,
  } = options;

  const execute = useCallback(
    async (...args) => {
      try {
        setLoading(true);
        setError(null);

        const result = await apiCall(...args);
        setData(result);

        if (onSuccess) {
          onSuccess(result);
        }

        return result;
      } catch (err) {
        setError(err);

        if (showErrorNotification) {
          showError(err.response?.data?.message || "An error occurred");
        }

        if (onError) {
          onError(err);
        }

        throw err;
      } finally {
        setLoading(false);
      }
    },
    [apiCall, onSuccess, onError, showError, showErrorNotification]
  );

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, dependencies);

  return { data, loading, error, execute };
};

export const usePaginatedApi = (apiCall, initialParams = {}) => {
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
    total: 0,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = useCallback(
    async (params = {}) => {
      try {
        setLoading(true);
        setError(null);

        const result = await apiCall({
          ...initialParams,
          ...params,
          page: pagination.page,
          pageSize: pagination.pageSize,
        });

        setData(result.data || []);
        setPagination((prev) => ({
          ...prev,
          total: result.total || 0,
          totalPages: result.totalPages || 0,
        }));

        return result;
      } catch (err) {
        setError(err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [apiCall, initialParams, pagination.page, pagination.pageSize]
  );

  const goToPage = useCallback((page) => {
    setPagination((prev) => ({ ...prev, page }));
  }, []);

  const changePageSize = useCallback((pageSize) => {
    setPagination((prev) => ({ ...prev, pageSize, page: 1 }));
  }, []);

  useEffect(() => {
    fetchData();
  }, [pagination.page, pagination.pageSize]);

  return {
    data,
    pagination,
    loading,
    error,
    fetchData,
    goToPage,
    changePageSize,
  };
};

export default useApi;
