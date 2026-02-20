import { PasswordAnalysisResult } from './types';

export interface AttackScenario {
  name: string;
  description: string;
  resistancePercentage: number;
  estimatedTime: string;
  timeInSeconds: number;
  explanation: string;
}

export interface AdversarialAnalysis {
  dictionaryAttack: AttackScenario;
  bruteForce: AttackScenario;
  keyboardWalkAttack: AttackScenario;
  frequencyAnalysis: AttackScenario;
  markovChain: AttackScenario;
  overallResistance: number;
}

const ATTEMPTS_PER_SECOND = 1_000_000_000; // 1 billion attempts per second

export function analyzeAdversarial(password: string, analysis: PasswordAnalysisResult): AdversarialAnalysis {
  const length = password.length;
  const entropy = analysis.entropy.entropyValue;
  
  // Dictionary Attack Resistance
  const dictionaryResistance = calculateDictionaryResistance(password, analysis);
  const dictionaryTime = estimateTime(dictionaryResistance, 50000); // ~50k common passwords

  // Brute Force Attack (assumes attacker knows character set)
  const charsetSize = estimateCharsetSize(password);
  const bruteForcePossibilities = Math.pow(charsetSize, length);
  const bruteForceResistance = Math.min(99, (entropy / 128) * 100);
  const bruteForceTime = estimateTime(bruteForcePossibilities, ATTEMPTS_PER_SECOND);

  // Keyboard Walk Attack Resistance
  const keyboardWalkCount = analysis.predictability.keyboardPatterns.length;
  const keyboardWalkResistance = Math.max(20, 100 - keyboardWalkCount * 15);

  // Frequency Analysis Resistance
  const frequencyResistance = calculateFrequencyAnalysisResistance(password);

  // Markov Chain Resistance (predictability from sequences)
  const sequenceCount = analysis.predictability.alphabeticalSequences.length + analysis.predictability.numericSequences.length;
  const markovResistance = Math.max(15, 100 - sequenceCount * 20);

  // Overall resistance is the minimum (weakest link in the chain)
  const overallResistance = Math.min(
    dictionaryResistance,
    bruteForceResistance,
    keyboardWalkResistance,
    frequencyResistance,
    markovResistance
  );

  return {
    dictionaryAttack: {
      name: 'Dictionary Attack',
      description: 'Testing against common passwords and word lists',
      resistancePercentage: dictionaryResistance,
      estimatedTime: dictionaryTime.time,
      timeInSeconds: dictionaryTime.seconds,
      explanation: `Your password has ${dictionaryResistance}% resistance to dictionary attacks. ${
        dictionaryResistance > 80
          ? 'Strong resistance from non-dictionary words.'
          : 'Contains dictionary words or common patterns.'
      }`,
    },
    bruteForce: {
      name: 'Brute Force Attack',
      description: 'Testing every possible character combination',
      resistancePercentage: bruteForceResistance,
      estimatedTime: bruteForceTime.time,
      timeInSeconds: bruteForceTime.seconds,
      explanation: `Estimated ${bruteForceTime.time} to crack by brute force with 1B attempts/second. Length (${length}) and character set diversity contribute to this resistance.`,
    },
    keyboardWalkAttack: {
      name: 'Keyboard Walk Attack',
      description: 'Testing adjacent key patterns (qwerty, asdf, etc.)',
      resistancePercentage: keyboardWalkResistance,
      estimatedTime: estimateTime(5000, ATTEMPTS_PER_SECOND).time,
      timeInSeconds: estimateTime(5000, ATTEMPTS_PER_SECOND).seconds,
      explanation: `Your password has ${keyboardWalkResistance}% resistance to keyboard walk attacks. ${
        keyboardWalkCount > 0 ? `Contains ${keyboardWalkCount} potential walks.` : 'No obvious keyboard walks detected.'
      }`,
    },
    frequencyAnalysis: {
      name: 'Frequency Analysis',
      description: 'Testing based on character frequency patterns',
      resistancePercentage: frequencyResistance,
      estimatedTime: 'Variable',
      timeInSeconds: 0,
      explanation: `Your password has ${frequencyResistance}% resistance to frequency analysis. ${
        frequencyResistance > 70 ? 'Good character distribution.' : 'Some characters dominate the password.'
      }`,
    },
    markovChain: {
      name: 'Markov Chain Attack',
      description: 'Testing predictive patterns and sequences',
      resistancePercentage: markovResistance,
      estimatedTime: estimateTime(50000, ATTEMPTS_PER_SECOND).time,
      timeInSeconds: estimateTime(50000, ATTEMPTS_PER_SECOND).seconds,
      explanation: `Your password has ${markovResistance}% resistance to Markov chain attacks. ${
        sequenceCount > 0
          ? `Contains ${sequenceCount} sequential patterns that reduce resistance.`
          : 'No obvious sequential patterns.'
      }`,
    },
    overallResistance: Math.round(overallResistance),
  };
}

