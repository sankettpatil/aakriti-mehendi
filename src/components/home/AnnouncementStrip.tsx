import React from 'react';
import { motion } from 'framer-motion';

export function AnnouncementStrip() {
  const text = "Currently booking for Wedding Season 2025-26 - Limited dates remaining";
  
  return (
    <div className="w-full h-12 bg-surface border-y border-border overflow-hidden flex items-center relative">
      <motion.div
        className="whitespace-nowrap font-body text-sm font-medium tracking-wide text-brand uppercase flex gap-8"
        animate={{ x: ["0%", "-50%"] }}
        transition={{
          repeat: Infinity,
          ease: "linear",
          duration: 25,
        }}
      >
        {/* We repeat the text 4 times to ensure it fills the screen and loops seamlessly */}
        <span>{text}</span>
        <span>•</span>
        <span>{text}</span>
        <span>•</span>
        <span>{text}</span>
        <span>•</span>
        <span>{text}</span>
        <span>•</span>
      </motion.div>
    </div>
  );
}
