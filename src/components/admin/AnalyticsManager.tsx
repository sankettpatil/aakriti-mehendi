import React, { useState, useEffect } from 'react';
import { IndianRupee, TrendingUp, Calendar, Users, Award } from 'lucide-react';
import type { AnalyticsStats } from '../../lib/db';

export function AnalyticsManager() {
  const [stats, setStats] = useState<AnalyticsStats | null>(null);
  const [months, setMonths] = useState<string[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStats(selectedMonth);
  }, [selectedMonth]);

  const fetchStats = async (month: string) => {
    setLoading(true);
    try {
      const url = month ? `/api/admin/analytics?month=${month}` : '/api/admin/analytics';
      const res = await fetch(url);
      const data = await res.json();
      if (data.success) {
        setStats(data.stats);
        if (!selectedMonth && data.months) {
            setMonths(data.months);
        }
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('Failed to fetch analytics.');
    } finally {
      setLoading(false);
    }
  };

  const formatMonth = (yyyyMM: string) => {
    const [year, month] = yyyyMM.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleString('default', { month: 'long', year: 'numeric' });
  };

  if (error) return <div className="text-red-600 text-[13px]">{error}</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-4xl font-bold tracking-tight text-gray-900">Store Analytics</h2>
          <p className="text-base text-gray-500 mt-2">High-level metrics based on confirmed bookings.</p>
        </div>
        
        {months.length > 0 && (
          <select 
            value={selectedMonth} 
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="pl-3 pr-8 py-1.5 bg-white border border-gray-200 rounded-md text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 shadow-none cursor-pointer"
          >
            <option value="">All Time</option>
            {months.map(m => (
              <option key={m} value={m}>{formatMonth(m)}</option>
            ))}
          </select>
        )}
      </div>

      {loading && !stats ? (
        <div className="text-gray-500 text-[13px] py-8 text-center bg-white border border-gray-200 rounded-md">Loading analytics...</div>
      ) : !stats ? (
        <div className="text-gray-500 text-[13px] py-8 text-center bg-white border border-gray-200 rounded-md">No data available.</div>
      ) : (
      <>
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-200 border border-gray-200 rounded-lg overflow-hidden bg-white">
          
          {/* Revenue Card */}
          <div className="bg-white p-6 hover:bg-gray-50/50 transition-colors">
            <div className="mb-4">
              <h3 className="text-[12px] font-semibold text-gray-500 uppercase tracking-wider">Est. Revenue</h3>
            </div>
            <div className="flex items-end gap-3">
              <span className="text-4xl tracking-tight text-gray-900">
                ₹{stats.total_revenue.toLocaleString()}
              </span>
              <span className="text-[12px] text-gray-500 pb-1 mb-0.5">
                Base price minimums
              </span>
            </div>
          </div>

          {/* Bookings Card */}
          <div className="bg-white p-6 hover:bg-gray-50/50 transition-colors">
            <div className="mb-4">
              <h3 className="text-[12px] font-semibold text-gray-500 uppercase tracking-wider">Total Bookings</h3>
            </div>
            <div className="flex items-end gap-3">
              <span className="text-4xl tracking-tight text-gray-900">
                {stats.total_bookings}
              </span>
            </div>
          </div>

          {/* Popular Service Card */}
          <div className="bg-white p-6 hover:bg-gray-50/50 transition-colors">
            <div className="mb-4">
              <h3 className="text-[12px] font-semibold text-gray-500 uppercase tracking-wider">Top Service</h3>
            </div>
            <div className="mt-2">
              <span className="text-xl font-semibold tracking-tight text-gray-900">
                {stats.popular_service}
              </span>
            </div>
          </div>

        </div>

        <div className="mt-8">
          <p className="text-[13px] text-gray-500">
            <strong>Note on Analytics:</strong> These analytics are currently calculated based on bookings that are marked as confirmed. 
            Revenue is an estimate that takes the base price of the service booked. 
            If you have customized pricing for individual clients, this revenue figure serves as a baseline estimate.
          </p>
        </div>
      </>
      )}
    </div>
  );
}
