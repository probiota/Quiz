"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuiz } from "../../lib/QuizContext";
import { getDerivedFields, getRecommendation } from "../../lib/scoring";
import { generateExplanation } from "../../lib/explanations";
import { ResultsProfile } from "../../components/ResultsProfile";
import { AssessmentResult } from "../../types";

export default function ResultsPage() {
  const router = useRouter();
  const { state } = useQuiz();
  const [resultData, setResultData] = useState<AssessmentResult | null>(null);

  useEffect(() => {
    if (state.answers.length === 0) {
      router.replace("/");
      return;
    }

    const { primary_concern, secondary_concern } = getDerivedFields(state.scores);
    const recommended_product = getRecommendation(state.scores, state.genderSelected);
    const explanation = generateExplanation(primary_concern, secondary_concern, state.lifestyle_type);

    const result: AssessmentResult = {
      primary_concern,
      secondary_concern,
      recommended_product,
      product_url: "https://gutandbeyond.com",
      lifestyle_type: state.lifestyle_type,
      primary_goal: state.primary_goal,
      scores: state.scores,
      explanation
    };

    setResultData(result);
  }, [state, router]);

  if (!resultData) {
    return <div className="min-h-screen bg-surface flex items-center justify-center">Loading...</div>;
  }

  const name = state.leadData ? state.leadData.full_name.split(" ")[0] : "Guest";
  const email = state.leadData ? state.leadData.email : "your@email.com";
  const emailConsent = state.leadData ? state.leadData.email_consent : false;

  return (
    <div className="min-h-screen bg-surface">
      <ResultsProfile 
        name={name} 
        email={email} 
        emailConsent={emailConsent} 
        result={resultData} 
      />
    </div>
  );
}
