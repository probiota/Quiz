"use client";

import React from "react";
import { motion } from "framer-motion";

interface ProductCardProps {
  product: {
    name: string;
    url: string;
    description: string;
    bullets: string[];
  };
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="w-full bg-card rounded-2xl p-6 border border-border shadow-sm flex flex-col items-center text-center mt-8">
      <span className="text-[10px] font-bold tracking-widest text-primary uppercase mb-4 bg-primary/10 px-3 py-1 rounded-full">
        Personalized Recommendation
      </span>
      
      <h3 className="font-heading text-3xl font-bold text-text-primary mb-2">
        {product.name}
      </h3>
      
      <p className="font-body text-text-secondary text-sm mb-6 leading-relaxed">
        {product.description}
      </p>
      
      <div className="w-full flex flex-col gap-3 mb-8 text-left">
        {product.bullets.map((bullet, idx) => (
          <div key={idx} className="flex items-start gap-3">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0 mt-0.5">
              <circle cx="10" cy="10" r="10" fill="#C8F5A0" />
              <path d="M14 7L8.5 12.5L6 10" stroke="#1A3C34" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="font-body text-text-primary text-sm font-medium leading-tight">
              {bullet}
            </span>
          </div>
        ))}
      </div>
      
      <a 
        href={product.url}
        target="_blank"
        rel="noreferrer"
        className="w-full"
      >
        <motion.button
          whileTap={{ scale: 0.98 }}
          className="w-full bg-primary text-accent font-body font-semibold py-4 rounded-xl transition-opacity hover:opacity-95"
        >
          Claim Your Exclusive IHFF Offer →
        </motion.button>
      </a>
      
      <p className="text-text-secondary text-xs mt-4">
        Special pricing available for IHFF attendees only
      </p>
    </div>
  );
}
