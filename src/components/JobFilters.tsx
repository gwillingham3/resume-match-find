import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { JobFilters as JobFiltersType } from '@/types';

interface JobFiltersProps {
  filters: JobFiltersType;
  onFilterChange: (filters: JobFiltersType) => void;
}

const JobFilters: React.FC<JobFiltersProps> = ({ filters, onFilterChange }) => {
  const handleChange = (field: keyof JobFiltersType) => (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({
      ...filters,
      [field]: e.target.value
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="location">Location</Label>
        <Input
          id="location"
          value={filters.location}
          onChange={handleChange('location')}
          placeholder="Enter location"
        />
      </div>
      
      <div>
        <Label htmlFor="type">Job Type</Label>
        <Input
          id="type"
          value={filters.type}
          onChange={handleChange('type')}
          placeholder="Enter job type"
        />
      </div>
      
      <div>
        <Label htmlFor="experience">Experience Level</Label>
        <Input
          id="experience"
          value={filters.experience}
          onChange={handleChange('experience')}
          placeholder="Enter experience level"
        />
      </div>
    </div>
  );
};

export default JobFilters; 