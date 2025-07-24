export interface Job {
  id: string;
  job_title: string;
  employer_name: string;
  job_description: string;
  job_location: string;
  url: string;
  job_salary: number;
  salary_raw?: {
    "@type": string;
    currency: string;
    value: {
      "@type": string;
      maxValue: number;
      minValue: number;
      unitText: string;
    };
  };
  job_employment_type: string;
  date_posted?: string;
}

export interface JobFilters {
  location: string;
  type: string;
  experience: string;
  keywords: string[];
}
