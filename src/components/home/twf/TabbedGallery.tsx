import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const IMAGES = [
  "https://images.unsplash.com/photo-1596455607563-ad6193f76b17?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1605335198425-4b35e2ab2509?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1621008064972-2300bcfdecf8?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1512163143273-bde0e3cc7407?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1587271407850-8d438ca9fdf4?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1542038383-7744cd874139?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1605335198425-4b35e2ab2509?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1596455607563-ad6193f76b17?q=80&w=1200&auto=format&fit=crop"
];

export function TabbedGallery() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Track scroll progress of this specific section
  const { scrollYProgress } = useScroll({
    target: containerRef,
    // Start tracking when the top of the container hits the bottom of the viewport
    // Stop tracking when the bottom of the container hits the top of the viewport
    offset: ["start end", "end start"]
  });

  // As user scrolls past, move the film roll left
  // Moving from 0% to -40% of its massive width creates the continuous scroll effect
  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-40%"]);

  return (
    <section ref={containerRef} className="w-full bg-surface pt-8 md:pt-16 pb-20 md:pb-32 overflow-hidden flex flex-col items-center">
      
      {/* Titles matching TWF scale and layout */}
      <div className="text-center mb-10 md:mb-16">
        <p className="font-body text-[10px] md:text-xs font-semibold uppercase tracking-[0.2em] text-[#555] mb-4">
          Real Mehndi Art Made by Real Artists
        </p>
        <h2 className="font-display text-2xl md:text-3xl lg:text-[34px] text-[#111] font-normal tracking-wide uppercase">
          View The Art
        </h2>
      </div>

      {/* Tilted Film Roll Container */}
      {/* We make it wider than the screen (110vw) and rotate it so the edges stay hidden */}
      <div className="w-[110vw] -ml-[5vw] bg-[#0a0a0a] py-6 md:py-10 shadow-2xl relative" style={{ transform: 'rotate(-2deg)' }}>
        
        {/* Top Sprocket Holes */}
        <div className="absolute top-1.5 md:top-2 left-0 w-full h-2 md:h-3 opacity-90" style={{
          backgroundImage: 'linear-gradient(90deg, var(--color-surface, #FFFFFF) 10px, transparent 10px)',
          backgroundSize: '24px 100%'
        }}></div>

        {/* Bottom Sprocket Holes */}
        <div className="absolute bottom-1.5 md:bottom-2 left-0 w-full h-2 md:h-3 opacity-90" style={{
          backgroundImage: 'linear-gradient(90deg, var(--color-surface, #FFFFFF) 10px, transparent 10px)',
          backgroundSize: '24px 100%'
        }}></div>

        <motion.div 
          style={{ x }} 
          className="flex gap-4 md:gap-6 px-8 items-center w-max mt-1 md:mt-0"
        >
          {IMAGES.map((img, idx) => (
            <div 
              key={idx} 
              className="w-[60vw] md:w-[35vw] lg:w-[25vw] shrink-0 aspect-[4/3] rounded-[32px] overflow-hidden relative group cursor-pointer border border-white/10 shadow-lg"
            >
              <img 
                src={img} 
                alt="Mehndi Art"
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" 
              />
              
              {/* Subtle hover overlay to make it feel premium */}
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors duration-700" />
            </div>
          ))}
        </motion.div>
      </div>

    </section>
  );
}