function calculateDictionaryResistance(password: string, analysis: AnalysisResult): number {
  const commonWords = ['password', 'admin', 'letmein', 'welcome', 'monkey', 'dragon', '123456'];
  const lowerPassword = password.toLowerCase();

  // Check for common words
  const hasCommonWord = commonWords.some(word => lowerPassword.includes(word));
  if (hasCommonWord) return 30;

  // Check if mostly alphabetic (more dictionary-like)
  const alphaPercentage = (password.match(/[a-zA-Z]/g) || []).length / password.length;
  if (alphaPercentage > 0.9) return 50;

  // Check for mixed character types (less dictionary-like)
  const hasNumber = /\d/.test(password);
  const hasSpecial = /[!@#$%^&*()\-_+=\[\]{};:'",.<>?]/.test(password);

  let resistance = 80;
  if (!hasNumber) resistance -= 15;
  if (!hasSpecial) resistance -= 10;

  return Math.max(50, resistance);
}

function calculateFrequencyAnalysisResistance(password: string): number {
  const chars = password.split('');
  const freq = new Map<string, number>();

  chars.forEach(char => {
    freq.set(char, (freq.get(char) || 0) + 1);
  });

  // Calculate entropy of character distribution
  let entropy = 0;
  const total = chars.length;
  freq.forEach(count => {
    const probability = count / total;
    entropy -= probability * Math.log2(probability);
  });

  // Normalize to 0-100
  const maxEntropy = Math.log2(Math.min(chars.length, 26));
  const normalizedEntropy = (entropy / maxEntropy) * 100;

  return Math.min(95, Math.max(40, normalizedEntropy));
}

function estimateCharsetSize(password: string): number {
  let size = 0;
  if (/[a-z]/.test(password)) size += 26;
  if (/[A-Z]/.test(password)) size += 26;
  if (/\d/.test(password)) size += 10;
  if (/[!@#$%^&*()\-_+=\[\]{};:'",.<>?]/.test(password)) size += 32;

  return Math.max(26, size);
}

interface TimeEstimate {
  time: string;
  seconds: number;
}

function estimateTime(possibilities: number, attemptsPerSecond: number): TimeEstimate {
  // Average is half the total possibilities (birthday paradox)
  const averageAttempts = possibilities / 2;
  const seconds = averageAttempts / attemptsPerSecond;

  if (seconds < 1) return { time: 'Less than 1 second', seconds: 0 };
  if (seconds < 60) return { time: `${Math.round(seconds)} seconds`, seconds };
  if (seconds < 3600) return { time: `${Math.round(seconds / 60)} minutes`, seconds };
  if (seconds < 86400) return { time: `${Math.round(seconds / 3600)} hours`, seconds };
  if (seconds < 31536000) return { time: `${Math.round(seconds / 86400)} days`, seconds };

  const years = seconds / 31536000;
  if (years < 1000) return { time: `${Math.round(years)} years`, seconds };
  if (years < 1000000) return { time: `${Math.round(years / 1000)}k years`, seconds };
  if (years < 1000000000) return { time: `${Math.round(years / 1000000)}M years`, seconds };

  return { time: 'Infeasible (10B+ years)', seconds };
}

export function getAttackVulnerabilities(analysis: AdversarialAnalysis): string[] {
  const vulnerabilities: string[] = [];

  if (analysis.dictionaryAttack.resistancePercentage < 70) {
    vulnerabilities.push('Vulnerable to dictionary attacks');
  }
  if (analysis.keyboardWalkAttack.resistancePercentage < 70) {
    vulnerabilities.push('Contains keyboard walk patterns');
  }
  if (analysis.frequencyAnalysis.resistancePercentage < 60) {
    vulnerabilities.push('Uneven character frequency');
  }
  if (analysis.markovChain.resistancePercentage < 70) {
    vulnerabilities.push('Predictable character sequences');
  }

  return vulnerabilities.length > 0 ? vulnerabilities : ['No major vulnerabilities detected'];
}
