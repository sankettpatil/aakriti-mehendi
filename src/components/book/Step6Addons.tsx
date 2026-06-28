import React from "react";

interface Step6AddonsProps {
  addons: string[];
  bookingUrgency: string;
  onUpdate: (updates: { addons?: string[]; booking_urgency?: string }) => void;
  onNext: () => void;
  onPrev: () => void;
}

const ADDON_OPTIONS = [
  {
    id: "glitter",
    label: "Glitter overlay",
    price: "+₹200/person",
    desc: "Applied after mehendi dries",
  },
  {
    id: "colored_mehndi",
    label: "White / Gold / Colored mehendi",
    price: "+₹500/person",
    desc: "For modern looks",
  },
  {
    id: "stone_tikki",
    label: "Stone / Tikki embellishment",
    price: "+₹300/person",
    desc: "Gems on design",
  },
  {
    id: "reference_design",
    label: "Custom reference design",
    price: "Custom quote",
    desc: "Artist will try to replicate your reference image",
  },
];

export function Step6Addons({
  addons = [],
  bookingUrgency,
  onUpdate,
  onNext,
  onPrev,
}: Step6AddonsProps) {
  const toggleAddon = (id: string) => {
    if (addons.includes(id)) {
      onUpdate({ addons: addons.filter((a) => a !== id) });
    } else {
      onUpdate({ addons: [...addons, id] });
    }
  };

  return (
    <div className="max-w-2xl w-full mx-auto animation-fade-in pb-12">
      <div className="mb-10 text-center">
        <h2 className="font-display italic text-3xl lg:text-4xl text-ink font-normal tracking-tight">
          Any extras you'd like to add?
        </h2>
        <p className="mt-3 text-ink-muted text-sm font-body">Optional — you can skip if none apply</p>
      </div>

      <div className="grid gap-3 mb-12">
        {ADDON_OPTIONS.map((opt) => {
          const isSelected = addons.includes(opt.id);
          return (
            <button
              key={opt.id}
              onClick={() => toggleAddon(opt.id)}
              className={`group p-4 text-left border rounded-xl flex items-center justify-between transition-all duration-300 ${
                isSelected
                  ? "border-[#8B2C2C] bg-[#8B2C2C] text-white shadow-[0_4px_20px_rgba(139,44,44,0.25)] ring-1 ring-[#8B2C2C] transform scale-[1.02]"
                  : "border-border/60 bg-surface hover:border-[#8B2C2C]/30 hover:bg-[#8B2C2C]/[0.02] hover:shadow-sm"
              }`}
            >
              <div className="flex items-center gap-4">
                <div
                  className={`w-5 h-5 rounded border flex items-center justify-center shrink-0 transition-colors ${
                    isSelected
                      ? "border-white bg-white text-[#8B2C2C]"
                      : "border-border/60 bg-white"
                  }`}
                >
                  {isSelected && <span className="text-[10px] font-bold">✓</span>}
                </div>
                <div>
                  <div
                    className={`font-body font-medium text-sm transition-colors duration-300 ${isSelected ? "text-white" : "text-ink group-hover:text-[#8B2C2C]"}`}
                  >
                    {opt.label}
                  </div>
                  <div className={`text-xs mt-1 transition-colors duration-300 ${isSelected ? "text-white/80" : "text-ink-muted"}`}>{opt.desc}</div>
                </div>
              </div>
              <div
                className={`text-xs font-medium shrink-0 transition-colors duration-300 ${isSelected ? "text-white" : "text-brand"}`}
              >
                {opt.price}
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
          onClick={onNext}
          className="px-8 py-3.5 bg-ink text-white font-body font-semibold text-[10px] uppercase tracking-[0.2em] rounded-full hover:bg-brand transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
