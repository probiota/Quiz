"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuiz } from "../lib/QuizContext";
import { motion } from "framer-motion";

export default function WelcomePage() {
  const router = useRouter();
  const { dispatch } = useQuiz();

  useEffect(() => {
    // Reset any existing quiz state when visiting the welcome page
    dispatch({ type: "RESET_QUIZ" });
  }, [dispatch]);

  const handleStart = () => {
    router.push("/assessment");
  };

  return (
    <div className="flex flex-col min-h-screen bg-surface px-6 py-12 justify-center items-center text-center">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md flex flex-col items-center"
      >
        <div className="mb-12">
          <h2 className="font-heading text-2xl font-bold tracking-widest text-primary uppercase">Gut & Beyond</h2>
        </div>
        
        <div className="w-24 h-24 mb-10 text-primary opacity-80">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 22C12 22 20 18 20 12V5L12 2L4 5V12C4 18 12 22 12 22Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 22V2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 12C12 12 16.5 10 18.5 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 12C12 12 7.5 10 5.5 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        <h1 className="font-heading text-[32px] font-semibold text-text-primary leading-tight mb-4">
          Discover Your Personalized Wellness Profile
        </h1>
        
        <p className="font-body text-base text-text-secondary leading-relaxed mb-8">
          Answer 10 short questions and receive a science-backed wellness recommendation tailored to your lifestyle and goals.
        </p>
        
        <p className="font-body text-[13px] text-text-secondary/70 mb-10">
          Takes less than 2 minutes · 100% free · No pressure
        </p>

        <button 
          onClick={handleStart}
          className="w-full h-[56px] bg-primary text-accent font-body font-semibold rounded-full flex items-center justify-center transition-opacity hover:opacity-95 text-lg"
        >
          Begin Assessment →
        </button>
      </motion.div>
    </div>
  );
}
