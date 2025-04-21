import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import ResumeUpload from '@/components/ResumeUpload';
import JobList from '@/components/JobList';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Job, JobFilters } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { fetchJobsBasedOnKeywords } from '@/utils/resumeParser';
import { useToast } from "@/hooks/use-toast";
import { useJobStorage } from '@/hooks/use-local-storage';

const Dashboard = () => {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [keywords, setKeywords] = useState<string[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [savedJobs, setSavedJobs] = useState<string[]>([]);
  const [appliedJobs, setAppliedJobs] = useState<string[]>([]);
  const [isLoadingJobs, setIsLoadingJobs] = useState(false);
  const [hasResume, setHasResume] = useState(false);
  const [filters, setFilters] = useState<JobFilters>({
    location: '',
    type: '',
    experience: '',
    keywords: []
  });
  
  const {
    saveJob,
    unsaveJob,
    applyToJob
  } = useJobStorage();
  
  useEffect(() => {
    // Redirect to auth if not authenticated
    if (!authLoading && !isAuthenticated) {
      navigate('/auth');
    }
  }, [isAuthenticated, authLoading, navigate]);
  
  const handleResumeUpload = async (extractedKeywords: string[]) => {
    setKeywords(extractedKeywords);
    setHasResume(true);
    
    // Fetch jobs based on extracted keywords
    setIsLoadingJobs(true);
    try {
      const jobsData = await fetchJobsBasedOnKeywords(extractedKeywords) as Job[];
      setJobs(jobsData);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setIsLoadingJobs(false);
    }
  };
  
  const handleSaveJob = (jobId: string) => {
    saveJob(jobId);
    toast({
      title: "Job saved",
      description: "This job has been added to your saved jobs.",
    });
  };
  
  const handleApplyJob = (job: Job) => {
    if (!appliedJobs.includes(job.id)) {
      setAppliedJobs([...appliedJobs, job.id]);
    }
  };
  
  const handleApplyToJob = (jobId: string) => {
    applyToJob(jobId);
    toast({
      title: "Application submitted",
      description: "Your application has been submitted successfully.",
    });
  };
  
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-purple border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-navy mb-2">
              Welcome{user ? `, ${user.name}` : ''}!
            </h1>
            <p className="text-gray">
              Upload your resume to find matching job opportunities or explore jobs based on your skills.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              {!hasResume ? (
                <ResumeUpload onUploadSuccess={handleResumeUpload} />
              ) : (
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Resume Uploaded</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="mb-4">
                        <h3 className="font-medium mb-2">Extracted Keywords</h3>
                        <div className="flex flex-wrap gap-2">
                          {keywords.map((keyword, index) => (
                            <span 
                              key={index}
                              className="bg-purple-light text-purple-dark px-3 py-1 rounded-full text-sm"
                            >
                              {keyword}
                            </span>
                          ))}
                        </div>
                      </div>
                      <Button 
                        variant="outline" 
                        onClick={() => setHasResume(false)}
                        className="w-full"
                      >
                        Upload New Resume
                      </Button>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Your Job Stats</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-purple-light/50 rounded-lg p-4 text-center">
                          <p className="text-purple-dark font-bold text-2xl">{savedJobs.length}</p>
                          <p className="text-sm text-gray">Jobs Saved</p>
                        </div>
                        <div className="bg-purple-light/50 rounded-lg p-4 text-center">
                          <p className="text-purple-dark font-bold text-2xl">{appliedJobs.length}</p>
                          <p className="text-sm text-gray">Jobs Applied</p>
                        </div>
                      </div>
                      <div className="mt-4">
                        <Button 
                          onClick={() => navigate('/profile')} 
                          variant="outline"
                          className="w-full"
                        >
                          View All Applications
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
            
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Recommended Jobs</CardTitle>
                </CardHeader>
                <CardContent>
                  {jobs.length > 0 || isLoadingJobs ? (
                    <JobList 
                      filters={filters}
                      savedJobs={savedJobs}
                      appliedJobs={appliedJobs}
                      onSaveJob={handleSaveJob}
                      onApplyJob={handleApplyToJob}
                    />
                  ) : (
                    <div className="text-center py-12">
                      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto text-gray mb-4">
                        <circle cx="11" cy="11" r="8" />
                        <path d="m21 21-4.3-4.3" />
                      </svg>
                      <h3 className="text-lg font-medium text-navy mb-2">No Jobs Found</h3>
                      <p className="text-gray mb-6">
                        {hasResume
                          ? "We couldn't find any matching jobs. Try uploading a different resume or adjusting your search."
                          : "Upload your resume to see job recommendations based on your skills and experience."}
                      </p>
                      {!hasResume && (
                        <Button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                          Upload Resume
                        </Button>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      
      <footer className="bg-gray-light/50 py-6 px-4 mt-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <p className="text-sm text-gray">© 2025 JobMatch. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;
