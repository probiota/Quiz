"use client";

import React from "react";
import { motion } from "framer-motion";

interface ProgressBarProps {
  current: number;
  total: number;
}

export function ProgressBar({ current, total }: ProgressBarProps) {
  const percentage = Math.min(100, Math.max(0, (current / total) * 100));

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-2 px-1">
        <span className="text-xs text-text-secondary uppercase tracking-widest font-semibold font-body">
          Question {current} of {total}
        </span>
      </div>
      <div className="h-1 w-full bg-border rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-accent"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ stiffness: 200, damping: 25, type: "spring" }}
        />
      </div>
    </div>
  );
}
