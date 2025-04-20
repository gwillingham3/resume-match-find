
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Search, User, Menu, X } from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  return (
    <header className="bg-white shadow-sm py-4 px-4 md:px-8">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <div className="w-10 h-10 rounded-lg gradient-bg flex items-center justify-center">
            <span className="text-white font-bold text-xl">J</span>
          </div>
          <span className="font-bold text-xl text-navy hidden sm:inline">JobMatch</span>
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link to="/dashboard" className="text-gray hover:text-purple transition-colors">Dashboard</Link>
          <Link to="/jobs" className="text-gray hover:text-purple transition-colors">Find Jobs</Link>
          <Link to="/profile" className="text-gray hover:text-purple transition-colors">Profile</Link>
        </nav>
        
        <div className="hidden md:flex items-center space-x-4">
          <Button variant="ghost" size="icon" className="text-gray">
            <Search className="h-5 w-5" />
          </Button>
          <Link to="/profile">
            <Button variant="ghost" size="icon" className="text-gray">
              <User className="h-5 w-5" />
            </Button>
          </Link>
          <Link to="/auth">
            <Button className="bg-purple hover:bg-purple-dark text-white">Sign In</Button>
          </Link>
        </div>
        
        {/* Mobile Menu Button */}
        <Button 
          variant="ghost" 
          size="icon" 
          className="md:hidden text-gray"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </div>
      
      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-white shadow-md z-50 animate-fade-in">
          <nav className="flex flex-col p-4 space-y-3">
            <Link 
              to="/dashboard" 
              className="text-gray hover:text-purple transition-colors px-4 py-2 hover:bg-gray-light rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              Dashboard
            </Link>
            <Link 
              to="/jobs" 
              className="text-gray hover:text-purple transition-colors px-4 py-2 hover:bg-gray-light rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              Find Jobs
            </Link>
            <Link 
              to="/profile" 
              className="text-gray hover:text-purple transition-colors px-4 py-2 hover:bg-gray-light rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              Profile
            </Link>
            <Link 
              to="/auth" 
              className="bg-purple text-white px-4 py-2 rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              Sign In
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
