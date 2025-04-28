export interface Job {
  id: string;
  title: string;
  organization: string;
  locations_derived: string[];
  url: string;
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
  employment_type?: string[];
  date_posted?: string;
}

export interface JobFilters {
  location: string;
  type: string;
  experience: string;
  keywords: string[];
}
