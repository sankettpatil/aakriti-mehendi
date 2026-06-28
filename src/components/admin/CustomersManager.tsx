import React, { useState, useEffect } from 'react';
import { Search, Mail, MapPin, Calendar as CalendarIcon, Phone } from 'lucide-react';
import type { CustomerCRM } from '../../lib/db';

export function CustomersManager() {
  const [customers, setCustomers] = useState<CustomerCRM[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const res = await fetch('/api/admin/customers');
      const data = await res.json();
      if (data.success) {
        setCustomers(data.customers);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('Failed to fetch customers.');
    } finally {
      setLoading(false);
    }
  };

  const filteredCustomers = customers.filter(c => {
    if (!search) return true;
    const q = search.toLowerCase();
    return c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q) || c.phone.includes(q);
  });

  if (loading) return <div className="text-gray-500 text-[13px]">Loading CRM data...</div>;
  if (error) return <div className="text-red-600 text-[13px]">{error}</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl tracking-tight text-gray-900">Customers CRM</h2>
          <p className="text-[12px] text-gray-500 mt-0.5">Manage your client relationships ({customers.length} total).</p>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search name, email, phone..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9 pr-4 py-1.5 bg-white border border-gray-200 rounded-md text-[13px] text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900/30 focus:border-[#982820]/50 w-full sm:w-64 transition-all shadow-none"
          />
        </div>
      </div>

      <div className="bg-white rounded-md shadow-none border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="bg-gray-50 text-[11px] uppercase tracking-wider text-gray-500 border-b border-gray-200">
                <th className="px-6 py-4 font-medium">Customer</th>
                <th className="px-6 py-4 font-medium">Contact</th>
                <th className="px-6 py-4 font-medium text-center">Bookings</th>
                <th className="px-6 py-4 font-medium">First Visit</th>
                <th className="px-6 py-4 font-medium">Last Visit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#FFDAD4]/30">
              {filteredCustomers.length > 0 ? (
                filteredCustomers.map((c, i) => (
                  <tr key={i} className="hover:bg-gray-50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-50 border border-gray-200 text-gray-900 flex items-center justify-center font-medium text-lg shrink-0">
                          {c.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-medium text-lg text-gray-900">{c.name}</div>
                          <div className="text-[12px] text-gray-500 mt-0.5 flex items-center gap-1">
                            <MapPin className="w-3 h-3" /> {c.city}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-[13px] text-gray-900 flex items-center gap-1.5 mb-1">
                        <Mail className="w-3.5 h-3.5 text-gray-500" />
                        <a href={`mailto:${c.email}`} className="hover:underline hover:text-gray-900">{c.email}</a>
                      </div>
                      <div className="text-[12px] text-gray-500 flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-gray-500" />
                        {c.phone}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center justify-center min-w-[24px] h-6 px-2 rounded-md bg-gray-50 border border-gray-200 text-[12px] font-medium text-gray-900">
                        {c.total_bookings}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-[13px] text-gray-900 flex items-center gap-1.5">
                        <CalendarIcon className="w-3.5 h-3.5 text-gray-500" />
                        {c.first_booking_date}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-[13px] text-gray-900 flex items-center gap-1.5">
                        <CalendarIcon className="w-3.5 h-3.5 text-gray-500" />
                        {c.last_booking_date}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500 text-sm">
                    No customers found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
