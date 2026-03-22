import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
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

const PublicStats = () => {
  const { code } = useParams();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // We intentionally use raw fetch or api without token for public route
    const fetchStats = async () => {
      try {
        const VITE_API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
        const res = await fetch(`${VITE_API_URL}/url/stats/${code}`);
        if (!res.ok) throw new Error('Failed to fetch public stats');
        const data = await res.json();
        setAnalytics(data);
      } catch (err) {
        setError('Stats not available or link destroyed.');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [code]);

  if (loading) {
    return (
      <div className="h-[70vh] flex flex-col items-center justify-center space-y-4">
        <div className="w-16 h-16 rounded-full border-4 border-t-indigo-500 animate-spin border-indigo-500/20"></div>
        <p className="text-indigo-400 font-bold tracking-widest uppercase text-sm animate-pulse">Running Deep Scan...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-[70vh] flex items-center justify-center">
        <div className="glass-card rounded-2xl p-10 text-center border-rose-500/20 max-w-sm w-full">
          <p className="text-xl font-bold mb-6 text-rose-300">{error}</p>
          <Link to="/" className="btn-primary w-full shadow-rose-500/20 from-rose-500 to-orange-500">Return to Nexus</Link>
        </div>
      </div>
    );
  }

  const processChartData = () => {
    if (!analytics?.recentVisits || analytics.recentVisits.length === 0) return null;
    const last7Days = [...Array(7)].map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      return d.toISOString().split('T')[0];
    }).reverse();

    const clicksPerDay = {};
    last7Days.forEach(date => { clicksPerDay[date] = 0; });

    analytics.recentVisits.forEach(visit => {
      const dateStr = new Date(visit.timestamp).toISOString().split('T')[0];
      if (clicksPerDay[dateStr] !== undefined) clicksPerDay[dateStr]++;
    });

    return {
      labels: last7Days.map(date => new Date(date).toLocaleDateString('en-US', { weekday: 'short' })),
      datasets: [
        {
          label: 'Engagements',
          data: last7Days.map(date => clicksPerDay[date]),
          borderColor: '#818cf8', backgroundColor: 'rgba(99, 102, 241, 0.1)',
          borderWidth: 3, fill: true, tension: 0.4,
        },
      ],
    };
  };

  const chartData = processChartData();

  return (
    <div className="max-w-6xl mx-auto py-8 animate-slide-up">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 text-center md:text-left">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-300 to-teal-500 font-['Outfit']">Public Transparency Report</h1>
          <p className="text-slate-400 mt-2">Metrics for <span className="text-white font-semibold">/{analytics.shortCode}</span></p>
        </div>
        <a href={`/${analytics.shortCode}`} target="_blank" rel="noreferrer" className="px-5 py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold hover:bg-emerald-500/20 transition-all">
          Visit Link
        </a>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="glass-card p-5 rounded-2xl flex flex-col items-center justify-center relative overflow-hidden">
          <MousePointerClick className="text-indigo-400 mb-2" size={24}/>
          <p className="text-3xl font-bold text-white font-['Outfit']">{analytics.totalClicks}</p>
          <p className="text-xs text-slate-500 font-bold uppercase mt-1 tracking-widest">Total Impact</p>
        </div>
        <div className="glass-card p-5 rounded-2xl flex flex-col items-center justify-center relative overflow-hidden">
          <CalendarDays className="text-purple-400 mb-2" size={24}/>
          <p className="text-xl font-bold text-slate-200 mt-1">{new Date(analytics.createdAt).toLocaleDateString()}</p>
          <p className="text-xs text-slate-500 font-bold uppercase mt-1 tracking-widest">Created On</p>
        </div>
        <div className="glass-card p-5 rounded-2xl flex flex-col items-center justify-center relative overflow-hidden">
          <Smartphone className="text-emerald-400 mb-2" size={24}/>
          <p className="text-3xl font-bold text-white font-['Outfit']">{analytics.devices?.mobile || 0}</p>
          <p className="text-xs text-slate-500 font-bold uppercase mt-1 tracking-widest">Mobile Traffic</p>
        </div>
        <div className="glass-card p-5 rounded-2xl flex flex-col items-center justify-center relative overflow-hidden">
          <Monitor className="text-teal-400 mb-2" size={24}/>
          <p className="text-3xl font-bold text-white font-['Outfit']">{analytics.devices?.desktop || 0}</p>
          <p className="text-xs text-slate-500 font-bold uppercase mt-1 tracking-widest">Desktop Traffic</p>
        </div>
      </div>

      <div className="glass-card rounded-3xl p-8 relative overflow-hidden">
          <h3 className="text-xl font-bold text-white mb-6 font-['Outfit'] flex items-center">
            <Activity className="mr-2 h-6 w-6 text-indigo-400" /> Pulse (7 Days)
          </h3>
          {chartData ? (
             <div className="w-full h-[300px]">
                <Line 
                  data={chartData} 
                  options={{
                    responsive: true, maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: { 
                      y: { beginAtZero: true, grid: { color: 'rgba(255, 255, 255, 0.05)' }, ticks: { color: '#64748b', precision: 0 } },
                      x: { grid: { display: false }, ticks: { color: '#64748b' } }
                    }
                  }} 
                />
             </div>
          ) : (
            <div className="h-[200px] flex flex-col items-center justify-center bg-slate-800/20 rounded-xl">
               <p className="text-slate-500">Insufficient tracking data</p>
            </div>
          )}
      </div>
    </div>
  );
};

export default PublicStats;
