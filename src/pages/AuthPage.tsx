
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Auth from '@/components/Auth';
import { useAuth } from '@/context/AuthContext';

const AuthPage = () => {
  const { isAuthenticated, login, register, googleLogin, githubLogin } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Redirect to dashboard if already authenticated
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow py-12 px-4 bg-gray-light/30">
        <div className="max-w-md mx-auto">
          <Auth />
        </div>
      </main>
      
      <footer className="bg-gray-light/50 py-6 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <p className="text-sm text-gray">© 2025 JobMatch. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AuthPage;
