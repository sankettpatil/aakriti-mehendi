import React, { useState } from 'react';
import { Search, ChevronDown, Eye, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { BookingDetailPanel } from './BookingDetailPanel';

interface Booking {
  id: number;
  booking_ref: string;
  customer_name: string;
  customer_phone: string;
  customer_whatsapp: string | null;
  customer_email: string;
  customer_city: string;
  customer_pincode: string | null;
  event_city: string; // From SQL alias
  venue_address: string | null;
  location_type: string | null;
  travel_charge: number | null;
  appointment_date: string;
  appointment_time: string;
  status: string;
  service_name: string;
  notes: string | null;
  admin_notes: string | null;
  created_at: string;
  event_type: string | null;
  event_date: string | null;
  occasion_type?: string;
  recommended_package?: string;
  is_bridal?: number;
  bridal_scope?: string;
  family_headcount?: number;
  family_design_style?: string;
  headcount_range?: string;
  design_style?: string;
  body_coverage?: string;
  addons?: string;
  booking_urgency?: string;
  estimated_duration_mins?: number;
  estimated_price_min?: number;
  estimated_price_max?: number;
  final_confirmed_price?: number;
  is_multiday?: number;
  reference_image_urls?: string;
  assigned_artist_id?: number | null;
  decline_reason?: string | null;
}

interface Props {
  initialBookings: Booking[];
  artists?: { id: number; name: string }[];
}

export function BookingsTable({ initialBookings, artists = [] }: Props) {
  const [bookings, setBookings] = useState<Booking[]>(initialBookings);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  const filteredBookings = bookings.filter(b => {
    if (filter !== 'all' && b.status !== filter) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        b.customer_name.toLowerCase().includes(q) ||
        b.booking_ref.toLowerCase().includes(q) ||
        b.customer_phone.includes(q)
      );
    }
    return true;
  });

  const handleStatusUpdate = async (id: number, newStatus: string, adminNotes?: string, declineReason?: string, assignedArtistId?: number | null) => {
    try {
      const payload: any = { status: newStatus };
      if (adminNotes !== undefined) payload.admin_notes = adminNotes;
      if (declineReason !== undefined) payload.decline_reason = declineReason;
      if (assignedArtistId !== undefined) payload.assigned_artist_id = assignedArtistId;

      const res = await fetch(`/api/admin/bookings/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      if (res.ok) {
        const data = await res.json();
        setBookings(prev => prev.map(b => b.id === id ? { ...b, ...data.booking, service_name: b.service_name } : b));
        if (selectedBooking && selectedBooking.id === id) {
          setSelectedBooking({ ...selectedBooking, ...data.booking });
        }
      }
    } catch (error) {
      console.error('Failed to update booking', error);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md border border-gray-200 bg-white text-gray-900 text-[11px] font-medium uppercase tracking-wider"><span className="w-1.5 h-1.5 rounded-full bg-success"></span> Confirmed</span>;
      case 'pending':
        return <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md border border-gray-200 bg-white text-gray-900 text-[11px] font-medium uppercase tracking-wider"><span className="w-1.5 h-1.5 rounded-full bg-warn"></span> Pending</span>;
      case 'declined':
      case 'cancelled':
        return <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md border border-gray-200 bg-white text-gray-900 text-[11px] font-medium uppercase tracking-wider"><span className="w-1.5 h-1.5 rounded-full bg-error"></span> {status}</span>;
      case 'completed':
        return <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md border border-gray-200 bg-white text-gray-900 text-[11px] font-medium uppercase tracking-wider"><span className="w-1.5 h-1.5 rounded-full bg-ink-muted"></span> {status}</span>;
      default:
        return <span>{status}</span>;
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
        <div className="flex flex-wrap gap-2">
          {['all', 'pending', 'confirmed', 'completed', 'declined', 'cancelled'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-md text-[13px] font-medium transition-all ${
                filter === f 
                  ? 'bg-ink text-white shadow-none' 
                  : 'bg-white border border-gray-200 text-gray-500 hover:text-gray-900 hover:bg-bg'
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search bookings..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9 pr-4 py-1.5 bg-white border border-gray-200 rounded-md text-[13px] text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent w-full sm:w-64 transition-all"
          />
        </div>
      </div>

      <div className="bg-white rounded-md shadow-none border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-gray-50 text-[11px] uppercase tracking-wider text-gray-500 border-b border-gray-200">
                <th className="px-5 py-3 font-medium">Ref & Customer</th>
                <th className="px-5 py-3 font-medium">Service</th>
                <th className="px-5 py-3 font-medium">Date & Time</th>
                <th className="px-5 py-3 font-medium">Assigned To</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#FFDAD4]/30">
              {filteredBookings.length > 0 ? (
                filteredBookings.map((b) => (
                  <tr key={b.id} className="hover:bg-gray-50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="font-medium text-lg text-gray-900 truncate max-w-[150px]">{b.customer_name}</div>
                      <div className="text-[12px] text-gray-500 mt-0.5 font-mono">{b.booking_ref}</div>
                    </td>
                      <td className="px-5 py-3 text-[13px] text-gray-900">
                        {b.occasion_type ? (
                          <>
                            <div className="capitalize">{b.occasion_type.replace('_', ' ')}</div>
                            <div className="text-[12px] text-gray-500 mt-0.5">{b.recommended_package?.replace('_', ' ')}</div>
                          </>
                        ) : (
                          b.service_name
                        )}
                        <div className="text-[12px] text-gray-500 mt-0.5">
                          {(b as any).location_type === 'studio' ? 'At Studio' : (b.event_city || (b as any).customer_city || 'No City')}
                        </div>
                      </td>
                    <td className="px-5 py-3">
                      <div className="text-[13px] text-gray-900">{b.appointment_date}</div>
                      <div className="text-[12px] text-gray-500 mt-0.5">{b.appointment_time || 'TBD'}</div>
                    </td>
                    <td className="px-5 py-3">
                      {b.assigned_artist_id ? (
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 rounded-full bg-ink/10 flex items-center justify-center text-[10px] text-gray-900 font-bold">
                            {artists.find(a => a.id === b.assigned_artist_id)?.name.charAt(0).toUpperCase() || '?'}
                          </div>
                          <span className="text-[13px] text-gray-900">{artists.find(a => a.id === b.assigned_artist_id)?.name || 'Unknown'}</span>
                        </div>
                      ) : (
                        <span className="text-[12px] text-gray-500">Unassigned</span>
                      )}
                    </td>
                    <td className="px-5 py-3">
                      {getStatusBadge(b.status)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => setSelectedBooking(b)}
                        className="p-1.5 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    No bookings found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedBooking && (
        <BookingDetailPanel 
          booking={selectedBooking} 
          artists={artists}
          onClose={() => setSelectedBooking(null)} 
          onUpdateStatus={handleStatusUpdate}
        />
      )}
    </div>
  );
}
