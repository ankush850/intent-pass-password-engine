import { PredictabilityAnalysis } from './types';
import { WEAK_SUBSTRINGS, KEYBOARD_PATTERNS, THRESHOLDS, KEYBOARD_LAYOUT } from './constants';

function detectAlphabeticalSequences(password: string): string[] {
  const sequences: string[] = [];
  const minLength = THRESHOLDS.minSequenceLength;

  for (let i = 0; i < password.length - minLength + 1; i++) {
    let isSequence = true;
    const firstChar = password.charCodeAt(i);

    for (let j = i + 1; j < i + minLength; j++) {
      const currentChar = password.charCodeAt(j);
      if (currentChar !== firstChar + (j - i)) {
        isSequence = false;
        break;
      }
    }

    if (isSequence) {
      sequences.push(password.substring(i, i + minLength));
    }
  }

  return sequences;
}

function detectNumericSequences(password: string): string[] {
  const sequences: string[] = [];
  const minLength = THRESHOLDS.minSequenceLength;

  for (let i = 0; i < password.length - minLength + 1; i++) {
    let isSequence = true;
    const firstDigit = parseInt(password[i]);

    if (isNaN(firstDigit)) continue;

    for (let j = i + 1; j < i + minLength; j++) {
      const currentDigit = parseInt(password[j]);
      if (isNaN(currentDigit) || currentDigit !== firstDigit + (j - i)) {
        isSequence = false;
        break;
      }
    }

    if (isSequence) {
      sequences.push(password.substring(i, i + minLength));
    }
  }

  return sequences;
}

function detectKeyboardPatterns(password: string): string[] {
  const patterns: string[] = [];
  const minLength = THRESHOLDS.minKeyboardPatternLength;
  const lower = password.toLowerCase();

  // Check all keyboard patterns
  for (const patternList of Object.values(KEYBOARD_PATTERNS)) {
    for (const pattern of patternList) {
      if (lower.includes(pattern) && pattern.length >= minLength) {
        patterns.push(pattern);
      }
    }
  }

  // Also check for custom keyboard walks using adjacency
  for (let i = 0; i < lower.length - minLength + 1; i++) {
    let isWalk = true;
    const firstChar = lower[i];

    if (!(firstChar in KEYBOARD_LAYOUT)) continue;

    const adjacentChars = KEYBOARD_LAYOUT[firstChar as keyof typeof KEYBOARD_LAYOUT];

    for (let j = i + 1; j < i + minLength; j++) {
      if (!adjacentChars.includes(lower[j])) {
        isWalk = false;
        break;
      }
    }

    if (isWalk && minLength >= 3) {
      patterns.push(lower.substring(i, i + minLength));
    }
  }

  return [...new Set(patterns)];
}

function detectWeakSubstrings(password: string): string[] {
  const weakFound: string[] = [];
  const minLength = THRESHOLDS.minWeakSubstringLength;
  const lower = password.toLowerCase();

  for (const weak of WEAK_SUBSTRINGS) {
    if (weak.length >= minLength && lower.includes(weak)) {
      weakFound.push(weak);
    }
  }

  return weakFound;
}

export function analyzePredictability(password: string): PredictabilityAnalysis {
  const alphabeticalSequences = detectAlphabeticalSequences(password);
  const numericSequences = detectNumericSequences(password);
  const keyboardPatterns = detectKeyboardPatterns(password);
  const weakSubstrings = detectWeakSubstrings(password);

  const hasAlphabeticalSequence = alphabeticalSequences.length > 0;
  const hasNumericSequence = numericSequences.length > 0;
  const hasKeyboardPattern = keyboardPatterns.length > 0;
  const hasWeakSubstring = weakSubstrings.length > 0;

  // Calculate predictability score (0-1)
  let predictabilityScore = 0;
  if (hasAlphabeticalSequence) predictabilityScore += 0.25;
  if (hasNumericSequence) predictabilityScore += 0.25;
  if (hasKeyboardPattern) predictabilityScore += 0.25;
  if (hasWeakSubstring) predictabilityScore += 0.25;

  return {
    hasAlphabeticalSequence,
    alphabeticalSequences,
    hasNumericSequence,
    numericSequences,
    hasKeyboardPattern,
    keyboardPatterns,
    hasWeakSubstring,
    weakSubstrings,
    predictabilityScore: Math.min(predictabilityScore, 1.0),
  };
}
