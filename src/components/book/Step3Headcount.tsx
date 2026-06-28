import React from "react";

interface Step3HeadcountProps {
  occasion: string;
  headcount: string;
  onUpdate: (val: string) => void;
  onNext: () => void;
  onPrev: () => void;
}

const HEADCOUNT_OPTIONS = [
  { id: "1", label: "Just me" },
  { id: "2_5", label: "2–5 people" },
  { id: "6_15", label: "6–15 people" },
  { id: "16_30", label: "16–30 people" },
  { id: "31_50", label: "31–50 people" },
  { id: "50_plus", label: "50+ people" },
];

export function Step3Headcount({
  occasion,
  headcount,
  onUpdate,
  onNext,
  onPrev,
}: Step3HeadcountProps) {
  const getQuestionText = () => {
    switch (occasion) {
      case "wedding_function":
        return "Roughly how many people will be getting mehendi?";
      case "pre_wedding":
        return "How many people are getting mehendi at this function?";
      case "festival":
        return "How many people (including yourself)?";
      case "birthday_party":
        return "How many guests are getting mehendi?";
      case "corporate_event":
        return "How many people approximately? (rough estimate is fine)";
      case "casual":
        return "Just you, or a few people together?";
      default:
        return "How many people will be getting mehendi?";
    }
  };

  const isLargeCorporate =
    occasion === "corporate_event" &&
    (headcount === "31_50" || headcount === "50_plus");

  return (
    <div className="max-w-2xl w-full mx-auto animation-fade-in">
      <div className="mb-10 text-center">
        <h2 className="font-display italic text-3xl lg:text-4xl text-ink font-normal tracking-tight">
          {getQuestionText()}
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
        {HEADCOUNT_OPTIONS.map((opt) => {
          const isSelected = headcount === opt.id;
          return (
            <button
              key={opt.id}
              onClick={() => onUpdate(opt.id)}
              className={`p-4 text-center border rounded-xl font-body text-sm font-medium transition-all duration-300 ${
                isSelected
                  ? "border-[#8B2C2C] bg-[#8B2C2C] text-white shadow-[0_4px_20px_rgba(139,44,44,0.25)] ring-1 ring-[#8B2C2C] transform scale-[1.02]"
                  : "border-border/60 bg-surface text-ink hover:border-[#8B2C2C]/30 hover:bg-[#8B2C2C]/[0.02] hover:shadow-sm hover:text-ink"
              }`}
            >
              {opt.label}
            </button>
          );
        })}
      </div>

      {isLargeCorporate && (
        <div className="mb-8 p-4 bg-brand/10 border border-brand/20 rounded-lg text-brand text-sm font-body animation-fade-in">
          For large events, Aakriti may bring additional artists. We'll confirm
          details when reviewing your booking.
        </div>
      )}

      <div className="flex justify-between items-center pt-5 border-t border-border/40">
        <button
          onClick={onPrev}
          className="text-ink-muted hover:text-ink font-body text-xs uppercase tracking-widest transition-colors"
        >
          ← Back
        </button>
        <button
          disabled={!headcount}
          onClick={onNext}
          className="px-8 py-3.5 bg-ink text-white font-body font-semibold text-[10px] uppercase tracking-[0.2em] rounded-full hover:bg-brand transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
