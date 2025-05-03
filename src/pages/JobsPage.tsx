import React, { useState, useEffect } from 'react';
import { useJobContext } from '@/context/JobContext';
import JobList from '@/components/JobList';
import { JobFilters } from '@/types';
import { useAuthStorage } from '@/hooks/use-local-storage';
import { useAuth } from '@/context/AuthContext';
import axios from 'axios';
import { Input } from "@/components/ui/input";
import { Search } from 'lucide-react';
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import PaginatedJobList from '@/components/PaginatedJobList';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const JobsPage: React.FC = () => {
  const [filters, setFilters] = useState<JobFilters>({
    keywords: [],
    location: '',
    type: '',
    experience: ''
  });
  const { savedJobs, appliedJobs, saveJob, unsaveJob, applyToJob } = useJobContext();
  const { token } = useAuthStorage();
  const [searchTerm, setSearchTerm] = useState('');
  const [sort, setSort] = useState('newest');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 20;
  const [jobs, setJobs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchJobs = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`http://localhost:3000/api/jobs?page=${page}&limit=${limit}&search=${searchTerm}&sort=${sort}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          }
        });
        console.log("Here is the response data in the JobsPage component: ", response.data);
        console.log("totalPages from API: ", response.data.totalPages);
        setJobs(response.data.jobs);
        setTotalPages(response.data.totalPages);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobs();
  }, [page, searchTerm, token, sort]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setPage(1); // Reset to first page on new search
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleSortChange = (value: string) => {
    setSort(value);
    setPage(1);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-navy mb-8">Find Your Next Job</h1>

      <div className="flex flex-col space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray" size={18} />
          <Input
            className="pl-10 input-field"
            placeholder="Search for jobs, companies, or keywords"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
        <Select onValueChange={handleSortChange}>
            <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="oldest">Oldest</SelectItem>
            </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
      ) : null}
      <PaginatedJobList
        totalPages={totalPages}
        page={page}
        handlePageChange={handlePageChange}
      >
        <JobList
          filters={filters}
          savedJobs={savedJobs}
          appliedJobs={appliedJobs}
          onSaveJob={saveJob}
          onApplyJob={applyToJob}
          token={token}
        />
      </PaginatedJobList>
    </div>
  );
};

export default JobsPage;
