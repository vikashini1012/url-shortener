import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, Home } from 'lucide-react';

const Expired = () => {
  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4">
      <div className="w-full max-w-[440px] animate-slide-up text-center">
        <div className="inline-block relative mb-8">
          <div className="absolute inset-0 bg-rose-500 blur-2xl opacity-30 rounded-full mix-blend-screen"></div>
          <div className="bg-slate-800/80 p-5 rounded-3xl border border-white/5 relative shadow-2xl backdrop-blur-xl">
            <Clock className="h-12 w-12 text-rose-400" />
          </div>
        </div>
        
        <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-200 to-rose-500 font-['Outfit'] mb-4">
          Link Expired
        </h2>
        
        <p className="text-slate-400 text-lg mb-8">
          The creator of this link has set it to expire. The destination is no longer available.
        </p>

        <Link 
          to="/" 
          className="btn-primary inline-flex from-slate-700 to-slate-600 shadow-slate-900/50 hover:shadow-slate-900/70"
        >
          <Home className="mr-2 h-5 w-5 opacity-70" />
          <span>Return Home</span>
        </Link>
      </div>
    </div>
  );
};

export default Expired;
