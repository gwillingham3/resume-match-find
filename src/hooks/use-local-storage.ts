import { useState, useEffect } from 'react';

type LocalStorageKey = 
  | 'user'
  | 'token'
  | 'savedJobs'
  | 'appliedJobs'
  | 'hasUploadedResume'
  | 'sidebarState';

interface LocalStorageValue {
  'user': {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  } | null;
  'token': string | null;
  'savedJobs': string[];
  'appliedJobs': string[];
  'hasUploadedResume': boolean;
  'sidebarState': {
    isOpen: boolean;
    width: string;
  };
}

const defaultValues: LocalStorageValue = {
  'user': null,
  'token': null,
  'savedJobs': [],
  'appliedJobs': [],
  'hasUploadedResume': false,
  'sidebarState': {
    isOpen: true,
    width: '16rem'
  }
};

export function useLocalStorage<T extends LocalStorageKey>(
  key: T,
  initialValue?: LocalStorageValue[T]
) {
  // Get from local storage then
  // parse stored json or return initialValue
  const readValue = () => {
    // Prevent build error "window is undefined" but keep working
    if (typeof window === 'undefined') {
      return initialValue ?? defaultValues[key];
    }

    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as LocalStorageValue[T]) : (initialValue ?? defaultValues[key]);
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue ?? defaultValues[key];
    }
  };

  // State to store our value
  // Pass initial state function to useState so logic is only executed once
  const [storedValue, setStoredValue] = useState<LocalStorageValue[T]>(readValue);

  // Return a wrapped version of useState's setter function that ...
  // ... persists the new value to localStorage.
  const setValue = (value: LocalStorageValue[T] | ((val: LocalStorageValue[T]) => LocalStorageValue[T])) => {
    try {
      // Allow value to be a function so we have same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      
      // Save state
      setStoredValue(valueToStore);
      
      // Save to local storage
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  };

  // Remove value from localStorage
  const removeValue = () => {
    try {
      setStoredValue(defaultValues[key]);
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(key);
      }
    } catch (error) {
      console.warn(`Error removing localStorage key "${key}":`, error);
    }
  };

  // Clear all localStorage
  const clearAll = () => {
    try {
      if (typeof window !== 'undefined') {
        window.localStorage.clear();
      }
      // Reset all values to default
      Object.keys(defaultValues).forEach((k) => {
        setStoredValue(defaultValues[k as LocalStorageKey]);
      });
    } catch (error) {
      console.warn('Error clearing localStorage:', error);
    }
  };

  // Listen for changes to this localStorage key from other windows
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue !== e.oldValue) {
        setStoredValue(readValue());
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key]);

  return [storedValue, setValue, removeValue, clearAll] as const;
}

// Helper functions for common operations
export const useAuthStorage = () => {
  const [user, setUser, removeUser] = useLocalStorage('user');
  const [token, setToken, removeToken] = useLocalStorage('token');

  const clearAuth = () => {
    removeUser();
    removeToken();
  };

  return {
    user,
    setUser,
    token,
    setToken,
    clearAuth
  };
};

export const useJobStorage = () => {
  const [savedJobs, setSavedJobs] = useLocalStorage('savedJobs');
  const [appliedJobs, setAppliedJobs] = useLocalStorage('appliedJobs');

  const saveJob = (jobId: string) => {
    if (!savedJobs.includes(jobId)) {
      setSavedJobs([...savedJobs, jobId]);
    }
  };

  const unsaveJob = (jobId: string) => {
    setSavedJobs(savedJobs.filter(id => id !== jobId));
  };

  const applyToJob = (jobId: string) => {
    if (!appliedJobs.includes(jobId)) {
      setAppliedJobs([...appliedJobs, jobId]);
    }
  };

  return {
    savedJobs,
    setSavedJobs,
    appliedJobs,
    setAppliedJobs,
    saveJob,
    unsaveJob,
    applyToJob
  };
};

export const useResumeStorage = () => {
  const [hasUploadedResume, setHasUploadedResume] = useLocalStorage('hasUploadedResume');

  return {
    hasUploadedResume,
    setHasUploadedResume
  };
};

export const useSidebarStorage = () => {
  const [sidebarState, setSidebarState] = useLocalStorage('sidebarState');

  const toggleSidebar = () => {
    setSidebarState(prev => ({
      ...prev,
      isOpen: !prev.isOpen
    }));
  };

  return {
    sidebarState,
    setSidebarState,
    toggleSidebar
  };
}; 