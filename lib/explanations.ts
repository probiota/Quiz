import { ConcernType, LifestyleType } from '../types';

interface ExplanationTemplate {
  base: string;
  lifestyle: Record<string, string> & { default: string };
  secondary: Record<string, string> & { default: string };
}

export const explanations: Record<ConcernType, ExplanationTemplate> = {
  STRESS: {
    base: "Your responses suggest that chronic stress may be the biggest factor affecting your daily wellbeing.",
    lifestyle: {
      "Entrepreneur / Business Owner": "Running your own business creates unique pressure that your body carries as physical tension.",
      "Office Professional": "Long hours and professional demands are placing a consistent load on your nervous system.",
      "Student": "Academic pressure and screen time are creating a stress cycle that affects both your focus and your rest.",
      "default": "The pattern in your answers points to stress as a central theme in your wellness picture."
    },
    secondary: {
      "SLEEP": "This stress is likely spilling into your sleep, creating a cycle where rest doesn't fully restore you.",
      "ENERGY": "The cortisol load from ongoing stress is quietly draining your energy reserves throughout the day.",
      "GUT": "Stress and gut health are deeply connected — your digestive discomfort may be a downstream effect.",
      "default": "Managing your stress response is likely to create positive ripple effects across your overall health."
    }
  },
  GUT: {
    base: "Your answers highlight digestive health as the primary area needing support in your wellness routine.",
    lifestyle: {
      "Frequent Traveler": "Irregular eating schedules and travel stress often throw the digestive microbiome out of balance.",
      "Office Professional": "Prolonged sitting and hurried meals can slow digestion and increase discomfort.",
      "default": "A balanced gut microbiome is foundational for everything from immunity to daily comfort."
    },
    secondary: {
      "STRESS": "The gut-brain axis is highly sensitive; your digestive issues may be strongly tied to your stress levels.",
      "ENERGY": "Poor nutrient absorption due to gut imbalance often leads to mid-day energy crashes.",
      "default": "Focusing on your gut health will likely improve how you feel throughout the entire day."
    }
  },
  SLEEP: {
    base: "Your profile indicates that sleep quality and restoration should be your top wellness priority.",
    lifestyle: {
      "Student": "Irregular sleep patterns and late-night studying are likely disrupting your natural circadian rhythm.",
      "Entrepreneur / Business Owner": "Difficulty switching off is preventing you from reaching the deep, restorative stages of sleep.",
      "default": "Quality sleep is the body's primary recovery mechanism, and your answers show it needs support."
    },
    secondary: {
      "STRESS": "Elevated evening stress is making it hard for your body to transition into a restful state.",
      "ENERGY": "Your ongoing fatigue is a direct result of not getting enough deep, restorative rest.",
      "default": "Optimizing your sleep architecture will have a profound impact on your daily performance."
    }
  },
  ENERGY: {
    base: "Your responses show a pattern of fatigue and low stamina throughout the day.",
    lifestyle: {
      "Office Professional": "The mid-afternoon slump is a common sign of metabolic energy depletion from desk work.",
      "Fitness Enthusiast": "Your active lifestyle demands more cellular energy than your body is currently sustaining.",
      "default": "Consistent, stable energy is key to feeling like your best self, and you are currently running on empty."
    },
    secondary: {
      "SLEEP": "Without deep recovery at night, your daytime energy levels simply cannot bounce back.",
      "STRESS": "The continuous low-grade stress response is quietly draining your metabolic reserves.",
      "default": "Nourishing your body at a cellular level will help smooth out these daily energy crashes."
    }
  },
  EYE: {
    base: "Your profile highlights digital eye strain and vision fatigue as a major area of concern.",
    lifestyle: {
      "Student": "Heavy reading and prolonged screen time are putting significant stress on your ocular health.",
      "Office Professional": "Staring at monitors all day is reducing your blink rate and causing cumulative visual fatigue.",
      "default": "Your eyes are working overtime, leading to discomfort that affects your overall focus."
    },
    secondary: {
      "STRESS": "Eye strain is often accompanied by tension headaches and heightened sensory stress.",
      "ENERGY": "Visual fatigue can actually trick your brain into feeling generally exhausted.",
      "default": "Targeted support for your ocular health will help you maintain focus longer with less discomfort."
    }
  },
  RECOVERY: {
    base: "Your answers indicate that joint discomfort and physical recovery are your primary wellness barriers.",
    lifestyle: {
      "Fitness Enthusiast": "Intense training requires adequate nutritional support to manage exercise-induced inflammation.",
      "Office Professional": "Prolonged sitting can lead to joint stiffness and poor musculoskeletal recovery.",
      "default": "Your body is struggling to repair and recover efficiently from daily physical demands."
    },
    secondary: {
      "SLEEP": "Discomfort may be subtly disrupting your sleep, preventing optimal physical repair.",
      "STRESS": "Physical tension and discomfort are often heightened by systemic stress.",
      "default": "Supporting a healthy inflammatory response will help you move more freely and comfortably."
    }
  },
  OMEGA: {
    base: "Your profile suggests you could benefit significantly from support for heart and cognitive health.",
    lifestyle: {
      "Entrepreneur / Business Owner": "High-stakes decision-making demands optimal cognitive function and brain health.",
      "Student": "Maintaining focus and mental clarity is critical, and your answers suggest room for improvement.",
      "default": "Essential fatty acids play a crucial role in maintaining cardiovascular and brain wellness."
    },
    secondary: {
      "ENERGY": "Brain fog and mental fatigue are often linked to a need for better cognitive nutrition.",
      "STRESS": "A healthy nervous system requires specific nutritional building blocks to handle stress.",
      "default": "Providing your body with essential lipids will support long-term vitality and focus."
    }
  },
  GENERAL: {
    base: "Your responses indicate a need for comprehensive, foundational nutritional support.",
    lifestyle: {
      "Homemaker": "Taking care of others often means your own nutritional foundation gets overlooked.",
      "Frequent Traveler": "Life on the go makes it difficult to get a complete spectrum of daily nutrients.",
      "default": "A strong nutritional baseline is the first step toward feeling vibrant and resilient."
    },
    secondary: {
      "ENERGY": "Gaps in your daily nutrition are likely contributing to moments of fatigue.",
      "STRESS": "When your body lacks foundational nutrients, it is less equipped to handle daily pressures.",
      "default": "A broad-spectrum approach will help fill in the gaps and elevate your daily wellness baseline."
    }
  },
  IBS: {
    base: "Your profile strongly indicates that managing severe digestive discomfort should be your top priority.",
    lifestyle: {
      "Office Professional": "Stressful work environments can frequently trigger and exacerbate gut sensitivities.",
      "default": "Frequent digestive distress requires specialized, targeted support to restore balance."
    },
    secondary: {
      "STRESS": "The gut is highly reactive to stress, which is likely amplifying your digestive symptoms.",
      "ENERGY": "Chronic digestive issues require a lot of energy to manage, leaving you feeling depleted.",
      "default": "Addressing the root of this discomfort will significantly improve your quality of life."
    }
  },
  UTI: {
    base: "Your answers highlight recurring urinary tract discomfort as a primary concern needing immediate support.",
    lifestyle: {
      "default": "Urinary tract health is vital for daily comfort and peace of mind."
    },
    secondary: {
      "STRESS": "Recurring physical discomfort can be a significant source of ongoing mental stress.",
      "default": "Targeted support for a healthy urinary tract environment will help you regain confidence and comfort."
    }
  }
};

export function generateExplanation(
  primary: ConcernType, 
  secondary: ConcernType, 
  lifestyle: LifestyleType | null
): string {
  const template = explanations[primary] || explanations.GENERAL;
  const base = template.base;
  const lifestyleText = lifestyle && template.lifestyle[lifestyle] 
    ? template.lifestyle[lifestyle] 
    : template.lifestyle.default;
  
  const secondaryText = template.secondary[secondary] || template.secondary.default;
  
  return `${base} ${lifestyleText} ${secondaryText}`;
}
