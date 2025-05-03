import React from 'react';
import JobList from './JobList';
import { Button } from "@/components/ui/button";

interface PaginatedJobListProps {
  totalPages: number;
  page: number;
  handlePageChange: (newPage: number) => void;
  children: React.ReactNode;
}

const PaginatedJobList: React.FC<PaginatedJobListProps> = ({ totalPages, page, handlePageChange, children }) => {
  return (
    <div>
      {children}
      {totalPages > 1 && (
        <div className="flex justify-center mt-8">
          <Button
            variant="outline"
            disabled={page === 1}
            onClick={() => handlePageChange(page - 1)}
          >
            Previous
          </Button>
          <span className="mx-4 self-center text-gray-500">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="outline"
            disabled={page === totalPages}
            onClick={() => handlePageChange(page + 1)}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
};

export default PaginatedJobList;
