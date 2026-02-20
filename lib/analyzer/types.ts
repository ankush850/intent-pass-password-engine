/**
 * Core types for the IntentPass password analyzer
 */

export interface SegmentationResult {
  segments: Segment[];
  totalSegments: number;
}

export interface Segment {
  text: string;
  type: 'alpha' | 'digit' | 'symbol' | 'mixed';
  length: number;
  entropy: number;
  isWeakWord: boolean;
}

export interface PredictabilityAnalysis {
  hasAlphabeticalSequence: boolean;
  alphabeticalSequences: string[];
  hasNumericSequence: boolean;
  numericSequences: string[];
  hasKeyboardPattern: boolean;
  keyboardPatterns: string[];
  hasWeakSubstring: boolean;
  weakSubstrings: string[];
  predictabilityScore: number;
}

export interface RandomSmashAnalysis {
  vowelToConsonantRatio: number;
  pronounceability: number;
  adjacencyRandomness: number;
  isRandomSmash: boolean;
  randomSmashScore: number;
}

export interface AmbiguityAnalysis {
  confusableCount: number;
  totalAmbiguousChars: number;
  ambiguityRatio: number;
  ambiguityScore: number;
}

export interface EntropyAnalysis {
  hasConsecutiveRepetition: boolean;
  repetitionPatterns: string[];
  characterClassDistribution: {
    uppercase: number;
    lowercase: number;
    digits: number;
    symbols: number;
  };
  balanceScore: number;
  entropyValue: number;
}

export interface ComponentScores {
  structuralCoherence: number;
  predictabilityPenalty: number;
  randomSmashPenalty: number;
  entropyBalance: number;
  visualAmbiguity: number;
}

export interface PasswordAnalysisResult {
  password: string;
  length: number;
  overallScore: number;
  componentScores: ComponentScores;
  intentionalityIndex: number;
  intentionalityCategory: 'structured' | 'hack' | 'chaotic';
  segmentation: SegmentationResult;
  predictability: PredictabilityAnalysis;
  randomSmash: RandomSmashAnalysis;
  ambiguity: AmbiguityAnalysis;
  entropy: EntropyAnalysis;
  diagnostics: Diagnostic[];
}

export interface Diagnostic {
  type: 'warning' | 'strength' | 'neutral';
  message: string;
  pattern?: string;
}
