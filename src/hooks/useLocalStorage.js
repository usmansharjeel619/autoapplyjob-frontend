import { useState, useEffect, useCallback } from "react";
import {
  getStorageItem,
  setStorageItem,
  removeStorageItem,
} from "../utils/helpers";

// Custom hook for localStorage with React state synchronization
export const useLocalStorage = (key, initialValue = null) => {
  // Initialize state with value from localStorage or initial value
  const [storedValue, setStoredValue] = useState(() => {
    return getStorageItem(key, initialValue);
  });

  // Return a wrapped version of useState's setter function that persists the new value to localStorage
  const setValue = useCallback(
    (value) => {
      try {
        // Allow value to be a function so we have the same API as useState
        const valueToStore =
          value instanceof Function ? value(storedValue) : value;

        // Save to state
        setStoredValue(valueToStore);

        // Save to localStorage
        if (valueToStore === null || valueToStore === undefined) {
          removeStorageItem(key);
        } else {
          setStorageItem(key, valueToStore);
        }
      } catch (error) {
        console.error(`Error setting localStorage key "${key}":`, error);
      }
    },
    [key, storedValue]
  );

  // Remove value from both state and localStorage
  const removeValue = useCallback(() => {
    try {
      setStoredValue(null);
      removeStorageItem(key);
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  }, [key]);

  // Listen for changes to this localStorage key from other tabs/windows
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === key && e.newValue !== null) {
        try {
          const newValue = JSON.parse(e.newValue);
          setStoredValue(newValue);
        } catch (error) {
          console.error(
            `Error parsing localStorage value for key "${key}":`,
            error
          );
        }
      } else if (e.key === key && e.newValue === null) {
        setStoredValue(null);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [key]);

  return [storedValue, setValue, removeValue];
};

// Hook for managing multiple localStorage keys as an object
export const useLocalStorageObject = (keys, initialValues = {}) => {
  const [values, setValues] = useState(() => {
    const stored = {};
    keys.forEach((key) => {
      stored[key] = getStorageItem(key, initialValues[key] || null);
    });
    return stored;
  });

  const updateValue = useCallback(
    (key, value) => {
      if (!keys.includes(key)) {
        console.warn(`Key "${key}" is not in the managed keys list`);
        return;
      }

      const valueToStore =
        value instanceof Function ? value(values[key]) : value;

      setValues((prev) => ({
        ...prev,
        [key]: valueToStore,
      }));

      if (valueToStore === null || valueToStore === undefined) {
        removeStorageItem(key);
      } else {
        setStorageItem(key, valueToStore);
      }
    },
    [keys, values]
  );

  const updateValues = useCallback(
    (newValues) => {
      const updatedValues = { ...values };

      Object.entries(newValues).forEach(([key, value]) => {
        if (keys.includes(key)) {
          const valueToStore =
            value instanceof Function ? value(values[key]) : value;
          updatedValues[key] = valueToStore;

          if (valueToStore === null || valueToStore === undefined) {
            removeStorageItem(key);
          } else {
            setStorageItem(key, valueToStore);
          }
        }
      });

      setValues(updatedValues);
    },
    [keys, values]
  );

  const removeValue = useCallback(
    (key) => {
      if (!keys.includes(key)) {
        console.warn(`Key "${key}" is not in the managed keys list`);
        return;
      }

      setValues((prev) => ({
        ...prev,
        [key]: null,
      }));

      removeStorageItem(key);
    },
    [keys]
  );

  const clearAll = useCallback(() => {
    const clearedValues = {};
    keys.forEach((key) => {
      clearedValues[key] = null;
      removeStorageItem(key);
    });
    setValues(clearedValues);
  }, [keys]);

  return {
    values,
    updateValue,
    updateValues,
    removeValue,
    clearAll,
  };
};

// Hook for localStorage with expiration
export const useLocalStorageWithExpiry = (
  key,
  initialValue = null,
  expirationMinutes = 60
) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = localStorage.getItem(key);
      if (!item) return initialValue;

      const parsed = JSON.parse(item);

      // Check if item has expiration
      if (parsed.expiry && Date.now() > parsed.expiry) {
        localStorage.removeItem(key);
        return initialValue;
      }

      return parsed.value !== undefined ? parsed.value : parsed;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = useCallback(
    (value) => {
      try {
        const valueToStore =
          value instanceof Function ? value(storedValue) : value;

        setStoredValue(valueToStore);

        if (valueToStore === null || valueToStore === undefined) {
          localStorage.removeItem(key);
        } else {
          const item = {
            value: valueToStore,
            expiry: Date.now() + expirationMinutes * 60 * 1000,
          };
          localStorage.setItem(key, JSON.stringify(item));
        }
      } catch (error) {
        console.error(`Error setting localStorage key "${key}":`, error);
      }
    },
    [key, storedValue, expirationMinutes]
  );

  const removeValue = useCallback(() => {
    try {
      setStoredValue(null);
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  }, [key]);

  const isExpired = useCallback(() => {
    try {
      const item = localStorage.getItem(key);
      if (!item) return true;

      const parsed = JSON.parse(item);
      return parsed.expiry && Date.now() > parsed.expiry;
    } catch (error) {
      return true;
    }
  }, [key]);

  return [storedValue, setValue, removeValue, isExpired];
};

export default useLocalStorage;
