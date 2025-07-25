import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, File, Briefcase, Calendar } from 'lucide-react';
import JobCard from '@/components/JobCard';
import ResumeUpload from './ResumeUpload';
import { useJobContext } from '@/context/JobContext';
import { useAuth } from '@/context/AuthContext';
import axios from 'axios';
import { Job } from '@/types';
import { Input } from "@/components/ui/input";
import { useAuthStorage } from '@/hooks/use-local-storage';

interface UserProfileProps {
  user: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    resumeIds?: string[];
  };
  hasResume: boolean;
  savedJobs: Job[];
  appliedJobs: Job[];
  onRemoveSaved: (jobId: string) => void;
  onRemoveApplied: (jobId: string) => void;
}

const UserProfile: React.FC<UserProfileProps> = ({
  user,
  hasResume
}) => {
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditMode, setIsEditMode] = useState(false);
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const { jobs, savedJobs, appliedJobs } = useJobContext();
  const { logout } = useAuth();
  const { token } = useAuthStorage();

  const savedJobList = jobs.filter(job => savedJobs.includes(job.id));
  const appliedJobList = jobs.filter(job => appliedJobs.includes(job.id));

  console.log("Here are the resumeIds: " + user.resumeIds);
  console.log("Here is the name: " + user.name);

  const handleCancel = () => {
    setIsEditMode(false);
    setName(user.name);
    setEmail(user.email);
  };

  const handleSave = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      await axios.put(`${apiUrl}/auth/profile`, { name, email }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      setIsEditMode(false);
    } catch (error: any) {
      console.error('Error updating profile:', error.response?.data || error.message);
    }
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
        <Button className="bg-purple hover:bg-purple-dark" onClick={() => setIsEditMode(true)}>
          {isEditMode ? "Cancel" : "Edit Profile"}
        </Button>
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
              {savedJobList.length > 0 && (
                <span className="ml-1 bg-purple text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                  {savedJobList.length}
                </span>
              )}
            </span>
          </TabsTrigger>
          <TabsTrigger value="applied" className="flex items-center space-x-2">
            <Calendar size={16} />
            <span className="flex items-center">
              Applied
              {appliedJobList.length > 0 && (
                <span className="ml-1 bg-purple text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                  {appliedJobList.length}
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
              {isEditMode ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray mb-1">Full Name</h4>
                      <Input type="text" value={name} onChange={(e) => setName(e.target.value)} />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray mb-1">Email</h4>
                      <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <div>
                      <Button onClick={handleSave}>Save</Button>
                      <Button variant="outline" onClick={handleCancel}>Cancel</Button>
                    </div>
                  </div>
                </>
              ) : (
                <>
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
                  <Button onClick={logout}>Sign Out</Button>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="resume" className="mt-6">
          {user.resumeIds && user.resumeIds.length > 0 ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <File className="mr-2 h-5 w-5" /> Your Resumes
                </CardTitle>
              </CardHeader>
              <CardContent>
                {user.resumeIds && user.resumeIds.map((resumeId) => (
                  <div key={resumeId} className="p-4 border border-gray-light rounded-lg mb-4">
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
                ))}
                <Button>Upload New Resume</Button>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <File className="mr-2 h-5 w-5" /> Your Resume
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResumeUpload onUploadSuccess={() => { }} />
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="saved" className="mt-6">
          <h3 className="text-xl font-semibold mb-4">Saved Jobs</h3>
          {savedJobList.length === 0 ? (
            <Card className="p-6 text-center">
              <p className="text-gray mb-4">You haven't saved any jobs yet.</p>
              <Button asChild>
                <a href="/jobs">Browse Jobs</a>
              </Button>
            </Card>
          ) : (
            <div className="space-y-4">
              {savedJobList.map((job) => (
                <JobCard 
                  key={job.id} 
                  job={job}
                />
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="applied" className="mt-6">
          <h3 className="text-xl font-semibold mb-4">Applied Jobs</h3>
          {appliedJobList.length === 0 ? (
            <Card className="p-6 text-center">
              <p className="text-gray mb-4">You haven't applied to any jobs yet.</p>
              <Button asChild>
                <a href="/jobs">Browse Jobs</a>
              </Button>
            </Card>
          ) : (
            <div className="space-y-4">
              {appliedJobList.map((job) => (
                <JobCard 
                  key={job.id} 
                  job={job}
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
