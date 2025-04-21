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
      [field]: e.target.value,
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-lg font-semibold mb-4">Filters</h2>
      
      <div className="space-y-4">
        <div>
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            type="text"
            placeholder="Enter location"
            value={filters.location}
            onChange={handleChange('location')}
          />
        </div>
        
        <div>
          <Label htmlFor="type">Job Type</Label>
          <Input
            id="type"
            type="text"
            placeholder="Enter job type"
            value={filters.type}
            onChange={handleChange('type')}
          />
        </div>
        
        <div>
          <Label htmlFor="experience">Experience Level</Label>
          <Input
            id="experience"
            type="text"
            placeholder="Enter experience level"
            value={filters.experience}
            onChange={handleChange('experience')}
          />
        </div>
      </div>
    </div>
  );
};

export default JobFilters; 