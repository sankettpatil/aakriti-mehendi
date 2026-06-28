import React, { useReducer, useEffect, Component, type ErrorInfo } from "react";
import { Toaster } from "sonner";

import type { BookingState, Action } from "./types";
import { BookingSidebar } from "./BookingSidebar";
import { Step1Occasion } from "./Step1Occasion";
import { Step2BridalScope } from "./Step2BridalScope";
import { Step3Headcount } from "./Step3Headcount";
import { Step4DesignStyle } from "./Step4DesignStyle";
import { Step5BodyCoverage } from "./Step5BodyCoverage";
import { Step6Addons } from "./Step6Addons";
import { Step7Location } from "./Step7Location";
import { Step8DateTime } from "./Step8DateTime";
import { Step9Contact } from "./Step9Contact";
import { Step10Summary } from "./Step10Summary";
import { estimateDuration } from "../../lib/booking.config";

// ─── Error Boundary ───────────────────────────────────────────────
class BookingErrorBoundary extends Component<
  { children: React.ReactNode; onReset: () => void },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: React.ReactNode; onReset: () => void }) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }
  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("ErrorBoundary caught:", error, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-bg p-8">
          <div className="max-w-md text-center space-y-4">
            <div className="text-4xl">😵</div>
            <h2 className="font-display text-2xl text-ink">
              Something went wrong
            </h2>
            <p className="font-body text-ink-muted text-sm">
              {this.state.error?.message || "An error occurred."}
            </p>
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null });
                this.props.onReset();
              }}
              className="px-6 py-3 bg-brand text-white font-body font-semibold text-sm rounded"
            >
              Try Again
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

// ─── State ────────────────────────────────────────────────────────
const initialState: BookingState = {
  step: 1,
  occasion: "",
  bridal_scope: [],
  family_headcount: 0,
  family_design_style: "",
  headcount: "",
  design_style: "",
  body_coverage: [],
  addons: [],
  booking_urgency: "",
  location_type: "",
  venue_address: "",
  city: "",
  pincode: "",
  travel_charge: 0,
  date: null,
  time: null,
  customer_name: "",
  phone: "",
  email: "",
  whatsapp: "",
  notes: "",
  reference_images: [],
};

function reducer(state: BookingState, action: Action): BookingState {
  switch (action.type) {
    case "NEXT_STEP": {
      let nextStep = state.step + 1;
      // Skip logic: if occasion is NOT bridal, skip step 2
      if (state.step === 1 && state.occasion !== "bridal") nextStep = 3;
      // Skip logic: if occasion IS bridal, skip step 3
      if (state.step === 2 && state.occasion === "bridal") nextStep = 4;
      return { ...state, step: Math.min(nextStep, 10) };
    }
    case "PREV_STEP": {
      let prevStep = state.step - 1;
      // Skip logic backwards
      if (state.step === 4 && state.occasion === "bridal") prevStep = 2;
      if (state.step === 3 && state.occasion !== "bridal") prevStep = 1;
      return { ...state, step: Math.max(prevStep, 1) };
    }
    case "GOTO_STEP":
      return { ...state, step: action.payload };
    case "UPDATE_STATE":
      return { ...state, ...action.payload };
    default:
      return state;
  }
}

const STORAGE_KEY = 'aakriti_booking_state';

function getInitialState(): BookingState {
  if (typeof window !== 'undefined') {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return { ...initialState, ...parsed };
      }
    } catch (e) {
      // ignore corrupted storage
    }
  }
  return initialState;
}

