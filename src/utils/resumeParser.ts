import api from '@/lib/axios';

// This is a mock resume parser utility
// In a real application, this would interact with a backend service
// that uses NLP or ML to extract relevant keywords from resumes

/**
 * Parse the resume content and extract relevant keywords
 * @param fileContent The content of the resume file
 * @returns Array of extracted keywords
 */
export const parseResume = async (file: File): Promise<string[]> => {
  const formData = new FormData();
  formData.append('resume', file);
  
  try {
    const response = await api.post('/resume/parse', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.keywords;
  } catch (error) {
    console.error('Error parsing resume:', error);
    throw error;
  }
};

/**
 * Mock function to fetch job listings based on keywords
 * In a real app, this would query the GitHub Jobs API
 * @param keywords Keywords extracted from the resume
 * @returns Promise resolving to job listings
 */
export const fetchJobsBasedOnKeywords = async (keywords: string[]) => {
  try {
    const response = await api.post('/jobs/search', { keywords });
    return response.data.jobs;
  } catch (error) {
    console.error('Error fetching jobs:', error);
    throw error;
  }
};
