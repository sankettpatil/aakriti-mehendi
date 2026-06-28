import React, { useState } from 'react';
import { X, Calendar, Clock, MapPin, Phone, Mail, FileText, Star, AlertTriangle, Image as ImageIcon, Map, Building } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

export interface Booking {
  id: number;
  booking_ref: string;
  customer_name: string;
  customer_phone: string;
  customer_whatsapp: string | null;
  customer_email: string;
  customer_city: string;
  customer_pincode: string | null;
  event_city: string;
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
  booking: Booking;
  artists?: { id: number; name: string }[];
  onClose: () => void;
  onUpdateStatus: (id: number, status: string, adminNotes?: string, declineReason?: string, assignedArtistId?: number | null) => void;
}

export function BookingDetailPanel({ booking, artists = [], onClose, onUpdateStatus }: Props) {
  const [adminNotes, setAdminNotes] = useState(booking.admin_notes || '');
  const [assignedArtistId, setAssignedArtistId] = useState<number | null>(booking.assigned_artist_id || null);
  const [showDeclineForm, setShowDeclineForm] = useState(false);
  const [declineReason, setDeclineReason] = useState('');

  const handleSaveNotes = () => {
    onUpdateStatus(booking.id, booking.status, adminNotes, undefined, assignedArtistId);
  };

  const handleConfirm = () => {
    onUpdateStatus(booking.id, 'confirmed', adminNotes, undefined, assignedArtistId);
  };

  const handleDecline = () => {
    if (declineReason.trim() === '') return;
    onUpdateStatus(booking.id, 'declined', undefined, declineReason);
    setShowDeclineForm(false);
  };

  const parseJsonSafe = (str: string | null | undefined, fallback: any = []) => {
    if (!str || str === '[]') return fallback;
    try { return JSON.parse(str); } catch (e) { return fallback; }
  };

  const coverage = parseJsonSafe(booking.body_coverage);
  const addons = parseJsonSafe(booking.addons);
  const references = parseJsonSafe(booking.reference_image_urls);
  
  // Format urgency
  const formatUrgency = (urgency: string) => {
    if (urgency === 'today') return 'Same Day (Today)';
    if (urgency === 'tomorrow') return 'Next Day (Tomorrow)';
    if (urgency === '1_3_days') return 'Within 1-3 Days';
    if (urgency === '3_7_days') return 'Within 3-7 Days';
    return urgency.replace(/_/g, ' ');
  };

  // Resolve address fallback
  const displayAddress = booking.venue_address || (booking as any).customer_address || (booking as any).event_address;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex justify-end">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-gray-900/20 backdrop-blur-sm"
        />
        <motion.div 
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="relative w-full max-w-3xl h-full bg-white shadow-2xl flex flex-col z-10 border-l border-gray-200"
        >
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between px-8 py-6 bg-white border-b border-gray-200 shrink-0 gap-4 shadow-none">
            <div>
              <div className="flex items-center gap-4 mb-2">
                <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Booking Request</h2>
                <span className={`px-2.5 py-1 rounded text-[11px] font-bold uppercase tracking-widest border ${
                  booking.status === 'confirmed' ? 'bg-emerald-50 text-emerald-500 border-emerald-200' :
                  booking.status === 'pending' ? 'bg-gray-100 text-gray-900 border-gray-200' :
                  booking.status === 'declined' || booking.status === 'cancelled' ? 'bg-red-50 text-red-600 border-red-200' :
                  'bg-gray-50 text-gray-500 border-gray-200'
                }`}>
                  {booking.status}
                </span>
              </div>
              <p className="font-mono text-[13px] text-gray-500 uppercase">{booking.booking_ref} <span className="mx-2 text-gray-300">•</span> {new Date(booking.created_at).toLocaleString()}</p>
            </div>
            
            <div className="flex items-center gap-3">
              {booking.status === 'pending' && (
                <>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setShowDeclineForm(true)}
                    className="border border-gray-200 text-gray-900 bg-white hover:bg-gray-50 rounded-md"
                  >
                    Decline Request
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button size="sm" className="bg-gray-900 text-white hover:bg-gray-800 rounded-md shadow-none font-semibold">
                        Confirm Booking
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="rounded-md border-gray-200">
                      <AlertDialogHeader>
                        <AlertDialogTitle className="text-xl font-bold text-gray-900 tracking-tight">Confirm Booking?</AlertDialogTitle>
                        <AlertDialogDescription className="text-sm text-gray-500">
                          Are you sure you want to confirm this booking? An email will be sent to the customer automatically.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="border-gray-200 hover:bg-gray-50">Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleConfirm} className="bg-gray-900 text-white hover:bg-gray-800">Yes, Confirm</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </>
              )}

              {booking.status === 'confirmed' && (
                <>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="border-gray-200 text-gray-900 bg-white hover:bg-gray-50 rounded-md"
                      >
                        Cancel Booking
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="rounded-md border-gray-200">
                      <AlertDialogHeader>
                        <AlertDialogTitle className="text-xl font-bold text-gray-900 tracking-tight">Cancel Booking?</AlertDialogTitle>
                        <AlertDialogDescription className="text-sm text-gray-500">
                          Are you sure you want to cancel this booking? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="border-gray-200 hover:bg-gray-50">Back</AlertDialogCancel>
                        <AlertDialogAction onClick={() => onUpdateStatus(booking.id, 'cancelled', adminNotes, undefined, assignedArtistId)} className="bg-red-600 text-white hover:bg-red-700">Yes, Cancel It</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button size="sm" className="bg-emerald-600 text-white hover:bg-emerald-700 shadow-none border-none font-semibold rounded-md">
                        Mark as Completed
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="rounded-md border-gray-200">
                      <AlertDialogHeader>
                        <AlertDialogTitle className="text-xl font-bold text-gray-900 tracking-tight">Complete Booking</AlertDialogTitle>
                        <AlertDialogDescription className="text-sm text-gray-500">
                          Has the service been successfully provided to the customer? Mark it as completed to close the booking out.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="border-gray-200 hover:bg-gray-50">Not Yet</AlertDialogCancel>
                        <AlertDialogAction onClick={() => onUpdateStatus(booking.id, 'completed', adminNotes, undefined, assignedArtistId)} className="bg-emerald-600 text-white hover:bg-emerald-700">Yes, Completed</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </>
              )}
              <button onClick={onClose} className="p-2 ml-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Decline Form */}
          <AnimatePresence>
            {showDeclineForm && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="bg-white border-b border-gray-200 px-8 py-5 overflow-hidden"
              >
                <h4 className="text-sm font-semibold text-gray-900 mb-1 tracking-tight">Decline Reason</h4>
                <p className="text-xs text-gray-500 mb-3">This exact message will be sent to the customer, so please be polite.</p>
                <textarea
                  value={declineReason}
                  onChange={(e) => setDeclineReason(e.target.value)}
                  placeholder="e.g., I'm so sorry, but our artists are fully booked for this date and time..."
                  className="w-full p-3 bg-white border border-gray-200 rounded-md text-sm mb-4 focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900 min-h-[80px]"
                />
                <div className="flex justify-end gap-3">
                  <Button variant="ghost" size="sm" onClick={() => setShowDeclineForm(false)} className="text-gray-500 hover:text-gray-900 hover:bg-gray-50 rounded-md">Cancel</Button>
                  <Button size="sm" onClick={handleDecline} disabled={declineReason.trim() === ''} className="bg-red-600 text-white hover:bg-red-700 font-semibold rounded-md shadow-none">Decline & Send Email</Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
            
            {/* Unified Data Grid */}
            <div className="border border-gray-200 rounded-lg overflow-hidden grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-200 bg-white">
              
              {/* Top Left: Event Details */}
              <section className="p-6 border-b border-gray-200">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-4">Event Details</h3>
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 border-b border-gray-100 pb-4">
                    <div className="flex-1">
                      <span className="block text-sm text-gray-500 mb-1">Date</span>
                      <span className="text-sm font-medium text-gray-900">{booking.appointment_date}</span>
                    </div>
                    <div className="flex-1">
                      <span className="block text-sm text-gray-500 mb-1">Time</span>
                      <span className="text-sm font-medium text-gray-900 flex items-center gap-2">
                        {booking.appointment_time}
                        {booking.estimated_duration_mins && (
                          <span className="text-xs font-normal text-gray-500 bg-gray-50 px-2 py-0.5 rounded-md border border-gray-200">
                            ~{Math.floor(booking.estimated_duration_mins/60)}h {booking.estimated_duration_mins%60}m
                          </span>
                        )}
                      </span>
                    </div>
                  </div>

                  {booking.is_multiday === 1 && (
                    <div className="bg-yellow-50 text-yellow-700 border border-yellow-200 p-2.5 rounded-md text-xs font-medium flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4" /> Multi-day Session Request
                    </div>
                  )}

                  <div className="pt-2">
                    <span className="block text-sm text-gray-500 mb-2">Location</span>
                    {booking.location_type && (
                      <p className="text-sm font-medium text-gray-900 mb-1 capitalize">
                        {booking.location_type.replace(/_/g, ' ')}
                      </p>
                    )}
                    <p className="text-sm font-medium text-gray-900">{booking.event_city || booking.customer_city}</p>
                    
                    {displayAddress && (
                      <div className="mt-2 bg-gray-50 p-3 rounded-md border border-gray-200">
                        <p className="text-sm leading-relaxed text-gray-600">{displayAddress}</p>
                        {booking.customer_pincode && <p className="text-xs font-mono text-gray-500 mt-1">PIN: {booking.customer_pincode}</p>}
                      </div>
                    )}
                  </div>
                </div>
              </section>

              {/* Top Right: Customer Details */}
              <section className="p-6 border-b border-gray-200">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-4">Customer Details</h3>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-full bg-gray-50 text-gray-900 border border-gray-200 flex items-center justify-center text-xl shrink-0 font-medium">
                    {booking.customer_name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-900">{booking.customer_name}</h4>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Phone</span>
                    <span className="text-sm font-medium text-gray-900">{booking.customer_phone}</span>
                  </div>
                  {booking.customer_whatsapp && booking.customer_whatsapp !== booking.customer_phone && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">WhatsApp</span>
                      <span className="text-sm font-medium text-gray-900">{booking.customer_whatsapp}</span>
                    </div>
                  )}
                  {booking.customer_email && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Email</span>
                      <span className="text-sm font-medium text-gray-900">{booking.customer_email}</span>
                    </div>
                  )}
                </div>
              </section>

              {/* Bottom Left: Financials */}
              <section className="p-6">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-4">Financials</h3>
                <span className="block text-sm text-gray-500 mb-2">Total Estimate</span>
                
                {booking.final_confirmed_price ? (
                  <p className="text-3xl font-semibold text-gray-900 flex items-baseline gap-2 tracking-tight">
                    ₹{booking.final_confirmed_price.toLocaleString('en-IN')}
                    <span className="text-xs text-gray-500 uppercase tracking-widest font-medium">Confirmed</span>
                  </p>
                ) : (
                  <p className="text-2xl font-semibold text-gray-900 tracking-tight">
                    {booking.estimated_price_min && booking.estimated_price_max 
                      ? `₹${booking.estimated_price_min.toLocaleString('en-IN')} - ₹${booking.estimated_price_max.toLocaleString('en-IN')}`
                      : 'Custom Quote'}
                  </p>
                )}

                {(booking.travel_charge || (booking.booking_urgency && booking.booking_urgency !== '7_days_plus')) && (
                  <div className="mt-5 space-y-2 pt-4 border-t border-gray-100">
                    <span className="block text-sm text-gray-500 mb-3">Surcharges Applied</span>
                    
                    {booking.travel_charge !== null && booking.travel_charge > 0 && (
                      <div className="flex items-center justify-between bg-gray-50 border border-gray-200 px-3 py-2 rounded-md">
                        <span className="text-sm text-gray-600">Outstation Travel</span>
                        <span className="text-sm font-medium text-gray-900">+₹{booking.travel_charge}</span>
                      </div>
                    )}
                    
                    {booking.booking_urgency && booking.booking_urgency !== '7_days_plus' && (
                      <div className="flex items-center justify-between bg-gray-50 border border-gray-200 px-3 py-2 rounded-md">
                        <span className="text-sm text-gray-600 capitalize">{formatUrgency(booking.booking_urgency).toLowerCase()}</span>
                        <span className="text-xs font-medium text-gray-500">Included</span>
                      </div>
                    )}
                  </div>
                )}
              </section>

              {/* Bottom Right: Service Scope */}
              <section className="p-6">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-4">Service Scope</h3>
                <div className="mb-4 border-b border-gray-100 pb-4">
                  <span className="block text-sm text-gray-500 mb-1">Occasion</span>
                  <p className="text-sm font-medium text-gray-900 capitalize">
                    {booking.occasion_type ? booking.occasion_type.replace('_', ' ') : booking.service_name}
                  </p>
                  {booking.recommended_package && (
                    <p className="text-xs text-gray-500 mt-1 capitalize">Package: {booking.recommended_package.replace('_', ' ')}</p>
                  )}
                </div>

                <div className="space-y-3">
                  {booking.is_bridal === 1 ? (
                    <>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">Bridal Scope</span>
                        <span className="text-sm font-medium text-gray-900 capitalize">{booking.bridal_scope ? booking.bridal_scope.replace(/_/g, ' ') : 'N/A'}</span>
                      </div>
                      {booking.family_headcount !== null && booking.family_headcount > 0 && (
                        <div className="flex justify-between items-start pt-1">
                          <span className="text-sm text-gray-500">Family Members</span>
                          <span className="text-sm font-medium text-gray-900 text-right">{booking.family_headcount} <br/><span className="text-xs font-normal text-gray-500">Style: {booking.family_design_style}</span></span>
                        </div>
                      )}
                    </>
                  ) : (
                    <>
                      {booking.headcount_range && (
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-500">Headcount</span>
                          <span className="text-sm font-medium text-gray-900 capitalize">{booking.headcount_range.replace('_', ' ')}</span>
                        </div>
                      )}
                      {booking.design_style && (
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-500">Design Style</span>
                          <span className="text-sm font-medium text-gray-900 capitalize">{booking.design_style.replace(/_/g, ' ')}</span>
                        </div>
                      )}
                    </>
                  )}

                  {coverage.length > 0 && (
                    <div className="flex justify-between items-start">
                      <span className="text-sm text-gray-500">Coverage</span>
                      <span className="text-sm font-medium text-gray-900 text-right max-w-[150px] capitalize leading-relaxed">{coverage.map((c:string)=>c.replace(/_/g, ' ')).join(', ')}</span>
                    </div>
                  )}
                  
                  {addons.length > 0 && (
                    <div className="flex justify-between items-start">
                      <span className="text-sm text-gray-500">Add-ons</span>
                      <span className="text-sm font-medium text-gray-900 text-right max-w-[150px] capitalize leading-relaxed">{addons.map((a:string)=>a.replace(/_/g, ' ')).join(', ')}</span>
                    </div>
                  )}
                </div>
              </section>

            </div>

            {/* References */}
            {references && references.length > 0 && (
              <section className="mt-8">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-4">Reference Designs</h3>
                <div className="flex flex-wrap gap-3">
                  {references.map((url: string, i: number) => (
                    <a key={i} href={url} target="_blank" rel="noreferrer" className="w-24 h-24 rounded-md border border-gray-200 overflow-hidden hover:opacity-80 transition-opacity block bg-white">
                      <img src={url} alt={`Reference ${i+1}`} className="w-full h-full object-cover" />
                    </a>
                  ))}
                </div>
              </section>
            )}

            {/* Internal Admin Section */}
            <section className="mt-10 border-t border-gray-200 pt-8">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-6">Internal Management</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Notes Column */}
                <div>
                  {booking.notes && (
                    <div className="mb-6">
                      <span className="block text-sm text-gray-500 mb-2">Message from Customer</span>
                      <div className="p-4 bg-gray-50 border border-gray-200 rounded-md text-sm text-gray-700 leading-relaxed">
                        "{booking.notes}"
                      </div>
                    </div>
                  )}

                  <div>
                    <span className="block text-sm text-gray-500 mb-2">Private Admin Notes</span>
                    <textarea
                      value={adminNotes}
                      onChange={(e) => setAdminNotes(e.target.value)}
                      placeholder="Add private notes, pricing adjustments, or reminders here..."
                      className="w-full p-4 bg-white border border-gray-200 rounded-md text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900 min-h-[120px]"
                    />
                  </div>
                </div>

                {/* Actions Column */}
                <div>
                  <div className="h-full flex flex-col justify-between">
                    <div>
                      <span className="block text-sm text-gray-500 mb-2">Assign Artist</span>
                      <select 
                        value={assignedArtistId || ''}
                        onChange={e => setAssignedArtistId(e.target.value ? Number(e.target.value) : null)}
                        className="w-full p-3 bg-white border border-gray-200 rounded-md text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
                      >
                        <option value="">-- Unassigned --</option>
                        {artists.map(artist => (
                          <option key={artist.id} value={artist.id}>{artist.name}</option>
                        ))}
                      </select>
                      <p className="text-xs text-gray-500 mt-2">Assign an artist to this booking. They will see it in their schedule once confirmed.</p>
                    </div>

                    <div className="mt-6 flex justify-end">
                      <Button 
                        onClick={handleSaveNotes}
                        disabled={adminNotes === (booking.admin_notes || '') && assignedArtistId === booking.assigned_artist_id}
                        className="bg-gray-900 hover:bg-gray-800 text-white font-semibold shadow-none rounded-md"
                      >
                        Save Internal Changes
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </section>
            
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
