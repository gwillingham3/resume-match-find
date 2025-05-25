import React, { useState, useEffect } from 'react';
import JobCard from './JobCard';
import { Button } from "@/components/ui/button";
import { Search } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { JobFilters } from '@/types';
import { useJobContext } from '@/context/JobContext';
import axios from 'axios';

interface JobListProps {
  filters: JobFilters;
  savedJobs: string[];
  appliedJobs: string[];
  onSaveJob: (jobId: string) => void;
  onApplyJob: (jobId: string) => void;
  token: string | null;
}

const JobList: React.FC<JobListProps> = ({ filters, savedJobs, appliedJobs, onSaveJob, onApplyJob, token }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);
  const { jobs, isLoading, setJobs, setIsLoading } = useJobContext();

  useEffect(() => {
    const fetchJobs = async () => {
      setIsLoading(true);
      try {
        const apiUrl = import.meta.env.VITE_API_URL;
        const response = await axios.get(`${apiUrl}/api/jobs`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          responseType: 'json'
        });
        console.log("Here is the response data in the JobList component: ", response.data);
        if (response.data && Array.isArray(response.data.jobs)) {
          setJobs(response.data.jobs);
        } else {
          console.error("API response is not an object with a jobs array:", response.data);
          setJobs([]);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobs();
  }, [setJobs, setIsLoading, token]);

  console.log("Jobs in JobList:", jobs);
  
  const filteredJobs = jobs.filter(job => {
    // Filter by search term
    const matchesSearch = searchTerm === '' || 
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.organization.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.url.toLowerCase().includes(searchTerm.toLowerCase());
      
    // Filter by selected keywords
    const matchesKeywords = selectedKeywords.length === 0 || 
      selectedKeywords.some(keyword => 
        job.title.toLowerCase().includes(keyword.toLowerCase()) ||
        job.url.toLowerCase().includes(keyword.toLowerCase())
      );
      
    return matchesSearch && matchesKeywords;
  });
  
  const toggleKeyword = (keyword: string) => {
    if (selectedKeywords.includes(keyword)) {
      setSelectedKeywords(selectedKeywords.filter(k => k !== keyword));
    } else {
      setSelectedKeywords([...selectedKeywords, keyword]);
    }
  };
  
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-32 w-full" />
        ))}
      </div>
    );
  }

  if (jobs.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No jobs found matching your criteria.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray" size={18} />
          <Input
            className="pl-10 input-field"
            placeholder="Search for jobs, companies, or keywords"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        {filters.keywords.length > 0 && (
          <div className="mt-4">
            <p className="text-sm font-medium mb-2">Keywords from your resume:</p>
            <div className="flex flex-wrap gap-2">
              {filters.keywords.map((keyword, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className={`rounded-full text-xs ${
                    selectedKeywords.includes(keyword) 
                      ? 'bg-purple text-white border-transparent' 
                      : 'bg-gray-light text-gray border-gray-light'
                  }`}
                  onClick={() => toggleKeyword(keyword)}
                >
                  {keyword}
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>
      
      {filteredJobs.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-navy">No jobs found</h3>
          <p className="text-gray mt-2">Try adjusting your search or filters</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredJobs.map((job) => (
            <JobCard 
              key={job.id} 
              job={job}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default JobList;
