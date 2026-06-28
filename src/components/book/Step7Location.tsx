import React from "react";

interface Step7LocationProps {
  locationType: string;
  venueAddress: string;
  city: string;
  pincode: string;
  onUpdate: (updates: {
    location_type?: string;
    venue_address?: string;
    city?: string;
    pincode?: string;
  }) => void;
  onNext: () => void;
  onPrev: () => void;
}

const LOCATION_OPTIONS = [
  {
    id: "home_venue",
    label: "At my home or event venue",
    desc: "Artist travels to you",
  },
  {
    id: "studio",
    label: "At Aakriti's studio",
    desc: "You come to the artist",
  },
];

export function Step7Location({
  locationType,
  venueAddress,
  city,
  pincode,
  onUpdate,
  onNext,
  onPrev,
}: Step7LocationProps) {
  const isHome = locationType === "home_venue";

  const canContinue =
    locationType === "studio" ||
    (isHome &&
      venueAddress.trim() !== "" &&
      city.trim() !== "" &&
      pincode.trim().length >= 6);

  return (
    <div className="max-w-2xl w-full mx-auto animation-fade-in pb-12">
      <div className="mb-10 text-center">
        <h2 className="font-display italic text-3xl lg:text-4xl text-ink font-normal tracking-tight">
          Where should the artist come?
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        {LOCATION_OPTIONS.map((opt) => {
          const isSelected = locationType === opt.id;
          return (
            <button
              key={opt.id}
              onClick={() => onUpdate({ location_type: opt.id })}
              className={`group p-5 text-left border rounded-xl flex flex-col justify-center transition-all duration-300 ${
                isSelected
                  ? "border-[#8B2C2C] bg-[#8B2C2C] text-white shadow-[0_4px_20px_rgba(139,44,44,0.25)] ring-1 ring-[#8B2C2C] transform scale-[1.02]"
                  : "border-border/60 bg-surface hover:border-[#8B2C2C]/30 hover:bg-[#8B2C2C]/[0.02] hover:shadow-sm"
              }`}
            >
              <div
                className={`font-body font-medium text-base mb-1 transition-colors duration-300 ${isSelected ? "text-white" : "text-ink group-hover:text-[#8B2C2C]"}`}
              >
                {opt.label}
              </div>
              <div className={`text-xs transition-colors duration-300 ${isSelected ? "text-white/80" : "text-ink-muted"}`}>{opt.desc}</div>
            </button>
          );
        })}
      </div>

      {isHome && (
        <div className="animation-fade-in space-y-5 bg-surface/50 p-6 rounded-2xl border border-border/30 mb-8">
          <div>
            <label className="block text-sm font-medium text-ink mb-2">
              Full Address
            </label>
            <textarea
              rows={3}
              value={venueAddress || ""}
              onChange={(e) => onUpdate({ venue_address: e.target.value })}
              className="w-full bg-white border border-border/60 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#982820] focus:ring-1 focus:ring-[#982820]/20 resize-none"
              placeholder="Enter building, street, area..."
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-ink mb-2">
                City
              </label>
              <input
                type="text"
                value={city || ""}
                onChange={(e) => onUpdate({ city: e.target.value })}
                className="w-full bg-white border border-border/60 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#982820] focus:ring-1 focus:ring-[#982820]/20"
                placeholder="e.g. Pune"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-ink mb-2">
                Pincode
              </label>
              <input
                type="text"
                value={pincode || ""}
                onChange={(e) => onUpdate({ pincode: e.target.value })}
                className="w-full bg-white border border-border/60 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#982820] focus:ring-1 focus:ring-[#982820]/20"
                placeholder="e.g. 411001"
                maxLength={6}
              />
            </div>
          </div>
          <div className="mt-8 flex justify-center text-xs text-ink-muted bg-surface py-3 px-4 rounded-xl border border-border/40 w-fit mx-auto shadow-sm">
            We'll calculate travel charges based on distance from the studio.
          </div>
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
          disabled={!canContinue}
          onClick={onNext}
          className="px-8 py-3.5 bg-ink text-white font-body font-semibold text-[10px] uppercase tracking-[0.2em] rounded-full hover:bg-brand transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
