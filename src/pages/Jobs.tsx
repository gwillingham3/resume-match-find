
import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import JobList from '@/components/JobList';
import { useAuth } from '@/context/AuthContext';
import { Job } from '@/components/JobCard';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { fetchJobsBasedOnKeywords } from '@/utils/resumeParser';

const Jobs = () => {
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [savedJobs, setSavedJobs] = useState<string[]>([]);
  const [appliedJobs, setAppliedJobs] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Load jobs when the component mounts
    const loadJobs = async () => {
      setIsLoading(true);
      try {
        const jobsData = await fetchJobsBasedOnKeywords([]) as Job[];
        setJobs(jobsData);
      } catch (error) {
        console.error('Error fetching jobs:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadJobs();
    
    // Retrieve saved jobs from local storage (in a real app this would come from a backend)
    const storedSavedJobs = localStorage.getItem('savedJobs');
    const storedAppliedJobs = localStorage.getItem('appliedJobs');
    
    if (storedSavedJobs) {
      try {
        setSavedJobs(JSON.parse(storedSavedJobs));
      } catch (e) {
        console.error('Failed to parse stored saved jobs', e);
      }
    }
    
    if (storedAppliedJobs) {
      try {
        setAppliedJobs(JSON.parse(storedAppliedJobs));
      } catch (e) {
        console.error('Failed to parse stored applied jobs', e);
      }
    }
  }, []);
  
  // Update localStorage whenever saved or applied jobs change
  useEffect(() => {
    localStorage.setItem('savedJobs', JSON.stringify(savedJobs));
  }, [savedJobs]);
  
  useEffect(() => {
    localStorage.setItem('appliedJobs', JSON.stringify(appliedJobs));
  }, [appliedJobs]);
  
  const handleSaveJob = (job: Job) => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please sign in to save jobs.",
        variant: "destructive",
      });
      return;
    }
    
    if (savedJobs.includes(job.id)) {
      // Remove from saved jobs
      setSavedJobs(savedJobs.filter(id => id !== job.id));
    } else {
      // Add to saved jobs
      setSavedJobs([...savedJobs, job.id]);
    }
  };
  
  const handleApplyJob = (job: Job) => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please sign in to apply for jobs.",
        variant: "destructive",
      });
      return;
    }
    
    if (!appliedJobs.includes(job.id)) {
      setAppliedJobs([...appliedJobs, job.id]);
    }
  };
  
  // Add more dummy jobs to the existing ones
  const moreJobs: Job[] = [
    {
      id: '6',
      title: 'API Developer',
      company: 'TechServe',
      location: 'Boston, MA',
      type: 'Full-time',
      logo: '',
      description: 'Design and implement RESTful APIs for our next-generation platform. Knowledge of Node.js, Express, and MongoDB required.',
      url: 'https://example.com/job/6',
      postedAt: '3 days ago',
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
    {
      id: '8',
      title: 'React Developer',
      company: 'WebFront',
      location: 'Chicago, IL',
      type: 'Contract',
      logo: '',
      description: 'Join our team to build modern web applications using React, Redux, and TypeScript. Experience with responsive design required.',
      url: 'https://example.com/job/8',
      postedAt: '2 days ago',
    },
    {
      id: '9',
      title: 'UX/UI Designer',
      company: 'DesignPro',
      location: 'Los Angeles, CA',
      type: 'Full-time',
      logo: '',
      description: 'Create beautiful and functional user interfaces for web and mobile applications. Proficiency in Figma and Adobe Creative Suite required.',
      url: 'https://example.com/job/9',
      salary: '$90k - $120k',
      postedAt: '4 days ago',
    },
    {
      id: '10',
      title: 'Backend Developer',
      company: 'ServerTech',
      location: 'Seattle, WA',
      type: 'Full-time',
      logo: '',
      description: 'Develop and maintain server-side logic, databases, and APIs. Experience with Python, Django, and PostgreSQL preferred.',
      url: 'https://example.com/job/10',
      postedAt: 'Just now',
    },
  ];
  
  // Combine the original jobs with more jobs
  const allJobs = [...jobs, ...moreJobs];
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-navy mb-2">Browse Jobs</h1>
            <p className="text-gray">
              Find your next opportunity from our curated list of technical positions
            </p>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6">
            <JobList 
              jobs={allJobs}
              onSaveJob={handleSaveJob}
              onApplyJob={handleApplyJob}
              savedJobs={savedJobs}
              appliedJobs={appliedJobs}
              isLoading={isLoading}
            />
            
            <div className="mt-8 text-center">
              <Button 
                variant="outline" 
                className="border-purple text-purple hover:bg-purple-light"
              >
                Load More Jobs
              </Button>
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

export default Jobs;
