import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Shield, Lock, Unlock as UnlockIcon } from 'lucide-react';

const Unlock = () => {
  const { code } = useParams();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!password) return setError('Password is required');
    
    setLoading(true);
    setError('');

    try {
      const res = await api.post(`/url/unlock/${code}`, { password });
      setSuccess(true);
      // Wait a tiny bit for effect
      setTimeout(() => {
        window.location.href = res.data.originalUrl;
      }, 800);
    } catch (err) {
      setError(err.response?.data?.msg || 'Incorrect Password');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4">
      <div className="w-full max-w-[440px] animate-slide-up text-center">
        <div className="inline-block relative mb-8">
          <div className="absolute inset-0 bg-yellow-500 blur-2xl opacity-20 rounded-full mix-blend-screen"></div>
          <div className="bg-slate-800/80 p-5 rounded-3xl border border-white/5 relative shadow-2xl backdrop-blur-xl transition-all duration-500">
            {success ? (
              <UnlockIcon className="h-12 w-12 text-emerald-400" />
            ) : (
              <Shield className="h-12 w-12 text-yellow-400" />
            )}
          </div>
        </div>
        
        <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-200 to-amber-500 font-['Outfit'] mb-3">
          {success ? 'Access Granted' : 'Protected Link'}
        </h2>
        
        <p className="text-slate-400 text-lg mb-8">
          {success 
            ? 'Redirecting to destination...' 
            : 'Enter the vault password set by the creator.'}
        </p>

        {!success && (
          <form onSubmit={onSubmit} className="glass-card rounded-2xl p-6 relative overflow-hidden text-left">
            {error && (
              <div className="bg-rose-500/10 text-rose-400 p-4 rounded-xl text-sm border border-rose-500/20 mb-5 animate-slide-up flex items-center space-x-2">
                <div className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse shrink-0"></div>
                <span>{error}</span>
              </div>
            )}
            
            <div className="relative group mb-6">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-yellow-400 transition-colors">
                <Lock className="h-5 w-5" />
              </div>
              <input
                type="password"
                required
                className="glass-input pl-12 h-14"
                placeholder="Vault Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full h-14 bg-gradient-to-r from-amber-500 to-yellow-600 shadow-yellow-500/25 hover:shadow-yellow-500/40"
            >
              {loading ? (
                <div className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin"></div>
              ) : 'Unlock Destination'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Unlock;
