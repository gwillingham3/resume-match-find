import { useState } from 'react';
import api from '@/lib/axios';
import { useToast } from '@/hooks/use-toast';

type ProcessingState = 'idle' | 'uploading' | 'processing' | 'completed' | 'error';

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

  const uploadResume = async (file: File) => {
    try {
      setState('uploading');
      setProgress(0);
      setError(null);

      const formData = new FormData();
      formData.append('resume', file);

      const response = await api.post('/resume/upload', formData, {
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / (progressEvent.total || 1)
          );
          setProgress(percentCompleted);
        },
      });

      setState('processing');
      setKeywords(response.data.keywords);
      setState('completed');
      
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