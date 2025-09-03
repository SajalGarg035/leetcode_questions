import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Header = () => {
  const location = useLocation();

  return (
    <header className="bg-primary-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold hover:text-primary-200 transition-colors">
            Question Generator
          </Link>
          
          <nav className="flex space-x-6">
            <Link
              to="/"
              className={`px-3 py-2 rounded-md transition-colors ${
                location.pathname === '/'
                  ? 'bg-primary-700 text-white'
                  : 'text-primary-100 hover:text-white hover:bg-primary-500'
              }`}
            >
              Home
            </Link>
            <Link
              to="/questions"
              className={`px-3 py-2 rounded-md transition-colors ${
                location.pathname === '/questions'
                  ? 'bg-primary-700 text-white'
                  : 'text-primary-100 hover:text-white hover:bg-primary-500'
              }`}
            >
              Generate Questions
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
