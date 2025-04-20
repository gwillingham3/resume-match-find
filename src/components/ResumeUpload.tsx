
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, Check, File } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface ResumeUploadProps {
  onUploadSuccess: (keywords: string[]) => void;
}

const ResumeUpload: React.FC<ResumeUploadProps> = ({ onUploadSuccess }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const { toast } = useToast();
  
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
      toast({
        title: "Invalid file format",
        description: "Please upload a PDF or Word document (.doc, .docx, .pdf)",
        variant: "destructive",
      });
      return;
    }
    
    setFile(selectedFile);
  };
  
  const handleUpload = async () => {
    if (!file) return;
    
    setIsUploading(true);
    
    // In a real app, this would send the file to a server for processing
    // For now, we'll simulate the process with a timeout and mock data
    setTimeout(() => {
      setIsUploading(false);
      setUploadSuccess(true);
      
      // Mock extracted keywords that would normally come from the server
      const mockKeywords = ['React', 'JavaScript', 'Frontend', 'Web Development', 
                          'TypeScript', 'UI/UX', 'API Integration', 'Node.js'];
      
      toast({
        title: "Resume uploaded successfully",
        description: "Keywords have been extracted from your resume.",
        variant: "default",
      });
      
      onUploadSuccess(mockKeywords);
    }, 2000);
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
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${isDragging ? 'border-purple bg-purple-light/20' : 'border-gray-light'} ${uploadSuccess ? 'bg-green-50 border-green-200' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {!file && !uploadSuccess ? (
            <>
              <Upload className="mx-auto h-12 w-12 text-gray mb-4" />
              <p className="font-medium mb-2">Drag and drop your resume here</p>
              <p className="text-gray text-sm mb-4">Supported formats: PDF, DOC, DOCX</p>
              <Button
                as="label"
                htmlFor="file-upload"
                variant="outline"
                className="cursor-pointer"
              >
                Browse Files
                <input
                  id="file-upload"
                  type="file"
                  className="hidden"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileChange}
                />
              </Button>
            </>
          ) : uploadSuccess ? (
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
              <p className="font-medium mb-1 break-all max-w-full">{file.name}</p>
              <p className="text-gray text-sm mb-4">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
              <Button
                onClick={handleUpload}
                disabled={isUploading}
                className="bg-purple hover:bg-purple-dark"
              >
                {isUploading ? "Uploading..." : "Upload Resume"}
              </Button>
            </div>
          )}
        </div>
        
        {uploadSuccess && (
          <div className="mt-4 flex justify-center">
            <Button
              variant="outline"
              onClick={() => {
                setFile(null);
                setUploadSuccess(false);
              }}
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
