
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, File, Briefcase, Calendar } from 'lucide-react';
import JobCard, { Job } from './JobCard';
import ResumeUpload from './ResumeUpload';

interface UserProfileProps {
  user: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  savedJobs: Job[];
  appliedJobs: Job[];
  hasResume: boolean;
  onRemoveSaved: (jobId: string) => void;
  onRemoveApplied: (jobId: string) => void;
}

const UserProfile: React.FC<UserProfileProps> = ({
  user,
  savedJobs,
  appliedJobs,
  hasResume,
  onRemoveSaved,
  onRemoveApplied
}) => {
  const [activeTab, setActiveTab] = useState('profile');
  
  const handleUnsaveJob = (job: Job) => {
    onRemoveSaved(job.id);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center space-x-4">
          <Avatar className="w-16 h-16 border-2 border-purple">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback className="bg-purple text-white text-xl">
              {user.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-2xl font-bold text-navy">{user.name}</h2>
            <p className="text-gray">{user.email}</p>
          </div>
        </div>
        <Button className="bg-purple hover:bg-purple-dark">Edit Profile</Button>
      </div>
      
      <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3 md:grid-cols-4">
          <TabsTrigger value="profile" className="flex items-center space-x-2">
            <User size={16} />
            <span>Profile</span>
          </TabsTrigger>
          <TabsTrigger value="resume" className="flex items-center space-x-2">
            <File size={16} />
            <span>Resume</span>
          </TabsTrigger>
          <TabsTrigger value="saved" className="flex items-center space-x-2">
            <Briefcase size={16} />
            <span className="flex items-center">
              Saved
              {savedJobs.length > 0 && (
                <span className="ml-1 bg-purple text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                  {savedJobs.length}
                </span>
              )}
            </span>
          </TabsTrigger>
          <TabsTrigger value="applied" className="flex items-center space-x-2">
            <Calendar size={16} />
            <span className="flex items-center">
              Applied
              {appliedJobs.length > 0 && (
                <span className="ml-1 bg-purple text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                  {appliedJobs.length}
                </span>
              )}
            </span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray mb-1">Full Name</h4>
                  <p>{user.name}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray mb-1">Email</h4>
                  <p>{user.email}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray mb-1">User ID</h4>
                  <p className="text-sm font-mono">{user.id}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray mb-1">Account Type</h4>
                  <p>Basic</p>
                </div>
              </div>
              
              <div className="pt-4 border-t border-gray-light">
                <h4 className="font-medium mb-2">Account Actions</h4>
                <div className="flex flex-wrap gap-4">
                  <Button variant="outline">Change Password</Button>
                  <Button variant="outline" className="text-destructive border-destructive hover:bg-destructive/10">
                    Delete Account
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="resume" className="mt-6">
          {hasResume ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <File className="mr-2 h-5 w-5" /> Your Resume
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="p-4 border border-gray-light rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="bg-purple/10 rounded-lg p-2">
                        <File className="h-8 w-8 text-purple" />
                      </div>
                      <div>
                        <h4 className="font-medium">resume.pdf</h4>
                        <p className="text-sm text-gray">Uploaded on April 15, 2025</p>
                      </div>
                    </div>
                    <div className="space-x-2">
                      <Button variant="outline" size="sm">View</Button>
                      <Button variant="outline" size="sm">Replace</Button>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <h4 className="font-medium mb-2">Extracted Keywords</h4>
                    <div className="flex flex-wrap gap-2">
                      {['React', 'JavaScript', 'TypeScript', 'UI/UX', 'Frontend', 'Web Development', 'Node.js', 'API Integration'].map((keyword, index) => (
                        <span 
                          key={index}
                          className="bg-purple-light text-purple-dark px-3 py-1 rounded-full text-sm"
                        >
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <ResumeUpload onUploadSuccess={() => {}} />
          )}
        </TabsContent>
        
        <TabsContent value="saved" className="mt-6">
          <h3 className="text-xl font-semibold mb-4">Saved Jobs</h3>
          {savedJobs.length === 0 ? (
            <Card className="p-6 text-center">
              <p className="text-gray mb-4">You haven't saved any jobs yet.</p>
              <Button asChild>
                <a href="/jobs">Browse Jobs</a>
              </Button>
            </Card>
          ) : (
            <div className="space-y-4">
              {savedJobs.map((job) => (
                <JobCard 
                  key={job.id} 
                  job={job} 
                  saved={true}
                  onSave={handleUnsaveJob}
                />
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="applied" className="mt-6">
          <h3 className="text-xl font-semibold mb-4">Applied Jobs</h3>
          {appliedJobs.length === 0 ? (
            <Card className="p-6 text-center">
              <p className="text-gray mb-4">You haven't applied to any jobs yet.</p>
              <Button asChild>
                <a href="/jobs">Browse Jobs</a>
              </Button>
            </Card>
          ) : (
            <div className="space-y-4">
              {appliedJobs.map((job) => (
                <JobCard 
                  key={job.id} 
                  job={job} 
                  applied={true}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserProfile;
