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
    if (!authLoading && !isAuthenticated) {
      navigate('/auth');
    }
    
    // Check if user has a resume (in a real app this would come from a backend)
    const hasUploadedResume = localStorage.getItem('hasUploadedResume');
    setHasResume(hasUploadedResume === 'true');
    
    // Retrieve saved and applied jobs from local storage 
    // (in a real app this would come from a backend)
    const storedSavedJobIds = localStorage.getItem('savedJobs');
    const storedAppliedJobIds = localStorage.getItem('appliedJobs');
    
    // Mock job data to display in profile
    const mockJobs = [
      {
        id: '1',
        title: 'Frontend Developer',
        company: 'TechCorp',
        location: 'Remote',
        type: 'Full-time',
        logo: '',
        description: 'We are looking for a skilled Frontend Developer with experience in React, TypeScript, and modern web development practices...',
        url: 'https://example.com/job/1',
        postedAt: '2 days ago',
      },
      {
        id: '2',
        title: 'Full Stack JavaScript Developer',
        company: 'WebSolutions Inc.',
        location: 'New York, NY',
        type: 'Full-time',
        logo: '',
        description: 'Join our team as a Full Stack Developer working with Node.js, React, and MongoDB to build scalable web applications...',
        url: 'https://example.com/job/2',
        postedAt: '1 week ago',
      },
      {
        id: '3',
        title: 'React Native Developer',
        company: 'MobileApps Co.',
        location: 'San Francisco, CA',
        type: 'Contract',
        logo: '',
        description: 'Develop cross-platform mobile applications using React Native. Experience with TypeScript and API integration required...',
        url: 'https://example.com/job/3',
        salary: '$120k - $150k',
        postedAt: '3 days ago',
      },
      {
        id: '5',
        title: 'Senior Frontend Engineer',
        company: 'StartupX',
        location: 'Austin, TX',
        type: 'Full-time',
        logo: '',
        description: 'Senior Frontend Engineer needed to lead our web development efforts. Experience with React, state management, and performance optimization required...',
        url: 'https://example.com/job/5',
        salary: '$140k - $180k',
        postedAt: '5 days ago',
      },
      {
        id: '7',
        title: 'DevOps Engineer',
        company: 'CloudSystems',
        location: 'Remote',
        type: 'Full-time',
        logo: '',
        description: 'Looking for an experienced DevOps engineer to help automate our deployment processes and manage our cloud infrastructure.',
        url: 'https://example.com/job/7',
        salary: '$130k - $160k',
        postedAt: '1 week ago',
      },
    ];
    
    if (storedSavedJobIds) {
      try {
        const savedIds = JSON.parse(storedSavedJobIds) as string[];
        const savedJobsData = mockJobs.filter(job => savedIds.includes(job.id));
        setSavedJobs(savedJobsData);
      } catch (e) {
        console.error('Failed to parse stored saved jobs', e);
      }
    }
    
    if (storedAppliedJobIds) {
      try {
        const appliedIds = JSON.parse(storedAppliedJobIds) as string[];
        const appliedJobsData = mockJobs.filter(job => appliedIds.includes(job.id));
        setAppliedJobs(appliedJobsData);
      } catch (e) {
        console.error('Failed to parse stored applied jobs', e);
      }
    }
  }, [isAuthenticated, authLoading, navigate]);
  
  const handleRemoveSavedJob = (jobId: string) => {
    setSavedJobs(savedJobs.filter(job => job.id !== jobId));
    
    // Also update the saved jobs IDs in localStorage
    const savedJobIds = savedJobs.filter(job => job.id !== jobId).map(job => job.id);
    localStorage.setItem('savedJobs', JSON.stringify(savedJobIds));
  };
  
  const handleRemoveAppliedJob = (jobId: string) => {
    setAppliedJobs(appliedJobs.filter(job => job.id !== jobId));
    
    // Also update the applied jobs IDs in localStorage
    const appliedJobIds = appliedJobs.filter(job => job.id !== jobId).map(job => job.id);
    localStorage.setItem('appliedJobs', JSON.stringify(appliedJobIds));
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
