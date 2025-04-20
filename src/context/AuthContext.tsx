
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";

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
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  googleLogin: () => Promise<void>;
  githubLogin: () => Promise<void>;
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
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  
  useEffect(() => {
    // Check if user is stored in localStorage (for persistence)
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error('Failed to parse stored user', e);
        localStorage.removeItem('user');
      }
    }
    setIsLoading(false);
  }, []);
  
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    
    try {
      // In a real app, this would authenticate with a backend
      // For now, we'll just mock successful authentication
      
      // Mock successful login after delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      const mockUser: User = {
        id: 'user123',
        name: 'John Doe',
        email: email,
      };
      
      setUser(mockUser);
      localStorage.setItem('user', JSON.stringify(mockUser));
      
      toast({
        title: "Login successful",
        description: "Welcome back to JobMatch!",
      });
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Login failed",
        description: "Invalid email or password. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const register = async (email: string, password: string, name: string) => {
    setIsLoading(true);
    
    try {
      // In a real app, this would register with a backend
      // For now, we'll just mock successful registration
      
      // Mock successful registration after delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      const newUser: User = {
        id: 'user' + Math.floor(Math.random() * 1000),
        name: name,
        email: email,
      };
      
      setUser(newUser);
      localStorage.setItem('user', JSON.stringify(newUser));
      
      toast({
        title: "Registration successful",
        description: "Welcome to JobMatch! Your account has been created.",
      });
    } catch (error) {
      console.error('Registration error:', error);
      toast({
        title: "Registration failed",
        description: "There was a problem creating your account. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
  };
  
  const googleLogin = async () => {
    setIsLoading(true);
    
    try {
      // Mock OAuth login with Google
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      const mockUser: User = {
        id: 'google123',
        name: 'Jane Smith',
        email: 'jane.smith@gmail.com',
        avatar: 'https://i.pravatar.cc/150?u=jane',
      };
      
      setUser(mockUser);
      localStorage.setItem('user', JSON.stringify(mockUser));
      
      toast({
        title: "Google login successful",
        description: "Welcome to JobMatch!",
      });
    } catch (error) {
      console.error('Google login error:', error);
      toast({
        title: "Google login failed",
        description: "There was a problem logging in with Google. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const githubLogin = async () => {
    setIsLoading(true);
    
    try {
      // Mock OAuth login with GitHub
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      const mockUser: User = {
        id: 'github456',
        name: 'Dev Coder',
        email: 'dev.coder@github.com',
        avatar: 'https://i.pravatar.cc/150?u=dev',
      };
      
      setUser(mockUser);
      localStorage.setItem('user', JSON.stringify(mockUser));
      
      toast({
        title: "GitHub login successful",
        description: "Welcome to JobMatch!",
      });
    } catch (error) {
      console.error('GitHub login error:', error);
      toast({
        title: "GitHub login failed",
        description: "There was a problem logging in with GitHub. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    googleLogin,
    githubLogin,
  };
  
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
