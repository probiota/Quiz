"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { OptionButton } from "./OptionButton";

interface QuestionCardProps {
  question: {
    id: number;
    text: string;
    options: { text: string }[];
  };
  onSelect: (optionText: string) => void;
  onBack?: () => void;
  showBack: boolean;
  direction?: number;
}

export function QuestionCard({ question, onSelect, onBack, showBack, direction = 1 }: QuestionCardProps) {
  const [selected, setSelected] = useState<string | null>(null);

  const handleSelect = (optionText: string) => {
    setSelected(optionText);
    setTimeout(() => {
      onSelect(optionText);
      setSelected(null);
    }, 300);
  };

  return (
    <div className="flex flex-col h-full w-full justify-center">
      <motion.div
        key={question.id}
        initial={{ opacity: 0, x: direction > 0 ? 40 : -40 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: direction > 0 ? -40 : 40 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="w-full flex-1 flex flex-col pt-8"
      >
        <h2 className="font-heading text-3xl font-medium text-text-primary mb-10 leading-tight">
          {question.text}
        </h2>
        
        <div className="flex-1 flex flex-col">
          {question.options.map((option, idx) => (
            <OptionButton
              key={idx}
              text={option.text}
              selected={selected === option.text}
              onClick={() => handleSelect(option.text)}
            />
          ))}
        </div>

        <div className="mt-8 pb-8 h-12 flex items-center">
          {showBack && (
            <button
              onClick={onBack}
              className="text-text-secondary font-body font-medium text-sm hover:text-primary transition-colors flex items-center gap-2"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Back
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
}
