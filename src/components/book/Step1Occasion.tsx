import React, { useState, useEffect } from "react";
import { cn } from "../../lib/utils";

interface Step1OccasionProps {
  selected: string;
  onSelect: (val: string) => void;
  onNext: () => void;
}

interface Occasion {
  id: string; // The slug
  label: string; // The name
  desc: string; // The description
}

// Fallback occasions just in case the API fails
const FALLBACK_OCCASIONS: Occasion[] = [
  { id: "bridal", label: "Bridal", desc: "Exclusive bridal mehendi design" },
  { id: "destination_wedding", label: "Destination Wedding", desc: "Mehendi artist travel to venue" },
  { id: "wedding_function", label: "Wedding Mehendi Function", desc: "Mehendi for family and guests" },
  { id: "pre_wedding", label: "Pre-Wedding", desc: "Engagement, haldi, and sangeet ceremonies" },
  { id: "festival", label: "Festival", desc: "Traditional festival celebrations" },
  { id: "birthday_party", label: "Birthdays and Gatherings", desc: "Birthday, kitty party, and baby shower gatherings" },
  { id: "corporate_event", label: "Corporate Event", desc: "Brand activations and office events" },
  { id: "casual", label: "Casual and Personal", desc: "Personal mehendi sessions" },
];

export function Step1Occasion({
  selected,
  onSelect,
  onNext,
}: Step1OccasionProps) {
  const [occasions, setOccasions] = useState<Occasion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOccasions() {
      try {
        const res = await fetch('/api/services');
        const data = await res.json();
        if (data.services && data.services.length > 0) {
          // Map DB structure to frontend structure
          const formatted = data.services.map((s: any) => ({
            id: s.slug,
            label: s.name,
            desc: s.description || ''
          }));
          setOccasions(formatted);
        } else {
          setOccasions(FALLBACK_OCCASIONS);
        }
      } catch (err) {
        console.error('Failed to fetch occasions from DB, using fallback.', err);
        setOccasions(FALLBACK_OCCASIONS);
      } finally {
        setLoading(false);
      }
    }
    
    fetchOccasions();
  }, []);

  return (
    <div className="max-w-2xl w-full mx-auto animation-fade-in pb-12">
      <div className="mb-14 text-center">
        <h2 className="font-display italic text-3xl lg:text-5xl text-ink font-light tracking-tight">
          What is the occasion?
        </h2>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="w-6 h-6 border-2 border-[#8B2C2C] border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
          {occasions.map((occ) => {
            const isSelected = selected === occ.id;
            return (
              <button
                key={occ.id}
                onClick={() => onSelect(occ.id)}
                className={cn(
                  "group flex flex-col items-start p-6 rounded-2xl border transition-all duration-300 text-left",
                  isSelected
                    ? "border-[#8B2C2C] bg-[#8B2C2C] text-white shadow-[0_4px_20px_rgba(139,44,44,0.25)] ring-1 ring-[#8B2C2C] transform scale-[1.02]"
                    : "border-border/60 bg-surface hover:border-[#8B2C2C]/30 hover:bg-[#8B2C2C]/[0.02] hover:shadow-sm",
                )}
              >
                <span
                  className={cn(
                    "font-display text-xl transition-colors duration-300",
                    isSelected
                      ? "text-white"
                      : "text-ink group-hover:text-[#8B2C2C]",
                  )}
                >
                  {occ.label}
                </span>
                <span
                  className={cn(
                    "text-[13px] font-body mt-2 leading-relaxed transition-colors duration-300",
                    isSelected ? "text-white/80" : "text-ink-muted",
                  )}
                >
                  {occ.desc}
                </span>
              </button>
            );
          })}
        </div>
      )}

      <div className="mt-14 flex justify-center">
        <button
          disabled={!selected || loading}
          onClick={onNext}
          className="group relative overflow-hidden px-12 py-4 bg-ink text-white font-body font-semibold text-[10px] uppercase tracking-[0.2em] rounded-full transition-all duration-500 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-brand"
        >
          <span className="relative z-10">Continue</span>
        </button>
      </div>
    </div>
  );
}
