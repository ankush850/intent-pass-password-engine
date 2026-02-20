import { RandomSmashAnalysis } from './types';
import { VOWELS, CONSONANTS, THRESHOLDS, KEYBOARD_LAYOUT } from './constants';

function calculateVowelToConsonantRatio(password: string): number {
  let vowelCount = 0;
  let consonantCount = 0;

  for (const char of password) {
    if (VOWELS.has(char)) vowelCount++;
    else if (CONSONANTS.has(char)) consonantCount++;
  }

  const total = vowelCount + consonantCount;
  if (total === 0) return 0.5;

  return vowelCount / total;
}

function calculatePronouncability(password: string): number {
  // A pronounceable password alternates between vowels and consonants somewhat
  let alternations = 0;
  let letterCount = 0;
  let isVowel = false;

  for (const char of password) {
    if (VOWELS.has(char)) {
      if (letterCount > 0 && !isVowel) alternations++;
      isVowel = true;
      letterCount++;
    } else if (CONSONANTS.has(char)) {
      if (letterCount > 0 && isVowel) alternations++;
      isVowel = false;
      letterCount++;
    }
  }

  // Pronounceability score based on alternation rate
  if (letterCount === 0) return 0.5;
  const alternationRate = alternations / letterCount;
  return Math.min(alternationRate, 1.0);
}

function calculateAdjacencyRandomness(password: string): number {
  // Check how many characters are adjacent on keyboard
  const lower = password.toLowerCase();
  let adjacentPairs = 0;
  let totalPairs = 0;

  for (let i = 0; i < lower.length - 1; i++) {
    const char = lower[i];
    const nextChar = lower[i + 1];

    if (char in KEYBOARD_LAYOUT && /[a-z0-9]/.test(char) && /[a-z0-9]/.test(nextChar)) {
      totalPairs++;
      const adjacentChars = KEYBOARD_LAYOUT[char as keyof typeof KEYBOARD_LAYOUT];
      if (adjacentChars.includes(nextChar)) {
        adjacentPairs++;
      }
    }
  }

  if (totalPairs === 0) return 0.5;
  // Higher value = more adjacent = less random
  return adjacentPairs / totalPairs;
}

export function analyzeRandomSmash(password: string): RandomSmashAnalysis {
  const vowelToConsonantRatio = calculateVowelToConsonantRatio(password);
  const pronounceability = calculatePronouncability(password);
  const adjacencyRandomness = calculateAdjacencyRandomness(password);

  // Detect random smash: unusual vowel ratio, low pronounceability, no patterns
  const isRandomSmash =
    (vowelToConsonantRatio < THRESHOLDS.vowelRatioLow ||
      vowelToConsonantRatio > THRESHOLDS.vowelRatioHigh) &&
    pronounceability < THRESHOLDS.pronounceabilityThreshold;

  // Calculate random smash score (0-1)
  // Lower pronounceability and unusual vowel ratio increase the score
  const vowelPenalty = Math.abs(vowelToConsonantRatio - 0.4); // Neutral is ~0.4
  const pronounceabilityPenalty = 1 - pronounceability;
  const randomSmashScore = (vowelPenalty + pronounceabilityPenalty) / 2;

  return {
    vowelToConsonantRatio,
    pronounceability,
    adjacencyRandomness,
    isRandomSmash,
    randomSmashScore: Math.min(randomSmashScore, 1.0),
  };
}
