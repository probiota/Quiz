"use client";

import { QuizProvider } from "../lib/QuizContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QuizProvider>
      {children}
    </QuizProvider>
  );
}
