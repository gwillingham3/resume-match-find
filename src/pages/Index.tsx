
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import Header from '@/components/Header';
import { useAuth } from '@/context/AuthContext';

const Index = () => {
  const { isAuthenticated } = useAuth();
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="py-16 md:py-24 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-1/2 mb-10 md:mb-0 pr-0 md:pr-12">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-navy mb-6 leading-tight">
                  Find Your <span className="text-purple">Perfect Job</span> Match with AI
                </h1>
                <p className="text-gray text-lg mb-8 max-w-lg">
                  Upload your resume and let our AI match you with job opportunities that fit your skills and experience from GitHub Jobs.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link to={isAuthenticated ? "/dashboard" : "/auth"}>
                    <Button size="lg" className="bg-purple hover:bg-purple-dark text-white">
                      {isAuthenticated ? "Go to Dashboard" : "Get Started"}
                    </Button>
                  </Link>
                  <Link to="/jobs">
                    <Button size="lg" variant="outline" className="border-purple text-purple hover:bg-purple-light">
                      Browse Jobs
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="md:w-1/2">
                <div className="relative">
                  <div className="absolute -top-6 -left-6 w-32 h-32 rounded-full gradient-bg opacity-20 animate-pulse-light"></div>
                  <div className="absolute -bottom-8 -right-8 w-40 h-40 rounded-full gradient-bg opacity-20 animate-pulse-light"></div>
                  <img 
                    src="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d" 
                    alt="Person using laptop to search for jobs" 
                    className="rounded-2xl shadow-lg w-full object-cover max-h-96 md:max-h-full z-10 relative"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <section className="bg-gray-light/50 py-16 px-4">
          <div className="max-w-7xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold text-navy mb-4">How JobMatch Works</h2>
            <p className="text-gray max-w-xl mx-auto">
              Our AI-powered platform makes finding your next job opportunity easier than ever
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="w-14 h-14 rounded-full gradient-bg flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                  <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                  <polyline points="14 2 14 8 20 8" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-navy">1. Upload Your Resume</h3>
              <p className="text-gray">
                Start by uploading your resume in PDF or Word format. Our AI will analyze your skills and experience.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="w-14 h-14 rounded-full gradient-bg flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.3-4.3" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-navy">2. Get Matched</h3>
              <p className="text-gray">
                We'll match you with relevant job openings from GitHub Jobs based on the keywords extracted from your resume.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="w-14 h-14 rounded-full gradient-bg flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                  <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                  <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-navy">3. Apply and Track</h3>
              <p className="text-gray">
                Apply to jobs directly and keep track of your applications in one place. Save interesting positions for later.
              </p>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-16 px-4">
          <div className="max-w-5xl mx-auto rounded-2xl overflow-hidden shadow-lg">
            <div className="gradient-bg p-8 md:p-12 flex flex-col md:flex-row items-center justify-between">
              <div className="mb-6 md:mb-0 md:mr-8">
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                  Ready to find your dream job?
                </h2>
                <p className="text-white/90 max-w-md">
                  Create an account now and start matching with opportunities that align with your skills and experience.
                </p>
              </div>
              <Link to={isAuthenticated ? "/dashboard" : "/auth"}>
                <Button size="lg" className="bg-white text-purple hover:bg-gray-100">
                  {isAuthenticated ? "Go to Dashboard" : "Get Started Now"}
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      
      {/* Footer */}
      <footer className="bg-navy text-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="mb-8 md:mb-0">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center">
                  <span className="text-purple font-bold text-xl">J</span>
                </div>
                <span className="font-bold text-xl">JobMatch</span>
              </div>
              <p className="text-white/60 max-w-md">
                JobMatch is an AI-powered platform that helps job seekers find relevant opportunities based on their skills and experience.
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              <div>
                <h3 className="font-semibold mb-4">Product</h3>
                <ul className="space-y-2">
                  <li><a href="#" className="text-white/60 hover:text-white">Features</a></li>
                  <li><a href="#" className="text-white/60 hover:text-white">Pricing</a></li>
                  <li><a href="#" className="text-white/60 hover:text-white">API</a></li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold mb-4">Company</h3>
                <ul className="space-y-2">
                  <li><a href="#" className="text-white/60 hover:text-white">About</a></li>
                  <li><a href="#" className="text-white/60 hover:text-white">Blog</a></li>
                  <li><a href="#" className="text-white/60 hover:text-white">Careers</a></li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold mb-4">Resources</h3>
                <ul className="space-y-2">
                  <li><a href="#" className="text-white/60 hover:text-white">Support</a></li>
                  <li><a href="#" className="text-white/60 hover:text-white">Documentation</a></li>
                  <li><a href="#" className="text-white/60 hover:text-white">Privacy Policy</a></li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="border-t border-white/10 mt-12 pt-8 text-center md:text-left">
            <p className="text-white/60">© 2025 JobMatch. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
