import React from 'react';
import { Button } from "@/components/ui/button";
import { Bookmark, Briefcase, MapPin } from 'lucide-react';

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  salary?: string;
  type?: string;
  postedAt?: string;
}

interface JobCardProps {
  job: Job;
  isSaved: boolean;
  isApplied: boolean;
  onSave: () => void;
  onUnsave: () => void;
  onApply: () => void;
}

const JobCard: React.FC<JobCardProps> = ({
  job,
  isSaved,
  isApplied,
  onSave,
  onUnsave,
  onApply,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
          <p className="text-sm text-gray-500">{job.company}</p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={isSaved ? onUnsave : onSave}
          className="text-gray-400 hover:text-gray-900"
        >
          <Bookmark className={`h-5 w-5 ${isSaved ? 'fill-current' : ''}`} />
        </Button>
      </div>

      <div className="mt-4 space-y-2">
        <div className="flex items-center text-sm text-gray-500">
          <MapPin className="h-4 w-4 mr-1" />
          {job.location}
        </div>
        {job.type && (
          <div className="flex items-center text-sm text-gray-500">
            <Briefcase className="h-4 w-4 mr-1" />
            {job.type}
          </div>
        )}
      </div>

      <p className="mt-4 text-sm text-gray-600 line-clamp-3">{job.description}</p>

      <div className="mt-6 flex justify-between items-center">
        {job.salary && (
          <span className="text-sm font-medium text-gray-900">{job.salary}</span>
        )}
        <Button
          onClick={onApply}
          disabled={isApplied}
          className={`${isApplied ? 'bg-gray-100 text-gray-500' : 'bg-purple-600 hover:bg-purple-700 text-white'}`}
        >
          {isApplied ? 'Applied' : 'Apply Now'}
        </Button>
      </div>
    </div>
  );
};

export default JobCard;
