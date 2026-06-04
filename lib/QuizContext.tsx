"use client";

import React, { createContext, useContext, useReducer, ReactNode } from "react";
import { QuizState, QuizAnswer, ConcernType, LifestyleType, Gender } from "../types";
import { calculateScores } from "./scoring";

type Action =
  | { type: "ANSWER_QUESTION"; payload: QuizAnswer }
  | { type: "SET_GENDER"; payload: Gender }
  | { type: "SET_LIFESTYLE"; payload: LifestyleType }
  | { type: "SET_GOAL"; payload: string }
  | { type: "SET_PHASE"; payload: QuizState["phase"] }
  | { type: "SET_CUSTOM_MESSAGE"; payload: string }
  | { type: "SET_LEAD_DATA"; payload: QuizState["leadData"] }
  | { type: "GO_BACK" }
  | { type: "RESET_QUIZ" };

const initialState: QuizState = {
  answers: [],
  scores: {
    gut: 0, ibs: 0, stress: 0, sleep: 0, energy: 0,
    eye: 0, recovery: 0, omega: 0, general: 0, uti: 0
  },
  lifestyle_type: null,
  primary_goal: null,
  custom_message: "",
  current_question: 1,
  phase: "welcome",
  genderSelected: null,
  leadData: null
};

function quizReducer(state: QuizState, action: Action): QuizState {
  switch (action.type) {
    case "ANSWER_QUESTION": {
      const existingAnswerIndex = state.answers.findIndex(
        (a) => a.questionId === action.payload.questionId
      );
      
      let newAnswers = [...state.answers];
      if (existingAnswerIndex !== -1) {
        newAnswers[existingAnswerIndex] = action.payload;
      } else {
        newAnswers.push(action.payload);
      }

      return {
        ...state,
        answers: newAnswers,
        scores: calculateScores(newAnswers),
        current_question: state.current_question + 1
      };
    }
    case "SET_GENDER":
      return { ...state, genderSelected: action.payload };
    case "SET_LIFESTYLE":
      return { ...state, lifestyle_type: action.payload };
    case "SET_GOAL":
      return { ...state, primary_goal: action.payload };
    case "SET_PHASE":
      return { ...state, phase: action.payload };
    case "SET_CUSTOM_MESSAGE":
      return { ...state, custom_message: action.payload };
    case "SET_LEAD_DATA":
      return { ...state, leadData: action.payload };
    case "GO_BACK":
      return {
        ...state,
        current_question: Math.max(1, state.current_question - 1)
      };
    case "RESET_QUIZ":
      return initialState;
    default:
      return state;
  }
}

const QuizContext = createContext<{
  state: QuizState;
  dispatch: React.Dispatch<Action>;
} | null>(null);

export function QuizProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(quizReducer, initialState);

  return (
    <QuizContext.Provider value={{ state, dispatch }}>
      {children}
    </QuizContext.Provider>
  );
}

export function useQuiz() {
  const context = useContext(QuizContext);
  if (!context) {
    throw new Error("useQuiz must be used within a QuizProvider");
  }
  return context;
}
