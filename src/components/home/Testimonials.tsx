import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const defaultTestimonials = [
  {
    quote: "Oh gosh, this movie ❤️ It is pure beauty!! I watched it twice in a day within a span of few hours and cried both times. You were right in how much thought, consideration and work has gone into making the movie. It is clearly evident! Loved how it blends everything, everyone and spreads the message of “Love is Love”!!",
    name: "AAYUSH & SUMAN",
    meta: "Aakriti Groom",
    image: "https://images.unsplash.com/photo-1596455607563-ad6193f76b17?q=80&w=1200&auto=format&fit=crop"
  },
  {
    quote: "I wanted a mix of Rajasthani and Arabic elements for my engagement, and she delivered perfectly. She's professional, punctual, and a joy to be around.",
    name: "RIYA PATEL",
    meta: "Aakriti Bride",
    image: "https://images.unsplash.com/photo-1605335198425-4b35e2ab2509?q=80&w=1200&auto=format&fit=crop"
  },
  {
    quote: "Booking was seamless, and the result was stunning. Even my grandmother, who is very particular about traditional mehndi, was deeply impressed by her skill.",
    name: "ANANYA SINGH",
    meta: "Aakriti Bride",
    image: "https://images.unsplash.com/photo-1621008064972-2300bcfdecf8?q=80&w=1200&auto=format&fit=crop"
  }
];

export interface TestimonialData {
  id?: number;
  quote: string;
  customer_name: string;
  occasion?: string | null;
  city?: string | null;
  year?: number | null;
  photo_r2_key?: string | null;
}

interface Props {
  data?: TestimonialData[];
}

export function Testimonials({ data }: Props) {
  const displayData = data && data.length > 0 ? data.map(t => ({
    quote: t.quote,
    name: t.customer_name,
    meta: "Aakriti Bride",
    image: t.photo_r2_key ? `/${t.photo_r2_key}` : defaultTestimonials[0].image
  })) : defaultTestimonials;

  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % displayData.length);
  const prevSlide = () => setCurrentIndex((prev) => (prev - 1 + displayData.length) % displayData.length);

  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % displayData.length);
    }, 5000);
    return () => clearTimeout(timer);
  }, [currentIndex, displayData.length]);

  return (
    <div className="w-full max-w-[1400px] mx-auto px-0 md:px-6">
      <div className="w-full bg-[#f6f5f3] rounded-[24px] p-8 lg:p-12 relative">
        
        {/* Header section matching TWF exactly */}
        <div className="text-center mb-12">
          <p className="font-body text-[10px] md:text-xs font-semibold uppercase tracking-[0.2em] text-[#555] mb-4">
            Here's what our couples have to say
          </p>
          <h2 className="font-display text-2xl md:text-3xl lg:text-[34px] text-[#111] font-normal tracking-wide uppercase">
            Notes of Gratitude
          </h2>
        </div>

        <div className="relative w-full flex flex-col items-center">
          
          {/* Navigation Arrows */}
          <button 
            onClick={prevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 -ml-2 lg:-ml-6 z-20 w-8 h-8 flex items-center justify-center rounded-full bg-transparent border border-black/10 hover:bg-black/5 transition-colors"
            aria-label="Previous testimonial"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
          </button>

          <button 
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 -mr-2 lg:-mr-6 z-20 w-8 h-8 flex items-center justify-center rounded-full bg-transparent border border-black/10 hover:bg-black/5 transition-colors"
            aria-label="Next testimonial"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
          </button>

          <div className="w-full px-12 md:px-16 lg:px-20 relative overflow-hidden min-h-[300px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16 w-full"
              >
                {/* Content Side (Left) */}
                <div className="w-full lg:w-1/2 flex flex-col justify-center text-center px-4">
                  <p className="font-display text-base md:text-lg lg:text-[20px] text-[#222] leading-[1.6] mb-8">
                    {displayData[currentIndex].quote}
                  </p>
                  
                  <div className="flex flex-col items-center gap-1">
                    <div className="font-body text-[11px] text-[#444] uppercase tracking-[0.1em]">
                      - {displayData[currentIndex].name}
                    </div>
                    <div className="font-body text-[10px] text-[#777] uppercase tracking-[0.1em]">
                      {displayData[currentIndex].meta}
                    </div>
                  </div>
                </div>

                {/* Image Side (Right) */}
                <div className="w-full lg:w-1/2">
                  <div className="relative aspect-[16/10] rounded-[16px] overflow-hidden shadow-sm">
                    <img 
                      src={displayData[currentIndex].image} 
                      alt={displayData[currentIndex].name}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Progress Bar / Dots (Matching TWF) */}
          <div className="flex items-center gap-1.5 mt-12 pb-2">
            {displayData.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`h-[4px] transition-all duration-300 rounded-full ${
                  idx === currentIndex ? 'w-8 bg-[#999]' : 'w-1.5 bg-[#ccc]'
                }`}
                aria-label={`Go to testimonial ${idx + 1}`}
              />
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}
