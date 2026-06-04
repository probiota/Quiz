"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const messages = [
  "Analyzing your wellness profile...",
  "Calculating your health scores...",
  "Matching your lifestyle patterns...",
  "Preparing your personalized recommendation...",
  "Almost ready..."
];

export function ProcessingScreen() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % messages.length);
    }, 1500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="fixed inset-0 bg-surface flex flex-col items-center justify-center p-6 z-50">
      <div className="relative w-24 h-24 mb-10">
        <svg className="w-full h-full animate-[spin_1.2s_ease-in-out_infinite]" viewBox="0 0 50 50">
          <circle
            className="text-border stroke-current"
            strokeWidth="4"
            cx="25"
            cy="25"
            r="20"
            fill="transparent"
          ></circle>
          <circle
            className="text-primary stroke-current"
            strokeWidth="4"
            strokeLinecap="round"
            cx="25"
            cy="25"
            r="20"
            fill="transparent"
            strokeDasharray="90"
            strokeDashoffset="0"
          ></circle>
        </svg>
      </div>
      
      <div className="h-8 relative w-full max-w-xs text-center">
        <AnimatePresence mode="wait">
          <motion.p
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="font-body text-text-primary text-base font-medium absolute w-full"
          >
            {messages[index]}
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  );
}
