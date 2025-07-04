import React from 'react';
import { useJobContext } from '@/context/JobContext';
import JobList from '@/components/JobList';
import { JobFilters } from '@/types';
import { useAuthStorage } from '@/hooks/use-local-storage';

interface JobsPageProps {
  filters: JobFilters;
}

const JobsPage: React.FC<JobsPageProps> = ({ filters }) => {
  const { savedJobs, appliedJobs, saveJob, applyToJob } = useJobContext();
  const { token } = useAuthStorage();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-navy mb-8">Find Your Next Job</h1>
      <JobList 
        filters={filters} 
        savedJobs={savedJobs} 
        appliedJobs={appliedJobs} 
        onSaveJob={saveJob} 
        onApplyJob={applyToJob}
        token={token}
      />
    </div>
  );
};

export default JobsPage;
