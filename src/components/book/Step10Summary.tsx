import React, { useState } from "react";
import { Loader2, CheckCircle2 } from "lucide-react";
import type { BookingState } from "./types";
import {
  calculateEstimate,
  estimateDuration,
  recommendPackage,
  PACKAGE_LABELS,
} from "../../lib/booking.config";
import { format, parseISO } from "date-fns";

interface Step10SummaryProps {
  state: BookingState;
  onPrev: () => void;
  onEditStep: (step: number) => void;
}

export function Step10Summary({
  state,
  onPrev,
  onEditStep,
}: Step10SummaryProps) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const duration = estimateDuration(state);
  const packageRec = recommendPackage(duration);
  const estimate = calculateEstimate(state);

  const formatMins = (m: number) => {
    const hrs = Math.floor(m / 60);
    const mins = m % 60;
    if (hrs > 0 && mins > 0) return `${hrs} hrs ${mins} min`;
    if (hrs > 0) return `${hrs} hrs`;
    return `${mins} min`;
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setError("");
    try {
      const payload = {
        ...state,
        estimated_duration_mins: duration,
        recommended_package: packageRec,
        estimated_price_min: estimate.estimatedMin,
        estimated_price_max: estimate.estimatedMax,
        is_multiday: duration > 720,
      };

      const res = await fetch("/api/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to submit booking");
      }

      const result = await res.json();
      try { sessionStorage.removeItem('aakriti_booking_state'); } catch (e) {}
      window.location.href = `/book/confirmation?ref=${result.booking_ref}`;
    } catch (err: any) {
      setError(err.message || "Something went wrong");
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl w-full mx-auto animation-fade-in pb-12">
      <div className="mb-10 text-center">
        <h2 className="font-display italic text-3xl lg:text-4xl text-ink font-normal tracking-tight">
          Review & Send
        </h2>
      </div>

      <div className="space-y-6 mb-10">
        {/* Summary Card */}
        <div className="bg-surface/50 border border-border/40 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4 pb-4 border-b border-border/40">
            <h3 className="font-display text-xl text-ink">Booking Summary</h3>
            <button
              onClick={() => onEditStep(1)}
              className="text-xs uppercase tracking-wider text-brand font-medium hover:underline"
            >
              Edit Details
            </button>
          </div>

          <div className="space-y-3 font-body text-sm text-ink-muted">
            <div className="grid grid-cols-[120px_1fr] gap-4">
              <span className="font-semibold text-ink">Occasion</span>
              <span className="capitalize">
                {state.occasion?.replace("_", " ")}
              </span>
            </div>

            {state.occasion === "bridal" ? (
              <>
                <div className="grid grid-cols-[120px_1fr] gap-4">
                  <span className="font-semibold text-ink">Bridal Scope</span>
                  <span>
                    {Array.isArray(state.bridal_scope) 
                      ? state.bridal_scope.map(s => s.replace(/_/g, " ")).join(", ")
                      : state.bridal_scope?.replace(/_/g, " ")}
                  </span>
                </div>
                {state.family_headcount > 0 && (
                  <div className="grid grid-cols-[120px_1fr] gap-4">
                    <span className="font-semibold text-ink">Family</span>
                    <span>
                      {state.family_headcount} people (
                      {state.family_design_style})
                    </span>
                  </div>
                )}
              </>
            ) : (
              <div className="grid grid-cols-[120px_1fr] gap-4">
                <span className="font-semibold text-ink">Headcount</span>
                <span>{state.headcount?.replace("_", " ")} people</span>
              </div>
            )}

            <div className="grid grid-cols-[120px_1fr] gap-4">
              <span className="font-semibold text-ink">Body Coverage</span>
              {state.body_coverage && state.body_coverage.length > 0 && (
                <span>{state.body_coverage.map(c => c.replace(/_/g, " ")).join(", ")}</span>
              )}
            </div>

            {state.addons?.length > 0 && (
              <div className="grid grid-cols-[120px_1fr] gap-4">
                <span className="font-semibold text-ink">Add-ons</span>
                <span>
                  {state.addons.map((a) => a.replace(/_/g, " ")).join(", ")}
                </span>
              </div>
            )}

            <div className="grid grid-cols-[120px_1fr] gap-4">
              <span className="font-semibold text-ink">Location</span>
              <span>
                {state.location_type === "studio"
                  ? "Studio"
                  : state.venue_address}
              </span>
            </div>

            <div className="grid grid-cols-[120px_1fr] gap-4 pt-4 mt-2 border-t border-border/20">
              <span className="font-semibold text-ink">Date & Time</span>
              <span>
                {state.date
                  ? format(parseISO(state.date), "dd MMM yyyy")
                  : "TBD"}
                {state.time ? ` at ${state.time}` : ""}
                {duration > 720 && " (Multi-day start)"}
              </span>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-border/40 flex justify-between items-center text-sm">
            <div>
              <div className="font-semibold text-ink mb-1">
                Estimated session: {formatMins(duration)}
              </div>
              <div className="text-brand font-medium">
                Recommended: {PACKAGE_LABELS[packageRec]}
              </div>
            </div>
          </div>
        </div>

        {/* Price Estimate Card */}
        <div className="bg-[#8B2C2C] rounded-2xl p-6 md:p-8 text-white shadow-xl shadow-[#8B2C2C]/20 relative overflow-hidden">
          {/* Subtle bg pattern/gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-50 pointer-events-none"></div>
          
          <h3 className="font-display italic text-2xl text-white mb-6 relative z-10">
            Price Estimate
          </h3>

          <div className="space-y-4 font-body text-sm text-white/90 relative z-10">
            {estimate.breakdown.map((item, i) => (
              <div key={i} className="flex justify-between items-center">
                <span className="font-light tracking-wide">{item.label}</span>
                <span className="font-medium">
                  ₹{item.amount.toLocaleString("en-IN")}
                </span>
              </div>
            ))}

            <div className="flex justify-between items-center pt-5 mt-2 border-t border-white/20 font-semibold text-lg text-white">
              <span className="tracking-wide">Estimated Total</span>
              <span>
                ₹{estimate.estimatedMin.toLocaleString("en-IN")} – ₹
                {estimate.estimatedMax.toLocaleString("en-IN")}
              </span>
            </div>

            <ul className="text-[11px] mt-6 space-y-2 opacity-70 list-none font-light tracking-wide">
              <li>* Final price confirmed by artist after reviewing your booking.</li>
              <li>* Prices may vary based on actual design complexity.</li>
            </ul>
          </div>
        </div>

        {/* What happens next section */}
        <div className="bg-[#FCF9F8] border border-[#8B2C2C]/20 rounded-2xl p-6 md:p-8 mt-6">
          <h4 className="font-display text-[22px] text-ink mb-6">What happens next?</h4>
          
          <div className="ml-2 mt-2">
            <div className="relative pl-6 pb-6">
              <div className="absolute left-[3.5px] top-[14px] bottom-0 w-[1px] bg-[#8B2C2C]/30"></div>
              <div className="absolute left-[0px] top-[6.5px] w-[8px] h-[8px] rounded-full bg-[#8B2C2C] ring-[4px] ring-[#FCF9F8] z-10"></div>
              <p className="font-body text-[14.5px] leading-relaxed">
                <span className="text-ink font-medium">We review your request:</span> <span className="text-ink/60">We check our schedule and travel logistics.</span>
              </p>
            </div>
            
            <div className="relative pl-6 pb-6">
              <div className="absolute left-[3.5px] top-[14px] bottom-0 w-[1px] bg-[#8B2C2C]/30"></div>
              <div className="absolute left-[0px] top-[6.5px] w-[8px] h-[8px] rounded-full bg-[#8B2C2C] ring-[4px] ring-[#FCF9F8] z-10"></div>
              <p className="font-body text-[14.5px] leading-relaxed">
                <span className="text-ink font-medium">We call you (within 24h):</span> <span className="text-ink/60">To discuss design preferences, pricing, and confirm location.</span>
              </p>
            </div>
            
            <div className="relative pl-6">
              <div className="absolute left-[0px] top-[6.5px] w-[8px] h-[8px] rounded-full bg-[#8B2C2C] ring-[4px] ring-[#FCF9F8] z-10"></div>
              <p className="font-body text-[14.5px] leading-relaxed">
                <span className="text-ink font-medium">Advance Payment:</span> <span className="text-ink/60">Once discussed, we'll send a payment link to secure the booking.</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-warn/10 border border-warn text-warn rounded-lg font-body text-sm mb-8">
          {error}
        </div>
      )}

      <div className="flex justify-between items-center pt-5 border-t border-border/40">
        <button
          onClick={onPrev}
          disabled={submitting}
          className="text-ink-muted hover:text-ink font-body text-xs uppercase tracking-widest transition-colors disabled:opacity-50"
        >
          ← Back
        </button>
        <button
          disabled={submitting}
          onClick={handleSubmit}
          className="px-8 py-4 bg-ink text-white font-body font-bold text-xs uppercase tracking-[0.2em] rounded-full flex items-center justify-center min-w-[240px] hover:bg-brand transition-all shadow-xl hover:shadow-brand/20 hover:-translate-y-0.5 disabled:opacity-50 disabled:transform-none disabled:shadow-none"
        >
          {submitting ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            "Send Booking Request →"
          )}
        </button>
      </div>
    </div>
  );
}
