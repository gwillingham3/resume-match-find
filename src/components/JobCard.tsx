import React from 'react';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bookmark, Send, MapPin, Briefcase, DollarSign } from 'lucide-react';
import { useJobContext } from '@/context/JobContext';
import { Job } from '@/types';

interface JobCardProps {
  job: Job;
}

const JobCard: React.FC<JobCardProps> = ({ job }) => {
  const { savedJobs, appliedJobs, saveJob, unsaveJob, applyToJob } = useJobContext();
  const isSaved = savedJobs.includes(job.id);
  const isApplied = appliedJobs.includes(job.id);
  console.log(job);

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold text-navy">{job.job_title}</h3>
            <p className="text-gray mt-1">{job.employer_name}</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => isSaved ? unsaveJob(job.id) : saveJob(job.id)}
            className={isSaved ? 'text-purple' : 'text-gray'}
          >
            <Bookmark className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="mt-4 space-y-2">
          <div className="flex items-center text-sm text-gray">
            <MapPin className="h-4 w-4 mr-2" />
            <span>{job.job_location}</span>
          </div>
          <div className="flex items-center text-sm text-gray">
            <Briefcase className="h-4 w-4 mr-2" />
            <span>{job.job_employment_type}</span>
          </div>
           <div className="flex items-center text-sm text-gray">
            <DollarSign className="h-4 w-4 mr-2" />
            <span>{job.salary_raw && job.salary_raw.value && job.salary_raw.value.minValue} - {job.salary_raw && job.salary_raw.value && job.salary_raw.value.maxValue} {job.salary_raw && job.salary_raw.currency}</span>
          </div>
        </div>

        <p className="mt-4 text-sm text-gray line-clamp-2">{job.job_description}</p>
        <p className="mt-4 text-sm text-gray line-clamp-2"><a href="#" target="_blank" rel="noopener noreferrer">View More</a></p>
      </CardContent>
      
      <CardFooter className="border-t p-4">
        <Button
          variant={isApplied ? "outline" : "default"}
          className="w-full"
          onClick={() => !isApplied && applyToJob(job.id)}
          disabled={isApplied}
        >
          {isApplied ? "Applied" : "Apply Now"}
          {!isApplied && <Send className="ml-2 h-4 w-4" />}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default JobCard;
