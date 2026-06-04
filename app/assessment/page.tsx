"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuiz } from "../../lib/QuizContext";
import { questions, utiQuestion } from "../../lib/questions";
import { getDerivedFields, getRecommendation } from "../../lib/scoring";
import { generateExplanation } from "../../lib/explanations";
import { QuestionCard } from "../../components/QuestionCard";
import { ProgressBar } from "../../components/ProgressBar";
import { LeadCaptureForm } from "../../components/LeadCaptureForm";
import { ProcessingScreen } from "../../components/ProcessingScreen";
import { LeadFormData } from "../../types";
import { motion, AnimatePresence } from "framer-motion";

export default function AssessmentPage() {
  const router = useRouter();
  const { state, dispatch } = useQuiz();
  const [direction, setDirection] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (state.phase === "welcome") {
      dispatch({ type: "SET_PHASE", payload: "questions" });
    }
  }, [state.phase, dispatch]);

  useEffect(() => {
    if (state.phase === "results") {
      router.push("/results");
    }
  }, [state.phase, router]);

  // If we are past the base 10 questions, but haven't captured lead yet
  useEffect(() => {
    if (state.phase === "questions" && state.current_question > questions.length) {
      dispatch({ type: "SET_PHASE", payload: "lead_capture" });
    }
  }, [state.current_question, state.phase, dispatch]);

  const handleSelect = (optionText: string) => {
    setDirection(1);
    
    // Find if option has a lifestyle tag or goal tag to save
    const currentQIndex = state.current_question - 1;
    const currentQ = questions[currentQIndex];
    if (currentQ) {
      const option = currentQ.options.find(o => o.text === optionText);
      if (option && 'lifestyleTag' in option) {
        dispatch({ type: "SET_LIFESTYLE", payload: option.lifestyleTag as any });
      }
      if (option && 'goalTag' in option) {
        dispatch({ type: "SET_GOAL", payload: option.goalTag as any });
      }
    }

    dispatch({
      type: "ANSWER_QUESTION",
      payload: { questionId: state.current_question, selectedOption: optionText }
    });
  };

  const handleBack = () => {
    setDirection(-1);
    dispatch({ type: "GO_BACK" });
  };

  const handleLeadSubmit = async (data: LeadFormData) => {
    setIsSubmitting(true);
    dispatch({ type: "SET_GENDER", payload: data.gender });
    dispatch({ type: "SET_LEAD_DATA", payload: data });
    
    // Calculate result data for the API
    const { primary_concern, secondary_concern } = getDerivedFields(state.scores);
    const recommended_product = getRecommendation(state.scores, data.gender);
    const explanation = generateExplanation(primary_concern, secondary_concern, state.lifestyle_type);

    const resultData = {
      primary_concern,
      secondary_concern,
      recommended_product,
      product_url: "https://gutandbeyond.com",
      lifestyle_type: state.lifestyle_type,
      primary_goal: state.primary_goal,
      scores: state.scores,
      explanation
    };

    try {
      await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leadData: data, resultData })
      });
    } catch (error) {
      console.error("Failed to submit lead", error);
    }

    setIsSubmitting(false);
    dispatch({ type: "SET_PHASE", payload: "processing" });
    
    // Simulate processing time before showing results
    setTimeout(() => {
      dispatch({ type: "SET_PHASE", payload: "results" });
    }, 4500); // Wait enough time to cycle through processing messages
  };

  if (state.phase === "processing") {
    return <ProcessingScreen />;
  }

  const currentQIndex = state.current_question - 1;
  const currentQuestionData = questions[currentQIndex];

  return (
    <div className="flex flex-col min-h-screen bg-surface">
      <div className="flex-1 flex flex-col max-w-md w-full mx-auto px-6 pt-12 pb-6">
        
        {state.phase === "questions" && (
          <div className="w-full mb-8">
            <ProgressBar current={state.current_question} total={questions.length} />
          </div>
        )}

        <div className="flex-1 flex flex-col relative overflow-hidden">
          <AnimatePresence mode="wait" custom={direction}>
            {state.phase === "questions" && currentQuestionData && (
              <QuestionCard
                key={`q-${currentQuestionData.id}`}
                question={currentQuestionData}
                onSelect={handleSelect}
                onBack={handleBack}
                showBack={state.current_question > 1}
                direction={direction}
              />
            )}

            {state.phase === "lead_capture" && (
              <motion.div
                key="lead-capture"
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="w-full flex-1"
              >
                <LeadCaptureForm onSubmit={handleLeadSubmit} isSubmitting={isSubmitting} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
