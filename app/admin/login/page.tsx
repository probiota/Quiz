"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (res.ok) {
        router.push("/admin");
        router.refresh();
      } else {
        const data = await res.json();
        setError(data.error || "Invalid credentials");
        setLoading(false);
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-border p-8"
      >
        <div className="flex justify-center mb-8">
          <Image 
            src="/logo.png" 
            alt="Gut & Beyond" 
            width={180} 
            height={55} 
            className="object-contain"
            priority
          />
        </div>

        <h1 className="font-heading text-2xl font-semibold text-text-primary text-center mb-2">
          Admin Dashboard
        </h1>
        <p className="font-body text-text-secondary text-sm text-center mb-8">
          Sign in to access your wellness assessment leads.
        </p>

        <form onSubmit={handleLogin} className="flex flex-col gap-5">
          <div>
            <label className="block font-body text-sm font-medium text-text-primary mb-1">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full h-12 px-4 rounded-xl border border-border bg-card text-text-primary outline-none focus:border-primary transition-colors"
              required
            />
          </div>

          <div>
            <label className="block font-body text-sm font-medium text-text-primary mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-12 px-4 rounded-xl border border-border bg-card text-text-primary outline-none focus:border-primary transition-colors"
              required
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm font-body mt-[-8px]">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 mt-2 bg-primary text-accent font-body font-semibold rounded-xl flex items-center justify-center hover:opacity-95 transition-opacity disabled:opacity-70"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
