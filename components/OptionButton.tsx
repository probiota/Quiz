"use client";

import React from "react";
import { motion } from "framer-motion";

interface OptionButtonProps {
  text: string;
  selected: boolean;
  onClick: () => void;
}

export function OptionButton({ text, selected, onClick }: OptionButtonProps) {
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className={`w-full min-h-[56px] px-6 py-4 rounded-xl border text-left flex items-center justify-between transition-colors mb-3 ${
        selected
          ? "border-primary bg-primary/5 text-primary"
          : "border-border bg-card text-text-primary hover:border-primary/50"
      }`}
    >
      <span className="font-body text-base font-medium leading-tight pr-4">
        {text}
      </span>
      {selected && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex-shrink-0"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="12" fill="#1A3C34" />
            <path d="M16.5 8L10.5 14L7.5 11" stroke="#C8F5A0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </motion.div>
      )}
    </motion.button>
  );
}
