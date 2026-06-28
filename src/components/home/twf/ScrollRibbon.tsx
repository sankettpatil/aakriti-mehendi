import React, { useRef } from 'react';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';

export function ScrollRibbon() {
  const containerRef = useRef(null);

  // Start drawing when the ribbon enters the bottom of the screen (90%),
  // and finish drawing by the time it reaches the middle/top of the screen (40%).
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 90%', 'end 40%'],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 70,
    damping: 20,
    restDelta: 0.001,
  });

  const pathLength = useTransform(smoothProgress, [0, 1], [0, 1]);

  return (
    // Standard section padding instead of 200vh
    <div ref={containerRef} className="w-full relative bg-bg pt-12 md:pt-16 pb-0 overflow-hidden flex justify-center items-center">
      <svg
        viewBox="0 0 1200 400"
        className="w-full h-auto"
        fill="none"
        stroke="#E83C3C"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <motion.path
          d="M 0 300 
             C 200 300, 450 300, 600 320 
             C 750 340, 900 60, 750 60 
             C 650 60, 600 90, 600 120 
             C 600 90, 550 60, 450 60 
             C 300 60, 300 360, 600 320 
             C 750 300, 1000 300, 1200 300"
          style={{ pathLength }}
        />
      </svg>
    </div>
  );
}
