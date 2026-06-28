import React, { useEffect, useState, useMemo } from "react";
import { format, startOfToday, parseISO, addDays, getHours, differenceInCalendarDays } from "date-fns";
import {
  Loader2,
  Calendar as CalendarIcon,
  Clock,
  CheckCircle2,
} from "lucide-react";
import { cn } from "../../lib/utils";
import { AppCalendar } from "../ui/AppCalendar";

interface Step8DateTimeProps {
  date: string | null;
  time: string | null;
  estimatedDurationMins: number;
  onUpdate: (updates: { date?: string | null; time?: string | null; booking_urgency?: string }) => void;
  onNext: () => void;
  onPrev: () => void;
}

export function Step8DateTime({
  date,
  time,
  estimatedDurationMins,
  onUpdate,
  onNext,
  onPrev,
}: Step8DateTimeProps) {
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [availabilityMap, setAvailabilityMap] = useState<
    Record<string, string>
  >({});
  const [loadingDates, setLoadingDates] = useState(false);
  const [slotsData, setSlotsData] = useState<{
    morning: string[];
    afternoon: string[];
    evening: string[];
  } | null>(null);
  const [loadingSlots, setLoadingSlots] = useState(false);

  const isMultiday = estimatedDurationMins > 720; // > 12 hours

  // Minimum 24 hours lead time required to confirm bookings
  const today = startOfToday();
  const minDate = addDays(today, 1);

  // Auto-calculate booking urgency from the selected date
  const getUrgencyFromDate = (dateStr: string): string => {
    const selectedDate = parseISO(dateStr);
    const daysAway = differenceInCalendarDays(selectedDate, today);
    if (daysAway <= 1) return 'today_tomorrow';
    if (daysAway <= 3) return '1_3_days';
    if (daysAway <= 7) return '3_7_days';
    return '7_days_plus';
  };

  useEffect(() => {
    let cancelled = false;
    const fetchDates = async () => {
      setLoadingDates(true);
      try {
        const res = await fetch(
          `/api/available-dates?month=${currentMonth.getMonth() + 1}&year=${currentMonth.getFullYear()}&duration_min=${estimatedDurationMins}`,
        );
        if (res.ok && !cancelled) {
          const data = await res.json();
          setAvailabilityMap(data.dates || {});
        }
      } catch (err) {
        console.error("Failed to fetch dates:", err);
      } finally {
        if (!cancelled) setLoadingDates(false);
      }
    };
    fetchDates();
    return () => {
      cancelled = true;
    };
  }, [currentMonth, estimatedDurationMins]);

  useEffect(() => {
    if (!date) {
      setSlotsData(null);
      return;
    }

    let cancelled = false;
    setLoadingSlots(true);
    fetch(`/api/slots?date=${date}&duration_min=${estimatedDurationMins}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!cancelled && data && data.slots) setSlotsData(data.slots);
        else if (!cancelled) setSlotsData(null);
      })
      .catch(() => {
        if (!cancelled) setSlotsData(null);
      })
      .finally(() => {
        if (!cancelled) setLoadingSlots(false);
      });

    return () => {
      cancelled = true;
    };
  }, [date, estimatedDurationMins]);

  const modifiers = useMemo(() => {
    const available: Date[] = [];
    const limited: Date[] = [];
    const full: Date[] = [];
    const blocked: Date[] = [];
    Object.entries(availabilityMap).forEach(([dateStr, status]) => {
      const d = parseISO(dateStr);
      if (status === "available") available.push(d);
      else if (status === "limited") limited.push(d);
      else if (status === "full") full.push(d);
      else if (status === "blocked") blocked.push(d);
    });
    return { available, limited, full, blocked };
  }, [availabilityMap]);

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (!selectedDate) {
      onUpdate({ date: null, time: null, booking_urgency: '' });
      return;
    }
    const dateStr = format(selectedDate, "yyyy-MM-dd");
    if (
      availabilityMap[dateStr] === "blocked" ||
      availabilityMap[dateStr] === "full"
    )
      return;
    // Auto-set urgency based on how far the date is
    const urgency = getUrgencyFromDate(dateStr);
    onUpdate({ date: dateStr, time: null, booking_urgency: urgency });
  };

  // Parse time string like "10:00 AM" to total minutes from midnight
  const parseTimeToMins = (t: string): number => {
    const isPM = t.includes("PM");
    const parts = t.replace(" AM", "").replace(" PM", "").split(":");
    let hours = parseInt(parts[0], 10);
    const mins = parseInt(parts[1], 10);
    if (isPM && hours !== 12) hours += 12;
    if (!isPM && hours === 12) hours = 0;
    return hours * 60 + mins;
  };

  const CUTOFF_MINS = 19 * 60 + 30; // 7:30 PM

  // Filter slots that would overflow past working hours
  const filterOverflowSlots = (slots: string[]): string[] => {
    if (isMultiday) return slots; // multiday sessions handled differently
    return slots.filter((t) => {
      const startMins = parseTimeToMins(t);
      const endMins = startMins + estimatedDurationMins;
      return endMins <= CUTOFF_MINS;
    });
  };

  const handleTimeSelect = (t: string) => {
    onUpdate({ time: t });
  };

  const isFestival = (dStr: string) => {
    // Just a placeholder for festival check. The API can also return a festival flag.
    return false;
  };

  return (
    <div className="max-w-4xl w-full mx-auto animation-fade-in pb-12">
      <div className="mb-10 text-center">
        <h2 className="font-display italic text-3xl lg:text-4xl text-ink font-normal tracking-tight">
          When do you need the artist?
        </h2>
      </div>

      {isMultiday && (
        <div className="mb-8 p-4 bg-brand/10 border border-brand/20 rounded-lg text-brand text-sm font-body animation-fade-in">
          Your booking spans multiple days (estimated over 12 hours). Please
          select your start date. The artist will coordinate remaining days
          directly.
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
        {/* Calendar Side */}
        <div className="flex-1">
          <div className="bg-surface/50 rounded-2xl p-6 border border-border/40 relative">
            {loadingDates && (
              <div className="absolute inset-0 bg-surface/80 backdrop-blur-sm flex items-center justify-center z-10 rounded-2xl">
                <Loader2 className="w-8 h-8 text-[#982820] animate-spin" />
              </div>
            )}

            <AppCalendar
              mode="single"
              selected={date ? parseISO(date) : undefined}
              onSelect={handleDateSelect}
              month={currentMonth}
              onMonthChange={setCurrentMonth}
              disabled={[
                { before: minDate },
                ...modifiers.blocked,
                ...modifiers.full,
              ]}
              modifiers={{
                limited: modifiers.limited,
                full: modifiers.full,
                blocked: modifiers.blocked,
              }}
              modifiersClassNames={{
                limited: "day-limited",
                full: "day-full",
                blocked: "day-blocked",
              }}
            />

            <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-xs font-body text-ink-muted">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-ink/10" />
                <span>Available</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-warn" />
                <span>Limited</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-ink-muted/30" />
                <span>Fully Booked</span>
              </div>
            </div>
          </div>
        </div>

        {/* Time Slots Side */}
        <div className="lg:w-[320px] xl:w-[360px] shrink-0">
          <div className="bg-surface/50 rounded-2xl p-6 border border-border/40 min-h-[400px]">
            <h3 className="font-display italic text-2xl text-ink mb-6 pb-4 border-b border-border/40">
              Select Time
            </h3>

            {!date ? (
              <div className="h-[200px] flex items-center justify-center text-center text-ink-muted font-body text-sm px-4">
                Please select a date on the calendar first.
              </div>
            ) : loadingSlots ? (
              <div className="h-[200px] flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-[#982820] animate-spin" />
              </div>
            ) : slotsData &&
              (filterOverflowSlots(slotsData.morning).length > 0 ||
                filterOverflowSlots(slotsData.afternoon).length > 0 ||
                filterOverflowSlots(slotsData.evening).length > 0) ? (
              <div className="space-y-6 overflow-y-auto max-h-[500px] pr-2 custom-scrollbar">
                {["Morning", "Afternoon", "Evening"].map((period) => {
                  const rawSlots =
                    slotsData[period.toLowerCase() as keyof typeof slotsData];
                  const slots = rawSlots ? filterOverflowSlots(rawSlots) : [];
                  if (!slots || slots.length === 0) return null;

                  return (
                    <div key={period} className="animation-fade-in">
                      <div className="text-xs font-bold uppercase tracking-widest text-ink-muted mb-3 flex items-center gap-2">
                        {period}
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {slots.map((t) => (
                          <button
                            key={t}
                            onClick={() => handleTimeSelect(t)}
                            className={cn(
                              "py-3 px-2 text-sm font-body font-medium rounded-xl transition-all duration-300 border text-center relative",
                              time === t
                                ? "border-[#8B2C2C] bg-[#8B2C2C] text-white shadow-[0_4px_20px_rgba(139,44,44,0.25)] ring-1 ring-[#8B2C2C] transform scale-[1.02]"
                                : "border-border/60 bg-white text-ink hover:border-[#8B2C2C]/30 hover:bg-[#8B2C2C]/[0.02] hover:shadow-sm hover:text-ink",
                            )}
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="h-[200px] flex items-center justify-center text-center text-ink-muted font-body text-sm px-4">
                No slots available on this date.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Urgency surcharge notice */}
      {date && (() => {
        const urgency = getUrgencyFromDate(date);
        if (urgency === 'today_tomorrow') {
          return (
            <div className="mt-6 p-4 bg-[#982820]/10 border border-[#982820]/20 rounded-xl text-[#982820] text-sm font-body animation-fade-in">
              <strong>Last-minute booking:</strong> A 25% surcharge applies for same-day or next-day bookings. This helps us rearrange our schedule to accommodate you.
            </div>
          );
        }
        if (urgency === '1_3_days') {
          return (
            <div className="mt-6 p-4 bg-[#982820]/10 border border-[#982820]/20 rounded-xl text-[#982820] text-sm font-body animation-fade-in">
              <strong>Short-notice booking:</strong> A 10% surcharge applies for bookings within 1–3 days.
            </div>
          );
        }
        return null;
      })()}

      <div className="flex justify-between items-center pt-8 mt-12 border-t border-border/40">
        <button
          onClick={onPrev}
          className="text-ink-muted hover:text-ink font-body text-xs uppercase tracking-widest transition-colors"
        >
          ← Back
        </button>
        <button
          disabled={!date || !time}
          onClick={onNext}
          className="px-8 py-3.5 bg-ink text-white font-body font-semibold text-[10px] uppercase tracking-[0.2em] rounded-full hover:bg-brand transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
