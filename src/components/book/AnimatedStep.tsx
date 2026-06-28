import React from "react";
import { motion, AnimatePresence } from "framer-motion";

interface AnimatedStepProps {
  children: React.ReactNode;
  step: number;
  currentStep: number;
  direction: number; // 1 for forwards, -1 for backwards
}

const variants = {
  enter: (direction: number) => {
    return {
      x: direction > 0 ? 50 : -50,
      opacity: 0,
    };
  },
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => {
    return {
      zIndex: 0,
      x: direction < 0 ? 50 : -50,
      opacity: 0,
    };
  },
};

export function AnimatedStep({
  children,
  step,
  currentStep,
  direction,
}: AnimatedStepProps) {
  return (
    <motion.div
      key={step}
      custom={direction}
      variants={variants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{
        x: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.2 },
      }}
      className="w-[100%]"
    >
      {children}
    </motion.div>
  );
}
