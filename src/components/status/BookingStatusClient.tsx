import React, { useState } from 'react';
import { Search, ChevronRight, CheckCircle2, Clock, XCircle, Calendar, IndianRupee } from 'lucide-react';
import { Button } from '../ui/button';

interface BookingStatus {
  booking_ref: string;
  status: string;
  service_name: string | null;
  occasion_type: string | null;
  appointment_date: string;
  appointment_time: string | null;
  customer_name: string;
  created_at: string;
  final_confirmed_price: number | null;
  estimated_price_min: number | null;
  estimated_price_max: number | null;
}

export function BookingStatusClient() {
  const [ref, setRef] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [booking, setBooking] = useState<BookingStatus | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ref || !email) return;

    setLoading(true);
    setError(null);
    setBooking(null);

    try {
      const formattedRef = ref.trim().toUpperCase();
      const res = await fetch(`/api/booking/${formattedRef}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to fetch booking');
      }

      setBooking(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed': return <CheckCircle2 className="w-6 h-6 text-success" />;
      case 'completed': return <CheckCircle2 className="w-6 h-6 text-success" />;
      case 'declined': return <XCircle className="w-6 h-6 text-destructive" />;
      default: return <Clock className="w-6 h-6 text-warn" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed': return <span className="bg-success/10 text-success border border-success/20 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">Confirmed</span>;
      case 'completed': return <span className="bg-success/10 text-success border border-success/20 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">Completed</span>;
      case 'declined': return <span className="bg-destructive/10 text-destructive border border-destructive/20 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">Declined</span>;
      default: return <span className="bg-warn/10 text-warn border border-warn/20 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">Pending Review</span>;
    }
  };

  return (
    <div className="max-w-2xl mx-auto w-full">
      
      {!booking ? (
        <div className="bg-surface rounded-2xl shadow-sm border border-border/60 p-8 md:p-10 animation-fade-in">
          <h2 className="font-display text-2xl text-ink font-semibold mb-2">Check Your Booking Status</h2>
          <p className="font-body text-ink-muted text-sm mb-8">
            Enter your booking reference number and the email address you used to book.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="ref" className="block text-xs font-medium text-ink uppercase tracking-wider mb-1.5">Booking Reference</label>
              <input
                id="ref"
                type="text"
                placeholder="e.g. B-123456"
                value={ref}
                onChange={(e) => setRef(e.target.value)}
                required
                className="w-full bg-surface border border-border/60 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:border-[#982820] focus:ring-1 focus:ring-[#982820]/20 transition-all text-base"
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-xs font-medium text-ink uppercase tracking-wider mb-1.5">Email Address</label>
              <input
                id="email"
                type="email"
                placeholder="hello@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-surface border border-border/60 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:border-[#982820] focus:ring-1 focus:ring-[#982820]/20 transition-all text-base"
              />
            </div>

            {error && (
              <div className="p-3 bg-destructive/5 border border-destructive/20 rounded-lg flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
                <p className="text-sm font-medium text-destructive">{error}</p>
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full py-6 text-[15px] group"
              disabled={loading || !ref || !email}
            >
              {loading ? 'Searching...' : 'Find Booking'}
              {!loading && <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />}
            </Button>
          </form>
        </div>
      ) : (
        <div className="bg-surface rounded-2xl shadow-sm border border-border/60 overflow-hidden animation-fade-in">
          
          <div className="p-8 md:p-10 border-b border-border/60 bg-bg/30 relative">
            <button 
              onClick={() => setBooking(null)}
              className="absolute top-6 right-6 text-ink-muted hover:text-ink text-sm font-medium transition-colors"
            >
              Check Another
            </button>
            
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-full bg-surface shadow-sm border border-border flex items-center justify-center shrink-0">
                {getStatusIcon(booking.status)}
              </div>
              <div>
                <h2 className="font-display text-xl text-ink font-semibold">Hello, {booking.customer_name}</h2>
                <p className="font-body text-ink-muted text-sm">Ref: {booking.booking_ref}</p>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-ink-muted uppercase tracking-wider mb-1 font-medium">Status</p>
                {getStatusBadge(booking.status)}
              </div>
              
              {booking.status === 'pending' && (
                <p className="text-xs text-ink-muted max-w-[200px] text-right">
                  We are reviewing your request and will confirm shortly.
                </p>
              )}
            </div>
          </div>

          <div className="p-8 md:p-10 bg-surface space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div>
                <div className="flex items-center gap-2 mb-1.5 text-ink-muted">
                  <Calendar className="w-4 h-4" />
                  <p className="text-xs font-semibold uppercase tracking-wider">Date & Time</p>
                </div>
                <p className="font-medium text-ink">{booking.appointment_date}</p>
                {booking.appointment_time && (
                  <p className="text-sm text-ink-muted mt-0.5">{booking.appointment_time}</p>
                )}
              </div>

              <div>
                <div className="flex items-center gap-2 mb-1.5 text-ink-muted">
                  <CheckCircle2 className="w-4 h-4" />
                  <p className="text-xs font-semibold uppercase tracking-wider">Service</p>
                </div>
                <p className="font-medium text-ink capitalize">
                  {booking.occasion_type?.replace(/_/g, ' ') || booking.service_name || 'Bespoke Mehndi'}
                </p>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-1.5 text-ink-muted">
                  <IndianRupee className="w-4 h-4" />
                  <p className="text-xs font-semibold uppercase tracking-wider">Price Details</p>
                </div>
                {booking.final_confirmed_price ? (
                  <p className="font-semibold text-[#982820]">₹{booking.final_confirmed_price.toLocaleString('en-IN')} (Confirmed)</p>
                ) : (
                  <p className="font-medium text-ink">
                    {booking.estimated_price_min && booking.estimated_price_max 
                      ? `Est. ₹${booking.estimated_price_min.toLocaleString('en-IN')} - ₹${booking.estimated_price_max.toLocaleString('en-IN')}`
                      : 'To be quoted'}
                  </p>
                )}
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}

function AlertCircle(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" x2="12" y1="8" y2="12" />
      <line x1="12" x2="12.01" y1="16" y2="16" />
    </svg>
  );
}
