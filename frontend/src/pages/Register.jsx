import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { UserPlus, Mail, Lock, CheckCircle2, ArrowRight } from 'lucide-react';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { email, password, confirmPassword } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password || !confirmPassword) {
      return setError('Please fill in all fields');
    }

    if (password !== confirmPassword) {
      return setError('Passwords do not match');
    }

    if (password.length < 6) {
       return setError('Password must be at least 6 characters');
    }

    setLoading(true);
    try {
      const res = await api.post('/auth/register', { email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.msg || 'An error occurred during registration');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4">
      <div className="w-full max-w-[440px] animate-slide-up">
        <div className="text-center mb-10">
          <div className="inline-block relative">
            <div className="absolute inset-0 bg-purple-500 blur-2xl opacity-30 rounded-full mix-blend-screen"></div>
            <div className="bg-slate-800/80 p-4 rounded-2xl border border-white/5 relative shadow-2xl backdrop-blur-xl">
              <UserPlus className="h-10 w-10 text-purple-400" />
            </div>
          </div>
          <h2 className="mt-8 text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400 font-['Outfit']">
            Join ShortLink
          </h2>
          <p className="mt-3 text-slate-400 text-lg">
            Create an account to start tracking
          </p>
        </div>
        
        <div className="glass-card rounded-2xl p-8 relative overflow-hidden">
          {/* Decorative glowing orbs */}
          <div className="absolute -top-32 -right-32 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none"></div>

          <form className="space-y-6 relative z-10" onSubmit={onSubmit}>
            {error && (
              <div className="bg-rose-500/10 text-rose-400 p-4 rounded-xl text-sm text-center border border-rose-500/20 flex items-center justify-center space-x-2 animate-slide-up">
                <div className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></div>
                <span>{error}</span>
              </div>
            )}
            
            <div className="space-y-5">
              <div className="relative group flex items-center">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-purple-400 transition-colors">
                  <Mail className="h-5 w-5" />
                </div>
                <input
                  name="email"
                  type="email"
                  required
                  className="glass-input pl-12"
                  placeholder="Email address"
                  value={email}
                  onChange={onChange}
                />
              </div>
              
              <div className="relative group flex items-center">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-purple-400 transition-colors">
                  <Lock className="h-5 w-5" />
                </div>
                <input
                  name="password"
                  type="password"
                  required
                  className="glass-input pl-12 pr-4"
                  placeholder="Password (min 6 chars)"
                  value={password}
                  onChange={onChange}
                />
              </div>

              <div className="relative group flex items-center">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-purple-400 transition-colors">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                <input
                  name="confirmPassword"
                  type="password"
                  required
                  className="glass-input pl-12 pr-4"
                  placeholder="Confirm password"
                  value={confirmPassword}
                  onChange={onChange}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full group py-3.5 mt-2"
            >
              {loading ? (
                <span className="flex items-center space-x-3">
                  <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Creating Account...</span>
                </span>
              ) : (
                <span className="flex items-center justify-center space-x-2">
                  <span className="text-base tracking-wide">Register Account</span>
                  <ArrowRight className="h-5 w-4 opacity-70 group-hover:translate-x-1 transition-transform" />
                </span>
              )}
            </button>
          </form>
        </div>
        
        <div className="text-center mt-8">
          <p className="text-slate-400">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-purple-400 hover:text-purple-300 transition-colors inline-flex items-center group">
              Sign in now
              <ArrowRight className="ml-1.5 h-4 w-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
