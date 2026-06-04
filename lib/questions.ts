export const questions = [
  {
    id: 1,
    text: "What would make the biggest difference in your life right now?",
    options: [
      { text: "Better digestion", scores: { gut: 3 } },
      { text: "Less stress", scores: { stress: 3 } },
      { text: "Better sleep", scores: { sleep: 3 } },
      { text: "More energy", scores: { energy: 3 } },
      { text: "Better focus", scores: { omega: 2, eye: 1 } },
      { text: "Less joint discomfort", scores: { recovery: 3 } },
      { text: "Better overall health", scores: { general: 3 } }
    ]
  },
  {
    id: 2,
    text: "How do you usually feel when you wake up?",
    options: [
      { text: "Refreshed and energetic", scores: {} },
      { text: "Slightly tired", scores: { energy: 1 } },
      { text: "Tired most mornings", scores: { energy: 2, sleep: 1 } },
      { text: "Exhausted even after sleep", scores: { energy: 3, sleep: 2 } }
    ]
  },
  {
    id: 3,
    text: "Which situation sounds most like you?",
    options: [
      { text: "I often feel bloated after meals", scores: { gut: 3, ibs: 2 } },
      { text: "I feel stressed even on normal days", scores: { stress: 3 } },
      { text: "I struggle to switch off at night", scores: { sleep: 3, stress: 2 } },
      { text: "I hit an energy crash during the day", scores: { energy: 3 } },
      { text: "My eyes feel strained after screens", scores: { eye: 3 } },
      { text: "My joints feel stiff or uncomfortable", scores: { recovery: 3 } }
    ]
  },
  {
    id: 4,
    text: "How many hours do you spend looking at screens daily?",
    options: [
      { text: "Less than 2 hours", scores: {} },
      { text: "2-4 hours", scores: { eye: 1 } },
      { text: "4-8 hours", scores: { eye: 2 } },
      { text: "8+ hours", scores: { eye: 3 } }
    ]
  },
  {
    id: 5,
    text: "Which best describes your lifestyle?",
    options: [
      { text: "Student", scores: { eye: 1, stress: 1 }, lifestyleTag: "Student" },
      { text: "Office Professional", scores: { eye: 2, stress: 1 }, lifestyleTag: "Office Professional" },
      { text: "Entrepreneur / Business Owner", scores: { stress: 3 }, lifestyleTag: "Entrepreneur / Business Owner" },
      { text: "Fitness Enthusiast", scores: { recovery: 2, omega: 1 }, lifestyleTag: "Fitness Enthusiast" },
      { text: "Frequent Traveler", scores: { gut: 2, energy: 1 }, lifestyleTag: "Frequent Traveler" },
      { text: "Homemaker", scores: { general: 1 }, lifestyleTag: "Homemaker" }
    ]
  },
  {
    id: 6,
    text: "How often do you feel stressed or overwhelmed?",
    options: [
      { text: "Rarely", scores: {} },
      { text: "Sometimes", scores: { stress: 1 } },
      { text: "Often", scores: { stress: 2 } },
      { text: "Almost every day", scores: { stress: 3 } }
    ]
  },
  {
    id: 7,
    text: "How often do you experience digestive discomfort after meals?",
    options: [
      { text: "Never", scores: {} },
      { text: "Occasionally", scores: { gut: 1 } },
      { text: "Frequently", scores: { gut: 2, ibs: 1 } },
      { text: "Almost daily", scores: { gut: 3, ibs: 3 } }
    ]
  },
  {
    id: 8,
    text: "Which best describes your diet?",
    options: [
      { text: "Very balanced", scores: {} },
      { text: "Mostly balanced", scores: { general: 1 } },
      { text: "Could be better", scores: { general: 2, energy: 1 } },
      { text: "I frequently skip meals or eat on the go", scores: { energy: 3, general: 2 } }
    ]
  },
  {
    id: 9,
    text: "What is your primary health or fitness goal?",
    options: [
      { text: "Weight Management", scores: { general: 5 }, goalTag: "Weight Management" },
      { text: "Muscle Gain", scores: { recovery: 5 }, goalTag: "Muscle Gain" },
      { text: "Better Recovery", scores: { recovery: 6 }, goalTag: "Better Recovery" },
      { text: "Better Heart Health", scores: { omega: 6 }, goalTag: "Better Heart Health" },
      { text: "Better Digestion", scores: { gut: 5 }, goalTag: "Better Digestion" },
      { text: "Better Sleep", scores: { sleep: 6 }, goalTag: "Better Sleep" },
      { text: "Better Overall Wellness", scores: { general: 5 }, goalTag: "Better Overall Wellness" }
    ]
  },
  {
    id: 10,
    text: "Which of these do you experience most often?",
    options: [
      { text: "Brain Fog", scores: { omega: 2, energy: 1 } },
      { text: "Low Energy", scores: { energy: 3 } },
      { text: "Poor Sleep", scores: { sleep: 3 } },
      { text: "Bloating", scores: { gut: 3, ibs: 2 } },
      { text: "Eye Strain", scores: { eye: 3 } },
      { text: "Joint Discomfort", scores: { recovery: 3 } },
      { text: "Frequent Stress", scores: { stress: 3 } }
    ]
  }
];

export const utiQuestion = {
  id: 11,
  text: "Have you experienced urinary discomfort or recurring UTI concerns in the past year?",
  options: [
    { text: "Never", scores: {} },
    { text: "Once", scores: { uti: 1 } },
    { text: "Occasionally", scores: { uti: 2 } },
    { text: "Frequently", scores: { uti: 4 } }
  ]
};
