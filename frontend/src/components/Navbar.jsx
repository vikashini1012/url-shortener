import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Link as LinkIcon, LogOut } from 'lucide-react';

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const onLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <LinkIcon className="h-6 w-6 text-indigo-600" />
            <span className="font-bold text-xl text-gray-900">ShortLink</span>
          </Link>
          
          <div className="flex items-center space-x-4">
            {token ? (
              <>
                <Link to="/dashboard" className="text-gray-600 hover:text-indigo-600 px-3 py-2 rounded-md font-medium">
                  Dashboard
                </Link>
                <button
                  onClick={onLogout}
                  className="flex items-center space-x-1 text-gray-600 hover:text-red-600 px-3 py-2 rounded-md font-medium transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-600 hover:text-indigo-600 px-3 py-2 rounded-md font-medium">
                  Login
                </Link>
                <Link to="/register" className="bg-indigo-600 text-white hover:bg-indigo-700 px-4 py-2 rounded-md font-medium transition-colors">
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
