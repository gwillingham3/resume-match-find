
import React, { useState } from 'react';
import JobCard, { Job } from './JobCard';
import { Button } from "@/components/ui/button";
import { Search } from 'lucide-react';
import { Input } from "@/components/ui/input";

interface JobListProps {
  jobs: Job[];
  keywords?: string[];
  onSaveJob?: (job: Job) => void;
  onApplyJob?: (job: Job) => void;
  savedJobs?: string[];
  appliedJobs?: string[];
  isLoading?: boolean;
}

const JobList: React.FC<JobListProps> = ({ 
  jobs, 
  keywords = [], 
  onSaveJob, 
  onApplyJob,
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
        {isLoading ? (
          // Loading skeleton
          Array(3).fill(0).map((_, i) => (
            <div key={i} className="bg-white rounded-lg p-5 shadow-sm animate-pulse">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-md bg-gray-light"></div>
                  <div>
                    <div className="h-5 w-48 bg-gray-light rounded mb-2"></div>
                    <div className="h-3 w-24 bg-gray-light rounded"></div>
                  </div>
                </div>
                <div className="h-8 w-16 bg-gray-light rounded"></div>
              </div>
              <div className="mt-4">
                <div className="flex gap-2">
                  <div className="h-6 w-20 bg-gray-light rounded-full"></div>
                  <div className="h-6 w-16 bg-gray-light rounded-full"></div>
                </div>
                <div className="h-4 w-full bg-gray-light rounded mt-4"></div>
                <div className="h-4 w-3/4 bg-gray-light rounded mt-2"></div>
                <div className="flex justify-between items-center mt-4">
                  <div className="h-3 w-24 bg-gray-light rounded"></div>
                  <div className="h-10 w-28 bg-gray-light rounded"></div>
                </div>
              </div>
            </div>
          ))
        ) : filteredJobs.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-navy">No jobs found</h3>
            <p className="text-gray mt-2">Try adjusting your search or filters</p>
          </div>
        ) : (
          filteredJobs.map((job) => (
            <JobCard 
              key={job.id} 
              job={job} 
              onSave={onSaveJob}
              onApply={onApplyJob}
              saved={savedJobs.includes(job.id)}
              applied={appliedJobs.includes(job.id)}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default JobList;
