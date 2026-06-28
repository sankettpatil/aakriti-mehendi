import React, { useState } from "react";
import { CheckCircle2 } from "lucide-react";
interface Step9ContactProps {
  customerName: string;
  phone: string;
  email: string;
  whatsapp: string;
  notes: string;
  onUpdate: (updates: {
    customer_name?: string;
    phone?: string;
    email?: string;
    whatsapp?: string;
    notes?: string;
  }) => void;
  onNext: () => void;
  onPrev: () => void;
}

export function Step9Contact({
  customerName,
  phone,
  email,
  whatsapp,
  notes,
  onUpdate,
  onNext,
  onPrev,
}: Step9ContactProps) {
  const [consent, setConsent] = useState(false);
  const [sameAsPhone, setSameAsPhone] = useState(false);
  const [phoneError, setPhoneError] = useState("");
  const [emailError, setEmailError] = useState("");

  const validatePhone = (val: string) => {
    if (!val) return true;
    const clean = val.replace(/\D/g, "");
    if (clean.length !== 10) return false;
    if (!/^[6789]/.test(clean)) return false;
    return true;
  };

  const validateEmail = (val: string) => {
    if (!val) return true;
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
  };

  const handlePhoneBlur = () => {
    if (phone && !validatePhone(phone)) {
      setPhoneError("Please enter a valid 10-digit Indian mobile number");
    } else {
      setPhoneError("");
      if (sameAsPhone) {
        onUpdate({ whatsapp: phone });
      }
    }
  };

  const handleEmailBlur = () => {
    if (email && !validateEmail(email)) {
      setEmailError("Please enter a valid email address");
    } else {
      setEmailError("");
    }
  };

  const canContinue =
    customerName.trim() !== "" &&
    email.trim() !== "" &&
    validateEmail(email) &&
    phone.trim() !== "" &&
    validatePhone(phone) &&
    (!whatsapp || validatePhone(whatsapp)) &&
    consent;

  return (
    <div className="max-w-2xl w-full mx-auto animation-fade-in pb-12">
      <div className="mb-10 text-center">
        <h2 className="font-display italic text-3xl lg:text-4xl text-ink font-normal tracking-tight">
          Your Details
        </h2>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-[11px] uppercase tracking-widest text-ink-muted mb-2 font-semibold">
              Full Name *
            </label>
            <input
              type="text"
              required
              value={customerName || ""}
              onChange={(e) => onUpdate({ customer_name: e.target.value })}
              className="w-full bg-surface/50 border border-border/60 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:border-[#982820] focus:ring-1 focus:ring-[#982820]/20 transition-all"
              placeholder="e.g. Priya Sharma"
            />
          </div>
          <div>
            <label className="block text-[11px] uppercase tracking-widest text-ink-muted mb-2 font-semibold">
              Phone Number *
            </label>
            <input
              type="tel"
              required
              value={phone || ""}
              onChange={(e) => onUpdate({ phone: e.target.value })}
              onBlur={handlePhoneBlur}
              className={`w-full bg-surface/50 border rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:ring-1 transition-all ${
                phoneError
                  ? "border-warn focus:border-warn focus:ring-warn/20"
                  : "border-border/60 focus:border-[#982820] focus:ring-[#982820]/20"
              }`}
              placeholder="e.g. 9876543210"
              maxLength={10}
            />
            {phoneError && (
              <p className="text-warn text-xs mt-1.5">{phoneError}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-[11px] uppercase tracking-widest text-ink-muted mb-2 font-semibold">
              Email Address *
            </label>
            <input
              type="email"
              required
              value={email || ""}
              onChange={(e) => onUpdate({ email: e.target.value })}
              onBlur={handleEmailBlur}
              className={`w-full bg-surface/50 border rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:ring-1 transition-all ${
                emailError
                  ? "border-warn focus:border-warn focus:ring-warn/20"
                  : "border-border/60 focus:border-[#982820] focus:ring-[#982820]/20"
              }`}
              placeholder="e.g. priya@example.com"
            />
            {emailError && (
              <p className="text-warn text-xs mt-1.5">{emailError}</p>
            )}
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-[11px] uppercase tracking-widest text-ink-muted font-semibold">
                WhatsApp Number
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={sameAsPhone}
                  onChange={(e) => {
                    setSameAsPhone(e.target.checked);
                    if (e.target.checked) onUpdate({ whatsapp: phone });
                  }}
                  className="w-3 h-3 text-[#982820] rounded border-border/60 focus:ring-[#982820]"
                />
                <span className="text-[10px] text-ink-muted uppercase tracking-wider">Same as phone</span>
              </label>
            </div>
            <input
              type="tel"
              value={whatsapp || ""}
              onChange={(e) => {
                onUpdate({ whatsapp: e.target.value });
                if (sameAsPhone && e.target.value !== phone) setSameAsPhone(false);
              }}
              className="w-full bg-surface/50 border border-border/60 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:border-[#982820] focus:ring-1 focus:ring-[#982820]/20 transition-all"
              placeholder="e.g. 9876543210"
              maxLength={10}
            />
          </div>
        </div>

        <div>
          <label className="block text-[11px] uppercase tracking-widest text-ink-muted mb-2 font-semibold flex justify-between">
            <span>Special Requests / Notes</span>
            <span className="font-normal opacity-70">Optional</span>
          </label>
          <textarea
            rows={4}
            value={notes || ""}
            onChange={(e) => onUpdate({ notes: e.target.value })}
            className="w-full bg-surface/50 border border-border/60 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:border-[#982820] focus:ring-1 focus:ring-[#982820]/20 transition-all resize-none"
            placeholder="Any specific requirements..."
            maxLength={500}
          />
          <div className="text-right text-xs text-ink-muted mt-1">
            {(notes || "").length}/500
          </div>
        </div>

        {/* Placeholder for Reference Images */}
        <div className="p-4 border border-border/40 border-dashed rounded-xl bg-surface/30">
          <label className="block text-[11px] uppercase tracking-widest text-ink-muted mb-2 font-semibold">
            Reference Images (Optional)
          </label>
          <p className="text-xs text-ink-muted mb-3">
            Upload functionality is currently disabled. You can share reference
            images via WhatsApp after booking.
          </p>
          <button
            disabled
            className="px-4 py-2 bg-ink/5 text-ink-muted rounded border border-border/40 text-xs uppercase tracking-wider font-medium cursor-not-allowed"
          >
            Upload Images
          </button>
        </div>

        <div className="pt-4">
          <label className="flex items-start gap-3 cursor-pointer group">
            <div className="relative flex items-center justify-center mt-0.5 shrink-0">
              <input
                type="checkbox"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                className="peer sr-only"
              />
              <div className="w-5 h-5 rounded border border-border/60 bg-white peer-checked:bg-[#982820] peer-checked:border-[#982820] transition-colors" />
              <CheckCircle2 className="w-3.5 h-3.5 text-white absolute opacity-0 peer-checked:opacity-100 transition-opacity" />
            </div>
            <span className="text-xs text-ink-muted leading-relaxed select-none group-hover:text-ink transition-colors">
              I understand this is a booking request. The final price will be
              confirmed by Aakriti after reviewing the details.
            </span>
          </label>
        </div>
      </div>

      <div className="flex justify-between items-center pt-8 mt-10 border-t border-border/40">
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
          Review Booking
        </button>
      </div>
    </div>
  );
}
