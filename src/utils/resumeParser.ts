import api from '@/lib/axios';

/**
 * Parse the resume content and extract relevant keywords
 * @param file The resume file
 * @returns Array of extracted keywords
 */
export const parseResume = async (file: File): Promise<string[]> => {
  try {
    // No need to upload the file here, just send the metadata
    // The server will handle the parsing

    return []; // Return empty keywords, as parsing is done server-side
  } catch (error) {
    console.error('Error parsing resume:', error);
    throw error;
  }
};
