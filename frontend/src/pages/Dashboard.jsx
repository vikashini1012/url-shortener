import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { Copy, Trash2, ExternalLink, BarChart2, PlusCircle, Check } from 'lucide-react';

const Dashboard = () => {
  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newUrl, setNewUrl] = useState('');
  const [alias, setAlias] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [copySuccess, setCopySuccess] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchUrls = async () => {
    try {
      const res = await api.get('/url/user');
      setUrls(res.data);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch URLs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUrls();
  }, []);

  const handleShorten = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsSubmitting(true);

    try {
      if (!newUrl) {
        throw new Error('Please enter a URL');
      }
      
      const payload = { originalUrl: newUrl };
      if (alias) payload.alias = alias;
      
      const res = await api.post('/url/shorten', payload);
      setUrls([res.data, ...urls]);
      setNewUrl('');
      setAlias('');
      setSuccess('URL successfully shortened!');
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.msg || err.message || 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this URL?')) return;
    
    try {
      await api.delete(`/url/${id}`);
      setUrls(urls.filter((url) => url._id !== id));
    } catch (err) {
      setError('Failed to delete URL');
    }
  };

  const handleCopy = (shortCode) => {
    const fullUrl = `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/url/${shortCode}`;
    navigator.clipboard.writeText(fullUrl);
    setCopySuccess(shortCode);
    setTimeout(() => setCopySuccess(null), 2000);
  };

  const getFullShortUrl = (code) => {
    return `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/url/${code}`;
  };

  return (
    <div className="max-w-6xl mx-auto py-8">
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
          <PlusCircle className="mr-2 text-indigo-600" />
          Create New Short URL
        </h2>
        
        {error && (
          <div className="mb-4 bg-red-50 text-red-700 p-3 rounded-md text-sm border border-red-200">
            {error}
          </div>
        )}
        
        {success && (
          <div className="mb-4 bg-green-50 text-green-700 p-3 rounded-md text-sm border border-green-200">
            {success}
          </div>
        )}
        
        <form onSubmit={handleShorten} className="space-y-4 md:space-y-0 md:flex md:gap-4 md:items-end">
          <div className="flex-grow">
            <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-1">
              Long URL
            </label>
            <input
              type="url"
              id="url"
              placeholder="https://example.com/very/long/url..."
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
              required
            />
          </div>
          
          <div className="md:w-1/4">
            <label htmlFor="alias" className="block text-sm font-medium text-gray-700 mb-1">
              Custom Alias (Optional)
            </label>
            <input
              type="text"
              id="alias"
              placeholder="my-campaign"
              value={alias}
              onChange={(e) => setAlias(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
            />
          </div>
          
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full md:w-auto px-6 py-3 rounded-lg text-white font-medium ${
              isSubmitting ? 'bg-indigo-400' : 'bg-indigo-600 hover:bg-indigo-700'
            } transition-colors min-w-[120px] flex justify-center`}
          >
            {isSubmitting ? 'Processing...' : 'Shorten'}
          </button>
        </form>
      </div>

      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-800">Your Shortened URLs</h2>
        </div>
        
        {loading ? (
          <div className="p-8 text-center text-gray-500 flex justify-center items-center">
            <svg className="animate-spin h-8 w-8 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        ) : urls.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <div className="mx-auto h-24 w-24 bg-gray-50 rounded-full flex items-center justify-center mb-4">
              <Link className="h-10 w-10 text-gray-300" />
            </div>
            <p className="text-lg font-medium text-gray-900 mb-1">No URLs yet</p>
            <p className="text-sm">Create your first short link above!</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-600 text-sm uppercase tracking-wider">
                  <th className="px-6 py-4 font-medium border-b border-gray-200">Original URL</th>
                  <th className="px-6 py-4 font-medium border-b border-gray-200">Short URL</th>
                  <th className="px-6 py-4 font-medium border-b border-gray-200 text-center">Clicks</th>
                  <th className="px-6 py-4 font-medium border-b border-gray-200 text-center">Date</th>
                  <th className="px-6 py-4 font-medium border-b border-gray-200 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {urls.map((url) => (
                  <tr key={url._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 max-w-[200px] truncate text-gray-600" title={url.originalUrl}>
                      {url.originalUrl}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <a 
                          href={getFullShortUrl(url.shortCode)} 
                          target="_blank" 
                          rel="noreferrer"
                          className="text-indigo-600 font-medium hover:underline flex items-center"
                        >
                          {url.shortCode}
                          <ExternalLink className="h-3 w-3 ml-1" />
                        </a>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center justify-center px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-800">
                        {url.clicks}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-500 text-sm text-center">
                      {new Date(url.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end space-x-3 text-sm">
                        <button 
                          onClick={() => handleCopy(url.shortCode)}
                          className={`p-1.5 rounded-md transition-colors ${
                            copySuccess === url.shortCode 
                              ? 'text-green-600 bg-green-50' 
                              : 'text-gray-500 hover:text-indigo-600 hover:bg-indigo-50'
                          }`}
                          title="Copy Link"
                        >
                          {copySuccess === url.shortCode ? <Check size={18} /> : <Copy size={18} />}
                        </button>
                        
                        <Link 
                          to={`/analytics/${url._id}`}
                          className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                          title="Analytics"
                        >
                          <BarChart2 size={18} />
                        </Link>
                        
                        <button 
                          onClick={() => handleDelete(url._id)}
                          className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                          title="Delete URL"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
