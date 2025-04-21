import React, { useState } from 'react';
import { useJobContext } from '@/context/JobContext';
import JobList from '@/components/JobList';
import { JobFilters } from '@/types';

interface JobsPageProps {
  filters: JobFilters;
}

const JobsPage: React.FC<JobsPageProps> = ({ filters }) => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-navy mb-8">Find Your Next Job</h1>
      <JobList filters={filters} />
    </div>
  );
};

export default JobsPage; 