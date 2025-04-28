import React, { useState } from 'react';
import Header from '@/components/Header';
import JobList from '@/components/JobList';
import { useAuth } from '@/context/AuthContext';
import { JobFilters } from '@/types';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useJobStorage, useAuthStorage } from '@/hooks/use-local-storage';
import { useJobContext } from '@/context/JobContext';

const Jobs = () => {
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const { savedJobs, appliedJobs, saveJob, unsaveJob, applyToJob } = useJobStorage();
  const { token } = useAuthStorage();
  const { jobs, isLoading } = useJobContext();
  const [filters, setFilters] = useState<JobFilters>({
    location: '',
    type: '',
    experience: '',
    keywords: []
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Job Listings</h1>
          {isAuthenticated && (
            <Button
              variant="outline"
              onClick={() => window.location.href = '/profile'}
            >
              View Saved Jobs
            </Button>
          )}
        </div>
        
        <JobList
          filters={filters}
          savedJobs={savedJobs}
          appliedJobs={appliedJobs}
          onSaveJob={saveJob}
          onApplyJob={applyToJob}
          token={token}
        />
      </main>
    </div>
  );
};

export default Jobs;
