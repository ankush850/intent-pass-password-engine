import { PasswordAnalysisResult } from './types';

export enum PasswordCategory {
  VERY_WEAK = 'VERY_WEAK',
  WEAK = 'WEAK',
  FAIR = 'FAIR',
  GOOD = 'GOOD',
  STRONG = 'STRONG',
  VERY_STRONG = 'VERY_STRONG',
}

export interface SystemResult {
  system: string;
  score: number;
  category: PasswordCategory;
  passes: string[];
  failures: string[];
  explanation: string;
}

export interface BenchmarkComparison {
  password: string;
  intentpass: SystemResult;
  ruleBased: SystemResult;
  zxcvbn: SystemResult;
  comparison: {
    intentpassAdvantage: string;
    keyDifferences: string[];
  };
}

// Rule-based validator (traditional approach)
function evaluateRuleBased(password: string): SystemResult {
  const passes: string[] = [];
  const failures: string[] = [];
  let score = 0;

  // Length check
  if (password.length >= 8) {
    passes.push('At least 8 characters');
    score += 20;
  } else {
    failures.push('Less than 8 characters');
  }

  if (password.length >= 12) {
    passes.push('At least 12 characters');
    score += 10;
  }

  // Uppercase check
  if (/[A-Z]/.test(password)) {
    passes.push('Contains uppercase letter');
    score += 15;
  } else {
    failures.push('No uppercase letters');
  }

  // Lowercase check
  if (/[a-z]/.test(password)) {
    passes.push('Contains lowercase letter');
    score += 15;
  } else {
    failures.push('No lowercase letters');
  }

  // Number check
  if (/\d/.test(password)) {
    passes.push('Contains number');
    score += 15;
  } else {
    failures.push('No numbers');
  }

  // Special character check
  if (/[!@#$%^&*()_+\-=\[\]{};:'",.<>?]/.test(password)) {
    passes.push('Contains special character');
    score += 15;
  } else {
    failures.push('No special characters');
  }

  // Diversity check
  if (password.length >= 16) {
    passes.push('Exceeds minimum length');
    score += 10;
  }

  const category = getCategory(score);

  return {
    system: 'Rule-Based Validator',
    score,
    category,
    passes,
    failures,
    explanation: `Traditional validator checks compliance with password composition rules. Score: ${score}/100. ${
      failures.length > 0
        ? `Failures: ${failures.join(', ')}`
        : 'Passes all basic requirements.'
    }`,
  };
}

// Simplified zxcvbn-like scoring (entropy + pattern analysis)
function evaluateZxcvbn(password: string, analysis: PasswordAnalysisResult): SystemResult {
  const passes: string[] = [];
  const failures: string[] = [];
  let score = 0;

  // Entropy-based scoring
  const entropy = analysis.entropy.entropyValue;
  if (entropy >= 50) {
    passes.push('Strong entropy');
    score += 30;
  } else if (entropy >= 40) {
    passes.push('Moderate entropy');
    score += 20;
  } else {
    failures.push('Low entropy');
  }

  // Pattern matching
  if (!analysis.predictability.hasAlphabeticalSequence && !analysis.predictability.hasNumericSequence) {
    passes.push('No sequential patterns');
    score += 15;
  } else {
    failures.push('Contains sequences');
  }

  if (!analysis.predictability.hasKeyboardPattern) {
    passes.push('No keyboard walks');
    score += 15;
  } else {
    failures.push('Contains keyboard walks');
  }

  // Length scoring (lenient)
  if (password.length >= 8) {
    passes.push('Sufficient length');
    score += 20;
  }

  if (password.length >= 20) {
    passes.push('Very long password');
    score += 10;
  }

  // Character variety
  const types = [
    /[a-z]/.test(password),
    /[A-Z]/.test(password),
    /\d/.test(password),
    /[!@#$%^&*()_+\-=\[\]{};:'",.<>?]/.test(password),
  ].filter(Boolean).length;

  if (types >= 3) {
    passes.push('Good character variety');
    score += 10;
  } else {
    failures.push('Limited character types');
  }

  const category = getCategory(score);

  return {
    system: 'zxcvbn-like',
    score,
    category,
    passes,
    failures,
    explanation: `Entropy and pattern-based analysis similar to zxcvbn. Score: ${score}/100. Focuses on entropy and common patterns rather than composition rules.`,
  };
}

function getCategory(score: number): PasswordCategory {
  if (score >= 90) return PasswordCategory.VERY_STRONG;
  if (score >= 75) return PasswordCategory.STRONG;
  if (score >= 60) return PasswordCategory.GOOD;
  if (score >= 45) return PasswordCategory.FAIR;
  if (score >= 25) return PasswordCategory.WEAK;
  return PasswordCategory.VERY_WEAK;
}

export function createBenchmark(
  password: string,
  analysis: PasswordAnalysisResult,
  intentpassScore: number
): BenchmarkComparison {
  const ruleBased = evaluateRuleBased(password);
  const zxcvbn = evaluateZxcvbn(password, analysis);

  const intentpass: SystemResult = {
    system: 'IntentPass',
    score: Math.round(intentpassScore),
    category: getCategory(intentpassScore),
    passes: !analysis.predictability.hasAlphabeticalSequence && !analysis.predictability.hasNumericSequence ? ['No sequences'] : [],
    failures: [],
    explanation: `IntentPass analyzes structural coherence and intentionality beyond traditional metrics. Score: ${Math.round(intentpassScore)}/100.`,
  };

  // Add to passes/failures based on analysis
  if (analysis.entropy.entropyValue >= 60) {
    intentpass.passes.push('High entropy');
  } else {
    intentpass.failures.push('Moderate entropy');
  }

  if (analysis.intentionalityIndex >= 0.6) {
    intentpass.passes.push('High intentionality');
  } else {
    intentpass.failures.push('Low intentionality');
  }

  // Generate key differences
  const keyDifferences: string[] = [];

  const scoreDiff = intentpass.score - ruleBased.score;
  if (scoreDiff > 10) {
    keyDifferences.push('IntentPass rates structural coherence higher than rule compliance');
  } else if (scoreDiff < -10) {
    keyDifferences.push('Rule-based validator more lenient on password composition');
  }

  if (
    ruleBased.category === PasswordCategory.STRONG &&
    intentpass.category === PasswordCategory.FAIR
  ) {
    keyDifferences.push('Password meets compliance rules but lacks true intentionality');
  }

  if (analysis.predictability.hasAlphabeticalSequence || analysis.predictability.hasNumericSequence) {
    keyDifferences.push('IntentPass penalizes predictable patterns; others focus on composition');
  }

  const intentpassAdvantage =
    intentpass.score > ruleBased.score && intentpass.score > zxcvbn.score
      ? 'IntentPass identifies intentionality and structure that other systems miss'
      : 'Different systems emphasize different security aspects';

  return {
    password,
    intentpass,
    ruleBased,
    zxcvbn,
    comparison: {
      intentpassAdvantage,
      keyDifferences,
    },
  };
}
