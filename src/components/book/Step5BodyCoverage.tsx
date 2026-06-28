import React, { useEffect } from "react";

interface Step5BodyCoverageProps {
  occasion: string;
  bodyCoverage: string[];
  onUpdate: (val: string[]) => void;
  onNext: () => void;
  onPrev: () => void;
}

const COVERAGE_OPTIONS = [
  { id: "hands_wrist", label: "Hands till wrist", time: "Base time" },
  { id: "hands_elbow", label: "Full hands (till elbow)", time: "+30% time" },
  { id: "feet", label: "Feet", time: "+20% time" },
  { id: "hands_and_feet", label: "Hands + Feet", time: "+45% time" },
  { id: "back_design", label: "Back / shoulder design", time: "+30 min" },
];

export function Step5BodyCoverage({
  occasion,
  bodyCoverage = [],
  onUpdate,
  onNext,
  onPrev,
}: Step5BodyCoverageProps) {
  // Set default based on occasion if empty
  useEffect(() => {
    if (!bodyCoverage || bodyCoverage.length === 0) {
      if (["festival", "casual", "corporate_event"].includes(occasion)) {
        onUpdate(["hands_wrist"]);
      } else if (["birthday_party", "pre_wedding"].includes(occasion)) {
        onUpdate(["hands_elbow"]);
      } else if (occasion === "wedding_function") {
        onUpdate(["hands_and_feet"]);
      }
    }
  }, [occasion, bodyCoverage, onUpdate]);

  // Hand coverage options are mutually exclusive
  const HAND_OPTIONS = new Set(["hands_wrist", "hands_elbow", "hands_and_feet"]);

  const toggleOption = (id: string) => {
    if (bodyCoverage.includes(id)) {
      // Deselect
      onUpdate(bodyCoverage.filter((item) => item !== id));
    } else if (HAND_OPTIONS.has(id)) {
      // Selecting a hand option: replace any existing hand option, keep non-hand ones
      const nonHandSelections = bodyCoverage.filter((item) => !HAND_OPTIONS.has(item));
      onUpdate([...nonHandSelections, id]);
    } else {
      // Selecting a non-hand option (feet, back_design): just add it
      onUpdate([...bodyCoverage, id]);
    }
  };

  return (
    <div className="max-w-2xl w-full mx-auto animation-fade-in pb-12">
      <div className="mb-10 text-center">
        <h2 className="font-display italic text-3xl lg:text-4xl text-ink font-normal tracking-tight">
          Which parts of the body?
        </h2>
        <p className="mt-2 text-ink-muted text-sm font-body">Select all that apply</p>
      </div>

      <div className="grid gap-3 mb-8">
        {COVERAGE_OPTIONS.map((opt) => {
          const isSelected = bodyCoverage.includes(opt.id);
          return (
            <button
              key={opt.id}
              onClick={() => toggleOption(opt.id)}
              className={`group p-4 text-left border rounded-xl flex items-center justify-between transition-all duration-300 ${
                isSelected
                  ? "border-[#8B2C2C] bg-[#8B2C2C] text-white shadow-[0_4px_20px_rgba(139,44,44,0.25)] ring-1 ring-[#8B2C2C] transform scale-[1.02]"
                  : "border-border/60 bg-surface hover:border-[#8B2C2C]/30 hover:bg-[#8B2C2C]/[0.02] hover:shadow-sm"
              }`}
            >
              <div
                className={`font-body font-medium text-sm transition-colors duration-300 ${isSelected ? "text-white" : "text-ink group-hover:text-[#8B2C2C]"}`}
              >
                {opt.label}
              </div>
              <div
                className={`text-xs font-medium transition-colors duration-300 ${isSelected ? "text-white/80" : "text-ink-muted"}`}
              >
                {opt.time}
              </div>
            </button>
          );
        })}
      </div>

      <div className="flex justify-between items-center pt-5 border-t border-border/40">
        <button
          onClick={onPrev}
          className="text-ink-muted hover:text-ink font-body text-xs uppercase tracking-widest transition-colors"
        >
          ← Back
        </button>
        <button
          disabled={bodyCoverage.length === 0}
          onClick={onNext}
          className="px-8 py-3.5 bg-ink text-white font-body font-semibold text-[10px] uppercase tracking-[0.2em] rounded-full hover:bg-brand transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
