import React, { createContext, useContext, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import api from '@/lib/axios';
import { useAuthStorage } from '@/hooks/use-local-storage';

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, name: string) => Promise<boolean>;
  googleLogin: () => Promise<boolean>;
  githubLogin: () => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, setUser, token, setToken, clearAuth } = useAuthStorage();
  const [isLoading, setIsLoading] = React.useState(true);
  const { toast } = useToast();
  
  const isAuthenticated = !!user && !!token;
  
  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        if (token) {
          // Verify token with backend
          await api.get('/auth/verify');
        }
      } catch (error) {
        console.error('Auth verification failed:', error);
        clearAuth();
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, [token, clearAuth]);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      const response = await api.post('/auth/login', {
        email,
        password,
      });
      
      const { user: userData, token: tokenData } = response.data;
      setUser(userData);
      setToken(tokenData);
      
      toast({
        title: "Login successful",
        description: "Welcome back to JobMatch!",
      });
      
      return true;
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Login failed",
        description: "Invalid email or password. Please try again.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  const register = async (email: string, password: string, name: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      const response = await api.post('/auth/register', {
        email,
        password,
        name,
      });
      
      const { user: userData, token: tokenData } = response.data;
      setUser(userData);
      setToken(tokenData);
      
      toast({
        title: "Registration successful",
        description: "Welcome to JobMatch! Your account has been created.",
      });
      
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      toast({
        title: "Registration failed",
        description: "There was a problem creating your account. Please try again.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  
  const googleLogin = async (): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      const response = await api.post('/auth/google');
      const { user: userData, token: tokenData } = response.data;
      
      setUser(userData);
      setToken(tokenData);
      
      toast({
        title: "Google login successful",
        description: "Welcome to JobMatch!",
      });
      
      return true;
    } catch (error) {
      console.error('Google login error:', error);
      toast({
        title: "Google login failed",
        description: "There was a problem logging in with Google. Please try again.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  const githubLogin = async (): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      const response = await api.post('/auth/github');
      const { user: userData, token: tokenData } = response.data;
      
      setUser(userData);
      setToken(tokenData);
      
      toast({
        title: "GitHub login successful",
        description: "Welcome to JobMatch!",
      });
      
      return true;
    } catch (error) {
      console.error('GitHub login error:', error);
      toast({
        title: "GitHub login failed",
        description: "There was a problem logging in with GitHub. Please try again.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
      clearAuth();
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        title: "Logout failed",
        description: "There was a problem logging you out. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      isLoading,
      login,
      register,
      logout,
      googleLogin,
      githubLogin
    }}>
      {children}
    </AuthContext.Provider>
  );
};
