import React from 'react';
import { DayPicker, type DayPickerProps } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { cn } from '../../lib/utils';

export function AppCalendar(props: DayPickerProps) {
  return (
    <div className="w-full flex flex-col items-center justify-center min-w-[320px] max-w-[600px] mx-auto">
      <style>{`
        /* Modifiers */
        .day-limited:not(.rdp-selected)::after {
          content: ''; position: absolute; bottom: 4px; left: 50%; transform: translateX(-50%);
          width: 4px; height: 4px; border-radius: 50%; background-color: var(--color-warn);
        }
        .day-full:not(.rdp-selected) { color: var(--color-ink-muted); opacity: 0.5; }
        .day-blocked:not(.rdp-selected) { color: var(--color-ink-muted); opacity: 0.3; text-decoration: line-through; }
        
        /* Premium Circular Interaction */
        @keyframes selectSpring {
          0% { transform: scale(0.8); opacity: 0; }
          60% { transform: scale(1.03); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
        
        @keyframes ringFadeIn {
          0% { opacity: 0; transform: scale(0.8); }
          100% { opacity: 0.25; transform: scale(1); }
        }

        .rdp-day {
          position: relative;
        }

        .rdp-day_button {
          position: relative;
          width: 44px !important;
          height: 44px !important;
          border-radius: 50% !important;
          background-color: transparent;
          transition: all 180ms ease-out;
          z-index: 2;
          margin: 0 auto;
        }

        .rdp-day_button:hover:not(:disabled):not(.rdp-selected) {
          background-color: rgba(152, 40, 32, 0.07) !important;
          transform: scale(1.08) !important;
          cursor: pointer;
        }

        .rdp-selected .rdp-day_button, 
        button.rdp-selected,
        .rdp-day_button[aria-selected="true"] {
          background-color: #8B2C2C !important;
          color: white !important;
          font-weight: 500 !important;
          box-shadow: 0 6px 18px rgba(139, 44, 44, 0.25) !important;
          animation: selectSpring 250ms cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards !important;
        }

        /* Luxury outer ring */
        .rdp-selected::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 52px;
          height: 52px;
          margin-top: -26px;
          margin-left: -26px;
          border-radius: 50%;
          border: 1px solid #8B2C2C;
          opacity: 0;
          pointer-events: none;
          z-index: 1;
          animation: ringFadeIn 300ms ease-out 150ms forwards;
        }
        
        td.rdp-selected,
        div.rdp-selected {
          background-color: transparent !important;
        }

        /* ✅ Let the table do its job — just force equal column widths */
        .rdp-month_grid {
          width: 100%;
          table-layout: fixed;
        }
      `}</style>
      
      <DayPicker
        {...props}
        className={cn("font-body w-full", props.className)}
        components={{
          Chevron: ({ orientation }) => {
            return orientation === 'left' ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
            );
          },
          ...props.components,
        }}
        classNames={{
          root: "w-full relative",
          months: "w-full flex flex-col gap-4",
          month: "w-full space-y-4",
          month_caption: "flex justify-center items-center h-10 mb-4 px-2",
          caption_label: "text-xl font-semibold text-ink font-display capitalize",
          nav: "absolute top-0 left-0 w-full flex justify-between items-center h-10 px-1 pointer-events-none z-10",
          button_previous: "pointer-events-auto h-8 w-8 p-0 opacity-50 hover:opacity-100 flex items-center justify-center rounded-full hover:bg-black/5 transition-all text-ink",
          button_next: "pointer-events-auto h-8 w-8 p-0 opacity-50 hover:opacity-100 flex items-center justify-center rounded-full hover:bg-black/5 transition-all text-ink",
          month_grid: "w-full",
          weekdays: "w-full",
          weekdays_row: "w-full",
          weekday: "text-ink-muted/60 font-medium text-[10px] text-center uppercase tracking-widest pb-4",
          weeks: "w-full",
          week: "w-full",
          day: "rdp-day text-center p-1 relative",
          day_button: "rdp-day_button font-body text-ink border-none cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed",
          selected: "rdp-selected",
          today: "text-[#982820] font-bold relative after:absolute after:bottom-1.5 after:left-1/2 after:-translate-x-1/2 after:w-1 after:h-1 after:rounded-full after:bg-[#982820]",
          outside: "text-ink-muted opacity-50",
          disabled: "text-ink-muted opacity-30 cursor-not-allowed",
          hidden: "invisible",
          ...props.classNames,
        }}
      />
    </div>
  );
}
