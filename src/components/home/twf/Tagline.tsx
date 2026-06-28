import React from 'react';
import { motion } from 'framer-motion';

export function Tagline() {
  return (
    <section className="w-full bg-surface py-12 md:py-20 px-6 flex items-center justify-center border-b border-border/30">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="max-w-4xl mx-auto text-center flex flex-col items-center"
      >
        {/* Elegant decorative element */}
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-brand/40 mb-8 md:mb-12">
          <path d="M12 22C12 22 20 18 20 12C20 6 12 2 12 2C12 2 4 6 4 12C4 18 12 22 12 22Z" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M12 22V12" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>

        <h2 className="font-display text-4xl md:text-5xl lg:text-[64px] leading-[1.2] font-normal tracking-tight mb-8">
          <span className="text-brand italic">Not just designs.</span><br/>
          <span className="text-ink mt-2 block">Heirlooms for your hands.</span>
        </h2>
        
        <p className="font-body text-base md:text-lg text-ink-muted leading-relaxed max-w-2xl mx-auto font-light">
          Aakriti Mehndi brings the intricacy of traditional Rajasthani art to the modern bride. We believe every stroke should tell a story, lasting long after the celebrations end.
        </p>
      </motion.div>
    </section>
  );
}
