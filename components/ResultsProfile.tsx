"use client";

import React from "react";
import { motion } from "framer-motion";
import { AssessmentResult } from "../types";
import { ProductCard } from "./ProductCard";
import { products } from "../lib/products";
import { COUPON_CODE, COUPON_DISCOUNT, COUPON_VALIDITY_DAYS } from "../lib/config";
import Image from "next/image";

interface ResultsProfileProps {
  name: string;
  result: AssessmentResult;
  email: string;
  emailConsent: boolean;
}

export function ResultsProfile({ name, result, email, emailConsent }: ResultsProfileProps) {
  const container: any = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };

  const item: any = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  const today = new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
  
  // Sort scores to get top 3
  const topScores = Object.entries(result.scores)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  const getLevelLabel = (score: number) => {
    if (score >= 7) return "High";
    if (score >= 4) return "Moderate";
    return "Mild";
  };

  const getScorePercentage = (score: number) => Math.min(100, Math.max(10, (score / 12) * 100)); // assuming 12 is near max

  const productDetails = products[result.recommended_product as keyof typeof products];

  // Calculate coupon expiry date
  const expiryDate = new Date();
  expiryDate.setDate(expiryDate.getDate() + COUPON_VALIDITY_DAYS);
  const expiryFormatted = expiryDate.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

  const handleCopyCoupon = () => {
    navigator.clipboard.writeText(COUPON_CODE);
  };

  return (
    <motion.div 
      variants={container} 
      initial="hidden" 
      animate="show"
      className="w-full max-w-md mx-auto py-8 px-2 flex flex-col gap-10 overflow-x-hidden"
    >
      {/* Section 1 - Header */}
      <motion.div variants={item} className="text-center flex flex-col items-center">
        <div className="mb-6">
          <Image 
            src="/logo.png" 
            alt="Gut & Beyond" 
            width={180} 
            height={55} 
            className="object-contain"
            priority
          />
        </div>
        <span className="text-xs font-bold tracking-[0.2em] text-primary uppercase mb-3 block">
          Your Wellness Profile
        </span>
        <h1 className="font-heading text-4xl font-semibold text-text-primary mb-2">
          {name}&apos;s Wellness Report
        </h1>
        <p className="font-body text-text-secondary text-sm">
          Assessed on {today} at IHFF 2026
        </p>
      </motion.div>

      {/* Section 2 - Score Cards (Horizontal scroll) */}
      <motion.div variants={item} className="w-full">
        <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory hide-scrollbar -mx-6 px-6" style={{ scrollbarWidth: 'none' }}>
          {topScores.map(([category, score], idx) => (
            <div 
              key={category} 
              className={`snap-center shrink-0 w-40 bg-card rounded-2xl p-4 border shadow-sm flex flex-col ${
                idx === 0 ? "border-primary border-2" : "border-border"
              }`}
            >
              <span className="font-body text-text-secondary text-xs uppercase tracking-wider font-semibold mb-1">
                {category}
              </span>
              <span className="font-heading text-xl font-medium text-text-primary mb-4">
                {getLevelLabel(score)}
              </span>
              
              <div className="h-1.5 w-full bg-border rounded-full overflow-hidden mt-auto">
                <div 
                  className={`h-full rounded-full ${idx === 0 ? "bg-primary" : "bg-text-secondary/40"}`}
                  style={{ width: `${getScorePercentage(score)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Section 3 - Lifestyle Summary */}
      <motion.div variants={item} className="flex flex-wrap justify-center gap-3">
        {result.lifestyle_type && (
          <div className="bg-primary/5 border border-primary/20 text-primary font-body text-xs font-medium px-4 py-2 rounded-full flex items-center gap-2">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
            {result.lifestyle_type}
          </div>
        )}
        {result.primary_goal && (
          <div className="bg-primary/5 border border-primary/20 text-primary font-body text-xs font-medium px-4 py-2 rounded-full flex items-center gap-2">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
            {result.primary_goal}
          </div>
        )}
      </motion.div>

      {/* Section 4 - Primary Concern Block */}
      <motion.div variants={item} className="bg-primary/5 rounded-2xl p-6 border border-primary/10">
        <h2 className="font-heading text-2xl font-semibold text-text-primary mb-3">
          Your Primary Wellness Focus
        </h2>
        <p className="font-body text-text-primary text-[15px] leading-relaxed">
          {result.explanation}
        </p>
      </motion.div>

      {/* Section 5 - Recommended Product Card */}
      {productDetails && (
        <motion.div variants={item}>
          <ProductCard product={productDetails} />
        </motion.div>
      )}

      {/* Section 6 - Exclusive Coupon Code */}
      <motion.div variants={item}>
        <div className="relative bg-gradient-to-br from-primary/10 via-primary/5 to-transparent rounded-2xl p-6 border-2 border-dashed border-primary/30 text-center overflow-hidden">
          {/* Decorative corner badge */}
          <div className="absolute -top-1 -right-1 bg-primary text-accent text-[10px] font-bold px-4 py-1.5 rounded-bl-xl rounded-tr-xl tracking-wider uppercase">
            Exclusive
          </div>

          <div className="mb-3">
            <span className="text-xs font-bold tracking-[0.15em] text-primary uppercase">
              IHFF Special Offer
            </span>
          </div>
          
          <h3 className="font-heading text-2xl font-bold text-text-primary mb-2">
            Get {COUPON_DISCOUNT} Off
          </h3>
          <p className="font-body text-text-secondary text-sm mb-5">
            Use this exclusive code at checkout
          </p>

          {/* Coupon Code Box */}
          <button
            onClick={handleCopyCoupon}
            className="group inline-flex items-center gap-3 bg-white border-2 border-primary rounded-xl px-6 py-3 hover:bg-primary/5 transition-colors cursor-pointer"
          >
            <span className="font-heading text-2xl font-bold text-primary tracking-[0.15em]">
              {COUPON_CODE}
            </span>
            <svg 
              width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              className="text-primary/60 group-hover:text-primary transition-colors"
            >
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
          </button>
          <p className="font-body text-[11px] text-text-secondary mt-1">Tap to copy</p>

          <p className="font-body text-text-secondary text-xs mt-4">
            ⏳ Valid until <strong className="text-text-primary">14 June</strong> only
          </p>
        </div>
      </motion.div>

      {/* Section 7 - Email Consent */}
      {emailConsent && (
        <motion.div variants={item} className="flex items-center justify-center gap-2 text-text-secondary text-xs mt-2">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><polyline points="20 6 9 17 4 12"></polyline></svg>
          <span>Your personalized wellness plan will be sent to {email}</span>
        </motion.div>
      )}

      {/* Section 8 - Secondary CTA */}
      <motion.div variants={item} className="text-center pb-8 pt-4">
        <a 
          href="https://gutandbeyond.com" 
          target="_blank" 
          rel="noreferrer"
          className="font-body text-sm font-semibold text-primary hover:underline underline-offset-4"
        >
          Explore all Gut &amp; Beyond products →
        </a>
      </motion.div>
    </motion.div>
  );
}
