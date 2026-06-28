import React, { useState } from "react";

interface Step2BridalScopeProps {
  bridalScope: string[];
  familyHeadcount: number;
  familyDesignStyle: string;
  onUpdate: (updates: {
    bridal_scope?: string[];
    family_headcount?: number;
    family_design_style?: string;
  }) => void;
  onNext: () => void;
  onPrev: () => void;
}

const SCOPE_OPTIONS = [
  {
    id: "hands_wrist",
    label: "Hands till wrist only",
    time: "~1 hour",
    price: "From ₹1,200",
  },
  {
    id: "hands_elbow",
    label: "Full hands (till elbow)",
    time: "~1.5 hours",
    price: "From ₹2,000",
  },
  {
    id: "hands_feet",
    label: "Hands + Feet",
    time: "~2.5 hours",
    price: "From ₹4,000",
  },
  {
    id: "full_bridal",
    label: "Full Bridal (hands, feet, back design)",
    time: "~3–4 hours",
    price: "From ₹6,500",
  },
];

const FAMILY_STYLE_OPTIONS = [
  { id: "simple", label: "Simple / Traditional" },
  { id: "arabic", label: "Arabic / Indo-Arabic" },
  { id: "traditional", label: "Full Traditional" },
];

export function Step2BridalScope({
  bridalScope = [],
  familyHeadcount,
  familyDesignStyle,
  onUpdate,
  onNext,
  onPrev,
}: Step2BridalScopeProps) {
  const [hasFamily, setHasFamily] = useState(familyHeadcount > 0);

  const toggleBridalScope = (id: string) => {
    if (bridalScope.includes(id)) {
      onUpdate({ bridal_scope: bridalScope.filter(s => s !== id) });
    } else {
      onUpdate({ bridal_scope: [...bridalScope, id] });
    }
  };

  return (
    <div className="max-w-2xl w-full mx-auto animation-fade-in pb-24">
      <div className="mb-14 text-center">
        <h2 className="font-display italic text-3xl lg:text-5xl text-ink font-light tracking-tight">
          What mehendi coverage do you want, dulhan?
        </h2>
        <p className="font-body text-ink-muted text-sm mt-4">You can select multiple options</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-16">
        {SCOPE_OPTIONS.map((opt) => {
          const isSelected = bridalScope.includes(opt.id);
          return (
            <button
              key={opt.id}
              onClick={() => toggleBridalScope(opt.id)}
              className={`group flex flex-col items-start p-6 rounded-2xl border transition-all duration-300 text-left ${
                isSelected
                  ? "border-[#8B2C2C] bg-[#8B2C2C] shadow-[0_4px_20px_rgba(139,44,44,0.25)] ring-1 ring-[#8B2C2C] transform scale-[1.02]"
                  : "border-border/60 bg-surface hover:border-[#8B2C2C]/30 hover:bg-[#8B2C2C]/[0.02] hover:shadow-sm"
              }`}
            >
              <div>
                <div
                  className={`font-body font-medium text-sm transition-colors duration-300 ${
                    isSelected ? "text-white" : "text-ink group-hover:text-[#8B2C2C]"
                  }`}
                >
                  {opt.label}
                </div>
                <div className={`text-xs mt-1 transition-colors duration-300 ${isSelected ? "text-white/80" : "text-ink-muted"}`}>{opt.time}</div>
              </div>
              <div
                className={`text-xs font-medium mt-3 transition-colors duration-300 ${
                  isSelected ? "text-white" : "text-brand"
                }`}
              >
                {opt.price}
              </div>
            </button>
          );
        })}
      </div>

      <div className="pt-8 border-t border-border/40 mb-10">
        <h3 className="font-display italic text-2xl text-ink font-normal tracking-tight mb-4">
          Will any family members also be getting mehendi at the same session?
        </h3>

        <div className="flex gap-4 mb-6">
          <button
            onClick={() => {
              setHasFamily(true);
              if (familyHeadcount === 0)
                onUpdate({
                  family_headcount: 1,
                  family_design_style: "arabic",
                });
            }}
            className={`flex-1 py-3 border rounded-xl font-body text-sm font-medium transition-all duration-300 ${hasFamily
                ? "border-[#8B2C2C] bg-[#8B2C2C] text-white shadow-[0_4px_20px_rgba(139,44,44,0.25)] ring-1 ring-[#8B2C2C] transform scale-[1.02]"
                : "border-border/60 bg-surface text-ink-muted hover:border-[#8B2C2C]/30 hover:bg-[#8B2C2C]/[0.02] hover:shadow-sm hover:text-ink"
              }`}
          >
            Yes
          </button>
          <button
            onClick={() => {
              setHasFamily(false);
              onUpdate({ family_headcount: 0 });
            }}
            className={`flex-1 py-3 border rounded-xl font-body text-sm font-medium transition-all duration-300 ${!hasFamily
                ? "border-[#8B2C2C] bg-[#8B2C2C] text-white shadow-[0_4px_20px_rgba(139,44,44,0.25)] ring-1 ring-[#8B2C2C] transform scale-[1.02]"
                : "border-border/60 bg-surface text-ink-muted hover:border-[#8B2C2C]/30 hover:bg-[#8B2C2C]/[0.02] hover:shadow-sm hover:text-ink"
              }`}
          >
            No
          </button>
        </div>

        {hasFamily && (
          <div className="animation-fade-in space-y-6 bg-surface/50 p-6 rounded-2xl border border-border/30">
            <div>
               <label className="block text-sm font-medium text-ink mb-2">
                How many family members?
              </label>
              <input
                type="number"
                min="1"
                max="30"
                value={familyHeadcount || ""}
                onChange={(e) =>
                  onUpdate({ family_headcount: parseInt(e.target.value) || 0 })
                }
                className="w-full bg-white border border-border/60 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#982820] focus:ring-1 focus:ring-[#982820]/20"
                placeholder="Enter number"
              />
            </div>

            {familyHeadcount > 0 && (
               <div className="animation-fade-in">
                <label className="block text-sm font-medium text-ink mb-2">
                  What style for your family members?
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {FAMILY_STYLE_OPTIONS.map((style) => (
                    <button
                      key={style.id}
                      onClick={() =>
                        onUpdate({ family_design_style: style.id })
                      }
                      className={`py-3 px-3 text-center border rounded-lg text-xs font-medium transition-all duration-300 ${familyDesignStyle === style.id
                          ? "border-[#8B2C2C] bg-[#8B2C2C] text-white shadow-[0_4px_20px_rgba(139,44,44,0.25)] ring-1 ring-[#8B2C2C] transform scale-[1.02]"
                          : "border-border/60 bg-surface text-ink hover:border-[#8B2C2C]/30 hover:bg-[#8B2C2C]/[0.02] hover:shadow-sm hover:text-ink"
                        }`}
                    >
                      {style.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flex justify-between items-center pt-5 border-t border-border/40">
        <button
          onClick={onPrev}
          className="text-ink-muted hover:text-ink font-body text-xs uppercase tracking-widest transition-colors"
        >
          ← Back
        </button>
        <button
          disabled={
            !bridalScope || bridalScope.length === 0 ||
            (hasFamily && (!familyHeadcount || !familyDesignStyle))
          }
          onClick={onNext}
          className="px-8 py-3.5 bg-ink text-white font-body font-semibold text-[10px] uppercase tracking-[0.2em] rounded-full hover:bg-brand transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
