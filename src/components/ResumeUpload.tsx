import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, Check, File } from 'lucide-react';
import { useResumeProcessing } from '@/hooks/useResumeProcessing';

interface ResumeUploadProps {
  onUploadSuccess: (keywords: string[]) => void;
}

const ResumeUpload: React.FC<ResumeUploadProps> = ({ onUploadSuccess }) => {
  const [isDragging, setIsDragging] = React.useState(false);
  const [file, setFile] = React.useState<File | null>(null);
  const {
    state,
    progress,
    error,
    keywords,
    uploadResume,
    reset
  } = useResumeProcessing();
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = () => {
    setIsDragging(false);
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFile = e.dataTransfer.files[0];
    handleFileSelection(droppedFile);
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelection(e.target.files[0]);
    }
  };
  
  const handleFileSelection = (selectedFile: File) => {
    // Check file type
    const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    
    if (!validTypes.includes(selectedFile.type)) {
      return;
    }
    
    setFile(selectedFile);
  };
  
  const handleUpload = async () => {
    if (!file) return;
    await uploadResume(file);
    if (keywords.length > 0) {
      onUploadSuccess(keywords);
    }
  };
  
  const handleReset = () => {
    setFile(null);
    reset();
  };
  
  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <div className="text-center mb-6">
          <h3 className="text-xl font-semibold mb-2">Upload Your Resume</h3>
          <p className="text-gray text-sm">
            We'll extract keywords from your resume to find relevant job openings.
          </p>
        </div>
        
        <div 
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            isDragging ? 'border-purple bg-purple-light/20' : 'border-gray-light'
          } ${state === 'success' ? 'bg-green-50 border-green-200' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {!file && state === 'idle' ? (
            <>
              <Upload className="mx-auto h-12 w-12 text-gray mb-4" />
              <p className="font-medium mb-2">Drag and drop your resume here</p>
              <p className="text-gray text-sm mb-4">Supported formats: PDF, DOC, DOCX</p>
              <label
                htmlFor="file-upload"
                className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer"
              >
                Browse Files
                <input
                  id="file-upload"
                  type="file"
                  className="hidden"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileChange}
                />
              </label>
            </>
          ) : state === 'success' ? (
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
                <Check className="h-6 w-6 text-green-600" />
              </div>
              <p className="font-medium text-green-700">Resume uploaded successfully!</p>
              <p className="text-sm text-gray mt-1">We've extracted keywords from your resume.</p>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <File className="mx-auto h-12 w-12 text-purple mb-4" />
              <p className="font-medium mb-1 break-all max-w-full">{file?.name}</p>
              <p className="text-gray text-sm mb-4">
                {file ? `${(file.size / 1024 / 1024).toFixed(2)} MB` : ''}
              </p>
              {state === 'uploading' && (
                <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                  <div
                    className="bg-purple-600 h-2.5 rounded-full"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              )}
              <Button
                onClick={handleUpload}
                disabled={state === 'uploading'}
                className="bg-purple hover:bg-purple-dark"
              >
                {state === 'uploading' ? "Uploading..." : "Upload Resume"}
              </Button>
            </div>
          )}
        </div>
        
        {state === 'success' && (
          <div className="mt-4 flex justify-center">
            <Button
              variant="outline"
              onClick={handleReset}
            >
              Upload Another Resume
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ResumeUpload;
