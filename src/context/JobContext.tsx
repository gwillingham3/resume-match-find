import React, { createContext, useContext, useState } from 'react';
import { Job } from '@/types';
import { useJobStorage } from '@/hooks/use-local-storage';

interface JobContextType {
  jobs: Job[];
  setJobs: (jobs: Job[]) => void;
  savedJobs: string[];
  appliedJobs: string[];
  saveJob: (jobId: string) => void;
  unsaveJob: (jobId: string) => void;
  applyToJob: (jobId: string) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

const JobContext = createContext<JobContextType | undefined>(undefined);

export const JobProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const {
    savedJobs,
    appliedJobs,
    saveJob,
    unsaveJob,
    applyToJob
  } = useJobStorage();

  return (
    <JobContext.Provider value={{
      jobs,
      setJobs,
      savedJobs,
      appliedJobs,
      saveJob,
      unsaveJob,
      applyToJob,
      isLoading,
      setIsLoading
    }}>
      {children}
    </JobContext.Provider>
  );
};

export const useJobContext = () => {
  const context = useContext(JobContext);
  if (!context) {
    throw new Error('useJobContext must be used within a JobProvider');
  }
  return context;
}; 