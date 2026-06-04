"use client";

import React, { useState } from "react";
import { LeadFormData } from "../types";

interface LeadCaptureFormProps {
  onSubmit: (data: LeadFormData) => void;
  isSubmitting?: boolean;
}

export function LeadCaptureForm({ onSubmit, isSubmitting = false }: LeadCaptureFormProps) {
  const [formData, setFormData] = useState<LeadFormData>({
    full_name: "",
    email: "",
    phone: "",
    age_group: "18-24",
    gender: "Male",
    email_consent: false,
  });

  const [errors, setErrors] = useState<Partial<Record<keyof LeadFormData, string>>>({});

  const validate = () => {
    const newErrors: Partial<Record<keyof LeadFormData, string>> = {};

    if (formData.full_name.trim().length < 2) {
      newErrors.full_name = "Name must be at least 2 characters";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const invalidEmails = ["test@", "asdf@", "fake@", "noemail@", "noreply@", "xxx@"];
    if (!emailRegex.test(formData.email) || invalidEmails.some(inv => formData.email.toLowerCase().startsWith(inv))) {
      newErrors.email = "Please enter a valid email address";
    }

    const phoneDigits = formData.phone.replace(/[\s-]/g, "");
    if (phoneDigits.length < 10) {
      newErrors.phone = "Please enter a valid phone number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  return (
    <div className="w-full flex flex-col justify-center py-8">
      <h2 className="font-heading text-3xl font-medium text-text-primary mb-2 leading-tight">
        Get Your Personalized Wellness Report
      </h2>
      <p className="font-body text-text-secondary text-sm mb-8">
        We'll send your complete wellness profile and recommendation to your inbox.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Name */}
        <div>
          <input
            type="text"
            placeholder="Your full name"
            className={`w-full h-12 px-4 rounded-xl border bg-card text-text-primary outline-none transition-colors ${errors.full_name ? "border-red-500" : "border-border focus:border-primary"}`}
            value={formData.full_name}
            onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
            disabled={isSubmitting}
          />
          {errors.full_name && <p className="text-red-500 text-xs mt-1 ml-1">{errors.full_name}</p>}
        </div>

        {/* Email */}
        <div>
          <input
            type="email"
            placeholder="your@email.com"
            className={`w-full h-12 px-4 rounded-xl border bg-card text-text-primary outline-none transition-colors ${errors.email ? "border-red-500" : "border-border focus:border-primary"}`}
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            disabled={isSubmitting}
          />
          {errors.email && <p className="text-red-500 text-xs mt-1 ml-1">{errors.email}</p>}
        </div>

        {/* Phone */}
        <div>
          <input
            type="tel"
            placeholder="+91 XXXXX XXXXX"
            className={`w-full h-12 px-4 rounded-xl border bg-card text-text-primary outline-none transition-colors ${errors.phone ? "border-red-500" : "border-border focus:border-primary"}`}
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            disabled={isSubmitting}
          />
          {errors.phone && <p className="text-red-500 text-xs mt-1 ml-1">{errors.phone}</p>}
        </div>

        <div className="flex gap-4">
          {/* Age Group */}
          <div className="flex-1">
            <select
              className="w-full h-12 px-4 rounded-xl border border-border bg-card text-text-primary outline-none focus:border-primary"
              value={formData.age_group}
              onChange={(e) => setFormData({ ...formData, age_group: e.target.value as LeadFormData["age_group"] })}
              disabled={isSubmitting}
            >
              <option value="18-24">18–24</option>
              <option value="25-34">25–34</option>
              <option value="35-44">35–44</option>
              <option value="45-54">45–54</option>
              <option value="55+">55+</option>
            </select>
          </div>

          {/* Gender */}
          <div className="flex-1">
            <select
              className="w-full h-12 px-4 rounded-xl border border-border bg-card text-text-primary outline-none focus:border-primary"
              value={formData.gender}
              onChange={(e) => setFormData({ ...formData, gender: e.target.value as LeadFormData["gender"] })}
              disabled={isSubmitting}
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Prefer not to say">Prefer not to say</option>
            </select>
          </div>
        </div>

        {/* Consent */}
        <label className="flex items-start gap-3 mt-4 cursor-pointer group">
          <div className="mt-1 relative flex items-center justify-center w-5 h-5">
            <input
              type="checkbox"
              className="peer appearance-none w-5 h-5 border border-border rounded checked:bg-primary checked:border-primary cursor-pointer transition-colors"
              checked={formData.email_consent}
              onChange={(e) => setFormData({ ...formData, email_consent: e.target.checked })}
              disabled={isSubmitting}
            />
            <svg
              className="absolute pointer-events-none opacity-0 peer-checked:opacity-100 text-accent w-3.5 h-3.5"
              viewBox="0 0 14 10"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1 5L5 9L13 1"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <span className="font-body text-text-primary text-sm leading-relaxed flex-1 group-hover:text-primary transition-colors">
            Yes, I'd like a personalized wellness plan sent to my email.
          </span>
        </label>

        <p className="font-body text-text-secondary text-[11px] leading-tight mt-1 mb-6">
          Your information is secure and will never be shared. By submitting, you agree to receive wellness guidance from Gut & Beyond.
        </p>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full h-14 bg-primary text-accent font-body font-semibold rounded-full flex items-center justify-center transition-opacity hover:opacity-95 disabled:opacity-70"
        >
          {isSubmitting ? "Processing..." : "Reveal My Wellness Profile →"}
        </button>
      </form>
    </div>
  );
}
