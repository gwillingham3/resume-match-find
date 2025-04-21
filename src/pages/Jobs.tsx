import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import JobList from '@/components/JobList';
import { useAuth } from '@/context/AuthContext';
import { Job } from '@/components/JobCard';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useJobStorage } from '@/hooks/use-local-storage';
import { fetchJobsBasedOnKeywords } from '@/utils/resumeParser';

const Jobs = () => {
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const {
    savedJobs,
    appliedJobs,
    saveJob,
    unsaveJob,
    applyToJob
  } = useJobStorage();
  
  useEffect(() => {
    // Load jobs when the component mounts
    const loadJobs = async () => {
      setIsLoading(true);
      try {
        const jobsData = await fetchJobsBasedOnKeywords([]) as Job[];
        setJobs(jobsData);
      } catch (error) {
        console.error('Error fetching jobs:', error);
        toast({
          title: "Error loading jobs",
          description: "There was a problem loading the job listings. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadJobs();
  }, [toast]);

  const handleSaveJob = (jobId: string) => {
    saveJob(jobId);
    toast({
      title: "Job saved",
      description: "This job has been added to your saved jobs.",
    });
  };

  const handleUnsaveJob = (jobId: string) => {
    unsaveJob(jobId);
    toast({
      title: "Job unsaved",
      description: "This job has been removed from your saved jobs.",
    });
  };

  const handleApplyToJob = (jobId: string) => {
    applyToJob(jobId);
    toast({
      title: "Application submitted",
      description: "Your application has been submitted successfully.",
    });
  };

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
          jobs={jobs}
          isLoading={isLoading}
          savedJobs={savedJobs}
          appliedJobs={appliedJobs}
          onSaveJob={handleSaveJob}
          onUnsaveJob={handleUnsaveJob}
          onApplyToJob={handleApplyToJob}
        />
      </main>
    </div>
  );
};

export default Jobs;
