import { useState } from 'react';
import { Eye } from 'lucide-react';
import { BookingDetailPanel } from './BookingDetailPanel';

interface DashboardUpcomingBookingsProps {
  upcomingBookings: any[];
  artists: any[];
}

export function DashboardUpcomingBookings({ upcomingBookings, artists }: DashboardUpcomingBookingsProps) {
  const [selectedBooking, setSelectedBooking] = useState<any | null>(null);

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
        window.location.reload();
      } else {
        console.error('Failed to update booking status');
      }
    } catch (error) {
      console.error('Failed to update booking', error);
    }
  };

  return (
    <>
      <div className="bg-white rounded-md shadow-none border border-gray-200 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200 flex items-center justify-between bg-white">
          <h2 className="font-semibold text-xl tracking-tight text-gray-900">Upcoming Bookings</h2>
          <a href="/admin/bookings" className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">View all &rarr;</a>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-gray-50 text-[11px] uppercase tracking-wider text-gray-500 border-b border-gray-200">
                <th className="px-6 py-4 font-medium">Customer</th>
                <th className="px-6 py-4 font-medium">Service</th>
                <th className="px-6 py-4 font-medium">Date & Time</th>
                <th className="px-6 py-4 font-medium">Assigned To</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {upcomingBookings.length > 0 ? (
                upcomingBookings.map((b: any) => (
                  <tr key={b.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-sm text-gray-900 truncate max-w-[150px]">{b.customer_name}</div>
                      <div className="text-[12px] text-gray-500 truncate max-w-[150px]">
                        {b.location_type === 'studio' ? 'At Studio' : (b.customer_city || 'No City')}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-[13px] text-gray-900">
                        {b.occasion_type ? String(b.occasion_type).replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) : b.service_name}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-[13px] text-gray-900 whitespace-nowrap font-medium">{b.appointment_date}</div>
                      <div className="text-[12px] text-gray-500">{b.appointment_time || 'TBD'}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-[13px] text-gray-900">{b.artist_name || 'Unassigned'}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-semibold uppercase tracking-widest ${
                        b.status === 'confirmed' ? 'bg-emerald-50 text-emerald-500' :
                        b.status === 'pending' ? 'bg-yellow-50 text-yellow-600' :
                        b.status === 'declined' || b.status === 'cancelled' ? 'bg-red-50 text-red-600' :
                        'bg-gray-50 text-gray-500'
                      }`}>
                        {b.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => setSelectedBooking(b)}
                        className="p-1.5 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500 text-sm">
                    No upcoming confirmed bookings.
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
    </>
  );
}
