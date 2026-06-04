import { QuizAnswer, ScoreBuckets, ConcernType, Gender } from '../types';
import { questions, utiQuestion } from './questions';

export function calculateScores(answers: QuizAnswer[]): ScoreBuckets {
  const scores: ScoreBuckets = {
    gut: 0, ibs: 0, stress: 0, sleep: 0, energy: 0,
    eye: 0, recovery: 0, omega: 0, general: 0, uti: 0
  };

  const allQuestions = [...questions, utiQuestion];

  answers.forEach((answer) => {
    const question = allQuestions.find((q) => q.id === answer.questionId);
    if (!question) return;

    const option = question.options.find((o) => o.text === answer.selectedOption);
    if (!option) return;

    Object.entries(option.scores).forEach(([bucket, value]) => {
      scores[bucket as keyof ScoreBuckets] += value as number;
    });
  });

  return scores;
}

export function getDerivedFields(scores: ScoreBuckets): { primary_concern: ConcernType, secondary_concern: ConcernType } {
  const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  return {
    primary_concern: sorted[0][0].toUpperCase() as ConcernType,
    secondary_concern: sorted[1][0].toUpperCase() as ConcernType
  };
}

export function getRecommendation(scores: ScoreBuckets, gender: Gender | null): string {
  // Hard Rules
  if (gender === 'Female' && scores.uti >= 4) return 'UTI Relief';
  if (scores.ibs >= 7) return 'IBS Relief';

  // Highest Score Wins with Tiebreaker
  const tiebreakerOrder: (keyof ScoreBuckets)[] = [
    'uti', 'ibs', 'gut', 'stress', 'sleep', 'eye', 'recovery', 'omega', 'energy', 'general'
  ];

  let highestScore = -1;
  let winningBucket: keyof ScoreBuckets = 'general';

  Object.entries(scores).forEach(([key, score]) => {
    const bucket = key as keyof ScoreBuckets;
    if (score > highestScore) {
      highestScore = score;
      winningBucket = bucket;
    } else if (score === highestScore) {
      if (tiebreakerOrder.indexOf(bucket) < tiebreakerOrder.indexOf(winningBucket)) {
        winningBucket = bucket;
      }
    }
  });

  const recommendationMap: Record<keyof ScoreBuckets, string> = {
    gut: 'Gut Health+',
    stress: 'Ashwagandha Gummies',
    sleep: 'Magnesium Gummies',
    energy: 'Moringa Gummies',
    eye: 'Eye Essentials Gummies',
    recovery: 'Curcumin Gummies',
    omega: 'Omega 3 Gummies',
    general: 'All In One Gummies',
    uti: 'UTI Relief',
    ibs: 'IBS Relief'
  };

  return recommendationMap[winningBucket] || 'All In One Gummies';
}
