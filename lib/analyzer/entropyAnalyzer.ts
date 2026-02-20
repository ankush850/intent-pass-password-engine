import { EntropyAnalysis } from './types';
import { THRESHOLDS } from './constants';

function detectRepetition(password: string): { hasRepetition: boolean; patterns: string[] } {
  const patterns: string[] = [];
  const maxAllowed = THRESHOLDS.maxConsecutiveRepetition;

  for (let i = 0; i < password.length; i++) {
    let consecutiveCount = 1;

    while (i + consecutiveCount < password.length && password[i] === password[i + consecutiveCount]) {
      consecutiveCount++;
    }

    if (consecutiveCount > maxAllowed) {
      patterns.push(`${password[i].repeat(consecutiveCount)} (${consecutiveCount}x)`);
      i += consecutiveCount - 1;
    }
  }

  return {
    hasRepetition: patterns.length > 0,
    patterns,
  };
}

function analyzeCharacterClassDistribution(password: string): {
  uppercase: number;
  lowercase: number;
  digits: number;
  symbols: number;
} {
  let uppercase = 0;
  let lowercase = 0;
  let digits = 0;
  let symbols = 0;

  for (const char of password) {
    if (/[A-Z]/.test(char)) uppercase++;
    else if (/[a-z]/.test(char)) lowercase++;
    else if (/[0-9]/.test(char)) digits++;
    else symbols++;
  }

  return { uppercase, lowercase, digits, symbols };
}

function calculateBalanceScore(distribution: { uppercase: number; lowercase: number; digits: number; symbols: number }): number {
  const total = distribution.uppercase + distribution.lowercase + distribution.digits + distribution.symbols;
  if (total === 0) return 0;

  // Calculate entropy of character class distribution
  let entropy = 0;
  const classes = [distribution.uppercase, distribution.lowercase, distribution.digits, distribution.symbols];

  for (const count of classes) {
    if (count > 0) {
      const probability = count / total;
      entropy -= probability * Math.log2(probability);
    }
  }

  // Normalize to 0-1 (max entropy is log2(4) = 2)
  return entropy / 2;
}

function calculateEntropyValue(password: string): number {
  const freq: Record<string, number> = {};

  for (const char of password) {
    freq[char] = (freq[char] || 0) + 1;
  }

  let entropy = 0;
  const len = password.length;

  for (const count of Object.values(freq)) {
    const probability = count / len;
    entropy -= probability * Math.log2(probability);
  }

  // Normalize to 0-1 based on theoretical max (log2(len))
  const maxEntropy = Math.log2(Math.min(password.length, 94)); // ~94 printable ASCII characters
  return entropy / maxEntropy;
}

export function analyzeEntropy(password: string): EntropyAnalysis {
  const repetition = detectRepetition(password);
  const distribution = analyzeCharacterClassDistribution(password);
  const balanceScore = calculateBalanceScore(distribution);
  const entropyValue = calculateEntropyValue(password);

  return {
    hasConsecutiveRepetition: repetition.hasRepetition,
    repetitionPatterns: repetition.patterns,
    characterClassDistribution: distribution,
    balanceScore,
    entropyValue,
  };
}
