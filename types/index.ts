export interface QuizAnswer {
  questionId: number;
  selectedOption: string;
}

export interface ScoreBuckets {
  gut: number;
  ibs: number;
  stress: number;
  sleep: number;
  energy: number;
  eye: number;
  recovery: number;
  omega: number;
  general: number;
  uti: number;
}

export type ConcernType = 
  | 'GUT' | 'IBS' | 'STRESS' | 'SLEEP' | 'ENERGY' 
  | 'EYE' | 'RECOVERY' | 'OMEGA' | 'GENERAL' | 'UTI';

export type LifestyleType = 
  | 'Student' 
  | 'Office Professional' 
  | 'Entrepreneur / Business Owner' 
  | 'Fitness Enthusiast' 
  | 'Frequent Traveler' 
  | 'Homemaker';

export type AgeGroup = '18-24' | '25-34' | '35-44' | '45-54' | '55+';
export type Gender = 'Male' | 'Female' | 'Prefer not to say';

export interface LeadFormData {
  full_name: string;
  email: string;
  phone: string;
  age_group: AgeGroup;
  gender: Gender;
  email_consent: boolean;
}

export interface QuizState {
  answers: QuizAnswer[];
  scores: ScoreBuckets;
  lifestyle_type: LifestyleType | null;
  primary_goal: string | null;
  custom_message: string;
  current_question: number;
  phase: 'welcome' | 'questions' | 'message' | 'lead_capture' | 'processing' | 'results';
  genderSelected: Gender | null; // For early gender capture
  leadData: LeadFormData | null; // To store lead data for the results page
}

export interface AssessmentResult {
  primary_concern: ConcernType;
  secondary_concern: ConcernType;
  recommended_product: string;
  product_url: string;
  lifestyle_type: LifestyleType | null;
  primary_goal: string | null;
  scores: ScoreBuckets;
  explanation: string;
}

export interface Lead extends LeadFormData {
  id: string;
  lifestyle_type: LifestyleType | null;
  primary_goal: string | null;
  scores: ScoreBuckets;
  primary_concern: ConcernType;
  secondary_concern: ConcernType;
  recommended_product: string;
  custom_message: string;
  source: string;
  submitted_at: string;
}
