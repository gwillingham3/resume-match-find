import { useState } from 'react';
import api from '@/lib/axios';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';

type ProcessingState = 'idle' | 'uploading' | 'success' | 'error';

interface UseResumeProcessingReturn {
  state: ProcessingState;
  progress: number;
  error: string | null;
  keywords: string[];
  uploadResume: (file: File) => Promise<void>;
  reset: () => void;
}

export const useResumeProcessing = (): UseResumeProcessingReturn => {
  const [state, setState] = useState<ProcessingState>('idle');
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [keywords, setKeywords] = useState<string[]>([]);
  const { toast } = useToast();
  const { user } = useAuth();

  const uploadResume = async (file: File) => {
    try {
      setState('uploading');
      setProgress(0);
      setError(null);

      const filename = file.name;
      const contentType = file.type;

      const presignedResponse = await api.get('/resume/presigned', {
        params: {
          filename,
          contentType,
        },
      });

      const { uploadURL, key } = presignedResponse.data;

      // Upload the file to S3 using the presigned URL
      const response = await fetch(uploadURL, {
        method: 'PUT',
        headers: {
        },
        body: file,
      });

      if (!response.ok) {
        throw new Error(`Failed to upload resume: ${response.status} ${response.statusText}`);
      }

      const metadata = JSON.stringify({
        key,
        userId: user?.id,
        contentType: contentType,
        contentLength: file.size,
      });

      // Send a request to the server to save the resume metadata
      await api.post('/resume/metadata', {
        headers: {
          contentType: contentType,
        },
        data: {
          key: key,
          userId: user?.id,
          contentType: contentType,
          contentLength: file.size,
        },
      });

      setState('success');
      
      toast({
        title: "Resume uploaded successfully",
        description: "Keywords have been extracted from your resume.",
        variant: "default",
      });
    } catch (err) {
      setState('error');
      const errorMessage = err instanceof Error ? err.message : 'Failed to process resume';
      setError(errorMessage);
      
      toast({
        title: "Upload failed",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const reset = () => {
    setState('idle');
    setProgress(0);
    setError(null);
    setKeywords([]);
  };

  return {
    state,
    progress,
    error,
    keywords,
    uploadResume,
    reset,
  };
};
