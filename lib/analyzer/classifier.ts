import { PasswordAnalysisResult } from './types';

export enum BehavioralClass {
  PREDICTABLE = 'PREDICTABLE',
  RANDOM = 'RANDOM',
  PASSPHRASE = 'PASSPHRASE',
  COMPLIANCE_HACK = 'COMPLIANCE_HACK',
  BALANCED = 'BALANCED',
}

export interface ClassificationResult {
  classification: BehavioralClass;
  confidence: number;
  explanation: string;
  likelihood: {
    predictable: number;
    random: number;
    passphrase: number;
    complianceHack: number;
    balanced: number;
  };
}

export function classifyPassword(password: string, analysis: PasswordAnalysisResult): ClassificationResult {
  const scores = {
    predictable: 0,
    random: 0,
    passphrase: 0,
    complianceHack: 0,
    balanced: 0,
  };

  // Analyze password characteristics
  const hasSpaces = /\s/.test(password);
  const hasAlphabeticalSequences = analysis.predictability.hasAlphabeticalSequence;
  const hasNumericSequences = analysis.predictability.hasNumericSequence;
  const hasKeyboardWalks = analysis.predictability.hasKeyboardPattern;
  const entropyValue = analysis.entropy.entropyValue;
  const highEntropy = entropyValue > 60;
  const lowEntropy = entropyValue < 40;
  const hasUpperAndLower = /[A-Z]/.test(password) && /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
  const length = password.length;

  // Passphrase detection (words separated by spaces/hyphens)
  if (hasSpaces || /[\s\-_]/.test(password)) {
    const wordPattern = password.split(/[\s\-_]+/).filter(w => w.length > 2);
    if (wordPattern.length >= 3) {
      scores.passphrase += 40;
      if (highEntropy) scores.passphrase += 20;
    }
  }

  // Predictable detection (sequences and keyboard walks)
  if (hasAlphabeticalSequences || hasNumericSequences || hasKeyboardWalks) {
    scores.predictable += 30;
    if (lowEntropy) scores.predictable += 20;
  }

  // Random detection (high entropy, no clear structure)
  if (highEntropy && !hasSpaces && !hasAlphabeticalSequences && !hasNumericSequences && !hasKeyboardWalks) {
    scores.random += 35;
    if (!hasUpperAndLower && !hasNumbers) scores.random += 15; // All lowercase random
  }

  // Compliance hack detection (meets basic requirements but no intentionality)
  if (hasUpperAndLower && hasNumbers && (hasSpecial || length >= 12)) {
    if (analysis.intentionalityIndex < 0.3) {
      scores.complianceHack += 30;
    }
  }

  // Balanced detection (good mix without being extreme)
  if (!hasAlphabeticalSequences && !hasNumericSequences && !hasKeyboardWalks && !hasSpaces) {
    if (hasUpperAndLower && (hasNumbers || hasSpecial)) {
      if (entropyValue >= 40 && entropyValue <= 70) {
        scores.balanced += 35;
      }
    }
  }

  // Normalize scores
  const total = Object.values(scores).reduce((a, b) => a + b, 0);
  const normalized = total > 0
    ? Object.fromEntries(
        Object.entries(scores).map(([k, v]) => [k, (v / total) * 100])
      )
    : { predictable: 20, random: 20, passphrase: 20, complianceHack: 20, balanced: 20 };

  // Determine primary classification
  let classification = BehavioralClass.BALANCED;
  let maxScore = normalized.balanced;

  Object.entries(normalized).forEach(([key, score]) => {
    if (score > maxScore) {
      maxScore = score;
      classification = key.toUpperCase().replace('_', '_') as BehavioralClass;
    }
  });

  const explanations: Record<BehavioralClass, string> = {
    [BehavioralClass.PREDICTABLE]: 'Contains predictable patterns like sequences or keyboard walks that attackers commonly target.',
    [BehavioralClass.RANDOM]: 'Appears to be randomly generated characters with high entropy but lacks structural intentionality.',
    [BehavioralClass.PASSPHRASE]: 'Uses multiple words separated by spaces or hyphens, creating memorable yet secure passwords.',
    [BehavioralClass.COMPLIANCE_HACK]: 'Meets basic security rules but lacks true intentionality—likely created to satisfy requirements.',
    [BehavioralClass.BALANCED]: 'Well-designed password with intentional structure, good entropy, and resistance to common attacks.',
  };

  return {
    classification,
    confidence: Math.round(maxScore),
    explanation: explanations[classification],
    likelihood: {
      predictable: Math.round(normalized.predictable),
      random: Math.round(normalized.random),
      passphrase: Math.round(normalized.passphrase),
      complianceHack: Math.round(normalized.complianceHack),
      balanced: Math.round(normalized.balanced),
    },
  };
}
