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

      const formData = new FormData();
      formData.append('resume', file);
      if (user && user.id) {
        formData.append('userId', user.id);
      }

      const response = await api.post('/resume/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / (progressEvent.total || 1)
          );
          setProgress(percentCompleted);
        },
      });

      setKeywords(response.data.keywords);
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