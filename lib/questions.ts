export const questions = [
  {
    id: 1,
    text: "What is your primary health and wellness goal right now?",
    options: [
      { text: "Better Digestion", scores: { gut: 5 }, goalTag: "Better Digestion" },
      { text: "Less Stress & Anxiety", scores: { stress: 5 }, goalTag: "Less Stress" },
      { text: "Better Sleep & Recovery", scores: { sleep: 5, recovery: 3 }, goalTag: "Better Sleep" },
      { text: "More Energy & Focus", scores: { energy: 5, omega: 2 }, goalTag: "More Energy" },
      { text: "Weight Management", scores: { general: 5 }, goalTag: "Weight Management" },
      { text: "Muscle & Joint Support", scores: { recovery: 5 }, goalTag: "Muscle Gain" }
    ]
  },
  {
    id: 2,
    text: "Which of these do you struggle with the most on a daily basis?",
    options: [
      { text: "Frequent Bloating or Discomfort after meals", scores: { gut: 3, ibs: 3 } },
      { text: "Brain Fog or Poor Focus", scores: { omega: 3, energy: 2 } },
      { text: "Exhaustion and Low Energy", scores: { energy: 4 } },
      { text: "Eye Strain from Screens", scores: { eye: 4 } },
      { text: "Joint Discomfort or Slow Recovery", scores: { recovery: 4 } },
      { text: "Difficulty Switching Off or Poor Sleep", scores: { sleep: 3, stress: 2 } }
    ]
  },
  {
    id: 3,
    text: "Which best describes you?",
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
    id: 4,
    text: "How often do you experience digestive discomfort or bloating?",
    options: [
      { text: "Rarely or Never", scores: {} },
      { text: "Occasionally", scores: { gut: 2 } },
      { text: "Frequently", scores: { gut: 3, ibs: 2 } },
      { text: "Almost every time I eat", scores: { gut: 4, ibs: 4 } }
    ]
  },
  {
    id: 5,
    text: "How do you usually feel when waking up and throughout the day?",
    options: [
      { text: "Refreshed and calm", scores: {} },
      { text: "Tired in the mornings but fine later", scores: { sleep: 2, energy: 1 } },
      { text: "Frequent energy crashes and occasional stress", scores: { energy: 3, stress: 2 } },
      { text: "Exhausted and stressed almost every day", scores: { sleep: 3, stress: 4, energy: 2 } }
    ]
  }
];
