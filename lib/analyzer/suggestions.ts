import { PasswordAnalysisResult } from './types';
import { BehavioralClass } from './classifier';

export interface Suggestion {
  id: string;
  title: string;
  description: string;
  example: string;
  impact: 'high' | 'medium' | 'low';
  category: 'structure' | 'entropy' | 'pattern' | 'memorability';
}

export function generateSuggestions(
  password: string,
  analysis: PasswordAnalysisResult,
  classification: BehavioralClass
): Suggestion[] {
  const suggestions: Suggestion[] = [];

  // Check for sequences and suggest replacements
  if (analysis.predictability.hasAlphabeticalSequence) {
    suggestions.push({
      id: 'sequence-replace',
      title: 'Replace Alphabetical Sequences',
      description: 'Your password contains sequential letters (like "abc" or "xyz") that are easily guessable.',
      example: `Replace "abc" with "a8c" or "a@c" using substitutions`,
      impact: 'high',
      category: 'pattern',
    });
  }

  // Check for keyboard walks
  if (analysis.predictability.hasKeyboardPattern) {
    suggestions.push({
      id: 'keyboard-walks',
      title: 'Avoid Keyboard Walks',
      description: 'Adjacent keys on your keyboard (like "qwerty" or "asdf") are common attack patterns.',
      example: `Replace "qwerty" with "qx#werty" to break the pattern`,
      impact: 'high',
      category: 'pattern',
    });
  }

  // Check entropy levels
  if (analysis.entropy.entropyValue < 40) {
    suggestions.push({
      id: 'add-entropy',
      title: 'Increase Entropy & Randomness',
      description: 'Your password lacks sufficient randomness. Mix character types to increase entropy.',
      example: `Add numbers, symbols, or mix case: "Pass123!" instead of "Password"`,
      impact: 'high',
      category: 'entropy',
    });
  }

  // Check for repeating characters
  const repeatPattern = /(.)\1{2,}/;
  if (repeatPattern.test(password)) {
    suggestions.push({
      id: 'reduce-repetition',
      title: 'Reduce Repeating Characters',
      description: 'Repeated characters (like "aaa" or "111") reduce entropy and intentionality.',
      example: `Replace "aaa" with "a9a" or use variation instead`,
      impact: 'medium',
      category: 'entropy',
    });
  }

  // Check for common substitutions that are weak
  const commonSubs = /[!@#$%]|[0o]/i;
  if (commonSubs.test(password)) {
    suggestions.push({
      id: 'strong-substitution',
      title: 'Use Stronger Character Substitutions',
      description: 'Common replacements like "0" for "O" or "!" for "I" are well-known to attackers.',
      example: `Use less obvious substitutions: "P@ssw0rd" → "Pλ55w□rd"`,
      impact: 'low',
      category: 'entropy',
    });
  }

  // Check for low character variety
  const hasLower = /[a-z]/.test(password);
  const hasUpper = /[A-Z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
  const charTypes = [hasLower, hasUpper, hasNumber, hasSpecial].filter(Boolean).length;

  if (charTypes < 3) {
    suggestions.push({
      id: 'char-variety',
      title: 'Use More Character Types',
      description: `You're using only ${charTypes} character type(s). Mix uppercase, lowercase, numbers, and symbols.`,
      example: `Combine types: "password123!@#" includes all four character classes`,
      impact: 'high',
      category: 'entropy',
    });
  }

  // Suggestions based on classification
  if (classification === BehavioralClass.RANDOM) {
    suggestions.push({
      id: 'add-structure',
      title: 'Add Intentional Structure',
      description: 'While random, your password lacks memorable structure. Consider mixing in words.',
      example: `"aB7$mK9#" → "aB7$-mKey-9#" (adds pattern for memory)`,
      impact: 'medium',
      category: 'memorability',
    });
  }

  if (classification === BehavioralClass.PASSPHRASE && password.length > 30) {
    suggestions.push({
      id: 'shorten-passphrase',
      title: 'Consider Shortening Your Passphrase',
      description: 'Your passphrase is quite long. Shorter versions can maintain security.',
      example: `"correct-horse-battery-staple" → "Correct-Horse-2@2024"`,
      impact: 'low',
      category: 'memorability',
    });
  }

  if (classification === BehavioralClass.COMPLIANCE_HACK) {
    suggestions.push({
      id: 'intentional-redesign',
      title: 'Redesign for Intentionality',
      description: 'Your password appears designed just for compliance. Make it intentionally strong.',
      example: `Instead of "Pass123!", try something with personal meaning: "JavaCat#2024"`,
      impact: 'high',
      category: 'structure',
    });
  }

  // Length recommendations
  if (password.length < 12) {
    suggestions.push({
      id: 'increase-length',
      title: 'Increase Password Length',
      description: 'Longer passwords are exponentially harder to crack.',
      example: `Aim for 14+ characters: "My@Secure#Pass2024"`,
      impact: 'high',
      category: 'structure',
    });
  }

  return suggestions.sort((a, b) => {
    const impactOrder = { high: 0, medium: 1, low: 2 };
    return impactOrder[a.impact] - impactOrder[b.impact];
  });
}

export function getRewriteExample(password: string, suggestion: Suggestion): string {
  // Generate contextual rewrite examples
  const examples: Record<string, string> = {
    'sequence-replace': createSequenceReplacement(password),
    'keyboard-walks': createKeyboardWalkFix(password),
    'add-entropy': createEntropyBoost(password),
    'reduce-repetition': createRepetitionFix(password),
    'char-variety': createCharVarietyFix(password),
    'add-structure': createStructureAddition(password),
    'increase-length': createLengthIncrease(password),
  };

  return examples[suggestion.id] || suggestion.example;
}

function createSequenceReplacement(password: string): string {
  return password
    .replace(/abc/gi, 'a8c')
    .replace(/def/gi, 'd3f')
    .replace(/xyz/gi, 'x9z')
    .replace(/123/g, '1!3')
    .substring(0, password.length + 2);
}

function createKeyboardWalkFix(password: string): string {
  return password
    .replace(/qwerty/gi, 'qx#werty')
    .replace(/asdf/gi, 'a$df')
    .replace(/zxcv/gi, 'z&cv')
    .substring(0, password.length + 2);
}

function createEntropyBoost(password: string): string {
  const special = '!@#$%^&*';
  const randomIndex = Math.floor(Math.random() * special.length);
  return password + special[randomIndex] + Math.floor(Math.random() * 10);
}

function createRepetitionFix(password: string): string {
  return password.replace(/(.)\1{2,}/g, (match) => {
    return match[0] + '9' + match[0];
  });
}

function createCharVarietyFix(password: string): string {
  let result = password;
  if (!/[A-Z]/.test(result)) result += 'A';
  if (!/[a-z]/.test(result)) result += 'a';
  if (!/\d/.test(result)) result += '9';
  if (!/[!@#$%]/.test(result)) result += '!';
  return result;
}

function createStructureAddition(password: string): string {
  return password.substring(0, password.length - 1) + '-' + password.substring(password.length - 1);
}

function createLengthIncrease(password: string): string {
  return password + 'X' + new Date().getFullYear().toString().slice(-2);
}
