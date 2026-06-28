import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SLIDES = [
  {
    location: "Jaipur, India",
    date: "Nov 2024",
    title: "The Royal Symphony",
    image: "https://images.unsplash.com/photo-1621008064972-2300bcfdecf8?q=80&w=2000&auto=format&fit=crop"
  },
  {
    location: "Udaipur, India",
    date: "Dec 2024",
    title: "A Timeless Vow",
    image: "https://images.unsplash.com/photo-1596455607563-ad6193f76b17?q=80&w=2000&auto=format&fit=crop"
  },
  {
    location: "Jaipur, India",
    date: "Jan 2025",
    title: "Modern Elegance",
    image: "https://images.unsplash.com/photo-1605335198425-4b35e2ab2509?q=80&w=2000&auto=format&fit=crop"
  }
];

export function HeroSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative w-full h-[70vh] md:h-[85vh] overflow-hidden bg-ink">
      
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0"
        >
          <img 
            src={SLIDES[currentIndex].image} 
            alt={SLIDES[currentIndex].title}
            className="w-full h-full object-cover"
          />
          {/* Premium Gradient Overlay instead of flat color */}
          <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/30 to-ink/10 mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent" />
        </motion.div>
      </AnimatePresence>

      <div className="absolute inset-0 z-10 flex flex-col justify-end pb-24 md:pb-32 px-6 md:px-16 max-w-7xl mx-auto">
        
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col items-start gap-4"
          >
            <div className="flex items-center gap-3 text-white/80 font-body text-xs md:text-sm uppercase tracking-[0.2em]">
              <span>{SLIDES[currentIndex].location}</span>
              <span className="w-1 h-1 bg-brand rounded-full"></span>
              <span>{SLIDES[currentIndex].date}</span>
            </div>

            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tighter leading-none mb-6">
              {SLIDES[currentIndex].title}
            </h1>

            <a href="/gallery" className="btn btn-primary text-xs tracking-widest mt-2">
              View Collection
            </a>
          </motion.div>
        </AnimatePresence>

      </div>

      {/* Custom Slider Navigation Dots */}
      <div className="absolute bottom-8 left-6 md:left-16 z-20 flex gap-2">
        {SLIDES.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`h-1.5 transition-all duration-300 rounded-full ${
              idx === currentIndex ? 'w-6 bg-brand' : 'w-1.5 bg-white/30 hover:bg-white/50'
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>

    </section>
  );
}
