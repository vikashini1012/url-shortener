import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Link as LinkIcon, LogOut, LayoutDashboard, Sparkles } from 'lucide-react';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem('token');

  const onLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const isDark = true;

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/10 bg-slate-900/40 backdrop-blur-2xl transition-all duration-300">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex justify-between items-center h-20">
          <Link to="/" className="flex items-center space-x-3 group relative">
            <div className="absolute inset-0 bg-indigo-500 blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-500 rounded-full"></div>
            <div className="bg-gradient-to-tr from-indigo-500 to-purple-500 p-2.5 rounded-xl shadow-lg relative rounded-br-none">
              <LinkIcon className="h-6 w-6 text-white" strokeWidth={2.5} />
            </div>
            <span className="font-bold text-2xl tracking-tight text-white font-['Outfit'] flex items-baseline">
              Short<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Link</span>
            </span>
          </Link>
          
          <div className="flex items-center space-x-2 md:space-x-6">
            {token ? (
              <>
                <Link 
                  to="/dashboard" 
                  className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 hidden sm:flex ${
                    location.pathname.includes('/dashboard') 
                      ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' 
                      : 'text-slate-300 hover:text-white hover:bg-white/5 border border-transparent'
                  }`}
                >
                  <LayoutDashboard className="h-4 w-4" />
                  <span>Dashboard</span>
                </Link>
                <button
                  onClick={onLogout}
                  className="flex items-center space-x-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-300 hover:text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-all duration-300"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <Link 
                  to="/login" 
                  className="px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-300 hover:text-white transition-colors"
                >
                  Sign in
                </Link>
                <Link 
                  to="/register" 
                  className="btn-primary space-x-2 py-2.5"
                >
                  <Sparkles className="h-4 w-4 opacity-70" />
                  <span>Get Started</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
