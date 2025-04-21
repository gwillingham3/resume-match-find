import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import UserProfile from '@/components/UserProfile';
import { Job } from '@/types';
import { useAuth } from '@/context/AuthContext';

const Profile = () => {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [savedJobs, setSavedJobs] = useState<Job[]>([]);
  const [appliedJobs, setAppliedJobs] = useState<Job[]>([]);
  const [hasResume, setHasResume] = useState(false);
  
  useEffect(() => {
    // Redirect to auth if not authenticated
    if (!isAuthenticated) {
      navigate('/auth');
      return;
    }
    
    // Check if user has a resume (in a real app this would come from a backend)
    const hasUploadedResume = localStorage.getItem('hasUploadedResume');
    setHasResume(hasUploadedResume === 'true');
    
    // Retrieve saved and applied jobs from local storage 
    // (in a real app this would come from a backend)
    const storedSavedJobIds = localStorage.getItem('savedJobs');
    const storedAppliedJobIds = localStorage.getItem('appliedJobs');
    
    if (storedSavedJobIds) {
      const savedJobIds = JSON.parse(storedSavedJobIds);
      setSavedJobs(savedJobIds);
    }
    
    if (storedAppliedJobIds) {
      const appliedJobIds = JSON.parse(storedAppliedJobIds);
      setAppliedJobs(appliedJobIds);
    }
  }, [isAuthenticated, navigate]);
  
  const handleRemoveSavedJob = (jobId: string) => {
    setSavedJobs(savedJobs.filter(job => job.id !== jobId));
  };
  
  const handleRemoveAppliedJob = (jobId: string) => {
    setAppliedJobs(appliedJobs.filter(job => job.id !== jobId));
  };
  
  if (authLoading || !user) {
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
        <div className="max-w-6xl mx-auto">
          <UserProfile
            user={user}
            savedJobs={savedJobs}
            appliedJobs={appliedJobs}
            hasResume={hasResume}
            onRemoveSaved={handleRemoveSavedJob}
            onRemoveApplied={handleRemoveAppliedJob}
          />
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

export default Profile;
