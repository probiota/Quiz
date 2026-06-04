"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuiz } from "../lib/QuizContext";
import { motion } from "framer-motion";

import Image from "next/image";

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
        <div className="mb-10 mt-4">
          <Image 
            src="/logo.png" 
            alt="Gut & Beyond" 
            width={220} 
            height={70} 
            className="object-contain"
            priority
          />
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
