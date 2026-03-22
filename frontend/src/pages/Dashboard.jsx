import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { QRCodeSVG } from 'qrcode.react';
import { Copy, Trash2, ExternalLink, BarChart2, Check, Sparkles, Link2, Lock, Calendar, QrCode, X, Edit3, Type, Layers, Globe } from 'lucide-react';

const Dashboard = () => {
  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Form State
  const [isBulkMode, setIsBulkMode] = useState(false);
  const [newUrl, setNewUrl] = useState('');
  const [bulkUrls, setBulkUrls] = useState('');
  const [alias, setAlias] = useState('');
  const [password, setPassword] = useState('');
  const [expiresAt, setExpiresAt] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [copySuccess, setCopySuccess] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Modal State
  const [activeQr, setActiveQr] = useState(null);
  const [editingUrl, setEditingUrl] = useState(null);

  const fetchUrls = async () => {
    try {
      const res = await api.get('/url/user');
      setUrls(res.data);
    } catch (err) {
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
      if (isBulkMode) {
        if (!bulkUrls.trim()) throw new Error('Please enter URLs, separated by comma or new line');
        const urlArray = bulkUrls.split(/[\n,]+/).map(i => i.trim()).filter(i => i);
        
        const res = await api.post('/url/bulk', { urls: urlArray });
        setUrls([...res.data, ...urls]);
        setSuccess(`Successfully generated ${res.data.length} links!`);
        setBulkUrls('');
      } else {
        if (!newUrl) throw new Error('Please enter a URL');
        const payload = { originalUrl: newUrl };
        if (alias) payload.alias = alias;
        if (password) payload.password = password;
        if (expiresAt) payload.expiresAt = expiresAt;
        
        const res = await api.post('/url/shorten', payload);
        setUrls([res.data, ...urls]);
        setNewUrl('');
        setAlias('');
        setPassword('');
        setExpiresAt('');
        setShowAdvanced(false);
        setSuccess('Magic link generated perfectly!');
      }
      setTimeout(() => setSuccess(''), 4000);
    } catch (err) {
      setError(err.response?.data?.msg || err.message || 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.put(`/url/${editingUrl._id}`, { originalUrl: editingUrl.originalUrl });
      setUrls(urls.map(u => u._id === editingUrl._id ? res.data : u));
      setEditingUrl(null);
      setSuccess('Destination updated');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to update destination');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Erase this link from existence?')) return;
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

  const downloadQR = () => {
    const svg = document.getElementById('qr-code-svg');
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      const downloadLink = document.createElement('a');
      downloadLink.download = `qrcode-${activeQr.shortCode}.png`;
      downloadLink.href = canvas.toDataURL('image/png');
      downloadLink.click();
    };
    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
  };

  const getFullShortUrl = (code) => {
    return `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/url/${code}`;
  };

  return (
    <div className="max-w-6xl mx-auto py-8 lg:py-12 animate-slide-up">
      <div className="glass-card rounded-3xl p-8 mb-10 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-indigo-500/20 via-purple-500/5 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:opacity-100 opacity-60 transition-opacity duration-700 pointer-events-none"></div>
        
        <div className="relative z-10">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400 font-['Outfit'] flex items-center">
              <Sparkles className="mr-3 text-indigo-400 h-8 w-8" />
              Create a Magic Link
            </h2>
            <div className="flex gap-3">
              <button 
                type="button" 
                onClick={() => setIsBulkMode(!isBulkMode)}
                className={`text-sm font-semibold hover:text-white px-4 py-2 rounded-xl transition-colors flex items-center gap-2 ${isBulkMode ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/30' : 'bg-slate-800 text-slate-400'}`}
              >
                <Layers size={16} /> {isBulkMode ? 'Single Mode' : 'Bulk Mode'}
              </button>
              
              {!isBulkMode && (
                <button 
                  type="button" 
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="text-sm font-semibold text-indigo-400 hover:text-indigo-300 bg-indigo-500/10 px-4 py-2 rounded-xl transition-colors hidden md:block"
                >
                  {showAdvanced ? 'Hide Advanced Settings' : 'Advanced Settings'}
                </button>
              )}
            </div>
          </div>
          
          {(error || success) && (
            <div className={`mb-6 p-4 rounded-xl text-sm border flex items-center space-x-3 backdrop-blur-md animate-slide-up ${
              error ? 'bg-rose-500/10 text-rose-300 border-rose-500/20' : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20'
            }`}>
              <div className={`w-2 h-2 rounded-full animate-pulse ${error ? 'bg-rose-400' : 'bg-emerald-400'}`}></div>
              <span className="font-medium">{error || success}</span>
            </div>
          )}
          
          <form onSubmit={handleShorten} className="flex flex-col gap-5">
            {isBulkMode ? (
               <div className="w-full">
                  <label htmlFor="bulk" className="block text-sm font-semibold text-slate-400 mb-2 uppercase tracking-wider ml-1">
                    Paste Several URLs (comma or newline separated)
                  </label>
                  <textarea
                    id="bulk"
                    rows="4"
                    placeholder="https://google.com&#10;https://facebook.com"
                    value={bulkUrls}
                    onChange={(e) => setBulkUrls(e.target.value)}
                    className="glass-input p-4 w-full h-auto min-h-[120px]"
                    required
                  ></textarea>
               </div>
            ) : (
              <div className="flex flex-col md:flex-row gap-5 items-end">
                <div className="w-full md:flex-1">
                  <label htmlFor="url" className="block text-sm font-semibold text-slate-400 mb-2 uppercase tracking-wider ml-1">
                    Destination URL
                  </label>
                  <div className="relative group/input">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within/input:text-indigo-400 transition-colors">
                      <Link2 className="h-5 w-5" />
                    </div>
                    <input
                      type="url"
                      id="url"
                      placeholder="https://your-super-long-domain.com/path..."
                      value={newUrl}
                      onChange={(e) => setNewUrl(e.target.value)}
                      className="glass-input pl-12 h-[52px]"
                      required
                    />
                  </div>
                </div>
                
                <div className="w-full md:w-64">
                  <label htmlFor="alias" className="block text-sm font-semibold text-slate-400 mb-2 uppercase tracking-wider ml-1">
                    Custom Alias
                  </label>
                  <input
                    type="text"
                    id="alias"
                    placeholder="my-campaign"
                    value={alias}
                    onChange={(e) => setAlias(e.target.value)}
                    className="glass-input h-[52px]"
                  />
                </div>
              </div>
            )}
            
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary w-full md:w-auto h-[52px] md:self-end px-8"
            >
              {isSubmitting ? (
                <span className="flex items-center space-x-2">
                  <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin"></div>
                  <span>Magic...</span>
                </span>
              ) : (isBulkMode ? 'Bulk Generate Links' : 'Generate Link')}
            </button>

            {!isBulkMode && showAdvanced && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 animate-slide-up border-t border-slate-700/50 pt-5 mt-2">
                <div>
                  <label htmlFor="password" className="block text-sm font-semibold text-slate-400 mb-2 uppercase tracking-wider ml-1">
                    Password Protect
                  </label>
                  <div className="relative group/pw flex items-center">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within/pw:text-indigo-400 transition-colors">
                      <Lock className="h-5 w-5" />
                    </div>
                    <input
                      type="password"
                      id="password"
                      autoComplete="new-password"
                      placeholder="Leave blank for public link"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="glass-input pl-12 h-[52px]"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="expiresAt" className="block text-sm font-semibold text-slate-400 mb-2 uppercase tracking-wider ml-1">
                    Expiration Date
                  </label>
                  <div className="relative group/dt flex items-center">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within/dt:text-indigo-400 transition-colors">
                      <Calendar className="h-5 w-5" />
                    </div>
                    <input
                      type="datetime-local"
                      id="expiresAt"
                      value={expiresAt}
                      onChange={(e) => setExpiresAt(e.target.value)}
                      className="glass-input pl-12 h-[52px] [color-scheme:dark]"
                    />
                  </div>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>

      <div className="flex justify-between items-end mb-6 px-2">
         <h3 className="text-2xl font-bold text-white font-['Outfit']">Your Vault</h3>
         <p className="text-slate-500 text-sm font-medium">{urls.length} Links Tracked</p>
      </div>
      
      <div className="glass-card rounded-3xl border border-white/5 overflow-hidden relative">
        {loading ? (
          <div className="h-64 flex flex-col items-center justify-center space-y-4">
            <div className="w-10 h-10 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
            <p className="text-slate-400 font-medium tracking-wide animate-pulse">Decrypting your links...</p>
          </div>
        ) : urls.length === 0 ? (
          <div className="p-16 text-center flex flex-col items-center justify-center text-slate-400">
            <div className="w-24 h-24 mb-6 rounded-full bg-slate-800/80 border border-slate-700/50 flex items-center justify-center shadow-inner relative overflow-hidden">
              <div className="absolute inset-0 bg-indigo-500/10 backdrop-blur-md"></div>
              <Link2 className="h-10 w-10 text-slate-500 relative z-10" />
            </div>
            <p className="text-2xl font-bold text-slate-200 mb-2 font-['Outfit']">The Vault is Empty</p>
            <p className="text-slate-500 max-w-sm">Use the magic bar above to forge your first shortened tracking link.</p>
          </div>
        ) : (
          <div className="overflow-x-auto pb-4">
            <table className="w-full text-left whitespace-nowrap">
              <thead>
                <tr className="bg-slate-900/50 border-b border-slate-700/50">
                  <th className="px-6 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Original URL</th>
                  <th className="px-6 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Short Link</th>
                  <th className="px-4 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest text-center">Status</th>
                  <th className="px-6 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {urls.map((url, i) => {
                  const isExpired = url.expiresAt && new Date() > new Date(url.expiresAt);
                  return (
                  <tr 
                    key={url._id} 
                    className={`hover:bg-white/[0.02] transition-colors duration-200 group animate-slide-up ${isExpired ? 'opacity-50' : ''}`}
                    style={{ animationDelay: `${i * 50}ms` }}
                  >
                    <td className="px-6 py-5 max-w-[250px] truncate">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center mr-3 border border-slate-700 flex-shrink-0">
                          <img src={`https://t0.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${url.originalUrl}&size=32`} className="w-4 h-4 opacity-70 rounded-sm" onError={(e) => e.target.style.display='none'} alt="" />
                        </div>
                        <span className="text-slate-300 font-medium truncate" title={url.originalUrl}>
                          {url.originalUrl.replace(/^https?:\/\//, '')}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <a 
                        href={getFullShortUrl(url.shortCode)} 
                        target="_blank" 
                        rel="noreferrer"
                        className="inline-flex items-center space-x-2 text-indigo-400 hover:text-indigo-300 font-semibold transition-colors bg-indigo-500/10 px-3 py-1.5 rounded-lg border border-indigo-500/20 hover:border-indigo-400/30"
                      >
                        <span>/{url.shortCode}</span>
                        <ExternalLink className="h-3.5 w-3.5 opacity-70" />
                      </a>
                    </td>
                    <td className="px-4 py-5 text-center">
                      <div className="flex items-center justify-center space-x-1.5">
                        {url.isProtected && (
                          <div className="p-1.5 rounded-md bg-yellow-500/10 text-yellow-500 border border-yellow-500/20" title="Password Protected">
                            <Lock className="w-3.5 h-3.5" />
                          </div>
                        )}
                        {url.expiresAt && (
                          <div className={`p-1.5 rounded-md border ${isExpired ? 'bg-rose-500/10 text-rose-500 border-rose-500/20' : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'}`} title={isExpired ? "Expired" : `Expires on ${new Date(url.expiresAt).toLocaleDateString()}`}>
                            <Calendar className="w-3.5 h-3.5" />
                          </div>
                        )}
                        {!url.isProtected && !url.expiresAt && (
                          <span className="text-slate-500 text-xs">—</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex justify-end space-x-2">
                        <button 
                          onClick={() => setEditingUrl(url)}
                          className="p-2.5 bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 border border-transparent rounded-xl transition-all duration-300"
                          title="Edit Destination URL"
                        >
                          <Edit3 size={18} />
                        </button>
                        
                        <button 
                          onClick={() => setActiveQr(url)}
                          className="p-2.5 bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 border border-transparent rounded-xl transition-all duration-300"
                          title="Generate QR Code"
                        >
                          <QrCode size={18} />
                        </button>
                        
                        <button 
                          onClick={() => handleCopy(url.shortCode)}
                          className={`p-2.5 rounded-xl transition-all duration-300 ${
                            copySuccess === url.shortCode 
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' 
                              : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 border border-transparent'
                          }`}
                          title="Copy Link"
                        >
                          {copySuccess === url.shortCode ? <Check size={18} /> : <Copy size={18} />}
                        </button>

                        <a 
                          href={`/stats/${url.shortCode}`}
                          target="_blank"
                          rel="noreferrer"
                          className="p-2.5 bg-slate-800 text-teal-400 hover:text-white hover:bg-teal-600 rounded-xl transition-all duration-300 shadow-sm hover:shadow-teal-500/20"
                          title="Public Stats Page"
                        >
                          <Globe size={18} />
                        </a>
                        
                        <Link 
                          to={`/analytics/${url._id}`}
                          className="p-2.5 bg-slate-800 text-indigo-400 hover:text-white hover:bg-indigo-600 rounded-xl transition-all duration-300 shadow-sm hover:shadow-indigo-500/20"
                          title="Deep Analytics"
                        >
                          <BarChart2 size={18} />
                        </Link>
                        
                        <button 
                          onClick={() => handleDelete(url._id)}
                          className="p-2.5 bg-slate-800 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 hover:border-rose-500/20 border border-transparent rounded-xl transition-all duration-300"
                          title="Obliterate URL"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {editingUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm" onClick={() => setEditingUrl(null)}></div>
          <div className="glass-card rounded-3xl p-8 max-w-lg w-full relative z-10 animate-slide-up border border-indigo-500/30 shadow-2xl">
            <button 
              onClick={() => setEditingUrl(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
            <h3 className="text-xl font-bold text-white mb-6 font-['Outfit']">Edit Destination</h3>
            
            <form onSubmit={handleEdit} className="space-y-4">
               <div>
                  <label className="block text-sm font-semibold text-slate-400 mb-2 uppercase tracking-wider ml-1">
                    New Target URL
                  </label>
                  <input
                    type="url"
                    value={editingUrl.originalUrl}
                    onChange={(e) => setEditingUrl({...editingUrl, originalUrl: e.target.value})}
                    className="glass-input h-14"
                    required
                  />
               </div>
               <button type="submit" className="btn-primary w-full h-14">Save Modification</button>
            </form>
          </div>
        </div>
      )}

      {activeQr && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm" onClick={() => setActiveQr(null)}></div>
          <div className="glass-card rounded-3xl p-8 max-w-sm w-full relative z-10 animate-slide-up border border-indigo-500/30 flex flex-col items-center text-center shadow-2xl">
            <button 
              onClick={() => setActiveQr(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
            
            <h3 className="text-xl font-bold text-white mb-2 font-['Outfit']">Scannable QR Code</h3>
            <p className="text-slate-400 text-sm mb-6">Point your camera to instantly navigate to the short link.</p>
            
            <div className="bg-white p-4 rounded-xl shadow-inner mb-6">
              <QRCodeSVG 
                id="qr-code-svg"
                value={getFullShortUrl(activeQr.shortCode)} 
                size={200} 
                level={"H"}
                bgColor={"#ffffff"}
                fgColor={"#0f172a"}
                includeMargin={false}
              />
            </div>
            
            <button 
              onClick={downloadQR}
              className="btn-primary w-full shadow-indigo-500/25"
            >
              Download High-Res PNG
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
