import React, { useState } from 'react';
import JobCard, { Job } from './JobCard';
import { Button } from "@/components/ui/button";
import { Search } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

interface JobListProps {
  jobs: Job[];
  keywords?: string[];
  onSaveJob: (jobId: string) => void;
  onUnsaveJob: (jobId: string) => void;
  onApplyToJob: (jobId: string) => void;
  savedJobs: string[];
  appliedJobs: string[];
  isLoading: boolean;
}

const JobList: React.FC<JobListProps> = ({ 
  jobs, 
  keywords = [], 
  onSaveJob, 
  onUnsaveJob,
  onApplyToJob,
  savedJobs = [],
  appliedJobs = [],
  isLoading = false
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);
  
  const filteredJobs = jobs.filter(job => {
    // Filter by search term
    const matchesSearch = searchTerm === '' || 
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.description.toLowerCase().includes(searchTerm.toLowerCase());
      
    // Filter by selected keywords
    const matchesKeywords = selectedKeywords.length === 0 || 
      selectedKeywords.some(keyword => 
        job.title.toLowerCase().includes(keyword.toLowerCase()) ||
        job.description.toLowerCase().includes(keyword.toLowerCase())
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
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm p-6">
            <Skeleton className="h-6 w-3/4 mb-4" />
            <Skeleton className="h-4 w-1/2 mb-2" />
            <Skeleton className="h-4 w-1/3 mb-4" />
            <Skeleton className="h-20 w-full" />
          </div>
        ))}
      </div>
    );
  }

  if (jobs.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900">No jobs found</h3>
        <p className="mt-2 text-sm text-gray-500">
          Try adjusting your search or filters to find more jobs.
        </p>
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
        
        {keywords.length > 0 && (
          <div className="mt-4">
            <p className="text-sm font-medium mb-2">Keywords from your resume:</p>
            <div className="flex flex-wrap gap-2">
              {keywords.map((keyword, index) => (
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
      
      <div className="space-y-4">
        {filteredJobs.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-navy">No jobs found</h3>
            <p className="text-gray mt-2">Try adjusting your search or filters</p>
          </div>
        ) : (
          filteredJobs.map((job) => (
            <JobCard 
              key={job.id} 
              job={job} 
              isSaved={savedJobs.includes(job.id)}
              isApplied={appliedJobs.includes(job.id)}
              onSave={() => onSaveJob(job.id)}
              onUnsave={() => onUnsaveJob(job.id)}
              onApply={() => onApplyToJob(job.id)}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default JobList;
