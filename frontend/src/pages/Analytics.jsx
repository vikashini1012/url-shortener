import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { ArrowLeft, Clock, MousePointerClick, Calendar } from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
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
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center py-20">
        <div className="bg-red-50 text-red-700 p-6 rounded-lg max-w-md w-full text-center border border-red-200">
          <p className="text-lg font-medium mb-4">{error}</p>
          <Link to="/dashboard" className="text-indigo-600 hover:text-indigo-800 font-medium inline-flex items-center">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  // Prepare data for Daily Clicks Chart (Bonus feature)
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
        const [, m, d] = date.split('-');
        return `${m}/${d}`;
      }),
      datasets: [
        {
          label: 'Clicks per Day',
          data: last7Days.map(date => clicksPerDay[date]),
          borderColor: 'rgb(79, 70, 229)',
          backgroundColor: 'rgba(79, 70, 229, 0.1)',
          fill: true,
          tension: 0.4,
        },
      ],
    };
  };

  const chartData = processChartData();

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="mb-6 flex items-center justify-between">
        <Link 
          to="/dashboard" 
          className="inline-flex items-center text-gray-600 hover:text-indigo-600 transition-colors font-medium"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Link>
        <h1 className="text-2xl font-bold text-gray-800">Analytics Overview</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center space-x-4">
          <div className="p-3 rounded-full bg-indigo-50 text-indigo-600">
            <MousePointerClick className="h-8 w-8" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Total Clicks</p>
            <p className="text-3xl font-bold text-gray-900">{analytics.totalClicks}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center space-x-4">
          <div className="p-3 rounded-full bg-emerald-50 text-emerald-600">
            <Clock className="h-8 w-8" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Last Visited</p>
            <p className="text-lg font-bold text-gray-900 truncate" title={analytics.lastVisited ? new Date(analytics.lastVisited).toLocaleString() : 'Never'}>
              {analytics.lastVisited ? new Date(analytics.lastVisited).toLocaleDateString() : 'Never'}
            </p>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center space-x-4">
          <div className="p-3 rounded-full bg-amber-50 text-amber-600">
            <Calendar className="h-8 w-8" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Recent Visits</p>
            <p className="text-3xl font-bold text-gray-900">{analytics.recentVisits?.length || 0}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {chartData && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-6">Activity (Last 7 Days)</h3>
            <div className="h-64">
              <Line 
                data={chartData} 
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: { legend: { display: false } },
                  scales: { y: { beginAtZero: true, ticks: { precision: 0 } } }
                }} 
              />
            </div>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 lg:col-span-1">
          <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center">
            <Clock className="mr-2 h-5 w-5 text-gray-400" />
            Recent Visit Timeline
          </h3>
          
          {analytics.recentVisits && analytics.recentVisits.length > 0 ? (
            <div className="space-y-4">
              {analytics.recentVisits.map((visit, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 rounded-lg bg-gray-50 border border-gray-100">
                  <div className="mt-0.5 w-2 h-2 rounded-full bg-indigo-500 flex-shrink-0"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {new Date(visit.timestamp).toLocaleDateString()}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(visit.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 bg-gray-50 rounded-lg border border-gray-100 border-dashed">
              <p className="text-gray-500">No recent visits tracked yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Analytics;
