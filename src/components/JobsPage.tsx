import React from 'react';
import JobList from './JobList';
import JobFilters from './JobFilters';
import { Job, JobFilters as JobFiltersType } from '@/types';

export const JobsPage: React.FC = () => {
  const [filters, setFilters] = React.useState<JobFiltersType>({
    location: '',
    type: '',
    experience: '',
    keywords: [],
  });
  
  const [savedJobs, setSavedJobs] = React.useState<Set<string>>(new Set());
  const [appliedJobs, setAppliedJobs] = React.useState<Set<string>>(new Set());

  const handleSaveJob = (jobId: string) => {
    setSavedJobs(prev => {
      const newSet = new Set(prev);
      if (newSet.has(jobId)) {
        newSet.delete(jobId);
      } else {
        newSet.add(jobId);
      }
      return newSet;
    });
  };

  const handleApplyJob = (jobId: string) => {
    setAppliedJobs(prev => {
      const newSet = new Set(prev);
      newSet.add(jobId);
      return newSet;
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Find Your Next Job</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1">
          <JobFilters 
            filters={filters}
            onFilterChange={setFilters}
          />
        </div>
        
        <div className="lg:col-span-3">
          <JobList
            filters={filters}
            savedJobs={Array.from(savedJobs)}
            appliedJobs={Array.from(appliedJobs)}
            onSaveJob={handleSaveJob}
            onApplyJob={handleApplyJob}
          />
        </div>
      </div>
    </div>
  );
};

export default JobsPage; 