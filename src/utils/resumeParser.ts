
// This is a mock resume parser utility
// In a real application, this would interact with a backend service
// that uses NLP or ML to extract relevant keywords from resumes

/**
 * Parse the resume content and extract relevant keywords
 * @param fileContent The content of the resume file
 * @returns Array of extracted keywords
 */
export const parseResume = async (file: File): Promise<string[]> => {
  return new Promise((resolve) => {
    // This would normally send the file to a backend for processing
    // For now, we'll return mock data after a delay to simulate processing
    setTimeout(() => {
      // Mock extracted keywords
      const keywords = [
        'React',
        'JavaScript',
        'TypeScript',
        'Frontend Development',
        'UI/UX Design',
        'API Integration',
        'Node.js',
        'Express',
        'MongoDB',
        'REST API',
        'GraphQL',
        'CSS',
        'HTML',
        'Responsive Design',
        'Git',
        'Agile',
      ];
      
      // Randomly select 8-10 keywords from the list to simulate different resumes
      const shuffled = [...keywords].sort(() => 0.5 - Math.random());
      const selected = shuffled.slice(0, Math.floor(Math.random() * 3) + 8);
      
      resolve(selected);
    }, 2000);
  });
};

/**
 * Mock function to fetch job listings based on keywords
 * In a real app, this would query the GitHub Jobs API
 * @param keywords Keywords extracted from the resume
 * @returns Promise resolving to job listings
 */
export const fetchJobsBasedOnKeywords = async (keywords: string[]) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Mock job data
      const mockJobs = [
        {
          id: '1',
          title: 'Frontend Developer',
          company: 'TechCorp',
          location: 'Remote',
          type: 'Full-time',
          logo: '',
          description: 'We are looking for a skilled Frontend Developer with experience in React, TypeScript, and modern web development practices...',
          url: 'https://example.com/job/1',
          postedAt: '2 days ago',
        },
        {
          id: '2',
          title: 'Full Stack JavaScript Developer',
          company: 'WebSolutions Inc.',
          location: 'New York, NY',
          type: 'Full-time',
          logo: '',
          description: 'Join our team as a Full Stack Developer working with Node.js, React, and MongoDB to build scalable web applications...',
          url: 'https://example.com/job/2',
          postedAt: '1 week ago',
        },
        {
          id: '3',
          title: 'React Native Developer',
          company: 'MobileApps Co.',
          location: 'San Francisco, CA',
          type: 'Contract',
          logo: '',
          description: 'Develop cross-platform mobile applications using React Native. Experience with TypeScript and API integration required...',
          url: 'https://example.com/job/3',
          salary: '$120k - $150k',
          postedAt: '3 days ago',
        },
        {
          id: '4',
          title: 'UI/UX Developer',
          company: 'DesignHub',
          location: 'Remote',
          type: 'Full-time',
          logo: '',
          description: 'Looking for a UI/UX Developer with strong frontend skills to create beautiful and functional user interfaces...',
          url: 'https://example.com/job/4',
          postedAt: 'Just now',
        },
        {
          id: '5',
          title: 'Senior Frontend Engineer',
          company: 'StartupX',
          location: 'Austin, TX',
          type: 'Full-time',
          logo: '',
          description: 'Senior Frontend Engineer needed to lead our web development efforts. Experience with React, state management, and performance optimization required...',
          url: 'https://example.com/job/5',
          salary: '$140k - $180k',
          postedAt: '5 days ago',
        },
      ];
      
      resolve(mockJobs);
    }, 1500);
  });
};
