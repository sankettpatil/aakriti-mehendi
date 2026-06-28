import React, { useState } from 'react';
import { DayPicker } from 'react-day-picker';
import { format, isSameDay, parseISO } from 'date-fns';
import { BookingDetailPanel } from './BookingDetailPanel';

interface Booking {
  id: number;
  booking_ref: string;
  customer_name: string;
  customer_phone: string;
  customer_whatsapp: string | null;
  customer_email: string;
  customer_city: string;
  appointment_date: string;
  appointment_time: string;
  status: string;
  service_name: string;
  notes: string | null;
  admin_notes: string | null;
  created_at: string;
  event_type: string | null;
  event_date: string | null;
}

interface Props {
  initialBookings: Booking[];
}

import { AppCalendar } from '../ui/AppCalendar';

export function AdminCalendar({ initialBookings }: Props) {
  const [bookings, setBookings] = useState<Booking[]>(initialBookings);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  const getBookingsForDate = (date: Date) => {
    return bookings.filter(b => b.appointment_date === format(date, 'yyyy-MM-dd'));
  };

  const handleStatusUpdate = async (id: number, newStatus: string, adminNotes?: string, declineReason?: string, assignedArtistId?: number | null) => {
    try {
      const payload: any = { status: newStatus, admin_notes: adminNotes, decline_reason: declineReason };
      if (assignedArtistId !== undefined) {
        payload.assigned_artist_id = assignedArtistId;
      }
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
      console.error('Failed to update status', error);
    }
  };

  const selectedDateBookings = selectedDate ? getBookingsForDate(selectedDate) : [];

  // Use the shared modifier styles from AppCalendar
  const datesWithBookings = bookings.map(b => parseISO(b.appointment_date));

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      <div className="bg-white p-6 lg:p-10 rounded-md shadow-none border border-gray-200 lg:w-[55%] flex flex-col items-center justify-center">
        <AppCalendar
          mode="single"
          selected={selectedDate}
          onSelect={setSelectedDate}
          showOutsideDays
          modifiers={{
            limited: datesWithBookings // Use 'limited' modifier to show the indicator dot
          }}
          modifiersClassNames={{
            limited: 'day-limited'
          }}
        />
        
        <div className="flex items-center justify-center gap-5 mt-10 pt-6 border-t border-gray-200 text-xs font-medium text-gray-500 w-full">
          <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-gray-900"></div> Selected</div>
          <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-[#FFDAD4]"></div> Has Bookings</div>
        </div>
      </div>

      <div className="lg:w-1/3">
        <div className="bg-white p-6 rounded-md shadow-none border border-gray-200 sticky top-6">
          <h3 className="font-medium tracking-tight text-2xl text-gray-900 mb-2">
            {selectedDate ? format(selectedDate, 'EEEE, MMMM do') : 'Select a date'}
          </h3>
          <p className="text-sm text-gray-500 mb-6">
            {selectedDateBookings.length} {selectedDateBookings.length === 1 ? 'booking' : 'bookings'} scheduled
          </p>

          <div className="space-y-4">
            {selectedDateBookings.length > 0 ? (
              selectedDateBookings.sort((a, b) => a.appointment_time.localeCompare(b.appointment_time)).map(b => (
                <div 
                  key={b.id} 
                  onClick={() => setSelectedBooking(b)}
                  className="p-4 rounded-md border border-gray-200 hover:border-[#982820]/30 hover:shadow-none cursor-pointer transition-all flex flex-col gap-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-gray-900">{b.appointment_time}</span>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                      b.status === 'confirmed' ? 'bg-emerald-50 text-emerald-500' :
                      b.status === 'pending' ? 'bg-yellow-50 text-yellow-600' :
                      b.status === 'completed' ? 'bg-ink-muted/10 text-gray-500' :
                      'bg-red-50 text-red-600'
                    }`}>
                      {b.status}
                    </span>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">{b.customer_name}</div>
                    <div className="text-xs text-gray-500">
                      {b.occasion_type ? (
                        <span className="capitalize">{b.occasion_type.replace('_', ' ')}</span>
                      ) : (
                        b.service_name
                      )} 
                      {' • '} 
                      {((b as any).location_type === 'studio' || b.customer_city === 'studio') ? 'At Studio' : (b.customer_city || 'No City')}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500 text-sm">
                No bookings for this date.
              </div>
            )}
          </div>
        </div>
      </div>

      {selectedBooking && (
        <BookingDetailPanel 
          booking={selectedBooking} 
          onClose={() => setSelectedBooking(null)} 
          onUpdateStatus={handleStatusUpdate}
        />
      )}
    </div>
  );
}
