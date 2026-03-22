import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { ArrowLeft, Clock, MousePointerClick, CalendarDays, Activity, Smartphone, Monitor } from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const Analytics = () => {
  const { id } = useParams();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await api.get(`/url/${id}/analytics`);
        setAnalytics(res.data);
      } catch (err) {
        setError('Failed to fetch analytics');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [id]);

  if (loading) {
    return (
      <div className="h-[70vh] flex flex-col items-center justify-center space-y-4">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-4 border-indigo-500/20"></div>
          <div className="absolute inset-0 rounded-full border-4 border-t-indigo-500 animate-spin"></div>
        </div>
        <p className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 font-bold tracking-widest uppercase text-sm animate-pulse">Running Deep Scan...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-[70vh] flex items-center justify-center">
        <div className="glass-card rounded-2xl p-10 max-w-md w-full text-center border-rose-500/20 relative overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-rose-500 to-transparent"></div>
          <p className="text-xl font-bold mb-6 text-rose-300">{error}</p>
          <Link to="/dashboard" className="btn-primary w-full shadow-rose-500/20 from-rose-500 to-orange-500">
            <ArrowLeft className="mr-2 h-5 w-5" /> Return to Vault
          </Link>
        </div>
      </div>
    );
  }

  // Prepare data for Daily Clicks Chart
  const processChartData = () => {
    if (!analytics?.recentVisits || analytics.recentVisits.length === 0) return null;
    
    // Group visits by date for the last 7 days
    const last7Days = [...Array(7)].map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      return d.toISOString().split('T')[0];
    }).reverse();

    const clicksPerDay = {};
    last7Days.forEach(date => { clicksPerDay[date] = 0; });

    analytics.recentVisits.forEach(visit => {
      const dateStr = new Date(visit.timestamp).toISOString().split('T')[0];
      if (clicksPerDay[dateStr] !== undefined) {
        clicksPerDay[dateStr]++;
      }
    });

    return {
      labels: last7Days.map(date => {
        const d = new Date(date);
        return d.toLocaleDateString('en-US', { weekday: 'short' });
      }),
      datasets: [
        {
          label: 'Engagements',
          data: last7Days.map(date => clicksPerDay[date]),
          borderColor: '#818cf8', // indigo-400
          backgroundColor: 'rgba(99, 102, 241, 0.1)', // indigo-500
          borderWidth: 3,
          pointBackgroundColor: '#1e1b4b',
          pointBorderColor: '#818cf8',
          pointBorderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6,
          fill: true,
          tension: 0.4,
        },
      ],
    };
  };

  const chartData = processChartData();

  return (
    <div className="max-w-6xl mx-auto py-8 animate-slide-up">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex items-center space-x-4">
          <Link 
            to="/dashboard" 
            className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 transition-all duration-300"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400 font-['Outfit']">Deep Analytics</h1>
            <p className="text-slate-500 text-sm font-medium tracking-wide">Command Center & Metrics</p>
          </div>
        </div>
        
        <div className="hidden md:flex items-center space-x-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-semibold">
          <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
          <span>Live Telemetry Active</span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 lg:gap-6 mb-8">
        <div className="glass-card rounded-3xl p-5 relative overflow-hidden group">
          <div className="absolute -right-6 -top-6 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl group-hover:bg-indigo-500/20 transition-colors"></div>
          <div className="flex items-start justify-between relative z-10">
            <div>
              <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-1">Impact</p>
              <h3 className="text-3xl font-['Outfit'] font-bold text-white">{analytics.totalClicks}</h3>
            </div>
          </div>
          <MousePointerClick className="absolute bottom-4 right-4 h-8 w-8 text-indigo-500/20" />
        </div>

        <div className="glass-card rounded-3xl p-5 relative overflow-hidden group">
          <div className="absolute -right-6 -top-6 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl group-hover:bg-purple-500/20 transition-colors"></div>
          <div className="flex items-start justify-between relative z-10">
            <div>
              <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-1">Recent</p>
              <h3 className="text-3xl font-['Outfit'] font-bold text-white">{analytics.recentVisits?.length || 0}</h3>
            </div>
          </div>
          <CalendarDays className="absolute bottom-4 right-4 h-8 w-8 text-purple-500/20" />
        </div>

        <div className="glass-card rounded-3xl p-5 relative overflow-hidden group">
          <div className="absolute -right-6 -top-6 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition-colors"></div>
          <div className="flex items-start justify-between relative z-10">
            <div>
              <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-1">Mobile</p>
              <h3 className="text-3xl font-['Outfit'] font-bold text-white">{analytics.devices?.mobile || 0}</h3>
            </div>
          </div>
          <Smartphone className="absolute bottom-4 right-4 h-8 w-8 text-emerald-500/20" />
        </div>

        <div className="glass-card rounded-3xl p-5 relative overflow-hidden group">
          <div className="absolute -right-6 -top-6 w-32 h-32 bg-teal-500/10 rounded-full blur-2xl group-hover:bg-teal-500/20 transition-colors"></div>
          <div className="flex items-start justify-between relative z-10">
            <div>
              <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-1">Desktop</p>
              <h3 className="text-3xl font-['Outfit'] font-bold text-white">{analytics.devices?.desktop || 0}</h3>
            </div>
          </div>
          <Monitor className="absolute bottom-4 right-4 h-8 w-8 text-teal-500/20" />
        </div>

        <div className="col-span-2 lg:col-span-1 glass-card rounded-3xl p-5 relative overflow-hidden group">
          <div className="absolute -right-6 -top-6 w-32 h-32 bg-rose-500/10 rounded-full blur-2xl group-hover:bg-rose-500/20 transition-colors"></div>
          <div className="flex flex-col relative z-10 h-full justify-center">
            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-1">Latest</p>
            <h3 className="text-lg font-['Outfit'] font-bold text-slate-200 truncate" title={analytics.lastVisited ? new Date(analytics.lastVisited).toLocaleString() : 'Never'}>
              {analytics.lastVisited ? new Date(analytics.lastVisited).toLocaleDateString() : 'Never'}
            </h3>
          </div>
          <Clock className="absolute bottom-4 right-4 h-8 w-8 text-rose-500/20" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart Area */}
        <div className="glass-card rounded-3xl p-8 lg:col-span-2 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-900/50 pointer-events-none"></div>
          <div className="relative z-10 h-full flex flex-col">
            <h3 className="text-xl font-bold text-white mb-6 font-['Outfit'] flex items-center">
              <Activity className="mr-2 h-6 w-6 text-indigo-400" />
              Pulse (7 Days)
            </h3>
            
            {chartData ? (
              <div className="flex-grow w-full min-h-[300px]">
                <Line 
                  data={chartData} 
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { 
                      legend: { display: false },
                      tooltip: {
                        backgroundColor: 'rgba(15, 23, 42, 0.9)',
                        titleColor: '#f1f5f9',
                        bodyColor: '#818cf8',
                        borderColor: 'rgba(99, 102, 241, 0.3)',
                        borderWidth: 1,
                        padding: 12,
                        displayColors: false,
                        titleFont: { family: "'Outfit', sans-serif", size: 14 },
                        bodyFont: { family: "'Plus Jakarta Sans', sans-serif", size: 16, weight: 'bold' }
                      }
                    },
                    scales: { 
                      y: { 
                        beginAtZero: true, 
                        grid: { color: 'rgba(255, 255, 255, 0.05)', drawBorder: false },
                        ticks: { color: '#64748b', font: { family: "'Plus Jakarta Sans'" }, precision: 0, padding: 10 }
                      },
                      x: {
                        grid: { display: false, drawBorder: false },
                        ticks: { color: '#64748b', font: { family: "'Plus Jakarta Sans'" }, padding: 10 }
                      }
                    },
                    interaction: {
                      intersect: false,
                      mode: 'index',
                    },
                  }} 
                />
              </div>
            ) : (
              <div className="flex-grow flex flex-col items-center justify-center border-2 border-dashed border-slate-700/50 rounded-2xl bg-slate-800/20">
                <Activity className="h-12 w-12 text-slate-600 mb-4" />
                <p className="text-slate-500 font-medium">Insufficient tracking data</p>
              </div>
            )}
          </div>
        </div>

        {/* Timeline Log */}
        <div className="glass-card rounded-3xl p-6 lg:col-span-1 flex flex-col max-h-[440px]">
          <h3 className="text-lg font-bold text-white mb-6 font-['Outfit'] flex items-center px-2">
            <Clock className="mr-2 h-5 w-5 text-purple-400" />
            Raw Telemetry Log
          </h3>
          
          <div className="flex-grow overflow-y-auto pr-2 space-y-3 custom-scrollbar">
            {analytics.recentVisits && analytics.recentVisits.length > 0 ? (
              analytics.recentVisits.map((visit, index) => (
                <div key={index} className="flex items-center p-4 rounded-2xl bg-slate-800/50 border border-slate-700/50 hover:bg-slate-700/50 transition-colors group">
                  <div className="w-10 h-10 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center mr-4 group-hover:border-indigo-500/50 transition-colors shrink-0">
                    <div className="w-2.5 h-2.5 rounded-full bg-indigo-500 group-hover:shadow-[0_0_10px_rgba(99,102,241,0.8)] transition-all"></div>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-200">
                      {new Date(visit.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric'})}
                    </p>
                    <p className="text-xs text-indigo-400 font-medium mt-0.5 tracking-wide">
                      {new Date(visit.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute:'2-digit', second:'2-digit' })} • {visit.device || 'Unknown'}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 px-4 h-full flex flex-col justify-center items-center">
                <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mb-4">
                  <Clock className="h-8 w-8 text-slate-600" />
                </div>
                <p className="text-slate-500 font-medium">Waiting for signals...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
