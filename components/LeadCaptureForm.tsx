"use client";

import React, { useState } from "react";
import { LeadFormData } from "../types";
import Image from "next/image";

interface LeadCaptureFormProps {
  onSubmit: (data: LeadFormData) => void;
  isSubmitting?: boolean;
}

export function LeadCaptureForm({ onSubmit, isSubmitting = false }: LeadCaptureFormProps) {
  const [formData, setFormData] = useState<LeadFormData>({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    age_group: "18-24",
    gender: "Male",
    email_consent: false,
  });

  const [errors, setErrors] = useState<Partial<Record<keyof LeadFormData, string>>>({});

  const validate = () => {
    const newErrors: Partial<Record<keyof LeadFormData, string>> = {};

    // First name validation
    const firstName = formData.first_name.trim();
    if (firstName.length < 2) {
      newErrors.first_name = "First name must be at least 2 characters";
    } else if (!/^[a-zA-Z\s'-]+$/.test(firstName)) {
      newErrors.first_name = "Please enter a valid first name";
    }

    // Last name validation
    const lastName = formData.last_name.trim();
    if (lastName.length < 1) {
      newErrors.last_name = "Last name is required";
    } else if (!/^[a-zA-Z\s'-]+$/.test(lastName)) {
      newErrors.last_name = "Please enter a valid last name";
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    const localPart = formData.email.split("@")[0]?.toLowerCase() || "";
    const domain = formData.email.split("@")[1]?.toLowerCase() || "";

    const fakeLocalParts = ["test", "asdf", "fake", "noemail", "noreply", "xxx", "abc", "xyz", "aaa", "qwerty", "temp", "dummy", "sample"];
    const disposableDomains = ["mailinator.com", "guerrillamail.com", "tempmail.com", "throwaway.email", "yopmail.com", "sharklasers.com", "grr.la", "discard.email", "trashmail.com", "10minutemail.com", "guerrillamailblock.com"];

    if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    } else if (fakeLocalParts.includes(localPart)) {
      newErrors.email = "Please enter a real email address";
    } else if (disposableDomains.includes(domain)) {
      newErrors.email = "Disposable email addresses are not allowed";
    }

    // Phone validation
    const phoneDigits = formData.phone.replace(/\D/g, "");
    const last10 = phoneDigits.slice(-10);
    const sequentialPatterns = ["1234567890", "0123456789", "9876543210", "0987654321"];
    const dummyNumbers = ["9999999999", "8888888888", "9876543210", "1234567890", "9000000000"];
    const isRepeating = /^(\d{2,5})\1+$/.test(last10);

    if (phoneDigits.length < 10) {
      newErrors.phone = "Please enter a valid 10-digit phone number";
    } else if (sequentialPatterns.includes(last10) || dummyNumbers.includes(last10)) {
      newErrors.phone = "Please enter a real phone number";
    } else if (isRepeating) {
      newErrors.phone = "Please enter a real phone number";
    } else if (!/^[6-9]/.test(last10)) {
      newErrors.phone = "Indian mobile numbers start with 6, 7, 8, or 9";
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
      <div className="flex justify-center mb-6">
        <Image 
          src="/logo.png" 
          alt="Gut & Beyond" 
          width={180} 
          height={55} 
          className="object-contain"
          priority
        />
      </div>
      <h2 className="font-heading text-3xl font-medium text-text-primary mb-2 leading-tight text-center">
        Get Your Personalized Wellness Report
      </h2>
      <p className="font-body text-text-secondary text-sm mb-8 text-center">
        We will send your complete wellness profile and recommendation to your inbox.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* First Name & Last Name */}
        <div className="flex gap-3">
          <div className="flex-1">
            <input
              type="text"
              placeholder="First name"
              className={`w-full h-12 px-4 rounded-xl border bg-card text-text-primary outline-none transition-colors ${errors.first_name ? "border-red-500" : "border-border focus:border-primary"}`}
              value={formData.first_name}
              onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
              disabled={isSubmitting}
            />
            {errors.first_name && <p className="text-red-500 text-xs mt-1 ml-1">{errors.first_name}</p>}
          </div>
          <div className="flex-1">
            <input
              type="text"
              placeholder="Last name"
              className={`w-full h-12 px-4 rounded-xl border bg-card text-text-primary outline-none transition-colors ${errors.last_name ? "border-red-500" : "border-border focus:border-primary"}`}
              value={formData.last_name}
              onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
              disabled={isSubmitting}
            />
            {errors.last_name && <p className="text-red-500 text-xs mt-1 ml-1">{errors.last_name}</p>}
          </div>
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
              <option value="18-24">18-24</option>
              <option value="25-34">25-34</option>
              <option value="35-44">35-44</option>
              <option value="45-54">45-54</option>
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
            Yes, I would like a personalized wellness plan sent to my email.
          </span>
        </label>

        <p className="font-body text-text-secondary text-[11px] leading-tight mt-1 mb-6">
          Your information is secure and will never be shared. By submitting, you agree to receive wellness guidance from Gut &amp; Beyond.
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
