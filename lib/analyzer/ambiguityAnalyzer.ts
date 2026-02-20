import { AmbiguityAnalysis } from './types';
import { CONFUSABLE_CHARS } from './constants';

export function analyzeAmbiguity(password: string): AmbiguityAnalysis {
  let confusableCount = 0;
  const ambiguousChars = new Set<string>();

  for (const char of password) {
    if (char in CONFUSABLE_CHARS) {
      confusableCount++;
      ambiguousChars.add(char);
    }
  }

  const totalAmbiguousChars = ambiguousChars.size;
  const ambiguityRatio = password.length > 0 ? confusableCount / password.length : 0;

  // Ambiguity score: normalized ratio (0-1)
  const ambiguityScore = Math.min(ambiguityRatio, 1.0);

  return {
    confusableCount,
    totalAmbiguousChars,
    ambiguityRatio,
    ambiguityScore,
  };
}
