import React from "react";
import { cn } from "../../lib/utils";
import { Check, Lock, Clock } from "lucide-react";
import type { BookingState } from "./types";
import {
  estimateDuration,
  calculateEstimate,
  recommendPackage,
  PACKAGE_LABELS,
} from "../../lib/booking.config";

interface BookingSidebarProps {
  state: BookingState;
  onNavigate: (step: number) => void;
}

const ALL_STEPS = [
  { num: 1, label: "Occasion" },
  {
    num: 2,
    label: "Bridal Scope",
    condition: (state: BookingState) => state.occasion === "bridal",
  },
  {
    num: 3,
    label: "Headcount",
    condition: (state: BookingState) => state.occasion !== "bridal",
  },
  { num: 4, label: "Design Style" },
  { num: 5, label: "Body Coverage" },
  { num: 6, label: "Add-ons" },
  { num: 7, label: "Location" },
  { num: 8, label: "Date & Time" },
  { num: 9, label: "Contact Details" },
  { num: 10, label: "Review & Confirm" },
];

export function BookingSidebar({ state, onNavigate }: BookingSidebarProps) {
  const { step } = state;

  // Filter steps based on condition
  const activeSteps = ALL_STEPS.filter(
    (s) => !s.condition || s.condition(state),
  );

  const duration = estimateDuration(state);
  const estimate = calculateEstimate(state);
  const packageRec = duration > 0 ? recommendPackage(duration) : null;

  return (
    <div className="flex flex-col h-full py-12 px-8 lg:px-10 min-h-screen font-body relative">
      <div className="mb-12">
        <a
          href="/"
          className="font-script text-4xl text-ink hover:opacity-80 transition-opacity"
        >
          Aakriti
        </a>
        <p className="text-[10px] text-ink-muted mt-3 uppercase tracking-[0.3em] font-medium">
          Booking Request
        </p>
      </div>

      <div className="flex-1 flex flex-col">
        {/* Step Indicator with Connecting Line */}
        <div className="relative mb-12">
          {/* Vertical connecting line background */}
          <div className="absolute left-[7px] top-2 bottom-2 w-[1px] bg-border/40 -z-10" />

          <div className="space-y-6">
            {activeSteps.map((s, idx) => {
              const isCompleted = step > s.num;
              const isCurrent = step === s.num;
              const isClickable = isCompleted || (isCurrent && step > 1);
              const isFuture = step < s.num;

              return (
                <div
                  key={s.num}
                  className={cn(
                    "flex items-center gap-4 transition-colors relative",
                    isClickable ? "cursor-pointer hover:opacity-80 group" : "",
                    isCurrent
                      ? "text-ink"
                      : isCompleted
                        ? "text-ink"
                        : "text-ink-muted/50",
                  )}
                  onClick={() => isClickable && onNavigate(s.num)}
                >
                  <div
                    className={cn(
                      "w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-medium transition-all shrink-0",
                      isCompleted
                        ? "bg-[#982820] text-white"
                        : isCurrent
                          ? "bg-[#982820] text-white ring-4 ring-[#982820]/20 scale-110"
                          : "bg-surface border border-border text-ink-muted",
                    )}
                  >
                    {isCompleted ? (
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    ) : (
                      idx + 1
                    )}
                  </div>
                  <span
                    className={cn(
                      "text-[13px] tracking-wide transition-all",
                      isCurrent
                        ? "font-semibold"
                        : isFuture
                          ? "font-normal"
                          : "font-medium",
                      isClickable ? "group-hover:text-brand" : "",
                    )}
                  >
                    {s.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex-1"></div>



        {/* Trust Block */}
        <div className="space-y-3 pt-6 border-t border-border/60 text-ink-muted/70 text-[11px] uppercase tracking-wider">
          <div className="flex items-center gap-3">
            <Lock className="w-3 h-3 text-ink" />
            <span>Secure Request</span>
          </div>
          <div className="flex items-center gap-3">
            <Clock className="w-3 h-3 text-ink" />
            <span>24h Confirmation</span>
          </div>
        </div>
      </div>
    </div>
  );
}
