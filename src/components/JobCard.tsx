
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  logo?: string;
  description: string;
  url: string;
  salary?: string;
  postedAt: string;
  isSaved?: boolean;
  isApplied?: boolean;
}

interface JobCardProps {
  job: Job;
  onSave?: (job: Job) => void;
  onApply?: (job: Job) => void;
  saved?: boolean;
  applied?: boolean;
}

const JobCard: React.FC<JobCardProps> = ({ 
  job, 
  onSave, 
  onApply,
  saved = false,
  applied = false
}) => {
  const { toast } = useToast();
  
  const handleSave = () => {
    if (onSave) {
      onSave(job);
      toast({
        title: saved ? "Job removed from saved jobs" : "Job saved successfully",
        description: saved 
          ? "This job has been removed from your saved jobs." 
          : "This job has been added to your saved jobs.",
      });
    }
  };
  
  const handleApply = () => {
    if (onApply) {
      onApply(job);
      toast({
        title: "Application submitted",
        description: "Your application has been submitted successfully.",
      });
    } else {
      window.open(job.url, '_blank');
    }
  };
  
  return (
    <Card className="w-full card-hover overflow-hidden">
      <CardContent className="p-0">
        <div className="p-5">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-md bg-gray-light flex items-center justify-center overflow-hidden">
                {job.logo ? (
                  <img src={job.logo} alt={`${job.company} logo`} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-lg font-bold text-gray">{job.company.charAt(0)}</span>
                )}
              </div>
              <div>
                <h3 className="font-semibold text-navy">{job.title}</h3>
                <p className="text-gray text-sm">{job.company}</p>
              </div>
            </div>
            <Button 
              variant="ghost"
              onClick={handleSave}
              className={`text-sm px-3 py-1 h-auto ${saved ? 'text-purple border-purple border' : 'text-gray'}`}
            >
              {saved ? 'Saved' : 'Save'}
            </Button>
          </div>
          
          <div className="mt-4 space-y-2">
            <div className="flex flex-wrap gap-2">
              <span className="text-xs bg-purple-light text-purple-dark px-2 py-1 rounded-full">
                {job.location}
              </span>
              <span className="text-xs bg-purple-light text-purple-dark px-2 py-1 rounded-full">
                {job.type}
              </span>
              {job.salary && (
                <span className="text-xs bg-purple-light text-purple-dark px-2 py-1 rounded-full">
                  {job.salary}
                </span>
              )}
            </div>
            
            <p className="text-gray text-sm line-clamp-2 mt-2">
              {job.description}
            </p>
            
            <div className="flex items-center justify-between mt-4">
              <span className="text-xs text-gray">
                Posted: {job.postedAt}
              </span>
              <Button
                onClick={handleApply}
                className={applied ? "bg-gray text-white" : "bg-purple hover:bg-purple-dark text-white"}
                disabled={applied}
              >
                {applied ? "Applied" : "Apply Now"}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default JobCard;
