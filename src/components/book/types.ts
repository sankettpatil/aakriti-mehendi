export interface BookingState {
  step: number;
  
  // Step 1
  occasion: string;
  
  // Step 2 (Bridal)
  bridal_scope: string[];
  family_headcount: number;
  family_design_style: string;
  
  // Step 3 (Non-Bridal Headcount)
  headcount: string;
  
  // Step 4
  design_style: string;
  
  // Step 5
  body_coverage: string[];
  
  // Step 6
  addons: string[];
  booking_urgency: string;
  
  // Step 7
  location_type: string;
  venue_address: string;
  city: string;
  pincode: string;
  travel_charge: number;
  
  // Step 8
  date: string | null;
  time: string | null;
  
  // Step 9
  customer_name: string;
  phone: string;
  email: string;
  whatsapp: string;
  notes: string;
  reference_images: string[];
}

export type Action =
  | { type: 'NEXT_STEP' }
  | { type: 'PREV_STEP' }
  | { type: 'GOTO_STEP'; payload: number }
  | { type: 'UPDATE_STATE'; payload: Partial<BookingState> };
