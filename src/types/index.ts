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

export interface JobFilters {
  location: string;
  type: string;
  experience: string;
  keywords: string[];
} 