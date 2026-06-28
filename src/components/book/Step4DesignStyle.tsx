import React from "react";
import { HEADCOUNT_MAP } from "../../lib/booking.config";

interface Step4DesignStyleProps {
  designStyle: string;
  headcount: string;
  onUpdate: (val: string) => void;
  onNext: () => void;
  onPrev: () => void;
}

const STYLE_OPTIONS = [
  {
    id: "simple",
    label: "Simple / Traditional",
    desc: "Small motifs, quick designs, classic patterns",
    time: "20–30 min/person",
  },
  {
    id: "arabic",
    label: "Arabic / Indo-Arabic",
    desc: "Flowing floral, open spaces, modern patterns",
    time: "45–60 min/person",
  },
  {
    id: "traditional",
    label: "Full Traditional",
    desc: "Dense, intricate, full-hand coverage",
    time: "75–90 min/person",
  },
  {
    id: "intricate",
    label: "Intricate / Bridal-Level",
    desc: "Extremely detailed, only for 1–3 people max",
    time: "120–150 min/person",
  },
];

export function Step4DesignStyle({
  designStyle,
  headcount,
  onUpdate,
  onNext,
  onPrev,
}: Step4DesignStyleProps) {
  const headcountNumeric = HEADCOUNT_MAP[headcount] || 1;
  const isLargeGroupIntricate =
    designStyle === "intricate" && headcountNumeric > 5;

  return (
    <div className="max-w-2xl w-full mx-auto animation-fade-in">
      <div className="mb-10 text-center">
        <h2 className="font-display italic text-3xl lg:text-4xl text-ink font-normal tracking-tight">
          What style of mehendi are you looking for?
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        {STYLE_OPTIONS.map((opt) => {
          const isSelected = designStyle === opt.id;
          return (
            <button
              key={opt.id}
              onClick={() => onUpdate(opt.id)}
              className={`group p-5 text-left border rounded-xl flex flex-col gap-2 transition-all duration-300 ${
                isSelected
                  ? "border-[#8B2C2C] bg-[#8B2C2C] text-white shadow-[0_4px_20px_rgba(139,44,44,0.25)] ring-1 ring-[#8B2C2C] transform scale-[1.02]"
                  : "border-border/60 bg-surface hover:border-[#8B2C2C]/30 hover:bg-[#8B2C2C]/[0.02] hover:shadow-sm"
              }`}
            >
              <div
                className={`font-body font-medium text-lg transition-colors duration-300 ${isSelected ? "text-white" : "text-ink group-hover:text-[#8B2C2C]"}`}
              >
                {opt.label}
              </div>
              <div className={`text-xs leading-relaxed flex-1 transition-colors duration-300 ${isSelected ? "text-white/80" : "text-ink-muted"}`}>
                {opt.desc}
              </div>
              <div
                className={`text-[11px] mt-2 font-medium uppercase tracking-wider transition-colors duration-300 ${isSelected ? "text-white" : "text-brand"}`}
              >
                {opt.time}
              </div>
            </button>
          );
        })}
      </div>

      {isLargeGroupIntricate && (
        <div className="mb-8 p-4 bg-[#982820]/10 border border-[#982820]/20 rounded-lg text-[#982820] text-sm font-body animation-fade-in">
          Intricate designs take 2–2.5 hrs per person. For a group this size,
          consider Traditional or Arabic to keep the session manageable. You can
          still choose Intricate if you'd like.
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
          disabled={!designStyle}
          onClick={onNext}
          className="px-8 py-3.5 bg-ink text-white font-body font-semibold text-[10px] uppercase tracking-[0.2em] rounded-full hover:bg-brand transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