// ─── Main Component ───────────────────────────────────────────────
export function BookingFlow() {
  const [state, dispatch] = useReducer(reducer, initialState, () => getInitialState());

  // Persist state to sessionStorage on every change
  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      // ignore quota errors
    }
  }, [state]);

  const handleNext = () => {
    dispatch({ type: "NEXT_STEP" });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const handlePrev = () => {
    dispatch({ type: "PREV_STEP" });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const handleGotoStep = (step: number) => {
    dispatch({ type: "GOTO_STEP", payload: step });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const handleUpdate = (updates: Partial<BookingState>) =>
    dispatch({ type: "UPDATE_STATE", payload: updates });
  const handleReset = () => {
    try { sessionStorage.removeItem(STORAGE_KEY); } catch (e) {}
    dispatch({ type: "GOTO_STEP", payload: 1 });
  };

  const renderStep = () => {
    switch (state.step) {
      case 1:
        return (
          <Step1Occasion
            selected={state.occasion}
            onSelect={(val) => handleUpdate({ occasion: val })}
            onNext={handleNext}
          />
        );
      case 2:
        return (
          <Step2BridalScope
            bridalScope={state.bridal_scope}
            familyHeadcount={state.family_headcount}
            familyDesignStyle={state.family_design_style}
            onUpdate={handleUpdate}
            onNext={handleNext}
            onPrev={handlePrev}
          />
        );
      case 3:
        return (
          <Step3Headcount
            occasion={state.occasion}
            headcount={state.headcount}
            onUpdate={(val) => handleUpdate({ headcount: val })}
            onNext={handleNext}
            onPrev={handlePrev}
          />
        );
      case 4:
        return (
          <Step4DesignStyle
            designStyle={state.design_style}
            headcount={state.headcount}
            onUpdate={(val) => handleUpdate({ design_style: val })}
            onNext={handleNext}
            onPrev={handlePrev}
          />
        );
      case 5:
        return (
          <Step5BodyCoverage
            occasion={state.occasion}
            bodyCoverage={state.body_coverage}
            onUpdate={(val) => handleUpdate({ body_coverage: val })}
            onNext={handleNext}
            onPrev={handlePrev}
          />
        );
      case 6:
        return (
          <Step6Addons
            addons={state.addons}
            bookingUrgency={state.booking_urgency}
            onUpdate={handleUpdate}
            onNext={handleNext}
            onPrev={handlePrev}
          />
        );
      case 7:
        return (
          <Step7Location
            locationType={state.location_type}
            venueAddress={state.venue_address}
            city={state.city}
            pincode={state.pincode}
            onUpdate={handleUpdate}
            onNext={handleNext}
            onPrev={handlePrev}
          />
        );
      case 8:
        return (
          <Step8DateTime
            date={state.date}
            time={state.time}
            estimatedDurationMins={estimateDuration(state)}
            onUpdate={handleUpdate}
            onNext={handleNext}
            onPrev={handlePrev}
          />
        );
      case 9:
        return (
          <Step9Contact
            customerName={state.customer_name}
            phone={state.phone}
            email={state.email}
            whatsapp={state.whatsapp}
            notes={state.notes}
            onUpdate={handleUpdate}
            onNext={handleNext}
            onPrev={handlePrev}
          />
        );
      case 10:
        return (
          <Step10Summary
            state={state}
            onPrev={handlePrev}
            onEditStep={handleGotoStep}
          />
        );
      default:
        return null;
    }
  };

  return (
    <BookingErrorBoundary onReset={handleReset}>
      <div className="min-h-screen w-full bg-bg flex justify-center">
        <Toaster position="top-center" richColors />
        <div className="flex flex-col lg:flex-row w-full max-w-[1400px]">
          {/* Desktop Sidebar */}
          <div className="hidden lg:block w-[300px] xl:w-[340px] shrink-0 sticky top-0 h-screen overflow-y-auto border-r border-border/40 bg-surface/30">
            <BookingSidebar state={state} onNavigate={handleGotoStep} />
          </div>

          {/* Mobile Header */}
          <div className="lg:hidden bg-bg p-5 border-b border-border/40 sticky top-0 z-20">
            <div className="flex items-center justify-between mb-3">
              <a href="/" className="font-script text-2xl text-ink">
                Aakriti
              </a>
              <div className="font-body text-[9px] font-bold text-ink-muted tracking-[0.2em] uppercase">
                Step {(() => {
                  let displayStep = state.step;
                  if (state.occasion === 'bridal' && state.step > 3) displayStep -= 1;
                  if (state.occasion !== 'bridal' && state.step > 2) displayStep -= 1;
                  return displayStep;
                })()} / 9
              </div>
            </div>
            {/* Mobile Progress Bar */}
            <div className="lg:hidden h-1 bg-surface w-full">
              <div 
                className="h-full bg-[#982820] transition-all duration-300 ease-in-out"
                style={{ width: `${(((() => {
                  let displayStep = state.step;
                  if (state.occasion === 'bridal' && state.step > 3) displayStep -= 1;
                  if (state.occasion !== 'bridal' && state.step > 2) displayStep -= 1;
                  return displayStep;
                })()) / 9) * 100}%` }}
              />
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 min-w-0 px-6 py-10 sm:px-10 lg:px-16 lg:py-20 overflow-hidden relative min-h-[700px] flex justify-center">
            <div className="w-full max-w-[800px] relative">{renderStep()}</div>
          </div>
        </div>
      </div>
    </BookingErrorBoundary>
  );
}
